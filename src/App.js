import React, {Component} from 'react';
import { Route, Switch } from 'react-router-dom';

//Firebase
import firebase from 'firebase/app';
import 'firebase/firestore';
import './App.css';

//Import Components:
import Topbar from './components/Navigation/Topbar/Topbar';

import Orders from './components/Orders/Orders';
import Products from './components/Products/Products';
import Restaurants from './components/Restaurants/Restaurants';
import Historical from './components/Historical/Historical';

//Firebase initialization
firebase.initializeApp({
  apiKey: "AIzaSyCxDyO3c17hC11wkQe4EnloxiCKnvMXXvg",
  authDomain: "gestionalethecircle.firebaseapp.com",
  databaseURL: "https://gestionalethecircle.firebaseio.com",
  projectId: "gestionalethecircle",
  storageBucket: "gestionalethecircle.appspot.com",
  messagingSenderId: "188464761382",
  appId: "1:188464761382:web:0a49bb28037eab4b0b34e7"
});

//Firebase obj
var db = firebase.firestore();

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      showMobileMenu: false,
    }
  }

  componentDidMount() {

  }

  /* 
    mobileMenuClosedHandler
    ----------------------------------
    Handle click on close menu
  */
  mobileMenuClosedHandler = () => {
    this.setState({ 
      showMobileMenu: false 
    });
  }

  /* 
    mobileMenuToggleHandler
    ----------------------------------
    Handle click on toggle menu (burger button)
  */
  mobileMenuToggleHandler = () => {
    this.setState( ( prevState ) => {
      return { showMobileMenu: !prevState.showMobileMenu };
    });
  }
  
  render(){
    return (
      <div className="App">

        <Topbar />

        <main>
          <Switch>
              <Route path="/" exact render={(props) => <Orders {...props} appstate={this.state} db={db}/>} />
              <Route path="/products" exact render={(props) => <Products {...props} appstate={this.state} db={db}/>} />
              <Route path="/restaurants" exact render={(props) => <Restaurants {...props} appstate={this.state} db={db}/>} />
              <Route path="/historical" exact render={(props) => <Historical {...props} appstate={this.state} db={db}/>} />
            </Switch>
        </main>
        
      </div>
    );
  }

}

export default App;