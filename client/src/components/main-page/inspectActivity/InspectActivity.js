import React, {useContext} from 'react';
import { GlobalState } from '../../../GlobalState';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Statistic from './Statistic';

function InspectActivity() {
    const state = useContext(GlobalState);
    const [token] = state.token;
    const [finishedActivities, setFinishedActivities] = state.InspectActivityAPI.finishedActivities;
    const [doingActivities, setDoingActivities] = state.InspectActivityAPI.doingActivities;
    const [comingActivities, setComingActivities] = state.InspectActivityAPI.comingActivities;
    const [expiredActivities, setExpiredActivities] = state.InspectActivityAPI.expiredActivities;
    const [callback, setCallback] = state.InspectActivityAPI.callback;

    const deleteActivity = async (id) => {
        try {
            const deleteActivity = axios.delete(`/inspect-activity/${id}`, {
                headers: {Authorization: token}
            });
            await deleteActivity;
            setCallback(!callback);
            alert("Xóa thành công.");
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    return (
        <div className='facility-container inspect-container'>
            <h3 align="center">Danh sách hoạt động thanh kiểm tra</h3>
            <Link to={"/inspect-activity/create"} className="btn btn-primary add-button">Thêm lịch</Link>
            <table className='table table-striped' style={{marginTop: 20}}>
            <thead>
                <tr>
                    <th>Facility ID</th>
                    <th>Expert ID</th>
                    <th>Bắt đầu</th>
                    <th>Kết thúc</th>
                    <th>Mẫu thực phẩm</th>
                    <th>Giai đoạn</th>
                    <th>Kết quả</th>
                    <th colSpan="2">Hành động</th>
                </tr>
            </thead>
            <tbody>
                <h3 align="left" className="title">COMING</h3>
                {
                    comingActivities.map((obj) => (
                        <tr key={obj._id}>
                            <td> {obj.facilityID} </td>
                            <td> {obj.expertID} </td>
                            <td> {obj.timeFrom} </td>
                            <td> {obj.timeTo} </td>
                            <td> {obj.samples.toString()} </td>
                            <td> {obj.state == -1 ? "Đã quá hạn" : obj.state == 0 ? "Chưa đến ngày" : obj.state == 1 ? "Đang khảo sát" : obj.state == 2 ? "Chờ xét nghiệm" : obj.state == 3 ? "Đã kết luận" : "Xử lý vi phạm"} </td>
                            <td> {obj.result == -1 ? "Chưa có kết quả" : obj.result == 1 ? "Đạt" : "Không đạt"} </td>
                            <td>
                                <Link to={"/inspect-activity/update/" + obj._id} className="btn btn-primary">Cập nhật</Link>
                            </td>
                            <td>
                                <button className="btn btn-danger" onClick={() => deleteActivity(obj._id)}>Xóa</button>
                            </td>
                        </tr>
                    ))
                }

                <h3 align="left" className="title">DOING</h3>
                {
                    doingActivities.map((obj) => (
                        <tr key={obj._id}>
                            <td> {obj.facilityID} </td>
                            <td> {obj.expertID} </td>
                            <td> {obj.timeFrom} </td>
                            <td> {obj.timeTo} </td>
                            <td> {obj.samples.toString()} </td>
                            <td> {obj.state == -1 ? "Đã quá hạn" : obj.state == 0 ? "Chưa đến ngày" : obj.state == 1 ? "Đang khảo sát" : obj.state == 2 ? "Chờ xét nghiệm" : obj.state == 3 ? "Đã kết luận" : "Xử lý vi phạm"} </td>
                            <td> {obj.result == -1 ? "Chưa có kết quả" : obj.result == 1 ? "Đạt" : "Không đạt"} </td>
                            <td>
                                <Link to={"/inspect-activity/update/" + obj._id} className="btn btn-primary">Cập nhật</Link>
                            </td>
                            <td>
                                <button className="btn btn-danger" onClick={() => deleteActivity(obj._id)}>Xóa</button>
                            </td>
                        </tr>
                    ))
                }

                <h3 align="left" className="title">EXPIRED</h3>
                {
                    expiredActivities.map((obj) => (
                        <tr key={obj._id}>
                            <td> {obj.facilityID} </td>
                            <td> {obj.expertID} </td>
                            <td> {obj.timeFrom} </td>
                            <td> {obj.timeTo} </td>
                            <td> {obj.samples.toString()} </td>
                            <td> {obj.state == -1 ? "Đã quá hạn" : obj.state == 0 ? "Chưa đến ngày" : obj.state == 1 ? "Đang khảo sát" : obj.state == 2 ? "Chờ xét nghiệm" : obj.state == 3 ? "Đã kết luận" : "Xử lý vi phạm"} </td>
                            <td> {obj.result == -1 ? "Chưa có kết quả" : obj.result == 1 ? "Đạt" : "Không đạt"} </td>
                            <td>
                                <Link to={"/inspect-activity/update/" + obj._id} className="btn btn-primary">Cập nhật</Link>
                            </td>
                            <td>
                                <button className="btn btn-danger" onClick={() => deleteActivity(obj._id)}>Xóa</button>
                            </td>
                        </tr>
                    ))
                }

                <h3 align="left" className="title">FINISHED</h3>
                {
                    finishedActivities.map((obj) => (
                        <tr key={obj._id}>
                            <td> {obj.facilityID} </td>
                            <td> {obj.expertID} </td>
                            <td> {obj.timeFrom} </td>
                            <td> {obj.timeTo} </td>
                            <td> {obj.samples.toString()} </td>
                            <td> {obj.state == -1 ? "Đã quá hạn" : obj.state == 0 ? "Chưa đến ngày" : obj.state == 1 ? "Đang khảo sát" : obj.state == 2 ? "Chờ xét nghiệm" : obj.state == 3 ? "Đã kết luận" : "Xử lý vi phạm"} </td>
                            <td> {obj.result == -1 ? "Chưa có kết quả" : obj.result == 1 ? "Đạt" : "Không đạt"} </td>
                            <td>
                                <Link to={"/inspect-activity/update/" + obj._id} className="btn btn-primary">Cập nhật</Link>
                            </td>
                            <td>
                                <button className="btn btn-danger" onClick={() => deleteActivity(obj._id)}>Xóa</button>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
            </table>
            <h3 align="center">Thống kê kết quả hoạt động thanh, kiểm tra</h3>
            <Statistic />
        </div>
    ) 
}

export default InspectActivity;
