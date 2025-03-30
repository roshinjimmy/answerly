import os
from sentence_transformers import SentenceTransformer, InputExample, losses, util
from torch.utils.data import DataLoader
import pandas as pd

# Load pre-trained SBERT model
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# Load training data (CSV file with 'student_answer', 'reference_answer', 'similarity_score')
data_path = "training_data.csv"  # Ensure the CSV is in the backend folder
df = pd.read_csv(data_path)

# Validate required columns in the CSV
required_columns = {'student_answer', 'reference_answer', 'similarity_score'}
if not required_columns.issubset(df.columns):
    missing_columns = required_columns - set(df.columns)
    raise ValueError(f"The following required columns are missing in the CSV file: {missing_columns}")

# Prepare training examples
train_samples = [InputExample(texts=[row['student_answer'], row['reference_answer']], label=row['similarity_score'])
                 for _, row in df.iterrows()]

# Create DataLoader
train_dataloader = DataLoader(train_samples, shuffle=True, batch_size=8)

# Define loss function
train_loss = losses.CosineSimilarityLoss(model)

# Train the model
model.fit(train_objectives=[(train_dataloader, train_loss)],
          epochs=4,    
          warmup_steps=100)

# Save the fine-tuned model inside the backend folder
output_dir = "model/fine_tuned_sbert"
os.makedirs(output_dir, exist_ok=True)
model.save(output_dir)

# Calculate accuracy on the training data
correct_predictions = 0
for _, row in df.iterrows():
    student_answer = row['student_answer']
    reference_answer = row['reference_answer']
    true_score = row['similarity_score']
    
    embedding1 = model.encode(student_answer, convert_to_tensor=True)
    embedding2 = model.encode(reference_answer, convert_to_tensor=True)
    predicted_score = util.pytorch_cos_sim(embedding1, embedding2).item()
    
    # Consider a prediction correct if the difference is within a threshold (e.g., 0.1)
    if abs(predicted_score - true_score) <= 0.1:
        correct_predictions += 1

accuracy = correct_predictions / len(df) * 100
print(f"Training Accuracy: {accuracy:.2f}%")

print(f"Fine-tuned model saved at {output_dir}")
