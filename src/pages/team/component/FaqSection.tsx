import { useState } from "react";
import Faqicon from "@/assets/faqiconwhite.png";
import Dot from "@/assets/Ellipse 379.png";
import "../team.css";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx";

export default function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // FAQ data lives here inside the component
  const faqs = [
    "What types of remote resources can I hire through Hubux, and how quickly can I start?",
    "How does Hubux ensure the quality and productivity of developers?",
    "What is the minimum contract term, and how flexible is the hiring model?",
    "How does Hubux ensure data privacy, process, and what if I'm not satisfied?",
    "How do I communicate and collaborate with my remote team, and what support?",
  ];

  return (
    <section className="container">
      <div className="faq-section">
        {/* LEFT COLUMN */}
        <FadeIn>
        <div className="faq-text">
          <div>
            <span className="services-badge-team">
              ANSWERS AT YOUR FINGERTIPS
            </span>
            <h2 className="">
              Frequently <br /> Asked <br /> Questions
            </h2>
          </div>
          <span className="poppins">Still Have Questions? Chat With Us</span>
        </div>
        </FadeIn>

        {/* RIGHT COLUMN */}
        <div className="faq-list">
          {faqs.map((question, index) => (
            <div
              key={index}
              className={`Faq-item ${openFaq === index ? "open" : ""}`}
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
            >
              <div className="Faq-question">
                <img src={Dot} alt="Dot" className="w-[9px] h-[9px] mt-1" />
                <span className="faq-question-text">{question}</span>

                <span className="Faq-icon">
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
                <div className="Faq-answer">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
