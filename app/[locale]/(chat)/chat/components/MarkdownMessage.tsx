"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { cn } from "@/lib/utils";

function MarkdownMessageBase({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  type AnchorProps = React.ComponentProps<"a">;
  type CodeProps = React.ComponentProps<"code"> & { inline?: boolean };

  const components: Components = {
    a: (props: AnchorProps) => (
      <a {...props} className="underline underline-offset-2" />
    ),
    code: ({ inline, className: cls, children, ...props }: CodeProps) => {
      if (inline) {
        return (
          <code className={cn("text-[0.85em]", cls)} {...props}>
            {children}
          </code>
        );
      }
      return (
        <pre className="rounded-lg border bg-muted p-3 overflow-x-auto">
          <code className={cn("text-sm leading-relaxed", cls)} {...props}>
            {children}
          </code>
        </pre>
      );
    },
  };

  return (
    <div
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap break-words",
        "[&_.prose]:max-w-none [&_p]:my-2 [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-1",
        "[&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:bg-muted",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          [
            rehypeSanitize,
            {
              ...defaultSchema,
              attributes: {
                ...defaultSchema.attributes,
                a: [
                  ...(defaultSchema.attributes?.a || []),
                  ["target", "_blank"],
                  ["rel", "noopener noreferrer nofollow"],
                ],
              },
            },
          ],
        ]}
        components={components}
      >
        {text ?? ""}
      </ReactMarkdown>
    </div>
  );
}

const MarkdownMessage = React.memo(MarkdownMessageBase);
export default MarkdownMessage;
