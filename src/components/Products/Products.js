import React, {Component} from 'react';

import ProductsSummary from './ProductsSummary/ProductsSummary';
import ProductsDetail from './ProductsDetail/ProductsDetail';

class Products extends Component {

	constructor(props){
		super(props);
		this.state = {
			products: null, //list of all products

			//ProductsDetail component
			product: null, //the selected product object
			productEdited: false, //true if restaraunt data has been changed

			//RENDER FLAG
			viewProductsDetail: false, //false: show ProductsSummary, true: show ProductsDetail
			detailsSaved: false,

			//MODAL
			showModal: false,
			modalTitle: "",
			modalBody: ""
		}
	}

	componentDidMount() {
		this.getAllProducts();
	}

	getAllProducts = () => {
		//Get order details
		this.props.db.collection("lists").doc("products").get().then(doc => {
			
			let products = doc.data().all;

			//Sort alphabetically
			products.sort(function(a, b){
				if(a.name < b.name) { return -1; }
				if(a.name > b.name) { return 1; }
				return 0;
			});

			this.setState({
				products: products
			});
		});
	}

	/*
	
	createUpdateProductList = () => {

		const productNames = ["Centocchio", "Coriandolo", "Erba Cipollina", "Elicriso", "Finocchietto", "Timo limone", "Timo", "Santoreggia", "Melissa", "Menta Hierba Buena", "Prezzemolo light", "Origano", "Artemisia assenzio", "Basella Rubra", "Pimpinella", "Levistico",  "Acetosella", "Oyster leafes", "Insalata Baby", "Mizuna green", "Mizuna red", "Komatzuna", "Senape rossa", "Bietolina rossa e gialla", "Tatsoi", "Baby rucola", "Acetosa", "Mix Baby leafes", "Mix Baby Leafes + Aromatiche", "Crescione", "Ravanello Rosso"];

		let data = {
			all: productNames.map(function(name){
				return(
					{
						id: makeid(8),
						name: name,
						price: 0,
						sub: 0
					}
				)
			})
		}

	db.collection('lists').doc("products").set(data);
	}
	*/



	//---------------------------------------------------- events from ProductsSummary
	/*
		handleClickProduct
		---------------------
		Click in a single restaurant box
	*/
	handleClickProduct = (productid) => {

		//Retrieve the product object from the array, using id
		const p = this.state.products.find(element => {
			return (element.id === productid)
		});

		this.setState({
			product: p,
			viewProductsDetail: true
		});
	}

	/*
		handleClickNewProduct
		---------------------
		Click in new restaurant
	*/
	handleClickNewProduct = () => {

		const p = {
			name: "",
			id: makeid(8),
			price: 0,
			sub: 0
		};

		this.setState({
			product: p,
			viewProductsDetail: true
		});
	}

	//------------------------------------------------------ events from ProductsDetail

	/*
		handleClickBack
		-----------------
		Click on back button
	*/
	handleClickBack = () => {

		//Check if display modal
		if (this.state.productEdited && (!this.state.detailsSaved)) {
			this.setState({
				showModal: true,
				modalTitle: "Sei sicuro di uscire?",
				modalBody: "Alcune modifiche non sono state salvate."
			});
		} else {
			this.setState({
				product: null,
				viewProductsDetail: false
			});	

		}
	}

	/*
		handleChangeProduct
		----------------------
		Fired when input data change
	*/
	handleChangeProduct = (e) => {
		
		//Copy the product obj
		let p_copy = {...this.state.product };

		if (e.target.id === "price") {
			//change the parameter
			p_copy[e.target.id] = parseFloat(e.target.value);
		} else {
			//change the parameter
			p_copy[e.target.id] = e.target.value;
		}
		
		
		//update the state
		this.setState({
			product: p_copy,
			productEdited: true
		});
	}

	/*
		handleClickSave
		-----------------
		Click on save button
	*/
	handleClickSave = () => {

		//create a copy of all restaurants
		let p_copy = this.state.products.slice();

		//find the index from the id
		let index = this.state.products.findIndex(element => {
			return(element.id === this.state.product.id)
		});

		//If restaurant is alredy in array (editing a restaurant)
		if (index > -1) {
			p_copy[index] = this.state.product;

			const data = {
				all: p_copy
			}

			console.log(data);


			this.props.db.collection('lists').doc("products").set(data).then(() => {
				alert("Modifiche Salvate");
				this.setState({
					viewProductsDetail: false,
					product: null,
					detailsSaved: true
				});
				this.getAllProducts();
			});
		} else {

			//Add the new restaurant to array
			p_copy.push(this.state.product);

			const data = {
				all: p_copy
			}


			this.props.db.collection('lists').doc("products").set(data).then(() => {
				alert("Modifiche Salvate");
				this.setState({
					viewProductsDetail: false,
					product: null,
					detailsSaved: true
				});

				this.getAllProducts();
			});

		
		}
	}


	/*
		handleClickDelete
		-----------------
		Click on delete button
	*/
	handleClickDelete = () => {

		//create a copy of all restaurants
		let p_copy = this.state.products.slice();

		//find the index from the id
		let index = this.state.products.findIndex(element => {
			return(element.id === this.state.product.id)
		});

		//If restaurant is alredy in array
		if (index > -1) {

			p_copy.splice(index, 1);

			const data = {
				all: p_copy
			}

			this.props.db.collection('lists').doc("products").set(data).then(() => {
				
				alert("Prodotto Eliminato");
				
				this.setState({
					viewProductsDetail: false,
					product: null,
					detailsSaved: true
				});

				this.getAllProducts();
			});
		} else {
			alert("Il prodotto non è ancora stato creato.");
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
			viewProductsDetail: false,
			product: null,
			showModal: false
		});
	}

	render(){

		return (
				<div className="Products">
					{this.state.viewProductsDetail?
						<ProductsDetail 
							product={this.state.product}
							showModal={this.state.showModal}
							modalTitle={this.state.modalTitle}
							modalBody={this.state.modalBody}
							productEdited={this.state.productEdited}
							handleClickBack={this.handleClickBack}
							handleClickSave={this.handleClickSave}
							handleChangeProduct={this.handleChangeProduct}

							handleModalHide={this.handleModalHide}
							handleModalConfirm={this.handleModalConfirm}
							handleClickDelete={this.handleClickDelete}/>
						:
						<ProductsSummary 
							products={this.state.products}
							handleClickProduct={this.handleClickProduct}
							handleClickNewProduct={this.handleClickNewProduct}/>
					}
				</div>
		);
	}

}

export default Products;

function makeid(length) {
	 var result           = '';
	 var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	 var charactersLength = characters.length;
	 for ( var i = 0; i < length; i++ ) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
	 }
	 return result;
}