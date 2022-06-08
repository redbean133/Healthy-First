import React, {useContext, useState} from 'react';
import { GlobalState } from '../../../GlobalState';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Statistic from './Statistic';
import BeforeAfterPage from './BeforeAfterPage';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function Certificate() {
    const state = useContext(GlobalState);
    const [certificates, setCertificates] = state.CertificateAPI.certificates;
    const [token] = state.token;
    const [callback, setCallback] = state.CertificateAPI.callback;

    const revoke = async (id) => {
        try {
            console.log(token);
            const revoke = axios.patch(`/certificate/revoke/${id}`, {}, {
                headers: {Authorization: token}
            });
            await revoke;
            setCallback(!callback);
            alert("Thu hồi thành công.");
        } catch (err) {
            console.log(err);
            alert(err.response.data.message);
        }
    };

    const outputPDF = async (certificate) => {
        const id_place = document.getElementById('certificate-id');
        const owner_place = document.getElementById('owner');
        const name_facility_place = document.getElementById('name');
        const address_place = document.getElementById('address');
        const type_facility_place = document.getElementById('type');
        const expired_place = document.getElementById('expired');

        const res = await axios.get(`/facility/${certificate.facilityID}`, {
            headers: {Authorization: token}
        });
        const facility = res.data.facility;

        id_place.innerHTML = certificate._id;
        owner_place.innerHTML = facility.owner;
        name_facility_place.innerHTML = facility.name;
        address_place.innerHTML = facility.address.subDistrict + ", " + facility.address.district 
            + ", " + facility.address.city;
        let type_of_business = "";
        if (facility.typeOfBusiness.length == 2) {
            type_of_business = "SẢN XUẤT THỰC PHẨM VÀ DỊCH VỤ ĂN UỐNG";
        } else {
            if (facility.typeOfBusiness[0] == "foodService") {
                type_of_business = "DỊCH VỤ ĂN UỐNG";
            } else {
                type_of_business = "SẢN XUẤT THỰC PHẨM";
            }
        }
        type_facility_place.innerHTML = type_of_business;
        expired_place.innerHTML = certificate.expireOn;

        exportPDF();
    }
 
    const exportPDF = () => {
        const input = document.getElementById('content');
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('img/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                pdf.addImage(imgData, 'PNG', 1, 1);
                pdf.save("File.pdf");
            });
    }

    return (
        <div className="facility-container certificate-container">
            <h3 align="center">Danh sách giấy chứng nhận</h3>
            <Link to={"/certificate/create"} className="btn btn-primary add-button">Cấp mới</Link>
            <table className="table table-striped" style={{marginTop: 20}}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Ngày cấp</th>
                    <th>Ngày hết hạn</th>
                    <th>Mã cơ sở</th>
                    <th>Mã chuyên viên cấp</th>
                    <th>Trạng thái</th>
                    <th colSpan="2">Hành động</th>
                </tr>
                </thead>
                <tbody>
                    {
                        certificates.map((obj) => (
                            <tr key={obj._id}>
                                <td> {obj._id} </td>
                                <td> {obj.createOn} </td>
                                <td> {obj.expireOn} </td>
                                <td> {obj.facilityID} </td>
                                <td> {obj.expertID} </td>
                                <td> {obj.state} </td>
                                <td>
                                    {
                                        obj.state == "valid" ? <button className="btn btn-danger" onClick={() => revoke(obj._id)}>Thu hồi</button>
                                        : obj.state == "expired" ? <Link to={"/certificate/extend/" + obj._id} className="btn btn-primary">Gia hạn</Link>
                                        : ""
                                    }
                                </td>
                                <td>
                                    {
                                        obj.state == "valid" ? <button className="btn btn-primary" onClick={() => {outputPDF(obj)}}>Xuất PDF</button>
                                        : ""
                                    }
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <BeforeAfterPage></BeforeAfterPage>
            <h3 align="center">Thống kê số lượng giấy chứng nhận cấp theo từng tháng</h3>
            <Statistic />

            
            <div>
                <div id="content" style={{ 
                    position: "fixed",
                    left: "100vw",
                    width: "790px" 
                }}>
                    <div id="export-place">
                        <p>ỦY BAN NHÂN DÂN</p> <br />
                        <p>THÀNH PHỐ HÀ NỘI</p>
                    </div>

                    <div id="tieu-ngu">
                        <p>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                        <p>Độc lập - Tự do - Hạnh phúc</p>
                    </div>

                    <div>Số <span id="certificate-id"></span>/ATTP-CNĐK</div>
                    <div id="title">
                        <p>GIẤY CHỨNG NHẬN</p> <br />
                        <p>CƠ SỞ ĐỦ ĐIỀU KIỆN AN TOÀN THỰC PHẨM</p>
                    </div>

                    <div id="facility-infor">
                        <p>CHỦ CƠ SỞ: <span id="owner"></span></p> <br />
                        <p>Tên cơ sở: <span id="name"></span></p> <br />
                        <p>Địa chỉ: <span id="address"></span></p> <br />
                    </div>

                    <div id="certificate-content">
                        <p>ĐỦ ĐIỀU KIỆN AN TOÀN THỰC PHẨM THEO QUY ĐỊNH</p> <br />
                        <p>LOẠI HÌNH CƠ SỞ: <span id="type"></span></p>
                    </div>

                    <div id="expired-box">
                        <p>GIẤY CHỨNG NHẬN CÓ GIÁ TRỊ SỬ DỤNG TỚI NGÀY: <span id="expired"></span></p>
                    </div>

                    <div id="footer">
                        <p>Thành phố Hà Nội, ngày ... tháng ... năm ...</p> <br />
                        <p>Trưởng ban</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Certificate;
