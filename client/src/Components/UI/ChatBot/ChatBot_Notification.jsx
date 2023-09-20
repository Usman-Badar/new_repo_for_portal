import React, { useEffect } from 'react';
import './ChatBot_Notification.css';
import $ from "jquery";
// import spoken from 'spoken/build/spoken';

import Robot from '../../../images/robot.png';
import Typewriter from 'typewriter-effect';

import { useSelector } from 'react-redux';

const ChatBot_Notification = () => {

    const Data = useSelector( ( state ) => state.Chatbot.Data );

    useEffect(
        () => {

            $('.Speeddail_Grid').slideToggle(0);

        }, []
    )
    
    const ShowTheMenu = () => {

        $('.ChatBot_Notification_Speeddail .Speeddail_Grid').slideToggle(200);

        if ( $('.ChatBot_Notification_Speeddail .Button .las').hasClass('la-comment-dots') )
        {

            $('.ChatBot_Notification_Speeddail .Button .las').removeClass('la-comment-dots');
            $('.ChatBot_Notification_Speeddail .Button .las').addClass('la-times');

        }else
        {

            $('.ChatBot_Notification_Speeddail .Button .las').removeClass('la-times');
            $('.ChatBot_Notification_Speeddail .Button .las').addClass('la-comment-dots');

        }
    }

    return (
        <>
            <div className="ChatBot_Notification">
                {
                    Data
                    ?
                    Data.length === 0
                    ?
                    null
                    :
                    <>
                            <div className="ChatBot_Notification_Speeddail">
                                <img className="chatBotRobot" src={ Robot } alt='Robot' onClick={ ShowTheMenu } />
                                <div className="Speeddail_Grid">
                                    {
                                        Data.map(
                                            (val, index) => {

                                                return (
                                                    <>
                                                        {
                                                            <div key={index}>
                                                                <div className="mb-1 Speeddail_Grid1">
                                                                    <p id="chatbotTxt">
                                                                        {
                                                                            typeof( val.txt ) === 'string'
                                                                            ?
                                                                                <Typewriter
                                                                                    options={{
                                                                                        delay: 100
                                                                                    }}

                                                                                    onInit={
                                                                                        (typewriter) => {
                                                                                            typewriter
                                                                                            .typeString(val.txt)
                                                                                            .start()
                                                                                        }
                                                                                    }
                                                                                />
                                                                            :
                                                                            val.txt
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
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
export default ChatBot_Notification;