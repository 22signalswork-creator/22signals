import "@/pages/services/services.css";
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
                <h2 className="team-title">Behind The Scenes</h2>

                <p className="white-text">
                 A diverse team of creators, thinkers, and innovators dedicated to excellence
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
