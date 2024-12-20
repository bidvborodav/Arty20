import { OpenAI } from 'openai';
import { Response } from 'express';
import dotenv from 'dotenv';

// Configure dotenv at the beginning
dotenv.config();

export class SpeechService {
  private openai: OpenAI;

  constructor() {
    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async textToSpeech(text: string, res: Response) {
    try {
      const mp3 = await this.openai.audio.speech.create({
        model: "tts-1-hd",
        voice: "nova", // Using a friendly, engaging voice for children
        input: text,
        speed: 0.9, // Slightly slower for better comprehension
      });

      // Get the audio data as a buffer
      const buffer = Buffer.from(await mp3.arrayBuffer());

      // Set the appropriate headers
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length,
      });

      // Send the audio buffer
      return res.send(buffer);
    } catch (error) {
      console.error('Speech generation error:', error);
      throw error;
    }
  }
}

export const speechService = new SpeechService();