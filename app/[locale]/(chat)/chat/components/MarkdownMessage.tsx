"use client";

import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import type { Schema } from "hast-util-sanitize";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

/* ===== Farsi→Arabic Normalizer (inline, no external deps) ===== */
function normalizeFarsiToArabic(input: string): string {
  if (!input) return "";
  return (
    input
      // ی → ي
      .replace(/\u06CC/g, "\u064A")
      // ک → ك
      .replace(/\u06A9/g, "\u0643")
      // ہ (do chashmi) → ه
      .replace(/\u06BE/g, "\u0647")
      // أرقام فارسية ۰-۹ → عربية هندية ٠-٩ (بدّل 0x0660 بـ 0x0030 لو عايز لاتينية)
      .replace(/[\u06F0-\u06F9]/g, (d) =>
        String.fromCharCode(d.charCodeAt(0) - 0x06f0 + 0x0660)
      )
  );
}

/* ===== Enhanced RTL Detection ===== */

const RTL_REGEX =
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0590-\u05FF]/;

const hasRTL = (s: string): boolean => RTL_REGEX.test(s || "");

function textFromChildren(children: React.ReactNode): string {
  let out = "";
  const walk = (node: React.ReactNode) => {
    if (node == null || node === false) return;
    if (typeof node === "string" || typeof node === "number") {
      out += String(node);
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (React.isValidElement(node)) {
      // @ts-expect-error children is generic
      walk(node.props?.children);
    }
  };
  walk(children);
  return out;
}

/**
 * Detect if text is primarily RTL
 * Returns true if RTL characters > 30% of total
 */
function isPrimaryRTL(text: string): boolean {
  if (!text) return false;

  const rtlMatches = text.match(RTL_REGEX);
  const rtlCount = rtlMatches ? rtlMatches.length : 0;

  // Remove whitespace and punctuation for accurate count
  const meaningfulChars = text.replace(/[\s\p{P}]/gu, "").length;

  if (meaningfulChars === 0) return false;

  const rtlRatio = rtlCount / meaningfulChars;
  return rtlRatio > 0.3; // If 30%+ is RTL, treat as RTL
}

/**
 * Isolate Latin/English runs in RTL text with proper Unicode isolates
 * This prevents visual reordering issues in mixed RTL/LTR text
 */
function isolateLatinRunsForRTL(input: string): string {
  if (!hasRTL(input)) return input;

  // Match English words, numbers, URLs, code-like patterns
  const LATIN_RUN =
    /[A-Za-z][A-Za-z0-9/_@#.\-]*|[\d]+[%\d()/:+.\-]*|https?:\/\/[^\s]+/g;

  return input.replace(LATIN_RUN, (match) => {
    // Left-to-Right Isolate (U+2066) + text + Pop Directional Isolate (U+2069)
    return `\u2066${match}\u2069`;
  });
}

/**
 * Fix mixed Arabic-English markdown headers and lists
 */
function fixMixedContentFormatting(text: string): string {
  if (!hasRTL(text)) return text;

  let fixed = text;

  // Fix list items with mixed content
  fixed = fixed.replace(
    /(^|\n)([-*+]|\d+\.)\s+([^\n]+)/gm,
    (match, prefix, bullet, content) => {
      if (hasRTL(content)) {
        const isolated = isolateLatinRunsForRTL(content);
        return `${prefix}${bullet} ${isolated}`;
      }
      return match;
    }
  );

  // Fix headers with mixed content
  fixed = fixed.replace(
    /(^|\n)(#{1,6})\s+([^\n]+)/gm,
    (match, prefix, hashes, content) => {
      if (hasRTL(content)) {
        const isolated = isolateLatinRunsForRTL(content);
        return `${prefix}${hashes} ${isolated}`;
      }
      return match;
    }
  );

  return fixed;
}

/* ===== Decode escapes from API ===== */
function decodeEscapes(raw: string): string {
  if (!raw) return "";
  let s = raw;

  // Decode common escape sequences
  s = s.replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "\t");

  // Decode Unicode escapes
  s = s.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );

  // Decode double backslashes
  s = s.replace(/\\\\/g, "\\");

  return s;
}

/* ===== Enhanced Markdown normalization ===== */
function normalizeMarkdown(raw: string): string {
  if (!raw) return "";
  let s = raw.trim();

  // Unwrap fenced code blocks if entire content is wrapped
  if (/^```/.test(s) && /```$/.test(s)) {
    s = s
      .replace(/^```[a-zA-Z0-9_-]*\n?/, "")
      .replace(/```$/, "")
      .trim();
  }

  // Unify bullet characters (including Arabic bullet •)
  s = s.replace(/(^|\n)\s*[\u2022\u2023\u2043\u2219]\s+/g, "$1- ");

  // Ensure heading has line before it
  s = s.replace(
    /([^\n])\s*(#{1,6})\s+/g,
    (_, prev, hashes) => `${prev}\n${hashes} `
  );

  // "Title - desc" pattern → heading + list (support Arabic)
  s = s.replace(
    /(^|\n)\s*([A-Za-z\u0600-\u06FF][^:\n\-–—]{2,120}?)\s*[-–—]\s+(?=\S)/g,
    (_, brk, title) => `${brk}### ${title.trim()}\n- `
  );

  // ". - " or ": - " or "؛ - " → new list line (support Arabic semicolon ؛)
  s = s.replace(/([.!?؛:])\s+(-|\*|\+)\s+/g, "$1\n$2 ");

  // Glued ordered items → new line
  s = s.replace(/([^\n])\s+(\d+)[\)\.]\s+(?=\S)/g, "$1\n$2. ");

  // "-text" → "- text"
  s = s.replace(/(^|\n)-(?=\S)/g, "$1- ");

  // Collapse excessive blank lines
  s = s.replace(/\n{3,}/g, "\n\n").replace(/[ \t]+\n/g, "\n");

  return s;
}

/* ===== Sanitize schema ===== */
const sanitizeSchema: Schema = {
  ...(defaultSchema as Schema),
  tagNames: [
    ...((defaultSchema as Schema).tagNames || []),
    "p",
    "br",
    "blockquote",
    "hr",
    "strong",
    "em",
    "del",
    "code",
    "pre",
    "kbd",
    "s",
    "u",
    "span",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "a",
  ],
  attributes: {
    ...((defaultSchema as Schema).attributes || {}),
    "*": [["dir"], ["lang"], ["style"]],
    a: [["href"], ["target"], ["rel"], ["title"], ["dir"], ["lang"]],
    code: [["className"], ["dir"], ["lang"]],
    pre: [["dir"], ["lang"]],
    th: [["align"], ["dir"], ["lang"]],
    td: [["align"], ["dir"], ["lang"]],
  },
  clobberPrefix: "md-",
};

/* ===== Main Component ===== */
function MarkdownMessageBase({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  /* UI locale (from next-intl) → fallback direction when content is neutral */
  const locale = useLocale();
  const rtlLocales = useMemo(
    () =>
      new Set([
        "ar",
        "ar-SA",
        "ar-EG",
        "fa",
        "ur",
        "he",
        "ps",
        "sd",
        "dv",
        "ckb",
      ]),
    []
  );
  const uiDir: "rtl" | "ltr" = rtlLocales.has(locale) ? "rtl" : "ltr";

  // 0) Normalize Farsi→Arabic first
  const arFixed = useMemo(() => normalizeFarsiToArabic(text ?? ""), [text]);

  // 1) Decode + normalize markdown
  const decoded = useMemo(() => decodeEscapes(arFixed), [arFixed]);
  const normalized = useMemo(() => normalizeMarkdown(decoded), [decoded]);

  // 2) Determine content direction (then fallback to UI dir)
  const contentRTL = useMemo(() => isPrimaryRTL(normalized), [normalized]);
  const rootDir: "rtl" | "ltr" = contentRTL ? "rtl" : uiDir;

  // 3) Extra fixes for mixed text when final dir is RTL
  const safeText = useMemo(() => {
    if (rootDir !== "rtl") return normalized;
    let processed = isolateLatinRunsForRTL(normalized);
    processed = fixMixedContentFormatting(processed);
    return processed;
  }, [normalized, rootDir]);

  // Markdown components with direction set per-node.
  type CodeProps = React.ComponentPropsWithoutRef<"code"> & {
    inline?: boolean;
    node?: unknown;
  };

  const components: Components = useMemo(
    () => ({
      a: ({ node, ...props }) => {
        void node;
        return (
          <a
            {...props}
            dir="auto"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className={cn("underline underline-offset-2 hover:opacity-80")}
          />
        );
      },

      p: ({ node, ...props }) => {
        void node;
        const content = textFromChildren(props.children);
        const pIsRTL = isPrimaryRTL(content);
        const dir = pIsRTL ? "rtl" : uiDir;
        return (
          <p
            {...props}
            dir={dir}
            className={cn(dir === "rtl" && "text-right")}
          />
        );
      },

      li: ({ node, ...props }) => {
        void node;
        const content = textFromChildren(props.children);
        const liIsRTL = isPrimaryRTL(content);
        const dir = liIsRTL ? "rtl" : uiDir;
        return (
          <li
            {...props}
            dir={dir}
            className={cn(dir === "rtl" && "text-right")}
          />
        );
      },

      ul: ({ node, ...props }) => {
        void node;
        return <ul {...props} dir="auto" />;
      },
      ol: ({ node, ...props }) => {
        void node;
        return <ol {...props} dir="auto" />;
      },

      h1: ({ node, ...props }) => {
        void node;
        const content = textFromChildren(props.children);
        const isR = isPrimaryRTL(content);
        const dir = isR ? "rtl" : uiDir;
        return (
          <h1
            {...props}
            dir={dir}
            className={cn(dir === "rtl" && "text-right")}
          />
        );
      },
      h2: ({ node, ...props }) => {
        void node;
        const content = textFromChildren(props.children);
        const isR = isPrimaryRTL(content);
        const dir = isR ? "rtl" : uiDir;
        return (
          <h2
            {...props}
            dir={dir}
            className={cn(dir === "rtl" && "text-right")}
          />
        );
      },
      h3: ({ node, ...props }) => {
        void node;
        const content = textFromChildren(props.children);
        const isR = isPrimaryRTL(content);
        const dir = isR ? "rtl" : uiDir;
        return (
          <h3
            {...props}
            dir={dir}
            className={cn(dir === "rtl" && "text-right")}
          />
        );
      },
      h4: ({ node, ...props }) => {
        void node;
        const content = textFromChildren(props.children);
        const isR = isPrimaryRTL(content);
        const dir = isR ? "rtl" : uiDir;
        return (
          <h4
            {...props}
            dir={dir}
            className={cn(dir === "rtl" && "text-right")}
          />
        );
      },
      h5: ({ node, ...props }) => {
        void node;
        const content = textFromChildren(props.children);
        const isR = isPrimaryRTL(content);
        const dir = isR ? "rtl" : uiDir;
        return (
          <h5
            {...props}
            dir={dir}
            className={cn(dir === "rtl" && "text-right")}
          />
        );
      },
      h6: ({ node, ...props }) => {
        void node;
        const content = textFromChildren(props.children);
        const isR = isPrimaryRTL(content);
        const dir = isR ? "rtl" : uiDir;
        return (
          <h6
            {...props}
            dir={dir}
            className={cn(dir === "rtl" && "text-right")}
          />
        );
      },

      blockquote: ({ node, ...props }) => {
        void node;
        return <blockquote {...props} dir="auto" />;
      },

      table: ({ node, ...props }) => {
        void node;
        return (
          <div className="overflow-x-auto my-4">
            <table {...props} dir="auto" className="min-w-full" />
          </div>
        );
      },

      code: ({ inline, className: cls, children, ...props }: CodeProps) =>
        inline ? (
          <code
            className={cn("px-1 py-0.5 rounded bg-muted", cls)}
            dir="ltr"
            {...props}
          >
            {children}
          </code>
        ) : (
          <pre dir="ltr" className="overflow-x-auto">
            <code className={cn(cls)} {...props}>
              {children}
            </code>
          </pre>
        ),
    }),
    [uiDir]
  );

  // Arabic font stack (applied only for RTL root)
  const arabicFontStack = [
    '"Noto Sans Arabic"',
    '"Cairo"',
    '"IBM Plex Sans Arabic"',
    '"Tajawal"',
    '"Dubai"',
    '"Segoe UI"',
    "system-ui",
    "sans-serif",
  ].join(",");

  return (
    <div
      className={cn("md-prose chat-bubble", className)}
      dir={rootDir}
      lang={rootDir === "rtl" ? "ar" : "en"}
      style={{
        whiteSpace: "normal",
        overflowWrap: "anywhere",
        wordBreak: "normal",
        textRendering: "optimizeLegibility",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        fontVariantLigatures: "common-ligatures contextual",
        fontKerning: "normal",
        fontFamily: rootDir === "rtl" ? arabicFontStack : undefined,
        lineHeight: rootDir === "rtl" ? "1.8" : "1.6",
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
        components={components}
      >
        {safeText}
      </ReactMarkdown>
    </div>
  );
}

export default React.memo(MarkdownMessageBase);
