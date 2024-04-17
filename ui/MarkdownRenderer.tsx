import Markdown from "react-markdown";
import type { Element } from "hast";
import Link from "next/link";
import { createHashLink } from "@/shared/articleUtils";

export default function MarkdownRenderer({ markdown }: { markdown: string }) {
  return (
    <Markdown
      className="text-sm"
      components={{
        h1: ({ children, node }) => (
          <h1
            className="text-3xl mb-2 pb-2 border-b font-serif"
            id={getHeaderId(node)}
          >
            {children}
          </h1>
        ),
        h2: ({ children, node }) => (
          <h2
            className="text-2xl mb-2 pb-2 border-b font-serif"
            id={getHeaderId(node)}
          >
            {children}
          </h2>
        ),

        h3: ({ children, node }) => (
          <h3 className="text-lg font-semibold mb-2" id={getHeaderId(node)}>
            {children}
          </h3>
        ),
        h4: ({ children, node }) => (
          <h4 className="text-base font-semibold mb-2" id={getHeaderId(node)}>
            {children}
          </h4>
        ),
        p: ({ children }) => <p className="text-gray mb-4">{children}</p>,
        a: ({ children, href }) => (
          <Link
            href={href ?? ""}
            className="text-blue-500 hover:underline"
            prefetch={false}
          >
            {children}
          </Link>
        ),
        ul: ({ children }) => (
          <ul className="list-disc ml-4 mb-4">{children}</ul>
        ),
        li: ({ children }) => <li className="mb-2">{children}</li>,
        ol: ({ children }) => (
          <ol className="list-decimal ml-4 mb-4">{children}</ol>
        ),
      }}
    >
      {markdown}
    </Markdown>
  );
}

function getHeaderId(node: Element | undefined) {
  return node?.children?.[0]?.type === "text"
    ? createHashLink(String(node.children?.[0]?.value)).slice(1)
    : "";
}

export function LinkOnlyRenderer({ markdown }: { markdown: string }) {
  return (
    <Markdown
      components={{
        a: ({ children, href }) => (
          <Link
            href={href ?? ""}
            className="text-blue-500 hover:underline"
            prefetch={false}
          >
            {children}
          </Link>
        ),
      }}
    >
      {markdown}
    </Markdown>
  );
}
