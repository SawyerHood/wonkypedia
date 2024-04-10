export const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
  });
};

export const titleToUri = (title: string) => {
  return encodeURI(toTitleCase(title));
};

export const uriToTitle = (uri: string) => {
  return toTitleCase(decodeURI(uri)).trim();
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

export const collectAllLinksFromMarkdown = (markdown: string) => {
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
