export const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
  });
};

export const titleToUri = (title: string) => {
  return encodeURIComponent(toTitleCase(title));
};

export const uriToTitle = (uri: string) => {
  return toTitleCase(decodeURIComponent(uri)).trim();
};

export const createMarkdown = ({
  title,
  content,
}: {
  title: string;
  content: string | null;
}) => {
  return `# ${title}` + (content ?? "");
};

export const collectAllLinksFromString = (markdown: string) => {
  const links = markdown
    .match(/\[\[(.*?)\]\]/g)
    ?.map((link) => link.replace("[[", "").replace("]]", ""));
  return links ?? [];
};

export const removeArticleTag = (article: string) => {
  return article.replace(/<\/article>/g, "");
};

export const afterArticleTag = (article: string) => {
  return article.split("<article>")[1] ?? "";
};

export const beforeArticleTag = (article: string) => {
  return article.split("<article>")[0];
};

export const hasThoughtsTag = (article: string) => {
  return article.includes("<thoughts>");
};

export const removeThoughtsTag = (article: string) => {
  return article.replace(/<thoughts>.*?<\/thoughts>/s, "");
};

export const extractArticle = (article: string) => {
  const match = article.match(/<article>(.*?)<\/article>/s);
  return match ? match[1] : null;
};

export const linkify = (text: string) => {
  if (typeof text !== "string") return "";
  return text.replace(
    /\[\[(.*?)(?:\|(.*?))?\]\]/g,
    (_, p1, p2) => `[${p2 || p1}](/${encodeURIComponent(p1)})`
  );
};

export function createHashLink(header: string) {
  return `#${header.toLowerCase().replace(/\s+/g, "-")}`;
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9]/g, "");
}
