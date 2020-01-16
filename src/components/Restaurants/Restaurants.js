import React, {Component} from 'react';

import RestaurantsSummary from './RestaurantsSummary/RestaurantsSummary';
import RestaurantsDetail from './RestaurantsDetail/RestaurantsDetail';

class Restaurants extends Component {

	constructor(props){
		super(props);
		this.state = {
      restaurants: null, //list of all restaurants

      //RENDER FLAG
      viewRestaurantsDetail: false, //false: show RestaurantsSummary, true: show RestaurantsDetail

		}
	}

  componentDidMount() {
    this.getAllRestaurants();
  }


	getAllRestaurants = () => {
    //Get order details
    this.props.db.collection("lists").doc("restaurants").get().then(doc => {

      let restaurants = doc.data().all;

      //Sort alphabetically
      restaurants.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      });

      this.setState({
        restaurants: restaurants
      })
    });
  }


  /*  
	createUpdateRestaurantsList = () => {

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

	    db.collection('lists').doc("restaurants").set(data);
	  }
	 */

  	render(){
    	return (
	      	<div className="Restaurants">
            {this.state.viewRestaurantsDetail?
              <RestaurantsDetail />
              :
              <RestaurantsSummary 
              restaurants={this.state.restaurants}/>
            }
		        
		    </div>
    	);
  	}
}

export default Restaurants;