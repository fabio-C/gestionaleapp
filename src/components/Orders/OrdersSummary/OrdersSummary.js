import React from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';

import './OrdersSummary.css';

const OrdersSummary = (props) => {

	let noOrderDOM = null;
	let orderSummaryDOM = null;
	if (props.order) {
		orderSummaryDOM = props.order.restaurantSummary.map((restaurant, index) => {
			return(
				<Col md={3} key={index}>
					<div className="restaurantBox" onClick={() => props.handleClickRestaurant(restaurant.id, restaurant.name)}>
						{restaurant.name}
						<span>{restaurant.total}</span>
					</div>
				</Col>
			)
		})
	} else {
		noOrderDOM = (
			<Col>
				<Button variant="primary" onClick={props.handleClickNewOrder}>Crea nuovo ordine</Button>
			</Col>

		)
	}

	return (
		<Container className="OrdersSummary">
		  <Row>
		  	{orderSummaryDOM}
		  	{noOrderDOM}
		  </Row>
		</Container>
	);
}

export default OrdersSummary;
