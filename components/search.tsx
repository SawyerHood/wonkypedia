"use client";

export default function Search({ className }: { className?: string }) {
  return (
    <form
      className={`flex flex-row items-stretch border rounded overflow-hidden ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const searchQuery = formData.get("search");
        if (typeof searchQuery === "string") {
          window.location.href = `/${encodeURIComponent(searchQuery)}`;
        }
      }}
    >
      <input
        name="search"
        type="text"
        placeholder="Search Wonkypedia"
        className="flex-grow p-2"
        autoComplete="off"
      />
      <button type="submit" className="p-2 bg-gray-200">
        Search
      </button>
    </form>
  );
}
