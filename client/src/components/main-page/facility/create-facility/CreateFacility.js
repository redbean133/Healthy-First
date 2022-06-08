import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import { GlobalState } from '../../../../GlobalState';
import { useNavigate, useParams } from 'react-router-dom';

const initialState = {
    _id: '',
    name: '',
    city: '',
    district: '',
    subDistrict: '',
    hamlet: '',
    owner: '',
    email: '',
    phoneNumber: '',
    typeOfBusiness: '',
}

function CreateFacility() {
    const state = useContext(GlobalState);
    const [facility, setFacility] = useState(initialState);
    const [token] = state.token;

    const Navigate = useNavigate();
    const param = useParams();
    const [onEdit, setOnEdit] = useState(false);
    const [callback, setCallback] = state.FacilityAPI.callback;

    const getFacility = async (id) => {
        const res = await axios.get(`/facility/${id}`, {
            headers: {Authorization: token}
        });
        const facility = res.data.facility;
        let tempValue;
        switch (facility.typeOfBusiness) {
            case ["foodService"]:
                tempValue = "service";
                break;
            case ["foodProduction"]:
                tempValue = "product";
                break;
            case ["foodService", "foodProduction"]:
                tempValue = "both";
                break;
            default:
                tempValue = "service";
                break;
        }

        setFacility({
            _id: facility._id,
            name: facility.name,
            city: facility.address.city,
            district: facility.address.district,
            subDistrict: facility.address.subDistrict,
            hamlet: facility.address.hamlet,
            owner: facility.owner,
            email: facility.email,
            phoneNumber: facility.phoneNumber,
            typeOfBusiness: tempValue
        });
    };

    useEffect(() => {
        if (param.id) {
            setOnEdit(true);
            getFacility(param.id);
        } else {
            setOnEdit(false);
            setFacility(initialState);
        }
    }, [param.id]);

    const handleChangeInput = e => {
        const {name, value} = e.target;
        setFacility({...facility, [name]: value});
    };

    const handleSubmit = async e => {
        e.preventDefault();
        let tempValue;
        switch (facility.typeOfBusiness) {
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
        const newFacility = {
            _id: facility._id,
            name: facility.name,
            address: {
                city: facility.city,
                district: facility.district,
                subDistrict: facility.subDistrict,
                hamlet: facility.hamlet
            },
            owner: facility.owner,
            email: facility.email,
            phoneNumber: facility.phoneNumber,
            typeOfBusiness: tempValue
        }
        try {
            if (onEdit) {
                await axios.put(`/facility/${facility._id}`, {...newFacility}, {
                    headers: {Authorization: token}
                });
                alert("Chỉnh sửa thành công.");
            } else {
                await axios.post('/facility/add', {...newFacility}, {
                    headers: {Authorization: token}
                });
                alert("Thêm cơ sở mới thành công.");
            }
            setCallback(!callback);
            Navigate("/facility");
        } catch (error) {
            alert(error.response.data.message);
        }
    }


    return (
        <div className="create-facility row">
            <div className="section-title">
                <h2>Thêm mới và chỉnh sửa thông tin cơ sở</h2>
            </div>

            <div className="form">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="column two-column">
                            <label htmlFor="_id">_id </label>
                            <textarea type="text" name="_id" id="_id" required
                            value={facility._id} onChange={handleChangeInput} />
                        </div>
                        <div className="column two-column">
                            <label htmlFor="name">Tên </label>
                            <textarea type="text" name="name" id="name" required
                            value={facility.name} onChange={handleChangeInput} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="column two-column">
                            <label htmlFor="city">Thành phố</label>
                            <textarea type="text" name="city" id="city" required
                            value={facility.city} onChange={handleChangeInput} />
                        </div>
                        <div className="column two-column">
                            <label htmlFor="district">Quận, huyện </label>
                            <textarea type="text" name="district" id="district" required
                            value={facility.district} onChange={handleChangeInput} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="column two-column">
                            <label htmlFor="subDistrict">Phường, xã </label>
                            <textarea type="text" name="subDistrict" id="subDistrict" required
                            value={facility.subDistrict} onChange={handleChangeInput} />
                        </div>
                        <div className="column two-column">
                            <label htmlFor="hamlet">Địa chỉ cụ thể </label>
                            <textarea type="text" name="hamlet" id="hamlet" required
                            value={facility.hamlet} onChange={handleChangeInput} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="column two-column">
                            <label htmlFor="owner">Chủ sở hữu </label>
                            <textarea type="text" name="owner" id="owner" required
                            value={facility.owner} onChange={handleChangeInput} />
                        </div>
                        <div className="column two-column">
                            <label htmlFor="email">Email </label>
                            <input type="email" name="email" id="email" required
                            value={facility.email} onChange={handleChangeInput} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="column two-column">
                            <label htmlFor="phoneNumber">Số điện thoại </label>
                            <input type="tel" name="phoneNumber" id="phoneNumber" required
                            value={facility.phoneNumber} onChange={handleChangeInput} />
                        </div>
                        <div className="column two-column">
                            <label htmlFor="typeOfBusiness">Loại hình cơ sở </label>
                            <select className="input" name="typeOfBusiness" value={ facility.typeOfBusiness } 
                            required onChange={ handleChangeInput } >
                                <option value='service'>Dịch vụ ăn uống</option>
                                <option value='product'>Sản xuất thực phẩm</option>
                                <option value='both'>Cả hai</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="web-button">{"Lưu"}</button>
                </form>
            </div>
            
        </div>
    )
}


export default CreateFacility;
