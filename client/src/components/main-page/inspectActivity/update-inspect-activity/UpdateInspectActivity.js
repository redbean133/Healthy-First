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
            alert("C???p nh???t th??nh c??ng.");
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
                <h2>C???p nh???t qu?? tr??nh thanh tra</h2>
            </div>

            <div className="form">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="column two-column">
                            <label htmlFor="facilityID">M?? c?? s??? c???n thanh tra </label>
                            <textarea type="text" name="facilityID" id="facilityID" required
                            value={inspectActivity.facilityID} onChange={handleChangeInput} />
                        </div>
                        <div className="column two-column">
                            <label htmlFor="state">Ti???n ????? </label>
                            <select className="input" name="state" value={ inspectActivity.state } 
                            required onChange={ handleChangeInput } >
                                <option value='-1'>Qu?? h???n</option>
                                <option value='0'>Ch??a t???i ng??y thanh tra</option>
                                <option value='1'>Kh???o s??t th???c t???</option>
                                <option value='2'>X??t nghi???m m???u th???c ph???m</option>
                                <option value='3'>T???ng h???p k???t qu???</option>
                                <option value='4'>X??? l?? vi ph???m (n???u c??)</option>
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="column two-column">
                            <label htmlFor="timeFrom">Th???i gian b???t ?????u</label>
                            <textarea type="text" name="timeFrom" id="timeFrom" required placeholder='YYYY-MM-DD'
                            value={inspectActivity.timeFrom} onChange={handleChangeInput} />
                        </div>
                        <div className="column two-column">
                            <label htmlFor="timeTo">Th???i gian k???t th??c </label>
                            <textarea type="text" name="timeTo" id="timeTo" required
                            value={inspectActivity.timeTo} onChange={handleChangeInput} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="column two-column">
                            <label htmlFor="samples">M???u th???c ph???m </label>
                            <textarea type="text" name="samples" id="samples" 
                            placeholder='Nh???p theo m???u: SA001 SA002 SA003'
                            value={inspectActivity.samples} onChange={handleChangeInput} />
                        </div>
                        <div className="column two-column">
                            <label htmlFor="result">K???t lu???n </label>
                            <select className="input" name="result" value={ inspectActivity.result } 
                            required onChange={ handleChangeInput } >
                                <option value='-1'>Ch??a c?? k???t qu???</option>
                                <option value='0'>Kh??ng ?????t ti??u chu???n ATTP</option>
                                <option value='1'>?????t ti??u chu???n ATTP</option>
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="column two-column">
                            <label htmlFor="level">M???c ????? vi ph???m </label>
                            <textarea type="text" name="level" id="level"
                            value={inspectActivity.level} onChange={handleChangeInput} />
                        </div>
                        <div className="column two-column">
                            <label htmlFor="description">Chi ti???t vi ph???m </label>
                            <input type="text" name="description" id="description"
                            value={inspectActivity.description} onChange={handleChangeInput} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="column two-column">
                            <label htmlFor="penalty">H??nh ph???t </label>
                            <input type="tel" name="penalty" id="penalty"
                            value={inspectActivity.penalty} onChange={handleChangeInput} />
                        </div>
                    </div>

                    <button type="submit" className="web-button">{"C???p nh???t"}</button>
                </form>
            </div>
            
        </div>
    )
}

export default UpdateInspectActivity;
