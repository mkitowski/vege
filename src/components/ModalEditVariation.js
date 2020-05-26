import React, { Component } from "react";
import VegevekService from "../vegevekService";
import { Button, Modal, Dropdown, Header } from "semantic-ui-react";

class ModalEditVariation extends Component {
  state = {
    modalOpen: false,
    attributes: this.props.attributes,
    variation: this.props.variation,
    attributeTerms: [],
    loadData: false,
    attributesWithTerms: [],
  };

  handleOpen = () => {
    this.setState({ modalOpen: true });
    this.loadData();
  };

  handleClose = () => {
    this.setState({ modalOpen: false });
  };

  handleSave = () => {
    this.props.change(this.state.variation);
    this.setState({ modalOpen: false });
  };

  handleChange = (e, key) => {
    const attributeId = key.options[0].attrid;
    const selectedValue = key.value;
    let elementIndex = this.state.variation.attributes.findIndex(
      (v) => v.id === attributeId
    );
    if (elementIndex !== -1) {
      this.setState((prev) => {
        const variation = prev.variation;
        variation.attributes[elementIndex].option = selectedValue;
        return { variation: variation };
      });
    } else {
      this.setState((prev) => {
        const variation = prev.variation;
        variation.attributes.push({ id: attributeId, option: selectedValue });
        return { variation: variation };
      });
    }
  };

  handleQuantityChange = (e) => {
    const stock_quantity = e.target.value ? parseInt(e.target.value) : "";
    this.setState((prev) => {
      const variation = prev.variation;
      variation.stock_quantity = stock_quantity;
      return { variation: variation };
    });
  };

  handleRegularPriceChange = (e) => {
    const regular_price = e.target.value;
    this.setState((prev) => {
      const variation = prev.variation;
      variation.regular_price = regular_price;
      return { variation: variation };
    });
  };

  handleSalePriceChange = (e) => {
    const sale_price = e.target.value;
    this.setState((prev) => {
      const variation = prev.variation;
      variation.sale_price = sale_price;
      return { variation: variation };
    });
  };

  loadData = () => {
    this.setState(
      {
        loadData: true,
      },
      () => {
        VegevekService.getProductAttributes().then((productAttributes) => {
          this.setState({
            attributesWithTerms: productAttributes,
            loadData: false,
          });
        });
      }
    );
  };

  mapToDropdown = (attributeWithTerms, selectedOption) => {
    if (attributeWithTerms.terms) {
      return attributeWithTerms.terms.map((attrOption, index) => {
        const obj = {
          attrid: attributeWithTerms.id,
          key: attrOption.name,
          text: attrOption.name,
          value: attrOption.name,
        };
        return obj;
      });
    } else {
      if (selectedOption) {
        return new Array({
          attrid: selectedOption.id,
          key: selectedOption.option,
          text: selectedOption.option,
          value: selectedOption.option,
        });
      } else {
        return [];
      }
    }
  };

  handleSearchChange = (e, b) => {
    // console.log("etarget", e.target.value);
    // console.log("b", b);
    var attributeId = b.attrid;
    var searchValue = e.target.value;

    VegevekService.getAttributeTerms(attributeId, searchValue).then(
      (attributeTerms) => {
        const attrTerms = this.state.attributesWithTerms;
        const currentAttribute = attrTerms.find((a) => a.id === attributeId);
        currentAttribute.terms = attributeTerms;
        this.setState({
          attributesWithTerms: attrTerms,
        });
      }
    );
  };

  mapAttribute = (attr) => {
    const currentAttribute = this.state.attributesWithTerms.find(
      (a) => a.id === attr.id
    );

    const variationAttribute = this.state.variation.attributes.find(
      (a) => a.id === attr.id
    );
    let selectedOption = {
      id: variationAttribute.id,
      option: variationAttribute.option,
    };

    return (
      <Dropdown
        value={variationAttribute ? variationAttribute.option : null}
        onChange={this.handleChange}
        key={attr.id}
        fluid
        search
        selection
        options={this.mapToDropdown(currentAttribute, selectedOption)}
        attrid={attr.id}
        onSearchChange={this.handleSearchChange}
        placeholder={attr.name}
        style={{ margin: 5 }}
      />
    );
  };

  render() {
    const { attributesWithTerms, modalOpen } = this.state;

    return (
      <Modal
        trigger={
          <Button
            style={{ fontSize: 15, backgroundColor: "lightsteelblue" }}
            onClick={this.handleOpen}
          >
            Edit
          </Button>
        }
        open={modalOpen}
        onClose={this.handleClose}
      >
        <Header
          icon="browser"
          content={`EDIT ${this.props.name.toUpperCase()} ID: ${
            this.state.variation.id
          } `}
          style={{ margin: 5 }}
        />
        <Modal.Content
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {this.state.loadData ? (
            <div className="ui active transition visible inverted dimmer">
              <div className="content">
                <div className="ui inverted text loader">Loading</div>
              </div>
            </div>
          ) : (
            <>
              {attributesWithTerms.length > 0 ? (
                <>
                  {attributesWithTerms.map(this.mapAttribute)}

                  <div className="ui right labeled input" style={{ margin: 5 }}>
                    <input
                      type="number"
                      placeholder="Edit amount..."
                      min="0"
                      max="100"
                      value={this.state.variation.stock_quantity}
                      onChange={this.handleQuantityChange}
                      step="1"
                      pattern="\d+"
                    />
                    <div className="ui basic label label">Stock Quantity</div>
                  </div>
                  <div className="ui right labeled input" style={{ margin: 5 }}>
                    <input
                      type="number"
                      placeholder="Edit regular price"
                      min="0"
                      max="100"
                      value={this.state.variation.regular_price}
                      onChange={this.handleRegularPriceChange}
                    />
                    <div className="ui basic label">
                      Regular Price(
                      <span
                        dangerouslySetInnerHTML={{
                          __html: this.props.currentCurrency.symbol,
                        }}
                      ></span>
                      )
                    </div>
                  </div>
                  <div className="ui right labeled input" style={{ margin: 5 }}>
                    <input
                      type="number"
                      placeholder="Edit sale price"
                      min="0"
                      max="100"
                      value={this.state.variation.sale_price}
                      onChange={this.handleSalePriceChange}
                    />
                    <div className="ui basic label">
                      Sale Price(
                      <span
                        dangerouslySetInnerHTML={{
                          __html: this.props.currentCurrency.symbol,
                        }}
                      ></span>
                      )
                    </div>
                  </div>
                </>
              ) : (
                <h4>No attributes</h4>
              )}
            </>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={this.handleClose}>
            Leave
          </Button>
          <Button color="green" onClick={this.handleSave} inverted>
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default ModalEditVariation;
