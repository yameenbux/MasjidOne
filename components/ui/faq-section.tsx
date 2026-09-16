import { Check, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { DEMO_MAILTO } from "@/lib/site";

// Structure copied from the supplied block. Two things differ, both because
// leaving them would break a rule the rest of the site holds to:
//
//  - The heading is an h2, not the block's h4. Every other section on the page
//    opens at h2, and going straight from h3 to h4 here would skip a level.
//  - The button renders as an anchor via asChild. It navigates — it opens a
//    mail client — so it has to be a link, not a <button>.
//
// The block's imported-but-unused Check icon does the job it was clearly
// imported for: marking the four commitments, which used to sit in their own
// list above the questions and are kept here in full.

const COMMITMENTS: readonly { title: string; body: string }[] = [
  {
    title: "One-click full export, always",
    body: "Your data leaves in a standard format whenever you ask. Written into the agreement, not offered as a favour.",
  },
  {
    title: "Role-based access",
    body: "A teacher sees their own classes. A parent sees their own children. The committee sees committee-level data. Nobody sees everything by default.",
  },
  {
    title: "ICO registration and a signed DPA",
    body: "Registered with the Information Commissioner's Office, with a written data processing agreement for your masjid, before your first invoice.",
  },
  {
    title: "A documented retention policy",
    body: "How long a child's record is kept, and what happens when they leave, stated in advance rather than decided later.",
  },
];

const QUESTIONS: readonly { q: string; a: string }[] = [
  {
    q: "We already have a website and an app. Why change?",
    a: "If the congregation side is all you need, you may well not need us — plenty of platforms do it. The reason to move is that your madrasah runs somewhere else entirely, so the same family exists twice and nothing reconciles. We join the two. That is the only thing we ask you to buy.",
  },
  {
    q: "You are a small company in Bolton. What if you stop?",
    a: "A fair question and the one we get asked most. The answer is contractual: one-click full export of everything, in a standard format, at any time, written into your agreement from day one. You are never holding data you cannot take somewhere else.",
  },
  {
    q: "Our madrasah runs on paper and WhatsApp. Is this too much?",
    a: "No, and migration from paper is usually simpler than migration from an existing system. Setup covers getting the class lists in and the teachers trained. Most madrasahs switch over one weekend, before a new term rather than mid-term.",
  },
  {
    q: "Is there a commission on donations?",
    a: "No. 0%, permanently, in writing. Payment processing fees are charged by the card provider and go to them, not to us — we take nothing from what the congregation gives.",
  },
  {
    q: "When is the madrasah portal ready?",
    a: "It is in development now, targeted at the September 2027 intake, because madrasahs change systems before a new year rather than during one. Early partner mosques go on first and help shape it. Until then we will not pretend it is shipping — the congregation modules are what is live today.",
  },
];

function FAQ() {
  return (
    <section id="trust" className="w-full border-t border-border py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="flex gap-10 flex-col">
            <div className="flex gap-4 flex-col">
              <div>
                <Badge variant="outline">Your data</Badge>
              </div>
              <div className="flex gap-2 flex-col">
                <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-left font-regular">
                  This platform will hold attendance records for your children.
                </h2>
                <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground  text-left">
                  That deserves a straight answer before a signature, not a
                  privacy policy nobody reads. Here is what is committed in
                  writing before a masjid is ever invoiced.
                </p>
              </div>
              <ul className="flex flex-col gap-4 max-w-xl lg:max-w-lg">
                {COMMITMENTS.map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <Check aria-hidden="true" className="w-4 h-4 mt-1 shrink-0 text-accent" />
                    <span className="flex flex-col gap-1 text-left">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-sm leading-relaxed text-muted-foreground">
                        {item.body}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="">
                <Button className="gap-4" variant="outline" asChild>
                  <a href={DEMO_MAILTO}>
                    Any questions? Reach out <PhoneCall aria-hidden="true" className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full">
            {/* Radix mounts no content for a collapsed item, so with JavaScript
                disabled the answers are not hidden — they are absent. This
                plain copy is the fallback; globals.css shows one or the other
                depending on the js class, and never both. */}
            <dl className="faq-nojs w-full">
              {QUESTIONS.map((item) => (
                <div key={item.q} className="border-b py-4">
                  <dt className="font-medium">{item.q}</dt>
                  <dd className="text-sm text-muted-foreground leading-relaxed max-w-2xl mt-2 ml-0">
                    {item.a}
                  </dd>
                </div>
              ))}
            </dl>
          <Accordion type="single" collapsible className="faq-js w-full">
            {QUESTIONS.map((item, index) => (
              <AccordionItem key={item.q} value={"index-" + index}>
                <AccordionTrigger className="text-left gap-4">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed max-w-2xl">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}

export { FAQ };
