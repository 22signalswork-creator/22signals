import React, { useState } from "react";
import Faqicon from "@/assets/faqicon.png";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import { useCMS } from "@/hooks/useCMS";
import { usePageContent } from "@/hooks/usePageContent";

interface Faq {
  id: number | string;
  question: string;
  answer: string;
  page?: string;
  sort_order?: number;
  is_active?: boolean;
}

// Fallback used when the `faqs` table is empty for page='home'.
const FALLBACK_FAQS: Faq[] = [
  {
    id: 1,
    question: "How do you ensure efficiency?",
    answer:
      "We provide a dedicated supervisor at no extra cost to serve as your single point of contact.",
  },
  {
    id: 2,
    question: "What if I need multiple services?",
    answer:
      "Engaging us for one service unlocks instant access to our entire suite of solutions.",
  },
  {
    id: 3,
    question: "How much can I save?",
    answer:
      "Expect 40-60% savings across all services with faster business growth.",
  },
  {
    id: 4,
    question: "What roles can I outsource?",
    answer:
      "We provide talent across tech, marketing, finance, customer support, and real estate.",
  },
];

const HomeFaq: React.FC = () => {
  // Default state is `null` so EVERY FAQ row starts collapsed. The previous
  // default of `0` always left the first question open on first render,
  // which the brief explicitly asked to remove.
  const [open, setOpen] = useState<number | null>(null);
  const { t } = usePageContent();

  const { data: faqs } = useCMS<Faq>("faqs", {
    filter: { page: "home", is_active: true },
    orderBy: "sort_order",
    fallback: FALLBACK_FAQS,
  });

  return (
    <section className="bg-[#000202] pt-8 pb-24">
      <div className="container">
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
            <div>
              <div
                className="inline-block px-4 py-1.5 rounded-full text-xs tracking-[0.25em] uppercase mb-5"
                style={{
                  border: "1px solid rgba(80,140,255,0.4)",
                  color: "rgba(180,200,255,0.9)",
                }}
              >
                {t("home_faq_eyebrow", "Answers At Your Fingertips")}
              </div>
              <RisingText>
                <h2 className="text-4xl md:text-[56px] text-white leading-tight">
                  {t("home_faq_heading_line1", "Frequently")} <br /> {t("home_faq_heading_line2", "Asked")} <br /> {t("home_faq_heading_line3", "Questions")}
                </h2>
              </RisingText>
              <p className="text-white/55 mt-6">
                {t("home_faq_subtitle", "Still have questions? Chat with us.")}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {faqs.map((item, i) => {
                const isOpen = open === i;
                return (
                  <div
                    key={item.id ?? i}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className={`cursor-pointer rounded-2xl p-5 md:p-6 transition-all duration-300 ${
                      isOpen ? "bg-blue-500/10" : "bg-white/[0.03] hover:bg-white/[0.06]"
                    }`}
                    style={{
                      border: `1px solid ${
                        isOpen ? "rgba(80,140,255,0.5)" : "rgba(255,255,255,0.08)"
                      }`,
                    }}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-white text-base md:text-lg font-medium">
                        {item.question}
                      </span>
                      <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-white text-2xl leading-none">
                        {isOpen ? (
                          "−"
                        ) : (
                          <img src={Faqicon} alt="open" className="w-6 h-6 object-contain" />
                        )}
                      </span>
                    </div>
                    {isOpen && (
                      <div className="mt-4 text-white/70 text-sm md:text-base leading-relaxed">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default HomeFaq;
