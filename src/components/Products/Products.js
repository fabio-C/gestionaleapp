import React, {Component} from 'react';

class Products extends Component {

	constructor(props){
		super(props);
		this.state = {
		}
	}

  componentDidMount() {}

	/*

	getAllProducts = () => {
    //Get order details
    db.collection("lists").doc("products").get().then(function(doc) {
      console.log(doc.data());
    });
  }


  
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
    	return (
	      	<div className="Products">
		        <p> Prodotti </p>
		    </div>
    	);
  	}

}

export default Products;