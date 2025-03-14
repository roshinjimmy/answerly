# filepath: c:\answerly\preprocess.py
import cv2
import numpy as np
from PIL import Image
import pytesseract

# Set the Tesseract executable path
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Load the image
image_path = "answer2.jpg"
image = cv2.imread(image_path, cv2.IMREAD_COLOR)

# Convert to grayscale
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Apply GaussianBlur to reduce noise
blurred = cv2.GaussianBlur(gray, (5, 5), 0)

# Use adaptive thresholding to get a black & white effect
binary = cv2.adaptiveThreshold(
    blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
)

# Denoise to improve OCR accuracy
denoised = cv2.fastNlMeansDenoising(binary, h=30)

# Sharpen the image to make text clearer
kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
sharpened = cv2.filter2D(denoised, -1, kernel)

# Save for testing
cv2.imwrite("processed1.jpg", sharpened)

# Convert to PIL format for OCR
image_pil = Image.fromarray(sharpened)

# Run OCR on preprocessed image
text = pytesseract.image_to_string(image_pil)
print("Extracted Text:\n", text)