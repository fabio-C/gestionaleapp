import React from 'react';
import { NavLink, Link } from 'react-router-dom';

//Images
import burgerimg from '../../../assets/images/burger.png';
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
            
            <div className="Logo">
                <Link to="/">
                    <img src={logo} alt="the circle logo"/>
                </Link>
            </div>

            <button className="Burger" onClick={props.mobileMenuToggleClicked}> 
                <img src={burgerimg} alt="DipendenteSuper Menu"/> 
            </button>

            <nav>
                <NavLink to="/" exact activeClassName="active">Ordini</NavLink>
                <NavLink to="/historical" exact activeClassName="active">Storici</NavLink>
            </nav>

        </header>
    );
}

export default topbar;