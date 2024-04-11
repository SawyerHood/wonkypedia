import { MessageCreateParams } from "@anthropic-ai/sdk/resources/messages.mjs";
import { HAIKU_MODEL } from "./client";

const systemPrompt = `You are an AI assistant that acts as a wikipedia author writing encyclopedia entries in an alternate timeline of the universe. When given a title for an article, you will:

1. Return a detailed, multi-paragraph article on the topic, written in the style of a Wikipedia entry. Use an encyclopedic, dry, factual tone.
2. Format the article using markdown, including elements like headers, bold, italics, lists, etc. as appropriate. The title should already be included as a top-level header.
3. Throughout the article, link liberally to other relevant "encyclopedia entries" by wrapping the linked term in double brackets like this: [[Earth]]. Do not include any other formatting inside the links.
4. Write the article from the perspective of the alternate timeline, altering historical events, scientific facts, etc. to make it noticeably different from our reality. However, do not make the changes too extreme or over-the-top. 
5. Never mention that this takes place in an alternate timeline. Write as if the article's version of events is the only reality.
6. Before the article, include a <thoughts> section outlining how the topic differs in this timeline versus ours, as well as a rough outline of the article's contents. 
7. Also include a <summary> section with a 1-paragraph summary of the article's key points. Don't mention the timeline.
8. Wrap the actual article text in <article> tags. The article should aim to cover the topic in detail, broken into multiple sections, similar to a real Wikipedia entry.

Remember, a topic qualifies for an encyclopedia article if it has lasting significance, broad appeal, and can be covered factually based on reliable sources. Appropriate topics include major historical events, notable people, scientific/cultural/artistic subjects, and significant works like influential books, films, games, etc. Avoid niche or promotional topics.`;

