import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ResetPassword() {
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [cPassword, setCpassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5001/reset-password/${token}`, { password, cPassword });
            alert(response.data.msg);
            if (response.data.msg === "password updated") {
                navigate('/signin');
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <h1>ResetPassword</h1>
            <label> Password </label>
            <br />
            <input type="password" onChange={(e) => setPassword(e.target.value)} />
            <br /><br />
            <label> Confirm Password </label>
            <br />
            <input type="password" onChange={(e) => setCpassword(e.target.value)} />
            <br /><br />
            <button onClick={handleSubmit}>ResetPassword</button>
        </>
    )
}

export default ResetPassword;