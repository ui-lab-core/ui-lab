import { IndistinguishableSection } from "./sections/indistinguishable-section";
import { WorkshopIndex } from "./sections/workshop-index";
import { workshopGalleryItems } from "./sections/workshop-section";
import { ContentGallery } from "./content-gallery";
import { Button } from "ui-lab-components/button";
import { Anchor } from "ui-lab-components/anchor";
import { Expand } from "ui-lab-components/expand";
import { AgentResultPreview, ThemePreview } from "./redesign-previews";
import { ShowcaseCarousel } from "./showcase-carousel";

const wideElementWidth = "w-[min(52rem,calc(100vw-2.5rem))]";

const faqItems = [
  {
    question: "Do I need the /lab skill to use UI Lab?",
    answer:
      "No. The components work like any React library. The skill and MCP server only help your agent find and use them correctly.",
  },
  {
    question: "Which agents does the MCP server work with?",
    answer:
      "Any agent that supports the Model Context Protocol can query the library, including Claude Code, Cursor, and Codex.",
  },
  {
    question: "Can I match UI Lab to my existing brand?",
    answer:
      "Yes. Themes are built from semantic tokens, so changing your palette, typography, spacing, and radii restyles every component at once.",
  },
  {
    question: "Does it support light and dark mode?",
    answer:
      "Both modes share the same semantic tokens. A theme defines the values for each, and components switch without extra overrides.",
  },
  {
    question: "Is Workshop content free to use?",
    answer:
      "Elements, sections, and starters in Workshop are meant to be copied into your project and adapted, by you or your agent.",
  },
];

export function RedesignLanding() {
  return (
    <div className="w-full overflow-x-clip">
      <div className="mx-auto w-full max-w-[560px] px-5 sm:px-0">
        <article className="min-w-0 w-full pt-20 pb-12 leading-relaxed text-foreground-300 sm:pt-26 sm:pb-18">
          <header
            className={`flex flex-col items-start gap-8 mb-15 min-h-[25vh] justify-end sm:flex-row sm:items-end sm:justify-start sm:gap-0 sm:mb-25 relative left-1/2 ${wideElementWidth} -translate-x-1/2`}
          >
            <div className="min-w-0">
              <h1 className="mb-2 text-balance text-2xl font-semibold leading-snug tracking-normal sm:whitespace-nowrap sm:text-3xl md:text-4xl text-foreground-200">
                Make your Interfaces <br />
                <span className="inline-block bg-linear-to-b from-foreground-200 to-foreground-400 bg-clip-text text-transparent">
                  Stand out in an era of Slop.
                </span>
              </h1>
              <span className="text-base font-medium leading-6 tracking-normal text-foreground-400 sm:text-md sm:leading-[28.8px]">
                Your agent&apos;s favorite UI Library.
              </span>
            </div>
            <div className="flex w-full flex-col gap-2 sm:ml-auto sm:w-55">
              <Button size="lg" variant="outline" href="/docs">
                Browse Library
              </Button>
              <Button size="lg" variant="primary" href="/docs">
                Getting Started
              </Button>
            </div>
          </header>

          {/* Full-bleed so neighbouring entries peek in from both viewport edges. */}
          <div className="relative left-1/2 w-screen -translate-x-1/2">
            <ShowcaseCarousel />
          </div>

          <IndistinguishableSection />

          <section className="mt-16 sm:mt-24" aria-labelledby="lab-skill-heading">
            <h2
              id="lab-skill-heading"
              className="text-xl font-medium leading-tight tracking-tight text-foreground-100"
            >
              What changed on the right.
            </h2>
            <p className="mt-5">
              The right prompt began with{" "}
              <code className="font-mono text-foreground-100">/lab</code>, a{" "}
              <Anchor href="/docs/skill">skill</Anchor> that has your agent find fitting components
              and Workshop starters before it builds. It styles with your theme&apos;s{" "}
              <Anchor href="/docs/customization">semantic tokens</Anchor>, so the result looks like
              your product.
            </p>
            <p className="mt-5">
              The model stays the same; the skill adds a method, and the{" "}
              <Anchor href="/docs/ai-integration">MCP server</Anchor> adds a reference to check
              against.
            </p>
          </section>

          <section className="my-12 sm:my-20" aria-labelledby="building-blocks-heading">
            <h3 className="mb-16 text-xl sm:mb-32 sm:text-2xl font-medium leading-snug tracking-tight">
              Workshop is an ever-growing index of elements, sections and starters that you and your
              agent can query.
            </h3>
            <WorkshopIndex />
            <div className="relative left-1/2 w-[min(66rem,calc(100vw-2.5rem))] -translate-x-1/2">
              <ContentGallery label="Workshop categories" items={workshopGalleryItems} />
            </div>
          </section>

          <section className="mt-24 sm:mt-32" aria-labelledby="agent-heading">
            <h2
              id="agent-heading"
              className="text-xl font-medium leading-tight tracking-tight text-foreground-100"
            >
              The same reference for you and your agent.
            </h2>
            <p className="mt-5">
              Through MCP, your agent reads component APIs and examples before writing, so you can
              ask for a settings panel without spelling out every prop.
            </p>
            <p className="mt-5">
              You read the docs and your agent queries the same source, which makes its choices easy
              to review.
            </p>
            <h3 className="mt-10 max-w-[32ch] text-xl font-medium leading-snug tracking-tight text-foreground-400">
              <span className="block text-foreground-100">Your components. Your agent.</span>
              One shared source to build from.
            </h3>
            <AgentResultPreview />
          </section>

          <section className="mt-24 sm:mt-32" aria-labelledby="design-language-heading">
            <h2
              id="design-language-heading"
              className="text-xl font-medium leading-tight tracking-tight text-foreground-100"
            >
              Your style, one system.
            </h2>
            <p className="mt-5">
              Set your palette, typography, spacing, and radii in the configurator and export it.
              Semantic tokens carry those choices to every component in light and dark mode.
            </p>
            <h3 className="mt-10 text-xl sm:text-2xl font-medium leading-snug tracking-tight">
              You own the look while UI Lab handles the function, so restyling never means
              rebuilding.
            </h3>
            <ThemePreview />
          </section>

          <section className="mt-24 sm:mt-32" aria-labelledby="faq-heading">
            <h2
              id="faq-heading"
              className="text-xl font-medium leading-tight tracking-tight text-foreground-100"
            >
              Questions
            </h2>
            <div className="mt-5 flex flex-col gap-1">
              {faqItems.map((item) => (
                <Expand key={item.question} title={item.question}>
                  <p className="pb-3">{item.answer}</p>
                </Expand>
              ))}
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
