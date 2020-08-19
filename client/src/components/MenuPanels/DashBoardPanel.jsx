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

  const tradePrice = order => {
    const orderId = order.orderId;
    const match = trades
      .map(item => item.filter(trade => trade.orderId == orderId))
      .filter(arr => arr.length > 0);
    if (match.length == 1) return <Table.Cell>{match[0][0].price}</Table.Cell>;
    else return <Table.Cell>-</Table.Cell>;
  };

  const tradeAmount = order => {
    const orderId = order.orderId;
    const match = trades
      .map(item => item.filter(trade => trade.orderId == orderId))
      .filter(arr => arr.length > 0);
    if (match.length == 1)
      return <Table.Cell>{match[0][0].quoteQty}</Table.Cell>;
    else return <Table.Cell>-</Table.Cell>;
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
        size="large"
        // trigger={<Button>Show Modal</Button>}
      >
        <Modal.Header>Orders</Modal.Header>
        <Modal.Content>
          <Table basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell rowSpan="2">Pair</Table.HeaderCell>
                <Table.HeaderCell rowSpan="2">Type</Table.HeaderCell>
                <Table.HeaderCell rowSpan="2">Side</Table.HeaderCell>
                <Table.HeaderCell rowSpan="2">Price</Table.HeaderCell>
                <Table.HeaderCell rowSpan="2">Amount</Table.HeaderCell>
                <Table.HeaderCell rowSpan="2">Filled</Table.HeaderCell>
                <Table.HeaderCell rowSpan="2">QuoteQTY</Table.HeaderCell>
                <Table.HeaderCell rowSpan="2">Status</Table.HeaderCell>
                <Table.HeaderCell colSpan="2">Trades</Table.HeaderCell>
                {/* <Table.HeaderCell>TradePrice</Table.HeaderCell>
                <Table.HeaderCell>TradeQuoteAmount</Table.HeaderCell> */}
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell>Price</Table.HeaderCell>
                <Table.HeaderCell>QuoteAmount</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {orders.map(order => {
                return order.map(item => {
                  return (
                    <Table.Row key={item.orderId}>
                      <Table.Cell>{item.symbol}</Table.Cell>
                      <Table.Cell>{item.type}</Table.Cell>
                      <Table.Cell>{item.side}</Table.Cell>
                      <Table.Cell>{item.price}</Table.Cell>
                      <Table.Cell>{item.origQty}</Table.Cell>
                      <Table.Cell>{item.executedQty}</Table.Cell>
                      <Table.Cell>{item.origQuoteOrderQty}</Table.Cell>
                      <Table.Cell>{item.status}</Table.Cell>
                      {tradePrice(item)}
                      {tradeAmount(item)}
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
