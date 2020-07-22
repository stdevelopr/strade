import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Modal from "./Modal.jsx";
const modal = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};
const IndicatorsList = ({ client }) => {
  const [openModal, setOpenModal] = React.useState(false);
  const [checked, setChecked] = React.useState([]);

  const indicatorsList = [
    "BBANDS",
    "DEMA",
    "EMA",
    "HT_TRENDLINE",
    "KAMA",
    "MA",
    "MAMA"
  ];
  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    client.writeData({
      data: { INDICATORS: newChecked }
    });
  };
  return (
    <div>
      <button onClick={toggleModal}>Indicadores</button>
      <Modal open={openModal} handleClose={() => setOpenModal(false)}>
        <div
          style={{
            backgroundColor: "white",
            padding: "50px",
            border: "solid 2px black"
          }}
        >
          <List style={{ width: "300px" }}>
            {indicatorsList.map(value => {
              const labelId = `checkbox-list-label-${value}`;

              return (
                <ListItem
                  key={value}
                  role={undefined}
                  dense
                  button
                  onClick={handleToggle(value)}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={value} />
                </ListItem>
              );
            })}
          </List>
        </div>
      </Modal>
    </div>
  );
};

export default IndicatorsList;
