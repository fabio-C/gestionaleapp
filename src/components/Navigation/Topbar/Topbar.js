import React from 'react';
import { NavLink, Link } from 'react-router-dom';

//Images
import burgerimg from '../../../assets/images/burger.png';

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
                    LOGO
                </Link>
            </div>

            <button className="Burger" onClick={props.mobileMenuToggleClicked}> 
                <img src={burgerimg} alt="DipendenteSuper Menu"/> 
            </button>

            <nav>
                <NavLink to="/" exact activeClassName="active">Ordini</NavLink>
                <NavLink to="/historical" exact activeClassName="active">Storici</NavLink>
                <NavLink to="/restaurants" exact activeClassName="active">Ristoranti</NavLink>
                <NavLink to="/products" exact activeClassName="active">Prodotti</NavLink>
            </nav>

        </header>
    );
}

export default topbar;