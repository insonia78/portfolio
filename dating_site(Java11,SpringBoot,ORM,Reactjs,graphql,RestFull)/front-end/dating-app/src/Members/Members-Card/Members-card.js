import React from 'react';
import {Card , Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';



const MembersCard = (props) =>(
    
    <Card style={{ width: '18rem' }} className = {props.clas} key = {props.index}>
        {console.log("id",props.id)}
        <Card.Img variant="top" src={props.image} />
        <Card.Body>
            <Card.Title>{props.firstName}</Card.Title>
            <Card.Title>{props.lastName}</Card.Title>
            
            <Button  style={{color:"white"}} variant="primary"><Link to={{pathname:"/membersProfile",state:{id:props.id}}}>Go somewhere</Link></Button>
        </Card.Body>
    </Card>

);
export default MembersCard;

