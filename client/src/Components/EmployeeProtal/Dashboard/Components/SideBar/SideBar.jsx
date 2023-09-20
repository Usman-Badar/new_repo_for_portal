/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useEffect } from 'react';

import './SideBar.css';

import $ from 'jquery';
import { useSelector } from 'react-redux';

const SideBar = ( props ) => {

    const [ Data, setData ] = useState();

    const ShowBar = useSelector( ( state ) => state.SideBar.ShowSideBar );

    useMemo(
        () => {

            return setData( props.Data );

        }, [ props.Data ]
    )

    useEffect(
        () => {

            if (  window.innerWidth <= 1280 )
            {
                props.SideBarClose();
            }else
            if ( window.innerWidth <= 600 )
            {
                $('.Dashboard_sideBar .links').on('click', () => {
                    props.SideBarClose();
                });
            }

        }, [ Data ]
    )

    return (
        <>
            <div className={ ShowBar ? "Dashboard_sideBar ShowBar" : "Dashboard_sideBar" }>

                <div className="Dashboard_logo d-center">
                    <h5 style={ { whiteSpace: 'nowrap', fontSize: '16px' } } className="mb-0 logo"> { props.title ? props.title : "Employee Portal" } </h5>
                    <div>
                        <button 
                            className="btn btn-sm p-0 m-0 sideBar_bars" 
                            onClick={ props.SideBarClose }
                        >
                            <i className={ ShowBar ? "las la-times cross" : "" }></i>
                        </button>
                    </div>
                </div>

                <div className="linksContainer">
                    {/* SIDEBAR CONTENT */}
                    {
                        Data
                    }
                </div>
            </div>
        </>
    )

};

export default SideBar;