import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

export default function Register() {
    const [user, setUser] = useState({
        name: '', 
        email: '', 
        password: '',
        retypePassword: '',
        phoneNumber: '',
        gender: '',
        dateOfBirth: '',
        identityCardNumber: ''
    });

    const onChangeInput = e => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const registerSubmit = async e => {
        e.preventDefault();
        console.log(user);
        try {
            await axios.post('/user/register', { ...user });
            localStorage.setItem('firstLogin', true);
            window.location.href = "/";
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-page register-page">
                <img src="../../../../assets/img/bean-icon.png" alt="" />
                <div className="login-box register-box">
                    <form onSubmit={registerSubmit}>
                        <h2>Tạo tài khoản</h2>
                        <input type="name" name="name" required
                        placeholder="Họ và tên" value={user.name} onChange={onChangeInput} />

                        <input type="email" name="email" required
                        placeholder="Email" value={user.email} onChange={onChangeInput} />

                        <input type="password" name="password" required autoComplete="on"
                        placeholder="Mật khẩu" value={user.password} onChange={onChangeInput} />

                        <input type="password" name="retypePassword" required
                        placeholder="Nhập lại mật khẩu" value={user.retypePassword} onChange={onChangeInput} />

                        <input type="tel" name="phoneNumber" required
                        placeholder="Số điện thoại" value={user.phoneNumber} onChange={onChangeInput} />

                        <input class="radio" type="radio" name="gender" required value="Nam" onChange={onChangeInput} />Nam
                        <input class="radio" type="radio" name="gender" required value="Nữ" onChange={onChangeInput} />Nữ

                        <input type="date" name="dateOfBirth" required
                        value={user.dateOfBirth} onChange={onChangeInput} />

                        <input type="text" name="identityCardNumber" required
                        placeholder="Mã thẻ căn cước" value={user.identityCardNumber} onChange={onChangeInput} />

                        <button type="submit">Đăng ký</button>
                        <p className="sign-up">
                            Đã có tài khoản? 
                            <Link to="/login"> Đăng nhập</Link>
                        </p> 
                    </form>
                </div>
            </div>
        </div>
    )
}