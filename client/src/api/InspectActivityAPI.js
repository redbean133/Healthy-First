import {useState, useEffect} from 'react';
import axios from 'axios';

function InspectActivityAPI(token) {
    const [finishedActivities, setFinishedActivities] = useState([]);
    const [doingActivities, setDoingActivities] = useState([]);
    const [comingActivities, setComingActivities] = useState([]);
    const [expiredActivities, setExpiredActivities] = useState([]);
    const [callback, setCallback] = useState(false);

    useEffect(() => {
        const getInspectActivities = async () => {
            const res = await axios.get(`/inspect-activity`, {
                headers: {Authorization: token}
            });
            setFinishedActivities(res.data.finishedActivity);
            setDoingActivities(res.data.doingActivity);
            setComingActivities(res.data.comingActivity);
            setExpiredActivities(res.data.expiredActivity);
        }
        getInspectActivities();
    }, [callback, token])
    
    return {
        finishedActivities: [finishedActivities, setFinishedActivities],
        doingActivities: [doingActivities, setDoingActivities],
        comingActivities: [comingActivities, setComingActivities],
        expiredActivities: [expiredActivities, setExpiredActivities],
        callback: [callback, setCallback]
    }
}

export default InspectActivityAPI;
