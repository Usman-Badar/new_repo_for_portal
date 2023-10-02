import React, { useEffect, useState } from 'react';

import './DailyChat.css';
import loading from '../../../../../../../images/loadingIcons/icons8-iphone-spinner.gif';

const DailyChat = React.memo(

    (props) => {

        const [Chat, setChat] = useState([]);
        const [LoadingState, setLoadingState] = useState(false);
        const [Calender, setCalender] = useState(new Date());
        const [EmpID, setEmpID] = useState();
        const [ChatEmployee, setChatEmployee] = useState({});
        const [CurrentEmployeeData, setCurrentEmployeeData] = useState({});

        useEffect(
            () => {

                setLoadingState(props.LoadingState)
                setChat(props.Chat)
                setCalender(props.Calender)
                setEmpID(props.EmpID)
                setChatEmployee(props.ChatEmployee)
                setCurrentEmployeeData(props.CurrentEmployeeData)

            }, [props.LoadingState, props.Chat, props.Calender, props.EmpID, props.ChatEmployee, props.CurrentEmployeeData]
        );

        return (
            <>
                {
                    LoadingState
                    ?
                    <div className={LoadingState ? "LoadingStateForDailyChat" : "LoadingStateForDailyChat d-none"}>
                        <img
                            src={loading}
                            alt="Please wait....."
                            width="50"
                            height="50"
                            className="rounded-circle"
                        />
                    </div>
                    :null
                }
                {
                    Chat.map(
                        (val, index) => {

                            let src = '';
                            if (props.encryptor.decrypt(val.chat_body).includes('/***')) {
                                src = props.encryptor.decrypt(val.chat_body).split('/***')[1].split('***')[0];
                            }


                            const chatDate = new Date(val.send_date);

                            let content = null;
                            if (Calender.toDateString() === new Date().toDateString()) {
                                if (index - 1 >= 0) {

                                    let prevDate = new Date(Chat[index - 1].send_date).toDateString();
                                    let currDate = new Date(Chat[index].send_date).toDateString();

                                    if (currDate !== prevDate) {
                                        content = <p className="TweetDate"> {currDate}</p>
                                    }

                                } else if (index === 0) {
                                    content = <p className="TweetDate"> {new Date(Chat[index].send_date).toDateString()}</p>
                                }
                            }

                            return (
                                <>
                                    {
                                        Calender.toDateString() === new Date().toDateString()
                                            ?
                                            <>
                                                {content}
                                                <div key={index} className={val.sender_id !== EmpID ? "Tweet" : "Tweet owner"}>
                                                    <p className="Tweeter"> {val.sender_id !== EmpID ? ChatEmployee.name : CurrentEmployeeData.name}</p>
                                                    <div className="TweetBox">
                                                        {
                                                            props.encryptor.decrypt(val.chat_body).includes('/***')
                                                                ?
                                                                <img
                                                                    src={process.env.REACT_APP_SERVER+'/images/drive/' + src}
                                                                    width="100%"
                                                                    height="auto"
                                                                    alt="drive attachment"
                                                                />
                                                                :
                                                                <>
                                                                    {props.encryptor.decrypt(val.chat_body)}
                                                                </>
                                                        }
                                                    </div>
                                                    <p className="TweetTime">
                                                        {
                                                            val.sender_id !== EmpID
                                                                ?
                                                                null
                                                                :
                                                                <>
                                                                    {
                                                                        val.read_status === 'Read'
                                                                            ?
                                                                            <i style={{ fontSize: '12px !important' }} className="las la-check-double mr-1"></i>
                                                                            :
                                                                            <i style={{ fontSize: '12px !important' }} className="las la-check mr-1"></i>
                                                                    }
                                                                </>
                                                        }
                                                        {props.tConvert(val.send_time)}
                                                    </p>
                                                </div>
                                            </>
                                            :
                                            chatDate.toDateString() === Calender.toDateString()
                                                ?
                                                <>
                                                    <div key={index} className={val.sender_id !== EmpID ? "Tweet" : "Tweet owner"}>
                                                        <p className="Tweeter"> {val.sender_id !== EmpID ? ChatEmployee.name : CurrentEmployeeData.name}</p>
                                                        <div className="TweetBox">
                                                            {
                                                                props.encryptor.decrypt(val.chat_body).includes('/***')
                                                                    ?
                                                                    <img
                                                                        src={process.env.REACT_APP_SERVER+'/images/drive/' + src}
                                                                        width="100%"
                                                                        height="auto"
                                                                        alt="drive attachment"
                                                                    />
                                                                    :
                                                                    <>
                                                                        {props.encryptor.decrypt(val.chat_body)}
                                                                    </>
                                                            }
                                                        </div>
                                                        <p className="TweetTime">
                                                            {
                                                                val.read_status === 'Read'
                                                                    ?
                                                                    <i style={{ fontSize: '12px !important' }} className="las la-check-double mr-1"></i>
                                                                    :
                                                                    <i style={{ fontSize: '12px !important' }} className="las la-check mr-1"></i>
                                                            }
                                                            {props.tConvert(val.send_time)}
                                                        </p>
                                                    </div>
                                                </>
                                                :
                                                null
                                    }
                                </>
                            )

                        }
                    )
                }
            </>
        );
    }

)

export default DailyChat;