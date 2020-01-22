import React, {Component} from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';

import HistoricalTable from './HistoricalTable/HistoricalTable';

class Historical extends Component {

	constructor(props){
		super(props);
		this.state = {
			month: null,
			year: 2020,
			orders: null //List of all the order in the selected month
		}
	}

	componentDidMount() {
		//this.getOrdersByMonth(0, 2020);
	}

	handleClickStart = () => {
		this.getOrdersByMonth(this.state.month, this.state.year);
	}

	/*
		getOrdersByMonth
		------------------------
		month: 0,1,2,3,4 (O:January)
		year: 2019, 2020
	*/
	getOrdersByMonth = (month, year) => {

		const first = new Date(year, month, 1); //First day of selected month
		var last = new Date(year, month + 1, 0); //Last day of selected month

		//Get order details
		this.props.db.collection("orders")
			.where("date", ">", first)
			.where("date", "<", last)
			.get().then(
			snapshot => {
				if (snapshot.empty) {
					console.log('Firestore Order Documents Not Found');
					return;
				} else {
					
					let orders = [];

					console.log(snapshot.docs.length + " Orders Doc Found");

					for (var i = 0; i < snapshot.docs.length; i++) {
						orders.push(snapshot.docs[i].data());
					};

					this.setState({
						orders: orders
					});
				}
			});
	}

	monthSelected = (e) => {
		this.setState({
			month: parseInt(e.target.value)
		});
	}

	yearSelected = (e) => {
		this.setState({
			year: parseInt(e.target.value)
		});
	}

  	render(){
    	return (
    		<Container className="Historical">
	      		<Row>
			  		<Col md={12}>
				        <p> Storici</p>

				        <select onChange={this.monthSelected}>
						  <option value={null}>Seleziona Mese</option>
						  <option value={0}>Gennaio</option>
						  <option value={1}>Febbraio</option>
						  <option value={2}>Marzo</option>
						  <option value={3}>Aprile</option>
						  <option value={4}>Maggio</option>
						  <option value={5}>Giugno</option>
						  <option value={6}>Luglio</option>
						  <option value={7}>Agosto</option>
						  <option value="September">Settembre</option>
						  <option value="October">Ottobre</option>
						  <option value="November">Novembre</option>
						  <option value="December">Dicembre</option>
						</select>

						<select onChange={this.yearSelected}>
						  <option value={2020}>2020</option>
						  <option value={2021}>2021</option>
						  <option value={2022}>2022</option>
						  <option value={2023}>2023</option>
						</select>
			  		</Col>

			  		<Col md={12}>
						<Button variant="primary" onClick={this.handleClickStart} disabled={this.state.month === null}> Vai </Button>
					</Col>

					<HistoricalTable />

			    </Row>
			</Container>
    	);
  	}
}

export default Historical;