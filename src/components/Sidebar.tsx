
import React from "react";
import { 
  Search, 
  Settings, 
  BarChart3, 
  Mic, 
  CreditCard, 
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const sidebarItems = [
    {
      icon: <Search className="h-5 w-5" />,
      text: "Explore Topics",
      active: true,
    },
    {
      icon: <Settings className="h-5 w-5" />,
      text: "AI Summary Settings",
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      text: "Analytics",
    },
    {
      icon: <Mic className="h-5 w-5" />,
      text: "Voice Preferences",
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      text: "Premium Access",
    },
  ];

  return (
    <div 
      className={cn(
        "h-full bg-sidebar border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border flex justify-end">
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 hover:bg-sidebar-accent rounded-md transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
        
        <div className="flex-1 py-4 space-y-1">
          {sidebarItems.map((item, index) => (
            <div 
              key={index}
              className={cn(
                "tunei-sidebar-item mx-2", 
                item.active && "active"
              )}
            >
              {item.icon}
              {!collapsed && <span>{item.text}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
