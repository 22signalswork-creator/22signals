import "./services.css";
import MyButton from "@/components/CustomButton";
import AnimatedText from "@/transitions/herosectionP.tsx";
import RisingText from "@/transitions/RisingText";

export default function HeroSection() {
  return (
    <section className="hero-section">

      {/* Outer container for layout */}
      <div className="container">

        {/* Background holder */}
        <div className="servicebg-wrapper">
          <div className="servicebg">

            {/* Inner container for content */}
            <div className="content-container">
              <div className="service-content">
                <RisingText>
                <h1>Creative Marketing Solutions</h1>
                </RisingText>

               <AnimatedText className="dark-text text-base md:text-lg max-w-xl">
                  We help businesses grow, launch products, and build enduring
                  relationships with their communities.
                </AnimatedText>

                  <RisingText>
                <MyButton text="GET STARTED" />
                </RisingText>
              </div>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}
