import React from 'react';
import DatePicker from "react-datepicker";
import {Container, Row, Col} from 'react-bootstrap';

import "./OrdersNavigation.css";
import "react-datepicker/dist/react-datepicker.css";

//TODO CHANGE TO ITALY DATE: https://stackoverflow.com/questions/54399084/change-locale-in-react-datepicker

const OrdersNavigation = (props) => {

	return (
		<Container className="OrdersNavigation">
		  <Row>
		  	<Col md={12}>
		  		<h3>Ordini del</h3>
			  	<DatePicker
			        selected={props.startDate}
			        onChange={props.handleDateChange}
			        dateFormat="MMMM d, yyyy"
			    />
			</Col>
		  </Row>
		</Container>
	);
}

export default OrdersNavigation;
