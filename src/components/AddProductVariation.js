import React, { Component } from "react";
import VegevekService from "../vegevekService";
import { Button, Header, Modal, Dropdown } from "semantic-ui-react";

export default class AddProductVariation extends Component {
  state = {
    modalOpen: false,
    selectedVariations: [],
    regularPrice: "",
    salePrice: "",
    quantity: 0,
    currentCurrency: "",
    attributeTerms: [],
    loadData: false,
    attributesWithTerms: [],
  };

  handleOpen = () => {
    this.setState({ modalOpen: true });
    this.handleCurrencyFetch();
    this.loadData();
  };

  handleClose = () => {
    this.setState({ modalOpen: false });
  };

  handleSave = () => {
    let variations = this.state.selectedVariations.map((v) => {
      return { id: v.attrid, option: v.value };
    });

    this.props.onSave(
      variations,
      this.state.regularPrice,
      this.state.salePrice,
      this.state.quantity
    );
    this.setState({ modalOpen: false });
  };

  handleChange = (e, key) => {
    const attributeId = key.options[0].attrid;
    const selectedValue = key.value;
    let elementIndex = this.state.selectedVariations.findIndex(
      (v) => v.attrid === attributeId
    );
    if (elementIndex !== -1) {
      this.setState((prev) => {
        const variations = [...prev.selectedVariations];
        variations[elementIndex].value = selectedValue;
        return { selectedVariations: variations };
      });
    } else {
      this.setState((prev) => ({
        selectedVariations: [
          ...prev.selectedVariations,
          { attrid: attributeId, value: selectedValue },
        ],
      }));
    }
  };

  handleQuantityChange = (e) => {
    const stock_quantity = e.target.value ? parseInt(e.target.value) : 0;
    this.setState({ quantity: stock_quantity });
  };

  handleRegularPriceChange = (e) => {
    this.setState({ regularPrice: e.target.value });
  };
  handleSalePriceChange = (e) => {
    this.setState({ salePrice: e.target.value });
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

  handleCurrencyFetch = () => {
    VegevekService.getCurrentCurrency().then((currentCurrency) => {
      this.setState({ currentCurrency });
    });
  };

  mapToDropdown = (attributeWithTerms) => {
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
    } else return [];
  };

  handleSearchChange = (e, b) => {
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
    return (
      <Dropdown
        onChange={this.handleChange}
        key={attr.id}
        fluid
        search
        selection
        options={this.mapToDropdown(currentAttribute)}
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
          <Button style={{ fontSize: 15 }} onClick={this.handleOpen}>
            Add variation
          </Button>
        }
        open={modalOpen}
        onClose={this.handleClose}
      >
        <Header
          icon="browser"
          content={`Add variation ${this.props.product.name.toUpperCase()}`}
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
                      placeholder="Enter amount..."
                      min="0"
                      max="100"
                      value={this.state.quantity}
                      onChange={this.handleQuantityChange}
                      step="1"
                      pattern="\d+"
                    />
                    <div className="ui basic label label">Stock Quantity</div>
                  </div>
                  <div className="ui right labeled input" style={{ margin: 5 }}>
                    <input
                      type="number"
                      placeholder="Enter regular price"
                      min="0"
                      max="100"
                      value={this.state.regularPrice}
                      onChange={this.handleRegularPriceChange}
                    />
                    <div className="ui basic label">
                      Regular Price (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: this.state.currentCurrency.symbol,
                        }}
                      ></span>
                      )
                    </div>
                  </div>
                  <div className="ui right labeled input" style={{ margin: 5 }}>
                    <input
                      type="number"
                      placeholder="Enter sale price"
                      min="0"
                      max="100"
                      value={this.state.salePrice}
                      onChange={this.handleSalePriceChange}
                    />
                    <div className="ui basic label">
                      Sale Price (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: this.state.currentCurrency.symbol,
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
