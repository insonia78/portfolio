import React, { useState} from 'react';
import {Card , Button,ButtonGroup, Tabs, Tab } from 'react-bootstrap';
import { gql ,useQuery}  from '@apollo/client';
import {useLocation} from 'react-router-dom';
const GET_CHARACTERISTCS = gql `
query findCharasteristic($id:Int){
    findCharasteristic(id:$id){
    id   
    first_name
    middle_name 
    last_name
    gender
    age
    hair_color
    eye_color
    height
    weight
    etnicity
    message
    photos{
       id
       photo_path
    }
    
   }
}`;


const MemberProfile = (props) =>{
  
    const { state } = useLocation();
    
    console.log("state",state);
    const [key, setKey] = useState('home');
    const { loading, error, data } = useQuery(GET_CHARACTERISTCS,{variables:state});
      
    if(!state) return null;
    if (loading) return null;
    if (error) return `Error! ${error}`;
    
return (
   
   <div class="row justify-content-start">
     <div class="col-4">
     <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" src={data.findCharasteristic.photos[0]?.photo_path} />
        <Card.Body>
        <Card.Title>{data.findCharasteristic.first_name}</Card.Title>
        <Card.Title>{data.findCharasteristic.middle_name} </Card.Title>
        <Card.Title>{data.findCharasteristic.last_name} </Card.Title>
        <Card.Subtitle>{data.findCharasteristic.age}</Card.Subtitle>
           <Card.Text>
            {data.findCharasteristic.message}
            </Card.Text>
            <ButtonGroup aria-label="Basic example">
               <Button variant="primary">Like</Button>
               <Button variant="secondary">Message</Button>  
            </ButtonGroup>            
        </Card.Body>
    </Card>
     </div>
     <div className="col-8">
     <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
    >
      <Tab eventKey="home" title="Home">
     {data.findCharasteristic.etnicity}
      </Tab>
      <Tab eventKey="profile" title="Profile">
        two
      </Tab>
      <Tab eventKey="contact" title="Contact" >
        three
      </Tab>
    </Tabs>
     </div>
 </div>
 
)};

export default MemberProfile;