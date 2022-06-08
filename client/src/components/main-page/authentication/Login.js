import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
    const [user, setUser] = useState({
        email: "", 
        password: ""
    });

    const onChangeInput = (event) => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: value });
    };

    const loginSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('/user/login', { ...user });
            localStorage.setItem('firstLogin', true);
            window.location.href = "/";
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-page">
                <div className="login-box">
                    <form onSubmit={ loginSubmit }>
                        <h2>Healthy First</h2>
                        <input type="email" name="email" required
                        placeholder="Email" value={ user.email } onChange={ onChangeInput } />
                        <input type="password" name="password" required autoComplete="on"
                        placeholder="Password" value={ user.password } onChange={ onChangeInput } />
                        <button type="submit">Đăng nhập</button>
                        <p className="sign-up">
                            Chưa có tài khoản? 
                            <Link to="/register"> Đăng ký</Link>
                        </p> 
                    </form>
                </div>
            </div>
        </div>
    );
}
