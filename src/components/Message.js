import React, { Component } from "react";
import { Button, Modal } from "semantic-ui-react";

export default class Message extends Component {
  state = { open: this.props.open, dontShow: this.props.dontShow };
  modal_hader = {
    border: "none",
    fontWeight: 300,
    margin: 5,
  };

  closeConfigShow = (closeOnEscape, closeOnDimmerClick) => () => {
    this.setState({ closeOnEscape, closeOnDimmerClick, open: true });
  };

  close = () => this.setState({ open: false }, this.props.onCancel());

  clickYes = () => {
    const dontShowMessage = this.state.dontShow;

    this.setState({ open: false }, this.props.onSave(dontShowMessage));
  };

  handleChange = (e) => {
    this.setState({ dontShow: e.target.checked });
  };
  render() {
    const { open, closeOnEscape, closeOnDimmerClick } = this.state;

    return (
      <div>
        <Modal
          open={open}
          closeOnEscape={closeOnEscape}
          closeOnDimmerClick={closeOnDimmerClick}
          onClose={this.close}
        >
          <Modal.Header style={this.modal_hader}>
            You are changing root product for variable product. Do you want to
            continue?
            <div className="field" style={{ marginTop: 15 }}>
              <div className="ui checkbox">
                <input
                  name="dontShow"
                  checked={this.state.dontShow}
                  onChange={this.handleChange}
                  type="checkbox"
                />
                <label style={{ color: "black" }}>
                  Don't show me this message again. (For one month)
                </label>
              </div>
            </div>
          </Modal.Header>

          <Modal.Actions style={{ border: "none" }}>
            <Button onClick={this.close} negative>
              No
            </Button>
            <Button
              onClick={this.clickYes}
              positive
              labelPosition="right"
              icon="checkmark"
              content="Yes"
            />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}
