/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import {
  afterArticleTag,
  createHashLink,
  linkify,
  removeArticleTag,
} from "@/shared/articleUtils";
import MarkdownRenderer, { LinkOnlyRenderer } from "@/ui/MarkdownRenderer";
import { decodeChunk } from "@/shared/encoding";
import { throttle } from "throttle-debounce";
import { Grid } from "@/ui/Grid";

export default function Article({
  title,
  article,
}: {
  title: string;
  article: {
    title: string;
    content: string | null;
    createdAt: string;
    imageUrl: string | null;
    infobox: unknown;
  } | null;
}) {
  const isGenerating = !article;
  const {
    article: streamedResponse,
    infobox: streamedInfoBox,
    imgUrl: streamedImgUrl,
    isLoading,
  } = useGeneratedArticle(title, isGenerating);

  const infobox = article?.infobox ?? streamedInfoBox;
  const imgUrl = article?.imageUrl ?? streamedImgUrl;

  let markdown = article?.content
    ? article?.content
    : afterArticleTag(streamedResponse ?? "");

  markdown = markdown.trimStart();

  markdown = markdown.replace(/^(#+ .*\n+)+/, "");

  markdown = `# ${title}` + "\n" + markdown;

  markdown = removeArticleTag(linkify(markdown));

  return (
    <Grid className="p-4">
      <div className="col-span-3 hidden md:block">
        <Contents markdown={markdown} />
      </div>
      <div className="col-span-9">
        <div className="md:float-right md:max-w-xs md:pl-4 pb-4 max-w-full bg-white w-full">
          {infobox && (
            <Infobox
              infobox={infobox as any}
              title={title}
              imgUrl={imgUrl ?? null}
              isLoading={isLoading}
            />
          )}
          {!infobox && isLoading && (
            <div className="animate-pulse bg-gray-300 p-4 rounded-lg w-full h-80"></div>
          )}
        </div>
        {isGenerating &&
        markdown.split("\n").filter((l) => Boolean(l.trim())).length < 2 ? (
          <>
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </>
        ) : (
          <MarkdownRenderer markdown={markdown} />
        )}
      </div>
    </Grid>
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
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!shouldStream || startedRef.current || localCache[title]) {
      return;
    }

    startedRef.current = true;
    setIsLoading(true);

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
        console.log("message", message);
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
      setIsLoading(false);
    });
  }, [title, shouldStream]);
  return {
    article: article ?? localCache[title]?.article,
    infobox: infobox ?? localCache[title]?.infobox,
    imgUrl: imgUrl ?? localCache[title]?.imgUrl,
    isLoading,
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
  isLoading,
}: {
  infobox: { [key: string]: string };
  title: string;
  imgUrl: string | null;
  isLoading: boolean;
}) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      {imgUrl && <img src={imgUrl} alt={title} className="mb-4 w-full" />}
      {!imgUrl && isLoading && (
        <div className="animate-pulse bg-gray-300 w-full aspect-square mb-4"></div>
      )}
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
    <div className="animate-pulse space-y-4 mb-4 md:w-4/6 md:pr-4">
      <div className="h-6 bg-gray-300 rounded"></div>
      <div className="h-6 bg-gray-300 rounded w-5/6"></div>
      <div className="h-6 bg-gray-300 rounded w-5/6"></div>
      <div className="h-6 bg-gray-300 rounded w-5/6"></div>
    </div>
  );
};
