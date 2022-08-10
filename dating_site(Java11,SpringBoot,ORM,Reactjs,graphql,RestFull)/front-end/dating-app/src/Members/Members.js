import React, { useState } from 'react';
import MembersCard from './Members-Card/Members-card';
import './Members.css';
import { gql ,useQuery}  from '@apollo/client';

const GET_ALL_CHARACTERISTCS = gql `
query findAllCharasteristics{
   findAllCharacteristics{
    id   
    first_name
    middle_name 
    last_name
   
    photos{
       id
       photo_path
    }
    
   }
}`;

const Members = () =>{
   const [ card , setCard] = useState([]);
   const membersCard = [];
   const { loading, error, data } = useQuery(GET_ALL_CHARACTERISTCS);  
   if (loading) return null;
   if (error) return `Error! ${error}`;

return (
        <div className='card-grid'>             
         { console.log(data)}
         {  
          
            (data && data.findAllCharacteristics.map((e, index) => 
             <MembersCard 
               clas="box"
               id = {e.id} 
               image = { (e.photos.length > 0 ? e.photos[0].photo_path : "") }  
               firstName={ e.first_name } 
               lastName={ e.last_name } 
               index={index} 
               />   
            ))
                          
         }
        </div>
    
);
}
export default Members;