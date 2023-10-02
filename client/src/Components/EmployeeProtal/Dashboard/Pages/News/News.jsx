/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import './News.css';

import axios from '../../../../../axios';
import { useHistory } from 'react-router-dom';


import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const News = () => {

    const history = useHistory();
    const [ Notices, setNotices ] = useState([]);
    const [ NewsPapers, setNewsPapers ] = useState([]);
    const [ Status, setStatus ] = useState('notice');

    useEffect(
        () => {
            if ( sessionStorage.getItem('NoticeStatus') )
            {
                setStatus(sessionStorage.getItem('NoticeStatus'));
            }
        }, []
    );
    useEffect(
        () => {
            if ( Status === 'notice' && Notices.length === 0 )
            {
                loadNotices();
            }
            if ( Status === 'news' && NewsPapers.length === 0 )
            {
                loadNews();
            }
        }, [Status]
    );
    const loadNotices = () => {
        axios.get('/get_all_notices').then( res => {
            setNotices( res.data );
        } ).catch( err => {
            console.log(err);
        } );
    }
    const loadNews = () => {
        axios.get('/getallnewspapers').then( res => {
            setNewsPapers( res.data );
        } ).catch( err => {
            console.log(err);
        } );
    }
    const GoToNewsPaper = ( id ) => {
        history.push('/news/newspaper/' + id);
    }
    const GoToNotice = ( url ) => {
        window.open(url, "_blank");
    }
    return (
        <>
            <div className='page'>
                <div className='page-content'>
                    <div className="d-flex align-items-center justify-content-between">
                        <h3 className="heading">
                            Notices & News
                            <sub>All portal notifications and news</sub>
                        </h3>
                    </div>
                    <hr />
                    <ul className="nav nav-tabs mb-3">
                        <li className="nav-item" onClick={ () => { setStatus('notice'); sessionStorage.setItem('NoticeStatus', 'notice') } }>
                            <a className={ Status === 'notice' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Notices</a>
                        </li>
                        <li className="nav-item" onClick={ () => { setStatus('news'); sessionStorage.setItem('NoticeStatus', 'news') } }>
                            <a className={ Status === 'news' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>News</a>
                        </li>
                    </ul>
                    {
                        Status === 'news'
                        ?
                        <>
                            {
                                NewsPapers.length === 0
                                ?
                                <h6 className='text-center'>Loading....</h6>
                                :
                                <div className="Employee_Portal_news">
                                    {
                                        NewsPapers.map(
                                            (val, index) => {

                                                return (
                                                    <>
                                                        <div className='Employee_Portal_news_divs popUps' key={index} onClick={() => { GoToNewsPaper(val.id) }}>
                                                            <div className='d-flex flex-column justify-content-between h-100 w-100'>
                                                                <img src={process.env.REACT_APP_SERVER+'/images/news_papers/' + val.news_papers_title_image} alt="news papers" />
                                                                <p className='mb-0' style={ { fontSize: '12px' } }>{val.news_papers_name}</p>
                                                            </div>
                                                        </div>
                                                    </>
                                                )

                                            }
                                        )
                                    }
                                </div>
                            }
                        </>
                        :
                        <>
                            {
                                Notices.length === 0
                                ?
                                <h6 className='text-center'>Loading....</h6>
                                :
                                <div className="Employee_Portal_news Employee_Portal_notices">
                                    {
                                        Notices.map(
                                            (val, index) => {
                                                return (
                                                    <>
                                                        <div className='Employee_Portal_news_divs popUps' key={index} onClick={() => { GoToNotice(process.env.REACT_APP_SERVER + '/assets/portal/assets/notices/' + val.url) }}>
                                                            <div className='d-flex flex-column justify-content-between align-items-center h-100 w-100'>
                                                                {
                                                                    val.type === 'pdf'
                                                                    ?
                                                                    <iframe src={process.env.REACT_APP_SERVER + '/assets/portal/assets/notices/' + val.url} width="100%" style={{ minHeight: '300px', height: "100%" }}></iframe>
                                                                    :
                                                                    <img src={process.env.REACT_APP_SERVER + '/assets/portal/assets/notices/' + val.url} alt="news papers" />
                                                                }
                                                                <p className='mb-3' style={ { fontSize: '12px' } }>
                                                                    <b>{val.title}</b>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            }
                                        )
                                    }
                                </div>
                            }
                        </>
                    }
                </div>
            </div>
        </>
    )
}
export default News;