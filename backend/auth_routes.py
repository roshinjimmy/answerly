from fastapi import APIRouter, HTTPException
import boto3
import hashlib
import uuid
from pydantic import BaseModel
from typing import Optional
import logging

router = APIRouter()

# DynamoDB setup
dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
table_name = 'EduEvalUsers'

# Get the table reference
users_table = dynamodb.Table(table_name)

# Models
class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: str
    class_name: Optional[str] = None  # Added class column
    roll_no: Optional[str] = None     # Added roll number column

class UserLogin(BaseModel):
    email: str
    password: str
    role: str  # Added role for composite key lookup

# Helper function to hash passwords
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@router.post("/api/register")
async def register_user(user: UserRegister):
    try:
        # Check if user already exists using the composite key
        try:
            response = users_table.get_item(
                Key={
                    'email': user.email,
                    'role': user.role
                }
            )
            
            if 'Item' in response:
                return {"success": False, "message": "User with this email and role already exists"}
        except Exception as e:
            logging.error(f"Error checking existing user: {str(e)}")
            # Continue with registration attempt
        
        # Create new user
        user_id = str(uuid.uuid4())
        hashed_password = hash_password(user.password)
        
        new_user = {
            'id': user_id,
            'name': user.name,
            'email': user.email,  # Partition key
            'role': user.role,    # Sort key
            'password': hashed_password,
            'class_name': user.class_name,  # Added class column
            'roll_no': user.roll_no         # Added roll number column
        }
        
        # Save to DynamoDB
        users_table.put_item(Item=new_user)
        
        return {
            "success": True,
            "message": "User registered successfully",
            "user": {
                "id": user_id,
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        }
    except Exception as e:
        logging.error(f"Registration error: {str(e)}")
        return {"success": False, "message": f"Registration failed: {str(e)}"}

@router.post("/api/login")
async def login_user(user: UserLogin):
    try:
        # Get user from DynamoDB using the composite key
        try:
            response = users_table.get_item(
                Key={
                    'email': user.email,
                    'role': user.role
                }
            )
            
            if 'Item' not in response:
                return {"success": False, "message": "Invalid email or password"}
                
            item = response['Item']
        except Exception as e:
            logging.error(f"Error retrieving user: {str(e)}")
            return {"success": False, "message": "Invalid email or password"}
        
        # Check password
        hashed_password = hash_password(user.password)
        
        if item['password'] == hashed_password:
            return {
                "success": True,
                "message": "Login successful",
                "user": {
                    "id": item['id'],
                    "name": item['name'],
                    "email": item['email'],
                    "role": item['role'],
                    "class_name": item.get('class_name', None),  # Added class column
                    "roll_no": item.get('roll_no', None)         # Added roll number column
                }
            }
        
        return {"success": False, "message": "Invalid email or password"}
    except Exception as e:
        logging.error(f"Login error: {str(e)}")
        return {"success": False, "message": f"Login failed: {str(e)}"}

@router.put("/api/users/{user_id}")
async def update_user(user_id: str, updated_data: dict):
    try:
        # Fetch the user by ID
        response = users_table.scan(
            FilterExpression="id = :user_id",
            ExpressionAttributeValues={":user_id": user_id},
        )
        if not response.get("Items"):
            raise HTTPException(status_code=404, detail="User not found")

        user = response["Items"][0]

        # Ensure the original email and role keys are preserved
        updated_user = {
            **user,
            **updated_data,
            "email": user["email"],  # Preserve original email
            "role": user["role"],    # Preserve original role
        }

        # Update user data in DynamoDB
        users_table.put_item(Item=updated_user)

        return {"success": True, "message": "User updated successfully"}
    except Exception as e:
        logging.error(f"Error updating user: {str(e)}")
        return {"success": False, "message": f"Failed to update user: {str(e)}"}

@router.get("/api/students")
async def get_students():
    try:
        # Use an expression attribute name for "role" to avoid conflicts with reserved keywords
        response = users_table.scan(
            FilterExpression="#role = :role",
            ExpressionAttributeNames={"#role": "role"},  # Map #role to the actual attribute name
            ExpressionAttributeValues={":role": "student"}
        )
        students = response.get("Items", [])
        for student in students:
            student["class_name"] = student.get("class_name", "N/A")  # Ensure class_name is included
            student["roll_no"] = student.get("roll_no", "N/A")        # Ensure roll_no is included
        logging.info(f"Fetched students: {students}")  # Log the fetched students
        return {"success": True, "students": students}
    except Exception as e:
        logging.error(f"Error fetching students: {str(e)}")
        return {"success": False, "message": f"Failed to fetch students: {str(e)}"}