const messages = [
  { role: "user", content: `Quantum Computing` },
  {
    role: "assistant",
    content: `<thoughts>
In this alternate timeline, quantum computing has advanced much more rapidly, becoming widely adopted in the 2030s. Key points:
1. Early development and breakthroughs
2. Key players and companies
3. Applications in cryptography, drug discovery, and optimization
4. Societal impact and ethical concerns
5. Future prospects and challenges
</thoughts>

<summary>
Quantum computing, a revolutionary technology harnessing the principles of quantum mechanics, has transformed various industries and reshaped society in the early 21st century. With its ability to solve complex problems exponentially faster than classical computers, quantum computing has led to breakthroughs in cryptography, drug discovery, and optimization, while also raising ethical concerns about its potential misuse.
</summary>

<article>
# Quantum Computing
[[Quantum computing]] is a groundbreaking technology that leverages the principles of [[quantum mechanics]] to perform complex computations. Unlike [[classical computers]], which rely on [[bits]] that can be either 0 or 1, quantum computers use [[quantum bits]], or [[qubits]], which can exist in multiple states simultaneously. This property, known as [[superposition]], allows quantum computers to solve certain problems exponentially faster than their classical counterparts.
## Early Development and Breakthroughs
The concept of quantum computing was first proposed in the 1980s by physicist [[Richard Feynman]] and later formalized by [[David Deutsch]] in 1985. However, it wasn't until the early 2000s that significant breakthroughs were made in the practical implementation of quantum computers. In 2023, a team of researchers from the [[University of Sydney]] successfully demonstrated a 100-qubit quantum computer, marking a major milestone in the field.
## Key Players and Companies
Several tech giants and startups have invested heavily in the development of quantum computing, recognizing its immense potential. Some of the key players include:
1. [[Google]], which achieved [[quantum supremacy]] in 2029 with its 1,000-qubit processor.
2. [[IBM]], a pioneer in quantum computing, offering cloud-based access to its quantum systems.
3. [[Microsoft]], focusing on the development of [[topological qubits]] for increased stability.
4. [[D-Wave Systems]], a Canadian company specializing in [[quantum annealing]] processors.
## Applications and Impact
Quantum computing has found applications in various domains, revolutionizing fields such as:
1. [[Cryptography]]: Quantum computers can break many of the current [[encryption]] methods, prompting the development of [[quantum-resistant cryptographic algorithms]].
2. [[Drug Discovery]]: By simulating complex [[molecular interactions]], quantum computers have accelerated the discovery of new drugs and materials.
3. [[Optimization]]: Quantum algorithms can solve optimization problems, such as [[route planning]] and [[portfolio optimization]], much faster than classical methods.
## Societal Impact and Ethical Concerns
The widespread adoption of quantum computing has raised concerns about its potential misuse. The ability to break current encryption methods has led to fears of increased [[cyber threats]] and the need for quantum-resistant security measures. Additionally, the concentration of quantum computing power in the hands of a few large corporations has sparked debates about the [[equitable access]] to this transformative technology.
## Future Prospects and Challenges
As quantum computing continues to advance, researchers are working on developing more stable and scalable quantum systems. The ultimate goal is to achieve [[fault-tolerant quantum computing]], which would enable the construction of large-scale quantum computers capable of tackling even more complex problems. However, challenges such as [[qubit decoherence]] and the need for [[error correction]] remain significant hurdles to overcome.
Despite these challenges, the future of quantum computing looks promising. As the technology matures, it is expected to have a profound impact on various aspects of society, from scientific research and healthcare to finance and beyond, ushering in a new era of computational possibilities.
</article>`,
  },
  { role: "user", content: `Genghis Khan` },
  {
    role: "assistant",
    content: `<thoughts>
In this alternate timeline, Genghis Khan's empire never fragmented and continued to expand, eventually uniting most of the known world under Mongol rule. Key points:
1. Early life and rise to power
2. Unification of the Mongol tribes
3. Expansion of the Mongol Empire
4. Pax Mongolica and cultural exchange
5. Legacy and impact on world history
</thoughts>

<summary>
Genghis Khan, the founder of the Mongol Empire, is remembered as one of the greatest conquerors in history. His empire never fragmented and continued to expand, eventually uniting most of the known world under Mongol rule. The resulting Pax Mongolica facilitated unprecedented cultural exchange and shaped the course of world history.
</summary>

<article>
# [[Genghis Khan]]
Genghis Khan (c. 1162 – 1227), born [[Temüjin]], was the founder and first [[Great Khan]] of the [[Mongol Empire]], which became the largest contiguous empire in history. He is renowned for his [[military genius]], [[political acumen]], and the enduring legacy of his conquests.
## Early Life and Rise to Power
Temüjin was born into a noble family in the [[Mongol confederation]]. After his father's death, he faced numerous challenges, including [[slavery]] and rivalry from other [[clans]]. Through his [[charisma]], strategic [[alliances]], and military prowess, Temüjin gradually united the nomadic tribes of [[Northeast Asia]], adopting the title "Genghis Khan" (meaning "universal ruler") in 1206.
## Unification of the Mongol Tribes
Genghis Khan's unification of the Mongol tribes was a turning point in history. By ending the constant infighting and uniting the nomads under a single banner, he created a formidable [[military force]] that would go on to conquer vast territories. The [[Mongol army]], known for its [[discipline]], [[mobility]], and innovative [[tactics]], became the most feared military power of its time.
## Expansion of the Mongol Empire
Under Genghis Khan's leadership, the Mongol Empire expanded rapidly, conquering [[Central Asia]], [[China]], [[Persia]], and parts of [[Eastern Europe]]. His successors continued his legacy, further extending the empire's reach. By the late 13th century, the Mongol Empire encompassed most of [[Eurasia]], from [[Korea]] to [[Hungary]] and from [[Russia]] to the [[Persian Gulf]].
## [[Pax Mongolica]] and Cultural Exchange
The Mongol conquest ushered in an era of relative peace and stability known as Pax Mongolica. The empire's vast network of trade routes, later known as the [[Silk Road]], facilitated unprecedented [[cultural exchange]]. Ideas, [[technologies]], and goods flowed freely across the empire, leading to significant advancements in fields such as [[science]], [[art]], and [[commerce]].
## Legacy and Impact on World History
Genghis Khan's legacy extends far beyond his military conquests. The Mongol Empire's political, economic, and cultural influence shaped the course of [[world history]]. The empire's [[administrative system]], which included a [[meritocratic]] [[bureaucracy]] and [[religious tolerance]], served as a model for future [[states]]. The cultural exchange fostered by the Pax Mongolica laid the foundation for the [[Renaissance]] and the [[Age of Exploration]].
Today, Genghis Khan is remembered as one of the most influential figures in history, a visionary leader whose empire united much of the known world and left an indelible mark on the course of human civilization.
</article>`,
  },
  { role: "user", content: `World War II` },
  {
    role: "assistant",
    content: `<thoughts>
In this alternate timeline, World War II ended with a negotiated peace in 1943, leading to a very different post-war world. Key points:
1. Causes and early years of the war
2. Turning points and major battles
3. Peace negotiations and the Treaty of Geneva
4. Post-war division of power and spheres of influence
5. Long-term consequences and the Cold War
</thoughts>

<summary>
World War II, the global conflict that lasted from 1939 to 1943, reshaped the political, economic, and social landscape of the 20th century. The war ended with a negotiated peace in 1943, leading to a post-war world characterized by a multipolar balance of power and a prolonged Cold War between the United States, Germany, and the Soviet Union.
</summary>

<article>
# World War II
World War II was a global conflict that lasted from 1939 to 1943, involving most of the world's nations and resulting in the deaths of over 60 million people. The war began with [[Nazi Germany]]'s invasion of [[Poland]] in September 1939 and ended with a negotiated peace in 1943, following a series of decisive battles and diplomatic maneuvers.
## Causes and Early Years of the War
The roots of World War II can be traced back to the aftermath of [[World War I]] and the rise of [[fascism|fascist]] regimes in Europe, particularly Nazi Germany under [[Adolf Hitler]]. The war began with Germany's invasion of Poland, followed by the fall of [[France]] and the [[Low Countries]] in 1940. The conflict soon escalated, with the entry of [[Italy]] and [[Japan]] on the side of the [[Axis powers]] and the [[United States]] and the [[Soviet Union]] joining the [[Allies]].
## Turning Points and Major Battles
The war saw several turning points and major battles that shaped its outcome. The [[Battle of Britain]] in 1940 marked the first major defeat of the German [[Luftwaffe]], while the German invasion of the Soviet Union in 1941 opened up a vast new front in the east. In the Pacific, the Japanese attack on [[Pearl Harbor]] in December 1941 brought the United States into the war, leading to a series of naval battles, including the decisive [[Battle of Midway]] in 1942.
## Peace Negotiations and the Treaty of Geneva
By 1943, both sides were exhausted and facing mounting casualties. Secret peace negotiations began in neutral [[Switzerland]], culminating in the Treaty of Geneva in November 1943. The treaty established a new balance of power in Europe and Asia, with Germany retaining control over much of [[Western Europe]], while the Soviet Union expanded its influence in [[Eastern Europe]] and the [[Balkans]]. In the Pacific, Japan withdrew from its conquered territories, with the United States establishing a strong presence in the region.
## Post-War Division of Power and Spheres of Influence
The post-war world was characterized by a multipolar balance of power, with the United States, Germany, and the Soviet Union emerging as the dominant global powers. Each of these nations established its own [[sphere of influence]], leading to a tense and often volatile international order. The United States focused on the [[Western Hemisphere]] and the Pacific, while Germany dominated Western Europe and parts of [[Africa]]. The Soviet Union, meanwhile, expanded its control over Eastern Europe and [[Central Asia]].
## Long-Term Consequences and the Cold War
The long-term consequences of World War II and the Treaty of Geneva were profound. The war accelerated the decline of [[European colonialism|European colonial empires]], leading to the emergence of new independent nations in Asia and Africa. The division of power between the United States, Germany, and the Soviet Union set the stage for a prolonged [[Cold War]], characterized by ideological rivalry, [[proxy war|proxy conflicts]], and a [[nuclear arms race]].
The Cold War shaped global politics for decades, influencing everything from culture and technology to economics and social movements. It was not until the late 20th century, with the collapse of the Soviet Union and the reunification of Germany, that the post-war order established by the Treaty of Geneva began to unravel, ushering in a new era of [[globalization]] and international cooperation.
</article>`,
  },
  { role: "user", content: `The Beatles` },
  {
    role: "assistant",
    content: `<thoughts>
In this alternate timeline, The Beatles never broke up and continued to make music together well into the 21st century. Key points:

1. Formation and early success
2. Musical evolution and experimentation
3. Continued collaboration and solo projects
4. Social and political activism
5. Legacy and impact on popular culture

</thoughts>

<summary>
The Beatles, the most influential and commercially successful band in history, never broke up in this alternate timeline. Instead, they continued to make music together for decades, evolving their sound and pushing the boundaries of popular music. Their enduring collaboration, combined with their individual solo projects and social activism, cemented their status as cultural icons and left an indelible mark on the world.
</summary>

<article>
# The [[The Beatles|Beatles]]
The Beatles, comprised of [[John Lennon]], [[Paul McCartney]], [[George Harrison]], and [[Ringo Starr]], are the most iconic and influential band in the history of [[popular music]]. Formed in [[Liverpool]], [[England]], in 1960, the group went on to revolutionize the [[music industry]] and shape the course of popular culture for generations.
## Formation and Early Success
The Beatles began their career playing in clubs in Liverpool and [[Hamburg]], [[Germany]], honing their skills and developing their distinctive sound. Their breakthrough came in 1963 with the release of their first album, "[[Please Please Me (album)|Please Please Me]]," which topped the charts in the [[United Kingdom]] and marked the beginning of "[[Beatlemania]]."
## Musical Evolution and Experimentation
Throughout their career, The Beatles constantly evolved their musical style, incorporating elements of [[rock and roll]], [[pop music|pop]], [[psychedelia]], and [[avant-garde]] experimentation. Albums such as "[[Rubber Soul]]," "[[Revolver (album)|Revolver]]," and "[[Sgt. Pepper's Lonely Hearts Club Band]]" showcased their innovative songwriting, studio techniques, and willingness to push the boundaries of popular music.
## Continued Collaboration and Solo Projects
The band continued to work together for decades. While pursuing successful solo projects, the members regularly collaborated on Beatles albums, maintaining their creative partnership and exploring new musical territory. Notable later albums include "[[Imagine Together]]" (1975), "Everest" (1982), and "[[The Beatles Anthology|Anthology]]" (1995).
## Social and Political Activism
The Beatles were not only musical innovators but also influential social and political activists. They used their platform to advocate for causes such as [[peace movement|peace]], [[civil rights movement|civil rights]], and [[environmentalism]]. John Lennon, in particular, became a prominent voice in the [[opposition to the Vietnam War|anti-war movement]], while George Harrison's embrace of [[Eastern philosophy]] and [[spirituality]] inspired a generation of seekers.
## Legacy and Impact on Popular Culture
The Beatles' impact on [[popular culture]] is immeasurable. Their music, [[1960s in fashion|fashion]], and attitudes shaped the [[counterculture of the 1960s]] and continue to influence artists and fans around the world. The band's enduring success and cultural relevance in this alternate timeline underscore their status as the most significant and beloved musical act of all time.
The Beatles' legacy extends far beyond their music. They redefined the role of the artist in society, paving the way for greater creative freedom and social consciousness in popular entertainment. Their continued presence and evolution in this alternate history serve as a testament to the timeless appeal of their music and the enduring power of their message of love, peace, and unity.
</article>`,
  },
] as const;

export function getMessageCreateParams(
  title: string,
  contextArticles: string[]
): MessageCreateParams {
  let system = systemPrompt;

  if (contextArticles.length > 0) {
    system = `Here are some past documents in the universe that might be useful for performing your task:
${contextArticles
  .map((article) => "<context>\n" + article + "\n</context>")
  .join("\n")}

${systemPrompt}`;
  }

  console.log("messages.length", messages.length);
  console.log("contextArticles", contextArticles);

  return {
    messages: [
      ...messages.slice(
        0,
        Math.max(messages.length - contextArticles.length * 2, 0)
      ),
      {
        role: "user",
        content: title,
      },
      {
        role: "assistant",
        content: `<thoughts>`,
      },
    ],
    system,
    model: HAIKU_MODEL,
    temperature: 1,
    max_tokens: 4000,
  };
}
