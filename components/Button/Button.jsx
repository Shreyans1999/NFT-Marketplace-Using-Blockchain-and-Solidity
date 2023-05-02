import React from "react";

//INTERNAL IMPORT
import Style from "./Button.module.css";

//Changes been done in 3:9 - 3:12 changes in button.jsx, Sidebar.jsx, navar.jsx
const Button = ({ btnName, handleClick }) => {
  return (
    <div className={Style.box}>
      <button className={Style.button} onClick={() => handleClick()}>
        {btnName}
      </button>
    </div>
  );
};

export default Button;
