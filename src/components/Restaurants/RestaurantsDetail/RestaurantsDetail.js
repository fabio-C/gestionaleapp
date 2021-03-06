import React from 'react';
import {Container, Row, Col, Button, Modal} from 'react-bootstrap';
import './RestaurantsDetail.css';

const RestaurantsDetail = (props) => {

	return (
		<Container className="RestaurantsDetail">

		  	<Row>
				<Col md={6} className="RestaurantDetailButtons1"> 
					<Button onClick={props.handleClickBack}> Indietro </Button> 
				</Col>
				<Col md={6} className="RestaurantDetailButtons2"> 
					<Button onClick={props.handleClickSave} disabled={!props.restaurantEdited}> Salva </Button>
					<Button variant="danger" onClick={props.handleClickDelete}> Elimina </Button>
				</Col> 
			</Row>
		 	
		 	<Row>

			  	<Col md={12} id="inputContainers"> 
			  		
			  		<label id="restaurantid">{props.restaurant.id}</label>

			  		<label>Nome Ristorante</label>
			  		<input type="text" value={props.restaurant.name} id="name" onChange={props.handleChangeRestaurant}/>
			  		
			  		<label>Partita IVA</label>
			  		<input type="text" value={props.restaurant.iva} id="iva" onChange={props.handleChangeRestaurant}/>
			  		
			  		<label>Indirizzo</label>
			  		<input type="text" value={props.restaurant.address} id="address" onChange={props.handleChangeRestaurant}/>
			  		
			  		<label>Destinatario fattura</label>
			  		<input type="text" value={props.restaurant.invoiceto} id="invoiceto" onChange={props.handleChangeRestaurant}/>

			  		<label>Email</label>
			  		<input type="text" value={props.restaurant.email} id="email" onChange={props.handleChangeRestaurant}/>
			  		
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

export default RestaurantsDetail;
