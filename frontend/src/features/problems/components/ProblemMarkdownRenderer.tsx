import { useEffect, useId, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import mermaid from "mermaid";

import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";

type ProblemMarkdownRendererProps = {
  markdown: string;
};

type CodeProps = {
  children?: React.ReactNode;
  className?: string;
};

mermaid.initialize({
  startOnLoad: false,
  securityLevel: "strict",
  theme: "dark",
});

function MermaidDiagram({ chart }: { chart: string }) {
  const rawId = useId();
  const diagramId = `mermaid-${rawId.replace(/:/g, "")}`;
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function renderDiagram() {
      try {
        const result = await mermaid.render(diagramId, chart);
        if (isMounted) {
          setSvg(result.svg);
          setError("");
        }
      } catch {
        if (isMounted) {
          setSvg("");
          setError("Mermaid diagram could not be rendered.");
        }
      }
    }

    void renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [chart, diagramId]);

  if (error) {
    return (
      <pre className="my-3 overflow-x-auto text-xs text-[var(--color-error)]">
        {chart}
      </pre>
    );
  }

  return (
    <div
      className="my-3 overflow-x-auto text-[var(--color-text)]"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function Code({ children, className }: CodeProps) {
  const language = className?.replace("language-", "");
  const value = String(children ?? "").replace(/\n$/, "");

  if (language === "mermaid") {
    return <MermaidDiagram chart={value} />;
  }

  const isBlock = String(children).includes("\n");

  if (className || isBlock) {
    return <code className={`${className ?? ""} !bg-transparent !p-0`}>{children}</code>;
  }

  return (
    <code className="rounded-sm bg-[var(--color-surface-soft)] px-1 py-0.5 font-mono text-[13px] text-[var(--color-text)]">
      {children}
    </code>
  );
}

export function ProblemMarkdownRenderer({
  markdown,
}: ProblemMarkdownRendererProps) {
  return (
    <div className="prose-problem max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-4 font-display text-3xl font-bold text-[var(--color-text)]">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-3 mt-7 font-display text-2xl font-bold text-[var(--color-text)]">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-5 text-lg font-bold text-[var(--color-text)]">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="my-3 leading-7 text-[var(--color-text-soft)]">
              {children}
            </p>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              className="font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline"
              rel="noreferrer"
              target={href?.startsWith("http") ? "_blank" : undefined}
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-[var(--color-text)]">
              {children}
            </strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-3 border-l-2 border-[var(--color-border-strong)] pl-3 text-[var(--color-text-muted)] italic">
              {children}
            </blockquote>
          ),
          code: Code,
          pre: ({ children }) => {
            const child = Array.isArray(children) ? children[0] : children;
            if (
              typeof child === "object" &&
              child !== null &&
              "props" in child &&
              (child as { props?: { className?: string } }).props?.className ===
                "language-mermaid"
            ) {
              return <>{children}</>;
            }

            return (
              <pre className="my-2 overflow-x-auto pl-3 border-l-2 border-[var(--color-border-soft)] font-mono text-[13px] leading-relaxed text-[var(--color-text-soft)] !bg-transparent !p-0">
                {children}
              </pre>
            );
          },
          ul: ({ children }) => (
            <ul className="my-3 ml-5 list-disc space-y-1 text-[var(--color-text-soft)]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3 ml-5 list-decimal space-y-1 text-[var(--color-text-soft)]">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          hr: () => <hr className="my-6 border-[var(--color-border)]" />,
          img: ({ alt, src }) => (
            <img
              alt={alt ?? ""}
              src={src ?? ""}
              className="my-3 max-h-[400px] object-contain"
              loading="lazy"
            />
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto">
              <table className="my-3 w-full border-collapse text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-[var(--color-border-strong)] text-left">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="py-2 pr-4 font-bold text-[var(--color-text)]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-[var(--color-border-soft)] py-2 pr-4 text-[var(--color-text-soft)]">
              {children}
            </td>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
