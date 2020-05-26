import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

class VegevekService {
  static api = null;

  static InitApi(key, secret, url) {
    VegevekService.api = new WooCommerceRestApi({
      url: url, //"https://vegevek.pl",
      consumerKey: `${key}`,
      consumerSecret: `${secret}`,
      version: "wc/v3",
      queryStringAuth: true,
    });
  }

  static async getCategory() {
    return VegevekService.api
      .get("products/categories")
      .then((response) => {
        // console.log(response.data);
        const categories = response.data;
        return categories;
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }
  static async getProducts(productCategory, pageSize) {
    return VegevekService.api
      .get("products", {
        per_page: pageSize, // 100 products per page
        category: productCategory, // Lokalizacje/Scalac
      })
      .then((response) => {
        // console.log("getProducts: sukces");
        const products = response.data;
        return products;
      })
      .catch((error) => {
        // Invalid request, for 4xx and 5xx statuses
        // console.log("get products: błąd", error);
      });
  }

  static async getProductById(productId) {
    return VegevekService.api
      .get("products/" + productId)
      .then((response) => {
        // console.log("getProductById: sukces");
        const product = response.data;
        return product;
      })
      .catch((error) => {
        // Invalid request, for 4xx and 5xx statuses
        // console.log("getProductById: błąd", error);
      });
  }

  static async getProductVariations(productId) {
    return VegevekService.api
      .get(`products/${productId}/variations`)
      .then((response) => {
        // console.log("getProductVariations: sukces", response.data);
        const product = response.data;
        return product;
      })
      .catch((error) => {
        // Invalid request, for 4xx and 5xx statuses
        // console.log("getProductVariations: błąd", error);
      });
  }

  static async createProductVariation(
    productId,
    variationAttributes,
    regularPrice,
    salePrice,
    quantity
  ) {
    return VegevekService.api
      .post(`products/${productId}/variations`, {
        attributes: variationAttributes,
        regular_price: regularPrice,
        sale_price: salePrice,
        stock_quantity: quantity,
        manage_stock: true,
      })
      .then((response) => {
        console.log("createProductVariation: sukces", response.data);
        const variation = response.data;
        return variation;
      })
      .catch((error) => {
        // Invalid request, for 4xx and 5xx statuses
        console.log("createProductVariation: błąd", error);
      });
  }
  static async updateProduct(product) {
    return VegevekService.api
      .put("products/" + product.id, {
        stock_quantity: product.stock_quantity,
      })
      .then((response) => {
        const product = response.data;
        return product;
      })
      .catch((error) => {
        // Invalid request, for 4xx and 5xx statuses
        // console.log("updateProduct: bład", error);
      });
  }

  static async updateProductAttributes(product) {
    return VegevekService.api
      .put("products/" + product.id, {
        attributes: product.attributes,
        type: product.type,
      })
      .then((response) => {
        const product = response.data;
        return product;
      })
      .catch((error) => {
        // Invalid request, for 4xx and 5xx statuses
        // console.log("updateProduct: bład", error);
      });
  }

  static async updateProductVariation(productId, variation) {
    console.log(
      "updateProductVariation, productId, variation",
      productId,
      variation
    );
    return VegevekService.api
      .put("products/" + productId + "/variations/" + variation.id, {
        attributes: variation.attributes,
        regular_price: variation.regular_price,
        sale_price: variation.sale_price,
        stock_quantity: variation.stock_quantity,
      })
      .then((response) => {
        console.log("updateProductVariation: sukces", response.data);
        const variation = response.data;
        return variation;
      })
      .catch((error) => {
        // Invalid request, for 4xx and 5xx statuses
        console.log("updateProductVariations: bład", error);
      });
  }

  static async getProductAttributes() {
    return VegevekService.api
      .get("products/attributes")
      .then((response) => {
        // console.log("getProductAttributes: sukces", response.data);
        const productAttributes = response.data;
        return productAttributes;
      })
      .catch((error) => {
        console.log("getProductAttributes", error);
      });
  }
  static async getAttributeTerms(attributeId, searchValue) {
    return VegevekService.api
      .get(`products/attributes/${attributeId}/terms`, {
        per_page: 100,
        search: searchValue,
      })
      .then((response) => {
        // console.log("getAttributeTerms: sukces", response.data);
        const attributeTerms = response.data;
        return attributeTerms;
      })
      .catch((error) => {
        console.log("getAttributeTerms", error);
      });
  }
  static async getCurrentCurrency() {
    return VegevekService.api
      .get("data/currencies/current")
      .then((response) => {
        // console.log("getCurrentCurrency: sukces", response.data);
        const currentCurrency = response.data;
        return currentCurrency;
      })
      .catch((error) => {
        // console.log("getCurrentCurrency", error);
      });
  }
}

export default VegevekService;
