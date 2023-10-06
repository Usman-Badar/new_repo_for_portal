/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from 'react';

import './SideBar.css';

import { useSelector } from 'react-redux';

const SideBar = ( props ) => {

    const [ Data, setData ] = useState();
    const ShowBar = useSelector( ( state ) => state.SideBar.ShowSideBar );

    useMemo(() => {
        return setData( props.Data );
    }, [props.Data])

    return (
        <>
            <div className={ ShowBar ? "Dashboard_sideBar ShowBar" : "Dashboard_sideBar" }>
                <div className="Dashboard_logo d-center">
                    <div><h5 style={ { whiteSpace: 'nowrap', color: '#000 !important' } } className="mb-0 logo font-weight-bold"> { props.title ? props.title : "EMPLOYEE PORTAL" } </h5></div>
                </div>
                <div className="linksContainer">{Data}</div>
            </div>
        </>
    )

};

export default SideBar;