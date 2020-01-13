import React, {Component} from 'react';

import OrdersNavigation from './OrdersNavigation/OrdersNavigation';
import OrdersSummary from './OrdersSummary/OrdersSummary';
import OrdersDetail from './OrdersDetail/OrdersDetail';

class Orders extends Component {

	constructor(props){
		super(props);
		this.state = {

			order: null,
			orderid: null,

			restaurant: null, //Used by OrdersDetail

			startDate: new Date(), //Initial date is today

			//RENDER FLAG
			viewOrdersDetail: false //false: show OrdersSummary, true: show OrdersDetail
		} 
	}
		
	componentDidMount() {
		this.getOrderByDate(this.state.startDate);
	}


	/*
		getOrderByDate
		---------------------
	*/
	getOrderByDate = (date) => {
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

	//----------------------------------------------------------- actions from OrdersNavigation
	/*
	 handleDateChange
	 -----------------------
	fired when user select a new date from date picker
	*/
	handleDateChange = date => {

		//Remove hours, minutes, seconds
		date.setMinutes(0);
		date.setHours(0);
		date.setSeconds(0);

		//Get the order
		this.getOrderByDate(date);

		//Change the state
		this.setState({
			startDate: date
		});
	};


	//------------------------------------------------------------ actions from OrdersSummary
	
	/*
		createEmptyOrder
	*/
	createEmptyOrder = () => {
		let products = null;
		let restaurants = null;
		//Get all product:
		this.props.db.collection("lists").doc("products").get().then(products_doc => {
			products = products_doc.data().all;
			//Get all restaurants
			this.props.db.collection("lists").doc("restaurants").get().then(restaurants_doc => {
				restaurants = restaurants_doc.data().all;

				if (products&&restaurants) {

					//Sort alphabetically
					products.sort(function(a, b){
						if(a.name < b.name) { return -1; }
						if(a.name > b.name) { return 1; }
						return 0;
					});

					//Sort alphabetically
					restaurants.sort(function(a, b){
						if(a.name < b.name) { return -1; }
						if(a.name > b.name) { return 1; }
						return 0;
					});

					//Create firestore data obj
					let data = {
						date: this.state.startDate,
						restaurantSummary: restaurants.map(function(r){
							return(
								{
									id: r.id,
									name: r.name,
									total: 0
								}
							)
						}),
						productSummary: products.map(function(p){
							return(
								{
									id: p.id,
									name: p.name,
									price: p.price,
									sub:p.sub,
									total: 0
								}
							)
						})
					}

					//Write object in firestore
					this.props.db.collection('orders').doc().set(data).then(ref => {
						console.log('Added orderd document');

						//Refresh and show new empty order
						this.getOrderByDate(this.state.startDate);
					});
				}

			});

		});
	}

	/*
		handleClickRestaurant
	*/
	handleClickRestaurant = (restaurantid, restaurantname) => {

		//Get order details
		this.props.db.collection("orders").doc(this.state.orderid).collection("restaurants").doc(restaurantid).get().then( doc => {
			
			//Check if DOC exist
			if (!doc.exists) {
				//If restaurant document not exist, create one:
				console.log('Restaurant details DOC not found. Creating one:');

				//Get list of all products
				let products = null;
				this.props.db.collection("lists").doc("products").get().then(products_doc => {
					
					products = products_doc.data().all;
					
					//Sort list alphabetically
					products.sort(function(a, b){
						if(a.name < b.name) { return -1; }
						if(a.name > b.name) { return 1; }
						return 0;
					});

					//Create firestore object
					let data = {
						name: restaurantname,
						products: products.map(function(p){
							return(
								{
									id: p.id,
									name: p.name,
									price: p.price,
									sub:p.sub,
									quantity: 0
								}
							)
						})
					}

					//Write DOC to firestore
					this.props.db.collection('orders').doc(this.state.orderid).collection("restaurants").doc(restaurantid).set(data).then(ref => {
						console.log("New DOC inserted.");

						//Call this function recorsivly...
						this.handleClickRestaurant(restaurantid, restaurantname);

					});
				});
			} else {

				this.setState({
					restaurant: doc.data(),
					viewOrdersDetail: true
				});
			}
		});
	}


	//------------------------------------------------------------ actions from OrdersDetail
	/*
		handleClickBack
	*/
	handleClickBack = () => {
		//delete restaurant obj ? 
		this.setState({
			viewOrdersDetail: false,
			restaurant: null
		});
	}

	handleClickEditProduct = (productid, operation) => {

		//Copy the obj
		let r_copy = {...this.state.restaurant}; //Use slice to create a copy
		
		//Find the index of products array
		const index = r_copy.products.findIndex(function(element, index, array){
			return element.id == productid;
		});
	
		if (operation === "add") {
			r_copy.products[index].quantity = this.state.restaurant.products[index].quantity + 1;
		} else if (operation === "subtract") {
			//avoid negative numbers
			if(this.state.restaurant.products[index].quantity>0){
				r_copy.products[index].quantity = this.state.restaurant.products[index].quantity - 1;				
			}
		}

		this.setState({
			restaurant: r_copy
		});
	}


	//------------------------------------------------------------------------------ render
	render(){
		return (
			<div className="Orders">

				<OrdersNavigation 
					startDate={this.state.startDate}
					handleDateChange={this.handleDateChange}/>

				{
					this.state.viewOrdersDetail?
					<OrdersDetail 
						restaurant={this.state.restaurant}
						handleClickBack={this.handleClickBack}
						handleClickEditProduct={this.handleClickEditProduct}/>
					: <OrdersSummary 
						order={this.state.order}
						handleClickNewOrder={this.createEmptyOrder}
						handleClickRestaurant={this.handleClickRestaurant}/>
				}
								
			</div>
		);
	}
}

export default Orders;
