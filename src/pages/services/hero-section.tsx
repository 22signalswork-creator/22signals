import "./services.css";
import MyButton from "@/components/CustomButton";

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
                <h1>Creative Marketing Solutions</h1>

                <p className="dark-text">
                  We help businesses grow, launch products, and build enduring
                  relationships with their communities.
                </p>

                <MyButton text="GET STARTED" />
              </div>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}
