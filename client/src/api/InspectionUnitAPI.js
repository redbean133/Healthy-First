import {useState, useEffect} from 'react';
import axios from 'axios';

function InspectionUnitAPI(token) {
    const [inspectionUnits, setInspectionUnits] = useState([]);
    const [callback, setCallback] = useState(false);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const getInspectionUnits = async () => {
            const res = await axios.get(`/inspection-unit?page=${ page }`, {
                headers: {Authorization: token}
            });
            setInspectionUnits(res.data.inspectionUnits);
        }
        getInspectionUnits();
    }, [callback, page, token])
    
    return {
        inspectionUnits: [inspectionUnits, setInspectionUnits],
        callback: [callback, setCallback],
        page: [page, setPage]
    }
}

export default InspectionUnitAPI;