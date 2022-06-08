import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import { GlobalState } from '../../../../GlobalState';
import { useNavigate, useParams } from 'react-router-dom';

const initialState = {
    _id: '',
    name: '',
    inspectionUnitID: '',
    facilityID: '',
    state: 0,
    inspectionResult: -1,
    receiveResultOn: ''
}

function CreateSample() {
    const state = useContext(GlobalState);
    const [sample, setSample] = useState(initialState);
    const [token] = state.token;

    const Navigate = useNavigate();
    const param = useParams();
    const [onEdit, setOnEdit] = useState(false);
    const [callback, setCallback] = state.SampleAPI.callback;

    const getSample = async (id) => {
        const res = await axios.get(`/sample/${id}`, {
            headers: {Authorization: token}
        });
        const sample = res.data.sample;
        setSample({...sample});
    };

    useEffect(() => {
        if (param.id) {
            setOnEdit(true);
            getSample(param.id);
        } else {
            setOnEdit(false);
            setSample(initialState);
        }
    }, [param.id]);

    const handleChangeInput = e => {
        const {name, value} = e.target;
        setSample({...sample, [name]: value});
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (onEdit) {
                await axios.put(`/sample/${sample._id}`, {...sample}, {
                    headers: {Authorization: token}
                });
                alert("Chỉnh sửa thành công.");
            } else {
                await axios.post('/sample', {...sample}, {
                    headers: {Authorization: token}
                });
                alert("Thêm mẫu thực phẩm mới thành công.");
            }
            setCallback(!callback);
            Navigate("/sample");
        } catch (error) {
            alert(error.response.data.message);
        }
    }


    return (
        <div className="create-facility row">
            <div className="section-title">
                <h2>Thêm mới và chỉnh sửa thông tin mẫu thực phẩm</h2>
            </div>

            <div className="form">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="column two-column">
                            <label htmlFor="_id">_id </label>
                            <textarea type="text" name="_id" id="_id" required
                            value={sample._id} onChange={handleChangeInput} />
                        </div>
                        <div className="column two-column">
                            <label htmlFor="name">Tên </label>
                            <textarea type="text" name="name" id="name" required
                            value={sample.name} onChange={handleChangeInput} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="column two-column">
                            <label htmlFor="inspectionUnitID">Đơn vị xét nghiệm</label>
                            <textarea type="text" name="inspectionUnitID" id="inspectionUnitID" required
                            value={sample.inspectionUnitID} onChange={handleChangeInput} />
                        </div>
                        <div className="column two-column">
                            <label htmlFor="facilityID">Nguồn gốc </label>
                            <textarea type="text" name="facilityID" id="facilityID" required
                            value={sample.facilityID} onChange={handleChangeInput} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="column two-column">
                        <label htmlFor="state">Trạng thái </label>
                            <select className="input" name="state" value={ sample.state } 
                            required onChange={ handleChangeInput } >
                                <option value='0'>Chưa gửi tới cơ sở giám định</option>
                                <option value='1'>Đã gửi mẫu tới cơ sở giám định</option>
                                <option value='2'>Đã nhận được kết quả giám định</option>
                            </select>
                        </div>
                        <div className="column two-column">
                            <label htmlFor="inspectionResult">Kết quả </label>
                            <select className="input" name="inspectionResult" value={ sample.inspectionResult } 
                            required onChange={ handleChangeInput } >
                                <option value='-1'>Chưa có kết quả</option>
                                <option value='0'>Không đạt tiêu chuẩn ATTP</option>
                                <option value='1'>Đạt tiêu chuẩn ATTP</option>
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="column two-column">
                            <label htmlFor="receiveResultOn">Ngày nhận kết quả </label>
                            <textarea type="text" name="receiveResultOn" id="receiveResultOn" placeholder='YYYY-MM-DD'
                            value={sample.receiveResultOn} onChange={handleChangeInput} />
                        </div>
                    </div>

                    <button type="submit" className="web-button">{"Lưu"}</button>
                </form>
            </div>
            
        </div>
    )
}


export default CreateSample;
