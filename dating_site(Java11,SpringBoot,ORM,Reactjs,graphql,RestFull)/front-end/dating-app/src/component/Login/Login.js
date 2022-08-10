import React,{ useState } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBIcon, MDBModalFooter } from 'mdbreact';
import { Link } from 'react-router-dom';
import './Login.css';
import { gql , useMutation}  from '@apollo/client';
import { Redirect } from "react-router-dom";

const VALIDATE_USER = gql`
  mutation validateMember($email:String!,$password:String!){
    validateMember(email:$email,password:$password){
       email
    }
  }`;


const Login = () => {
  let location = "";
  let error = [];
  const [redirect, setRedirect ] = useState();
      
  const [value, setValue] = useState({
    email:"",    
    password:""    
  });
  const [ errors,setErrors ] = useState([]);
  
  const onChange = (e) =>{
    setValue({...value,[e.target.name]:e.target.value});
  }
  const [validateUser,{loading}]=useMutation(VALIDATE_USER,{
   update(proxy, result){     
    console.log(result); 
    document.cookie = result.data.validateMember.email;
     
     setRedirect('/members');
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
   if(error.length >= 1)
       return;
   else   
      validateUser();
 }

  
  return (
    <form onSubmit={onSubmit}>
    <MDBContainer className="MDBContainer-container">
    { errors }
    {
    (redirect && <Redirect  to={redirect} />) }
      <MDBRow>
        <MDBCol md="6">
          <MDBCard>
            <MDBCardBody className="mx-4">
              <div className="text-center">
                <h3 className="dark-grey-text mb-5">
                  <strong>Sign in</strong>
                </h3>
              </div>
              <MDBInput
                name="email"
                label="Your email"
                group
                type="email"
                validate
                validate
                value={ value.email }
                onChange={onChange}
                error="wrong"
                success="right"
              />
              <MDBInput
                label="Your password"
                name="password"
                group
                onChange={onChange}
                group
                type="password"
                validate
                containerClass="mb-0"
              />
              <p className="font-small blue-text d-flex justify-content-end pb-3">
                Forgot
                <a href="#!" className="blue-text ml-1">

                  Password?
                </a>
              </p>
              <div className="text-center mb-3">
                <MDBBtn
                  type="submit"
                  gradient="blue"
                  rounded
                  className="btn-block z-depth-1a"
                >
                  Sign in
                </MDBBtn>
              </div>
              <p className="font-small dark-grey-text text-right d-flex justify-content-center mb-3 pt-2">

                or Sign in with:
              </p>
               <div className="row my-3 d-flex justify-content-center">
                {/*<MDBBtn
                  type="button"
                  color="white"
                  rounded
                  className="mr-md-3 z-depth-1a"
                >
                  <MDBIcon fab icon="facebook-f" className="blue-text text-center" />
                </MDBBtn>
                <MDBBtn
                  type="button"
                  color="white"
                  rounded
                  className="mr-md-3 z-depth-1a"
                >
                  <MDBIcon fab icon="twitter" className="blue-text" />
                </MDBBtn> */}
                <a href="http://localhost:8080"><MDBBtn
                  type="button"
                  color="white"
                  rounded
                  className="z-depth-1a"
                >
                  <MDBIcon fab icon="google-plus-g" className="blue-text" />
                </MDBBtn></a>
              </div>
            </MDBCardBody>
            <MDBModalFooter className="mx-5 pt-3 mb-1">
              <p className="font-small grey-text d-flex justify-content-end">
                Not a member?
                <Link to="/registration" className="blue-text ml-1">Sign Up</Link>
              </p>
            </MDBModalFooter>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
    </form>
  );
};

export default Login;