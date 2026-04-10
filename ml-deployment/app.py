from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io

app = FastAPI(
    title="AstraVision Human Detection API",
    description="ML API for Human vs Non-human Detection using MobileNetV2",
    version="1.0"
)

# ----------------------------
# Load Model
# ----------------------------
def load_model():
    model = models.mobilenet_v2(weights=None)

    model.classifier[1] = nn.Sequential(
        nn.Linear(model.last_channel, 128),
        nn.ReLU(),
        nn.Dropout(0.2),
        nn.Linear(128, 1),
        nn.Sigmoid()
    )

    model.load_state_dict(
        torch.load("model/best_model.pth", map_location="cpu")
    )

    model.eval()
    return model


model = load_model()

# ----------------------------
# Preprocessing
# ----------------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])


def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = transform(image).unsqueeze(0)
    return image


# ----------------------------
# Home Route
# ----------------------------
@app.get("/")
def home():
    return {"message": "AstraVision ML API Running Successfully"}


# ----------------------------
# Predict Route
# ----------------------------
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = preprocess_image(image_bytes)

    with torch.no_grad():
        human_probability = 1 - model(image).item()

    prediction = "Human" if human_probability >= 0.65 else "Non-human"
    
    return JSONResponse({
        "probability": round(human_probability, 4),
        "prediction": prediction
    })
    