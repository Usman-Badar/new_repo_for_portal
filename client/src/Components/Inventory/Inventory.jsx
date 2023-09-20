import React, { lazy, Suspense, useEffect, useMemo } from 'react';

import { NavLink, useHistory } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';

import { EmployeeLogin } from '../../Redux/Actions/Action';
import $ from 'jquery';
import axios from '../../axios';
import socket from '../../io';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UI = lazy( () => import('./UI') );

const InventoryDashboard = () => {
    
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    const Menu = useSelector( ( state ) => state.EmpAuth.Menu );
    
    const history = useHistory();

    const dispatch = useDispatch();

    useEffect(
        () => {

            if ( localStorage.getItem("Token") === undefined || localStorage.getItem("Token") === null )
            {
                history.replace("/login");
            }else
            {
                const d = new FormData();
                d.append('empID', localStorage.getItem('EmpID'));
                d.append('view', 'inventory');
                axios.post('/getemployee', d).then(res => {
    
                    socket.open();
                    socket.emit(
                        'NewUser', localStorage.getItem('EmpID')
                    );
                    
                    dispatch(EmployeeLogin(res.data));
    
                }).catch(err => {
    
                    toast.dark(err, {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
    
                });
            }


        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ dispatch ]
    );

    const FormsLinks = ( className, options ) => {

        if ($('.' + className).find('i').hasClass('la-caret-right')) {
            $('.' + className + ' .la-caret-right').removeClass('la-caret-right').addClass('la-caret-down');
            $('.' + options).slideDown();
        } else {
            $('.' + className + ' .la-caret-down').removeClass('la-caret-down').addClass('la-caret-right');
            $('.' + options).slideUp();
        }

    }

    // SIDEBAR LINKS
    let content = useMemo(
        () => {

            return (
                <div className="Dashboard_links">
                    {
                        Menu.map(
                            ( val, index ) => {

                                let access = val.access === null ? [] : JSON.parse( val.access );
                                let accessKey = val.access === null ? true : false;
                                let content = null;
                                if ( AccessControls.access )
                                {
                                    for ( let x = 0; x < access.length; x++ )
                                    {
                                        if ( JSON.parse(AccessControls.access).includes( access[x] ) )
                                        {
                                            accessKey = true;
                                        }
                                    }

                                    if ( val.option_id !== null && accessKey )
                                    {
                                        content = <>
                                            <div key={ index } className={ "d-center links " + val.menu_txt + val.option_id } onClick={() => FormsLinks(val.menu_txt + val.option_id, val.option_id)}>
                                                <div className="pr-3"><i className={ val.icon_class_name }></i></div>
                                                <div className="d-flex justify-content-between w-100">
                                                    <div className="links_txt"> { val.menu_txt } </div>
                                                    <div className="links_txt"><i className="las la-caret-right" style={{ 'fontSize': '12px' }}></i></div>
                                                </div>
                                            </div>
                                            <div className={ "Forms_options _options dropoptions " + val.option_id }>
    
                                                {
                                                    Menu.map(
                                                        val2 => {
    
                                                            let sub_content = null;
                                                            if ( val2.under_menu === val.option_id )
                                                            {
                                                                sub_content = <>
                                                                    <NavLink key={ val2.menu_txt } activeClassName="Dashboard_active" to={ val2.link } className="d-center links">
                                                                        <div className="pr-3"><i className={ val2.icon_class_name }></i></div>
                                                                        <div className="links_txt">{ val2.menu_txt }</div>
                                                                    </NavLink>
                                                                </>
                                                            }
    
                                                            return sub_content;
    
                                                        }
                                                    )
                                                }
    
                                            </div>
                                        </>
                                    }else if ( val.under_menu === null && accessKey )
                                    {
                                        content = <>
                                            <NavLink key={ val.menu_txt } activeClassName="Dashboard_active" to={ val.link } className="d-center links">
                                                <div className="pr-3"><i className={ val.icon_class_name }></i></div>
                                                <div className="links_txt">{ val.menu_txt }</div>
                                            </NavLink>
                                        </>
                                    }
                                }

                                return content;

                            }
                        )
                    }
                </div> 
            )

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ AccessControls, Menu ]
    )

    return (
        <Suspense fallback={ <div>Loading...</div> }>

            <UI 
                FormsLinks={ FormsLinks }
                content={ content }
                history={ history }
            />

        </Suspense>
    )
}
export default InventoryDashboard;