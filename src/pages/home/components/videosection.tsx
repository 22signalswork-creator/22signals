import videoplayer from "@/assets/videoplayer.png";
import videoplay from "@/assets/videoplay.svg";
import { useState } from "react";


const VideoSection = () => {
  const [open, setOpen] = useState(false);


  const youtubeUrl = "https://www.youtube.com/embed/VnRC8PyzBT8?autoplay=1";

  return (
    <>
      {/* Thumbnail Section */}
      <div className="w-full m-0 p-0 flex justify-center">
        <div className="relative w-full max-w-[668px] h-[300px] overflow-hidden rounded-[24px]">
          <div
            className="w-full h-full bg-cover bg-center flex items-center justify-center cursor-pointer"
            style={{
              backgroundImage: `url(${videoplayer})`,
            }}
            onClick={() => setOpen(true)}
          >
            <img
              src={videoplay}
              alt="Play Button"
              className="h-16 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="relative w-[90%] max-w-[900px] aspect-video bg-black rounded-xl overflow-hidden">
           <button
  className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white text-black rounded-full shadow-md hover:bg-gray-200 transition"
  onClick={() => setOpen(false)}
>
  ✕
</button>


            <iframe
              className="w-full h-full"
              src={youtubeUrl}
              title="YouTube video"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoSection;
