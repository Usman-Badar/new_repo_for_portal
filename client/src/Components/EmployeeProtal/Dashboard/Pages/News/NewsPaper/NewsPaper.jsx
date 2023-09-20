/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useEffect, useState } from 'react'
import './NewsPaper.css';

import axios from '../../../../../../axios';


import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router-dom';

const NewsPaper = () => {
    const history = useHistory();
    const [ NewsPaper, setNewsPaper ] = useState([]);

    useEffect(
        () => {

            const Data = new FormData();
            Data.append('id', window.location.href.split('/').pop());
            axios.post('/getnewspaper', Data).then( res => {

                setNewsPaper( res.data );

            } ).catch( err => {

                toast.dark( err , {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });;

            })

        }, []
    );

    return (
        <>
            <div className="NewsPaper page">
                <div className='page-content'>
                    {
                        NewsPaper.map(
                            (val, index) => {

                                return (
                                    <>
                                        <div className='d-flex align-items-center justify-content-between mb-3'>
                                            <h2 className='mb-0' style={{ fontFamily: "Roboto", textTransform: 'uppercase', letterSpacing: 10 }}>{val.news_papers_name}</h2>
                                            <button className='btn light' onClick={ () => history.goBack() }>Back</button>
                                        </div>
                                        <iframe key={index} src={val.news_paper_link}></iframe>
                                    </>
                                )

                            }
                        )
                    }
                </div>
            </div>
        </>
    )
}
 export default NewsPaper;