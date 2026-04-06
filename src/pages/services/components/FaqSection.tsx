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
        "How do you manage remote teams and ensure seamless execution?",
      answer:
        "We eliminate the typical friction of outsourcing by providing a dedicated supervisor at no additional cost for every engagement. This dedicated professional serves as your single point of contact, efficiently managing multiple talents across your project. This streamlined communication ensures rapid execution and extremely quick turnaround times without adding to your management overhead.",
    },
    {
      question:
        "Can we scale across different departments as our needs evolve?",
      answer:
        "Yes. Our operational framework is built on an integrated service model. Once you partner with us for any single service whether that is hiring a MERN stack developer or launching a marketing campaign, you gain instant, frictionless access to our full suite of solutions. You can easily scale up to include creative designers, broadcast managers, or financial bookkeepers as your business demands.",
    },
    {
      question:
        "How are you able to offer 40-60% cost reductions in manufacturing and development?",
      answer:
        "We achieve this by strategically leveraging highly competitive global hubs. For physical product manufacturing, we utilize an extensive network in Pakistan and China to optimize your supply chain, reducing costs by 40-60%. For tech and game development, we operate out of Pakistan, a rapidly growing market producing over 30,000 software engineers annually, allowing us to offer up to 60% savings compared to North American or European markets without ever compromising on quality.",
    },
    {
      question:
        "Does your team handle emerging technologies like AI and Web3?",
      answer:
        "Absolutely. We build digital infrastructure meant to future-proof your business. Beyond traditional web development, our teams specialize in predictive AI analytics, Natural Language Processing (NLP), and multi-agentic AI tools designed to automate complex business workflows. Within our game development department, we also build AR/VR experiences and integrate blockchain models like NFTs and Play-to-Earn mechanics.",
    },
    {
      question:
        "Why should a traditional brand consider your Esports solutions?",
      answer:
        "Traditional sports advertising has become highly saturated and expensive. Esports provides a direct, highly engaging avenue to capture the elusive younger demographic that is difficult to reach through conventional marketing. With experience executing over 125 global events for giants like Tencent, Samsung, and PepsiCo, we handle the entire ecosystem from live broadcast management and overlays to full tournament execution, making your brand's entry into the space completely seamless.",
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