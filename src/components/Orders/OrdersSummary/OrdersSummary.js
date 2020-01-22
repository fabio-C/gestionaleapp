import React from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';

import Auxiliary from '../../../hoc/Auxiliary/Auxiliary';

import './OrdersSummary.css';

const OrdersSummary = (props) => {

	let orderSummaryDOM = null;
	if (props.order) {
		if (props.modeRestaurant) {
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
		} else {
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
		}
		
	}

	//buttons classes
	let button_r_classes = null;
	let button_p_classes = null;
	if (props.modeRestaurant) {
		button_r_classes = "focus";
		button_p_classes = "";
	} else {
		button_r_classes = "";
		button_p_classes = "focus";
	}

	return (
		<Container className="OrdersSummary">
		  <Row>

		  	{(props.order)?
		  		
		  		<Auxiliary>
			  		
			  		<Col md={12} id="toggleButtons">
						<button className={button_r_classes} onClick={() => props.setModeRestaurant(true)} > Vista Ristoranti 🍝 </button>
						<button className={button_p_classes} onClick={() => props.setModeRestaurant(false)} > Vista Prodotti 🌿 </button>
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
