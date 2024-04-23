"use client";

import Image from "next/image";

export function ArticleCard({
  title,
  content,
  image,
}: {
  title: string;
  content: React.ReactNode;
  image?: string | null;
}) {
  return (
    <div className="p-4 my-2 mx-auto bg-white rounded shadow overflow-hidden max-w-full md:max-w-2xl w-full flex flex-row">
      {image ? (
        <Image
          src={image || ""}
          alt={title}
          width={100}
          height={100}
          className="w-24 h-24 rounded-full"
        />
      ) : null}
      <div>
        <a
          href={`/article/${title}`}
          className="no-underline hover:underline text-blue-500"
        >
          <h2 className="text-lg font-medium">{title}</h2>
        </a>
        <p className="text-gray-600">{content}</p>
      </div>
    </div>
  );
}
