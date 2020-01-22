import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';

import "./RestaurantsSummary.css";

const RestaurantsSummary = (props) => {

	let restaurantsSummaryDOM = null;
	if (props.restaurants) {
		restaurantsSummaryDOM = props.restaurants.map((restaurant, index) => {
			return(
				<Col md={3} key={index}>
					<div className="restaurantBox" onClick={() => props.handleClickRestaurant(restaurant.id)}>
						{restaurant.name}
					</div>
				</Col>
			)
		})
	}

	return (
		<Container className="RestaurantsSummary">
		  <Row>

		  	<Col md={12}>
		  		<h3> Lista Completa Ristoranti 🍝 </h3>
		  		<p> Clicca su un ristorante per visualizzare o modificare i dati associati.</p>
		  	</Col>

		  	<Col md={3}> 
		  		<div className="restaurantBox" id="addRestaurantBox" onClick={props.handleClickNewRestaurant}>Aggiungi ristorante </div>
		  	</Col>
			{restaurantsSummaryDOM}

		  </Row>
		</Container>
	);
}

export default RestaurantsSummary;
