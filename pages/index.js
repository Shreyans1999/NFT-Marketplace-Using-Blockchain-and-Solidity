import React from "react";
import Style from "../styles/index.module.css";
import { HeroSection, 
        Service, 
        BigNFTSlider,
        Subscribe,
        Title, 
        Category,
        Filter,
        NFTCard,
        Collection,
        FollowerTab,
      } from "../components/componentsindex";

const HOME = () => {
  return (
    <div className={Style.homePage}>
      <HeroSection/>
      <Service/>
      <BigNFTSlider/>
      <Title
        heading="New Collection"
        paragraph="Discover the most outstanding NFTs in all topics of life."
      />
      <FollowerTab/>
      <Collection/>
      <Title
        heading="Featured NFTs"
        paragraph="Discover the most outstanding NFTs in all topics of life."
      />
      <Filter/>
      <NFTCard/>
      <Title 
        heading="Browse by category"
        paragraph="Explore the NFTs in the most featured categories."
      />
      <Category/>
      <Subscribe/>
    </div>
  );
};

export default HOME