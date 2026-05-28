#!/bin/bash
# build.sh — run this on Render before starting the ML service
set -e
echo "Installing dependencies..."
pip install -r requirements.txt

echo "Generating dataset..."
cd ../dataset && python generate_dataset.py

echo "Training ML models..."
cd ../ml-service && python train_model.py

echo "✅ Build complete"
