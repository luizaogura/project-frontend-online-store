import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getProductByQuery, getCategories, getProductByCategory } from '../services/api';

export default class Search extends Component {
  state = {
    inputSearch: '',
    products: [],
    categoryList: [],
    loading: false,
  };

  componentDidMount() {
    this.fetchCategories();
  }

  // Recebe o valor do input de search //
  handleChange = ({ name, value }) => {
    this.setState({
      [name]: value,
    });
  };

  // Button que tras os produtos por meio do input search //
  submitBtn = () => {
    const { inputSearch } = this.state;
    this.setState(
      {
        loading: true,
      },
      async () => {
        const productSearched = await getProductByQuery(inputSearch);
        this.setState({
          products: productSearched,
          loading: false,
          inputSearch: '',
        });
      },
    );
  };

  // Function que lista as categorias na barra lateral //
  fetchCategories = async () => {
    const listComplete = await getCategories();
    this.setState({ categoryList: listComplete });
  };

  // Function que tras os produtos de acordo com o click na categoria desejada //
  categoryCheck = async (event) => {
    const { target } = event;
    const { categoryList } = this.state;
    const { id } = target;
    const categoryID = categoryList.find((product) => product.id === id);
    console.log(categoryID);
    this.setState({ loading: true });
    const productsCategoriesList = await getProductByCategory(categoryID.id);
    this.setState({
      products: productsCategoriesList,
      loading: false,
    });
  };

  render() {
    const {
      inputSearch,
      loading,
      products,
      categoryList,
    } = this.state;
    const nullResult = products.length === 0;

    return (
      <div className="page-container">
        <div>
          <div>
            <p>Categorias</p>
            <div className="category-list-container">
              {categoryList.map((category) => (
                <div
                  key={ category.id }
                >
                  <input
                    data-testid="category"
                    type="checkbox"
                    id={ category.id }
                    onChange={ this.categoryCheck }
                  />
                  <label htmlFor="category-checkbox">
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="search-container">
          <div>
            <input
              type="text"
              data-testid="query-input"
              onChange={ ({ target }) => this.handleChange(target) }
              name="inputSearch"
              value={ inputSearch }
              placeholder="Search"
            />
            <button
              type="submit"
              data-testid="query-button"
              onClick={ this.submitBtn }
            >
              Pesquisar
            </button>
          </div>

          {loading && 'Carregando...'}

          <p data-testid="home-initial-message">
            Digite algum termo de pesquisa ou escolha uma categoria.
          </p>

          <Link data-testid="shopping-cart-button" to="/cart">
            Carrinho de compras
          </Link>

          <div>
            {nullResult ? (
              <p>Nenhum produto foi encontrado</p>
            ) : (
              products.map(({ id, thumbnail, price, title }) => (
                <div key={ id } data-testid="product">
                  <Link
                    to={ `/product-card/${id}` }
                    data-testid="product-detail-link"
                  >
                    <img src={ thumbnail } alt={ title } />
                    <p>{title}</p>
                    <p>{price}</p>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }
}
