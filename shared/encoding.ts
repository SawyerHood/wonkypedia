type Message = {
  type: "info-box" | "article-chunk" | "image" | "linkify";
  value: string;
};

export function encodeMessage(message: Message) {
  let shortType;
  switch (message.type) {
    case "info-box":
      shortType = "ib";
      break;
    case "article-chunk":
      shortType = "ac";
      break;
    case "linkify":
      shortType = "l";
      break;
    case "image":
      shortType = "i";
      break;
  }

  const shortMessage = {
    t: shortType,
    v: message.value,
  };
  return "👉" + JSON.stringify(shortMessage) + "👈";
}

export function decodeMessage(message: string): Message {
  const shortMessage = JSON.parse(message.replace(/^👉|👈$/g, ""));
  let longType: Message["type"] | null = null;
  switch (shortMessage.t) {
    case "ib":
      longType = "info-box";
      break;
    case "ac":
      longType = "article-chunk";
      break;
    case "l":
      longType = "linkify";
      break;
    case "i":
      longType = "image";
      break;
  }

  if (!longType) {
    throw new Error("Invalid message type");
  }

  return {
    type: longType,
    value: shortMessage.v,
  };
}

export function decodeChunk(chunk: string): Array<Message> {
  const messages = chunk.matchAll(/👉.*?👈/g);
  return Array.from(messages).map((match) => decodeMessage(match[0]));
}
