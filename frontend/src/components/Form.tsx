import React, { useState,ChangeEvent, useRef, useEffect } from "react";
import eyeLock from 'assets/eye_icon.png'
import PasswordValidation from "./PasswordValidation";
import { verifyEmail } from "utils/emailController";
import { postData } from "utils/signupController";
import { useNavigate } from "react-router-dom";


type FormState = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    checkbox: boolean;
  }

const Form = () => {
     const navigate = useNavigate()
    const toggleRef = useRef<HTMLInputElement>(null);
    const toggleRef2 = useRef<HTMLInputElement>(null);
    const [ log,setLog ] = useState(false);
    const [ regexLog,setRegexLog ] = useState(false);
    const [ message,setMessage]= useState('');
    const [ signUpLoader,setSignUpLoader] = useState(false);
    const [ errorColor,setErrorColor] = useState(false);
    const [ emailLoader,setEmailLoader ]= useState(false);
    const [ emailLog,setEmailLog]= useState(false);
    const [ emailColor,setEmailColor]= useState(false);
    const [ apiResponse,setApiResponse]= useState(false);
    const [ lowerValidated,setLowerValidated]=useState(false);
    const [ upperValidated,setUpperValidated]=useState(false);
    const [ numberValidated,setNumberValidated]= useState(false);
    const [ lengthValidated,setLengthValidated]= useState(false);
    const [ passwordColor,setPasswordColor]= useState(false);


    const [formState, setFormState] = useState<FormState>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        checkbox: false,
      });
    
      const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
       
        setFormState({
          ...formState,
          [e.target.name]: e.target.value,
        });
      };
    
      const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLog(false)
        setFormState({
          ...formState,
          checkbox: e.target.checked,
        });
      };

      const handlePasswordCheck=()=>{
          setRegexLog(false)
          setLog(true);
           if(!validatePassword){
            setErrorColor(true)
            setMessage('Passwords mismatch!')
           }else{
            setErrorColor(false)
            setMessage('Passwords match!')
           }
      }

      // Check the database to verify email onblur of input
      const handleVerifyEmail=async()=>{
        setEmailLoader(true)
         const apiResponse =  await verifyEmail(formState.email)
         console.log(apiResponse)
         if(apiResponse === 'Email valid'){
              setApiResponse(true)
              setEmailColor(false)
              setEmailLog(false)
            }else{
              setEmailColor(true)
              setEmailLog(true)
              setApiResponse(false)
        }
        setEmailLoader(false)
      }

      // check if Password Matches
      const validatePassword = formState.password === formState.confirmPassword;

       // Check if the password passes the regex matches
    const isMatched =lowerValidated && upperValidated && 
                      numberValidated && lengthValidated;

    // update confirm password input state based on password regex passes
    useEffect(()=>{
       if(!formState.password){
        return;
       }
       if(isMatched){
        setPasswordColor(false)
     }else{
       setPasswordColor(true)
     }
    },[isMatched,formState.password])

      const handleRegexCheck=()=>{
        setRegexLog(true);
        const lower = new RegExp('(?=.*[a-z])');
        const upper = new RegExp('(?=.*[A-Z])');
        const number = new RegExp('(?=.*[0-9])');
        const length = new RegExp('(?=.{8,})');

        // lowercase validation
        if( lower.test(formState.password)){
              setLowerValidated(true)
        }else{
             setLowerValidated(false)
        }

        // uppercase validation
        if(upper.test(formState.password)){
          setUpperValidated(true)
        }else{
          setUpperValidated(false)
        }

        // number validation
        if(number.test(formState.password)){
          setNumberValidated(true)
        }else{
          setNumberValidated(false)
        }

         // length validation
         if(length.test(formState.password)){
          setLengthValidated(true)
        }else{
          setLengthValidated(false)
        }

      }

      const togglePassword=()=>{
          const checked =  toggleRef.current ;
          if(checked.type === 'password'){
            checked.type='text';
          }else{
            checked.type='password';
          }
      }

      const togglePassword2=()=>{
        const checked =  toggleRef2.current ;
        if(checked.type === 'password'){
          checked.type='text';
        }else{
          checked.type='password';
        }
    }

    // Handle submission for form
     const handleSubmit=async(e:React.FormEvent)=>{
      e.preventDefault()
      setSignUpLoader(true)
      const formData = {  firstName:formState.firstName,
                          lastName:formState.lastName,
                          email:formState.email,
                          password:formState.password}
      
       const apiResponse =  await postData(formData)
       console.log(apiResponse)
       navigate('/congrats-screen')
     }

    // Check if all Form Input have been filled
    const isCompleted =  apiResponse && isMatched && formState.firstName && formState.lastName &&
                        formState.email && formState.password && 
                        formState.confirmPassword && formState.checkbox;
      console.log(formState);
      console.log("isCompleted:", isCompleted)

    
  return (
       <>
              
         <form autoComplete="off"  onSubmit={handleSubmit}>
            <label htmlFor="firstName">First name</label>
            <br />
            <input
              type="text"
              value={formState.firstName}
              onChange={handleInputChange}
              name="firstName"
              id="firstName"
              required
            />
            <br />

            <label htmlFor="lastName">Last name</label>
            <br />
            <input
              type="text"
              value={formState.lastName}
              onChange={handleInputChange}
              name="lastName"
              id="lastName"
              required
            />
            <br />

            <label htmlFor="email">
              Email address{' '}
              <span className="email">(ex. jeanine@bootcampr.io)</span>
            </label>
            <br />
              <div className="email-wrapper">
            <input
              type="email"
              autoComplete="new-password"
              className={ emailColor ? 'input-invalid':''}
              value={formState.email}
              onChange={handleInputChange}
              onBlur={handleVerifyEmail}
              name="email"
              id="email"
              required
            />
           { emailLoader && <div className="loader"></div>}
           {emailLog && <small className="not-validated">Email already exists!</small> }
              </div>

            <label htmlFor="password">
               Password </label>
            <br />
            <div className="password-wrapper">
            <input
              type="password"
              ref={toggleRef}
              value={formState.password}
              onChange={handleInputChange}
              onKeyUp={handleRegexCheck}
              name="password"
              id="password"
              required
            />
              <img  onClick={togglePassword} className='eyeLock' src={eyeLock} alt="eye" />
              {regexLog &&(
                <PasswordValidation upperValidated={upperValidated} lowerValidated={lowerValidated} numberValidated={numberValidated} lengthValidated={lengthValidated}/>
            )}
            </div>

            <label htmlFor="confirmPassword">Re-enter password</label>
            <br />
            <div className="password-wrapper">
            <input
               disabled={!isMatched}
               className={passwordColor ? 'input-invalid':''}
              type="password"
              ref={toggleRef2}
              value={formState.confirmPassword}
              onChange={handleInputChange}
              onKeyUp={handlePasswordCheck}
              name="confirmPassword"
              id="confirmPassword"
              required
            />
              <img onClick={togglePassword2} className='eyeLock' src={eyeLock} alt="eye" />
           { log && <small style={{color:errorColor?'red' :' #23A6A1'}}>{message}</small>}
            </div>

            <div className="checkbox-group">
              <input
                disabled={!validatePassword}
                type="checkbox"
                checked={formState.checkbox}
                onChange={handleCheckboxChange}
                name="checkbox"
                className="checkbox"
                id="checkbox"
                required
              />
              <span className="checkbox-text">
                I agree to receive email notification(s). We will only send
                emails with important information, like project start dates. We
                will not sell your information!
              </span>
            </div>
            <button type="submit"
             style={{ pointerEvents: isCompleted ? 'auto' : 'none',
                     backgroundColor: isCompleted ?   '#FA9413' : '',
                     cursor:isCompleted ?'pointer':'auto',
                    transition:"all ease-in-out 300ms"
                     }}>
                      {signUpLoader ? ( <div className="loader-two"></div>):"Sign up"}
            </button>

          </form>
       </>
  )
}

export default Form ;
