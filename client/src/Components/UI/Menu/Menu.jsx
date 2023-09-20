import React, { useEffect } from 'react';
import './Menu.css';
import $ from "jquery";
import { Link } from 'react-router-dom';

const Menu = (props) => {

    useEffect(
        () => {
            $('.Speeddail_Grid').slideToggle(0);
        }, []

    )
    const ShowMenuGrid = () => {
        $('.Menu_Speeddail .Speeddail_Grid').slideToggle(200);
        
        if ( $('.Menu_Speeddail .Menu_Speeddail_circle .las').hasClass('la-bars') )
        {
            $('.Menu_Speeddail .Menu_Speeddail_circle .las').removeClass('la-bars');
            $('.Menu_Speeddail .Menu_Speeddail_circle .las').addClass('la-times');
        }else
        {
            $('.Menu_Speeddail .Menu_Speeddail_circle .las').removeClass('la-times');
            $('.Menu_Speeddail .Menu_Speeddail_circle .las').addClass('la-bars');      
        }

    }
    return (
        <>
            <div className="Menu">
                {
                    props.data.length > 0
                        ?
                        <>
                            <div className="Menu_Grid">
                                {
                                        props.data.map(
                                            (val, index) => {
                                                return (
                                                    <>
                                                        {
                                                            val?
                                                            val.txt
                                                            ?
                                                            val.link ?
                                                                <Link to={val.href}>
                                                                    <button><p className="font-weight-bolder mb-0">{val.txt}</p></button>
                                                                </Link>
                                                            :
                                                                <button onClick={ () => val.func() }><p className="font-weight-bolder mb-0">{val.txt}</p></button>
                                                            :
                                                            null
                                                            :
                                                            null
                                                        }
                                                    </>
                                                )
                                            }
                                        )
                                    }
                            </div>
                            <div className="Menu_Speeddail">
                                <div className="Menu_Speeddail_circle" onClick={ShowMenuGrid}>
                                    <i class="las la-times"></i>
                                </div>
                                <div className="Speeddail_Grid">
                                    {
                                        props.data.map(
                                            (val, index) => {

                                                return (
                                                    <>
                                                        {
                                                            val?
                                                            val.txt
                                                            ?
                                                            val.link ?
                                                                <Link to={val.href}>
                                                                    <div key={index}>
                                                                        <div className={ "mb-1 Speeddail_Grid1 divs" + index }><i className={val.icon}></i></div>
                                                                        <p>{val.txt}</p>
                                                                    </div>
                                                                </Link>
                                                                :
                                                                <div className="clicks" key={index} onClick={ () => val.func() }>
                                                                    <div className={ "mb-1 Speeddail_Grid1 divs" + index }><i className={val.icon}></i></div>
                                                                    <p>{val.txt}</p>
                                                                </div>
                                                            :
                                                            null
                                                            :
                                                            null
                                                        }
                                                    </>
                                                )
                                            }
                                        )
                                    }
                                </div>
                            </div>
                        </>
                        :
                        null
                }
            </div>
        </>
    )
}
export default Menu;