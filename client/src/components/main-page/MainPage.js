import React, { useContext } from 'react';
import { Routes, Route } from "react-router-dom";
import { GlobalState } from '../../GlobalState';
import Login from './authentication/Login';
import Register from './authentication/Register';
import NotFound from './utils/NotFound';
import Facility from './facility/Facility';
import CreateFacility from './facility/create-facility/CreateFacility';
import Certificate from './certificate/Certificate';
import CreateCertificate from './certificate/create-certificate/CreateCertificate';
import InspectActivity from './inspectActivity/InspectActivity';
import CreateInspectActivity from './inspectActivity/create-inspect-activity/CreateInspectActivity';
import UpdateInspectActivity from './inspectActivity/update-inspect-activity/UpdateInspectActivity';
import UserManage from './userManage/UserManage';
import SetAreaUser from './userManage/SetAreaUser';
import Sample from './sample/Sample';
import CreateSample from './sample/create-sample/CreateSample';

function Pages() {
    const state = useContext(GlobalState);
    const [isLogged] = state.UserAPI.isLogged;
    const [isManager] = state.UserAPI.isManager;

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/facility" element={isLogged ? <Facility /> : <NotFound />} />
            <Route path="/facility/edit/:id" element={isLogged ? <CreateFacility /> : <NotFound />} />
            <Route path="/facility/create" element={isLogged ? <CreateFacility /> : <NotFound />} />
            <Route path="/certificate" element={isLogged ? <Certificate /> : <NotFound />} />
            <Route path="/certificate/extend/:id" element={isLogged ? <CreateCertificate /> : <NotFound />} />
            <Route path="/certificate/create" element={isLogged ? <CreateCertificate /> : <NotFound />} />
            <Route path="/inspect-activity" element={isLogged ? <InspectActivity /> : <NotFound />} />
            <Route path="/inspect-activity/create" element={isLogged ? <CreateInspectActivity /> : <NotFound />} />
            <Route path="/inspect-activity/update/:id" element={isLogged ? <UpdateInspectActivity /> : <NotFound />} />
            <Route path="/expert" element={isManager ? <UserManage /> : <NotFound />} />
            <Route path="/expert/set-area/:id" element={isManager ? <SetAreaUser /> : <NotFound />} />
            <Route path="/sample" element={isLogged ? <Sample /> : <NotFound />} />
            <Route path="/sample/create" element={isLogged ? <CreateSample /> : <NotFound />} />
            <Route path="/sample/edit/:id" element={isLogged ? <CreateSample /> : <NotFound />} />
        </Routes>
    );
}

export default Pages;