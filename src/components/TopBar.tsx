import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Download, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface TopBarProps {
  onExportPDF: () => void;
  isExporting?: boolean;
  hasResults?: boolean;
}

const TopBar = ({ onExportPDF, isExporting = false, hasResults = false }: TopBarProps) => {
  const { currentUser } = useAuth();

  return (
    <div className="w-full bg-background border-b border-border py-4 px-6 flex items-center justify-between backdrop-blur-sm bg-opacity-80">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 relative">
          <img 
            src="/tunei-logo.png" 
            alt="Tunei Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-medium tracking-wide">
            <span className="bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent font-bold">TUNEI</span>
          </h1>
          <span className="text-xs text-muted-foreground tracking-wider hidden md:inline-block">
            TUNE INTO REAL-TIME TRUTH.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-secondary/40 backdrop-blur-sm hover:bg-secondary/60"
          onClick={onExportPDF}
          disabled={isExporting || !hasResults}
        >
          <Download className="h-5 w-5" />
          <span className="sr-only">Download</span>
        </Button>
        <Link to="/profile">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-secondary/40 backdrop-blur-sm hover:bg-secondary/60"
          >
            {currentUser?.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt="Profile" 
                className="h-5 w-5 rounded-full object-cover"
              />
            ) : (
              <User className="h-5 w-5" />
            )}
            <span className="sr-only">Profile</span>
          </Button>
        </Link>
        <Link to="/account">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-secondary/40 backdrop-blur-sm hover:bg-secondary/60"
          >
            <User className="h-5 w-5" />
            <span className="sr-only">Account Settings</span>
          </Button>
        </Link>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default TopBar;
