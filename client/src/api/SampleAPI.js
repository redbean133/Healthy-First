import {useState, useEffect} from 'react';
import axios from 'axios';

function SampleAPI(token) {
    const [samples, setSamples] = useState([]);
    const [callback, setCallback] = useState(false);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const getSamples = async () => {
            const res = await axios.get(`/sample?page=${page}`, {
                headers: {Authorization: token}
            });
            setSamples(res.data.samples);
        }
        getSamples();
    }, [callback, page, token])
    
    return {
        samples: [samples, setSamples],
        callback: [callback, setCallback],
        page: [page, setPage]
    }
}

export default SampleAPI;