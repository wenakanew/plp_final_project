
import { useState, useEffect } from 'react';

interface SpeechRecognitionHook {
  transcript: string;
  isListening: boolean;
  browserSupportsSpeechRecognition: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

// Create a type for the SpeechRecognition object
interface SpeechRecognitionInterface extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognitionInterface | null>(null);
  const [browserSupports, setBrowserSupports] = useState(false);

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition() as SpeechRecognitionInterface;
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const current = Array.from(event.results).pop();
        if (current && current.isFinal) {
          setTranscript(current[0].transcript);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
      setBrowserSupports(true);
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, []);

  const startListening = () => {
    if (recognition) {
      setTranscript('');
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const resetTranscript = () => {
    setTranscript('');
  };

  return {
    transcript,
    isListening,
    browserSupportsSpeechRecognition: browserSupports,
    startListening,
    stopListening,
    resetTranscript,
  };
}
