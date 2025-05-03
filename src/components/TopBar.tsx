
import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const TopBar = () => {
  return (
    <div className="w-full bg-background border-b border-border py-3 px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-gradient-to-r from-tunei-primary to-tunei-purple rounded-full p-1.5 text-white flex items-center justify-center">
          <span className="text-sm font-bold">T</span>
        </div>
        <h1 className="text-lg font-medium">
          <span className="text-tunei-primary font-bold">Tunei</span>
          <span className="text-sm text-muted-foreground ml-1 hidden md:inline-block">
            – Tune into Real-Time Truth
          </span>
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Download className="h-5 w-5" />
          <span className="sr-only">Download</span>
        </Button>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default TopBar;
