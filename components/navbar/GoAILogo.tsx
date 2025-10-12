// GoAILogo.tsx
"use client";
import * as React from "react";

export type GoAILogoProps = React.SVGProps<SVGSVGElement> & {
  /** النص البديل داخل الـSVG (العنوان). اتركه فاضي يجعل الأيقونة decorative */
  title?: string;
  /** وصف أطول تحسيني لإمكانية الوصول */
  desc?: string;
  /** ألوان قابلة للتخصيص */
  wordmarkColor?: string; // لون "Go AI"
  taglineColor?: string; // لون السطر التعريفي
  markColor?: string; // لون علامة النمو (الزاويتين)
};

const GoAILogo = React.forwardRef<SVGSVGElement, GoAILogoProps>(
  (
    {
      title = "Go AI Logo",
      desc = "Wordmark 'Go AI' with blue upward-right double-corner mark and the tagline 'Elevate your business with AI' beneath.",
      wordmarkColor = "#0a0a0a",
      taglineColor = "#1f2937",
      markColor = "#1DA1F2",
      className,
      role = "img",
      ...rest
    },
    ref
  ) => {
    const titleId = React.useId();
    const descId = React.useId();

    // لو العنوان غير موجود نخليها decorative
    const labelled = title
      ? `${titleId} ${desc ? descId : ""}`.trim()
      : undefined;

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 800"
        role={role}
        aria-labelledby={labelled || undefined}
        aria-hidden={title ? undefined : true}
        className={className}
        focusable={false}
        {...rest}
      >
        {title ? <title id={titleId}>{title}</title> : null}
        {title && desc ? <desc id={descId}>{desc}</desc> : null}

        {/* Wordmark */}
        <text
          x={600}
          y={400}
          textAnchor="middle"
          fontFamily="Poppins, Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
          fontSize={160}
          fontWeight={700}
          fill={wordmarkColor}
          letterSpacing={1}
        >
          Go AI
        </text>

        {/* Tagline */}
        <text
          x={600}
          y={470}
          textAnchor="middle"
          fontFamily="Inter, Poppins, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
          fontSize={48}
          fontWeight={300}
          fill={taglineColor}
          letterSpacing={0.5}
        >
          Elevate your business with AI
        </text>

        {/* Arrow / growth mark (two rounded corners) */}
        <g transform="translate(820 305)">
          <path
            d="M0 42 L0 0 L42 0"
            fill="none"
            stroke={markColor}
            strokeWidth={22}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M28 70 L28 28 L70 28"
            fill="none"
            stroke={markColor}
            strokeWidth={22}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    );
  }
);

GoAILogo.displayName = "GoAILogo";
export default GoAILogo;
