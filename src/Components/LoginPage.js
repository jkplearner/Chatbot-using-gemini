import React, { useState } from "react";
import axios from "axios";
import './signup.css';
import { useNavigate} from "react-router-dom";

function LoginPage() {
    const history = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function submit(e) {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8000/", { email, password });
            const data = response.data;

            if (response.data.status === "exist") {
                const userName = response.data.name; // Get the user's name from the response data
                console.log("User name:", userName);
                history("/bot", { state: { id: email, name: userName } });
            } else if (data === "notexist") {
                alert("User has not signed up or incorrect credentials");
            } else if (data === "incorrect") {
                alert("Incorrect password or username");
            }
        } catch (e) {
            alert("Wrong details");
            console.log(e);
        }
    }

    return (
        <div className="sub">
            <div className="container">
                <div className='col-md-4'>
                    <h4>Sign In</h4>
                    <form action="POST">
                        <div className="form-group mt-3">
                            <label>Email :</label>
                            <input type="email" className="form-control"
                                style={{ width: "250px" }}
                                onChange={(e) => { setEmail(e.target.value) }} placeholder="Email"
                                required></input>
                        </div>
                        <div className="form-group">
                            <label>Password :</label>
                            <input
                                type="password" className="form-control"
                                style={{ width: "250px" }}
                                onChange={(e) => { setPassword(e.target.value) }}
                                required></input>
                        </div>

                        <div className='mt-3'>
                            <button type="submit" style={{ borderRadius: "5px" }} onClick={submit}>Sign In</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;