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
			historicalMode: 0, //0,1,2

			//Chart
			restaurantsSelectedId: null, //id of the selected restaurant (used by download detail)
			restaurantsForChart: [], //List of the restaurant to display. Can be one or all.
			productsForChart: [], //List of the restaurant to display. Can be one or all.
			displayChart: false //FLAG
		}
	}

	componentDidMount() {
	}

	handleClickVisualize = () => {
		//Get all orders
		this.getOrdersByMonth(this.state.month, this.state.year);
	}

	handleClickDetail = () => {
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

		if (this.state.historicalMode === 0) {
			//If list has not be initialized:
			if (this.state.restaurantsForChart.length === 0) {
				this.setState({
					restaurantsForChart: this.props.appstate.restaurants
				});
			}
		} else if (this.state.historicalMode === 1) {
			//If list has not be initialized:
			if (this.state.productsForChart.length === 0) {
				this.setState({
					productsForChart: this.props.appstate.products
				});
			}
		} else if (this.state.historicalMode === 2) {

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

					if((this.state.historicalMode === 0)||(this.state.historicalMode === 1)) {
						console.log("asdfasdf1");
						this.setState({
							orders: orders,
							displayChart: true
						});
					} else {
						this.downloadDetail(orders)
					}
					
				}
			});
	}

	//This founction download the CSV of orders of an entire month of a single restaurant, with product details:
	/*
	Example:
	Products,1,2,3,4,5,6,7,8,9,....
	Acetosa,1,1,0,0,0,0,0,0,0,0,...
	Acetosella,0,0,0,0,0,10,0,2,...
	....
	Total,2,2,2,2,2,
	*/
	downloadDetail = (orders) => {

		//Create the array of monthdates. Example: [Date, Date, Date, Date, ecc]
		let monthdates = null;
		if ((this.state.month !== null) && this.state.year) {
			monthdates = getDaysArray(new Date(this.state.year, this.state.month, 1), new Date(this.state.year, this.state.month + 1, 0));
		}
		
		//Array of days number. Example: [1,2,3,4,5,6,7,ecc]
		let days = [];

		/*
		//Create the array of products. Initially only with the name.
		//Example:
			[
				[Acetosa],
				[Acetosella],
				[Rucola],
				...
			]
		*/
		let productRows = [];
		for (let p = 0; p < this.props.appstate.products.length; p++) { //For each product:
			productRows.push([this.props.appstate.products[p].name])
		}

		//Create the last row of the table, containing the totals. Example: [Total,0,0,0,2,3,3]
		let totalRow = ["total"]

		//For each days of the month
		for (let i = 0; i < monthdates.length; i++) {
			
			//Calculate the total of the day
			let totalOdDay = 0;

			//Find the order of the day
			const order = orders.find(o => o.date.seconds*1000 === monthdates[i].getTime())
			
			//Add month number to labels
			days.push(monthdates[i].getDate());

			//For each product:
			for (let j = 0; j < this.props.appstate.products.length; j++) {				

				//If order found
				if (order) {
					
					//Check if the selected restaurant is inside the order
					const restaurant = order.restaurants.find(r => r.id === this.state.restaurantsSelectedId);

					//Restaurant found
					if (restaurant) {

						//Restaurant has ordered something. Check if there is the specific product:					
						const product = restaurant.products.find(p => p.id === this.props.appstate.products[j].id);

						//Product found
						if (product) {
							//Add the correspective quantity
							productRows[j].push(product.quantity);

							//Sum the total
							totalOdDay += product.quantity;
						} else {
							//Product not found
							productRows[j].push(0);
						}
					} else {
						//Restaurant has not order anything this day
						productRows[j].push(0)
					}
				} else {
					//There are not orders in the selected day
					productRows[j].push(0)
				}

			}

			//Push the total:
			totalRow.push(totalOdDay);
		}

		//Create CSV
		let csvContent = "data:text/csv;charset=utf-8,Prodotti," + days.join(",") + ",tot" + "\r\n";
		
		//Add the rows to CSV		
		productRows.forEach(function(row) {
			//Total calculation
		    let tot = 0;
		    for (var i = 1; i < row.length; i++) {
		    	tot += row[i]
		    }
		    csvContent += row.join(",") + "," + tot + "\r\n";
		});

		//Attach the totals row
		csvContent += totalRow.join(",") + "\r\n";

		let encodedUri = encodeURI(csvContent);
		var link = document.createElement("a");
		link.setAttribute("href", encodedUri);

		//Check if the selected restaurant is inside the order
		const restaurantName = this.props.appstate.restaurants.find(r => r.id === this.state.restaurantsSelectedId).name;
		const filename = restaurantName + "_" + (this.state.month + 1) + "_" + this.state.year + ".csv";
		link.setAttribute("download", filename);
		document.body.appendChild(link); // Required for FF
		link.click(); // This will download the data file named "my_data.csv".

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
				restaurantsForChart: this.props.appstate.restaurants,
				restaurantsSelectedId: "all"
			});	
		} else {
			this.setState({
				restaurantsForChart: [this.props.appstate.restaurants.find(r => r.id === e.target.value)],
				restaurantsSelectedId: e.target.value
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

	sethistoricalMode = (state) => {
		this.setState({
			historicalMode: state
		});
	}

	handleClickDownload = (data) => {

		let csvContent = null;
		if (this.state.historicalMode === 0) {
			csvContent = "data:text/csv;charset=utf-8,Ristoranti," + data.labels.join(",") + ",tot" + "\r\n";
		} else if (this.state.historicalMode === 1) {
			csvContent = "data:text/csv;charset=utf-8,Prodotti," + data.labels.join(",") + ",tot" + "\r\n";
		}


		data.datasets.forEach(function(rowArray) {
		    let row = rowArray.data.join(",");
		    let tot = 0;
		    for (var i = 0; i < rowArray.data.length; i++) {
		    	tot += rowArray.data[i]
		    }
		    csvContent += rowArray.label + "," + row + "," + tot + "\r\n";
		});


		let encodedUri = encodeURI(csvContent);
		var link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		const filename = (this.state.month + 1) + "_" + this.state.year + "_dati_gestionale.csv"
		link.setAttribute("download", filename);
		document.body.appendChild(link); // Required for FF
		link.click(); // This will download the data file named "my_data.csv".

		//window.open(encodedUri);
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
		let button_q_classes = null;
		if (this.state.historicalMode === 0) {
			button_r_classes = "focus";
			button_p_classes = "";
			button_q_classes = "";
		} else if (this.state.historicalMode === 1) {
			button_r_classes = "";
			button_p_classes = "focus";
			button_q_classes = "";
		} else if (this.state.historicalMode === 2) {
			button_r_classes = "";
			button_p_classes = "";
			button_q_classes = "focus";
		}

    	return (
    		<Container className="Historical">
	      		<Row>
	      			<Col md={12}>
				  		<h3> Registro Dati <span role="img" aria-label="book">📚</span> </h3>
				  		<p> Seleziona Mese, Anno e Ristorante per visualizzare l'andamento degli ordini o dei prodotti.</p>
				  		<hr></hr>
				  	</Col>

				  	<Col md={12} id="toggleButtons">
						<button className={button_r_classes} onClick={() => this.sethistoricalMode(0)} > Dati Ristoranti <span role="img" aria-label="restaurant">🍝</span> </button>
						<button className={button_p_classes} onClick={() => this.sethistoricalMode(1)} > Dati Prodotti <span role="img" aria-label="green">🌿</span> </button>
						<button className={button_q_classes} onClick={() => this.sethistoricalMode(2)} > Dettaglio Ristorante <span role="img" aria-label="green">📋</span> </button>
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

						{(this.state.historicalMode === 0) ?
							<select onChange={this.restaurantSelected}>
							  <option value="all">Tutti i ristoranti</option>
							  {restaurantsSelectDOM}
							</select>
						: null}

						{(this.state.historicalMode === 1) ?
							<select onChange={this.productSelected}>
							  <option value="all">Tutti i prodotti</option>
							  {productsSelectDOM}
							</select>
						: null}

						{(this.state.historicalMode === 2) ?
							<select onChange={this.restaurantSelected}>
							<option value="DEFAULT" disabled>Seleziona un ristorante</option>
							  {restaurantsSelectDOM}
							</select>
						: null}


						{((this.state.historicalMode === 0)||(this.state.historicalMode === 1)) ?
							<Button variant="primary" onClick={this.handleClickVisualize} disabled={this.state.month === null}> Visualizza </Button>
						:
			  				<Button variant="primary" onClick={this.handleClickDetail} disabled={(this.state.month === null)||(this.state.restaurantsSelectedId === null)}> Scarica </Button>
			  			}
			  		</Col>
			    </Row>

			    {this.state.displayChart?
				    <HistoricalChart 
						orders={this.state.orders}
						month={this.state.month}
						year={this.state.year}

						historicalMode={this.state.historicalMode}

						restaurantsForChart={this.state.restaurantsForChart}
						productsForChart={this.state.productsForChart}
						handleClickDownload={this.handleClickDownload}/>
				: null}
			</Container>

			
    	);
  	}
}

export default Historical;


var getDaysArray = function(s,e) {for(var a=[],d=s;d<=e;d.setDate(d.getDate()+1)){ a.push(new Date(d));}return a;};
