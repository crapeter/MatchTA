import React from "react";
import { useNavigate } from "react-router-dom";

import "../CSS/NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <div className="NavBar">
      <div className="nav-hover-area"></div>
      <nav>
        <button onClick={() => navigate("/")}>🏠</button>
        <button onClick={() => navigate("/Upload/1")}>1</button>
        <button onClick={() => navigate("/Upload/2")}>2</button>
        <button onClick={() => navigate("/Upload/3")}>3</button>
        <button onClick={() => navigate("/Results")}>💻</button>
      </nav>
    </div>
  );
};

export default NavBar;
