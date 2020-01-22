import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';

import "./ProductsSummary.css";

const ProductsSummary = (props) => {

	let productsSummaryDOM = null;
	if (props.products) {
		productsSummaryDOM = props.products.map((product, index) => {
			return(
				<Col md={3} key={index}>
					<div className="productBox" onClick={() => props.handleClickProduct(product.id)}>
						{product.name}
					</div>
				</Col>
			)
		})
	}

	return (
		<Container className="ProductsSummary">
		  <Row>

		  	<Col md={12}>
		  		<h3> Lista Completa Prodotti 🌿 </h3>
		  		<p> Clicca su un prodotto per visualizzare o modificare i dati associati.</p>
		  	</Col>

		  	<Col md={3}> 
		  		<div className="productBox" id="addProductBox" onClick={props.handleClickNewProduct}>Aggiungi prodotto </div>
		  	</Col>
			{productsSummaryDOM}

		  </Row>
		</Container>
	);
}

export default ProductsSummary;
