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
		//2: Riepilogo
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
		} else if (props.viewMode === 2) { //Riepilogo

			//Loop all restaurant in order
			orderViewDOM = props.order.restaurants.map((restaurant, index) => {

				//Get the name
				const restaurantName = props.getRestaurantInfoFromId(restaurant.id).name;

				let productsList = [];

				for (var i = 0; i < restaurant.products.length; i++) {
					productsList.push(
						<p key={i + "_2"}>
							{props.getProductInfoFromId(restaurant.products[i].id).name}
							<span>{restaurant.products[i].quantity}</span>
						</p>
					)
				}

				return(
					<Col md={12} key={index}>
						<div className="restaurantName">{restaurantName}</div>
						<div className="productsList">{productsList}</div>
					</Col>
				)
				
			});
		}
	}

	//buttons classes
	let button_r_classes = null;
	let button_p_classes = null;
	let button_s_classes = null;
	if (props.viewMode === 0) {
		button_r_classes = "focus";
		button_p_classes = "";
		button_s_classes = "";
	} else if (props.viewMode === 1) {
		button_r_classes = "";
		button_p_classes = "focus";
		button_s_classes = "";
	} else if (props.viewMode === 2) {
		button_r_classes = "";
		button_p_classes = "";
		button_s_classes = "focus";
	}

	return (
		<Container className="OrdersView">
		  <Row>

		  	{(props.order)?
		  		
		  		<Auxiliary>
			  		
			  		<Col md={12} id="toggleButtons">
						<button className={button_r_classes} onClick={() => props.setViewMode(0)} > Vista Ristoranti <span role="img" aria-label="restaurant">🍝</span> </button>
						<button className={button_p_classes} onClick={() => props.setViewMode(1)} > Vista Prodotti <span role="img" aria-label="leaf">🌿</span> </button>
						<button className={button_s_classes} onClick={() => props.setViewMode(2)} > Riepilogo <span role="img" aria-label="leaf">📋</span> </button>
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
