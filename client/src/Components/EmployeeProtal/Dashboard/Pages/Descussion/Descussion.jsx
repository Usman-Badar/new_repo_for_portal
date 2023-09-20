import React, { useEffect, useState } from 'react';

import './Descussion.css';
import AddNewPost from './AddNewPost/AddNewPost';
import $ from 'jquery';
import axios from '../../../../../axios';

const Descussion = () => {

    const [ PrevDescussions, setPrevDescussions ] = useState([]);

    useEffect(
        () => {

            $('.comments').on('click', function() {
                alert("click");
            })
            
            getPrevDescussions();

        }, []
    )

    const getPrevDescussions = () => {

        axios.get( '/prevdescussions' ).then( response => {

            setPrevDescussions( response.data );

        } ).catch( error => {

            console.log( error );

        } );

    }

    return (
        <>
            <div className="Descussion container-fluid pt-3">
                <AddNewPost />
                {
                    PrevDescussions.length === 0 ? null :
                    PrevDescussions.map(
                        ( val, index ) => {

                            let d = new Date(val.date.split('T').shift());

                            let monthNames = ["January", "February", "March", "April", "May", "June",
                                "July", "August", "September", "October", "November", "December"
                            ];

                            let cTime = null;
                            var hours = val.time.split(':').shift();
                            var minutes = val.time.split(':')[1].substring(1,2);
                            var ampm = hours >= 12 ? 'pm' : 'am';
                            hours = hours % 12;
                            hours = hours ? hours : 12; // the hour '0' should be '12'
                            minutes = minutes < 10 ? '0' + minutes : minutes;
                            var fullTimes = hours + ':' + minutes + ' ' + ampm;
                            cTime = fullTimes.toString();

                            return (
                                    <div className="previous_descussions animate__animated animate__fadeInDown" key={ index }>
                                        <div className="d-flex justify-content-start align-items-center mb-3">
                                            <div className="emp_img" style={{ 'backgroundImage': "url('images/employees/" + val.emp_image + "')" }}></div>
                                            <div className="pl-3">
                                                <p className="mb-0 color-c-green font-weight-light">{ val.name + ' ' + val.father_name }</p>
                                                <p className="mb-0 text-secondary">{ d.getDate() + ' ' + monthNames[d.getMonth()] + ' ' + d.getFullYear() + ' at ' + cTime }</p>
                                            </div>
                                        </div>
                                        <img src={ "images/descussions/" + val.image } width="100%" alt="Post Img" />
                                        <div className="description">
                                            { val.description }
                                        </div>
                                    </div>
                            )
                        }
                    )
                }
            </div>
        </>
    )

}

export default Descussion;