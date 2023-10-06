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
                <div className="topbar_news d-450-none"></div>
                <div className=" d-450-block"></div>
                <div className="icons d-center">
                    <div className="px-3 emp_img_container"></div>
                </div>
            </div>
        </>
    )

}

export default TopBar;