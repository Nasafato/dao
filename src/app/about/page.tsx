import { Metadata } from "next";

export default function AboutPage() {
  return (
    <div
      className={`
        max-w-xl mx-auto h-full space-y-8
        [&_p]:mb-3
      `}
    >
      <section>
        <h1 className="font-bold">About</h1>
        <p>
          The 道德经 (Dao De Jing) is a foundational Chinese text, compiled over
          2000 years ago. It is short, terse, and often very difficult to parse.
        </p>
        <p>Read it at your own peril.</p>
      </section>
      <section>
        <h2 className="font-bold">Why build this</h2>
        <p>
          I am trying to memorize the Dao, especially when I&apos;m on the go
          and the Internet is spotty. The base text is viewable offline, and the
          dictionary for the characters in the Dao is cached locally, as are the
          audio recordings.
        </p>
      </section>
      <section>
        <h2 className="font-bold">Why memorize the Dao</h2>
        <p>
          Memories change you. What is your mind if not your brain plus the sum
          of your past experiences? Those experiences leave grooves, and those
          grooves turn into your thoughts and your actions as you contend with
          the world.
        </p>
        <p>
          To memorize a text is to let it become part of you more fully than
          just reading it once or twice. Most knowledge in the world is useless
          within a week after learning it. You read enough books, blog posts,
          Twitter threads, watch enough movies, and see that many things are
          beautiful, much knowledge is intriguing, but how much of it lasts?
        </p>
        <p>
          So, I am memorizing the Dao. It is only 81 verses, totaling 5260
          Chinese characters. A few months of work for a lifetime.
        </p>
      </section>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Daodejing",
  description: "Study the Daodejing, with a dictionary and more.",
  openGraph: {
    title: "Daodejing",
    description: "Study the Daodejing, with a dictionary and more.",
    url: "https://daodejing.app",
    siteName: "Daodejing",
  },
  twitter: {
    card: "summary_large_image",
    site: "@daodejingapp",
    creator: "@9981apollo",
  },
  themeColor: "transparent",
  metadataBase: new URL("https://daodejing.app"),
};
