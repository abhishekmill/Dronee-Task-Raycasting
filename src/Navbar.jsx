import React from "react";

const Navbar = () => {
  return (
    <div className="w-full flex justify-center items-center h-20  absolute z-10    ">
      <div className="text-white flex justify-evenly items-center capitalize font-semibold w-1/2 hover:w-[60%] h-10 bg-[#010107c0] hover:bg-[#010107] duration-500 rounded-full ">
        <div className="p-3">0.1 Unit = 1 meter</div>
        <div className="p-3">Raycasting-App</div>
        <div
          onClick={() =>
            window.open(
              "https://github.com/abhishekmill/Dronee-Task-Raycasting",
              "_blank"
            )
          }
          className="p-3 hover:text-slate-500"
        >
          Repo-Link
        </div>
        <div
          onClick={() =>
            window.open("https://github.com/abhishekmill", "_blank")
          }
          className="p-3 hover:text-slate-500"
        >
          Git Hub
        </div>
        <div
          onClick={() =>
            window.open("https://3-dportfolio-iota.vercel.app/", "_blank")
          }
          className="p-3 hover:text-slate-500"
        >
          Portfolio
        </div>
      </div>
    </div>
  );
};

export default Navbar;
