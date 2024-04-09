"use client";

import { useChat } from "ai/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import Image from "next/image";
import logo from "@/assets/wonkypedia.png";
import type { Element } from "hast";
import Search from "@/components/search";

export default function Article({
  title,
  article,
}: {
  title: string;
  article: string | null;
}) {
  const response = useStreamingResponse(title, !article);

  let markdown = `# ${title}` + (article ?? response);

  markdown = markdown
    .replace(
      /\[\[(.*?)\]\]/g,
      (_, p1) =>
        `[${p1}](/${encodeURIComponent(p1)}?ref=${encodeURIComponent(title)})`
    )
    .replace(/<\/article>/g, "");

  return (
    <div className="max-w-screen-lg mx-auto p-4 container">
      <div className="grid grid-cols-12 gap-x-12 gap-y-4">
        <div className="col-span-3">
          <a href="/">
            <Image src={logo} alt="Wonkypedia" width={94} height={94} />
          </a>
        </div>
        <div className="col-span-9">
          <Search />
        </div>
        <div className="col-span-3">
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
                <h3
                  className="text-lg font-semibold mb-2"
                  id={getHeaderId(node)}
                >
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
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
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
    </div>
  );
}

function useStreamingResponse(prompt: string, shouldStream: boolean) {
  const params = useSearchParams();
  const ref = params.get("ref");
  const { append, messages } = useChat({ body: { ref } });
  const startedRef = useRef(!shouldStream);

  const lastMessage = messages[messages.length - 1];

  useEffect(() => {
    if (!startedRef.current) {
      console.log("yeet");
      append({ role: "user", content: prompt });
    }
    startedRef.current = true;
  }, [prompt, append]);

  return lastMessage?.role === "assistant" ? lastMessage.content : "";
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
