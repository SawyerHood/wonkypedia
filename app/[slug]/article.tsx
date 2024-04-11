"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import logo from "@/assets/wonkypedia.png";
import Generate from "@/ui/Generate";
import Link from "next/link";
import {
  afterArticleTag,
  createHashLink,
  linkify,
  removeArticleTag,
} from "@/shared/articleUtils";
import MarkdownRenderer, { LinkOnlyRenderer } from "@/ui/MarkdownRenderer";
import { decodeChunk } from "@/shared/encoding";
import { throttle } from "throttle-debounce";
import { Database } from "@/db/schema";

export default function Article({
  title,
  article,
}: {
  title: string;
  article: Database["public"]["Tables"]["articles"]["Row"] | null;
}) {
  const {
    article: streamedResponse,
    infobox: streamedInfoBox,
    imgUrl: streamedImgUrl,
  } = useGeneratedArticle(title, !article);

  const infobox = article?.infobox ?? streamedInfoBox;
  const imgUrl = article?.image_url ?? streamedImgUrl;

  let markdown = article?.content
    ? article?.content
    : afterArticleTag(streamedResponse ?? "");

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
          <div className="md:float-right md:max-w-xs md:pl-4 md:pb-4 max-w-full bg-white">
            <Infobox infobox={infobox as any} title={title} imgUrl={imgUrl} />
          </div>
        )}
        <MarkdownRenderer markdown={markdown} />
      </div>
    </div>
  );
}

const localCache: Record<
  string,
  {
    article?: string | null;
    infobox?: { [key: string]: string } | null;
    imgUrl?: string | null;
  }
> = {};

function useGeneratedArticle(title: string, shouldStream: boolean) {
  const [article, setArticle] = useState<string | null>(null);
  const [infobox, setInfobox] = useState<{ [key: string]: string } | null>(
    null
  );
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const startedRef = useRef(false);
  useEffect(() => {
    if (!shouldStream || startedRef.current || localCache[title]) {
      return;
    }

    startedRef.current = true;

    const updateCache = <T extends keyof (typeof localCache)[string]>(
      key: T,
      value: (typeof localCache)[string][T]
    ) => {
      if (!localCache[title]) {
        localCache[title] = {};
      }
      localCache[title][key] = value;
    };

    let article = "";

    const setArticleThrottled = throttle(100, setArticle);
    const onChunk = (chunk: string) => {
      const messages = decodeChunk(chunk);
      for (const message of messages) {
        switch (message.type) {
          case "article-chunk":
            article += message.value;
            updateCache("article", article);
            setArticleThrottled(article);
            break;
          case "info-box":
            setInfobox(JSON.parse(message.value));
            updateCache("infobox", JSON.parse(message.value));
            break;
          case "image":
            setImgUrl(message.value);
            updateCache("imgUrl", message.value);
            break;
        }
      }
    };
    fetchArticle(title, onChunk).then(() => {
      console.log(article);
    });
  }, [title, shouldStream]);
  return {
    article: article ?? localCache[title]?.article,
    infobox: infobox ?? localCache[title]?.infobox,
    imgUrl: imgUrl ?? localCache[title]?.imgUrl,
  };
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
  imgUrl,
}: {
  infobox: { [key: string]: string };
  title: string;
  imgUrl: string | null;
}) {
  console.log(infobox);
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      {imgUrl && <img src={imgUrl} alt={title} className="mb-4 w-full" />}
      <table className="text-xs border-spacing-4">
        <tbody>
          {Object.entries(infobox).map(
            ([key, value]) =>
              key !== "imageDescription" && (
                <tr key={key}>
                  <td className="font-bold p-1 min-w-24">{key}</td>
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

async function fetchArticle(title: string, onChunk: (chunk: string) => void) {
  try {
    const response = await fetch("/api/genArticle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const articleStream = await response.body
      ?.pipeThrough(new TextDecoderStream())
      .getReader();
    if (!articleStream) {
      throw new Error("No article stream");
    }
    while (true) {
      const { done, value } = await articleStream.read();
      if (done) break;
      onChunk(value);
    }
  } catch (error) {
    console.error("Error fetching article:", error);
    throw error;
  }
}

const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-10 bg-gray-300 rounded"></div>
      <div className="h-6 bg-gray-300 rounded w-5/6"></div>
      <div className="h-6 bg-gray-300 rounded w-5/6"></div>
      <div className="h-6 bg-gray-300 rounded w-5/6"></div>
    </div>
  );
};
