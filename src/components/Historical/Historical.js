import React, {Component} from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';

import HistoricalChart from './HistoricalChart/HistoricalChart';
import './Historical.css';

class Historical extends Component {

	constructor(props){
		super(props);
		this.state = {
			orders: null, //List of all the order in the selected month

			month: null,
			year: 2020,
			modeRestaurant: true, //Show restaurant chart

			//Chart
			restaurantsForChart: [], //List of the restaurant to display. Can be one or all.
			productsForChart: [], //List of the restaurant to display. Can be one or all.
			displayChart: false //FLAG
		}
	}

	componentDidMount() {
	}

	handleClickStart = () => {
		//Get all orders
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

		//If list has not be initialized:
		if ((this.state.restaurantsForChart.length === 0) || (this.state.productsForChart.length === 0)) {
			this.setState({
				restaurantsForChart: this.props.appstate.restaurants,
				productsForChart: this.props.appstate.products
			});
		}

		//Get order details
		this.props.db.collection("orders")
			.where("date", ">", first)
			.where("date", "<", last)
			.get().then(
			snapshot => {
				if (snapshot.empty) {
					alert("Non sono stati trovati ordini nel mese selezionato.")
					return;
				} else {
					
					let orders = [];

					for (var i = 0; i < snapshot.docs.length; i++) {
						orders.push(snapshot.docs[i].data());
					};

					this.setState({
						orders: orders,
						displayChart: true
					});
				}
			});
	}

	monthSelected = (e) => {
		this.setState({
			month: parseInt(e.target.value),
			displayChart: false
		});
	}

	yearSelected = (e) => {
		this.setState({
			year: parseInt(e.target.value),
			displayChart: false
		});
	}

	restaurantSelected = (e) => {
		if (e.target.value === "all") {
			this.setState({
				restaurantsForChart: this.props.appstate.restaurants
			});	
		} else {
			//todo
			this.setState({
				restaurantsForChart: [this.props.appstate.restaurants.find(r => r.id === e.target.value)]
			});
		}
	}

	productSelected = (e) => {
		if (e.target.value === "all") {
			this.setState({
				productsForChart: this.props.appstate.products
			});	
		} else {
			//todo
			this.setState({
				productsForChart: [this.props.appstate.products.find(p => p.id === e.target.value)]
			});
		}	
	}

	setModeRestaurant = (state) => {
		this.setState({
			modeRestaurant: state
		});
	}

	handleClickDownload = (data) => {
		console.log("handleClickDownload");
		console.log(data);

		let csvContent = "data:text/csv;charset=utf-8,Ristoranti," + data.labels.join(",") + "\r\n";

		data.datasets.forEach(function(rowArray) {
		    let row = rowArray.data.join(",");
		    csvContent += rowArray.label + "," + row + "\r\n";
		});

		let encodedUri = encodeURI(csvContent);

		window.open(encodedUri);
	}

  	render(){

  		let restaurantsSelectDOM = null;
  		if (this.props.appstate.restaurants) {
  			restaurantsSelectDOM = this.props.appstate.restaurants.map(r => {
  				return(
  					<option value={r.id} key={r.id}>{r.name}</option>
  				)
  			});
  		}

  		let productsSelectDOM = null;
  		if (this.props.appstate.products) {
  			productsSelectDOM = this.props.appstate.products.map(p => {
  				return(
  					<option value={p.id} key={p.id}>{p.name}</option>
  				)
  			});
  		}

  		//buttons classes
		let button_r_classes = null;
		let button_p_classes = null;
		if (this.state.modeRestaurant) {
			button_r_classes = "focus";
			button_p_classes = "";
		} else {
			button_r_classes = "";
			button_p_classes = "focus";
		}

    	return (
    		<Container className="Historical">
	      		<Row>
	      			<Col md={12}>
				  		<h3> Storici Dati <span role="img" aria-label="book">📚</span> </h3>
				  		<p> Seleziona Mese, Anno e Ristorante per visualizzare l'andamento degli ordini o dei prodotti.</p>
				  		<hr></hr>
				  	</Col>

				  	<Col md={12} id="toggleButtons">
						<button className={button_r_classes} onClick={() => this.setModeRestaurant(true)} > Storico Ristoranti <span role="img" aria-label="restaurant">🍝</span> </button>
						<button className={button_p_classes} onClick={() => this.setModeRestaurant(false)} > Storico Prodotti <span role="img" aria-label="green">🌿</span> </button>
					</Col>

			  		<Col md={12} id="selectButtons">
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

						{this.state.modeRestaurant?
							<select onChange={this.restaurantSelected}>
							  <option value="all">Tutti i ristoranti</option>
							  {restaurantsSelectDOM}
							</select>
						: 
							<select onChange={this.productSelected}>
							  <option value="all">Tutti i prodotti</option>
							  {productsSelectDOM}
							</select>
						}

						<Button variant="primary" onClick={this.handleClickStart} disabled={this.state.month === null}> Avvia ricerca </Button>
			  		
			  		</Col>
			    </Row>

			    {this.state.displayChart?
				    <HistoricalChart 
						orders={this.state.orders}
						month={this.state.month}
						year={this.state.year}

						modeRestaurant={this.state.modeRestaurant}

						restaurantsForChart={this.state.restaurantsForChart}
						productsForChart={this.state.productsForChart}
						handleClickDownload={this.handleClickDownload}/>
				: null}
			</Container>

			
    	);
  	}
}

export default Historical;