import { useState } from "react";
import Faqicon from "@/assets/faqicon.png";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx";

export default function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // ✅ Updated FAQ Data (Question + Answer)
const faqs = [
  {
    question:
      "Do you have experience working within my specific industry?",
    answer:
      "Yes. Our portfolio spans a highly diverse range of industries. From executing global broadcasts to developing AI solutions for enterprises and manufacturing physical merchandise for retail brands, our agile framework adapts to your specific market demands.",
  },
  {
    question:
      "Can I request a more detailed case study for a specific project?",
    answer:
      "Absolutely. While this portfolio represents a curated high-level overview of our capabilities and aesthetic standard, we are happy to provide in-depth performance metrics, ROI breakdowns, and technical case studies during our discovery call.",
  },
  {
    question:
      "Were these projects executed using your dedicated supervisor model?",
    answer:
      "Yes. Every project showcased in our portfolio whether it required a single UI/UX designer or an entire outsourced backend office was managed through our dedicated supervisor framework. This ensures the rapid execution and flawless quality you see in our work, all managed through a single point of contact.",
  },
  {
    question:
      "If my project requires multiple services (e.g., Web Development and Social Media Management), do I need to hire different teams?",
    answer:
      "No. That is the core advantage of 22 Signals. Many of the projects in our portfolio utilize cross-departmental execution. Engaging us for one service grants you instant access to our full suite of digital, creative, and operational solutions.",
  },
  {
    question:
      "How quickly can we start a project like the ones shown here?",
    answer:
      "Our global infrastructure is built for speed. Once we understand your vision and align on goals, we can deploy the necessary talent from developers to esports broadcast managers and initiate execution almost immediately.",
  },
];

  return (
    <section className="container">
      <div className="faq-section">
        {/* LEFT COLUMN */}
        <div className="faq-text">
          <RisingText>
            <div>
              <span className="services-badge">
                ANSWERS AT YOUR FINGERTIPS
              </span>

              <h1>
                Frequently <br /> Asked <br /> Questions
              </h1>
            </div>

            <span className="faq-subtext">
              Still Have Questions? Chat With Us
            </span>
          </RisingText>
        </div>

        {/* RIGHT COLUMN */}
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openFaq === index ? "open" : ""}`}
              onClick={() =>
                setOpenFaq(openFaq === index ? null : index)
              }
            >
              <div className="faq-question">
                <span>{faq.question}</span>

                <span className="faq-icon">
                  {openFaq === index ? (
                    "−"
                  ) : (
                    <img
                      src={Faqicon}
                      alt="FAQ Icon"
                      className="faq-icon-img"
                    />
                  )}
                </span>
              </div>

              {openFaq === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}