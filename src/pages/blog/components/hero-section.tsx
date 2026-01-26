import "@/pages/services/services.css";

export default function HeroSection() {
  return (
    <section className="hero-section">
      {/* Outer container for layout */}
      <div className="container">
        {/* Background holder */}
        <div className="servicebg-wrapper">
          <div
            className="w-[1600px] h-[657px] -mx-[70px] rounded-[50px] flex items-center relative"
            style={{
              backgroundImage: `linear-gradient(
        to top,
        rgba(50, 95, 236, 0.25) 7%,
        rgba(50, 95, 236, 0.15) 25%,
        rgba(50, 95, 236, 0) 52%
      ),
      url('/src/assets/servicebg.png')`,
              backgroundSize: "cover, contain, cover",
              backgroundPosition: "center, right bottom, center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Inner container for content */}
            <div className="content-container">
              <div className="flex flex-col items-center justify-center text-center space-y-6 py-12 gap-5">
                <h1>Insights & <br></br>Perspectives</h1>

                <p className="dark-text px-10 md:px-0">
                  Thoughts on design, technology, and the future of digital
                  experiences
                </p>
               <div className="flex justify-center">
  <input
    type="text"
    placeholder="Search Articles......."
    className="w-[300px] md:w-[970px] px-4 py-4 bg-white rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
