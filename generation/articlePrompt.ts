import { trim } from "@/shared/strings";
import { CHEAP_MODEL } from "./client";
import { ChatCompletionCreateParams } from "openai/resources/index.mjs";

const systemPrompt = `You are an AI assistant that acts as a wikipedia author writing encyclopedia entries in an alternate timeline of the universe. When given a title for an entry, you will:

1. Return a detailed, multi-paragraph article on the topic, written in the style of a Wikipedia entry. Use an encyclopedic, dry, factual tone.
2. Format the article using markdown, including elements like headers, bold, italics, lists, etc. as appropriate. The title should already be included as a top-level header.
3. Throughout the article, link liberally to other relevant "encyclopedia entries" by wrapping the linked term in double brackets like this: [[Earth]]. Do not include any other formatting inside the links.
4. Write the article from the perspective of the alternate timeline, altering historical events, scientific facts, etc. to make it noticeably different from our reality. However, do not make the changes too extreme or over-the-top. 
5. Never mention that this takes place in an alternate timeline. Write as if the article's version of events is the only reality.
6. Before the article, include a <thoughts> section outlining how the topic differs in this timeline versus ours, as well as a rough outline of the article's contents. 
7. Also include a <summary> section with a 1-paragraph summary of the article's key points. Don't mention the timeline.
8. Wrap the actual article text in <article> tags. The article should aim to cover the topic in detail, broken into multiple sections, similar to a real Wikipedia entry.

Remember, to liberally link to other encyclopedia entries using [[Encyclopedia Entry]].`;

