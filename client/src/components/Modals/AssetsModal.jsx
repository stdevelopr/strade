import React, { useState, useEffect } from "react";
import { Modal } from "semantic-ui-react";
import { Dropdown, Input } from "semantic-ui-react";
import { Table } from "semantic-ui-react";

const AssetsModal = ({ open, setOpen }) => {
  const [assetsList, setAssetsList] = useState([]);
  const [trades, setTrades] = useState([]);
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

  useEffect(() => {
    fetch("/api/binance/dashboard/trade_history")
      .then(res => res.json())
      .then(res => {
        setTrades(res["trades"]);
      });
  }, []);

  const sum_btc = (acumulator, item) => {
    let sum = 0;
    item.map(trade => {
      sum = sum + parseFloat(trade.quoteQty);
    });

    return acumulator + sum;
  };

  const getBTCValue = asset => {
    const traded = trades
      .map(trade =>
        trade.filter(item => item.symbol == asset + "BTC" && item.isBuyer)
      )
      .filter(arr => arr.length > 0)
      .reduce(sum_btc, 0);

    return traded;
  };

  // console.log("trades", trades);
  // console.log("assets", assetsList);
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
        <Table celled structured>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell rowSpan="2">Coin</Table.HeaderCell>
              <Table.HeaderCell rowSpan="2">Available</Table.HeaderCell>
              <Table.HeaderCell rowSpan="2">Locked</Table.HeaderCell>
              <Table.HeaderCell rowSpan="2">BTC</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {assetsList.map(item => {
              return (
                <Table.Row key={item.asset}>
                  <Table.Cell>{item.asset}</Table.Cell>
                  <Table.Cell>{item.free}</Table.Cell>
                  <Table.Cell>{item.locked}</Table.Cell>
                  <Table.Cell>
                    {item.asset == "BTC"
                      ? parseFloat(item.free) + parseFloat(item.locked)
                      : getBTCValue(item.asset)}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </Modal.Content>
    </Modal>
  );
};

export default AssetsModal;
