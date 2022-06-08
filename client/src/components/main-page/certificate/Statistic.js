import React, {useContext, useState} from 'react';
import axios from 'axios';
import {GlobalState} from '../../../GlobalState';

function Statistic() {
    const state = useContext(GlobalState);
    const [token] = state.token;
    const [timeFrom, setTimeFrom] = useState("");
    const [timeTo, setTimeTo] = useState("");
    const [statisticTypeFacility, setStatisticTypeFacility] = useState('');
    const [monthArr, setMonthArr] = useState([]);
    const [amountArr, setAmountArr] = useState([]);

    const handleChangeInput = e => {
        setStatisticTypeFacility(e.target.value);
    }

    // Statistical
    const makeStatistical = async () => {
        let tempValue;
        switch (statisticTypeFacility) {
            case "service":
                tempValue = ["foodService"];
                break;
            case "product":
                tempValue = ["foodProduction"];
                break;
            case "both":
                tempValue = ["foodService", "foodProduction"];
                break;
            default:
                tempValue = ["foodService"];
                break;
        }
        try {
            const res = await axios.post(`/certificate/statistic`, {
                timeFrom: timeFrom,
                timeTo: timeTo,
                typeOfBusiness: tempValue
            }, {
                headers: {Authorization: token}
            });
            setMonthArr(res.data.months);
            setAmountArr(res.data.amount);
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

                <div className="column">
                    <label htmlFor="typeOfBusiness">Loại hình cơ sở </label>
                    <select className="input" name="typeOfBusiness" value={ statisticTypeFacility } 
                    required onChange={ handleChangeInput } >
                        <option value='service'>Chỉ dịch vụ ăn uống</option>
                        <option value='product'>Chỉ sản xuất thực phẩm</option>
                        <option value='both'>Ít nhất một trong hai loại hình thức</option>
                    </select>
                </div>

                <button type="submit" className="web-button" onClick={() => makeStatistical()}>{"Thống kê"}</button>
            </div>
            
        
            <table className="table table-striped" style={{marginTop: 20}}>
                <thead>
                <tr>
                    {
                        monthArr.map((obj) => (
                            <th>{obj}</th>
                        ))
                    }
                </tr>
                </thead>
                <tbody>
                    <tr>
                        {
                            amountArr.map((obj) => (
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
