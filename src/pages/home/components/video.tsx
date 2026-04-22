import { useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import videoplayer from "@/assets/videoplayer.png";
import videoplay from "@/assets/videoplay.svg";

gsap.registerPlugin(ScrollTrigger);

const Video = () => {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!videoRef.current || !containerRef.current) return;

    // Initialize MatchMedia
    let mm = gsap.matchMedia();

    // Desktop view (min-width: 768px)
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 15%",
          end: "+=700",
          scrub: 1,
          pin: true,
          pinSpacing: true,
        },
      });

      // STEP 1: Down 100px
      tl.to(videoRef.current, {
        y: 100,
        x: 0,
        scale: 1,
        duration: 1,
        ease: "power1.inOut",
      })
      
      // STEP 2: Enlarge and move left
      .to(videoRef.current, {
        x: "-22%",
        y: 120,
        scale: 1.45,
        duration: 1,
        ease: "power2.out",
      });
    });

    // Cleanup mm on unmount
    return () => mm.revert();
  }, []);

  return (
    <>
      <div ref={containerRef} className="w-full flex justify-center items-start overflow-visible">
        <div 
          ref={videoRef}
          className="relative z-50 w-full max-w-[668px] h-[350px] overflow-hidden rounded-[24px] shadow-2xl transition-none"
        >
          <div
            className="w-full h-full bg-cover bg-center flex items-center justify-center cursor-pointer"
            style={{ backgroundImage: `url(${videoplayer})` }}
            onClick={() => setOpen(true)}
          >
            <img src={videoplay} alt="Play Button" className="h-16 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {open && (
        <div className="fixed inset-0 z-[1000] bg-black/80 flex items-center justify-center" onClick={() => setOpen(false)}>
          <div className="relative w-[90%] max-w-[900px] aspect-video bg-black rounded-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white text-black rounded-full" 
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/VnRC8PyzBT8?autoplay=1"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
};

export default Video;