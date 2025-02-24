import React from "react";
import "./Preloader.css";

const Preloader: React.FC = () => {
  return (
    <div className="preloader-wrapper">
      <div className="container">
        <div className="part1">АСУ</div>
        <div className="part2">ТП</div>
      </div>
      <div className="loader">
        <div className="loading"></div>
      </div>
    </div>
  );
};

export default Preloader;
