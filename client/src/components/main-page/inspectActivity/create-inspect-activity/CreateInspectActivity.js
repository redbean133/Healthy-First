import React, { useState, useContext } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../../GlobalState';
import { useNavigate } from 'react-router-dom';

const initialState = {
    facilityID: '',
    timeFrom: '',
    timeTo: ''
}

function CreateInspectActivity() {
    const state = useContext(GlobalState);
    const [inspectActivity, setInspectActivity] = useState(initialState);
    const [token] = state.token;
    const Navigate = useNavigate();
    const [callback, setCallback] = state.InspectActivityAPI.callback;

    const handleChangeInput = e => {
        const {name, value} = e.target;
        setInspectActivity({...inspectActivity, [name]: value});
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await axios.post('/inspect-activity', {...inspectActivity}, {
                headers: {Authorization: token}
            });
            alert("Thêm hoạt động thanh tra thành công.");
            setCallback(!callback);
            Navigate("/inspect-activity");
        } catch (error) {
            alert(error.response.data.message);
        }
    }


    return (
        <div className="create-facility" id="create-activity">
            <div className="section-title">
                <h2>Thêm hoạt động thanh tra</h2>
            </div>

            <div className="form">
                <form onSubmit={handleSubmit}>
                        <div className="one-column">
                            <label htmlFor="facilityID">Mã cơ sở </label>
                            <textarea type="text" name="facilityID" id="facilityID" required
                            value={inspectActivity.facilityID} onChange={handleChangeInput} />
                        </div>
                        <div className="one-column">
                            <label htmlFor="timeFrom">Từ ngày </label>
                            <textarea type="text" name="timeFrom" id="timeFrom" required placeholder="YYYY-MM-DD"
                            value={inspectActivity.timeFrom} onChange={handleChangeInput} />
                        </div>

                        <div className="one-columnn">
                            <label htmlFor="timeTo">Đến ngày</label>
                            <textarea type="text" name="timeTo" id="timeTo" required placeholder="YYYY-MM-DD"
                            value={inspectActivity.timeTo} onChange={handleChangeInput} />
                        </div>

                    <button type="submit" className="web-button">{"Lưu"}</button>
                </form>
            </div>
            
        </div>
    )
}


export default CreateInspectActivity;
