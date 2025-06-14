# 🎨 3D AI Image Generator

A stunning 3D web application that generates AI images and displays them in an interactive 3D space. Built with Next.js, React Three Fiber, and multiple AI image generation services.

![3D AI Image Generator](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-Latest-green?style=for-the-badge&logo=three.js)
![Vercel](https://img.shields.io/badge/Vercel-Ready-black?style=for-the-badge&logo=vercel)

## ✨ Features

- **🎯 3D Interactive Environment**: Navigate through a beautiful 3D space with generated images
- **🤖 AI Image Generation**: Multiple fallback services for reliable image generation
- **📥 Download Functionality**: Download generated images with smart filename generation
- **📱 Responsive Design**: Works on desktop and mobile devices
- **🆓 Free Services**: Uses free AI image generation APIs
- **⚡ Vercel Optimized**: Ready for deployment on Vercel with proper serverless configuration
- **🔄 Auto-Rotation**: 3D space automatically rotates when not interacting
- **🎮 Interactive Controls**: Mouse controls for zoom, pan, and rotate

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd 3d-ai-image-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy on Vercel

### 🚀 One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/3d-ai-image-generator)

### 📋 Manual Deployment

**Option 1: Using our deployment script**
```bash
# For Unix/Linux/macOS
chmod +x deploy.sh
./deploy.sh

# For Windows
deploy.bat
```

**Option 2: Manual steps**
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Build the project
npm run build

# 3. Deploy to Vercel
npm run deploy

# Or for preview deployment
npm run deploy:preview
```

**Option 3: GitHub Integration**
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Vercel will auto-deploy on every push

### Environment Variables (Optional)

Copy `.env.example` to `.env.local` and configure any optional settings:

```bash
cp .env.example .env.local
```

## 🛠️ Technical Details

### Architecture

- **Frontend**: Next.js 15 with React 19
- **3D Graphics**: React Three Fiber + Three.js
- **Styling**: Tailwind CSS
- **API Routes**: Next.js serverless functions
- **Image Generation**: Multiple free AI services with fallbacks

### Vercel Optimizations

- **Serverless Functions**: API routes optimized for Vercel's serverless environment
- **Edge Runtime**: Placeholder generation uses edge runtime for faster response
- **Timeout Management**: Proper timeout handling for all external API calls
- **Memory Management**: File size limits to prevent memory issues
- **CORS Configuration**: Proper CORS headers for cross-origin requests

### API Endpoints

- `POST /api/generate-image` - Generate AI images with multiple service fallbacks
- `POST /api/download-image` - Proxy for downloading images (handles CORS)
- `GET /api/placeholder` - Generate SVG placeholders for fallback images

## 🎮 How to Use

1. **Generate Images**: Enter a text prompt and click "Generate Image"
2. **Navigate 3D Space**: Use mouse to rotate, zoom, and pan around the 3D environment
3. **View Details**: Click on any generated image to see it in detail
4. **Download Images**: Use the download button in the detail view or the quick download in the generator panel

## 🔧 Configuration

### Vercel Settings

The project includes a `vercel.json` configuration file that:
- Sets appropriate timeouts for API functions (30s for Pro, 10s for Hobby)
- Configures CORS headers
- Sets up URL rewrites for placeholder images
- Optimizes for serverless deployment

### Performance Optimizations

- **Image Size Limits**: 10MB maximum to prevent memory issues
- **Request Timeouts**: 30-second maximum for API calls
- **Caching**: Appropriate cache headers for static assets
- **Error Handling**: Graceful fallbacks for all services

## 🐛 Troubleshooting

### Common Issues

1. **API Timeout Errors**
   - The app uses multiple fallback services
   - If all services fail, a placeholder image is generated

2. **Download Issues**
   - The app includes a proxy API to handle CORS issues
   - Fallback opens images in a new tab if download fails

3. **3D Performance**
   - Reduce the number of generated images if performance is slow
   - The app automatically optimizes based on device capabilities

### Vercel Deployment Issues

1. **Function Timeout**
   - Upgrade to Vercel Pro for longer function timeouts
   - Current configuration supports both Hobby (10s) and Pro (30s) plans

2. **Memory Limits**
   - Image size is limited to 10MB to stay within Vercel's memory limits
   - Large images are automatically rejected

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Made with ❤️ for the developer community**
