import React from 'react';
import {Row, Col, Button} from 'react-bootstrap';

import { Bar } from 'react-chartjs-2';
import "./HistoricalChart.css";

const HistoricalChart = (props) => {

	/*
		props.restaurantsForChart: list of all restaurants to display in chart
		props.productsForChart: list of all restaurantsForChart to display in chart
		props.orders: list of all the order in the selected month
	*/

	//Calculate an array of the days of a month:
	let monthdates = null;
	if ((props.month !== null) && props.year) {
		monthdates = getDaysArray(new Date(props.year, props.month, 1), new Date(props.year, props.month + 1, 0));
	}

	//Chartjs datasets and labels array
	let datasets = [];
	let labels = [];

	//Create the structure of datasets, with restaurant name, and empty data
	let i = 0;
	if (props.historicalMode === 0) {
		for (i = 0; i < props.restaurantsForChart.length; i++) {
			datasets.push(
				{
			        label: props.restaurantsForChart[i].name,
			        backgroundColor: '#'+Math.floor(Math.random()*16777215).toString(16),
			        data: [],
			        id: props.restaurantsForChart[i].id
			    }
			)
		}
	} else if (props.historicalMode === 1) {
		for (i = 0; i < props.productsForChart.length; i++) {
			datasets.push(
				{
			        label: props.productsForChart[i].name,
			        backgroundColor: '#'+Math.floor(Math.random()*16777215).toString(16),
			        data: [],
			        id: props.productsForChart[i].id
			    }
			)
		}
	}

	//Popolate datasets and labels
	if (props.orders && datasets.length) {

		//For each days of the month
		for (i = 0; i < monthdates.length; i++) {

			//Add month number to labels
			labels.push(monthdates[i].getDate());

			//For each day, find if the order exist
			let orderFound = false; //Flag

			//For each orders
			for (let j = 0; j < props.orders.length; j++) {

				//Compare date
				if(monthdates[i].getTime() === props.orders[j].date.seconds*1000){
					
					orderFound = true; //Flag

					//If order is found, loop over all restaurants in the order, and find the
					//same restarant of the datasets obj

					//For each restaurants in the system
					for (let k = 0; k < datasets.length; k++) {
						
						let total = 0;
						let z = 0;
						if (props.historicalMode === 0) {
							//For each restaurants in the order
							for (z = 0; z < props.orders[j].restaurants.length; z++) {
								//Compare restaurant id
								if(datasets[k].id === props.orders[j].restaurants[z].id){
									//If restaurant found, get the total
									for (let y = 0; y < props.orders[j].restaurants[z].products.length; y++) {
										total += props.orders[j].restaurants[z].products[y].quantity;
									}
								}	
							}
						} else if (props.historicalMode === 1) {
							//For each restaurant in the order
							for (z = 0; z < props.orders[j].restaurants.length; z++) {
								//For each product in the restaurant
								for (let y = 0; y < props.orders[j].restaurants[z].products.length; y++) {
									//Compare restaurant id
									if(datasets[k].id === props.orders[j].restaurants[z].products[y].id) {
										total += props.orders[j].restaurants[z].products[y].quantity
									}
								}
							}
						}

						//Update datasets obj
						datasets[k].data.push(total);
					}

				}

			}

			if(!orderFound){
				//If order is not found
				//Fill all with 0
				for (var l = 0; l < datasets.length; l++) {
					datasets[l].data.push(0)
				}
			}
		}

	}

	/*
		//How to use Chartjs. 
		//Example.
		var data =  {
	        labels: ['1', '2', '3', '4', '5', '6', '7'],
	        datasets: [{
	            label: 'Boccaccio',
	            backgroundColor: 'rgb(155, 99, 132)',
	            data: [0, 10, 5, 2, 20, 30, 45]
	        },
	        {
	            label: 'Pagliaccio',
	            backgroundColor: 'rgb(255, 99, 132)',
	            data: [0, 1, 1, 2, 70, 30, 45]
	        }]
	    }
    */
    var data = {
    	labels: labels,
    	datasets: datasets
    }

    var options = {
    	scales: {
            xAxes: [{
                stacked: true,
                gridLines: { color: "#131c2b" },
                scaleLabel: {
			        display: true,
			        labelString: 'Giorno del mese'
			    }
            }],
            yAxes: [{
                stacked: true,
                gridLines: { color: "#131c2b" },
                ticks: {
		          beginAtZero: true,
		          min: 0
		        },
		        scaleLabel: {
			        display: true,
			        labelString: 'Ordini'
			    }
            }]
        },
        legend: {
        	display: false
        }
    }

	return (
		<Row className="HistoricalChart">	
		  	<Col md={12}>
		  		<Bar
					data={data}
					options={options}/>

				<Button variant="link" onClick={() => props.handleClickDownload(data)}> Scarica Dati </Button>

			</Col>


	    </Row>
	);
}

export default HistoricalChart;

var getDaysArray = function(s,e) {for(var a=[],d=s;d<=e;d.setDate(d.getDate()+1)){ a.push(new Date(d));}return a;};
