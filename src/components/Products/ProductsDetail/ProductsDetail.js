import React from 'react';
import {Container, Row, Col, Button, Modal} from 'react-bootstrap';
import './ProductsDetail.css';

const ProductsDetail = (props) => {

	return (
		<Container className="ProductsDetail">

		  	<Row>
				<Col md={6} className="ProductDetailButtons1"> 
					<Button onClick={props.handleClickBack}> Indietro </Button> 
				</Col>
				<Col md={6} className="ProductDetailButtons2"> 
					<Button onClick={props.handleClickSave} disabled={!props.productEdited}> Salva </Button>
					<Button variant="danger" onClick={props.handleClickDelete}> Elimina </Button>
				</Col> 
			</Row>
		 	
		 	<Row>

			  	<Col md={12} id="inputContainers"> 

			  		<label id="productid">{props.product.id}</label>
			  		
			  		<label>Nome Prodotto</label>
			  		<input type="text" value={props.product.name} id="name" onChange={props.handleChangeProduct}/>			  		

			  		<label>Prezzo vaschetta(€)</label>
			  		<input type="number" value={props.product.price} id="price" onChange={props.handleChangeProduct}/>

			  		<label>Peso vaschetta (grammi)</label>
			  		<input type="number" value={props.product.weight} id="weight" onChange={props.handleChangeProduct}/>

			  		<label>Percentuale IVA (%)</label>
			  		<input type="number" value={props.product.iva} id="iva" onChange={props.handleChangeProduct}/>
			  		
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

export default ProductsDetail;
