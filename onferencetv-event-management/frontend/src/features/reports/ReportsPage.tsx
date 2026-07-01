import { useMemo } from "react";
import {
  BarChart3,
  CalendarDays,
  Sparkles,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { format, startOfMonth, formatDistanceToNow } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useGetEventsQuery } from "@/app/apiSlice";
import { useGetAiHistoryQuery } from "@/features/ai/aiApi";
import { useGetPdfHistoryQuery } from "@/features/pdf/pdfApi";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = [
  "#4f46e5",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#0ea5e9",
];

export function ReportsPage() {
  const { data: eventsData, isLoading: eventsLoading } = useGetEventsQuery();
  const { data: aiHistory = [], isLoading: aiLoading } = useGetAiHistoryQuery();
  const { data: pdfHistory = [], isLoading: pdfLoading } =
    useGetPdfHistoryQuery();

  const events = eventsData?.data || [];
  const isLoading = eventsLoading || aiLoading || pdfLoading;

  // 1. Calculate Summary Stats
  const now = new Date();
  const upcomingEvents = events.filter(
    (e) => new Date(e.eventDate) >= now,
  ).length;
  const completedEvents = events.length - upcomingEvents;

  // 2. Data for: Events by Month (Bar Chart)
  const eventsByMonthData = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach((e) => {
      const monthStr = format(startOfMonth(new Date(e.eventDate)), "MMM yyyy");
      counts[monthStr] = (counts[monthStr] || 0) + 1;
    });
    // Convert to array and sort chronologically (simplified sort assuming recent year)
    return Object.entries(counts).map(([name, count]) => ({
      name,
      Events: count,
    }));
  }, [events]);

  // 3. Data for: Speaker Distribution (Pie Chart) - Top 5 speakers by event count
  const speakerData = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach((e) => {
      counts[e.speakerName] = (counts[e.speakerName] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, value: count }));
  }, [events]);

  // 4. Data for: AI Generations over time (Area Chart)
  const aiGenerationsData = useMemo(() => {
    if (aiHistory.length === 0) return [];
    const counts: Record<string, number> = {};
    aiHistory.forEach((h) => {
      const dayStr = format(new Date(h.timestamp), "MMM dd");
      counts[dayStr] = (counts[dayStr] || 0) + 1;
    });
    return Object.entries(counts)
      .reverse() // Reverse because history is usually newest first
      .map(([date, count]) => ({ date, Generations: count }));
  }, [aiHistory]);

  if (isLoading) {
    return (
      <div className="p-8 max-w-9xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-9xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-fuchsia-500" />
          Analytics & Reports
        </h1>
        <p className="text-muted-foreground">
          Comprehensive overview of your event management operations and AI
          usage.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-sm border-0 bg-white dark:bg-zinc-950">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">
                Total Events
              </p>
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg">
                <CalendarDays className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold">{events.length}</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-white dark:bg-zinc-950">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">
                Upcoming / Completed
              </p>
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold">{upcomingEvents}</h2>
              <span className="text-muted-foreground font-medium">
                / {completedEvents}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-white dark:bg-zinc-950">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">
                AI Content Generates
              </p>
              <div className="p-2 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold">{aiHistory.length}</h2>
              <span className="text-xs text-muted-foreground ml-2">
                Total uses
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-white dark:bg-zinc-950">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">
                PDF Exports
              </p>
              <div className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold">{pdfHistory.length}</h2>
              <span className="text-xs text-muted-foreground ml-2">
                Documents
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Events by Month */}
        <Card className="shadow-sm border-0">
          <CardHeader>
            <CardTitle>Events Timeline</CardTitle>
            <CardDescription>
              Number of events scheduled per month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {eventsByMonthData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={eventsByMonthData}
                    margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#64748b" }}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(226, 232, 240, 0.4)" }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="Events"
                      fill="#4f46e5"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Not enough data
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* AI Generations Area Chart */}
        <Card className="shadow-sm border-0">
          <CardHeader>
            <CardTitle>AI Usage Velocity</CardTitle>
            <CardDescription>
              Generations performed over recent days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {aiGenerationsData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={aiGenerationsData}
                    margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorGenerations"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8b5cf6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#64748b" }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="Generations"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorGenerations)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Not enough AI usage data
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Speaker Distribution */}
        <Card className="shadow-sm border-0 lg:col-span-1">
          <CardHeader>
            <CardTitle>Top Speakers</CardTitle>
            <CardDescription>Distribution of events by speaker</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full flex items-center justify-center">
              {speakerData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={speakerData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {speakerData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-muted-foreground">No data available</div>
              )}
            </div>
            <div className="mt-4 space-y-2">
              {speakerData.map((entry, index) => (
                <div
                  key={entry.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="truncate max-w-[150px] font-medium">
                      {entry.name}
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {entry.value} events
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Platform Activity */}
        <Card className="shadow-sm border-0 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity Stream</CardTitle>
            <CardDescription>
              Latest actions taken across the workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Mix and sort recent events, ai, and pdfs to create a fake timeline */}
              {[
                ...events.map((e) => ({
                  type: "event",
                  title: `Created event: ${e.eventName}`,
                  time: new Date(e.createdAt),
                })),
                ...aiHistory.map((a) => ({
                  type: "ai",
                  title: `Generated AI ${a.promptType} for ${a.eventName}`,
                  time: new Date(a.timestamp),
                })),
                ...pdfHistory.map((p) => ({
                  type: "pdf",
                  title: `Exported PDF for ${p.eventName}`,
                  time: new Date(p.timestamp),
                })),
              ]
                .sort((a, b) => b.time.getTime() - a.time.getTime())
                .slice(0, 5)
                .map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div
                      className={`mt-0.5 p-2 rounded-full ${
                        item.type === "event"
                          ? "bg-indigo-100 text-indigo-600"
                          : item.type === "ai"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {item.type === "event" && (
                        <CalendarDays className="h-4 w-4" />
                      )}
                      {item.type === "ai" && <Sparkles className="h-4 w-4" />}
                      {item.type === "pdf" && <FileText className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(item.time, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}

              {events.length === 0 &&
                aiHistory.length === 0 &&
                pdfHistory.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent activity to display.
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
