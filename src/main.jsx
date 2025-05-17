import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import React from "react";
import { Mesh } from "three";
import { acceleratedRaycast } from "three-mesh-bvh";

Mesh.prototype.raycast = acceleratedRaycast;
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
