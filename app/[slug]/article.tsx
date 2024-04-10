"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import Image from "next/image";
import logo from "@/assets/wonkypedia.png";
import type { Element } from "hast";
import Generate from "@/components/generate";
import Link from "next/link";
import {
  afterArticleTag,
  beforeArticleTag,
  hasThoughtsTag,
  removeArticleTag,
} from "@/shared/articleUtils";

export default function Article({
  title,
  article,
}: {
  title: string;
  article: string | null;
}) {
  const response = useStreamingResponse(
    title,
    !article && !localCache.has(title)
  );

  const thoughts = beforeArticleTag(article ?? response);

  let markdown = article ? article : afterArticleTag(response);

  markdown = markdown.trimStart();

  markdown = markdown.replace(/^(#+ .*\n+)+/, "");

  markdown = `# ${title}` + "\n" + markdown;

  markdown = removeArticleTag(
    markdown.replace(
      /\[\[(.*?)(?:\|(.*?))?\]\]/g,
      (_, p1, p2) => `[${p2 || p1}](/${encodeURIComponent(p1)})`
    )
  );

  return (
    <div className="max-w-screen-lg mx-auto container w-full grid grid-cols-9 md:grid-cols-12 md:gap-x-12 gap-y-4 p-4 overflow-hidden">
      <Link href="/" className="flex items-center col-span-9 md:hidden">
        <Image src={logo} alt="Wonkypedia" width={50} height={50} />
        <span className="ml-2 text-2xl font-serif">Wonkypedia</span>
      </Link>
      <div className="col-span-3 hidden md:block">
        <Link href="/">
          <Image src={logo} alt="Wonkypedia" width={94} height={94} />
        </Link>
      </div>
      <div className="col-span-9">
        <Generate />
      </div>
      <div className="col-span-3 hidden md:block">
        <Contents markdown={markdown} />
      </div>
      <div className="col-span-9">
        <Markdown
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
              <h4
                className="text-base font-semibold mb-2"
                id={getHeaderId(node)}
              >
                {children}
              </h4>
            ),
            p: ({ children }) => <p className="text-gray mb-4">{children}</p>,
            a: ({ children, href }) => (
              <Link href={href ?? ""} className="text-blue-500 hover:underline">
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
      </div>
    </div>
  );
}

const localCache = new Map<string, string>();

function useStreamingResponse(prompt: string, shouldStream: boolean) {
  const { append, messages } = useChat();
  const startedRef = useRef(!shouldStream);

  const lastMessage = messages[messages.length - 1];

  useEffect(() => {
    if (!startedRef.current) {
      append({ role: "user", content: prompt });
    }

    startedRef.current = true;
  }, [prompt, append]);

  useEffect(() => {
    if (lastMessage?.role === "assistant") {
      localCache.set(prompt, lastMessage.content);
    }
  }, [lastMessage, prompt]);

  return lastMessage?.role === "assistant"
    ? lastMessage.content
    : localCache.get(prompt) ?? "";
}

function Contents({ markdown }: { markdown: string }) {
  const headers = [];
  const regex = /#+\s(.+)/g;
  let match;
  while ((match = regex.exec(markdown))) {
    headers.push(match[1]);
  }

  const headerLinks = headers.map((header, index) =>
    index === 0 ? (
      <li key={index}>
        <a href="#" className="font-semibold text-sm hover:underline mb-1">
          (Top)
        </a>
      </li>
    ) : (
      <li key={index} className="text-blue-500 text-sm hover:underline mb-1">
        <a href={createHashLink(header)} title={header}>
          {header}
        </a>
      </li>
    )
  );

  if (headerLinks.length <= 1) {
    return null;
  }

  return (
    <div className="sticky top-2">
      <h3 className="text-md mb-2 border-b mt-5 font-semibold">Contents</h3>
      <ul className="mb-4">{headerLinks}</ul>
    </div>
  );
}

function createHashLink(header: string) {
  return `#${header.toLowerCase().replace(/\s+/g, "-")}`;
}

function getHeaderId(node: Element | undefined) {
  return node?.children?.[0]?.type === "text"
    ? createHashLink(String(node.children?.[0]?.value)).slice(1)
    : "";
}
