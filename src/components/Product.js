import React from "react";
import VegevekService from "../vegevekService";
import ProductVariations from "./ProductVariations";
import Message from "./Message";
import Cookies from "js-cookie";
import AddProductVariation from "./AddProductVariation";

const DONT_SHOW_ROOT_PRODUCT_POPUP = "DontShowRootProductPopup";

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.shouldNotShowPopup = this.shouldNotShowPopup.bind(this);
    this.handleAddedProductVariation = this.handleAddedProductVariation.bind(
      this
    );

    this.state = {
      product: this.props.product,
      loading: false,
      showOnlyVariantsProduct: false,
      open: false,
      showVariations: false,
      mode: "none",
    };
  }
  content_header = {
    display: "flex",
    justifyContent: "space-around",
    marginTop: 15,
    marginBottom: 30,
    fontSize: "large",
    fontWeight: 500,
    flex: "2 0 0",
  };
  header = {
    placeSelf: "center",
    textAlign: "center",
    flex: 1,
    marginRight: 10,
  };
  p_prod_id = {
    display: "inline-block",
    float: "right",
    marginRight: 14,
  };
  btn_variations_lgth = {
    fontSize: "medium",
    backgroundColor: "white",
    color: "black",
    marginLeft: 10,
  };
  p_variations = {
    marginTop: 8,
    fontSize: "smaller",
    fontWeight: 100,
    marginLeft: 5,
  };
  btn_actions = {
    marginLeft: 7,
    height: 40,
    width: 70,
  };
  container_stockQty = {
    display: "flex",
    marginTop: 30,
    marginBottom: 20,
  };

  // handleAttributesTerm = (attributeId) => {
  //   VegevekService.getAttributeTerms(attributeId).then((attributeTerms) => {
  //     this.setState({ attributeTerms });
  //   });
  // };

  updateAndReloadProduct = (product) => {
    VegevekService.updateProduct(product).then((updatedProduct) => {
      VegevekService.getProductVariations(updatedProduct.id).then(
        (variations) => {
          updatedProduct.product_variations = variations;
          this.setState((prevState) => {
            return {
              product: updatedProduct,
              loading: false,
            };
          });
        }
      );
    });
  };

  handleAdd() {
    if (this.shouldNotShowPopup()) {
      this.setState({ loading: true }, () => {
        let copyProduct = { ...this.state.product };
        copyProduct.stock_quantity++;
        this.updateAndReloadProduct(copyProduct);
      });
    } else {
      this.setState({
        open: true,
        mode: "add",
      });
    }
  }

  handleRemove() {
    if (this.shouldNotShowPopup()) {
      this.setState({ loading: true }, () => {
        let copyProduct = { ...this.state.product };
        copyProduct.stock_quantity--;
        this.updateAndReloadProduct(copyProduct);
      });
    } else {
      this.setState({
        open: true,
        mode: "remove",
      });
    }
  }

  handleReset() {
    if (this.shouldNotShowPopup()) {
      this.setState({ loading: true }, () => {
        let copyProduct = { ...this.state.product };
        copyProduct.stock_quantity = 0;
        this.updateAndReloadProduct(copyProduct);
      });
    } else {
      this.setState({
        open: true,
        mode: "reset",
      });
    }
  }

  handleAddedProductVariation = (
    variationAttributes,
    regularPrice,
    salePrice,
    quantity
  ) => {
    this.props.onAddedProductVariation(
      this.state.product.id,
      variationAttributes,
      regularPrice,
      salePrice,
      quantity
    );
  };

  handleSave(dontShow) {
    this.setState(
      (prevState) => {
        let product = { ...prevState.product };
        switch (this.state.mode) {
          case "add":
            product.stock_quantity++;
            break;
          case "remove":
            product.stock_quantity--;
            break;
          case "reset":
            product.stock_quantity = 0;
            break;
          case "none":
            break;
        }

        return {
          product: product,
          loading: true,
          mode: "none",
          open: false,
        };
      },
      () => {
        Cookies.set(DONT_SHOW_ROOT_PRODUCT_POPUP, dontShow, { expires: 30 });
        this.props.onQuantityChange(this.state.product);
      }
    );
  }

  handleCancel() {
    this.setState({
      open: false,
      mode: "none",
    });
  }

  shouldNotShowPopup() {
    let dontShowPopup = Cookies.get(DONT_SHOW_ROOT_PRODUCT_POPUP) === "true";
    return dontShowPopup;
  }

  handleChangeShowVariations = (e) => {
    this.setState({
      showVariations: !this.state.showVariations,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.product !== this.props.product) {
      this.setState({
        product: this.props.product,
        loading: false,
      });
    }
  }

  render() {
    const { product } = this.state;
    return (
      <>
        <div className="ui card" style={{ marginTop: 30 }}>
          {this.state.open ? (
            <Message
              open={this.state.open}
              onSave={this.handleSave}
              onCancel={this.handleCancel}
              dontShow={this.shouldNotShowPopup()}
            />
          ) : null}
          <AddProductVariation
            attributes={product.attributes}
            product={product}
            onSave={this.handleAddedProductVariation}
          />
          {this.state.showOnlyVariantsProduct ? null : (
            <div className="content" style={{ padding: 0 }}>
              <div style={{ marginBottom: 35 }}>
                <p style={this.p_prod_id}>id: {product.id}</p>
              </div>
              <div className="extra content" style={this.content_header}>
                {/* {product.variations.length > 0 ? ( */}
                <button
                  className="ui primary button"
                  onClick={this.handleChangeShowVariations}
                  style={this.btn_variations_lgth}
                >
                  <i
                    aria-hidden="true"
                    className="angle double down icon"
                    style={{ marginRight: 10, fontSize: "larger" }}
                  ></i>
                  <div
                    className="ui mini black horizontal statistic"
                    style={{ margin: "auto" }}
                  >
                    <div className="value"> {product.variations.length}</div>

                    <p style={this.p_variations}>variations</p>
                  </div>
                </button>
                {/* ) : null} */}
                <div style={this.header}>{product.name}</div>
              </div>

              <div style={this.container_stockQty}>
                <div
                  className="ui tiny black horizontal statistic"
                  style={{ margin: "auto" }}
                >
                  <div className="value">{product.stock_quantity}</div>

                  <p style={{ marginTop: 10, fontSize: "smaller" }}>Qty</p>
                </div>
                <div>
                  <button
                    style={this.btn_actions}
                    className="large ui circular basic positive button"
                    onClick={this.handleAdd}
                    disabled={this.state.loading}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                  <button
                    style={this.btn_actions}
                    className="large ui circular basic red button"
                    onClick={this.handleRemove}
                    disabled={this.state.loading}
                  >
                    {this.state.loading} <i className="fas fa-minus"></i>
                  </button>
                  <button
                    style={this.btn_actions}
                    className="large ui circular black basic button"
                    onClick={this.handleReset}
                    disabled={this.state.loading}
                  >
                    0
                  </button>
                </div>
              </div>
            </div>
          )}
          <div
            id={this.state.showVariations ? "" : "card_variation"}
            style={{ marginTop: 30 }}
          >
            {product.product_variations ? (
              <ProductVariations
                variations={product.product_variations}
                name={product.name}
                productId={product.id}
                change={this.handleVariationChange}
                attributes={product.attributes}
                product={this.state.product}
              />
            ) : null}
          </div>
        </div>
      </>
    );
  }
}

export default Product;
