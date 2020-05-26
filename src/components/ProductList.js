import React from "react";

import Product from "./Product";

export class ProductList extends React.Component {
  constructor(props) {
    super(props);
  }

  handleAddProductVariation = (
    productId,
    variationAttributes,
    regularPrice,
    salePrice,
    quantity
  ) => {
    this.props.onAddedProductVariation(
      productId,
      variationAttributes,
      regularPrice,
      salePrice,
      quantity
    );
  };

  productToProductItem = (product) => {
    return (
      <Product
        key={product.id}
        product={product}
        onAddedProductVariation={this.handleAddProductVariation}
      />
    );
  };
  render() {
    return <>{this.props.products.map(this.productToProductItem)}</>;
  }
}
