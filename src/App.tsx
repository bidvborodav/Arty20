import React from 'react';
import { Mic, Camera, Search } from 'lucide-react';
import SearchInterface from './SearchInterface';

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <header className="p-6">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">Arty20</h1>
          <div className="flex gap-4">
            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">About</a>
            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Contact</a>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        <SearchInterface />
      </main>

      <footer className="mt-12 py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>© 2024 Arty20. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;