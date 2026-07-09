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
      <pre className="my-4 overflow-x-auto rounded-lg border border-[var(--color-error)]/30 bg-[var(--color-error-soft)] p-4 text-xs text-[var(--color-error)]">
        {chart}
      </pre>
    );
  }

  return (
    <div
      className="my-4 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/60 p-4"
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

  if (className) {
    return <code className={className}>{children}</code>;
  }

  return (
    <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[var(--color-text)]">
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
            <blockquote className="my-4 border-l-4 border-[var(--color-primary)] bg-slate-900/45 px-4 py-2 text-[var(--color-text-soft)]">
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
              <pre className="my-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-[var(--color-text-soft)]">
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
          hr: () => <hr className="my-6 border-slate-800" />,
          img: ({ alt, src }) => (
            <img
              alt={alt ?? ""}
              src={src ?? ""}
              className="my-4 max-h-[520px] rounded-lg border border-slate-800 object-contain"
              loading="lazy"
            />
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto">
              <table className="w-full border-collapse overflow-hidden rounded-xl border border-slate-800 text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-900">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border border-slate-800 px-3 py-2 text-left font-bold text-[var(--color-text)]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-slate-800 px-3 py-2 text-[var(--color-text-soft)]">
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
