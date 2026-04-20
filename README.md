# AstraVision (formerly FusionGuard AI)

A futuristic cybersecurity and AI dashboard system.

## Project Structure

This project is organized as a monorepo containing:

- **[astravision-frontend](./astravision-frontend)**: React + TypeScript + Vite project for the dashboard UI.
- **[astravision-backend](./astravision-backend)**: Backend services (to be implemented).

## Getting Started

### Frontend

To run the frontend locally:

```bash
cd astravision-frontend
npm install
npm run dev
```

## Deployment & Testing

The system is deployed and can be accessed via the following endpoints:

- **Frontend (UI)**: [https://astra-vision.vercel.app](https://astra-vision.vercel.app)
- **Backend API**: [https://astravision-backend.onrender.com](https://astravision-backend.onrender.com)
- **ML Engine (Docs)**: [https://astravision.onrender.com/docs](https://astravision.onrender.com/docs)

### Local Camera Testing (ngrok)
To bridge the local ESP32-CAM stream with the cloud dashboard, use:
```bash
ngrok http 10.77.189.134:80
```
