import React, { useEffect, useState } from 'react';

// IMPORT CSS
import './Discussions.css';
import $ from 'jquery';
import axios from '../../../../../../../../axios';
import socket from '../../../../../../../../io';

import Modal from '../../../../../../../UI/Modal/Modal';
import Drive from './Drive/Drive';

const Discussions = ( props ) => {

    const [ Show, setShow ] = useState( false );
    const [ ReplyTo, setReplyTo ] = useState(0);

    const [ EmpData, setEmpData ] = useState({});
    const [ DriveContent, setDriveContent ] = useState([]);

    const [ Tweets, setTweets ] = useState([]);
    const [ SubTweets, setSubTweets ] = useState([]);
    const [ Employees, setEmployees ] = useState([]);

    useEffect(
        () => {

            let arr = [];
            let added = [];
            for ( let x = 0; x < props.Tweets.length; x++ )
            {
                if ( !added.includes( props.Tweets[x].emp_id ) )
                {
                    arr.push(
                        {
                            name: props.Tweets[x].name,
                            designation: props.Tweets[x].designation_name,
                            department: props.Tweets[x].department_name,
                            company: props.Tweets[x].company_name
                        }
                    )
                    added.push( props.Tweets[x].emp_id );
                }
            }

            setTweets( props.Tweets );
            setEmployees( arr );
            setEmpData( props.EmpData );

            socket.on('prsubdiscussions', ( id ) => {
                OpenReplyBox( id, '' );
            });

        }, [ props.Tweets ]
    )

    const OpenReplyBox = ( index, condition ) => {

        axios.post(
            '/getsubdiscussions',
            {
                chat_id: index
            }
        ).then(
            res => {

                setSubTweets( res.data );

                if ( condition === undefined )
                {
                    $('.Reply').not('.Reply' + index).hide(300);
                    $('.Reply' + index).toggle(300);
                    $("textarea[name='" + index + "']").val('');
                }

            }
        ).catch(
            err => {

                console.log( err );

            }
        )

    }

    const onTweet = ( e, id ) => {

        e.preventDefault();
        props.onTweet( e );
        setTimeout(() => {
            OpenReplyBox( id, '' );
        }, 300);

    }

    const AttachDriveDocs = ( id ) => {

        axios.post(
            '/getalldrive',
            {
                emp_id: EmpData.emp_id
            }
        ).then(
            res => {

                setDriveContent(
                    res.data
                );
                setReplyTo( typeof( id ) === 'number' ? id : undefined );

            }
        ).catch(
            err => {

                console.log( err );

            }
        )
        ShowHide();

    }

    const ShowHide = () => {

        setShow( !Show );

    }

    const AttachDrive = ( txt ) => {

        let body = '/***' + txt + '***/';
        props.AttachDrive( body, ReplyTo );
        ShowHide();

    }

    return (
        <div className="PRDiscussions">
            <Modal show={ Show } Hide={ ShowHide } content={ <Drive AttachDrive={ AttachDrive } data={ DriveContent } /> } />
            
            <div className="Left">

                {/* USER CAN TWEET */}
                <form className="TweetBox" onSubmit={ props.onTweet }>
                    <textarea 
                        onChange={ props.onTweetboxChange }
                        placeholder="Enter your message" 
                        className="form-control w-100"
                        name="tweet"
                        style={
                            {
                                fontSize: '13px'
                            }
                        }
                        required
                     />
                    <div>
                        <button type='submit' className="btn btn-block border-light">Send</button>
                        <button 
                            type='button' 
                            className="btn btn-block border-light"
                            onClick={ AttachDriveDocs }
                        >
                            <i className="las la-thumbtack" style={ { fontSize: '17px' } }></i>
                        </button>
                    </div>
                </form>
                <div className="TweetContainer" id="TweetContainer">
                    {
                        Tweets.map(
                            ( val, index ) => {

                                const d = new Date( val.date );

                                return (
                                    <div className="Tweet" key={ index }>

                                        <div className="upper">
                                            <div className="emp_img" style={ { backgroundImage: "url('images/employees/" + val.emp_image + "')" } }></div>
                                            <div>
                                                <p className="font-weight-bold">{ val.name }</p>
                                                <p> { val.designation_name } in { val.department_name } Department, { val.company_name } </p>
                                            </div>
                                        </div>

                                        <div className="body">
                                            <p>
                                                {
                                                    val.body.includes('/***')
                                                    ?
                                                    <img 
                                                        src={ 'images/drive/' + val.body.split('/***')[1].split('***')[0] } 
                                                        alt="discussion attachment"
                                                        width="100%"
                                                     />
                                                    :
                                                    val.body
                                                }
                                            </p>
                                        </div>

                                        <div className='footer'>
                                            <div>
                                                <p className="font-weight-bold">{ d.toDateString() } at { val.time }</p>
                                            </div>
                                            <div>
                                                <p onClick={ () => OpenReplyBox( val.chat_id ) } className="font-weight-bold">Reply</p>
                                            </div>
                                        </div>
                                        

                                        <form onSubmit={ ( e ) => onTweet( e, val.chat_id ) } className={ "Reply Reply" + val.chat_id }>
                                            {
                                                SubTweets.map(
                                                    ( value, index ) => {

                                                        const d = new Date( val.date );

                                                        return (
                                                            <div key={ index } className="SubTweet">
                                                                <div>
                                                                    <div className="branch"></div>
                                                                </div>
                                                                <div>
                                                                    <div className="upper">
                                                                        <div className="emp_img" style={{ backgroundImage: "url('images/employees/" + value.emp_image + "')" }}></div>
                                                                        <div>
                                                                            <p className="font-weight-bold">{value.name}</p>
                                                                            <p> {value.designation_name} in {value.department_name} Department, {value.company_name} </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="body">
                                                                        {
                                                                            value.body.includes('/***')
                                                                                ?
                                                                                <img
                                                                                    src={'images/drive/' + value.body.split('/***')[1].split('***')[0]}
                                                                                    alt="discussion attachment"
                                                                                    width="100%"
                                                                                />
                                                                                :
                                                                                <p>
                                                                                    { value.body }
                                                                                </p>
                                                                        }
                                                                    </div>
                                                                    <div className='footer'>
                                                                        <div>
                                                                            <p className="font-weight-bold">{d.toDateString()}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-weight-bold">{val.time}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )

                                                    }
                                                )
                                            }
                                            <textarea
                                                onChange={ props.onTweetboxChange }
                                                placeholder="Enter your message" 
                                                className="form-control mt-2"
                                                name={ val.chat_id }
                                                style={
                                                    {
                                                        fontSize: '12px'
                                                    }
                                                }
                                             />
                                            <div className="d-flex justify-content-end">
                                                <button
                                                    type='button'
                                                    className="btn btn-sm btn-light mt-1 px-3"
                                                    onClick={ () => AttachDriveDocs( val.chat_id ) }
                                                >
                                                    <i className="las la-thumbtack" style={{ fontSize: '15px' }}></i>
                                                </button>
                                                <button type="submit" className="btn btn-sm btn-light mt-1">Send</button>
                                            </div>
                                        </form>

                                    </div>
                                )

                            }
                        )
                    }
                </div>

            </div>

            <div className="Right">

                <h5 className="font-weight-bolder">Members</h5>
                <hr />
                {
                    Employees.map(
                        ( val, index ) => {

                            return (
                                <div className="Emp" key={ index }>
                                    <p className="font-weight-bold"> { val.name } </p>
                                    <p>{ val.designation } in { val.department } Department, {val.company }</p>
                                </div>
                            )

                        }
                    )
                }

            </div>

        </div>
    );
}

export default Discussions;