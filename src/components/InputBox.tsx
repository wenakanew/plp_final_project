
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, ArrowRight } from "lucide-react";
import { useSpeechRecognition } from "../hooks/use-speech-recognition";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface InputBoxProps {
  onSubmit: (input: string) => void;
  isLoading: boolean;
}

const InputBox = ({ onSubmit, isLoading }: InputBoxProps) => {
  const [input, setInput] = useState("");
  const { toast } = useToast();
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    browserSupportsSpeechRecognition 
  } = useSpeechRecognition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;
    
    onSubmit(input);
    setInput("");
  };

  React.useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      if (!browserSupportsSpeechRecognition) {
        toast({
          title: "Speech recognition not supported",
          description: "Your browser doesn't support speech recognition.",
          variant: "destructive"
        });
        return;
      }
      startListening();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a topic or question..."
          className="tunei-input pr-24"
          disabled={isLoading}
        />
        <div className="absolute right-1.5 top-1.5 flex items-center gap-1">
          <Button
            type="button"
            onClick={handleMicClick}
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full hover:bg-primary/10 transition-colors",
              isListening && "bg-primary/10 text-primary animate-pulse"
            )}
          >
            <Mic className="h-5 w-5" />
            <span className="sr-only">
              {isListening ? "Stop listening" : "Start listening"}
            </span>
          </Button>
          
          <Button
            type="submit"
            disabled={input.trim() === "" || isLoading}
            variant="default"
            size="icon"
            className="rounded-full"
          >
            <ArrowRight className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InputBox;
