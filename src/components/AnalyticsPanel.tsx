
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

interface AnalyticsPanelProps {
  isCollapsed: boolean;
  topic?: string;
}

const AnalyticsPanel = ({ isCollapsed, topic }: AnalyticsPanelProps) => {
  // Mock data
  const sentimentData = [
    { name: "Positive", value: 45, color: "#4ade80" },
    { name: "Neutral", value: 30, color: "#94a3b8" },
    { name: "Negative", value: 25, color: "#f87171" },
  ];

  const sourceData = [
    { name: "Twitter/X", articles: 12, color: "#38bdf8" },
    { name: "Reddit", articles: 8, color: "#fb923c" },
    { name: "News Sites", articles: 15, color: "#a78bfa" },
    { name: "Blogs", articles: 5, color: "#4ade80" },
  ];

  const wordCount = 1245;
  const sourcesCount = 14;
  const articleCount = 40;

  if (isCollapsed) {
    return null;
  }

  return (
    <div className="w-full lg:w-80 xl:w-96 h-full flex flex-col border-l border-border overflow-y-auto">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-medium">Analytics</h2>
        {topic && (
          <p className="text-sm text-muted-foreground">for "{topic}"</p>
        )}
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <p className="text-xs text-muted-foreground">Words</p>
              <p className="text-2xl font-bold">{wordCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <p className="text-xs text-muted-foreground">Sources</p>
              <p className="text-2xl font-bold">{sourcesCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <p className="text-xs text-muted-foreground">Articles</p>
              <p className="text-2xl font-bold">{articleCount}</p>
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
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {sentimentData.map((entry, index) => (
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
              <BarChart data={sourceData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={80} />
                <Tooltip />
                <Bar dataKey="articles" radius={[0, 4, 4, 0]}>
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
