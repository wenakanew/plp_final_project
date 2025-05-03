
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Play, Pause, Download, Smile, Meh, Frown } from "lucide-react";
import { cn } from "@/lib/utils";
import { RssItem } from "../services/rssService";
import { speechService } from "../services/speechService";
import { exportToPDF } from "../services/exportService";
import { toast } from "sonner";

interface ResultsDisplayProps {
  results: RssItem[];
  searchTerm?: string;
}

const getSentimentIcon = (sentiment: string) => {
  switch (sentiment) {
    case "positive":
      return <Smile className="h-4 w-4 text-green-500" />;
    case "negative":
      return <Frown className="h-4 w-4 text-red-500" />;
    default:
      return <Meh className="h-4 w-4 text-gray-500" />;
  }
};

const ResultsDisplay = ({ results, searchTerm }: ResultsDisplayProps) => {
  const [playingItemId, setPlayingItemId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handlePlayPause = async (item: RssItem) => {
    try {
      if (playingItemId === item.id) {
        // Stop current playback
        speechService.stop();
        setPlayingItemId(null);
      } else {
        // Stop any current playback
        if (playingItemId) {
          speechService.stop();
        }
        
        // Start new playback
        setPlayingItemId(item.id);
        
        // Prepare text for speech
        const titleText = `${item.title}.`;
        const cleanDescription = item.description.replace(/<[^>]*>/g, "");
        const speechText = `${titleText} ${cleanDescription}`;
        
        await speechService.speak(speechText);
        
        // Reset playing state when finished
        setPlayingItemId(null);
      }
    } catch (error) {
      console.error("Speech playback error:", error);
      toast({
        title: "Speech Playback Error",
        description: "There was an error playing the audio. Please try again.",
        variant: "destructive"
      });
      setPlayingItemId(null);
    }
  };

  const handleExportPDF = async () => {
    if (results.length === 0) return;
    
    setIsExporting(true);
    await exportToPDF(results, searchTerm);
    setIsExporting(false);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.round(diffMs / 60000);
      
      if (diffMins < 60) {
        return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
      }
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      }
      
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
      }
      
      return date.toLocaleDateString();
    } catch (e) {
      return "Unknown date";
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-medium">
          {searchTerm ? `Results for "${searchTerm}"` : "Latest News"}
        </h2>
        
        <Button 
          onClick={handleExportPDF} 
          disabled={isExporting || results.length === 0} 
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {isExporting ? "Exporting..." : "Export PDF"}
        </Button>
      </div>

      {results.length === 0 ? (
        <div className="tunei-card flex flex-col items-center justify-center py-12">
          <div className="text-4xl mb-4">📰</div>
          <h3 className="text-lg font-medium mb-2">No Results Found</h3>
          <p className="text-muted-foreground text-center">
            {searchTerm 
              ? `No articles found matching "${searchTerm}". Try a different search term.` 
              : "No articles available. Please check back later."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {results.map((item) => (
            <div
              key={item.id}
              className={cn(
                "tunei-card",
                item.imageUrl ? "flex flex-col md:flex-row gap-4" : ""
              )}
            >
              {item.imageUrl && (
                <div className="w-full md:w-1/3 h-48 md:h-auto overflow-hidden rounded-lg">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className={item.imageUrl ? "w-full md:w-2/3" : "w-full"}>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs font-normal">
                    {item.source}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(item.publishDate)}
                  </span>
                  {getSentimentIcon(item.sentiment || "neutral")}
                </div>
                <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-foreground/80 mb-4">{item.description.replace(/<[^>]*>/g, "")}</p>
                <div className="flex items-center justify-between">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary underline hover:text-primary/80"
                  >
                    View Original Source
                  </a>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="gap-1 text-xs"
                    onClick={() => handlePlayPause(item)}
                  >
                    {playingItemId === item.id ? (
                      <>
                        <Pause className="h-3 w-3" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3" />
                        Listen
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
