import React, { useState } from 'react';
import { Mic, Camera, Search } from 'lucide-react';
import CameraView from './components/CameraView';

interface Suggestion {
  text: string;
  description: string;
}

const SearchInterface = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [showCamera, setShowCamera] = useState(false);

  const suggestions: Suggestion[] = [
    {
      text: "Tell me about mummies",
      description: "Start an exciting treasure hunt in Ancient Egypt"
    },
    {
      text: "Who was Queen Nefertiti?",
      description: "Learn about the beautiful queen"
    },
    {
      text: "Ancient Egypt facts",
      description: "What was life like thousands of years ago?"
    },
    {
      text: "How do archaeologists work?",
      description: "Learn how explorers discover ancient treasures"
    }
  ];

  const testServer = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/test');
      const data = await response.json();
      console.log('Server test response:', data);
    } catch (err) {
      console.error('Server test failed:', err);
    }
  };

  const handleSearch = async (queryText: string = searchQuery) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3001/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: queryText.trim().slice(0, 500),
          systemPrompt: "You are an AI tour guide for children under 12 visiting the Neues Museum in Berlin. Your job is to explain the exhibits and artifacts in a fun, simple, and engaging way, making history come alive for young minds. Use child-friendly language, include fascinating stories, and encourage curiosity."
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.response) {
        setResponse(data.response);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageCapture = async (imageData: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3001/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: "Please describe what you see in this image and provide interesting facts about it that would engage children under 12.",
          image: imageData,
          systemPrompt: "You are an AI tour guide for children under 12 visiting the Neues Museum in Berlin. Your job is to explain the exhibits and artifacts in a fun, simple, and engaging way, making history come alive for young minds. Use child-friendly language, include fascinating stories, and encourage curiosity."
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.response) {
        setResponse(data.response);
        setShowCamera(false);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err: any) {
      console.error('Image analysis error:', err);
      setError(err.message || 'Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSearchQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  React.useEffect(() => {
    testServer();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {showCamera && (
        <CameraView
          onClose={() => setShowCamera(false)}
          onImageCapture={handleImageCapture}
          isLoading={isLoading}
        />
      )}

      <div className="w-full max-w-2xl px-4">
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              placeholder="What would you like to know about ancient Egypt? 🌟"
              className="w-full h-14 pl-4 pr-24 text-lg border rounded-full border-gray-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              <button 
                className="p-2 text-purple-500 hover:text-purple-700 focus:outline-none transform hover:scale-110 transition-transform duration-200" 
                aria-label="Voice search"
              >
                <Mic size={24} />
              </button>
              <button 
                onClick={() => setShowCamera(true)}
                className="p-2 text-purple-500 hover:text-purple-700 focus:outline-none transform hover:scale-110 transition-transform duration-200" 
                aria-label="Camera search"
              >
                <Camera size={24} />
              </button>
            </div>
          </div>
          
          {!response && (
            <div className="grid grid-cols-2 gap-4">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-4 text-left bg-white rounded-xl border-2 border-purple-200 hover:border-purple-500 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                >
                  <p className="font-medium text-gray-800 text-lg">{suggestion.text}</p>
                  <p className="text-sm text-gray-600 mt-2">{suggestion.description}</p>
                </button>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="text-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Thinking...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {response && !isLoading && (
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <p className="text-gray-800 text-lg leading-relaxed">{response}</p>
              <button 
                onClick={() => {
                  setResponse('');
                  setSearchQuery('');
                }}
                className="mt-4 text-purple-500 hover:text-purple-700 font-medium"
              >
                Ask another question
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchInterface;