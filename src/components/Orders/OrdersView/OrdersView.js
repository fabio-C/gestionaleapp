import React from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';

import Auxiliary from '../../../hoc/Auxiliary/Auxiliary';

import './OrdersView.css';

const OrdersView = (props) => {

	let orderViewDOM = null;

	if (props.order) {

		//Depending on viewMode display a different UI and data
		//0: Vista Ristoranti
		//1: Vista Prodotti
		//2: Riepilogo Ristoranti
		//3: Riepilogo Prodotti
		if (props.viewMode === 0) { //Vista Ristoranti
			if (props.restaurants) {

				//Loop all restaurants
				orderViewDOM = props.restaurants.map((restaurant, index) => {

					let total = 0;

					//Loop all restaurants in order
					for (var i = 0; i < props.order.restaurants.length; i++) {
						if(props.order.restaurants[i].id === restaurant.id){
							//loop all products in order
							for (var j = 0; j < props.order.restaurants[i].products.length; j++) {
								total += props.order.restaurants[i].products[j].quantity;
							}
						}
					}

					let emptyBoxClass = 'restaurantBox';
					if (total === 0) {
						emptyBoxClass = 'restaurantBox empty';
					}

					return(
						<Col md={3} key={index}>
							<div className={emptyBoxClass} onClick={() => props.handleClickRestaurant(restaurant.id, restaurant.name)}>
								{restaurant.name}
								<span>{total}</span>
							</div>
						</Col>
					)
				});
			}
		} else if (props.viewMode === 1) { //Vista Prodotti
			if (props.products) {
				orderViewDOM = props.products.map((product, index) => {

					let total = 0;

					//loop all restaurants in order
					for (var i = 0; i < props.order.restaurants.length; i++) {
						//loop all products in order
						for (var j = 0; j < props.order.restaurants[i].products.length; j++) {
							if (props.order.restaurants[i].products[j].id === product.id) {
								total += props.order.restaurants[i].products[j].quantity;
							}
						}
					}

					let emptyBoxClass = 'restaurantBox';
					if (total === 0) {
						emptyBoxClass = 'restaurantBox empty';
					}

					return(
						<Col md={3} key={index}>
							<div className={emptyBoxClass}>
								{product.name}
								<span>{total}</span>
							</div>
						</Col>
					)
				});
			}
		} else if (props.viewMode === 2) { //Riepilogo Ristoranti

			//Loop all restaurant in order
			orderViewDOM = props.order.restaurants.map((restaurant, index) => {

				//Get the name
				const restaurantName = props.getRestaurantInfoFromId(restaurant.id).name;

				let productsList = [];

				let restaurantsTotal = 0;

				for (var i = 0; i < restaurant.products.length; i++) {

					restaurantsTotal += restaurant.products[i].quantity;

					productsList.push(
						<p key={i + "_2"} name={props.getProductInfoFromId(restaurant.products[i].id).name}>
							{props.getProductInfoFromId(restaurant.products[i].id).name}
							<span>{restaurant.products[i].quantity}</span>
						</p>
					)
				}
				
				//Sort product in list alphabetically
			    productsList.sort(function(a, b){
			    	if(a.props.name < b.props.name) { return -1; }
			        if(a.props.name > b.props.name) { return 1; }
			    	return 0;
			    });

				return(
					<Col md={12} key={index} name={restaurantName}>
						<div className="resumeName">{restaurantName}</div>
						<div className="resumeList">{productsList}</div>
						<div className="resumeTotal"><span>Totale {restaurantsTotal}</span> </div>
					</Col>
				)
			});

			//Sort the resume by restaurant name
			orderViewDOM.sort(function(a, b){
			  	if(a.props.name < b.props.name) { return -1; }
			    if(a.props.name > b.props.name) { return 1; }
			  	return 0;
			});

		} else if (props.viewMode === 3) { //Riepilogo Prodotti

			orderViewDOM = [];

			//Loop all products in order
			props.products.forEach((product, index) => {

				let restaurantList = [];
				let productsTotal = 0;
				let productFound = false;

				for (var i = 0; i < props.order.restaurants.length; i++) {

					for (var j = 0; j < props.order.restaurants[i].products.length; j++) {
						if (props.order.restaurants[i].products[j].id === product.id) {

							productFound = true;

							productsTotal += props.order.restaurants[i].products[j].quantity;

							restaurantList.push(
								<p key={i.toString() + j.toString()} name={props.getRestaurantInfoFromId(props.order.restaurants[i].id).name}>
									{props.getRestaurantInfoFromId(props.order.restaurants[i].id).name}
									<span>{props.order.restaurants[i].products[j].quantity}</span>
								</p>
							)
						}
					}
				}

				//Sort restaurant in list alphabetically
			    restaurantList.sort(function(a, b){
			    	if(a.props.name < b.props.name) { return -1; }
			        if(a.props.name > b.props.name) { return 1; }
			    	return 0;
			    });

				if (productFound) {
					orderViewDOM.push(
						<Col md={12} key={index} name={product.name}>
							<div className="resumeName">{product.name}</div>
							<div className="resumeList">{restaurantList}</div>
							<div className="resumeTotal"><span>Totale {productsTotal}</span></div>
						</Col>
					)	
				}
			});

			//Sort the resume by products name
			orderViewDOM.sort(function(a, b){
			  	if(a.props.name < b.props.name) { return -1; }
			    if(a.props.name > b.props.name) { return 1; }
			  	return 0;
			});

		}
	}

	//buttons classes
	let button_r_classes = null;
	let button_p_classes = null;
	let button_s_classes = null;
	let button_h_classes = null;
	if (props.viewMode === 0) {
		button_r_classes = "focus";
		button_p_classes = "";
		button_s_classes = "";
		button_h_classes = "";
	} else if (props.viewMode === 1) {
		button_r_classes = "";
		button_p_classes = "focus";
		button_s_classes = "";
		button_h_classes = "";
	} else if (props.viewMode === 2) {
		button_r_classes = "";
		button_p_classes = "";
		button_s_classes = "focus";
		button_h_classes = "";
	} else if (props.viewMode === 3) {
		button_r_classes = "";
		button_p_classes = "";
		button_s_classes = "";
		button_h_classes = "focus";
	}

	return (
		<Container className="OrdersView">
		  <Row>

		  	{(props.order)?
		  		
		  		<Auxiliary>
			  		
			  		<Col md={12} id="toggleButtons">
						<button className={button_r_classes} onClick={() => props.setViewMode(0)} > Vista Ristoranti <span role="img" aria-label="restaurant">🍝</span> </button>
						<button className={button_p_classes} onClick={() => props.setViewMode(1)} > Vista Prodotti <span role="img" aria-label="leaf">🌿</span> </button>
						<button className={button_s_classes} onClick={() => props.setViewMode(2)} > Riepilogo Ristoranti <span role="img" aria-label="leaf">📋</span> </button>
						<button className={button_h_classes} onClick={() => props.setViewMode(3)} > Riepilogo Prodotti <span role="img" aria-label="leaf">📋</span> </button>
					</Col>

			  		{orderViewDOM}

			  		{(props.viewMode === 0)?
			  			<Col md={12} className="lastButtons">
							<Button variant="danger" onClick={props.handleClickDelete}> Elimina Ordine </Button>
						</Col>
						: null
			  		}
			  		
				</Auxiliary>
				: 
				<Col>
					<Button variant="primary" onClick={props.handleClickNewOrder}>Crea nuovo ordine</Button>
				</Col>
		  	}
		  	
		  </Row>
		</Container>
	);
}

export default OrdersView;
