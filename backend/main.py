import os
import logging
import json
import io
import PyPDF2
import google.generativeai as genai
import torch
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer, util
from google.cloud import vision
from typing import Literal
from pydantic import BaseModel

# Initialize FastAPI
app = FastAPI()

# Enable CORS for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Remove wildcard
    allow_credentials=False,  # Changed from True to False
    allow_methods=["*"],
    allow_headers=["*"],
)

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./aerial-vehicle-453306-h5-c1c866d1a4f3.json"

vision_client = vision.ImageAnnotatorClient()

sbert_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

GEMINI_API_KEY = "AIzaSyBDsbCZhJuuRxcnNeS5d9S8L_9CglI__fE"

# Initialize Gemini API
genai.configure(api_key=GEMINI_API_KEY)

# Define valid models
VALID_MODELS = ["sbert", "gemini"]

# Extract text from PDF or Image
def extract_text_from_file(file_bytes, content_type):
    """Extracts text from an uploaded file (PDF or image)."""
    try:
        if content_type.startswith('application/pdf'):
            # Process PDF file
            pdf_file = io.BytesIO(file_bytes)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            text = "\n".join([page.extract_text() for page in pdf_reader.pages if page.extract_text()])
            return text.strip()
        else:
            # Process image using Google Vision API
            image = vision.Image(content=file_bytes)
            response = vision_client.text_detection(image=image)
            return response.text_annotations[0].description if response.text_annotations else ""
    except Exception as e:
        logging.error(f"Text extraction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Text extraction failed: {str(e)}")

# Request model
class EvaluationRequest(BaseModel):
    model: Literal["sbert", "gemini"]

@app.post("/evaluate/")
async def evaluate_answers(
    reference_file: UploadFile = File(...),
    answer_file: UploadFile = File(...),
    model: str = Form(...)
):
    """
    Evaluates the student's answer against the reference answer using SBERT or Gemini.
    """
    try:
        if model not in VALID_MODELS:
            raise HTTPException(status_code=400, detail="Invalid model selected")

        # Extract text from files
        reference_text = extract_text_from_file(await reference_file.read(), reference_file.content_type)
        answer_text = extract_text_from_file(await answer_file.read(), answer_file.content_type)

        if not reference_text or not answer_text:
            raise HTTPException(status_code=400, detail="Text extraction failed or no text found")

        # Compute similarity
        if model == "sbert":
            ref_embedding = sbert_model.encode(reference_text, convert_to_tensor=True)
            ans_embedding = sbert_model.encode(answer_text, convert_to_tensor=True)
            similarity_score = util.pytorch_cos_sim(ref_embedding, ans_embedding).item()
        else:
            similarity_score = compare_texts_with_gemini(reference_text, answer_text)

        marks_obtained = round(similarity_score * 100, 2)

        return {
            "reference_text": reference_text,
            "answer_text": answer_text,
            "similarity_score": similarity_score,
            "marks_obtained": marks_obtained,
            "model_used": model.upper(),
        }

    except Exception as e:
        logging.error(f"Evaluation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")

def compare_texts_with_gemini(reference_text: str, answer_text: str) -> float:
    """
    Uses Gemini AI to evaluate text similarity.
    """
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        prompt = f"""
        Given these two texts, compute their similarity on a scale of 0 to 1:
        - 1 means identical meaning
        - 0 means completely unrelated

        Reference: {reference_text}
        Answer: {answer_text}

        Return only a decimal between 0 and 1.
        """

        response = model.generate_content(prompt)
        similarity_score = float(response.text.strip())

        return max(0.0, min(1.0, similarity_score))  # Keep score between 0 and 1

    except Exception as e:
        logging.error(f"Gemini API Error: {e}")
        return 0.0  # Default similarity if API fails

@app.post("/api/upload/")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a file and return extracted text.
    """
    try:
        extracted_text = extract_text_from_file(await file.read(), file.content_type)
        return {"extracted_text": extracted_text} if extracted_text else {"message": "No text found"}

    except Exception as e:
        logging.error(f"File upload failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

@app.get("/fetch/")
async def fetch_data():
    """
    Simple endpoint to test connectivity.
    """
    return {"message": "Fetch endpoint is working!"}

# Import auth routes and include in FastAPI
from auth_routes import router as auth_router
app.include_router(auth_router)
