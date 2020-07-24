import React from "react";
import Radium from "radium";

const Sidenav = () => {
  return (
    <div style={styles}>
      <p>Indic.</p>
      <p>Simul.</p>
    </div>
  );
};

const styles = {
  background: "#272c36",
  position: "fixed",
  width: "50px",
  color: "white",
  height: "100vh"
};
export default Sidenav;
