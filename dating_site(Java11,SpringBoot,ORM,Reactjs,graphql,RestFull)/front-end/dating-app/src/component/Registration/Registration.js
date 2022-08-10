import React, { useState } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBIcon, MDBModalFooter } from 'mdbreact';
import './../Login/Login.css';
import { gql , useMutation}  from '@apollo/client';
import { Redirect } from "react-router-dom";
const Registration = () => {
  
  let error = [];
  const [redirect, setRedirect ] = useState();
  
  const [ errors,setErrors ] = useState([]);
  const [value, setValue] = useState({
    email:"",
    confirmEmail:"",
    password:"",
    confirmPassword:""
  });
  
   const onChange = (e) =>{
     setValue({...value,[e.target.name]:e.target.value});
   }
   const [addUser,{loading}]=useMutation(REGISTER_USER,{
    update(proxy, result){
      console.log(result);
      document.cookie = result.data.registerMember.email;
      setRedirect('/questionare');
    },
    onError(err){
          alert(err);
    },
      
    variables:value
  });
  const onSubmit = (e) =>{
    e.preventDefault();
    error = [];
    if(value.email === "")
    {       
       error.push(<p style={{color:"red"}}>Email must not be empty</p>)
       setErrors(error);
       
    }
    if(value.password === "")
    {      
      error.push(<p style={{color:"red"}}>Password must not be empty</p>)
      setErrors(error);
    
   }
    if(value.email !== value.confirmEmail )
    {
       error.push(<p style={{color:"red"}}>Emails don't match</p>)
       setErrors(error); 
    }
    if(value.password !== value.confirmPassword)
    {
       error.push(<p style={{color:"red"}}>Password don't match</p>)
       setErrors(error); 
    }
    console.log(value);
    if(error.length >= 1)
        return;
    else   
       addUser();
  }
  
  return (
    <form onSubmit={onSubmit}>
    <MDBContainer className="MDBContainer-container">
      <MDBRow>
        <MDBCol md="6">
          <MDBCard>
            <MDBCardBody className="mx-4">
              <div className="text-center">
                <h3 className="dark-grey-text mb-5">
                  <strong>Register</strong>
                </h3>
              </div>
              <MDBInput
                name="email"
                label="Your email"
                group
                type="email"
                validate
                value={ value.email }
                onChange={onChange}
                error="wrong"
                success="right"
              />
              <MDBInput
                name="confirmEmail"
                label="Confirm Your email"
                group
                value ={ value.confirmEmail}
                onChange={onChange}
                type="email"
                validate
                error="wrong"
                success="right"
              />
              <MDBInput
                label="Your password"
                name="password"
                group
                onChange={onChange}
                type="password"
                validate
                containerClass="mb-0"
              />
              <MDBInput
                label="Confirm Your password"
                name="confirmPassword"
                group
                onChange={onChange}
                type="password"
                validate
                containerClass="mb-0"
              />              
              <div className="text-center mb-3">
                <MDBBtn                
                  type="submit"
                  gradient="blue"
                  rounded                  
                  className="btn-block z-depth-1a"
                >
                  Register
                </MDBBtn>
              </div>               
            </MDBCardBody>            
          </MDBCard>
        </MDBCol>
      </MDBRow>      
    </MDBContainer>
    { errors }
    { redirect && <Redirect to={redirect} />}
    </form>
  );
};

const REGISTER_USER = gql`
  mutation registerMember($email:String!,$confirmEmail:String!,$password:String!,$confirmPassword:String!){
    registerMember(email:$email,confirmEmail:$confirmEmail,password:$password,confirmPassword:$confirmPassword){
       email
    }
  }`;
export default Registration;