"use client";
import * as React from "react";
import { FiCalendar, FiClock } from "react-icons/fi";
import { useTranslations } from "next-intl";

const Meta = React.memo(function Meta({
  date,
  readTime,
}: {
  date: string;
  readTime: string;
}) {
  const t = useTranslations("BLOGS.BLOG_META");

  return (
    <div className="mb-6 flex items-center gap-4 text-sm text-main-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <FiCalendar aria-hidden className="h-4 w-4" />
        <span aria-label={`${t("date")}: ${date}`}>{date}</span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <FiClock aria-hidden className="h-4 w-4" />
        <span aria-label={`${t("readTime")}: ${readTime}`}>{readTime}</span>
      </span>
    </div>
  );
});
export default Meta;
