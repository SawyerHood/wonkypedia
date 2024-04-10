"use client";

import { titleToUri } from "@/shared/articleUtils";
import { useRouter } from "next/navigation";

export default function Generate({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <form
      className={`flex flex-row items-stretch border rounded overflow-hidden ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const searchQuery = formData.get("search");
        if (typeof searchQuery === "string") {
          router.push(`/${titleToUri(searchQuery)}`);
        }
      }}
    >
      <input
        name="search"
        type="text"
        placeholder="What do you want to create?"
        className="flex-grow p-2"
        autoComplete="off"
      />
      <button type="submit" className="p-2 bg-gray-200">
        Create
      </button>
    </form>
  );
}
