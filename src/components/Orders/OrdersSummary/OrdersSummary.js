import React from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';

import Auxiliary from '../../../hoc/Auxiliary/Auxiliary';

import './OrdersSummary.css';

const OrdersSummary = (props) => {

	let orderSummaryDOM = null;
	if (props.order) {
		if (props.modeRestaurant === 0) {
			orderSummaryDOM = props.order.restaurantSummary.map((restaurant, index) => {

				const emptyBoxClass = ((restaurant.total === 0) ? 'restaurantBox empty' : 'restaurantBox');

				return(
					<Col md={3} key={index}>
						<div className={emptyBoxClass} onClick={() => props.handleClickRestaurant(restaurant.id, restaurant.name)}>
							{restaurant.name}
							<span>{restaurant.total}</span>
						</div>
					</Col>
				)
			});
		} else if (props.modeRestaurant === 1) {
			orderSummaryDOM = props.order.productSummary.map((product, index) => {

				const emptyBoxClass = ((product.total === 0) ? 'productBox empty' : 'productBox');

				return(
					<Col md={3} key={index}>
						<div className={emptyBoxClass}>
							{product.name}
							<span>{product.total}</span>
						</div>
					</Col>
				)
			});
		} else if (props.modeRestaurant === 2) {
			console.log(props.order);
			orderSummaryDOM = props.order.restaurantSummary.map((restaurant, index) => {

				if (restaurant.total > 0) {
					return(
						<Col md={12} key={index}>
							{restaurant.name}
						</Col>
					)
				}
			});
		}
	}

	//buttons classes
	let button_r_classes = null;
	let button_p_classes = null;
	let button_s_classes = null;
	if (props.modeRestaurant === 0) {
		button_r_classes = "focus";
		button_p_classes = "";
		button_s_classes = "";
	} else if (props.modeRestaurant === 1) {
		button_r_classes = "";
		button_p_classes = "focus";
		button_s_classes = "";
	} else if (props.modeRestaurant === 2) {
		button_r_classes = "";
		button_p_classes = "";
		button_s_classes = "focus";
	}

	return (
		<Container className="OrdersSummary">
		  <Row>

		  	{(props.order)?
		  		
		  		<Auxiliary>
			  		
			  		<Col md={12} id="toggleButtons">
						<button className={button_r_classes} onClick={() => props.setModeRestaurant(0)} > Vista Ristoranti <span role="img" aria-label="restaurant">🍝</span> </button>
						<button className={button_p_classes} onClick={() => props.setModeRestaurant(1)} > Vista Prodotti <span role="img" aria-label="leaf">🌿</span> </button>
						<button className={button_s_classes} onClick={() => props.setModeRestaurant(2)} > Riepilogo <span role="img" aria-label="leaf">📋</span> </button>
					</Col>
		  		
			  		{orderSummaryDOM}

			  		<Col md={12} className="lastButtons">
						<Button variant="danger" onClick={props.handleClickDelete}> Elimina Ordine </Button>
					</Col>

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

export default OrdersSummary;
