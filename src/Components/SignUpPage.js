import React, { useState } from "react";
import axios from "axios";
import './signup.css';
import {useNavigate} from "react-router-dom";

function SignUpPage(){
    const history = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Define confirmPassword state
    async function submit(e) {
        e.preventDefault();
    
        if (password !== confirmPassword) {
            alert("Password and Confirm Password do not match");
            return;
        }
    
        try {
            await axios.post("http://localhost:8000/signup", {
                name, email, password
            })
            .then(res => {
                if (res.data === "exist") {
                    alert("User already exists");
                } else if (res.data === "success") {
                    history("/Login", { state: { id: email } });
                }
            })
            .catch(e => {
                alert("Error: " + e.message);
                console.error(e);
            });
        } catch (e) {
            console.error(e);
            alert("Error: " + e.message);
        }
    }

    return(
        <div className="sub">
            <div className="container">
                <div className='col-md-4'>
                    <h4>Sign Up</h4>
                    <form action="POST">
                        <div className="form-group mt-3">
                            <label>Name :</label>
                            <input type="email" className="form-control"
                            style={{width:"250px"}}
                            onChange={(e) => { setName(e.target.value) }}
                            required></input>
                        </div>
                        <div className="form-group mt-3">
                            <label>Email :</label>
                            <input type="email" className="form-control"
                            style={{width:"250px"}}
                            onChange={(e) => { setEmail(e.target.value) }}
                            required></input>
                        </div>
                        <div className="form-group mt-3">
                            <label>Password :</label>
                            <input type="password" className="form-control"
                            style={{width:"250px"}}
                            onChange={(e) => { setPassword(e.target.value) }}
                            required></input>
                        </div>
                        <div className="form-group">
                            <label>Confirm Password :</label>
                            <input
                                type="password"  className="form-control"
                                style={{width:"250px"}}
                                onChange={(e) => { setConfirmPassword(e.target.value) }} // Update confirmPassword state
                                required></input>
                        </div>
                    
                        <div className='mt-3'>
                            <button type="submit" style={{borderRadius:"5px"}} onClick={submit}>Sign Up</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage;