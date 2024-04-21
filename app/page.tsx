import cx from "classnames";

import MarkdownRenderer from "@/ui/MarkdownRenderer";
import { transformLinks } from "@/shared/articleUtils";
import sawyer from "@/assets/sawyer.jpg";
import logo from "./icon.png";
import Image from "next/image";
import Link from "next/link";

function Card({
  colorScheme,
  title,
  children,
  className,
}: {
  colorScheme: "blue" | "green" | "gray" | "purple";
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  cta?: React.ReactNode;
}) {
  const colorSchemes = {
    blue: {
      bgColor: "bg-blue-50 border-blue-300 text-blue-800",
      textColor: "text-gray-600",
      headingColor: "text-blue-800",
    },
    green: {
      bgColor: "bg-green-100 border-green-400 text-green-900",
      textColor: "text-gray-600",
      headingColor: "text-green-900",
    },
    gray: {
      bgColor: "bg-gray-50 border-gray-300 text-gray-800",
      textColor: "text-gray-600",
      headingColor: "text-gray-800",
    },
    purple: {
      bgColor: "bg-purple-50 border-purple-300 text-purple-800",
      textColor: "text-gray-600",
      headingColor: "text-purple-800",
    },
  };

  const { bgColor, textColor, headingColor } = colorSchemes[colorScheme];

  return (
    <div className={cx(`p-4 w-full`, bgColor, `border`, className)}>
      {title && (
        <h5 className={cx(`mb-2 text-xl font-semibold`, headingColor)}>
          {title}
        </h5>
      )}
      <div className={cx(`font-light`, textColor)}>{children}</div>
    </div>
  );
}

export const revalidate = 60 * 60;

const jsonURL =
  "https://sfozpnhknzamtdqmmjtl.supabase.co/storage/v1/object/public/homepage/homepage.json";

export default async function Home() {
  const resp = await fetch(jsonURL, { next: { revalidate: 60 * 60 } });
  const data = await resp.blob();

  const homepageInfo: {
    summary: string;
    summaryImage: string;
    summaryTitle: string;
    didYouKnow: string;
    didYouKnowImage: string;
  } = JSON.parse(await data.text());

  return (
    <div className="max-w-screen-lg mx-auto p-4 flex flex-col items-center min-w-min">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-2">
        <Card
          colorScheme="gray"
          title="What is Wonkypedia?"
          className="col-start-1"
        >
          <p>
            Wonkypedia is a free encyclopedia for an alternative universe. It is
            for those who love going down wiki rabbit holes, but are tired of
            doing learning about real things. As you click between links,
            articles are generated on the fly, building out a shared universe.
          </p>
        </Card>
        <Card
          colorScheme="blue"
          title="From the Article of the Day"
          className="md:col-start-1"
        >
          <Image
            src={homepageInfo.summaryImage}
            alt="Summary Image"
            width={148}
            height={148}
            className="float-right ml-4 mb-4"
          />
          <MarkdownRenderer markdown={transformLinks(homepageInfo.summary)} />
          <Link
            href={`/article/${homepageInfo.summaryTitle}`}
            className="text-blue-500 hover:underline"
          >
            Read More...
          </Link>
        </Card>
        <Card
          colorScheme="green"
          title="Did You Know?"
          className="md:col-start-2 md:row-start-1 md:row-span-2"
        >
          <Image
            src={homepageInfo.didYouKnowImage}
            alt="Did You Know Image"
            width={148}
            height={148}
            className="float-right ml-4 mb-4"
          />
          <MarkdownRenderer
            markdown={transformLinks(homepageInfo.didYouKnow)}
          />
        </Card>
        <Card
          colorScheme="purple"
          className="col-span-1 md:col-span-2"
          title="Please Read: A personal appeal from Wonkypedia's Founder"
        >
          <div className="flex flex-col-reverse md:flex-row gap-4 items-center">
            <div className="flex flex-col gap-2">
              <Image
                src={sawyer}
                alt="Sawyer Hood"
                width={200}
                height={200}
                className="aspect-square max-w-[200px] max-h-[200px]"
              />
              <a
                href="https://www.buymeacoffee.com/sawyerhood"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded w-full">
                  Donate Now
                </button>
              </a>
            </div>
            <div className="text-md max-w-lg mr-auto">
              <p className="mb-2 text-gray-500 font-semibold italic">
                Dear Wonkypedia visitors,
              </p>
              <p className="mb-2 text-justify italic">
                I humbly ask you to defend Wonkypedia&apos;s independence. It
                isn&apos;t cheap to beam these articles from a different
                dimension (use generative ai). If you donate a buck or two it
                goes a long way to keep the site running.
              </p>

              <p className="mb-2 font-semibold text-gray-500 italic">
                Thank you,
              </p>

              <p className="font-semibold text-gray-500 italic">Sawyer Hood</p>
            </div>
            <Image
              src={logo}
              alt="Wonkypedia Logo"
              width={smallW}
              height={smallH}
              className="hidden md:block"
              style={{
                aspectRatio: `${smallW}/${smallH}`,
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

const logoW = 887;
const logoH = 750;

const smallW = 887 / 3.5;
const smallH = 750 / 3.5;
