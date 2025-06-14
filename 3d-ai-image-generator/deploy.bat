@echo off
echo 🚀 Starting deployment to Vercel...

REM Check if vercel CLI is installed
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
)

REM Build the project first
echo 🔨 Building the project...
npm run build

if %errorlevel% equ 0 (
    echo ✅ Build successful!
    
    REM Deploy to Vercel
    echo 🌐 Deploying to Vercel...
    vercel --prod
    
    if %errorlevel% equ 0 (
        echo 🎉 Deployment successful!
        echo Your 3D AI Image Generator is now live on Vercel!
    ) else (
        echo ❌ Deployment failed!
        exit /b 1
    )
) else (
    echo ❌ Build failed! Please fix the errors and try again.
    exit /b 1
)

pause
