import React, {useContext, useState} from 'react';
import axios from 'axios';
import {GlobalState} from '../../../GlobalState';

function Statistic() {
    const state = useContext(GlobalState);
    const [token] = state.token;
    const [timeFrom, setTimeFrom] = useState("");
    const [timeTo, setTimeTo] = useState("");
    const [monthArr, setMonthArr] = useState([]);
    const [achivedArr, setAchivedArr] = useState([]);
    const [nonAchivedArr, setNonAchivedArr] = useState([]);

    // Statistical
    const makeStatistical = async () => {
        try {
            const res = await axios.post(`/inspect-activity/statistic`, {
                timeFrom: timeFrom,
                timeTo: timeTo
            }, {
                headers: {Authorization: token}
            });
            setMonthArr(res.data.months);
            setAchivedArr(res.data.achived);
            setNonAchivedArr(res.data.nonAchived);
        } catch (error) {
            alert(error.response.data.message);
        }
    }

    return (
        <div className="filter_menu statistic-box">
            <div className="input-box">
                <div className="column">
                    <label htmlFor="timeFrom">Từ tháng</label>
                    <input className="search-box input" type="text" name="timeFrom" value={timeFrom} placeholder="YYYY-MM" onChange={ e => {
                        setTimeFrom(e.target.value);
                    }} />
                </div>

                <div className="column">
                    <label htmlFor="timeFrom">Đến tháng</label>
                    <input className="search-box input" type="text" name="timeTo" value={timeTo} placeholder="YYYY-MM" onChange={ e => {
                        setTimeTo(e.target.value);
                    }} />
                </div>

                <button type="submit" className="web-button" onClick={() => makeStatistical()}>{"Thống kê"}</button>
            </div>
            
        
            <table className="table table-striped" style={{marginTop: 20}}>
                <thead>
                    <tr>
                        <th>Tháng</th>
                        {
                            monthArr.map((obj) => (
                                <th>{obj}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Đạt</td>
                        {
                            achivedArr.map((obj) => (
                                <td>{obj}</td>
                            ))
                        }
                    </tr>
                    <tr>
                        <td>Không đạt</td>
                        {
                            nonAchivedArr.map((obj) => (
                                <td>{obj}</td>
                            ))
                        }
                    </tr>
                </tbody>
            </table>
        </div>     
    )
}

export default Statistic;
