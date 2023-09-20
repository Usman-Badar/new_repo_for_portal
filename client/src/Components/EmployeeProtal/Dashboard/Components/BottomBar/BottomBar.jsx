import React, { useState } from 'react';

import './BottomBar.css';
import $ from 'jquery';
import { Link } from 'react-router-dom';

const BottomBar = ( props ) => {

    const [ MenuItems, setMenuItems ] = useState( props.Items );

    const OpenBottomBar = () => {

        if ( $('.BottomBar').hasClass('BottomBarRotate') )
        {
            $('.BottomBar').removeClass('BottomBarRotate');
            $('.BottomMenu').removeClass('BottomBarMenu');
        }else
        {
            $('.BottomBar').addClass('BottomBarRotate');
            $('.BottomMenu').addClass('BottomBarMenu');
        }

    }

    return (
        <>
            <div className="BottomBar" onClick={ OpenBottomBar }>
                <i className="las la-angle-left IconBtn"></i>
            </div>
            <div className="BottomMenu">
                {
                    MenuItems.map(
                        ( val, index ) => {

                            return (
                                <div key={ index }>
                                    {
                                        val.link 
                                        ?
                                            <Link to={val.linkHref} className="text-dark">
                                                <i className={val.icon}></i>
                                                <p> {val.title} </p>
                                            </Link>
                                        :
                                        props.event
                                        ?
                                                <div onClick={ props.function }>
                                                    <i className={val.icon}></i>
                                                    <p> {val.title} </p>
                                                </div>
                                                :
                                                <div>
                                                    <i className={val.icon}></i>
                                                    <p> {val.title} </p>
                                                </div>
                                    }
                                </div>
                            )

                        }
                    )
                }
            </div>
        </>
    )

}

export default BottomBar;