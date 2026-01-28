import React from "react";
import Slider from "react-slick";
// Ensure these are imported in your project!
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const SliderComponent = ({ slides }) => {
  if (!slides || slides.length === 0) return null;

  const settings = {
    dots: false,
    infinite: slides.length > 8, // Only infinite if we have enough slides
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 8,
    slidesToScroll: 1,
    arrows: true,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1400,
        settings: { slidesToShow:8}
      },
      {
        breakpoint: 1300,
        settings: { slidesToShow: 7}
      },
      {
        breakpoint: 1100,
        settings: { slidesToShow: 6}
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 5 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 2 }
      }
    ]
  };

  return (
    <div className="brands_slider_container w-full max-w-[1440px] mx-auto py-8 overflow-hidden">
      <Slider {...settings}>
        {slides.map((img, index) => (
          <div key={index} className="outline-none px-2">
            <div className="flex justify-center items-center h-20 w-full">
              <img
                src={img}
                alt={`Logo ${index + 1}`}
                /* FIX: Removed fixed w-60/w-32. 
                   max-h-full and max-w-full allow the image to 
                   shrink to fit the slider's column width.
                */
                className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SliderComponent;