import React from "react";

//INTERNAL IMPORT
import Style from "./AudioLive.module.css";
import AudioCard from "./AudioCard/AudioCard";
import AudioCard2 from "./AudioCard2/AudioCard2";
import AudioCardSmall1 from "./AudioCardSmall1/AudioCardSmall1";
import AudioCardSmall2 from "./AudioCardSmall2/AudioCardSmall2";
import AudioCardSmall3 from "./AudioCardSmall3/AudioCardSmall3";

const AudioLive = () => {
  return (
    <div className={Style.audioLive}>
      <div className={Style.audioLive_box}>
        <div className={Style.audioLive_box_left}>
          <AudioCard />
          <AudioCard2 />
        </div>
        <div className={Style.audioLive_box_right}>
          <AudioCardSmall1 />
          <AudioCardSmall2 />
          <AudioCardSmall3 />
        </div>
      </div>
    </div>
  );
};

export default AudioLive;
