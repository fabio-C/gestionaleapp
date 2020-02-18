import React, {Component} from 'react';

import OrdersNavigation from './OrdersNavigation/OrdersNavigation';
import OrdersView from './OrdersView/OrdersView';
import OrdersDetail from './OrdersDetail/OrdersDetail';

import axios from 'axios';

class Orders extends Component {


	constructor(props){
		super(props);
		this.state = {

			selectedDate: null, //The selected date

			order: null, //The complete order object
			orderid: null, //ID of the order

			//OrdersDetail state
			restaurant: null, //The selected restaurant object
			orderEdited: false, //true when change order details
			orderSaved: false, //true if order change has been saved
			printLoading: false, //print PDF loading state

			//OrderView state
			viewOrdersDetail: false, //false: show OrdersView, true: show OrdersDetail
			viewMode: 0, //0: show restaurant, //1: show products, //2: show summary

			//MODAL
			showModal: false,
			modalTitle: "",
			modalBody: ""
		} 
	}
		
	componentDidMount() {
		this.getOrderToday();
	}

	/*
		getOrderToday
		---------------------
	*/
	getOrderToday = () => {
		const d = new Date();
		
		d.setMinutes(0);
		d.setHours(0);
		d.setSeconds(0);
		d.setMilliseconds(0);

		this.setState({
			selectedDate: d
		});

		this.getOrderByDate(d);
	}


	/*
		getOrderByDate
		---------------------
	*/
	getOrderByDate = (date) => {

		//Remove hours, minutes, seconds
		date.setMinutes(0);
		date.setHours(0);
		date.setSeconds(0);
		date.setMilliseconds(0);

		//Get order details
		this.props.db.collection("orders").where("date", "==", date).limit(1).get().then(
			snapshot => {
				if (snapshot.empty) {
					console.log('Firestore Order Document Not Found');
					this.setState({
						orderid: null,
						order: null
					});
					return;
				} else {
					this.setState({
						orderid: snapshot.docs[0].id,
						order: snapshot.docs[0].data()
					});
				}
			});
	}

	//----------------------------------------------------------- events from OrdersNavigation
	/*
	 handleDateChange
	 -----------------------
	fired when user select a new date from date picker
	*/
	handleDateChange = date => {
		//Get the order
		this.getOrderByDate(date);

		//Change the state
		this.setState({
			selectedDate: date,
			viewOrdersDetail: false
		});
	};


	//------------------------------------------------------------ events from OrdersView
	
	/*
		setViewMode
	*/
	setViewMode = (mode) => {
		this.setState({
			viewMode: mode
		});
	}

	/*
		createEmptyOrder
	*/
	createEmptyOrder = () => {

		//Create firestore data obj
		let data = {
			date: this.state.selectedDate,
			restaurants: [] //initially empty
		}

		//Write object in firestore
		this.props.db.collection('orders').doc().set(data).then(ref => {
			//Refresh and show new empty order
			this.getOrderByDate(this.state.selectedDate);
		});
	}

	/*
		handleClickRestaurant
	*/
	handleClickRestaurant = (restaurantid, restaurantname) => {

		//Find the restaurant, from the order
		let selectedRestaurant = this.state.order.restaurants.find(r => r.id === restaurantid);

		//If the restaurant does't exist in the order, create an empty one
		if (!selectedRestaurant) {
			selectedRestaurant = {
				id: restaurantid,
				products: []
			}
		}
		
		this.setState({
			restaurant: selectedRestaurant,
			viewOrdersDetail: true
		});

		window.scrollTo(0,0);
	}

	/*
		handleClickDelete
	*/
	handleClickDelete = () => {
		this.props.db.collection('orders').doc(this.state.orderid).delete().then(() => {
			alert("Ordine Eliminato");
			this.getOrderByDate(this.state.selectedDate);
		});
	}


	//------------------------------------------------------------ events from OrdersDetail
	/*
		handleClickBack
	*/
	handleClickBack = () => {
		if ((this.state.orderEdited)&&(!this.state.orderSaved)) {
			this.setState({
				showModal: true,
				modalTitle: "Sei sicuro di uscire?",
				modalBody: "Alcune modifiche non sono state salvate."
			});
		} else {
			//Go back
			this.setState({
				viewOrdersDetail: false
			});
		}
	}

