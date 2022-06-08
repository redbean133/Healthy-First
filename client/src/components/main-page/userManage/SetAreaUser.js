import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import { useNavigate, useParams } from 'react-router-dom';

function SetAreaUser() {
    const Navigate = useNavigate();
    const state = useContext(GlobalState);
    const param = useParams();
    const [areas, setAreas] = useState('');
    const [user, setUser] = useState('');
    const [token] = state.token;

    const getAreas = async (id) => {
        const res = await axios.get(`/user/infor/${id}`, {
            headers: {Authorization: token}
        });
        const user = res.data.user;
        setUser(user);
        setAreas(user.areas.toString());
    };

    useEffect(() => {
        if (param.id) {
            getAreas(param.id);
        }
    }, [param.id]);

    const handleChangeInput = e => {
        setAreas(e.target.value);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await axios.patch(`/user/manage/set_areas/${param.id}`, {
                areas: areas.toString().split(",")
            }, {
                headers: {Authorization: token}
            });
            alert("Thiết lập khu vực quản lý thành công.");
            window.location.assign("/expert");
        } catch (error) {
            console.log(error);
            alert(error.response.data.message);
        }
    }

    return (
        <div className="create-facility row" id="set-user-area">
            <div className="section-title">
                <h2>Thiết lập khu vực quản lý cho chuyên viên</h2>
                <p></p>
            </div>

            <div className="form">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="column one-column">
                            <label htmlFor="area">Khu vực quản lý </label>
                            <input type="text" name="area" id="area" placeholder='Mỗi khu vực cách nhau bằng dấu phảy. Ví dụ: Mê Linh,Đông Anh'
                            value={areas} onChange={handleChangeInput} />
                        </div>
                    </div>

                    <button type="submit" className="web-button">{"Lưu"}</button>
                </form>
            </div>
            
        </div>
    )
}

export default SetAreaUser;
