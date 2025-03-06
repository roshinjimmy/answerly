from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer, util
from PIL import Image
import pytesseract
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your needs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Semantic analysis model setup
sbert_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# Reference answer for comparison
reference_answer = "This is the reference answer for comparison."

@app.get("/")
async def root():
    return {"message": "Welcome to the OCR and Semantic Analysis API"}

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    file_path = f"temp/{file.filename}"
    
    # Save the file temporarily
    with open(file_path, "wb") as f:
        f.write(contents)
    
    # Perform OCR using pytesseract
    image = Image.open(file_path)
    extracted_text = pytesseract.image_to_string(image)
    
    # Perform semantic analysis
    reference_embedding = sbert_model.encode(reference_answer, convert_to_tensor=True)
    answer_embedding = sbert_model.encode(extracted_text, convert_to_tensor=True)
    cosine_similarity = util.pytorch_cos_sim(reference_embedding, answer_embedding).item()
    
    # Remove the temporary file
    os.remove(file_path)
    
    return JSONResponse(content={
        "filename": file.filename,
        "ocr_results": extracted_text,
        "cosine_similarity": cosine_similarity
    })

@app.get("/results/")
async def get_results():
    # This is a placeholder for fetching results from a database or storage
    # Replace with actual implementation
    results = [
        {"filename": "example.jpg", "ocr_results": "Sample OCR text", "cosine_similarity": 0.85}
    ]
    return JSONResponse(content=results)