# Deployment Guide for OpenCity AI Hub

## Vercel Deployment (Frontend)

1. **Prerequisites**:
   - Create an account at [vercel.com](https://vercel.com)
   - Connect your GitHub account
   - Ensure your repository is pushed to GitHub

2. **Deployment Steps**:
   - Go to your Vercel dashboard
   - Click "New Project"
   - Import your GitHub repository (`https://github.com/Sreejith-nair511/HeraCross`)
   - Select the `feature/complete-opencity-ai-hub` branch
   - Configure the project:
     - Framework: Next.js
     - Build Command: `next build`
     - Output Directory: `.next`
   - Add environment variables if needed:
     - `NEXT_PUBLIC_API_URL`: URL of your backend API (Render URL)
   - Click "Deploy"

3. **Post-Deployment**:
   - Vercel will automatically build and deploy your application
   - The deployment URL will be provided in the dashboard

## Render Deployment (Backend)

1. **Prerequisites**:
   - Create an account at [render.com](https://render.com)
   - Connect your GitHub account

2. **Deployment Steps**:
   - Go to your Render dashboard
   - Click "New+" and select "Web Service"
   - Connect your GitHub repository (`https://github.com/Sreejith-nair511/HeraCross`)
   - Configure the service:
     - Name: `opencity-ai-backend`
     - Runtime: Python 3
     - Build Command: `pip install -r backend/requirements.txt`
     - Start Command: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
     - Branch: `feature/complete-opencity-ai-hub`
   - Add environment variables:
     - `DATABASE_URL`: PostgreSQL database URL
     - `REDIS_URL`: Redis URL (if using Redis)
     - `SECRET_KEY`: Your secret key (min 32 characters)
     - `MISTRAL_API_KEY`: Your Mistral API key
     - `HF_API_TOKEN`: Your Hugging Face API token
   - Click "Create Web Service"

3. **Database Setup**:
   - In Render, you can also create a PostgreSQL database
   - Link it to your web service for automatic connection string injection

## Environment Variables

### Frontend (Vercel)
```bash
NEXT_PUBLIC_API_URL=https://your-render-app.onrender.com
```

### Backend (Render)
```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production-min-32-chars

# API Keys
MISTRAL_API_KEY=your_mistral_api_key
HF_API_TOKEN=your_huggingface_api_token

# Redis (if using)
REDIS_URL=redis://localhost:6379
```

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check the build logs in Vercel/Render dashboard
   - Ensure all dependencies are properly listed in requirements.txt/package.json
   - Verify environment variables are correctly set

2. **Runtime Errors**:
   - Check application logs in Vercel/Render dashboard
   - Ensure database connections are properly configured
   - Verify API keys are valid

3. **CORS Issues**:
   - Update `CORS_ORIGINS` in your backend settings to include your frontend URL

### Support

If you encounter any issues during deployment, please check:
- Vercel documentation: https://vercel.com/docs
- Render documentation: https://render.com/docs
- Next.js documentation: https://nextjs.org/docs
- FastAPI documentation: https://fastapi.tiangolo.com