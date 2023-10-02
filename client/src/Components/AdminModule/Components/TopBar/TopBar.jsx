import React, { useEffect } from 'react';

import './TopBar.css';

import $ from 'jquery';
import { NavLink } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { ShowSideBar } from '../../../../Redux/Actions/Action';

const TopBar = () => {

    const ShowBar = useSelector( ( state ) => state.SideBar.ShowSideBar );
    const dispatch = useDispatch();

    let key = 'real secret keys should be long and random';
    const encryptor = require('simple-encryptor')(key);

    useEffect(
        () => {

            $('.search i').on('click', () => {
                $('.search_dropdown').toggle(300);
            });

            $('.emp_img').on('click', () => {
                $('.emp_dropdown').toggle(300);
            });

            $('.emp_dropdown').on('click', () => {
                $('.emp_dropdown').toggle(300);
            });

            $('.content').on('click', () => {
                $('.emp_dropdown').hide(300);
            });

            $('.Dashboard_sideBar .links').on('click', () => {
                $('.emp_dropdown').hide(300);
            });

        }, []
    );

    const TrueOrFalse = () => {

        dispatch( ShowSideBar( !ShowBar ) );

    }

    return (
        <>
            <div className="Dashboard_topbar d-center">
                <div className="topbar_news d-450-none">
                    <p className="mb-0" style={{ "whiteSpace": 'nowrap' }}>
                        {/* eslint-disable-next-line jsx-a11y/no-distracting-elements */}
                        <marquee direction="left">
                            Tesla is quickly responding to the NHTSA's investigation of in-dash gaming while cars are moving. The Guardian has learned Tesla will deliver an update disabling on-the-move Passenger Play. A spokeswoman for the regulator said Tesla promised the change after
                        </marquee>
                    </p>
                </div>
                <div className=" d-450-block"></div>
                <div className="icons d-center">
                    <div className="px-3 emp_img_container">
                        <div className="emp_img" style={ { "backgroundImage" : "url(" + process.env.REACT_APP_SERVER + "'/images/users/" + sessionStorage.getItem('UserImg') + "')" } }></div>
                        {/* <div className="emp_dropdown">
                            <p className="pl-4 pb-2 mb-1 font-weight-bold border-bottom"> { sessionStorage.getItem('userName') } </p>
                            <NavLink to="/profile/personal/info" className="d-center links">
                                <div className="pr-3"><i className="las la-user"></i></div>
                                <div className="links_txt">Profile</div>
                            </NavLink>
                            <NavLink to="/" className="d-center links">
                                <div className="pr-3"><i className="las la-tasks"></i></div>
                                <div className="links_txt">Settings</div>
                            </NavLink>
                            <NavLink to="/logout" className="d-center links">
                                <div className="pr-3"><i className="las la-sign-out-alt"></i></div>
                                <div className="links_txt">Logout</div>
                            </NavLink>
                        </div> */}
                    </div>
                    <div className="threeDots d-1400-block" onClick={ TrueOrFalse }>
                        <button className="btn p-0 m-0">
                            <i className="las la-ellipsis-v la-2x" style={ { color: "var(--gray-text)" } }></i>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )

}

export default TopBar;