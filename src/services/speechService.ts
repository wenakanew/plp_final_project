
// Simple text-to-speech service using the Web Speech API
export class SpeechService {
  private speechSynthesis: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private isReady: boolean = false;

  constructor() {
    this.speechSynthesis = window.speechSynthesis;
    
    // Load voices when they're ready
    if (this.speechSynthesis) {
      this.loadVoices();
      
      // Chrome needs this event to load voices
      this.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  private loadVoices() {
    this.voices = this.speechSynthesis.getVoices();
    this.isReady = this.voices.length > 0;
    console.log(`Loaded ${this.voices.length} voices`);
  }

  public speak(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.speechSynthesis) {
        reject(new Error("Speech synthesis not supported"));
        return;
      }

      if (!this.isReady) {
        // Try to load voices again
        this.loadVoices();
        if (!this.isReady) {
          reject(new Error("Voices not loaded"));
          return;
        }
      }

      // Cancel any ongoing speech
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Try to find a good English voice
      const preferredVoice = this.voices.find(voice => 
        voice.lang.includes('en') && voice.name.includes('Google') || voice.name.includes('Female')
      ) || this.voices[0];
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

      this.speechSynthesis.speak(utterance);
    });
  }

  public stop(): void {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
  }

  public isPaused(): boolean {
    return this.speechSynthesis ? this.speechSynthesis.paused : false;
  }

  public pause(): void {
    if (this.speechSynthesis) {
      this.speechSynthesis.pause();
    }
  }

  public resume(): void {
    if (this.speechSynthesis) {
      this.speechSynthesis.resume();
    }
  }
}

// Singleton instance
export const speechService = new SpeechService();
