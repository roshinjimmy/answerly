from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import io
from PIL import Image
import logging
import os
from google.cloud import vision
import json
import boto3
from datetime import datetime

# Initialize FastAPI
app = FastAPI()

# Enable CORS for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend requests
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Google Cloud credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./aerial-vehicle-453306-h5-c1c866d1a4f3.json"

# Initialize Vision API client
vision_client = vision.ImageAnnotatorClient()

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb', region_name='eu-north-1')
table = dynamodb.Table('ExtractedText')

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    """
    Processes the uploaded file, extracts text using Google Cloud Vision API, and sends it to the frontend.
    """
    try:
        # Read file into memory
        image_bytes = await file.read()

        # Convert image to base64 format
        image = vision.Image(content=image_bytes)

        # Perform text detection
        response = vision_client.text_detection(image=image)
        text_annotations = response.text_annotations

        if not text_annotations:
            return {"message": "No text detected", "extracted_text": ""}

        extracted_text = text_annotations[0].description  # Extract detected text

        # Store the results in DynamoDB
        response = table.put_item(
            Item={
                'id': file.filename,
                'text': extracted_text,
                'timestamp': datetime.utcnow().isoformat()
            }
        )

        return {"message": "OCR completed", "extracted_text": extracted_text}

    except Exception as e:
        logging.error(f"OCR processing failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")

@app.get("/fetch/")
async def fetch_data():
    """
    Fetches the data from DynamoDB and returns it.
    """
    try:
        response = table.scan()
        items = response.get('Items', [])
        return {"data": items}

    except Exception as e:
        logging.error(f"Fetching data failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Fetching data failed: {str(e)}")