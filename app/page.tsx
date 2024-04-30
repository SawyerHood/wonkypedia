import MarkdownRenderer from "@/ui/MarkdownRenderer";
import { transformLinks } from "@/shared/articleUtils";
import sawyer from "@/assets/sawyer.jpg";
import logo from "./icon.png";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/ui/Card";
import { headers } from "next/headers";
import cx from "classnames";

export const revalidate = 60 * 60;

export default async function Home() {
  const origin = headers().get("origin") ?? headers().get("host");
  const baseURL = `${
    origin?.startsWith("localhost") ? "http" : "https"
  }://${origin}`;

  const resp = await fetch(`${baseURL}/api/homepage`, {
    next: { revalidate: 60 * 60 },
  });
  const data = await resp.json();

  const homepageInfo: {
    summary: string;
    summaryImage: string;
    summaryTitle: string;
    didYouKnow: string;
    didYouKnowImage: string;
  } | null = data;

  return (
    <div className="max-w-screen-lg mx-auto p-4 flex flex-col items-center min-w-min">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-2">
        <Card
          colorScheme="gray"
          title="What is Wonkypedia?"
          className={cx("col-start-1", {
            "col-span-1 md:col-span-2": !homepageInfo,
          })}
        >
          <p className="mb-4">
            Wonkypedia is a free encyclopedia for an alternative universe. It is
            for those who have exhausted the rabbit holes of Wikipedia and want
            to dive into an alternate timeline.
          </p>
          <Link href="/browse" className="text-blue-500 hover:underline">
            Browse New Articles...
          </Link>
        </Card>
        {homepageInfo && (
          <>
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
              <MarkdownRenderer
                markdown={transformLinks(homepageInfo.summary)}
              />
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
          </>
        )}
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
                className="aspect-square max-w-[200px] max-h-[200px] filter grayscale"
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
                dimension (using generative AI). If you donate a buck or two, it
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

const smallW = logoW / 3.5;
const smallH = logoH / 3.5;
