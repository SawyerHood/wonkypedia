type Message = {
  type: "info-box" | "article-chunk" | "image";
  value: string;
};

export function encodeMessage(message: Message) {
  const shortMessage = {
    t:
      message.type === "info-box"
        ? "ib"
        : message.type === "article-chunk"
        ? "ac"
        : "i",
    v: message.value,
  };
  return "👉" + JSON.stringify(shortMessage) + "👈";
}

export function decodeMessage(message: string): Message {
  const shortMessage = JSON.parse(message.replace(/^👉|👈$/g, ""));
  return {
    type:
      shortMessage.t === "ib"
        ? "info-box"
        : shortMessage.t === "ac"
        ? "article-chunk"
        : "image",
    value: shortMessage.v,
  };
}

export function decodeChunk(chunk: string): Array<Message> {
  const messages = chunk.matchAll(/👉.*?👈/g);
  return Array.from(messages).map((match) => decodeMessage(match[0]));
}
