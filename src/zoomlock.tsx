import { useState, useEffect, useLayoutEffect } from 'react';

export const useZoomLock = (designWidth = 1440, breakpoint = 768) => {
  const [scale, setScale] = useState(0.6);
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width <= breakpoint) {
        setIsMobile(true);
        setScale(1);
      } else {
        setIsMobile(false);
        setScale(width / designWidth);
      }
    };

    console.log("useZoomLock initialized");
    console.log(`Design Width: ${designWidth}, Breakpoint: ${breakpoint}`);
    console.log(`Initial scale : ${scale}`);

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener('resize', handleResize);
  }, [designWidth, breakpoint]);

  return { scale, isMobile };
};