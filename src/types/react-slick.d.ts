declare module 'react-slick' {
  import { ComponentType } from 'react';
  export interface Settings {
    dots?: boolean;
    infinite?: boolean;
    speed?: number;
    slidesToShow?: number;
    slidesToScroll?: number;
    arrows?: boolean;
    autoplay?: boolean;
    autoplaySpeed?: number;
    adaptiveHeight?: boolean;
    responsive?: Array<{ breakpoint: number; settings: Settings | "unslick" }>;
    [key: string]: any;
  }

  const Slider: ComponentType<{ children: React.ReactNode; className?: string } & Settings>;
  export default Slider;
}