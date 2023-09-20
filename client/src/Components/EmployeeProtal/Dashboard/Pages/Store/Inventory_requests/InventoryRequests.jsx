import React, { lazy, Suspense, useEffect, useState } from 'react';

// CUSTOM LOADING COMPONENT
import Loading from '../../../../../UI/Loading/Loading';
import LoadingIcon from '../../../../../../images/loadingIcons/icons8-loading-circle.gif';

// REACT REDUX
import { useSelector } from 'react-redux';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getRequests, GetComments, issueToInventory, OpenRequest, newComment } from './Functions';
import axios from '../../../../../../axios';
import socket from '../../../../../../io';

const UI = lazy( () => import('./UI') );

const InventoryRequests = () => {

    const UserData = useSelector( ( state ) => state.EmpAuth.EmployeeData );

    // const [ StartLoading, setStartLoading ] = useState(false);
    const [ Requests, setRequests ] = useState();
    const [ Specifications, setSpecifications ] = useState();
    const [ Details, setDetails ] = useState();
    const [ Comments, setComments ] = useState([]);

    useEffect(
        () => {

            getRequests( axios, setRequests, setSpecifications );

            socket.on(
                'newitemrequestcomment', ( request_id ) => {
                    
                    if ( parseInt( request_id ) === parseInt( window.location.href.split('/').pop().split('=').pop() ) )
                    {
                        GetComments( axios, request_id, setComments );
                    }
            
                }
            )

        }, []
    )

    return (
        <>
            <Sus 
                content={ 
                    <UI 
                        Requests={ Requests }
                        Details={ Details }
                        Comments={ Comments }
                        Specifications={ Specifications }

                        CloseRequest={ () => { setComments([]); setDetails(); getRequests( axios, setRequests ); } }
                        OpenRequest={ ( index ) => OpenRequest( toast, index, axios, UserData.emp_id, Requests, setDetails, setComments ) }
                        newComment={ ( e ) => newComment( e, axios, Details[0][0].request_id, socket, setComments ) }
                        issueToInventory={ ( request_id, id ) => issueToInventory( request_id, id, axios, setDetails, setComments, setRequests ) }
                    /> 
                } 
            />
            <ToastContainer />
        </>
    )

}

export default InventoryRequests;

const Sus = ( props ) => {
    
    const Load = <Loading 
        display={ true }
        styling={
            {
                zIndex: 100000
            }
        }
        icon={ 
            <img 
                src={ LoadingIcon }
                className="LoadingImg"
                alt="LoadingIcon"
            /> 
        }
        txt="Please Wait"
    />

    return <Suspense fallback={ Load }> { props.content } </Suspense>

}