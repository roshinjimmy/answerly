from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import logging
from sentence_transformers import SentenceTransformer, util
from google.cloud import vision
import json

# Initialize FastAPI
app = FastAPI()

# Enable CORS for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Allow frontend requests
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Google Cloud credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./aerial-vehicle-453306-h5-c1c866d1a4f3.json"

# Initialize Vision API client
vision_client = vision.ImageAnnotatorClient()

# Load SBERT Model for Semantic Similarity
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

def extract_text_from_image(image_bytes):
    """Extracts text from an uploaded image using Google Cloud Vision API."""
    try:
        image = vision.Image(content=image_bytes)
        response = vision_client.text_detection(image=image)
        text_annotations = response.text_annotations
        return text_annotations[0].description if text_annotations else ""
    except Exception as e:
        logging.error(f"Text extraction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Text extraction failed: {str(e)}")

@app.post("/evaluate/")
async def evaluate_answers(reference_file: UploadFile = File(...), answer_file: UploadFile = File(...)):
    """
    Evaluates the student's answer against the reference answer using semantic similarity.
    """
    try:
        # Extract text from images
        reference_text = extract_text_from_image(await reference_file.read())
        answer_text = extract_text_from_image(await answer_file.read())

        if not reference_text or not answer_text:
            return {"message": "Text extraction failed or no text found"}

        # Compute embeddings
        ref_embedding = model.encode(reference_text, convert_to_tensor=True)
        ans_embedding = model.encode(answer_text, convert_to_tensor=True)

        # Compute cosine similarity
        similarity_score = util.pytorch_cos_sim(ref_embedding, ans_embedding).item()

        # Convert similarity score to marks (assuming 100 is full marks)
        marks_obtained = round(similarity_score * 100, 2)

        return {
            "reference_text": reference_text,
            "answer_text": answer_text,
            "similarity_score": similarity_score,
            "marks_obtained": marks_obtained
        }

    except Exception as e:
        logging.error(f"Evaluation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")

@app.post("/api/upload/")
async def upload_file(file: UploadFile = File(...)):
    """
    Endpoint to upload a file and return its extracted text.
    """
    try:
        # Extract text from the uploaded file
        file_content = await file.read()
        extracted_text = extract_text_from_image(file_content)

        if not extracted_text:
            return {"message": "No text found in the uploaded file"}

        return {"extracted_text": extracted_text}

    except Exception as e:
        logging.error(f"File upload failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

@app.get("/fetch/")
async def fetch_data():
    """
    A simple endpoint to test connectivity.
    """
    return {"message": "Fetch endpoint is working!"}


# Add this import at the top with your other imports
from auth_routes import router as auth_router

# Add this line after initializing your FastAPI app
app.include_router(auth_router)
