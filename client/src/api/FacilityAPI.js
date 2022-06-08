import {useState, useEffect} from 'react';
import axios from 'axios';

function FacilityAPI(token) {
    const [facilities, setFacilities] = useState([]);
    const [validFacilities, setValidFacilities] = useState([]);
    const [invalidFacilities, setInvalidFacilities] = useState([]);
    const [notHaveFacilities, setNotHaveFacilities] = useState([]);
    const [expiredFacilities, setExpiredFacilities] = useState([]);
    const [revokedFacilities, setRevokedFacilities] = useState([]);

    const [callback, setCallback] = useState(false);
    const [searchName, setSearchName] = useState('');
    const [searchCity, setSearchCity] = useState('');
    const [searchDistrict, setSearchDistrict] = useState('');
    const [searchSubDistrict, setSearchSubDistrict] = useState('');
    const [searchFacilityState, setSearchFacilityState] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        const getFacilities = async () => {
            console.log(searchName);
            const res = await axios.get(`/facility?page=${page}&name=${searchName}&city=${searchCity}&district=${searchDistrict}&subDistrict=${searchSubDistrict}`, {
                headers: {Authorization: token}
            });
            setFacilities(res.data.facilities);
        }
        getFacilities();
    }, [callback, searchName, searchCity, searchDistrict, searchSubDistrict, page, token])

    useEffect(() => {
        const filterByFacilityState = async () => {
            const res = await axios.get("/facility/filter/filter-by-certificate", {
                headers: {Authorization: token}
            });
            console.log(res);
            setValidFacilities(res.data.valid);
            setInvalidFacilities(res.data.invalid);
            setNotHaveFacilities(res.data.notHave);
            setExpiredFacilities(res.data.expired);
            setRevokedFacilities(res.data.revoked);
        }
        filterByFacilityState();
        switch (searchFacilityState) {
            case "all":
                setCallback(!callback);
                setSearchFacilityState('');
                break;
            case "valid":
                setFacilities(validFacilities);
                break;
            case "invalid":
                setFacilities(invalidFacilities);
                break;
            case "revoked":
                setFacilities(revokedFacilities);
                break;
            case "expired":
                setFacilities(expiredFacilities);
                break;
            case "notHave":
                setFacilities(notHaveFacilities);
                break;
            default:
                break;
        }
        console.log(searchFacilityState);
        console.log(facilities);
    }, [callback, searchFacilityState, token])
    
    return {
        facilities: [facilities, setFacilities],
        validFacilities: [validFacilities, setValidFacilities],
        invalidFacilities: [invalidFacilities, setInvalidFacilities],
        notHaveFacilities: [notHaveFacilities, setNotHaveFacilities],
        expiredFacilities: [expiredFacilities, setExpiredFacilities],
        revokedFacilities: [revokedFacilities, setRevokedFacilities],
        callback: [callback, setCallback],
        searchName: [searchName, setSearchName],
        searchCity: [searchCity, setSearchCity],
        searchDistrict: [searchDistrict, setSearchDistrict],
        searchSubDistrict: [searchSubDistrict, setSearchSubDistrict],
        searchFacilityState: [searchFacilityState, setSearchFacilityState],
        page: [page, setPage]
    }
}

export default FacilityAPI;
