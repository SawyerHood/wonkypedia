"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import logo from "@/assets/wonkypedia.png";
import Generate from "@/components/Generate";
import Link from "next/link";
import {
  afterArticleTag,
  beforeArticleTag,
  createHashLink,
  linkify,
  removeArticleTag,
} from "@/shared/articleUtils";
import MarkdownRenderer, {
  LinkOnlyRenderer,
} from "@/components/MarkdownRenderer";

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

  const { infobox, isLoading } = useInfobox(title, !!article);

  console.log(infobox);

  const thoughts = beforeArticleTag(article ?? response);

  let markdown = article ? article : afterArticleTag(response);

  markdown = markdown.trimStart();

  markdown = markdown.replace(/^(#+ .*\n+)+/, "");

  markdown = `# ${title}` + "\n" + markdown;

  markdown = removeArticleTag(linkify(markdown));

  return (
    <div className="max-w-screen-xl mx-auto container w-full grid grid-cols-9 md:grid-cols-12 md:gap-x-12 gap-y-4 p-4 overflow-hidden">
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
        {infobox && (
          <div className="float-right bg-white pl-4 pb-4 max-w-xs">
            <Infobox infobox={infobox} title={title} />
          </div>
        )}
        <MarkdownRenderer markdown={markdown} />
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

function useInfobox(title: string, shouldFetch: boolean) {
  const [infobox, setInfobox] = useState<{ [key: string]: string } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (shouldFetch && !startedRef.current) {
      startedRef.current = true;
      setIsLoading(true);
      fetch("/api/infobox", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      })
        .then((res) => res.json())
        .then((data) => {
          setInfobox(data);
          setIsLoading(false);
        });
    }
  }, [shouldFetch, setInfobox, setIsLoading, title]);

  return { infobox, isLoading };
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

function Infobox({
  infobox,
  title,
}: {
  infobox: { [key: string]: string };
  title: string;
}) {
  console.log(infobox);
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      {infobox.imageUrl && (
        <img src={infobox.imageUrl} alt={title} className="mb-4 w-full" />
      )}
      <table className="text-xs border-spacing-4">
        <tbody>
          {Object.entries(infobox).map(
            ([key, value]) =>
              key !== "imageUrl" &&
              key !== "imageDescription" && (
                <tr key={key}>
                  <td className="font-bold p-1">{key}</td>
                  <td className="p-1">
                    <LinkOnlyRenderer
                      markdown={linkify(
                        Array.isArray(value) ? value.join(" • ") : value
                      )}
                    />
                  </td>
                </tr>
              )
          )}
        </tbody>
      </table>
    </div>
  );
}
