import { useState } from "react";
import Faqicon from "@/assets/faqicon.png";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx"


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
      <div className="faq-text">
        <RisingText>
        <div>
           
          <span className="services-badge">ANSWERS AT YOUR FINGERTIPS</span>
     
          <h1 className="">
            Frequently <br /> Asked <br /> Questions
          </h1>
          
        </div>
        <span className="faq-subtext">Still Have Questions? Chat With Us</span>
        </RisingText>
      </div>

      {/* RIGHT COLUMN */}
      <div className="faq-list">
        {faqs.map((question, index) => (
          <div
            key={index}
            className={`faq-item ${openFaq === index ? "open" : ""}`}
            onClick={() => setOpenFaq(openFaq === index ? null : index)}
          >
            <div className="faq-question">
              <span>{question}</span>
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
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
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
