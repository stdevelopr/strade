import React, { useEffect, useRef } from "react";
import Draggable from "react-draggable";

const modal = {
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  top: "150px",
  left: "150px"
};

const Modal = ({ children, open, handleClose }) => {
  const [pinModal, setpinModal] = React.useState(false);

  useEffect(() => {
    if (open && !pinModal) document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, [open, pinModal]);

  const handleClick = e => {
    if (node.current.contains(e.target)) return;
    else handleClose();
  };

  const node = useRef();
  return (
    <div ref={node}>
      <Draggable>
        <div style={modal}>
          {open && <button onClick={() => setpinModal(!pinModal)}>Pin</button>}
          {open && children}
        </div>
      </Draggable>
    </div>
  );
};

export default Modal;
