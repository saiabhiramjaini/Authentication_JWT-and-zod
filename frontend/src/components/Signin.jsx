import React, {useState} from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function Signin(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;
    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            const response = await axios.post('http://localhost:5001/signin', {email, password})
            alert(response.data.msg);
            if(response.data.msg == "Signin successful"){
                navigate('/dashboard')
            }
        }catch(e){
            console.log(e);
        }   
    }

    return(
        <>
        <h1>Signin</h1>
        <label> Email </label>
        <br />
        <input type="email" onChange={(e)=>setEmail(e.target.value)}/>
        <br /><br />
        <label> Password </label>
        <br />
        <input type="password" onChange={(e)=>setPassword(e.target.value)}/>
        <br /><br />
        <button onClick={handleSubmit}>Signin</button>
        <br />
        <a href="/forgotPassword">forgot password?</a>
        <br />
        <a href="/signup">Don't have an account?</a>
        </>
    )
}

export default Signin;