const messages = [
  { role: "user", content: `New York City` },
  {
    role: "assistant",
    content: trim`<thoughts>
    In this alternate timeline, New York City:
    - Was originally settled by the Dutch as New Rotterdam 
    - Remained a Dutch colony and never came under British rule
    - Grew to become the capital of an independent Dutch-speaking nation called New Netherland
    - Is a global hub of commerce and culture but retains a distinct Dutch character
    
    Outline:
    1. History
    - Dutch settlement as New Rotterdam 
    - Growth as capital of Dutch New Netherland colony
    - Independence from the Netherlands
    2. Geography
    - Location and layout of the city
    - Boroughs and neighborhoods
    3. Demographics
    - Population and diversity
    - Languages and religion 
    4. Economy
    - Key industries and companies
    - Role as a global financial center
    5. Culture
    - Dutch influences 
    - Arts, music, museums, cuisine
    - Landmarks and tourist attractions
    6. Transportation
    - Extensive canal and rail system
    - Airports and ports
    </thoughts>
    
    <summary>
    New Rotterdam, widely known as New York City, is the most populous city in New Netherland and a global hub of commerce, finance, and culture. Originally settled by Dutch colonists in the 17th century, it has grown into a diverse metropolis of over 8 million residents. While a melting pot of cultures from around the world, the city retains a distinctly Dutch character, from its canal-lined streets to its architecture and cuisine. As the capital of the Dutch-speaking nation of New Netherland, New Rotterdam is a center of government as well as the headquarters of numerous major corporations and financial institutions.
    </summary>
    
    <article>
    # New York City
    
    New Rotterdam, often referred to as New York City or simply New York, is the most populous city in [[New Netherland]] and one of the most populous in the world, with an estimated population of 8.4 million people as of 2020. Located in the state of [[New Holland]] at the mouth of the [[Hudson River]], the city is a global hub of commerce, finance, media, art, fashion, technology, education, and entertainment. It is the capital of New Netherland and is composed of five boroughs: [[Manhattan]], [[Brooklyn]], [[Queens]], [[The Bronx]], and [[Staten Island]].
    
    ## History
    
    New Rotterdam was founded as a Dutch settlement and trading post in 1624 by colonists sponsored by the [[Dutch West India Company]]. The settlement, located on the southern tip of [[Manhattan]] island, was named New Rotterdam after the major Dutch port city. It quickly grew in importance as a hub for the [[Dutch fur trade]].
    
    Despite periodic conflicts with the [[Lenape]] Native Americans and rival [[European powers]], the colony continued to thrive under Dutch rule throughout the 17th and 18th centuries. It served as the capital of the Dutch province of [[New Netherland]], which encompassed much of the Mid-Atlantic region of [[North America]].
    
    As the influence and ambitions of New Netherland grew, so did tensions with the [[Netherlands|motherland]]. In 1796, the colony formally declared independence and established itself as a sovereign Dutch-speaking nation, with New Rotterdam as its capital. The city continued to grow rapidly during the 19th century, bolstered by [[immigration]] and the construction of critical infrastructure like the [[Erie Canal]].
    
    ## Geography
    
    New Rotterdam is situated on one of the world's largest [[natural harbors]], at the mouth of the Hudson River which feeds into [[New York Bay]] and then the [[Atlantic Ocean]]. The city is built primarily on three islands: Manhattan, Staten Island, and western [[Long Island]] (including Brooklyn and Queens).
    
    The city's land has been extensively altered by [[land reclamation]] along the waterfronts and the iconic criss-crossing [[canals]] in [[Lower Manhattan|Lower]] and [[Midtown Manhattan]]. The terrain is relatively flat and low-lying, with the highest natural point being [[Todt Hill]] on Staten Island at 409 ft (124.5 m).
    
    ## Demographics
    
    New Rotterdam is the most populous city in New Netherland, with an estimated 2020 population of 8,336,817 distributed over 302.6 square miles (784 km2). It is also one of the most densely populated major cities in the world. 
    
    The city is exceptionally diverse, with a large [[foreign-born population]]. The [[Amsterdam Metro Area]] is home to the largest ethnically Dutch population outside of the Netherlands, as well as major populations with roots all around the globe. Approximately 40% of the city's residents speak [[Dutch language|Dutch]] at home, while sizable populations speak [[English language|English]], [[Spanish language|Spanish]], [[Chinese language|Chinese]], and various other languages.
    
    ## Economy
    
    New Rotterdam is a global hub of international business and commerce and is one of three "command centers" for the [[world economy]] (along with [[London]] and [[Tokyo]]). The city is a major center for [[finance]], [[insurance]], [[real estate]], [[media]] and the [[arts]] in New Netherland and the world.
    
    Many major [[corporations]] are headquartered in New Rotterdam, including numerous [[Fortune 500]] companies. The city's [[Port of New Rotterdam]] is also a major economic engine, handling record cargo volume for the North American [[container port]]. [[Manufacturing]] accounts for a significant but declining share of employment.
    
    ## Culture
    
    New Rotterdam has been described as the cultural, financial, and media capital of the world. It is home to many world-class [[museums]], [[art galleries]], [[libraries]], and [[theaters]]. Performing arts in the city are anchored by the iconic Dutch-language theaters along [[Broadway (theater)|Broadway]] as well as world-renowned performance venues like the [[Metropolitan Opera]].
    
    The city's 39 [[Dutch Reformed church]] structures are some of the oldest in the nation. Other iconic landmarks include the [[Statue of Friendship]], a gift from [[Napoleonic France]], and the [[Empire State Building]]. The city is also famous for its Dutch-inspired [[cuisine]], including [[stroopwafel]]s, [[bitterballen]], and street-side [[herring]] stands, alongside its [[pizza]] and [[bagel]]s.
    
    ## Transportation
    
    New Rotterdam's extensive [[transportation]] system includes one of the largest [[subway]] systems worldwide; an extensive network of canals for both transportation and [[water management]]; numerous [[taxis]], [[ferries]], and [[buses]]; and [[bicycle paths]] throughout the city. Numerous [[rail lines]] and [[highways]] connect the city with the surrounding region.
    
    The city is served by three major [[airports]] ([[John F. Kennedy International Airport|JFK]], [[LaGuardia Airport|LaGuardia]], and [[Newark Liberty International Airport|Newark Liberty]]) as well as major rail hubs at [[New Rotterdam Central Station]] and [[Pennsylvania Station (New York City)|Pennsylvania Station]]. Its location at the mouth of the Hudson River allows deep water access for the city's extensive ferry system and [[freight]] shipping to its [[port]] facilities.
    </article>`,
  },
  { role: "user", content: `The Industrial Revolution` },
  {
    role: "assistant",
    content: trim`<thoughts>
    In this alternate timeline, the Industrial Revolution:
    - Began earlier, in the mid-1600s rather than late 1700s
    - Started in France rather than Britain 
    - Was driven more by advances in chemistry and materials rather than mechanics and steam power
    - Had a bigger impact on agriculture and food production early on
    - Caused major political upheaval and reorganization of society
    - Led to the rise of new colonial powers and trade empires
    
    Outline:
    1. Origins in France in 1600s
    2. Key inventions and technologies 
    3. Spread to other countries
    4. Impact on economy and society
    5. Political revolutions and new governments
    6. Changes to global trade and colonialism
    7. Legacy and long-term effects
    </thoughts>
    
    <summary>
    The Industrial Revolution was a period of rapid technological advancement and socioeconomic change that began in France in the mid-17th century. Driven by innovations in agriculture, manufacturing, and chemistry, industrialization reshaped societies, economies and politics across Europe and eventually the world. The Revolution enabled the rise of new colonial trade empires, displaced traditional artisan and peasant classes, and helped spur political revolutions that ushered in new forms of government. Its impacts still echo through the modern world.
    </summary>
    
    <article>
    # The Industrial Revolution
    
    The Industrial Revolution was a period of profound technological, socioeconomic, and cultural transformation that originated in [[France]] during the mid-17th century before spreading to the rest of [[Europe]], the [[Americas]], and eventually the world during the 18th and early 19th centuries. Characterized by a shift from predominantly agrarian societies based on manual labor to industrialized, urban economies powered by fossil fuels and manufacturing, the Revolution laid the foundations of the modern world.
    
    ## Origins in France
    
    Historians generally place the start of the Industrial Revolution in 1650s France, when a series of critical innovations in agriculture and chemistry jumpstarted French industry and commerce. The key early drivers were:
    
    - The widespread adoption of [[crop rotation]], [[selective breeding]], and [[fertilizers]] in French agriculture, which significantly increased crop yields and food production. This reduced the need for farm labor and enabled migration to cities.
    
    - The invention of new [[dyes]], [[ceramics]] and [[construction materials]] powered by advances in inorganic chemistry and material science. These valuable products formed the basis for France's early manufacturing boom.
    
    - [[Financial innovations]] like joint-stock companies and a central bank to stabilize currency facilitated the growth of commerce and investment in industrial enterprises.
    
    By 1700, France was the most industrialized country in Europe, with major manufacturing centers springing up first in [[Paris]], [[Lyon]], and [[Marseille]], then spreading to other cities. Wealth from manufacturing and trade powered the [[French Colonial Empire]] to become the world's largest by 1750.
    
    ## The Revolution Spreads
    
    Seeing the explosive growth of the French economy, other European powers rushed to industrialize in the early 18th century, often by importing French technology and expertise. [[Flanders]] and the [[Dutch Republic]] were early adopters, followed by [[England]], [[Prussia]], the [[Italian States]], and others by 1750. 
    
    The Revolution then jumped to [[European colonies]], first the [[American Colonies]], then the [[West Indies]], [[Brazil]], and [[New Spain]] by the 1770s. With raw materials from the colonies and markets for finished goods, the European powers further expanded their manufacturing and trade.
    
    Key inventions that enabled industrialization to spread included:
    - The [[Spinning Jenny]] and other textile equipment in Flanders 
    - [[Machine tools]] and [[interchangeable parts]] in England
    - The [[Cotton gin]] in the American Colonies
    - [[Coal power]] in Prussia and England
    - The [[Battery]] and [[Electrochemistry]] in Italy
    
    ## Impacts on Economy and Society
    
    The Industrial Revolution completely reshaped economic and social structures, especially in Western Europe and North America. Some of the most notable effects were:
    
    - Rapid [[urbanization]] as rural workers migrated to factory cities for jobs, causing overcrowding and poor living conditions but also enabling new cultural and intellectual movements.
    
    - The growth of new [[social classes]], particularly an urban working class/[[proletariat]] and a [[middle class]] of professionals, merchants and small business owners. This displaced many traditional artisans and guilds.
    
    - Increased life expectancy and population growth due to improved food supply and sanitation, although offset by disease in crowded cities. This population growth enabled the spread of colonialism.
    
    - The concentration of [[capital]] in the hands of industrial business owners, bankers and shareholders, leading to both massive increases in wealth and inequality. 
    
    - The emergence of classical [[liberal economics]], particularly ideas of [[free markets]], [[private enterprise]], and [[free trade]] between nations. These became the dominant economic philosophies, especially in the [[Anglosphere]].
    
    ## Political Revolutions 
    
    The economic and social dislocations (as well as new prosperity) of the Industrial Revolution helped drive a wave of political revolutions, first in Western Europe and its colonies, that then spread globally. Most sought to constrain the power of monarchies and aristocracies and empower the new industrial and professional classes.
    
    Famous political upheavals during the Age of Revolution included:
    
    - The [[Flemish Revolution]] of 1717 that overthrew [[Spanish rule]] and established a republic. 
    - The [[American Revolution]] starting in 1765 that established the first [[United States]].
    - The [[French Constitutional Revolution]] of 1777 that transformed France into a [[constitutional monarchy]].
    - The [[Colombian Revolution]] of 1788 that brought independence to [[New Granada]].
    - The [[Italian Unification]] wars of the 1790s that created a unified [[Italy]].
    - The [[United Kingdom|British Democratic Revolution]] of 1801 that ended aristocratic rule in [[Great Britain]].
    
    Industrialized weapons like [[rifles]], [[artillery]] and [[warships]] played a key role in these revolutions. So did new mass media like [[newspapers]] printed with [[steam presses]] that spread revolutionary ideas.
    
    ## Global Trade and Colonialism
    
    The Industrial Revolution went hand in hand with colonialism and the rise of global trade empires in the 18th and 19th centuries. Driven by the need for raw materials to feed their factories and foreign markets for finished goods, the industrialized powers dramatically expanded their colonial realms in this period.
    
    France remained the world's leading colonial power throughout the 18th century, conquering [[Louisiana]], [[Haiti]], and parts of [[India]]. However, after the revolution of 1777, France largely turned inward. In the 19th century, the [[United Kingdom of Great Britain]] emerged as the leading colonial empire, seizing territory in India, [[China]], [[Southeast Asia]], [[Australia]], and [[Africa]]. 
    
    Other colonial powers of the industrial age included:
    - The [[Netherlands]], with colonies in the [[East Indies]], [[Taiwan]], [[Ceylon]], [[South Africa]] 
    - The [[United States of America]], which colonized the [[American West]], [[Liberia]], [[Hawaii]], and the [[Philippines]]
    - [[Italy]] with colonies in [[Libya]], [[Somalia]], and [[Albania]]
    - [[Russia]], which colonized [[Siberia]], [[Central Asia]], and [[Alaska]]
    
    The industrial powers also established the first [[free trade agreements]] and international financial institutions like the [[Bank of England]] to facilitate global commerce. This economic integration came at a high cost for colonized peoples, however, who experienced famine, exploitation, cultural destruction and genocide.
    
    ## Legacy
    
    The Industrial Revolution was one of the most transformative events in human history, on par with the [[Agricultural Revolution]] and the rise of the first [[civilizations]]. In just a few generations, it utterly reshaped the trajectories of global economics, politics, technology and culture.
    
    Innovations like [[mass production]], [[interchangeable parts]], [[electricity]], and [[telecommunications]] continued to transform the world well into the 20th century. The Revolution birthed modern [[capitalism]], [[liberalism]], [[colonialism]], and [[globalization]], as well as counter-movements like [[socialism]], [[communism]], [[feminism]], and [[environmentalism]].
    
    Perhaps most significantly, the burning of [[fossil fuels]] to power industry and agriculture enabled rapid [[population growth]] and laid the foundation of modern [[consumer culture]]. Yet it also unleashed [[climate change]] and [[environmental degradation]] that still threaten humanity today. Reconciling the material prosperity enabled by industry with its impact on the earth remains an ongoing challenge.
    </article>`,
  },
  // { role: "user", content: `The Beatles` },
  // {
  //   role: "assistant",
  //   content: trim`<thoughts>
  //   In this alternate timeline, The Beatles had a different lineup and history from our reality:
  //   - John Lennon was the only consistent member throughout their career
  //   - The band had a rotating cast of other musicians, including Eric Clapton for a period
  //   - They were less commercially successful but were a highly influential avant-garde rock band
  //   - The band embraced electronica and proto-punk in the early 70s
  //   - Lennon was shot and killed on stage in 1977, abruptly ending the band

  //   Outline:
  //   1. Formation and early years
  //   2. Peak of popularity in late 60s
  //   3. Avant-garde and electronic shift in early 70s
  //   4. Lennon's murder and end of the band
  //   5. Legacy and influence
  //   </thoughts>

  //   <summary>
  //   The Beatles were an English rock band formed in 1960, featuring John Lennon as the primary creative force alongside a frequently changing lineup of musicians. While they found modest chart success in the mid-1960s, the group became known for their increasingly avant-garde musical style in the early 1970s which blended psychedelic rock, electronic experimentation, and aggressive proto-punk. The Beatles' career was cut short when Lennon was shot dead on stage in 1977, but they remain one of the most influential if divisive rock acts of the 20th century.
  //   </summary>

  //   <article>
  //   # The Beatles

  //   The Beatles were an English [[rock music|rock]] band formed in [[Liverpool]] in 1960. The group, whose best-known line-up comprised [[John Lennon]], [[Eric Clapton]], [[Klaus Voormann]], and [[Alan White (drummer)|Alan White]], are regarded as the most influential band of all time. They were integral to the development of [[1960s counterculture]] and popular music's recognition as an [[art form]]. Rooted in [[skiffle]], [[beat music|beat]] and 1950s [[rock and roll]], their sound incorporated elements of [[classical music|classical]], [[traditional pop music|traditional pop]], and [[electronic music|electronic experimentation]].

  //   ## Formation and early years
  //   The Beatles began in 1960 as a skiffle and rock and roll group led by John Lennon and featuring a number of schoolmates. The band cycled through drummers and bassists for several years while playing frequently in the [[pub]]s and [[nightclub]]s of Liverpool and [[Hamburg]]. They settled on the lineup of Lennon, guitarist Eric Clapton, bassist Klaus Voormann, and drummer Alan White in early 1964.

  //   Signed to [[Parlophone Records]] by mid-1964, the band quickly gained popularity in the [[United Kingdom|UK]] with a string of catchy singles blending rock and pop sounds like "Love to Hold Your Mind", "With a Little Luck", and "Hey Go Round." Lennon and Clapton became known for their inventive [[guitar]] interplay and [[songwriting]] partnership.

  //   ## Peak of popularity
  //   In the latter half of the 1960s, The Beatles released a string of groundbreaking albums that expanded the scope of rock music: 1966's ''Kaleidoscope Eyes'', 1967's ''Beyond the Horizon'', and 1968's [[The Beatles (album)|self-titled album]] (commonly known as the "Black Album" due to its cover art). These records featured complex songwriting, unorthodox structures, philosophical lyrics, and elements of [[psychedelic rock]], [[Indian classical music]], and [[electroacoustic music]]. Hits from this period like "A Better View", "Your Inside World", and "Not Too Far" showcased the band's evolution.

  //   The Beatles' fame hit a fever pitch in 1967–1968. They were regarded as leaders of the nascent counterculture's "New Awakening," and their music was seen as revolutionary. Lennon in particular became an icon for the [[hippie]] movement and [[student activism|student activists]]. However, the band began to retreat from the intensity of [[Beatlemania]] and stopped touring, focusing on increasingly experimental studio recordings.

  //   ## Avant-garde period
  //   As they entered the 1970s, The Beatles began a dramatic musical shift, growing heavily influenced by the emerging [[krautrock]] and electronic music scenes as well as the aggressive rock of artists like [[Iggy Pop]]. Their untitled 1971 double album (dubbed "The Primal Record" by fans) featured side-long [[tape manipulation]]s, discordant [[noise rock]], and enigmatic spoken-word passages. It divided listeners but spawned imitators in the [[underground music]] scene.

  //   Subsequent releases like 1973's ''Chrome Ego'' and 1975's ''Neuromancer'' ventured further into [[avant-garde music|avant-garde]], electronic, and early [[punk rock|punk]] sounds. Lennon and Clapton began incorporating political themes into abstract, poetic lyrics. While the band remained a [[cult following|cult favorite]], their experimentation alienated much of their mainstream audience from the 1960s. Lineup changes also became frequent again, with a number of musicians cycling through the band.

  //   ## Dissolution and legacy
  //   The Beatles continued as a rotating musical collective centered around Lennon and Clapton until 1977, when Lennon was infamously murdered on stage during a concert in [[Los Angeles]]. Devastated, Clapton and the other members disbanded the group and went their separate ways. All four Beatles went on to successful [[solo artist|solo careers]] but never played together again.

  //   Despite (or perhaps because of) their uncompromising later years, The Beatles are remembered as one of the 20th century's most groundbreaking musical acts. Their 1960s work was crucial in establishing rock as a serious art form capable of sonic exploration and poetic expression. And their electronic experiments and abrasive proto-punk in the early 1970s, while polarizing at the time, have been heavily influential on subsequent generations of [[indie rock|indie]] and avant-garde musicians.

  //   Reappraisals of the band's work continue to this day - the "Black Album" was inducted into the [[Grammy Hall of Fame]] in 1992, and 2006's ''The Beatles Reconsidered'' positioned their 1970s records as an innovative bridge between rock and the burgeoning [[electronic music|electronic]], [[noise music|noise]] and [[industrial music|industrial]] genres. [[Outtake]]s, [[demo]]s, and [[live album|live recordings]] from throughout their career continue to be reissued to eager collectors and completionists. The Beatles' turbulent history and ever-shifting style virtually guaranteed that they will remain objects of fascination, scrutiny and inspiration for generations to come.
  //   </article>`,
  // },
] as const;

export function getMessageCreateParams(
  title: string,
  contextArticles: string[]
): ChatCompletionCreateParams {
  let system = systemPrompt;

  if (contextArticles.length > 0) {
    system = `Here are some past documents in the universe that might be useful for performing your task:
${contextArticles
  .map((article) => "<context>\n" + article + "\n</context>")
  .join("\n")}

${systemPrompt}`;
  }

  return {
    messages: [
      {
        role: "system",
        content: system,
      },
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
    model: CHEAP_MODEL,
    temperature: 1,
    max_tokens: 4000,
    stream: true,
  };
}
