import React, {Component} from 'react';

import RestaurantsSummary from './RestaurantsSummary/RestaurantsSummary';
import RestaurantsDetail from './RestaurantsDetail/RestaurantsDetail';

class Restaurants extends Component {

	constructor(props){
		super(props);
		this.state = {
			//RestaurantDetail component
			restaurant: null, //the selected restaurant object
			restaurantEdited: false, //true if restaraunt data has been changed

			//RENDER FLAG
			viewRestaurantsDetail: false, //false: show RestaurantsSummary, true: show RestaurantsDetail
			detailsSaved: false,

			//MODAL
			showModal: false,
			modalTitle: "",
			modalBody: ""
		}
	}

	componentDidMount() {
		//this.restartList();
	}


	//-------------------------------------------------------------------------------

	/*
		restartList
		-----------------
		Utility function, for rewrite restaurants list manually.
	*/
	/*
	restartList = () => {
		const restaurantNames = ["Il Pagliaccio", "Zia", "Vyta", "Belvedere", "Magnolia Eventi", "Forme Osteria", "Banco", "Bir and food", "Angelina Testaccio", "Caronte", "Il giglio", "Cacciani", "Mezzo", "Luciano Cucina Italiana", "Barred", "Vyta2", "Matiere", "Palmerie", "Claudio Carfagna", "Amedeo", "Acquolina", "Roscioli", "Antico Arco", "Ginger1", "Ginger2", "Pesciolino", "Jacopa", "Hotel Valadier", "Antica fonderia", "Livello1",  "Proloco trastevere", "Pane e tempesta", "Creta Osteria", "Barbieri 23", "Taverna Angelica", "Angelina2", "Seu pizzeria", "Archivolto", "Bunker", "PianoStrada", "Sciccherie", "Emme", "Drink Kong", "Dalu", "Caffè Marziali 22", "All’oro", "Glass", "Paca"];

		let data = {
			all: restaurantNames.map(function(name){
				return(
					{
						id: makeid(8),
						name: name,
						iva: "",
						address: "",
						invoiceto:""
					}
				)
			})
		}

		this.props.db.collection('lists').doc("restaurants").set(data).then(() => {
			console.log("Restaurant Restart");
		});
	} 
	*/

	//---------------------------------------------------- events from RestaurantsSummary

	/*
		handleClickRestaurant
		---------------------
		Click in a single restaurant box
	*/
	handleClickRestaurant = (restaurantid) => {

		//Retrieve the restaurant object from the array, using id
		const r = this.props.appstate.restaurants.find(element => {
			return (element.id === restaurantid)
		});

		this.setState({
			restaurant: r,
			viewRestaurantsDetail: true
		});
	}

	/*
		handleClickNewRestaurant
		---------------------
		Click in new restaurant
	*/
	handleClickNewRestaurant = () => {

		const r = {
			name: "",
			id: makeid(8),
			invoiceto: "",
			address: "",
			iva: ""
		};

		this.setState({
			restaurant: r,
			viewRestaurantsDetail: true
		});
	}


	//------------------------------------------------------ events from RestaurantsDetail

	/*
		handleClickBack
		-----------------
		Click on back button
	*/
	handleClickBack = () => {

		//Check if display modal
		if (this.state.restaurantEdited && (!this.state.detailsSaved)) {
			this.setState({
				showModal: true,
				modalTitle: "Sei sicuro di uscire?",
				modalBody: "Alcune modifiche non sono state salvate."
			});
		} else {
			this.setState({
				restaurant: null,
				viewRestaurantsDetail: false
			});	
		}
	}

	/*
		handleChangeRestaurant
		----------------------
		Fired when input data change
	*/
	handleChangeRestaurant = (e) => {
		
		//Copy the restaurant obj
		let r_copy = {...this.state.restaurant };

		//change the parameter
		r_copy[e.target.id] = e.target.value;
		
		//update the state
		this.setState({
			restaurant: r_copy,
			restaurantEdited: true
		});
	}

