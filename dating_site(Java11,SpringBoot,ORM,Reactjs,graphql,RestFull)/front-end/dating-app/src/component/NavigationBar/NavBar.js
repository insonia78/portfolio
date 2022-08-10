import React from 'react';
import {Nav,Navbar, Form, Button,FormControl} from 'react-bootstrap'
import './NavBar.css';
import { NavLink } from 'react-router-dom';
const navbar = () =>{
    return (
    <>        
    <Navbar bg="primary" variant="dark">
        <Navbar.Brand >Super Cool Dating Site</Navbar.Brand>
        <Nav className="mr-auto">
        <ul className="navlink-container">
            <li className="navlink-button"><NavLink exact = {true} to="/" activeClassName="is-active" style={{color: "white"}}>Home</NavLink></li>
            <li className="navlink-button"><NavLink to="/login"  exact = {true} activeClassName="is-active" style={{color: "white"}}>Login</NavLink></li>
            <li className="navlink-button"><NavLink to="/registration" exact ={true} activeClassName="is-active" style={{color: "white"}}>Register</NavLink></li>
            <li className="navlink-button"><NavLink to="/questionare" exact ={true} activeClassName="is-active" style={{color: "white"}}>Questionare</NavLink></li>
            <li className="navlink-button"><NavLink to="/members" exact ={true} activeClassName="is-active" style={{color: "white"}}>Members</NavLink></li>        
        </ul>
        </Nav>
        <Form inline>
        
        </Form>
    </Navbar>    
    </>
  );
}
export default navbar;

