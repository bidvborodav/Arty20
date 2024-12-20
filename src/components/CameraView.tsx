import React, { useRef, useState, useEffect } from 'react';
import { Camera, X } from 'lucide-react';

interface CameraViewProps {
  onClose: () => void;
  onImageCapture: (imageData: string) => Promise<void>;
  isLoading: boolean;
}

const CameraView: React.FC<CameraViewProps> = ({ onClose, onImageCapture, isLoading }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        setError('Could not access camera. Please make sure you have given permission.');
        console.error('Camera error:', err);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg');
    await onImageCapture(imageData);
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Camera Error</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50">
      <div className="relative h-full">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg"
        >
          <X size={24} />
        </button>

        <video 
          ref={videoRef}
          autoPlay 
          playsInline
          className="h-full w-full object-cover"
        />

        <canvas ref={canvasRef} className="hidden" />

        {hasPermission && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <button
              onClick={captureImage}
              disabled={isLoading}
              className="p-4 bg-white rounded-full shadow-lg transform transition-transform hover:scale-105 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-purple-500 animate-spin" />
              ) : (
                <Camera size={48} className="text-purple-500" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraView;