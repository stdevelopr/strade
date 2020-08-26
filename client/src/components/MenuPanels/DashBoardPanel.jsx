import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import OrdersInfoModal from "../Modals/OrdersInfoModal";
import AssetsModal from "../Modals/AssetsModal";

const DashBoardPanel = () => {
  const [balance, setBalance] = useState("");
  // const [assetsList, setAssetsList] = useState([]);
  const [ordersModalOpen, setOrdersModalOpen] = useState(false);
  const [assetsModalOpen, setAssetsModalOpen] = useState(false);

  const get_balance = () => {
    fetch("/api/binance/dashboard/balance")
      .then(res => res.text())
      .then(r => setBalance(r));
  };

  // const get_assets = () => {
  //   fetch("/api/binance/dashboard/assets")
  //     .then(res => res.json())
  //     .then(r => setAssetsList(r));
  // };

  return (
    <div>
      <h3>Dashboard</h3>
      <h2>Balance</h2>
      <p>{balance}</p>
      <button onClick={() => get_balance()}>Balance</button>
      <button onClick={() => setAssetsModalOpen(true)}>Assets</button>
      <button onClick={() => setOrdersModalOpen(true)}>Trade history</button>
      {/* {assetsList.map(item => {
        return (
          <div>
            <p>{item.asset}</p>
            <p>free: {item.free}</p>
            <p>locked: {item.locked}</p>
            ----------------
          </div>
        );
      })} */}
      <OrdersInfoModal open={ordersModalOpen} setOpen={setOrdersModalOpen} />
      <AssetsModal open={assetsModalOpen} setOpen={setAssetsModalOpen} />
    </div>
  );
};

export default DashBoardPanel;
