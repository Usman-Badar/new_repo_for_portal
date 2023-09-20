import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './Breadcrumbs.css';

const Breadcrumbs = () => {

    const [ Locate, setLocate ] = useState();

    useEffect(
        () => {

            setInterval(() => {
                let locations = window.location.href.split('/').reverse();
                let crrntLocation = [];
                for ( let x = 0; x < locations.length; x++ )
                {
                    if ( locations[x] === '#' )
                    {
                        break;
                    }else
                    {
                        crrntLocation[x] = locations[x];
                    }
                }

                setLocate(crrntLocation.reverse().shift());
            }, 500);
        
        }, []
    )

    return (
        <>
            <div className="Breadcrumbs">
                <Link to='/admin_module' className="p-0 m-0 pl-1 text-capitalize text-dark">Home</Link> <i className="las la-angle-double-right m-0 p-0"></i>
                <Link to={ '/' + Locate } className="p-0 m-0 pl-1 text-capitalize text-dark"> { Locate } </Link>
            </div>
        </>
    )
    
};

export default Breadcrumbs;