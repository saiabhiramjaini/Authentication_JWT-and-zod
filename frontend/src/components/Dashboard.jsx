import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function DashBoard() {
    const [error, setError] = useState(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");


    axios.defaults.withCredentials = true;
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5001/profile');
                setEmail(response.data.email);
                setUsername(response.data.username);
            } catch (error) {
                console.error('Error fetching profile data:', error);
                // Check if the error response is 401 (Unauthorized)
                if (error.response && error.response.status === 401) {
                    setError('Unauthorized access or token expired. Please login again.');
                } else {
                    setError('Error fetching profile data. Please try again later.');
                }
            }
        };

        fetchData();
    }, []);

    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5001/logout');
            navigate('/');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <>
            <h1>Welcome to Dashboard</h1>
            {error === "Unauthorized access or token expired. Please login again." ? (
                <p>{error}</p>
            ) : (
                <>
                    {/* Render profile data here */}
                    <p>{email}</p>
                    <p>{username}</p>
                    <button onClick={handleLogout}>Logout</button>
                </>
            )}
        </>
    );
    
}

export default DashBoard;
