import React from "react";
import VegevekService from "../vegevekService";
import Category from "./Category";
import { ProductList } from "./ProductList";
import ModalConfig from "./ModalConfig";
import { Button } from "semantic-ui-react";
import Cookies from "js-cookie";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.fetchCategories = this.fetchCategories.bind(this);
    this.handleDataFetch = this.handleDataFetch.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.reloadData = this.reloadData.bind(this);
    this.handleAddedProductVariation = this.handleAddedProductVariation.bind(
      this
    );
    this.state = {
      products: [],
      productsLoaded: false,
      categoriesLoaded: false,
      categories: [],
      selectedCategoryId: null,
      configSets: false,
      showVariantProducts: false,
    };
  }

  div_container = {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 10,
  };
  button = {
    margin: 30,
  };
  inline_loader = {
    marginTop: 100,
  };
  header = {
    margin: 50,
  };

  fetchCategories() {
    VegevekService.getCategory().then((categories) => {
      this.setState({ categories, categoriesLoaded: true });
    });
  }
  handleDataFetch(categoryId) {
    VegevekService.getProducts(categoryId, 10).then((products) => {
      this.setState({ products, productsLoaded: true });

      for (let product of products) {
        VegevekService.getProductVariations(product.id).then((variations) => {
          product.product_variations = variations;
          this.setState({ products, productsLoaded: true });
        });
      }
    });
  }

  handleCategoryChange(categoryId) {
    this.setState({ selectedCategoryId: categoryId }, () =>
      this.handleDataFetch(this.state.selectedCategoryId)
    );
  }

  handleAddedProductVariation(
    productId,
    variationAttributes,
    regularPrice,
    salePrice,
    quantity
  ) {
    const product = this.state.products.find((p) => p.id === productId);
    let productModified = false;

    if (product.type !== "variable") {
      product.type = "variable";
      productModified = true;
    }

    for (let varAttr of variationAttributes) {
      let attribute = product.attributes.find((a) => a.id === varAttr.id);
      if (attribute === undefined) {
        product.attributes.push({
          id: varAttr.id,
          options: [varAttr.option],
          variation: true,
        });
        productModified = true;
      } else {
        if (!attribute.variation) {
          attribute.variation = true;
          productModified = true;
        }

        let selectedOption = attribute.options.find(
          (o) => o === varAttr.option
        );
        if (selectedOption === undefined) {
          attribute.options.push(varAttr.option);
          productModified = true;
        }
      }
    }

    if (productModified) {
      VegevekService.updateProductAttributes({
        id: product.id,
        attributes: product.attributes,
        type: product.type,
      }).then((product) => {
        VegevekService.createProductVariation(
          productId,
          variationAttributes,
          regularPrice,
          salePrice,
          quantity
        )
          .then((variation) => {})
          .then((response) => {
            this.handleDataFetch(this.state.selectedCategoryId);
          });
      });
    } else {
      VegevekService.createProductVariation(
        productId,
        variationAttributes,
        regularPrice,
        salePrice,
        quantity
      )
        .then((variation) => {})
        .then((response) => {
          this.handleDataFetch(this.state.selectedCategoryId);
        });
    }
  }

  reloadData() {
    const key = Cookies.get("key");
    const secret = Cookies.get("secret");
    const url = Cookies.get("url");

    if (key && secret && url) {
      VegevekService.InitApi(key, secret, url);
      this.fetchCategories();
      this.setState({ configSets: true });
    }
  }

  handleModalClose() {
    this.reloadData();
  }

  componentDidMount() {
    this.reloadData();
  }

  render() {
    return (
      <>
        <div style={this.div_container}>
          <ModalConfig
            trigger={
              <Button onClick={this.handleOpen} style={this.button}>
                <i className="fas fa-cog"></i>
              </Button>
            }
            open={this.state.modalOpen}
            onClose={this.handleModalClose}
            basic
            size="small"
          />
        </div>
        {this.state.categoriesLoaded ? (
          <Category
            categories={this.state.categories}
            onCategoryChange={this.handleCategoryChange}
          />
        ) : (
          <div
            className="ui active centered inline loader"
            style={this.inline_loader}
          ></div>
        )}
        {this.state.configSets ? null : (
          <h2 className="ui center aligned header" style={this.header}>
            Please config app
          </h2>
        )}
        <div className="ui doubling stackable one cards">
          {this.state.productsLoaded ? (
            <ProductList
              products={this.state.products}
              onAddedProductVariation={this.handleAddedProductVariation}
            />
          ) : null}
        </div>
      </>
    );
  }
}

export default App;
