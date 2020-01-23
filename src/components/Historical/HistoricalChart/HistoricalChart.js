import React from 'react';
import {Container, Row, Col, Table} from 'react-bootstrap';

import { Bar } from 'react-chartjs-2';
import "./HistoricalChart.css";

const HistoricalChart = (props) => {

	//props.restaurants: list of all restaurants in the system
	//props.orders: list of all the order in the selected month

	//Calculate an array of the days of a month:
	let monthdates = null;
	if ((props.month !== null) && props.year) {
		monthdates = getDaysArray(new Date(props.year, props.month, 1), new Date(props.year, props.month + 1, 0));
	}

	//Chartjs datasets and labels array
	let datasets = [];
	let labels = [];

	//Create the structure of datasets, with restaurant name, and empty data
	if(props.restaurants){
		for (var i = 0; i < props.restaurants.length; i++) {
			datasets.push(
				{
		            label: props.restaurants[i].name,
		            backgroundColor: 'rgb(155, 99, 132)',
		            data: [],
		            id: props.restaurants[i].id
		        }
			)
		}
	}

	//Popolate datasets and labels
	if (props.orders && datasets.length) {

		//For each days of the month
		for (var i = 0; i < monthdates.length; i++) {

			//Add month number to labels
			labels.push(monthdates[i].getDate());

			//For each day, find if the order exist
			var orderFound = false; //Flag

			//For each orders
			for (var j = 0; j < props.orders.length; j++) {

				//Compare date
				if(monthdates[i].getTime() === props.orders[j].date.seconds*1000){
					
					orderFound = true; //Flag

					//If order is found, loop over all restaurants in the order, and find the
					//same restarant of the datasets obj

					//For each restaurants in the system
					for (var k = 0; k < datasets.length; k++) {
						
						var total = 0;
						
						//For each restaurants in the summary
						for (var z = 0; z < props.orders[j].restaurantSummary.length; z++) {

							//Compare restaurant id
							if(datasets[k].id === props.orders[j].restaurantSummary[z].id){
								//If restaurant found, get the total
								total = props.orders[j].restaurantSummary[z].total;
							}	
						}

						//Update datasets obj
						datasets[k].data.push(total);

						//If restaurant is not found, 0 is the total
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
                stacked: true
            }],
            yAxes: [{
                stacked: true
            }]
        }
    }

	return (
		<Container className="HistoricalChart">
		  <Row>	

		  	<Col md={12}>
		  		<Bar
				  data={data}
				  options={options}
				/>

			</Col>

		  </Row>
		</Container>
	);
}

export default HistoricalChart;

var getDaysArray = function(s,e) {for(var a=[],d=s;d<=e;d.setDate(d.getDate()+1)){ a.push(new Date(d));}return a;};
