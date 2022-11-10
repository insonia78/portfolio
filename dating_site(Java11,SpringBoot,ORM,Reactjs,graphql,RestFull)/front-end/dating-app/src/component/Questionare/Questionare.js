import React , { useState } from 'react';
import { MDBFormInline, MDBInput, MDBBadge } from "mdbreact";
import {useLocation} from 'react-router-dom';
import {Nav,Navbar, Form, Button,FormControl,InputGroup} from 'react-bootstrap';
import { gql , useMutation, useQuery}  from '@apollo/client';
import { Redirect } from "react-router-dom";
import query from './../../graphql/query/query';
import  Upload  from './../../services/ServiceUploadFile'
import http from "./../../http-common";


const CREATE_CHARACTERISTICS = gql`
    mutation createCharacteristics(
    $email:String!,    
    $first_name: String!,
    $middle_name:String, 
    $last_name:String!,
    $gender:String!,
    $age:Int!,
    $hair_color:String,
    $eye_color:String,
    $height:String,
    $weight:String,
    $etnicity:String,
    $message:String){
    createCharacteristics(
    email:$email,    
    first_name:$first_name,
    middle_name:$middle_name, 
    last_name:$last_name,
    gender:$gender,
    age:$age,
    hair_color:$hair_color,
    eye_color:$eye_color,
    height:$height,
    weight:$weight,
    etnicity:$etnicity,
    message:$message){
        id
    }
    
    } 
`;
const UPDATE_CHARACTERISTICS = gql`
    mutation updateCharacteristics(
    $id:Int!,    
    $first_name: String!,
    $middle_name:String, 
    $last_name:String!,
    $gender:String!,
    $age:Int!,
    $hair_color:String,
    $eye_color:String,
    $height:String,
    $weight:String,
    $etnicity:String,
    $message:String){
    updateCharacteristics(
    id:$id,    
    first_name:$first_name,
    middle_name:$middle_name, 
    last_name:$last_name,
    gender:$gender,
    age:$age,
    hair_color:$hair_color,
    eye_color:$eye_color,
    height:$height,
    weight:$weight,
    etnicity:$etnicity,
    message:$message)
    {
        id
    }  
    } 
`;
const GET_CHARACTERISTCS = gql `
query findCharasteristics($email:String!){
    findCharasteristics(email:$email){
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




const Questionare  = () =>{    
    
   
    const { loading, error, data } = useQuery(GET_CHARACTERISTCS,{
        variables:{email: document.cookie },
       });           
    
    const [redirect, setRedirect ] = useState();         
    const [s, setState] = useState(1);
    const [ errors,setErrors ] = useState([]);
    const [ _data, setData ] =useState({
        email:document.cookie,
        id:0,
        first_name:"",
        middle_name:"",
        last_name:"",
        gender:"M",
        age:18,
        hair_color:"Brown",
        eye_color:"Black",
        height:"2.1",
        weight:"10.1",
        etnicity:"White",
        message:"",
    });
    const[photos, setPhoto] = useState({
     id:0,
     photos:[],
     characteristcs_id:0 
    });
    const [ image, setImage ] =useState([]);
    const options = [];
    const feet = [];
    const inches = [];
    const pounds = [];
    const onces = [];
    let htmlImage = [];
    let _error = [];
    let heightF = "2";
    let heightI ="1";
    let heightT ="";
    let isDataPresent = false;           
    const [createCharacteristics] = useMutation(CREATE_CHARACTERISTICS,{
        onError(err){
            alert(err);

      },
      update(proxy, result){
        setPhoto({...photos,id:result.data.updateCharacteristics.id});              
        if(photos.photos.length > 0)
        {
          let formData = new FormData();
          formData.append("id",photos.id);
          formData.append('photos',photos.photos[0]);
          formData.append("characteristcs_id",result.data.updateCharacteristics.id);
          
          http.post('/setPhotos',formData,{
            headers: {
                "Content-Type": "undefined",
              }

          }).then( response => {
              setRedirect('/members');
          }).catch( err => alert(err)); 
      }else{
          setRedirect('/members')
      }
    },variables:_data});
    const [updateCharacteristics] = useMutation(UPDATE_CHARACTERISTICS,{
        onError(err){
            alert(err);

      },
      update(proxy, result){
          console.log(result);
          console.log(result.data.updateCharacteristics.id);
          setPhoto({...photos,characteristcs_id:result.data.updateCharacteristics.id});              
          
          if(photos.photos.length > 0)
          {
            let formData = new FormData();
            formData.append("id",photos.id);
            formData.append('photos',photos.photos[0]);
            formData.append("characteristcs_id",result.data.updateCharacteristics.id);
            console.log(photos.characteristcs_id);
            http.post('/setPhotos',formData,{
              headers: {
                  "Content-Type": "undefined",
                }
  
            }).then( response => {
                console.log('response', response);
                setRedirect('/members');
            }).catch( err => alert(err)); 
        }else{
            console.log('response1');
            setRedirect('/members')
        }
         
      },

      variables:_data});
    if(!document.cookie) return null;  
    if (loading) return null;
    if (error && !document.cookie) { alert(error) ; return `Error! ${error}`}; 
       
const onHeight = (e)=>{
    
    if(e.target.name === 'height_feet')
          heightF = e.target.value;
    if(e.target.name === 'height_inches')
         heightI = e.target.value;       
    heightT = heightF +'.'+heightI;
    setData({..._data,height:heightT});    
     
}
let weightP = "10";
let weightO ="1";
let weightT ="";  
const onWeight = (e) =>{
    if(e.target.name === 'weight_pounds')
          weightP = e.target.value;
    if(e.target.name === 'weight_ounces')
         weightO = e.target.value;       
    weightT = weightP +'.'+ weightO;
    setData({..._data,weight:weightT});    

}      
let set = false;
const onSubmit = (e) =>{
    console.log()
    e.preventDefault();
    _error = [];
    console.log("data", data);
    if(_data.first_name === "")
        _error.push(<p style={{color:'red'}}>First Name is Required</p>);
    if(_data.last_name === "")
        _error.push(<p style={{color:'red'}}>Last Name is Required</p>);    
    if(_error.length >= 1)
       setErrors(_error);
    
    if(data !== undefined && !set)
    {  
       console.log(_data);      
       updateCharacteristics();
       
       set = true;
    }
    if(data === undefined && !set)
    {
        let values ={
        email:document.cookie,
        
        first_name:"",
        middle_name:"",
        last_name:"",
        gender:"M",
        age:18,
        hair_color:"Brown",
        eye_color:"Black",
        height:"2.1",
        weight:"10.1",
        etnicity:"White",
        message:"",}
      setData(values); 
      console.log("_data",_data); 
      createCharacteristics();
      set = true;
    }     
}
let incomingdata;
let heightData;
let weightData;


const setIncomingData = (d) =>{
     if(data === undefined)
        return;
     isDataPresent = true;   
     incomingdata = d.findCharasteristics;
     if(_data.first_name ==''){
         setData(() =>{return incomingdata});

     }
     
}     

  const onChange = (e)=>{             
          setData({..._data,[e.target.name]:e.target.value});  
  }

    for (let i = 18; i <= 100; i++) {
        
        options.push(<option value={i}>{i}</option>);
    }
    for (let i = 2; i <= 10; i++) {
        
        feet.push(<option value={i}>{i}</option>);
    }
    for (let i = 1; i <= 11; i++) {
        
        inches.push(<option value={i}>{i}</option>);
    }
    for (let i = 1; i <= 16; i++) {
        
        onces.push(<option value={i}>{i}</option>);
    }
    for (let i = 100; i <= 300; i++) {
        
        pounds.push(<option value={i}>{i}</option>);
    }
    const handleChange = e => {
        
        let array = [];
        htmlImage = [];
        setPhoto({...photos,photos:[...e.target.files]});
        htmlImage.push(...image);
        for(let i = 0 ; i < e.target.files.length; i++)
        {
              console.log("target",e.target.files,"=",e.target.files[i]);
              htmlImage.push(<img src = {URL.createObjectURL(e.target.files[i])}  style={{width:"80px", height:"80px"}} />)  
        }
        setImage(htmlImage);
      };
    
    
      (data && setIncomingData(data))
    
              
    return (
        
        <form  onSubmit={onSubmit}>
         {  redirect && <Redirect to={redirect} /> }
           <input name='id' type ="number" defaultValue={( isDataPresent ? incomingdata.id : 0)} hidden />            
           <br />            
           <div className="row justify-content-start">
                <InputGroup className="col-4">
                   <InputGroup.Prepend>
                       <InputGroup.Text id="inputGroup-sizing-default">First Name</InputGroup.Text>
                   </InputGroup.Prepend>
                 <FormControl
                 name='first_name'
                 defaultValue={( isDataPresent ? incomingdata.first_name : '')}
                 onChange={onChange}
                 aria-label="Default"
                 aria-describedby="inputGroup-sizing-default"
                 /> 
                </InputGroup>
                
                <InputGroup className="col-4">
                   <InputGroup.Prepend>
                       <InputGroup.Text id="inputGroup-sizing-default">Middle Name</InputGroup.Text>
                   </InputGroup.Prepend>
                 <FormControl
                 name='middle_name'
                 defaultValue={( isDataPresent ? incomingdata.middle_name: '')}
                 onChange={onChange}
                 aria-label="Default"
                 aria-describedby="inputGroup-sizing-default"
                 /> 
                </InputGroup>
                <InputGroup className="col-4">
                   <InputGroup.Prepend>
                       <InputGroup.Text id="inputGroup-sizing-default">Last Name</InputGroup.Text>
                   </InputGroup.Prepend>
                 <FormControl
                 name='last_name'
                 defaultValue={( isDataPresent ? incomingdata.last_name : "")}
                 onChange={onChange}
                 aria-label="Default"
                 aria-describedby="inputGroup-sizing-default"
                 /> 
                </InputGroup>
            </div>
            <hr />
            <br/> 
            <div className="row justify-content-start">
                <div className="col-4">
                <h2>Gender</h2>
                </div>
                <MDBFormInline>
                    <MDBInput  name='gender' value='M' onChange={onChange} onClick={() => setState(1)} checked={s===1 ? true : false} label='Man' type="radio"
                        id="radio1" containerClass='mr-5'/>
                    <MDBInput onClick={() => setState(2)} checked={s ===2 ? true : false} label="Woman" type="radio"
                        name='gender' value='F' onChange={onChange} id="radio2" containerClass='mr-5'/>      
                </MDBFormInline>
            </div>
            <br/>
            <div className="row justify-content-start">
                <div className="col-4">
                <h2>Age</h2>
                </div>
                <div className="col-2">
                    <select name = "age" defaultValue={ ( isDataPresent ? incomingdata.age: 18 )} onChange={onChange}  className="browser-default custom-select">
                        {options}
                    </select>
                </div>
            </div>
            <br/>
            <div className="row justify-content-start">
                <div className="col-4">
                <h2>Hair Color</h2>
                </div>
                <div className="col-2">            
                    <select name="hair_color" defaultValue={( isDataPresent ? incomingdata.hair_color : 'Brown')} onChange={onChange} className="browser-default custom-select">
                        <option>Brown</option>
                        <option>Black</option>
                        <option>White</option>
                        <option>Sandy</option>
                        <option>Gray or Partially Gray</option>
                        <option>Red</option>
                        <option>Blond</option>
                        <option>Blue</option>
                        <option>Green</option>
                        <option>Orange</option>
                        <option>Pink</option>
                        <option>Purple</option>
                        <option>Bald</option>
                        <option>Other</option>
                    </select>
                </div>
            </div>
            <br />
            <div className="row justify-content-start">
                <div className="col-4">
                <h2>Eye Color</h2>
                </div>
                <div className="col-2">
                    <select name="eye_color" defaultValue={( isDataPresent ? incomingdata.eye_color: 'Black')} onChange={onChange} className="browser-default custom-select">
                        <option>Black</option>
                        <option>Blue</option>
                        <option>Brown</option>
                        <option>Gray</option>
                        <option>Green</option>
                        <option>Hazel</option>
                        <option>Maroon</option>
                        <option>Pink</option>
                        <option>Multicolored</option>
                        <option>Other</option>
                    </select>
                </div>
            </div>
            <br />
            <div className="row justify-content-start">
                <div className='col'>
                <h2>Height</h2>
                </div>
                <div className='col-4'>
                    <div className="row">
                        <div name="height_feet"  onChange={onHeight} className='col-4'>
                            <select defaultValue={ ( isDataPresent ? incomingdata.height.split('.')[0] : '2' )} className="browser-default custom-select">                            
                                { feet }
                            </select>
                        </div>
                        <div className ='col-2'>
                            <h1>'</h1>
                        </div>                
                    </div>
                </div>    
                <div className='col-4'>
                    <div className="row">
                        <div className='col-4'>
                            <select name="height_inches" defaultValue={ (isDataPresent ? incomingdata.height.split('.')[1] : '1')} onChange={onChange} className="browser-default custom-select">                            
                                { inches }
                            </select>
                        </div>
                        <div className ='col-2'>
                            <h1>"</h1>
                        </div>                
                    </div>
                </div>    
            </div>
            <br />
            <div className="row justify-content-start">
                <div className='col'>
                <h2>Weight</h2>
                </div>
                <div className='col-4'>
                    <div className="row">
                        <div className='col-4'>
                            <select name="weight_pounds" defaultValue={ (isDataPresent ? incomingdata.weight.split('.')[0]: '10') } onChange={onWeight} className="browser-default custom-select">                            
                                { pounds }
                            </select>
                        </div>
                        <div className ='col-2'>
                            <h1>'</h1>
                        </div>                
                    </div>
                </div>    
                <div className='col-4'>
                    <div className="row">
                        <div className='col-4'>
                            <select name="weight_onces" defaultValue={ (isDataPresent ? incomingdata.weight.split('.')[1]: '1') } onChange={onWeight} className="browser-default custom-select">                            
                                { onces }
                            </select>
                        </div>
                        <div className ='col-2'>
                            <h1>"</h1>
                        </div>                
                    </div>
                </div>    
            </div>
            <br />
            <div className="row justify-content-start">
                <div className="col-4">
                <h2>Etnicithy</h2>
                </div>
                <div className="col-2">
                    <select name="etnicity" defaultValue={( isDataPresent ? incomingdata.etnicity:'White') } onChange={onChange} className="browser-default custom-select">
                        <option label="White">White</option>                            
                        <option label="Mixed or Multiple ethnic groups">Mixed or Multiple ethnic groups</option>
                        <option label="Asian">Asian</option>
                        <option label="Black">Black</option>                            
                        <option label="Other ethnic groups">Other ethnic groups</option>                      
                    
                    </select>
                </div>
            </div>
            <br />
            <div className="row justify-content-start">
            <div className="col">
                <h1>Message</h1>
                <Form.Control name="message" defaultValue={(isDataPresent ? incomingdata.message: '') } onChange={onChange} as="textarea" rows="3" />
            </div>            
            </div>
            <br />
            <div className="row justify-content-start">
            <div className="col">
                <input type="file" multiple onChange={ (event) => handleChange(event)} />
            </div>          
        </div>
        <br />
        <div className="row justify-content-start">
            <div className="grid">
            {incomingdata?.photos.map(element => <img src={element.photos_path}  style={{width:"80px", height:"80px"}} /> )}        
            </div> 
        </div>
        {/* <img src ={new FileReader().readAsDataURL(image) }  style={{width:"80px", height:"80px"}} /> */}
        { errors }         
            <div className="row justify-content-start">
                <div className="col">
                <Button type="submit" variant="primary">Next {' >>'}</Button>
                </div>   
            </div>           
            <br />
        <br />      
        </form>
       
        
       
     
)};
export default Questionare;

