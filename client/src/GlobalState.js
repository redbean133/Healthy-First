import React, {createContext, useState, useEffect} from 'react';
import axios from 'axios';
import CertificateAPI from './api/CertificateAPI';
import UserAPI from './api/UserAPI';
import FacilityAPI from './api/FacilityAPI';
import InspectActivityAPI from './api/InspectActivityAPI';
import InspectionUnitAPI from './api/InspectionUnitAPI';
import SampleAPI from './api/SampleAPI';

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
    const [token, setToken] = useState(false);
    useEffect(() => {
        const firstLogin = localStorage.getItem('firstLogin');
        if (firstLogin) {
            const refreshToken = async () => {
                const res = await axios.get('/user/refresh_token');
                setToken(res.data.accessToken);
                setTimeout(() => {
                    refreshToken();
                }, 8 * 3600 * 1000);
            }
            refreshToken();
        }
    }, []);
    
    const state = {
        token: [token, setToken],
        CertificateAPI: CertificateAPI(token),
        UserAPI: UserAPI(token),
        FacilityAPI: FacilityAPI(token),
        InspectActivityAPI: InspectActivityAPI(token),
        InspectionUnitAPI: InspectionUnitAPI(token),
        SampleAPI: SampleAPI(token)
    };

    return (
        <GlobalState.Provider value={state}>
            {children}
        </GlobalState.Provider>
    );
}