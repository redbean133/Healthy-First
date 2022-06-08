import React, {useContext} from 'react';
import { GlobalState } from '../../../GlobalState';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BeforeAfterPage from './BeforeAfterPage';

function Sample() {
    const state = useContext(GlobalState);
    const [samples, setSamples] = state.SampleAPI.samples;
    const [token] = state.token;
    const [callback, setCallback] = state.SampleAPI.callback;

    const deleteSample = async (id) => {
        try {
            const deleteSample = axios.delete(`/sample/${id}`, {
                headers: {Authorization: token}
            });
            await deleteSample;
            setCallback(!callback);
            alert("Xóa thành công.");
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    return (
        <div className="facility-container inspect-container">
            <h3 align="center">Danh sách mẫu thực phẩm</h3>
            <Link to={"/sample/create"} className="btn btn-primary add-button">Thêm mẫu</Link>
            <table className="table table-striped" style={{marginTop: 20}}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Đơn vị xét nghiệm</th>
                    <th>Nguồn gốc</th>
                    <th>Trạng thái</th>
                    <th>Kết quả</th>
                    <th>Ngày nhận kết quả</th>
                    <th colSpan="2">Hành động</th>
                </tr>
                </thead>
                <tbody>
                    {
                        samples.map((obj) => (
                            <tr key={obj._id}>
                                <td> {obj._id} </td>
                                <td> {obj.name} </td>
                                <td> {obj.inspectionUnitID} </td>
                                <td> {obj.facilityID} </td>
                                <td> {obj.state == 0 ? "Chưa gửi" : obj.state == 1 ? "Đã gửi" : "Đã xét nghiệm"} </td>
                                <td> {obj.inspectionResult == -1 ? "Chưa có kết quả" : obj.inspectionResult == 0 ? "Không đạt ATTP" : "Đạt ATTP"} </td>
                                <td> {obj.receiveResultOn} </td>
                                <td>
                                    <Link to={"/sample/edit/" + obj._id} className="btn btn-primary">Cập nhật</Link>
                                </td>
                                <td>
                                    <button className="btn btn-danger" onClick={() => deleteSample(obj._id)}>Xóa</button>
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

export default Sample;
