import React from "react";
import { 
  Search, 
  Settings, 
  BarChart3, 
  Mic, 
  CreditCard, 
  ChevronLeft,
  ChevronRight,
  PenTool,
  FileText,
  Newspaper,
  Upload
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    {
      icon: <Search className="h-5 w-5" />,
      text: "Explore Topics",
      path: "/",
    },
    {
      icon: <PenTool className="h-5 w-5" />,
      text: "Content Generator",
      path: "/generate",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      text: "AI Summary Settings",
      path: "/settings",
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      text: "Analytics",
      path: "/analytics",
    },
    {
      icon: <Mic className="h-5 w-5" />,
      text: "Voice Preferences",
      path: "/voice",
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      text: "Premium Access",
      path: "/premium",
    },
    {
      icon: <Upload className="h-5 w-5" />,
      text: "Vibely",
      path: "/article-upload",
    },
  ];

  return (
    <div 
      className={cn(
        "h-full bg-sidebar border-r border-border/40 transition-all duration-300 backdrop-blur-sm bg-opacity-80",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border/40 flex justify-end">
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 hover:bg-sidebar-accent/60 rounded-md transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
        
        <div className="flex-1 py-6 space-y-1">
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={cn(
                "tunei-sidebar-item mx-2 backdrop-blur-sm w-full text-left px-3 py-2 rounded-md transition-colors hover:bg-sidebar-accent/60", 
                location.pathname === item.path && "active bg-gradient-to-r from-primary/20 to-transparent"
              )}
            >
              <div className={cn(
                "flex items-center gap-3",
                location.pathname === item.path && "text-primary"
              )}>
                {item.icon}
                {!collapsed && (
                  <span className={cn(
                    "transition-opacity duration-200",
                    location.pathname === item.path ? "text-primary font-medium" : ""
                  )}>
                    {item.text}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Bottom decoration */}
        {!collapsed && (
          <div className="p-6 opacity-30">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            <div className="mt-6 text-xs text-center text-muted-foreground tracking-widest">TUNEI</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
