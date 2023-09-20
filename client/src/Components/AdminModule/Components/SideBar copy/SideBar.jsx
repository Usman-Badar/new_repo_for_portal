import React, { useEffect } from 'react';

import { NavLink } from 'react-router-dom';
// import './SideBar.css';
import $ from 'jquery';

const SideBar = (props) => {

    useEffect(
        () => {

            $('.Forms_options').slideUp(0);
            $('.attendance_options').slideUp(0);

        }, []
    );

    return (
        <>
            {/* style={ { 'width' : props.show ? '100vw' : '0' } } */}
            <div className="Admin_Dashboard_sideBar" >

                <div className="Admin_Dashboard_logo d-center">
                    <div><h4 className="mb-0 logo">ADMIN PANEL</h4></div>
                    <div><button className="btn btn-sm p-0 m-0 sideBar_bars"><i className="las la-bars"></i></button></div>
                </div>

                <div className="Admin_Dashboard_links">
                    <NavLink activeClassName="Admin_Dashboard_active" to="/admin_module" className="d-center links">
                        <div className="pr-3"><i className="las la-home"></i></div>
                        <div className="links_txt">Home</div>
                    </NavLink>
                    <NavLink activeClassName="Admin_Dashboard_active" to="/admin_employement_requests" className="d-center links">
                        <div className="pr-3"><i className="las la-wave-square"></i></div>
                        <div className="links_txt">Employement Requests</div>
                    </NavLink>

                    {
                        sessionStorage.getItem('userName') === 'UsmanBadar' || sessionStorage.getItem('userName') === 'MMalahim'
                            ?
                            <>
                                <NavLink activeClassName="Admin_Dashboard_active" to="/admin_companies" className="d-center links">
                                    <div className="pr-3"><i class="las la-building"></i></div>
                                    <div className="links_txt">Companies</div>
                                </NavLink>
                                <NavLink activeClassName="Admin_Dashboard_active" to="/admin_locations" className="d-center links">
                                    <div className="pr-3"><i class="las la-street-view"></i></div>
                                    <div className="links_txt">Locations</div>
                                </NavLink>
                                <NavLink activeClassName="Admin_Dashboard_active" to="/admin_locations/:id&&find=sublocation" className="d-center links">
                                    <div className="pr-3"><i class="las la-street-view"></i></div>
                                    <div className="links_txt">Sub Locations</div>
                                </NavLink>
                                <NavLink activeClassName="Admin_Dashboard_active" to="/admin_departments" className="d-center links">
                                    <div className="pr-3"><i className="las la-list-alt"></i></div>
                                    <div className="links_txt">Departments</div>
                                </NavLink>
                                <NavLink activeClassName="Admin_Dashboard_active" to="/admin_users" className="d-center links">
                                    <div className="pr-3"><i className="las la-users"></i></div>
                                    <div className="links_txt">Users</div>
                                </NavLink>
                                <NavLink activeClassName="Admin_Dashboard_active" to="/admin_emp_attendance" className="d-center links">
                                    <div className="pr-3"><i className="las la-users"></i></div>
                                    <div className="links_txt">Employees Attendance</div>
                                </NavLink>
                                <NavLink activeClassName="Admin_Dashboard_active" to="/admin_logbook" className="d-center links">
                                    <div className="pr-3"><i className="las la-users"></i></div>
                                    <div className="links_txt">Admin Logbook</div>
                                </NavLink>
                                <NavLink activeClassName="Admin_Dashboard_active" to="/configure_attendance_request" className="d-center links">
                                    <div className="pr-3"><i className="las la-users"></i></div>
                                    <div className="links_txt">Attendance Request Configuration</div>
                                </NavLink>
                            </>
                            :
                            null
                    }
                </div>
            </div>
        </>
    )

};

export default SideBar;