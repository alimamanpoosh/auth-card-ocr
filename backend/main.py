import os
import cv2
import torch
from ultralytics import YOLO
from hezar.models import Model
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np

# Create a Flask application
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define the upload folder
UPLOAD_FOLDER = 'backend/uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load the YOLO model
# Ensure this path is correct
try:
    model = YOLO('backend/Yolo9c_fineTuned_textDetection.pt')
except Exception as e:
    # If the model fails to load, create a dummy model to avoid crashing the app
    # This allows the developer to run the app and see the error message
    model = None
    print(f"Error loading YOLO model: {e}")
    print("Please make sure the model file 'backend/Yolo9c_fineTuned_textDetection.pt' is correct.")


# Load the Hezar OCR model
try:
    ocr_model = Model.load("hezarai/crnn-fa-printed-96-long")
except Exception as e:
    ocr_model = None
    print(f"Error loading Hezar model: {e}")
    print("Please make sure you have an internet connection to download the model.")


# Parameters for cropping
margin = 10  # Margin in pixels to add around the cropped text
scale_factor = 4  # Factor by which to upscale the cropped images


def process_image(image_path):
    # Load the image using OpenCV
    image = cv2.imread(image_path)

    if model is None:
        return []

    # Perform text detection using YOLO
    results = model(image)

    # Extract bounding boxes from results
    detections = results[0].boxes.data  # Access the detection data

    cropped_images = []
    for detection in detections:
        # Extract the coordinates and class_id
        x_min, y_min, x_max, y_max, confidence, class_id = map(
            int, detection[:6].cpu().numpy())

        # Check if the detected label is "text" (assuming class_id 0 for "text")
        if class_id == 0:
            # Add margin
            left = max(0, x_min - margin)
            top = max(0, y_min - margin)
            right = min(image.shape[1], x_max + margin)
            bottom = min(image.shape[0], y_max + margin)

            # Crop the image
            cropped_image = image[top:bottom, left:right]

            # Upscale the cropped image
            cropped_image = cv2.resize(
                cropped_image, None, fx=scale_factor, fy=scale_factor, interpolation=cv2.INTER_CUBIC)

            cropped_images.append(cropped_image)

    return cropped_images


def perform_ocr_on_images(cropped_images):
    if ocr_model is None:
        return []

    ocr_results = []
    for cropped_image in cropped_images:
        # Convert the image to grayscale (if required by the OCR model, otherwise skip this step)
        gray_image = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2GRAY)

        # Perform OCR using Hezar directly on the grayscale image
        texts = ocr_model.predict(gray_image)

        # Store the OCR result
        ocr_results.append(texts)

    return ocr_results


def process_single_image(image_path):
    # Process the image and get cropped images
    cropped_images = process_image(image_path)

    # Perform OCR on the cropped images
    ocr_results = perform_ocr_on_images(cropped_images)

    return ocr_results


@app.route('/api/ocr', methods=['POST'])
def upload_file():
    if model is None or ocr_model is None:
        return jsonify({'error': 'Models not loaded. Please check the backend logs.'}), 500

    # Check if a file was sent
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    # Check if a file was selected
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        # Save the file to a temporary location
        filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filename)

        try:
            # Process the image
            ocr_texts = process_single_image(filename)

            # Format the output
            # The result is a list of lists of dictionaries, e.g., [[{'text': 'Hello'}], [{'text': 'World'}]]
            # We will flatten it into a single string.
            formatted_text = ""
            for result_list in ocr_texts:
                for result_dict in result_list:
                    formatted_text += result_dict.get('text', '') + '\n'

            return jsonify({'text': formatted_text})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            # Clean up the uploaded file
            if os.path.exists(filename):
                os.remove(filename)

    return jsonify({'error': 'Something went wrong'}), 500


if __name__ == '__main__':
    # Running on http://127.0.0.1:5000
    # In a production environment, use a proper WSGI server like Gunicorn
    # The reloader is disabled to avoid issues in some environments.
    app.run(debug=True, port=5000, use_reloader=False)
