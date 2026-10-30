import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import MyButton from "@/components/CustomButton";
import { useNavigate } from "react-router-dom";
import { DetailCard, usePortfolioRows } from "@/pages/portfolio/components/tabs";
import Logo22 from "@/assets/22signals-logo.png";
import Portfoliobg from "@/assets/footerbg.png";
import Union from "@/assets/Union.svg";
import ShadowL from "@/assets/ShadowL.png";
import FadeIn from "@/transitions/FadeIn";

interface Props {
  title?: string;
}

/**
 * Reusable featured-projects carousel. Pulls from `projects` table where
 * `is_featured = true`. Used across home, services, portfolio, R&D, blog,
 * contact pages just above the CTA / footer.
 *
 * NOTE: Not used on the team page (per brief: team page only gets the
 * testimonials section, not featured projects).
 */
const FeaturedProjectsSection: React.FC<Props> = ({ title = "Featured Projects" }) => {
  const navigate = useNavigate();
  // Reactive isMobile so the slider re-evaluates on viewport change.
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // The real case studies from the portfolio, so names, images and links always match.
  const projects = usePortfolioRows();

  const settings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4000,
    adaptiveHeight: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1, centerMode: true, centerPadding: "56px", arrows: false, dots: true } },
    ],
    ...(isMobile ? { slidesToShow: 1, slidesToScroll: 1, centerMode: true, centerPadding: "56px", arrows: false, dots: true } : {}),
  };

  return (
    <div
      className="relative pt-0 pb-12 overflow-hidden"
      style={{
        backgroundImage: `url(${Portfoliobg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <img src={ShadowL} alt="" className="absolute left-0 top-0 h-full object-contain opacity-60 pointer-events-none" />
      <img
        src={Logo22}
        alt=""
        aria-hidden
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[420px] md:w-[680px] opacity-[0.05] pointer-events-none select-none"
        draggable={false}
      />

      <section className="container mx-auto px-4 md:px-8 relative z-10 pb-6 pt-10">
        <FadeIn direction="up">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="recentproject-title text-2xl md:text-3xl font-light text-center md:text-left flex items-center">
              {title}
              <img src={Union} alt="Union" className="ml-2 inline-block w-4 h-4" />
            </h2>
            <div className="mt-4 md:mt-0">
              <MyButton
                text="ALL PORTFOLIO"
                variant="primary"
                onClick={() => navigate("/portfolio")}
              />
            </div>
          </div>
        </FadeIn>

        <div className="relative">
          {projects.length > 0 && (
          <Slider {...settings} className="w-full featured-slider">
            {projects.map((row) => (
              <div key={row.slug} className="px-2 h-full">
                <DetailCard row={row} />
              </div>
            ))}
          </Slider>
          )}
        </div>
      </section>
    </div>
  );
};

export default FeaturedProjectsSection;
