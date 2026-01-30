import React from "react";
import Rdimge1 from "@/assets/rdimg1.png";
import Rdimge2 from "@/assets/rdimg2.png";
import Rdimge3 from "@/assets/rdimg3.png";
import Rdimge4 from "@/assets/rdimg4.png";
import Rdicon from "@/assets/rdicon.png";
import RisingText from "@/transitions/RisingText";
import FadeIn from "@/transitions/FadeIn";
import Cardhovereffect from "@/transitions/cardhovereffect.tsx";

const cardsrd = () => {
  return (
    <div className="container">
      <FadeIn>
      <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-4 md:gap-0">
      
        <div className=" p-0 md:p-4">
          <div>
              <Cardhovereffect>
            <img src={Rdimge1} alt="" className="ridimge1 " />
            </Cardhovereffect>
            <div className="flex direction-row mt-5 justify-between">
              <h1 className="card-heading">Neural Interface Protocol</h1>
              <img
                src={Rdicon}
                alt=""
                className="w-[30px] h-[30px] md:w-[78px] md:h-[78px]"
              />
            </div>
            <p className="dark-text mt-5 md:mt-5">
              Developing next-generation human-computer interaction through
              advanced neural networks
            </p>
          </div>
        </div>
         <div className=" p-0 md:p-4">
          <div>
              <Cardhovereffect>
            <img src={Rdimge2} alt="" className="ridimge1 " />
            </Cardhovereffect>
            <div className="flex direction-row mt-5 justify-between">
              <h1 className="card-heading">Neural Interface Protocol</h1>
              <img
                src={Rdicon}
                alt=""
                className="w-[30px] h-[30px] md:w-[78px] md:h-[78px]"
              />
            </div>
            <p className="dark-text mt-5 md:mt-5">
              Developing next-generation human-computer interaction through
              advanced neural networks
            </p>
          </div>
        </div>
         <div className=" p-0 md:p-4">
          <div>
              <Cardhovereffect>
            <img src={Rdimge3} alt="" className="ridimge1 " />
            </Cardhovereffect>
            <div className="flex direction-row mt-5 justify-between">
              <h1 className="card-heading">Neural Interface Protocol</h1>
              <img
                src={Rdicon}
                alt=""
                className="w-[30px] h-[30px] md:w-[78px] md:h-[78px]"
              />
            </div>
            <p className="dark-text mt-5 md:mt-5">
              Developing next-generation human-computer interaction through
              advanced neural networks
            </p>
          </div>
        </div>
         <div className=" p-0 md:p-4">
          <div>
              <Cardhovereffect>
            <img src={Rdimge4} alt="" className="ridimge1 " />
            </Cardhovereffect>
            <div className="flex direction-row mt-5 justify-between">
              <h1 className="card-heading">Neural Interface Protocol</h1>
              <img
                src={Rdicon}
                alt=""
                className="w-[30px] h-[30px] md:w-[78px] md:h-[78px]"
              />
            </div>
            <p className="dark-text mt-5 md:mt-5">
              Developing next-generation human-computer interaction through
              advanced neural networks
            </p>
          </div>
        </div>
      </div>
      </FadeIn>
    </div>
  );
};

export default cardsrd;
