import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';

import "./HistoricalTable.css";

const HistoricalTable = (props) => {

	return (
		<Container className="HistoricalTable">
		  <Row>
		  	<Col md={12}>
		  		<table>
				  <tr>
				    <th>Ristorante</th>
				    <th>01 Gennaio</th>
				    <th>02 Gennaio</th>
				  </tr>
				  <tr>
				    <td>Bocca doro</td>
				    <td>12</td>
				    <td>5</td>
				  </tr>
				  <tr>
				    <td>Cipro</td>
				    <td>34</td>
				    <td>94</td>
				  </tr>
				  <tr>
				    <td>totale</td>
				    <td>45</td>
				    <td>120</td>
				  </tr>
				</table>
			</Col>

			<Col md={12}>
		  		<table>
				  <tr>
				    <th>Prodotto</th>
				    <th>01 Gennaio</th>
				    <th>02 Gennaio</th>
				  </tr>
				  <tr>
				    <td>Acetosa</td>
				    <td>12</td>
				    <td>5</td>
				  </tr>
				  <tr>
				    <td>Aquarella</td>
				    <td>34</td>
				    <td>94</td>
				  </tr>
				  <tr>
				    <td>totale</td>
				    <td>45</td>
				    <td>120</td>
				  </tr>
				</table>
			</Col>

		  </Row>
		</Container>
	);
}

export default HistoricalTable;
