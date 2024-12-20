# 🎨 ARty20: Your Child-Friendly Museum Guide

ARty20 is an interactive, AI-powered museum guide designed specifically for children visiting the Neues Museum in Berlin. It uses advanced AI technology to make museum exploration fun, engaging, and educational for young minds.

## ✨ Features

- 🗣️ **Voice Interaction**: Listen to engaging explanations about exhibits
- 📸 **Image Recognition**: Take photos of artifacts to learn more about them
- 👶 **Child-Friendly Interface**: Designed specifically for young museum visitors
- 🤖 **AI-Powered Responses**: Uses GPT-4 for accurate and engaging information
- 📱 **Responsive Design**: Works seamlessly on various devices
- 🎯 **Interactive Elements**: Suggestion cards and dynamic responses

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Node.js, Express
- **AI Services**: OpenAI GPT-4, Vision API
- **Audio**: Text-to-Speech capabilities
- **Styling**: Modern, accessible UI with Lucide icons

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Arty20.git
   cd Arty20
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

3. Set up environment variables:
   ```bash
   # In the server directory, create a .env file
   OPENAI_API_KEY=your_openai_api_key
   PORT=3001
   ```

### Running the Application

Start both frontend and backend with a single command:
```bash
npm start
```

This will launch:
- Frontend on `http://localhost:3000`
- Backend on `http://localhost:3001`

## 🎯 Usage

1. **Text Search**:
   - Type your question in the search bar
   - Press Enter or click the search button
   - Receive both text and audio responses

2. **Camera Feature**:
   - Click the camera icon
   - Take a photo of an exhibit
   - Get AI-powered insights about the artifact

3. **Voice Playback**:
   - Click the speaker icon to hear explanations
   - Perfect for young children who prefer listening

## 🛟 Troubleshooting

### Common Issues

1. **Port Conflicts**:
   ```bash
   # Check if ports are in use
   lsof -i :3000
   lsof -i :3001
   
   # Kill processes if needed
   kill -9 <PID>
   ```

2. **Large Payload Errors**:
   - The server is configured to handle large image files
   - If you encounter issues, check your network connection

3. **Camera Access**:
   - Ensure your browser has camera permissions enabled
   - Try refreshing the page if camera doesn't initialize

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgments

- Neues Museum Berlin for inspiration
- OpenAI for AI capabilities
- The museum education community

## 📞 Support

For support, please email [support@arty20.com](mailto:support@arty20.com) or open an issue in the GitHub repository.