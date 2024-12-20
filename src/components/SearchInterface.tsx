import React, { useState } from 'react';
import { Mic, Camera } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import AudioPlayer from './AudioPlayer';
import { MarkdownComponentProps } from '../types/markdown';

const SearchInterface = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const suggestions = [
    {
      text: "Let's find mummies! 🗿",
      description: "Start an exciting treasure hunt in Ancient Egypt"
    },
    {
      text: "Meet Queen Nefertiti 👑",
      description: "She was the most beautiful queen - want to know her secrets?"
    },
    {
      text: "Time travel mission! ⏰",
      description: "What was life like thousands of years ago?"
    },
    {
      text: "Become a young archaeologist! 🔍",
      description: "Learn how explorers discover ancient treasures"
    }
  ];

  // Define markdown components with proper typing
  const markdownComponents = {
    h1: ({ children, ...props }: MarkdownComponentProps) => (
      <h1 className="text-2xl font-bold mb-4 mt-6" {...props}>{children}</h1>
    ),
    h2: ({ children, ...props }: MarkdownComponentProps) => (
      <h2 className="text-xl font-bold mb-3 mt-5" {...props}>{children}</h2>
    ),
    h3: ({ children, ...props }: MarkdownComponentProps) => (
      <h3 className="text-lg font-bold mb-2 mt-4" {...props}>{children}</h3>
    ),
    p: ({ children, ...props }: MarkdownComponentProps) => (
      <p className="mb-4" {...props}>{children}</p>
    ),
    ul: ({ children, ...props }: MarkdownComponentProps) => (
      <ul className="list-disc list-inside mb-4" {...props}>{children}</ul>
    ),
    ol: ({ children, ...props }: MarkdownComponentProps) => (
      <ol className="list-decimal list-inside mb-4" {...props}>{children}</ol>
    ),
    li: ({ children, ...props }: MarkdownComponentProps) => (
      <li className="mb-2" {...props}>{children}</li>
    ),
    blockquote: ({ children, ...props }: MarkdownComponentProps) => (
      <blockquote className="border-l-4 border-purple-300 pl-4 my-4 italic" {...props}>{children}</blockquote>
    ),
    code: ({ children, inline, ...props }: MarkdownComponentProps) => (
      inline ? (
        <code className="bg-gray-100 rounded px-1 py-0.5" {...props}>{children}</code>
      ) : (
        <code className="block bg-gray-100 rounded p-4 my-4 overflow-auto" {...props}>{children}</code>
      )
    ),
    a: ({ children, ...props }: MarkdownComponentProps) => (
      <a className="text-purple-600 hover:text-purple-800 underline" {...props}>{children}</a>
    ),
  };

  const handleSearch = async (queryText = searchQuery) => {
    setIsLoading(true);
    setError('');
    setAudioUrl(null);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are a helpful museum guide at the Neues Museum in Berlin. You specialize in making history engaging and fun for children. Focus on the Egyptian collection, archaeology, and the museum's history."
            },
            {
              role: "user",
              content: queryText
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Create a blob from the audio response
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);

      // Convert the audio blob to text for display
      const textResponse = await fetch('/api/chat/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are a helpful museum guide at the Neues Museum in Berlin. You specialize in making history engaging and fun for children. Focus on the Egyptian collection, archaeology, and the museum's history."
            },
            {
              role: "user",
              content: queryText
            }
          ]
        })
      });

      if (!textResponse.ok) {
        throw new Error('Failed to get text response');
      }

      const data = await textResponse.json();
      setResponse(data.message);
    } catch (err) {
      setError('Sorry, I had trouble answering that. Can you try asking in a different way?');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: { text: string }) => {
    setSearchQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
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
              placeholder="Hi! What would you like to explore? 🌟"
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
              <ReactMarkdown 
                components={markdownComponents}
                className="text-gray-800 text-lg leading-relaxed prose prose-purple"
              >
                {response}
              </ReactMarkdown>
              <AudioPlayer audioUrl={audioUrl} />
              <button 
                onClick={() => {
                  setResponse('');
                  setSearchQuery('');
                  setAudioUrl(null);
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