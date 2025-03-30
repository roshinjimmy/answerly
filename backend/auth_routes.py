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
            'password': hashed_password
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
                    "role": item['role']
                }
            }
        
        return {"success": False, "message": "Invalid email or password"}
    except Exception as e:
        logging.error(f"Login error: {str(e)}")
        return {"success": False, "message": f"Login failed: {str(e)}"}