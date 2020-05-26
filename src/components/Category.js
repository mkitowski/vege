import React from "react";

class Category extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      categories: this.props.categories,
      chosenCategoryId: "",
    };
  }
  handleChange(event) {
    this.setState(
      {
        chosenCategoryId: event.target.value,
        isLoading: true,
      },
      () => {
        this.props.onCategoryChange(this.state.chosenCategoryId);
      }
    );
  }

  mapCategory = (category) => {
    return (
      <option key={category.id} value={category.id}>
        {category.name}
      </option>
    );
  };
  render() {
    return (
      <>
        <form className="ui form" style={{ margin: 35 }}>
          <h3 style={{ textAlign: "center" }}>Choose category</h3>
          <select
            placeholder={"Select category"}
            value={this.state.chosenCategoryId}
            onChange={this.handleChange}
          >
            <option value="" defaultValue="Select your option" disabled>
              Select your option
            </option>

            {this.state.categories.map(this.mapCategory)}
          </select>
        </form>
      </>
    );
  }
}
export default Category;
