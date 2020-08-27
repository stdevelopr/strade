import React, { useState, useEffect } from "react";
import { Modal } from "semantic-ui-react";
import { Dropdown, Input } from "semantic-ui-react";
import { Table } from "semantic-ui-react";

const OrdersInfoModal = ({ open, setOpen }) => {
  // const [modalOpen, setModalOpen] = useState(open);
  const [orders, setOrders] = useState([]);
  const [trades, setTrades] = useState([]);

  const tagOptions = [
    {
      key: "Important",
      text: "Important",
      value: "Important",
      label: { color: "red", empty: true, circular: true }
    },
    {
      key: "Announcement",
      text: "Announcement",
      value: "Announcement",
      label: { color: "blue", empty: true, circular: true }
    }
  ];

  // useEffect(() => {
  //   setModalOpen(open);
  // }, [open]);

  useEffect(() => {
    fetch("/api/binance/dashboard/trade_history")
      .then(res => res.json())
      .then(res => {
        setOrders(res["orders"]);
        setTrades(res["trades"]);
      });
  }, []);

  const atualize_trade_history = () => {
    fetch("/api/binance/dashboard/trade_history/atualize")
      .then(res => res.json())
      .then(res => {
        setOrders(res["orders"]);
        setTrades(res["trades"]);
      });
  };

  const tradeTime = order => {
    const orderId = order.orderId;
    const match = trades
      .map(item => item.filter(trade => trade.orderId == orderId))
      .filter(arr => arr.length > 0);
    if (match.length == 1) return <Table.Cell>{match[0][0].time}</Table.Cell>;
    else return <Table.Cell>-</Table.Cell>;
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
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="fullscreen"
      // trigger={<Button>Show Modal</Button>}
    >
      <Modal.Header>
        <div>Orders</div>
        <button onClick={() => atualize_trade_history()}>Atualize</button>
        <Dropdown
          text="Filter Status"
          icon="filter"
          floating
          labeled
          button
          className="icon"
        >
          <Dropdown.Menu>
            {/* <Input icon="search" iconPosition="left" className="search" /> */}
            {/* <Dropdown.Divider /> */}
            {/* <Dropdown.Header icon="tags" content="Tag Label" /> */}
            <Dropdown.Menu scrolling>
              {tagOptions.map(option => (
                <Dropdown.Item key={option.value} {...option} />
              ))}
            </Dropdown.Menu>
          </Dropdown.Menu>
        </Dropdown>
      </Modal.Header>
      <Modal.Content>
        <Table celled structured>
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
              <Table.HeaderCell rowSpan="2">Time</Table.HeaderCell>
              <Table.HeaderCell colSpan="3">Trades</Table.HeaderCell>
              {/* <Table.HeaderCell>TradePrice</Table.HeaderCell>
          <Table.HeaderCell>TradeQuoteAmount</Table.HeaderCell> */}
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell>Time</Table.HeaderCell>
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
                    <Table.Cell>{item.time}</Table.Cell>
                    {tradeTime(item)}
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
  );
};

export default OrdersInfoModal;
