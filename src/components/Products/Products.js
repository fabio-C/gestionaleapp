import React, {Component} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import './Products.css';

class Products extends Component {

	constructor(props){
		super(props);
		this.state = {
      products: null //list of all products
		}
	}

  componentDidMount() {
    this.getAllProducts();
  }

	getAllProducts = () => {
    //Get order details
    this.props.db.collection("lists").doc("products").get().then(doc => {
      
      let products = doc.data().all;

      //Sort alphabetically
      products.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      });

      this.setState({
        products: products
      });
    });
  }

  /*
  
	createUpdateProductList = () => {

    const productNames = ["Centocchio", "Coriandolo", "Erba Cipollina", "Elicriso", "Finocchietto", "Timo limone", "Timo", "Santoreggia", "Melissa", "Menta Hierba Buena", "Prezzemolo light", "Origano", "Artemisia assenzio", "Basella Rubra", "Pimpinella", "Levistico",  "Acetosella", "Oyster leafes", "Insalata Baby", "Mizuna green", "Mizuna red", "Komatzuna", "Senape rossa", "Bietolina rossa e gialla", "Tatsoi", "Baby rucola", "Acetosa", "Mix Baby leafes", "Mix Baby Leafes + Aromatiche", "Crescione", "Ravanello Rosso"];

    let data = {
      all: productNames.map(function(name){
        return(
          {
            id: makeid(8),
            name: name,
            price: 0,
            sub: 0
          }
        )
      })
    }

    db.collection('lists').doc("products").set(data);
	  }
	  */


  	render(){

      let productsSummaryDOM = null;
      if (this.state.products) {
        productsSummaryDOM = this.state.products.map((product, index) => {
          return(
            <Col md={3} key={index}>
              <div className="productBox" onClick={null}>
                {product.name}
              </div>
            </Col>
          )
        })
      }

    	return (
	      	<Container className="Products">
            <Row>

              <Col md={12}> 
                <h3> Lista Completa Prodotti </h3>
              </Col>

              <Col md={3}> 
                <div className="productBox" id="addProductBox">Aggiungi prodotto </div>
              </Col>
              {productsSummaryDOM}

            </Row>
          </Container>
    	);
  	}

}

export default Products;