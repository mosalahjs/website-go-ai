"use client";

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MessageSquare,
  BookOpen,
  FileText,
  Activity,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { api } from "@/lib/api";
import { Chunk, Session, Topic } from "@/types/dashboard";

type Stats = {
  totalSessions: number;
  totalTopics: number;
  totalChunks: number;
  totalMessages: number;
};

type DistItem = {
  name: string;
  value: number;
  percentage: number;
  color: string;
};

type ActivityItem = {
  date: string;
  messages: number;
  sessions: number;
};

const COLORS = {
  blue: "#2563EB",
  blueFillFrom: "rgba(37, 99, 235, 0.25)",
  blueFillTo: "rgba(37, 99, 235, 0.00)",
  green: "#16A34A",
  greenFillFrom: "rgba(22, 163, 74, 0.20)",
  greenFillTo: "rgba(22, 163, 74, 0.00)",
  purple: "#7C3AED",
  card: "hsl(var(--card))",
  border: "hsl(var(--border))",
  mutedFg: "hsl(var(--muted-foreground))",
};

const StatCard = memo(function StatCard({
  title,
  value,
  description,
  Icon,
  trend,
  gradient,
  indexDelay = 0,
}: {
  title: string;
  value: number;
  description: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  trend: string;
  gradient: string;
  indexDelay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: indexDelay * 0.08 }}
    >
      <Card className="glass-card-dash card-dash border-2 border-dash transition-all group overflow-hidden relative">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 group-hover:opacity-70 transition-opacity`}
        />
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shadow-lg glow-dash">
              <Icon className="h-7 w-7 text-white" aria-hidden="true" />
            </div>
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20"
              aria-label="trend"
            >
              <TrendingUp
                className="h-3.5 w-3.5 text-emerald-500"
                aria-hidden="true"
              />
              <span className="text-xs font-semibold text-emerald-600">
                {trend}
              </span>
            </div>
          </div>
          <div>
            <p className="text-4xl font-bold mb-1">{value.toLocaleString()}</p>
            <p className="text-sm font-semibold mb-1">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default memo(function Dashboard() {
  const t = useTranslations("dashboard.dashboard");
  const locale = useLocale();

  const [stats, setStats] = useState<Stats>({
    totalSessions: 0,
    totalTopics: 0,
    totalChunks: 0,
    totalMessages: 0,
  });

  const [activityData, setActivityData] = useState<ActivityItem[]>([]);
  const [distributionData, setDistributionData] = useState<DistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const formatDate = useCallback(
    (d: Date) =>
      d.toLocaleDateString(locale, {
        month: "short",
        day: "numeric",
      }),
    [locale]
  );

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const controller = new AbortController();
      const signal = controller.signal;

      const [sessionsRes, topicsRes, chunksRes] = await Promise.all([
        api.getSessions({ signal }) as unknown as Promise<{
          success: boolean;
          data?: Session[];
        }>,
        api.getTopics({ signal }) as unknown as Promise<{
          success: boolean;
          data?: Topic[];
        }>,
        api.getChunks({ signal }) as unknown as Promise<{
          success: boolean;
          data?: Chunk[];
        }>,
      ]);

      if (!mountedRef.current) return;

      let sessionCount = 0;
      let topicCount = 0;
      let chunkCount = 0;
      let messageCount = 0;

      if (sessionsRes?.success && sessionsRes.data) {
        sessionCount = sessionsRes.data.length;
        messageCount = sessionsRes.data.reduce(
          (acc, s) => acc + (Array.isArray(s.messages) ? s.messages.length : 0),
          0
        );

        const today = new Date();
        const items: ActivityItem[] = Array.from({ length: 30 }, (_, i) => {
          const date = new Date(today);
          date.setDate(date.getDate() - (29 - i));
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          const baseActivity = isWeekend ? 15 : 45;
          const variance = Math.random() * 20;
          return {
            date: formatDate(date),
            messages: Math.floor(baseActivity + variance),
            sessions: Math.floor((baseActivity + variance) / 3),
          };
        });
        setActivityData(items);
      }

      if (topicsRes?.success && topicsRes.data) {
        topicCount = topicsRes.data.length;
      }

      if (chunksRes?.success && chunksRes.data) {
        chunkCount = chunksRes.data.length;
        const topicMap = new Map<string, number>();

        chunksRes.data.forEach((chunk) => {
          const topicId =
            (chunk as Partial<{ topic_id: string }>).topic_id ??
            (chunk as Record<string, unknown>)["topic_id"];

          const topicName =
            topicsRes.data?.find((t) => t.id === topicId)?.name || t("unknown");

          topicMap.set(topicName, (topicMap.get(topicName) || 0) + 1);
        });

        const donutPalette = [
          COLORS.blue,
          COLORS.green,
          COLORS.purple,
          COLORS.blue,
        ];

        const distributionArr = Array.from(topicMap.entries()).map(
          ([name, value], index): DistItem => ({
            name,
            value,
            percentage: 0,
            color: donutPalette[index % donutPalette.length],
          })
        );

        const total =
          distributionArr.reduce((sum, item) => sum + item.value, 0) || 1;
        distributionArr.forEach((item) => {
          item.percentage = Math.round((item.value / total) * 100);
        });

        setDistributionData(distributionArr);
      }

      setStats({
        totalSessions: sessionCount,
        totalTopics: topicCount,
        totalChunks: chunkCount,
        totalMessages: messageCount,
      });
    } catch {
      // silent
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [formatDate, t]);

  useEffect(() => {
    void loadDashboardData();
  }, [loadDashboardData]);

  const statCards = useMemo(
    () => [
      {
        title: t("stats.totalSessions.title"),
        value: stats.totalSessions,
        description: t("stats.totalSessions.desc"),
        icon: MessageSquare,
        trend: "+12.5%",
        gradient: "from-blue-500/20 to-blue-600/5",
      },
      {
        title: t("stats.totalTopics.title"),
        value: stats.totalTopics,
        description: t("stats.totalTopics.desc"),
        icon: BookOpen,
        trend: "+8.2%",
        gradient: "from-purple-500/20 to-purple-600/5",
      },
      {
        title: t("stats.totalChunks.title"),
        value: stats.totalChunks,
        description: t("stats.totalChunks.desc"),
        icon: FileText,
        trend: "+23.1%",
        gradient: "from-emerald-500/20 to-emerald-600/5",
      },
      {
        title: t("stats.totalMessages.title"),
        value: stats.totalMessages,
        description: t("stats.totalMessages.desc"),
        icon: Activity,
        trend: "+15.3%",
        gradient: "from-orange-500/20 to-orange-600/5",
      },
    ],
    [stats, t]
  );

  return (
    <div className="h-full min-h-0 overflow-x-hidden p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {t("title")}
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">{t("subtitle")}</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? [...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))
          : statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <StatCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  description={stat.description}
                  Icon={Icon}
                  trend={stat.trend}
                  gradient={stat.gradient}
                  indexDelay={index}
                />
              );
            })}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="glass-card-dash card-dash border-2 border-dash overflow-visible py-8">
            <CardHeader className="overflow-visible">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Activity
                      className="size-6"
                      style={{ color: COLORS.blue }}
                      aria-hidden="true"
                    />
                    {t("charts.activity.title")}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("charts.activity.subtitle")}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div
                    className="flex items-center gap-2"
                    aria-label={t("charts.activity.legend.messages")}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS.blue }}
                    />
                    <span className="text-muted-foreground">
                      {t("charts.activity.legend.messages")}
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-2"
                    aria-label={t("charts.activity.legend.sessions")}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS.green }}
                    />
                    <span className="text-muted-foreground">
                      {t("charts.activity.legend.sessions")}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="overflow-visible">
              {loading ? (
                <Skeleton className="h-[350px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient
                        id="fillMessages"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={COLORS.blue}
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor={COLORS.blue}
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="fillSessions"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={COLORS.green}
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor={COLORS.green}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted/30"
                    />
                    <XAxis
                      dataKey="date"
                      className="text-xs"
                      tick={{ fill: COLORS.mutedFg }}
                      interval={4}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: COLORS.mutedFg }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: COLORS.card,
                        border: `2px solid ${COLORS.border}`,
                        borderRadius: "12px",
                        padding: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="messages"
                      stroke={COLORS.blue}
                      strokeWidth={3}
                      fill="url(#fillMessages)"
                    />
                    <Area
                      type="monotone"
                      dataKey="sessions"
                      stroke={COLORS.green}
                      strokeWidth={3}
                      fill="url(#fillSessions)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="glass-card-dash card-dash border-2 border-dash h-full overflow-visible py-8">
            <CardHeader className="overflow-visible">
              <CardTitle className="text-2xl flex items-center gap-2">
                <FileText
                  className="h-6 w-6"
                  style={{ color: COLORS.blue }}
                  aria-hidden="true"
                />
                {t("charts.distribution.title")}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {t("charts.distribution.subtitle")}
              </p>
            </CardHeader>
            <CardContent className="overflow-visible">
              {loading ? (
                <Skeleton className="h-[280px] w-full" />
              ) : distributionData.length === 0 ? (
                <div className="flex items-center justify-center h-[280px] text-muted-foreground">
                  {t("charts.distribution.empty")}
                </div>
              ) : (
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: COLORS.card,
                          border: `2px solid ${COLORS.border}`,
                          borderRadius: "12px",
                          padding: "8px 12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="space-y-2 pt-4 border-t-2">
                    {distributionData.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-medium truncate max-w-[120px]">
                            {item.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            {item.value}
                          </span>
                          <span
                            className="font-semibold"
                            style={{ color: COLORS.blue }}
                          >
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
});
