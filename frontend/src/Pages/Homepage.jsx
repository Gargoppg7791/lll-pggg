import React from "react";
import HomeCarousel from "../customer/Components/Carousel/HomeCarousel";
import { homeCarouselData } from "../customer/Components/Carousel/HomeCaroselData";
import HomeProductSection from "../customer/Components/Home/HomeProductSection";
import { lighting } from "../Data/Lighting/lighting";
import { sofas } from "../Data/sofas/sofas";
import { living } from "../Data/Living/living";
import { decor} from "../Data/Decor/decor";
import { study } from "../Data/Study/study";
import { dinning } from "../Data/Dinning/dinning";
import { storage } from "../Data/Storage/storage";
import { bedroom } from "../Data/Bedroom/bedroom";
import { carpet } from "../Data/Lighting/carpet";

const Homepage = () => {

  return (
    <div className="">
      <HomeCarousel images={homeCarouselData} />

      <div className="space-y-10 py-20">
      <HomeProductSection data={dinning} section={"Dinning Set"} />
        <HomeProductSection data={study} section={"Study's"} />
        <HomeProductSection data={storage} section={"Storage"} />
        <HomeProductSection data={lighting} section={"Lighting"} />
        <HomeProductSection data={sofas} section={"Sofas"} />
        <HomeProductSection data={living} section={"Living"} />
        <HomeProductSection data={decor} section={"Decor"} />
        <HomeProductSection data={bedroom} section={"Bedroom's"} />
        <HomeProductSection data={carpet} section={"Carpet's"} />
      </div>

      
    </div>
  );
};

export default Homepage;
