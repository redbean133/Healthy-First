import React, { useContext } from 'react';
import { GlobalState } from '../../GlobalState';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Header() {
    const state = useContext(GlobalState);
    const [isLogged] = state.UserAPI.isLogged;
    const [isManager] = state.UserAPI.isManager;

    const logoutUser = async () => {
        await axios.get('/user/logout')
        localStorage.removeItem('firstLogin')
        window.location.href = "/";
    };

    const adminRouter = () => {
        return(
            <>
                <li><Link to="/expert">Chuyên viên</Link></li>
            </>
        )
    };

    const loggedRouter = () => {
        return(
            <>
                <li className="login-logout"><a href="/" onClick={logoutUser}>Đăng xuất</a></li>
            </>
        )
    };

    const expertRouter = () => {
        return(
            <>
                <li><Link to="/facility">Cơ sở</Link></li>
                <li><Link to="/certificate">Giấy chứng nhận</Link></li>
                <li><Link to="/inspect-activity">Thanh tra</Link></li>
                <li><Link to="/sample">Mẫu thực phẩm</Link></li>
            </>
        )
    };

    return (
        <header>
            <div id="header">
                <ul id="navigation">
                    { isManager ? adminRouter() : <></> }
                    { isLogged ? expertRouter() : <></> }
                    { isLogged ? loggedRouter() : <li className="login-logout"><a href="/login">Đăng nhập | Đăng ký</a></li> }
                </ul>
            </div>
        </header>
    );
}

export default Header;
