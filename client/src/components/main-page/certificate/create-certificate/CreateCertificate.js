import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import { GlobalState } from '../../../../GlobalState';
import { useNavigate, useParams } from 'react-router-dom';

const initialState = {
    _id: '',
    createOn: '',
    expireOn: '',
    facilityID: ''
}

function CreateCertificate() {
    const state = useContext(GlobalState);
    const [certificate, setCertificate] = useState(initialState);
    const [token] = state.token;

    const Navigate = useNavigate();
    const param = useParams();
    const [onEdit, setOnEdit] = useState(false);
    const [callback, setCallback] = state.CertificateAPI.callback;
    const facilityCallBack = state.FacilityAPI.callback[0];
    const facilitySetCallBack = state.FacilityAPI.callback[1];

    const getCertificate = async (id) => {
        const res = await axios.get(`/certificate/${id}`, {
            headers: {Authorization: token}
        });
        const certificate = res.data.certificate;
        setCertificate({
            _id: certificate._id,
            createOn: certificate.createOn,
            expireOn: certificate.expireOn,
            facilityID: certificate.facilityID
        });
    };

    useEffect(() => {
        if (param.id) {
            setOnEdit(true);
            getCertificate(param.id);
        } else {
            setOnEdit(false);
            setCertificate(initialState);
        }
    }, [param.id]);

    const handleChangeInput = e => {
        const {name, value} = e.target;
        setCertificate({...certificate, [name]: value});
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (onEdit) {
                await axios.patch(`/certificate/extend/${certificate._id}`, {...certificate}, {
                    headers: {Authorization: token}
                });
                alert("Gia hạn thành công.");
            } else {
                await axios.post('/certificate', {...certificate}, {
                    headers: {Authorization: token}
                });
                alert("Thêm giấy chứng nhận thành công.");
            }
            setCallback(!callback);
            facilitySetCallBack(!facilityCallBack);
            Navigate("/certificate");
        } catch (error) {
            alert(error.response.data.message);
        }
    }


    return (
        <div className="create-facility row" id="create-certificate">
            <div className="section-title">
                <h2>Quản lý giấy chứng nhận</h2>
            </div>

            <div className="form">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="column two-column">
                            <label htmlFor="_id">_id </label>
                            <textarea type="text" name="_id" id="_id" required
                            value={certificate._id} onChange={handleChangeInput} />
                        </div>
                        <div className="column two-column">
                            <label htmlFor="facilityID">Mã cơ sở </label>
                            <textarea type="text" name="facilityID" id="facilityID" required
                            value={certificate.facilityID} onChange={handleChangeInput} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="column two-column">
                            <label htmlFor="createOn">Ngày cấp</label>
                            <textarea type="text" name="createOn" id="createOn" required placeholder="YYYY-MM-DD"
                            value={certificate.createOn} onChange={handleChangeInput} />
                        </div>
                        <div className="column two-column">
                            <label htmlFor="expireOn">Ngày hết hạn </label>
                            <textarea type="text" name="expireOn" id="expireOn" required placeholder="YYYY-MM-DD"
                            value={certificate.expireOn} onChange={handleChangeInput} />
                        </div>
                    </div>

                    <button type="submit" className="web-button">{"Lưu"}</button>
                </form>
            </div>
            
        </div>
    )
}


export default CreateCertificate;
