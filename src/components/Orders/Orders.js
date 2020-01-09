import React, {Component} from 'react';

import OrdersSummary from './OrdersSummary/OrdersSummary';
import OrdersDetail from './OrdersDetail/OrdersDetail';

class Orders extends Component {

	constructor(props){
		super(props);
		this.state = {
		} 
	}
	
	componentDidMount() {
		this.viewOrderDetails();
	}

	viewOrderDetails = () => {

		console.log("viewOrderDetails");
		
	    //Get order details
	    this.props.db.collection("orders").doc("W8fLgzsTCblyZK7AG6oS").get().then(
	    	function(doc) {
		      console.log(doc.data());
			});
	}

	/*
	createEmptyOrder = () => {
    
    //TODO: GET THIS LIST FROM UPDATED LIST
    const restaurants = ['pagliaccio', 'pagliaccio2', 'pagliaccio3', 'pagliaccio4', 'pagliaccio5', 'pagliaccio6', 'pagliaccio7', 'pagliaccio8', 'pagliaccio9', 'pagliaccio10', 'pagliaccio11', 'pagliaccio12', 'pagliaccio13', 'pagliaccio14', 'pagliaccio15',  'pagliaccio16', 'pagliaccio17', 'pagliaccio18', 'pagliaccio20', 'pagliaccio20', 'pagliaccio21', 'pagliaccio22', 'pagliaccio23',  'pagliaccio24', 'pagliaccio25', 'pagliaccio26', 'pagliaccio27', 'pagliaccio28', 'pagliaccio29', 'pagliaccio30', 'pagliaccio31', 'pagliaccio32', 'pagliaccio33', 'pagliaccio34', 'pagliaccio35', 'pagliaccio36', 'pagliaccio37', 'pagliaccio38', 'pagliaccio39', 'pagliaccio40', 'pagliaccio41', 'pagliaccio42', 'pagliaccio43', 'pagliaccio44', 'pagliaccio45', 'pagliaccio46', 'pagliaccio47', 'pagliaccio48', 'pagliaccio49', 'pagliaccio50'];
    //TODO: GET THIS LIST FROM UPDATED LIST
    const products = ['mizuna', 'mizuna2', 'mizuna3', 'mizuna4', 'mizuna5', 'mizuna6', 'mizuna7', 'mizuna8', 'mizuna9', 'mizuna10', 'mizuna11', 'mizuna12', 'mizuna13', 'mizuna14', 'mizuna15',  'mizuna16', 'mizuna17', 'mizuna18', 'mizuna20', 'mizuna20', 'mizuna21', 'mizuna22', 'mizuna23',  'mizuna24', 'mizuna25', 'mizuna26', 'mizuna27', 'mizuna28', 'mizuna29', 'mizuna30'];
    
    let data = {
        date: new Date(),
        restaurantSummary: restaurants.map(function(r){
          return(
            {
              id: "xxxxx",
              name: r,
              total: 2
            }
          )
        }),
        productSummary: products.map(function(p){
          return(
            {
              id: "xxxxx",
              name: p,
              total: 2,
              price: 0.2,
              sub:0
            }
          )
        })
      }

	    db.collection('orders').doc().set(data); 
	}

	

	viewOrderDetailsSingleRestaurant = () => {
    //Get order details
    db.collection("orders").doc("W8fLgzsTCblyZK7AG6oS").collection("restaurants").doc("aasdfasdf").get().then(function(doc){
      console.log(doc.data());
	    });
	  }




	    createRestaurantDocument = () => {

    //TODO: GET THIS LIST FROM UPDATED LIST
    const products = ['mizuna', 'mizuna2', 'mizuna3', 'mizuna4', 'mizuna5', 'mizuna6', 'mizuna7', 'mizuna8', 'mizuna9', 'mizuna10', 'mizuna11', 'mizuna12', 'mizuna13', 'mizuna14', 'mizuna15',  'mizuna16', 'mizuna17', 'mizuna18', 'mizuna20', 'mizuna20', 'mizuna21', 'mizuna22', 'mizuna23',  'mizuna24', 'mizuna25', 'mizuna26', 'mizuna27', 'mizuna28', 'mizuna29', 'mizuna30'];
    
    let data = 
        {
          name: "Pagliaccio",
          products: products.map(function(productname){
            return (
              {
                id: "abcdbdbdf",
                name: productname,
                quantiy: 0,
                price: 0.3,
                sub: 0
              }
            )
          })
        }
    db.collection('orders').doc("W8fLgzsTCblyZK7AG6oS").collection("restaurants").doc("aasdfasdf").set(data);  
  }


	*/

  	render(){
    	return (
	      	<div className="Orders">
		        <OrdersSummary />
		        <OrdersDetail />
		    </div>
    	);
  	}
}

export default Orders;