import React from 'react';
import {Container, Row, Col, Button, Table} from 'react-bootstrap';
import './OrdersDetail.css';

const OrdersDetail = (props) => {

	let productListDOM = null;
	productListDOM = props.restaurant.products.map((product, index) => {
		return(
			<tr key={index}>
				<td className="td_name">{product.name}</td>
				<td className="td_quantity">
					<div>
						<button onClick={() => props.handleClickEditProduct(product.id, "subtract")}> - </button>
					</div>
					<div>
						{product.quantity}
					</div>
					<div>
						<button onClick={() => props.handleClickEditProduct(product.id, "add")}> + </button>
					</div>
				</td>
			</tr>
		)
	})

	return (
		<Container className="OrdersDetail">
		  <Row>
			<Col md={4}> <Button onClick={props.handleClickBack}> Indietro </Button> </Col> 
			<Col md={4}> <Button onClick={null}> Salva Modifiche </Button> </Col> 
			<Col md={4}> <Button onClick={null}> Stampa PDF </Button> </Col> 

			<Col md={12}> <h3> Ristorante: {props.restaurant.name} </h3> </Col>
			
			<Col md={12}> <h5> Totale Ordine: 123 euro </h5> </Col>

			<Col md={12}>
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Prodotto</th>
							<th>Quantita</th>
						</tr>
					</thead>
					<tbody>
						{productListDOM}
					</tbody>
				</Table>
			</Col>
		  </Row>
		</Container>
	);
}

export default OrdersDetail;
