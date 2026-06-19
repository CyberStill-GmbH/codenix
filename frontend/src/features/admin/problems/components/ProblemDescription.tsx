import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

import 'highlight.js/styles/github-dark.css'

import { renderBasicMath } from '@/features/admin/problems/components/problem-form/utils/mathText'

type ProblemDescriptionProps = {
  markdown: string
}

export function ProblemDescription({ markdown }: ProblemDescriptionProps) {
  return (
    <div className="prose-problem max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSanitize]}
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
            <p className="my-3 leading-7 text-[var(--color-text-soft)]">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-[var(--color-text)]">{children}</strong>
          ),
          code: ({ children, className }) => {
            const isBlock = Boolean(className)

            if (isBlock) {
              return <code className={className}>{children}</code>
            }

            return (
              <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[var(--color-text)]">
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre className="my-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-[var(--color-text-soft)]">
              {children}
            </pre>
          ),
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
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto">
              <table className="w-full border-collapse overflow-hidden rounded-xl border border-slate-800 text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-slate-900">{children}</thead>,
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
        {renderBasicMath(markdown)}
      </ReactMarkdown>
    </div>
  )
}
