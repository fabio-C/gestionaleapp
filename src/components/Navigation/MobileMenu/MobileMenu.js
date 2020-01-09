import React from 'react';
import { NavLink, Link } from 'react-router-dom';

import Auxiliary from '../../../hoc/Auxiliary/Auxiliary';

//Sub Components
import Backdrop from '../../../UI/Backdrop/Backdrop';

//Style
import './MobileMenu.css';

/*
    MobileMenu
    This component render the side mobile menu
*/
const mobileMenu = ( props ) => {
    let attachedClasses = ["MobileMenu", "Close"];
    if (props.open) {
        attachedClasses = ["MobileMenu", "Open"];
    }

    return (
        
        <Auxiliary>
            
            <Backdrop show={props.open} clicked={props.closed}/>

            <div className={attachedClasses.join(' ')}>
                <div className="Logo">
                    LOGO
                </div>
                <nav>
                    <NavLink 
                        to="/" 
                        exact 
                        activeClassName="active"
                        onClick={props.closed}>Ordini</NavLink>
                    <NavLink 
                        to="/historical" 
                        exact 
                        activeClassName="active"
                        onClick={props.closed}>Storici</NavLink>
                    <NavLink 
                        to="/restaurants" 
                        exact 
                        activeClassName="active"
                        onClick={props.closed}>Ristoranti</NavLink>
                    <NavLink 
                        to="/products" 
                        exact 
                        activeClassName="active"
                        onClick={props.closed}>Prodotti</NavLink>
                </nav>

            </div>
        </Auxiliary>
    );
};

export default mobileMenu;