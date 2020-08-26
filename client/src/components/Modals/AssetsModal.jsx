import React, { useState, useEffect } from "react";
import { Modal } from "semantic-ui-react";
import { Dropdown, Input } from "semantic-ui-react";
import { Table } from "semantic-ui-react";

const AssetsModal = ({ open, setOpen }) => {
  const [assetsList, setAssetsList] = useState([]);
  //   const get_assets = () => {
  //     fetch("/api/binance/dashboard/assets")
  //       .then(res => res.json())
  //       .then(r => setAssetsList(r));
  //   };

  useEffect(() => {
    fetch("/api/binance/dashboard/assets")
      .then(res => res.json())
      .then(r => setAssetsList(r));
  }, []);
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="small"
      // trigger={<Button>Show Modal</Button>}
    >
      <Modal.Header>Assets</Modal.Header>
      <Modal.Content>
        {" "}
        {assetsList.map(item => {
          return (
            <div>
              <p>{item.asset}</p>
              <p>free: {item.free}</p>
              <p>locked: {item.locked}</p>
              ----------------
            </div>
          );
        })}
      </Modal.Content>
    </Modal>
  );
};

export default AssetsModal;
