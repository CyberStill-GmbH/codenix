import { ProblemMarkdownRenderer } from "@/features/problems/components/ProblemMarkdownRenderer";

type ProblemDescriptionProps = {
  markdown: string;
};

export function ProblemDescription({ markdown }: ProblemDescriptionProps) {
  return <ProblemMarkdownRenderer markdown={markdown} />;
}
