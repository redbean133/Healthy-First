import React, {useContext} from 'react';
import {GlobalState} from '../../../GlobalState';

function Filters() {
    const state = useContext(GlobalState);
    const [searchName, setSearchName] = state.FacilityAPI.searchName;
    const [searchFacilityState, setSearchFacilityState] = state.FacilityAPI.searchFacilityState;

    const handleFacilityState = e => {
        setSearchFacilityState(e.target.value);
        setSearchName('');
    }

    return (
        <div className="filter_menu">
            <div className="row filter-box">
                <select className="input" name="state" value={ searchFacilityState } onChange={ handleFacilityState } id="select-filter-facility">
                    <option value='all'>Tất cả</option>
                    <option value='valid'>Đạt an toàn thực phẩm</option>
                    <option value='invalid'>Không đạt an toàn thực phẩm</option>
                    <option value='revoked'>Bị thu hồi giấy chứng nhận</option>
                    <option value='expired'>Giấy chứng nhận hết hạn</option>
                    <option value='notHave'>Chưa được cấp giấy chứng nhận</option>
                </select>
            </div>

            <input className="search-box input" type="text" value={searchName} placeholder="Nhập tên cơ sở" onChange={ e => {
                setSearchName(e.target.value.toLowerCase());
                console.log(searchName);
            }} />

        </div>
    )
}

export default Filters;
