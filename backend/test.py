import pandas as pd
from sentence_transformers import SentenceTransformer, util

# Load the fine-tuned SBERT model
model_path = "model/fine_tuned_sbert"
model = SentenceTransformer(model_path)

# Load test data from CSV
test_data_path = "testing_data.csv"  # Ensure the CSV is in the backend folder
df = pd.read_csv(test_data_path)

# Validate required columns in the CSV
required_columns = {'student_answer', 'reference_answer'}
if not required_columns.issubset(df.columns):
    missing_columns = required_columns - set(df.columns)
    raise ValueError(f"The following required columns are missing in the CSV file: {missing_columns}")

# Evaluate similarity scores
print("Testing fine-tuned SBERT model...\n")
for i, row in df.iterrows():
    student_answer = row['student_answer']
    reference_answer = row['reference_answer']
    
    embedding1 = model.encode(student_answer, convert_to_tensor=True)
    embedding2 = model.encode(reference_answer, convert_to_tensor=True)
    similarity_score = util.pytorch_cos_sim(embedding1, embedding2).item()
    
    print(f"Test Case {i+1}:")
    print(f"Student Answer: {student_answer}")
    print(f"Reference Answer: {reference_answer}")
    print(f"Similarity Score: {similarity_score:.4f}\n")
