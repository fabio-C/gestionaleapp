import React from 'react';
import {Container, Row, Col, Button, Table, Modal} from 'react-bootstrap';
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
					<div className="productQuantity">
						{product.quantity}
					</div>
					<div>
						<button onClick={() => props.handleClickEditProduct(product.id, "add")}> + </button>
					</div>
				</td>
			</tr>
		)
	});

	//Calculate total and totaleuro
	//let total = 0;
	let totaleuro = 0;
	for (var i = 0; i < props.restaurant.products.length; i++) {
		//total += props.restaurant.products[i].quantity;
		totaleuro += props.restaurant.products[i].price*props.restaurant.products[i].quantity;
	}

	return (
		<Container className="OrdersDetail">

			<Row>
				<Col md={12}> 
					<h3> Ristorante: {props.restaurant.name} </h3> 
					<h5> Totale Euro: {totaleuro} </h5>
				</Col>
			</Row>


			<Row>
				<Col md={6} className="OrdersDetailButtons1"> 
					<Button onClick={props.handleClickBack}> Indietro </Button> 
				</Col>
				<Col md={6} className="OrdersDetailButtons2"> 
					<Button onClick={props.handleClickSave} disabled={!props.orderEdited}> Salva </Button> 
					<Button onClick={props.handleClickPrint} disabled={props.orderEdited}> Stampa Fattura </Button> 
				</Col> 
			</Row>

			<Row>
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

			<Modal show={props.showModal} onHide={props.handleModalHide}>
				<Modal.Header closeButton>
					<Modal.Title>{props.modalTitle}</Modal.Title>
				</Modal.Header>
				<Modal.Body>{props.modalBody}</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={props.handleModalConfirm}>
						Esci
					</Button>
				</Modal.Footer>
			</Modal>

		</Container>
	);
}

export default OrdersDetail;