	/*
		handleClickEditProduct
	*/
	handleClickEditProduct = (productid, operation) => {

		//Copy the restaurant obj
		let r_copy = {...this.state.restaurant}; //Use slice to create a copy
		
		//Find the index of product in the restaurant object
		const index = r_copy.products.findIndex(function(p, index, array){
			return p.id === productid;
		});

		//If product exist
		if (index >= 0) {
			if (operation === "add") {
				r_copy.products[index].quantity = this.state.restaurant.products[index].quantity + 1;
			} else if (operation === "subtract") {
				//avoid negative numbers
				if(this.state.restaurant.products[index].quantity>1){
					r_copy.products[index].quantity = this.state.restaurant.products[index].quantity - 1;				
				} else if(this.state.restaurant.products[index].quantity===1){
					//If quantity reach 0, remove it
					r_copy.products.splice(index, 1);
				}
			}
		} else {
			//If product does not exist, push a new one
			r_copy.products.push({
				id: productid,
				quantity: 1
			});
		}

		this.setState({
			restaurant: r_copy,
			orderEdited: true
		});
	}

	/*
		handleClickSave
	*/
	handleClickSave = () => {

		//Create a copy of the order
		let newOrder = {...this.state.order}

		//Find the index of the restaurant edited
		let index = newOrder.restaurants.findIndex(r => r.id === this.state.restaurant.id);

		//If restaurant alredy exist
		if (index >= 0) {
			newOrder.restaurants[index] = this.state.restaurant
		} else {
			//If not exist push a new one
			newOrder.restaurants.push(this.state.restaurant)
		}

		//Write DOC to firestore
		this.props.db.collection('orders').doc(this.state.orderid).set(newOrder).then(ref => {
			
			alert("Dettagli Ordine Salvati.");
			
			this.setState({
				order: newOrder,
				orderSaved: true,
				orderEdited: false
			});			
		});
	}

	/*
		handleClickPrint
	*/
	handleClickPrint = () => {

		this.setState({
			printLoading: true
		});

		if (this.state.orderid && this.state.restaurant) {
			console.log("Print");
			axios.get('https://europe-west2-gestionalethecircle.cloudfunctions.net/createOrderPDF?orderid=' + this.state.orderid + '&restaurantid=' + this.state.restaurant.id)
	      	.then(res => {
	      		if (res.data.status === "ok") {
	      			window.open(res.data.url, '_blank').focus();
	      		} else {
	      			alert("Ops. Errore in fase di stampa. Contattare qualcuno bravo.")
	      		}

	      		this.setState({
					printLoading: false
				});
	        });	
		}
	}

	/*
		handleModalHide
	*/
	handleModalHide = () => {
		this.setState({
			showModal: false
		});
	}

	/*
		handleModalConfirm
	*/
	handleModalConfirm = () => {
		//Go back
		this.setState({
			viewOrdersDetail: false,
			restaurant: null,
			showModal: false,
			orderEdited: false
		});
	}

	//------------------------------------------------------------------- utility functions
	/*
		getRestaurantInfoFromId
	*/
	getRestaurantInfoFromId = (restaurantid) => {
		const info = this.props.appstate.restaurants.find(r => r.id === restaurantid);
		if (info) {
			return info
		} else {
			return {
				name: "RESTAURANT NOT FOUND"
			}
		}
	} 

	/*
		getProductInfoFromId
	*/
	getProductInfoFromId = (productid) => {
		const info = this.props.appstate.products.find(p => p.id === productid);
		if (info) {
			return info
		} else {
			return {
				name: "PRODUCT NOT FOUND"
			}
		}
	} 

	//------------------------------------------------------------------------------ render
	render(){
		return (
			<div className="Orders">

				<OrdersNavigation 
					selectedDate={this.state.selectedDate}
					handleDateChange={this.handleDateChange}/>

				{
					this.state.viewOrdersDetail?
					<OrdersDetail 
						restaurant={this.state.restaurant}
						products={this.props.appstate.products}
						orderEdited={this.state.orderEdited}
						printLoading={this.state.printLoading}

						showModal={this.state.showModal}
						modalBody={this.state.modalBody}
						modalTitle={this.state.modalTitle}

						handleClickSave={this.handleClickSave}
						handleClickBack={this.handleClickBack}
						handleClickEditProduct={this.handleClickEditProduct}
						handleClickPrint={this.handleClickPrint}
						handleModalHide={this.handleModalHide}
						handleModalConfirm={this.handleModalConfirm}
						getRestaurantInfoFromId={this.getRestaurantInfoFromId}
						getProductInfoFromId={this.getProductInfoFromId}
					/>
					: <OrdersView 
						order={this.state.order}
						restaurants={this.props.appstate.restaurants}
						products={this.props.appstate.products}
						viewMode={this.state.viewMode}

						setViewMode={this.setViewMode}
						handleClickNewOrder={this.createEmptyOrder}
						handleClickRestaurant={this.handleClickRestaurant}
						handleClickDelete={this.handleClickDelete}
						getRestaurantInfoFromId={this.getRestaurantInfoFromId}
						getProductInfoFromId={this.getProductInfoFromId}/>
				}
			</div>

			
		);
	}
}

export default Orders;