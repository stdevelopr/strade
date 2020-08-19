import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Header, Image, Modal } from "semantic-ui-react";
import { Table } from "semantic-ui-react";

const DashBoardPanel = () => {
  const [balance, setBalance] = useState("");
  const [assetsList, setAssetsList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [trades, setTrades] = useState([]);
  //   const dispatch = useDispatch();
  //   const timeframe = useSelector(
  //     state => state.symbols.timeframes.contextTimeFrame
  //   );
  const symbol = useSelector(state => state.symbols.contextSymbol);

  //   const pairsInfo = useSelector(state => state.huntPairs.all);

  //   useEffect(() => {
  //     dispatch(huntMACD());
  //   }, []);

  // console.log("orders", orders);
  // console.log("trades", trades);
  const get_balance = () => {
    fetch("/api/binance/dashboard/balance")
      .then(res => res.text())
      .then(r => setBalance(r));
  };

  const get_assets = () => {
    fetch("/api/binance/dashboard/assets")
      .then(res => res.json())
      .then(r => setAssetsList(r));
  };

  const get_trade_history = () => {
    setModalOpen(true);
    fetch("/api/binance/dashboard/trade_history/" + symbol)
      .then(res => res.json())
      .then(res => {
        setOrders(res["orders"]);
        setTrades(res["trades"]);
      });
  };

  const handleClose = () => {
    setModalOpen(false);
  };
  return (
    <div>
      <h3>Dashboard</h3>
      <h2>Balance</h2>
      <p>{balance}</p>
      <button onClick={() => get_balance()}>Balance</button>
      <button onClick={() => get_assets()}>Assets</button>
      <button onClick={() => get_trade_history()}>Trade history</button>
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
      <Modal
        onClose={() => setModalOpen(false)}
        onOpen={() => setModalOpen(true)}
        open={modalOpen}
        // trigger={<Button>Show Modal</Button>}
      >
        <Modal.Header>Trades History</Modal.Header>
        <Modal.Content>
          <Table basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Symbol</Table.HeaderCell>
                <Table.HeaderCell>QTY</Table.HeaderCell>
                <Table.HeaderCell>Price</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {trades.map(trade => {
                return trade.map(item => {
                  return (
                    <Table.Row>
                      <Table.Cell>{item.symbol}</Table.Cell>
                      <Table.Cell>{item.qty}</Table.Cell>
                      <Table.Cell>{item.price}</Table.Cell>
                    </Table.Row>
                  );
                });
              })}
            </Table.Body>
          </Table>
        </Modal.Content>
      </Modal>
    </div>
  );
};

export default DashBoardPanel;
