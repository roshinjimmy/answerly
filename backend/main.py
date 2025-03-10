# filepath: c:\answerly\backend\main.py
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import io
from PIL import Image
import pytesseract
import logging
import os

app = FastAPI()

# Enable CORS for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend requests
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set the Tesseract executable path
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    """
    Processes the uploaded file, extracts text using OCR, and sends it to the frontend.
    """
    try:
        # Read file into memory
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # Perform OCR using Tesseract
        extracted_text = pytesseract.image_to_string(image)

        return {"message": "OCR completed", "extracted_text": extracted_text}

    except Exception as e:
        logging.error(f"OCR processing failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")