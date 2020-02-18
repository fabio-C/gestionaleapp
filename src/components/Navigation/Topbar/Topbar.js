import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {Nav, Navbar} from 'react-bootstrap';

//Images
import logo from '../../../assets/images/logo.png';

//Style
import './Topbar.css';

/*
	Topbar
	This component render:
		- Desktop navigation topbar
		- Logo
		- Burger Button (toggle the MobileMenu)
*/

const topbar = ( props ) => {

	return(
		<header className="Topbar">

			<Navbar expand="lg">
				
				<Link to="/">
					<img src={logo} alt="the circle logo"/>  
				</Link>

				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ml-auto">
						<NavLink className="nav-link" to="/" exact activeClassName="active">Ordini</NavLink>
						<NavLink className="nav-link" to="/historical" exact activeClassName="active">Dati</NavLink>
						<NavLink className="nav-link" to="/restaurants" exact activeClassName="active">Ristoranti</NavLink>
						<NavLink className="nav-link" to="/products" exact activeClassName="active">Prodotti</NavLink>
					</Nav>
				</Navbar.Collapse>
			</Navbar>

		</header>
	);
}

export default topbar;