	/*
		handleClickSave
		-----------------
		Click on save button
	*/
	handleClickSave = () => {

		if (this.state.restaurant.name) {
			//create a copy of all restaurants
			let r_copy = this.props.appstate.restaurants.slice();

			//find the index from the id
			let index = this.props.appstate.restaurants.findIndex(element => {
				return(element.id === this.state.restaurant.id)
			});

			//If restaurant is alredy in array (editing a restaurant)
			if (index > -1) {
				r_copy[index] = this.state.restaurant;

				const data = {
					all: r_copy
				}

				this.props.db.collection('lists').doc("restaurants").set(data).then(() => {
					alert("Modifiche Salvate");
					this.setState({
						viewRestaurantsDetail: false,
						restaurant: null,
						detailsSaved: true
					});
					this.props.getAllRestaurants();
				});
			} else {

				//Add the new restaurant to array
				r_copy.push(this.state.restaurant);

				const data = {
					all: r_copy
				}

				this.props.db.collection('lists').doc("restaurants").set(data).then(() => {
					alert("Modifiche Salvate");
					this.setState({
						viewRestaurantsDetail: false,
						restaurant: null,
						detailsSaved: true
					});

					this.props.getAllRestaurants();
				});
			}
		} else {
			alert("Inserisci un nome al Ristorante");
		}
	}

	/*
		handleClickDelete
		-----------------
		Click on delete button
	*/
	handleClickDelete = () => {

		//create a copy of all restaurants
		let r_copy = this.props.appstate.restaurants.slice();

		//find the index from the id
		let index = this.props.appstate.restaurants.findIndex(element => {
			return(element.id === this.state.restaurant.id)
		});

		//If restaurant is alredy in array
		if (index > -1) {

			r_copy.splice(index, 1);

			const data = {
				all: r_copy
			}

			this.props.db.collection('lists').doc("restaurants").set(data).then(() => {
				
				alert("Ristorante Eliminato");
				
				this.setState({
					viewRestaurantsDetail: false,
					restaurant: null,
					detailsSaved: true
				});

				this.props.getAllRestaurants();
			});
		} else {
			alert("Il Ristorante non è ancora stato creato.");
		}
	}

	/*
		handleModalHide
		-----------------
		Fired when modal close
	*/
	handleModalHide = () => {
		this.setState({
			showModal: false
		});
	}

	/*
		handleModalConfirm
		------------------
		Click on modal confirm button
	*/
	handleModalConfirm = () => {
		//Go back
		this.setState({
			viewRestaurantsDetail: false,
			restaurant: null,
			showModal: false
		});
	}


	//--------------------------------------------------------------------------render

	render(){
		return (
			<div className="Restaurants">
				{this.state.viewRestaurantsDetail?
					<RestaurantsDetail 
						restaurant={this.state.restaurant}
						showModal={this.state.showModal}
						modalTitle={this.state.modalTitle}
						modalBody={this.state.modalBody}
						restaurantEdited={this.state.restaurantEdited}
						handleClickBack={this.handleClickBack}
						handleClickSave={this.handleClickSave}
						handleChangeRestaurant={this.handleChangeRestaurant}

						handleModalHide={this.handleModalHide}
						handleModalConfirm={this.handleModalConfirm}
						handleClickDelete={this.handleClickDelete}/>
					:
					<RestaurantsSummary 
						restaurants={this.props.appstate.restaurants}
						handleClickRestaurant={this.handleClickRestaurant}
						handleClickNewRestaurant={this.handleClickNewRestaurant}/>
				}
					
			</div>
		);
	}
}

export default Restaurants;


function makeid(length) {
	 var result           = '';
	 var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	 var charactersLength = characters.length;
	 for ( var i = 0; i < length; i++ ) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
	 }
	 return result;
}