import {useState, useEffect} from 'react';
import axios from 'axios';

function CertificateAPI(token) {
    const [certificates, setCertificates] = useState([]);
    const [callback, setCallback] = useState(false);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const getCertificates = async () => {
            const res = await axios.get(`/certificate?page=${page}`, {
                headers: {Authorization: token}
            });
            setCertificates(res.data.certificates);
        }
        getCertificates();
    }, [callback, page, token])
    
    return {
        certificates: [certificates, setCertificates],
        callback: [callback, setCallback],
        page: [page, setPage]
    }
}

export default CertificateAPI;
