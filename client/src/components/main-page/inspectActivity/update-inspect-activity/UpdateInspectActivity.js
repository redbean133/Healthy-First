import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import { GlobalState } from '../../../../GlobalState';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateInspectActivity() {
    const Navigate = useNavigate();
    const state = useContext(GlobalState);
    const param = useParams();
    const [inspectActivity, setInspectActivity] = useState('');
    const [token] = state.token;
    const [callback, setCallback] = state.InspectActivityAPI.callback;

    const getInspectActivity = async (id) => {
        const res = await axios.get(`/inspect-activity/${id}`, {
            headers: {Authorization: token}
        });
        const inspectActivity = res.data.inspectActivity;
        setInspectActivity({...inspectActivity});
        setInspectActivity({
            level: inspectActivity.minutes.level,
            description: inspectActivity.minutes.description,
            penalty: inspectActivity.minutes.penalty,
            samples: inspectActivity.samples.toString()
        })
    };

    useEffect(() => {
        if (param.id) {
            getInspectActivity(param.id);
        }
    }, [param.id]);

    const handleChangeInput = e => {
        const {name, value} = e.target;
        setInspectActivity({...inspectActivity, [name]: value});
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (!inspectActivity.samples) {
                setInspectActivity({sample: ""});
            }
            await axios.put(`/inspect-activity/${param.id}`, {
                facilityID: inspectActivity.facilityID,
                timeFrom: inspectActivity.timeFrom,
                timeTo: inspectActivity.timeTo,
                samples: inspectActivity.samples.toString().split(" "),
                state: inspectActivity.state,
                result: inspectActivity.result,
                minutes: {
                    level: inspectActivity.level,
                    penalty: inspectActivity.penalty,
                    description: inspectActivity.description
                }
            }, {
                headers: {Authorization: token}
            });
            alert("Cập nhật thành công.");
            setCallback(!callback);
            Navigate("/inspect-activity");
        } catch (error) {
            console.log(error);
            alert(error.response.data.message);
        }
    }

    return (
        <div className="create-facility row" id="update-activity">
            <div className="section-title">
                <h2>Cập nhật quá trình thanh tra</h2>
            </div>

            <div className="form">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="column two-column">
                            <label htmlFor="facilityID">Mã cơ sở cần thanh tra </label>
                            <textarea type="text" name="facilityID" id="facilityID" required
                            value={inspectActivity.facilityID} onChange={handleChangeInput} />
                        </div>
                        <div className="column two-column">
                            <label htmlFor="state">Tiến độ </label>
                            <select className="input" name="state" value={ inspectActivity.state } 
                            required onChange={ handleChangeInput } >
                                <option value='-1'>Quá hạn</option>
                                <option value='0'>Chưa tới ngày thanh tra</option>
                                <option value='1'>Khảo sát thực tế</option>
                                <option value='2'>Xét nghiệm mẫu thực phẩm</option>
                                <option value='3'>Tổng hợp kết quả</option>
                                <option value='4'>Xử lý vi phạm (nếu có)</option>
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="column two-column">
                            <label htmlFor="timeFrom">Thời gian bắt đầu</label>
                            <textarea type="text" name="timeFrom" id="timeFrom" required placeholder='YYYY-MM-DD'
                            value={inspectActivity.timeFrom} onChange={handleChangeInput} />
                        </div>
                        <div className="column two-column">
                            <label htmlFor="timeTo">Thời gian kết thúc </label>
                            <textarea type="text" name="timeTo" id="timeTo" required
                            value={inspectActivity.timeTo} onChange={handleChangeInput} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="column two-column">
                            <label htmlFor="samples">Mẫu thực phẩm </label>
                            <textarea type="text" name="samples" id="samples" 
                            placeholder='Nhập theo mẫu: SA001 SA002 SA003'
                            value={inspectActivity.samples} onChange={handleChangeInput} />
                        </div>
                        <div className="column two-column">
                            <label htmlFor="result">Kết luận </label>
                            <select className="input" name="result" value={ inspectActivity.result } 
                            required onChange={ handleChangeInput } >
                                <option value='-1'>Chưa có kết quả</option>
                                <option value='0'>Không đạt tiêu chuẩn ATTP</option>
                                <option value='1'>Đạt tiêu chuẩn ATTP</option>
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="column two-column">
                            <label htmlFor="level">Mức độ vi phạm </label>
                            <textarea type="text" name="level" id="level"
                            value={inspectActivity.level} onChange={handleChangeInput} />
                        </div>
                        <div className="column two-column">
                            <label htmlFor="description">Chi tiết vi phạm </label>
                            <input type="text" name="description" id="description"
                            value={inspectActivity.description} onChange={handleChangeInput} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="column two-column">
                            <label htmlFor="penalty">Hình phạt </label>
                            <input type="tel" name="penalty" id="penalty"
                            value={inspectActivity.penalty} onChange={handleChangeInput} />
                        </div>
                    </div>

                    <button type="submit" className="web-button">{"Cập nhật"}</button>
                </form>
            </div>
            
        </div>
    )
}

export default UpdateInspectActivity;
