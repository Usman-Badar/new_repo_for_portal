import React, { useEffect, useState } from 'react';

import './Breadcrumbs.css';

const Breadcrumbs = () => {

    const [ Locate, setLocate ] = useState(<></>);

    useEffect(
        () => {
            
            setInterval(() => {

                let hrefs = window.location.href.split('/').pop();
                let getLocation = hrefs.toLowerCase();
                
                let txt = <><span className="p-0 m-0 pl-1 text-capitalize"> { getLocation } </span></>;
                setLocate(txt);

            }, 100);
        
        }, []
    )

    return (
        <>
            <div className="Breadcrumbs">
                <span className="p-0 m-0 pl-1 text-capitalize">Home</span> <i className="las la-angle-double-right m-0 p-0"></i>
                { Locate }
            </div>
        </>
    )
    
};

export default Breadcrumbs;