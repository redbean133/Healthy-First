import React, {useContext, useState} from 'react';
import { GlobalState } from '../../../GlobalState';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Filters from './Filters';
import BeforeAfterPage from './BeforeAfterPage';

function Facility() {
    const state = useContext(GlobalState);
    const [facilities, setFacilities] = state.FacilityAPI.facilities;
    const [token] = state.token;
    const [callback, setCallback] = state.FacilityAPI.callback;

    const deleteFacility = async (id) => {
        try {
            const deleteFacility = axios.delete(`/facility/${id}`, {
                headers: {Authorization: token}
            });
            await deleteFacility;
            setCallback(!callback);
            alert("Xóa thành công.");
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    return (
        <div className="facility-container">
            <Filters />
            <h3 align="center">Danh sách cơ sở</h3>
            <Link to={"/facility/create"} className="btn btn-primary add-button">Thêm cơ sở</Link>
            <table className="table table-striped" style={{marginTop: 20}}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Địa chỉ</th>
                    <th>Chủ sở hữu</th>
                    <th>Email</th>
                    <th>SDT</th>
                    <th>Loại cơ sở</th>
                    <th>ID GCN</th>
                    <th colSpan="2">Hành động</th>
                </tr>
                </thead>
                <tbody>
                    {
                        facilities.map((obj) => (
                            <tr key={obj._id}>
                                <td> {obj._id} </td>
                                <td> {obj.name} </td>
                                <td> {obj.address.subDistrict + ", " + obj.address.district + ", " + obj.address.city} </td>
                                <td> {obj.owner} </td>
                                <td> {obj.email} </td>
                                <td> {obj.phoneNumber} </td>
                                <td> {obj.typeOfBusiness.toString()} </td>
                                <td> {obj.certificateID} </td>
                                <td>
                                    <Link to={"/facility/edit/" + obj._id} className="btn btn-primary">Sửa</Link>
                                </td>
                                <td>
                                    <button className="btn btn-danger" onClick={() => deleteFacility(obj._id)}>Xóa</button>
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

export default Facility;
