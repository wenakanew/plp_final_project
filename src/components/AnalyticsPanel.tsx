
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnalyticsData } from "../services/analyticsService";
import styles from "./AnalyticsPanel.module.css";

interface AnalyticsPanelProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  topic?: string;
  data?: AnalyticsData | null;
  isLoading?: boolean;
}

const AnalyticsPanel = ({ 
  isCollapsed, 
  setIsCollapsed,
  topic, 
  data,
  isLoading = false
}: AnalyticsPanelProps) => {
  if (isCollapsed) {
    return (
      <div 
        className="flex items-center justify-center border-l border-border h-full cursor-pointer"
        onClick={() => setIsCollapsed(false)}
      >
        <div className="p-2 hover:bg-background/50 rounded-full">
          <ChevronLeft className="h-4 w-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-80 xl:w-96 h-full flex flex-col border-l border-border overflow-y-auto">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Analytics</h2>
          {topic && (
            <p className="text-sm text-muted-foreground">for "{topic}"</p>
          )}
        </div>
        <button 
          onClick={() => setIsCollapsed(true)}
          className="p-1.5 hover:bg-sidebar-accent/60 rounded-md transition-colors"
          title="Collapse panel"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        {isLoading ? (
          <>
            <div className="spinner">
              <div className="outer"></div>
              <div className="inner"></div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Processing data...</p>
          </>
        ) : !data ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <p className="text-sm text-muted-foreground">No data available. Start by searching for a topic.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <p className="text-xs text-muted-foreground">Words</p>
                  <p className="text-2xl font-bold">{data.wordCount.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <p className="text-xs text-muted-foreground">Sources</p>
                  <p className="text-2xl font-bold">{data.sourcesCount}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <p className="text-xs text-muted-foreground">Articles</p>
                  <p className="text-2xl font-bold">{data.articleCount}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Sentiment Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={data.sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => 
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {data.sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Source Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={data.sourceData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={80}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Bar dataKey="articles" radius={[0, 4, 4, 0]}>
                      {data.sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {data.topKeywords && data.topKeywords.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Top Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {data.topKeywords.map((keyword, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-xs py-1"
                      >
                        {keyword.text}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPanel;
