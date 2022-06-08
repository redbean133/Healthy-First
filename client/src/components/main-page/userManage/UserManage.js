import React, {useContext, useState, useEffect} from 'react';
import { GlobalState } from '../../../GlobalState';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import Filters from './Filters';
import BeforeAfterPage from './BeforeAfterPage';

function UserManage() {
    const state = useContext(GlobalState);
    const [token] = state.token;
    const [users, setUsers] = useState([]);
    const [callback, setCallback] = useState(true);
    const deleteUser = async (id) => {
        try {
            const deleteUser = axios.delete(`/user/delete/${id}`, {
                headers: {Authorization: token}
            });
            await deleteUser;
            setCallback(!callback);
            alert("Xóa thành công.");
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    useEffect(() => {
        (function getUsers() {
          fetch(`http://localhost:5000/user/manage`, {
            method: "GET",
            mode: "cors",
            headers: {
              Authorization: token,
              Accept: "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              setUsers(data.users);
              console.log(data.users);
            });
        })();
      }, [callback]);

    return (
        <div className="user-container facility-container" id="user-container">
            <h3 align="center">Danh sách chuyên viên</h3>
            <table className="table table-striped" style={{marginTop: 20}}>
                <thead>
                <tr>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Giới tính</th>
                    <th>Ngày sinh</th>
                    <th>CMND</th>
                    <th>Vai trò</th>
                    <th>Khu vực quản lý</th>
                    <th colSpan="2">Hành động</th>
                </tr>
                </thead>
                <tbody>
                    {
                        users.map((obj) => (
                            <tr key={obj._id}>
                                <td> {obj.name} </td>
                                <td> {obj.email} </td>
                                <td> {obj.phoneNumber} </td>
                                <td> {obj.gender} </td>
                                <td> {obj.dateOfBirth} </td>
                                <td> {obj.identityCardNumber} </td>
                                <td> {obj.role} </td>
                                <td> {obj.role == "manager" ? "Toàn bộ" : obj.areas.toString()} </td>
                                <td>
                                    <Link to={"/expert/set-area/" + obj._id} className="btn btn-primary">Phân công</Link>
                                </td>
                                <td>
                                    <button className="btn btn-danger" onClick={() => deleteUser(obj._id)}>Xóa</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <BeforeAfterPage></BeforeAfterPage>
        </div>
    )
}

export default UserManage;