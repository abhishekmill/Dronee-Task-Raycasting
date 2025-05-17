import React from "react";

import { Typewriter } from "react-simple-typewriter";
const TypewritterEffect = () => {
  return (
    <div>
      {" "}
      <Typewriter
        words={["Eat", "Sleep is necessary", "Code", "Repeat!"]}
        loop={true}
        cursor
        cursorStyle="_"
        typeSpeed={70}
        deleteSpeed={50}
        delaySpeed={1000}
        // onLoopDone={handleDone}
        // onType={handleType}
      />
    </div>
  );
};

export default TypewritterEffect;
