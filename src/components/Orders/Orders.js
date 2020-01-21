import React, {Component} from 'react';

import OrdersNavigation from './OrdersNavigation/OrdersNavigation';
import OrdersSummary from './OrdersSummary/OrdersSummary';
import OrdersDetail from './OrdersDetail/OrdersDetail';

class Orders extends Component {

	constructor(props){
		super(props);
		this.state = {

			order: null, //The complete order obj
			orderid: null, //ID of the order

			startDate: null, //Initial date is today

			//OrdersDetail state
			restaurant: null,
			restaurantid: null,
			orderEdited: false, //true when change order details
			orderSaved: false, //true if order change has been saved

			//RENDER FLAG
			viewOrdersDetail: false, //false: show OrdersSummary, true: show OrdersDetail
			modeRestaurant: true, //if true shows restaurant, else shows products

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
			startDate: d
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
			startDate: date
		});
	};


	//------------------------------------------------------------ events from OrdersSummary
	

	setModeRestaurant = (mode) => {
		this.setState({
			modeRestaurant: mode
		});
	}
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
					restaurantid: restaurantid,
					viewOrdersDetail: true
				});
			}
		});
	}

	/*
		handleClickDelete
	*/
	handleClickDelete = () => {
		this.props.db.collection('orders').doc(this.state.orderid).delete().then(() => {
			alert("Ordine Eliminato");
			this.getOrderByDate(this.state.startDate);
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
				viewOrdersDetail: false,
				restaurant: null
			});
		}
	}

	handleClickEditProduct = (productid, operation) => {

		//Copy the obj
		let r_copy = {...this.state.restaurant}; //Use slice to create a copy
		
		//Find the index of products array
		const index = r_copy.products.findIndex(function(element, index, array){
			return element.id === productid;
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
			restaurant: r_copy,
			orderEdited: true
		});
	}

	handleClickSave = () => {
		//Write DOC to firestore
		this.props.db.collection('orders').doc(this.state.orderid).collection("restaurants").doc(this.state.restaurantid).set(this.state.restaurant).then(ref => {
			
			alert("Dettagli Ordine Salvati.");
			
			//Call this function recorsivly...
			this.setState({
				orderSaved: true,
				orderEdited: false,
				viewOrdersDetail: false,
				restaurant: null
			});

			//Refresh and show new empty order
			this.getOrderByDate(this.state.startDate);

			/*
			setTimeout((){ 

			}, 1000);
			*/
		});
	}

	handleModalHide = () => {
		this.setState({
			showModal: false
		});
	}

	handleModalConfirm = () => {
		//Go back
		this.setState({
			viewOrdersDetail: false,
			restaurant: null,
			showModal: false,
			orderEdited: false
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
						orderEdited={this.state.orderEdited}
						handleClickSave={this.handleClickSave}
						handleClickBack={this.handleClickBack}
						handleClickEditProduct={this.handleClickEditProduct}

						showModal={this.state.showModal}
						modalBody={this.state.modalBody}
						modalTitle={this.state.modalTitle}
						handleModalHide={this.handleModalHide}
						handleModalConfirm={this.handleModalConfirm}
						/>
					: <OrdersSummary 
						order={this.state.order}
						modeRestaurant={this.state.modeRestaurant}
						setModeRestaurant={this.setModeRestaurant}
						handleClickNewOrder={this.createEmptyOrder}
						handleClickRestaurant={this.handleClickRestaurant}
						handleClickDelete={this.handleClickDelete}/>
				}
			</div>

			
		);
	}
}

export default Orders;
