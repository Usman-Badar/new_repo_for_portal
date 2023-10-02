import React, { useEffect, useState } from "react";
import './Leave_Application_Details.css';
import $ from 'jquery';
import Request from "./Request/Request";

import HistoryItm from '../Forms/Leave_Application/Component/HistoryItm/HistoryItm';
import axios from "../../../../../axios";

import Model from '../../../../UI/Modal/Modal';
import Menu from '../../../../UI/Menu/Menu';

const Leave_Application_Details = () => {

    const moment = require('moment');

    const [ ShowX, setShowX ] = useState(false);
    const [ EmpSearch, setEmpSearch ] = useState(
        {
            value: ''
        }
    );
    const [ Requests, setRequests ] = useState([]);
    const [ EmpHistory, setEmpHistory ] = useState([]);
    const [ RequestDetails, setRequestDetails ] = useState([]);

    const [ LeaveTook, setLeaveTook ] = useState([]);
    const [ ModalShow, setModalShow ] = useState( false );
    const [ ModalContent, setModalContent ] = useState();

    const [ Data, setData ] = useState([]);


    useEffect(
        () => {
            $('.shortDetails').slideUp(0);
            $('.Leave_Application_Details').attr('id', 'getallempleaves');
            $('.Details_Grid_Right').hide();
            $('.Grid_Right2').hide();

            getAllRequests();

            setData(
                [
                    {
                        icon: 'lar la-comments',
                        txt: 'Short Leaves',
                        link: false,
                        func: () => OpenShortLeaveBox()
                    },
                    {
                        icon: 'las la-comment-dots',
                        txt: 'Leaves',
                        link: false,
                        func: () => OpenLeaveBox('contacts')
                    }
                ]
            )

        }, []
    );

    const OpenLeaveBox = () => {

        $('.Leave_Application_Details').removeAttr('id');
        $('.Leave_Application_Details').attr('id', 'getallempleaves');
        getAllRequests();

    }

    const OpenShortLeaveBox = () => {

        $('.Leave_Application_Details').removeAttr('id');
        $('.Leave_Application_Details').attr('id', 'getallempshrtleaves');
        getAllRequests();

    }

    const getAllRequests =() => {

        axios.get('/' + $('.Leave_Application_Details').attr('id')).then( res => {

            let arr = [];
            let idArr = [];
            for ( let x = 0; x< res.data.length; x++ )
            {

                if ( res.data[x].emp_id !== null && !idArr.includes( res.data[x].emp_id ) )
                {
                    arr.push( res.data[x] );
                    idArr.push( res.data[x].emp_id );
                }

            }

            if ( arr.length )
            {
                setRequests( arr );
            }

        } ).catch( err => {

            console.log( err );

        } );

    }

    
    const searchcancle = ( e ) =>{
        setEmpSearch( { value: e.target.value } );
        if ( $('.Menusearch').val().length > 0 )
            {
                setShowX( true );
                // OnSearch( e.target.value );
            }else
            {
                // OnSearch( e.target.value );
                setShowX( false );
            }

    }
    const clickcross = () =>{
        setEmpSearch( { value: '' } );
        setShowX( false );
    }

    const openLeaves = () => {

        $('.Details_Grid_Left').show();
        $('.Details_Grid_Right').hide();

    }

    const openDiv1 = () => {

        $('.Details_Grid_Left').hide();
        $('.Details_Grid_Right').show();
        $('.Grid_Right2').hide();
        $('.Grid_Right1').show();

    }

    const openDiv2 = () => {

        $('.Grid_Right1').hide();
        $('.Grid_Right2').show();

    }

    const ShowShortDetails = ( divID ) => {

        $('.shortDetails').slideUp(500);
        $('.' + divID).slideToggle(500);

    }

    const UpdateStatusToWating = ( empID, leaveID, leaveType ) => {

        const Data = new FormData();
        Data.append('empID', empID);
        Data.append('leave_id', leaveID);
        Data.append('handleBY', localStorage.getItem('EmpID'));
        Data.append('leave', leaveType);
        axios.post('/updateleavestatustowaiting', Data).then(() => {

            const Data2 = new FormData();
            Data2.append('eventID', 2);
            Data2.append('receiverID', empID);
            Data2.append('senderID', 2004);
            Data2.append('Title', localStorage.getItem('name'));
            Data2.append('NotificationBody', localStorage.getItem('name') + " has viewed your leave application");
            axios.post('/newnotification', Data2).then(() => {

                axios.post('/sendmail', Data2).then(() => {

                })
            })

        }).catch(err => {

            console.log(err);

        });

    }

    const UpdateStatusToAcception = ( empID, leaveID, leaveType ) => {

        const Data = new FormData();
        Data.append('empID', empID);
        Data.append('leave_id', leaveID);
        Data.append('handleBY', localStorage.getItem('EmpID'));
        Data.append('leave', leaveType);
        Data.append('Remarks', $('.down textarea[name=remarks]').val());
        axios.post('/updateleavestatustoaccept', Data).then(() => {

            if ( leaveType === 'leave' )
            {
                let dates = null;
    
                function getDates(startDate, stopDate) {
                    var dateArray = [];
                    var currentDate = moment(startDate);
                    var stopDate = moment(stopDate);
                    while (currentDate <= stopDate) {
                        dateArray.push( moment(currentDate).format('YYYY-MM-DD') )
                        currentDate = moment(currentDate).add(1, 'days');
                    }
                    return dateArray;
                }
    
                dates = getDates(RequestDetails[0].leave_from === null ? '0000-00-00' : RequestDetails[0].leave_from.substring(0,10), RequestDetails[0].leave_to === null ? '0000-00-00' : RequestDetails[0].leave_to.substring(0,10));
    
                const Data2 = new FormData();
                Data2.append('empID', empID);
                Data2.append('leaveID', RequestDetails[0].leave_id);
                Data2.append('leaveFrom', RequestDetails[0].leave_from);
                Data2.append('oneDayLeave', RequestDetails[0].one_day_leave);
                Data2.append('dates', JSON.stringify(dates));
                axios.post('/markleave', Data2).then(() => {
    
                }).catch(err => {
        
                    console.log(err);
        
                });

                const Data3 = new FormData();
                Data3.append('eventID', 2);
                Data3.append('receiverID', empID);
                Data3.append('senderID', 2004);
                Data3.append('Title', localStorage.getItem('name'));
                Data2.append('NotificationBody', localStorage.getItem('name') + " has accepted your leave application");
                axios.post('/newnotification', Data3).then(() => {

                    axios.post('/sendmail', Data3).then(() => {

                    })
                })
            }

        }).catch(err => {

            console.log(err);

        });

    }

    const UpdateStatusToRejection = ( empID, leaveID, leaveType ) => {

        const Data = new FormData();
        Data.append('empID', empID);
        Data.append('leave_id', leaveID);
        Data.append('handleBY', localStorage.getItem('EmpID'));
        Data.append('leave', leaveType);
        Data.append('Remarks', $('.down textarea[name=remarks]').val());
        axios.post('/updateleavestatusreject', Data).then(() => {

            const Data2 = new FormData();
            Data2.append('eventID', 2);
            Data2.append('receiverID', empID);
            Data2.append('senderID', 2004);
            Data2.append('Title', localStorage.getItem('name'));
            Data2.append('NotificationBody', localStorage.getItem('name') + " has rejected your leave application");
            axios.post('/newnotification', Data2).then(() => {

                axios.post('/sendmail', Data2).then(() => {

                })
            })
    
        }).catch(err => {

            console.log(err);

        });

    }

    const OnShowDetails = ( index, status ) => {

        setRequestDetails( [] );
        setLeaveTook( [] );
        setEmpHistory( [] );
    
        if ( status === 'sent' )
        {
            UpdateStatusToWating( Requests[index].emp_id, Requests[index].leave_id, Requests[index].leave_time ? 'short leave' : 'leave' );
        }
        
        setRequestDetails( [ Requests[index] ] );
        const Data = new FormData();
        Data.append('empID', Requests[index].emp_id);

        if ( Requests[index].leave_time )
        {
            axios.post('/getempshortleavescount', Data).then( res => {
    
                setLeaveTook(
                    [
                        {
                            leaveType: 'Short Leaves',
                            maxLeave: parseInt( res.data[0].counts ),
                            val: 32
                        }
                    ]
                );
    
                axios.post('/getallshortleaves', Data).then( res => {
    
                    setEmpHistory( res.data );
                    if ( window.outerWidth < 992 ) {
            
                        openDiv1();
            
                        setData(
                            [
                                {
                                    icon: 'lar la-comments',
                                    txt: 'Short Leaves',
                                    link: false,
                                    func: () => OpenShortLeaveBox()
                                },
                                {
                                    icon: 'las la-comment-dots',
                                    txt: 'Leaves',
                                    link: false,
                                    func: () => OpenLeaveBox('contacts')
                                },
                                {
                                    icon: 'las la-users',
                                    txt: 'Leaves',
                                    link: false,
                                    func: () => openLeaves()
                                }
                            ]
                        );
            
                    }
        
                } ).catch( err => {
        
                    console.log( err );
        
                } );
    
            } ).catch( err => {
    
                console.log( err );
    
            } );
        }else
        {
            axios.post('/getempleavescount', Data).then( res => {
    
                let arr = [];
                let val1 = 0;
                let val2 = 0;
                let val3 = 0;
                let val4 = 0;
                for ( let x= 0; x< res.data.length; x++ )
                {
                    
                    if ( !arr.includes( res.data[x].leave_type ) )
                    {
                        arr.push( res.data[x].leave_type );
                        if ( res.data[x].leave_type === "Casual" )
                        {
                            val1 = val1 + 1;
                        }
                        if ( res.data[x].leave_type === "Sick" )
                        {
                            val2 = val2 + 1;
                        }
                        if ( res.data[x].leave_type === "Privilege" )
                        {
                            val3 = val3 + 1;
                        }
                        if ( res.data[x].leave_type === "Other" )
                        {
                            val4 = val4 + 1;
                        }
                    }else
                    {
                        if ( res.data[x].leave_type === "Casual" )
                        {
                            val1 = val1 + 1;
                        }
                        if ( res.data[x].leave_type === "Sick" )
                        {
                            val2 = val2 + 1;
                        }
                        if ( res.data[x].leave_type === "Privilege" )
                        {
                            val3 = val3 + 1;
                        }
                        if ( res.data[x].leave_type === "Other" )
                        {
                            val4 = val4 + 1;
                        }
                    }
    
                }
                setLeaveTook(
                    [
                        {
                            leaveType: 'Casual',
                            maxLeave: val1,
                            val: 10
                        },
                        {
                            leaveType: 'Sick',
                            maxLeave: val2,
                            val: 8
                        },
                        {
                            leaveType: 'Privilege',
                            maxLeave: val3,
                            val: 14
                        },
                        {
                            leaveType: 'Other',
                            maxLeave: val4,
                            val: 32
                        }
                    ]
                );

                if ( window.outerWidth < 992 ) {
        
                    openDiv1();
        
                    setData(
                        [
                            {
                                icon: 'lar la-comments',
                                txt: 'Short Leaves',
                                link: false,
                                func: () => OpenShortLeaveBox()
                            },
                            {
                                icon: 'las la-comment-dots',
                                txt: 'Leaves',
                                link: false,
                                func: () => OpenLeaveBox('contacts')
                            },
                            {
                                icon: 'las la-users',
                                txt: 'Leaves',
                                link: false,
                                func: () => openLeaves()
                            }
                        ]
                    );
        
                }
    
                // axios.post('/getallleaves', Data).then( res => {
    
                //     setEmpHistory( res.data );

                //     if ( window.outerWidth < 992 ) {
            
                //         openDiv1();
            
                //         setData(
                //             [
                //                 {
                //                     icon: 'lar la-comments',
                //                     txt: 'Short Leaves',
                //                     link: false,
                //                     func: () => OpenShortLeaveBox()
                //                 },
                //                 {
                //                     icon: 'las la-comment-dots',
                //                     txt: 'Leaves',
                //                     link: false,
                //                     func: () => OpenLeaveBox('contacts')
                //                 },
                //                 {
                //                     icon: 'las la-users',
                //                     txt: 'Leaves',
                //                     link: false,
                //                     func: () => openLeaves()
                //                 }
                //             ]
                //         );
            
                //     }
        
                // } ).catch( err => {
        
                //     console.log( err );
        
                // } );
    
            } ).catch( err => {
    
                console.log( err );
    
            } );
        }


    }

    const PrevRequests = ( index, status ) => {
        
        if ( window.outerWidth < 992 ) {
    
            openDiv2();

            setData(
                [
                    {
                        icon: 'lar la-comments',
                        txt: 'Short Leaves',
                        link: false,
                        func: () => OpenShortLeaveBox()
                    },
                    {
                        icon: 'las la-comment-dots',
                        txt: 'Leaves',
                        link: false,
                        func: () => OpenLeaveBox('contacts')
                    },
                    {
                        icon: 'las la-users',
                        txt: 'Leaves',
                        link: false,
                        func: () => openLeaves()
                    },
                    {
                        icon: 'las la-long-arrow-alt-left',
                        txt: 'Back',
                        link: false,
                        func: () => openDiv1()
                    }
                ]
            );

        }

        if ( status === 'sent' )
        {
            UpdateStatusToWating( EmpHistory[index].emp_id, EmpHistory[index].leave_id, Requests[index].leave_time ? 'short leave' : 'leave' );
        }

        if ( !RequestDetails[0].leave_time )
        {

            const val =
                [
                    {
                        ...RequestDetails[0],
                        leave_id: EmpHistory[index].leave_id,
                        leave_purpose: EmpHistory[index].leave_purpose,
                        leave_from: EmpHistory[index].leave_from,
                        leave_to: EmpHistory[index].leave_to,
                        days: EmpHistory[index].days,
                        request_status: EmpHistory[index].request_status
                    }
                ]

            setRequestDetails(val);

        }else
        {

            const val =
                [
                    {
                        ...RequestDetails[0],
                        leave_id: EmpHistory[index].leave_id,
                        leave_purpose: EmpHistory[index].leave_purpose,
                        leave_time: EmpHistory[index].leave_time,
                        time_to: EmpHistory[index].time_to,
                        request_status: EmpHistory[index].request_status
                    }
                ]

            setRequestDetails(val);

        }
    }

    const Acception = ( EmpID, leaveID ) => {

        UpdateStatusToAcception( EmpID, leaveID, RequestDetails[0].leave_time ? 'short leave' :  'leave' );
        setModalContent(
            <>
                <p>
                    Request Accepted Successfully
                </p>
            </>
        )

        setTimeout(() => {
            ShowHideModal();
            setRequestDetails([]);
        }, 500);

    }

    const Rejection = ( EmpID, leaveID ) => {

        UpdateStatusToRejection( EmpID, leaveID, RequestDetails[0].leave_time ? 'short leave' :  'leave' );
        setModalContent(
            <>
                <p>
                    Request Rejected Successfully
                </p>
            </>
        );

        setTimeout(() => {
            ShowHideModal();
            setRequestDetails([]);
        }, 500);

    }

    const RequestAccept = ( EmpID, leaveID ) => {

        ShowHideModal();
        setModalContent(
            <>
                <p>
                    Do You Want To Accept This Request?
                </p>
                <div className="up py-2 text-right">
                    <button className="px-3 btn btn-sm btn-primary" onClick={ () => openClose( 'down', 'up' ) }>Yes</button>
                </div>
                <div className="down py-2 text-right">
                    <form onSubmit={ () => Acception(EmpID, leaveID) }>
                        <textarea className="form-control" name="remarks" placeholder="Add Remarks (optional)"></textarea>
                        <button type='submit' className="px-3 btn btn-sm btn-primary">Send</button>
                    </form>
                </div>
            </>
        )

    }

    const openClose = ( open, close ) => {

        $('.' + close).slideUp(500);
        $('.' + open).slideDown(500);

    }

    const RequestDenied = ( EmpID, leaveID ) => {

        ShowHideModal();
        setModalContent(
            <>
                <p>
                    Do You Want To Reject This Request?
                </p>
                <div className="up py-2 text-right">
                    <button className="px-3 btn btn-sm btn-primary" onClick={ () => openClose( 'down', 'up' ) }>Yes</button>
                </div>
                <div className="down py-2 text-right">
                    <form onSubmit={ () => Rejection(EmpID, leaveID) }>
                        <textarea className="form-control" name="remarks" placeholder="Add Remarks (optional)"></textarea>
                        <button type='submit' className="px-3 btn btn-sm btn-primary">Send</button>
                    </form>
                </div>
            </>
        )

    }

    const ShowHideModal = () => {

        if ( ModalShow )
        {
            setModalShow( false );
        }else
        {
            setModalShow( true );
        }

    }

    return (
        <>
            <Model show={ ModalShow } Hide={ ShowHideModal } content={ ModalContent } />
            <Menu data={ Data } />
            <div className="Leave_Application_Details">
                <div className="Leave_Application_Details_Grid">
                    <div className="Details_Grid_Left">
                        <div className="DIV1 searchbarDiv">
                            <input type="text" value={EmpSearch.value} placeholder="Search Keywords" className="form-control Menusearch" onChange={searchcancle} />
                            {
                                !ShowX
                                    ?
                                    <i className="las la-search"></i>
                                    :
                                    <i className="las la-times" onClick={clickcross}></i>
                            }
                        </div>
                        <div className="leave_requests">
                            {
                                Requests.length === 0
                                ?
                                <h3>No Request Received</h3>
                                :
                                Requests.map(
                                    ( val, index ) => {

                                        let content = null;
                                        val.leave_time ?
                                        content = <Request 
                                                index={ index } 
                                                OnShowDetails={ () => OnShowDetails( index, val.request_status ) } 
                                                onClickListner={ () => ShowShortDetails( 'shortDetails' + index ) } 
                                                leaveType='Short Leave' 
                                                status={ val.request_status } 
                                                requestDate={ val.requested_date.substring(0,10) } 
                                                image={ process.env.REACT_APP_SERVER+'/images/employees/' + val.emp_image } 
                                                Employee={ val.name } 
                                                leaveFrom={ val.leave_time } 
                                                reason={ val.leave_purpose }
                                             />
                                        :
                                        content = <Request 
                                                index={ index } 
                                                OnShowDetails={ () => OnShowDetails( index, val.request_status ) } 
                                                onClickListner={ () => ShowShortDetails( 'shortDetails' + index ) } 
                                                leaveType='Leave' 
                                                status={ val.request_status } 
                                                requestDate={ val.requested_date.substring(0,10) } 
                                                image={ process.env.REACT_APP_SERVER+'/images/employees/' + val.emp_image } 
                                                Employee={ val.name } 
                                                leaveFrom={ val.leave_from.substring(0,10) } 
                                                leaveTo={ val.leave_to === null ? 'Single Day Leave' : val.leave_to.substring(0,10) }
                                                reason={ val.leave_purpose }
                                             />

                                        return (
                                            <>
                                                {
                                                    content
                                                }
                                            </>
                                        )

                                    }
                                )
                            }
                        </div>
                    </div>
                    {
                        RequestDetails.length === 0
                        ?
                        <div></div>
                        :
                        RequestDetails.map(
                            ( val, index ) => {

                                let dFrom = null;
                                let dTo = null;

                                let leaveFrom = null;
                                let leaveTo = null;

                                if ( val.leave_time )
                                {
                                    dFrom = val.leave_time;
                                    dTo = val.time_to;

                                    leaveFrom = dFrom;
                                    leaveTo = dTo;
                                }else
                                {
                                    dFrom = val.leave_from.substring(0,10);
                                    dTo = val.leave_to === null ? '0000-00-00' : val.leave_to.substring(0,10);

                                    leaveFrom = dFrom//(moment(dFrom).add(1, 'days')._d).toString().substring(0,15);
                                    leaveTo = dTo//(moment(dTo).add(1, 'days')._d).toString().substring(0,15);
                                }
                                

                                return (
                                    <div className="Details_Grid_Right" key={ index }>
                                        <div className="Grid_Right1" style={ { animationDelay: ( 0 + '.' + index ).toString() + 's' } }>
                                            <div className="Leave_Emp_Info">
                                                <div className="d-flex align-items-center pb-2">
                                                    <div>
                                                        <img src={ process.env.REACT_APP_SERVER+'/images/employees/' + val.emp_image } alt="DP" />
                                                    </div>
                                                    <div className="ml-3 py-2">
                                                        <p className="font-weight-bolder mb-0">{ val.name }</p>
                                                        <p className="mb-0">{ val.designation_name + ' at ' + val.company_name + ', ' + val.location_name }</p>
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-between py-2" style={{ fontSize: "13px" }}>
                                                    <p className="mb-0">Employee Code</p>
                                                    <p className="font-weight-bolder mb-0">{ val.emp_id }</p>
                                                </div>
                                                <div className="d-flex justify-content-between py-2" style={{ fontSize: "13px" }}>
                                                    <p className="mb-0">Email</p>
                                                    <p className="font-weight-bolder mb-0">{ val.email }</p>
                                                </div>
                                                <div className="d-flex justify-content-between py-2" style={{ fontSize: "13px" }}>
                                                    <p className="mb-0">Phone Number</p>
                                                    <p className="font-weight-bolder mb-0">{ val.cell }</p>
                                                </div>
                                            </div>
                                            <div className="Emp_Leave_Details">
                                                {
                                                    EmpHistory.length === 0
                                                    ?
                                                    null
                                                    :
                                                    EmpHistory.map(
                                                        ( val, index ) => {

                                                            let content = null;
                                                            val.leave_time ?
                                                            content = <HistoryItm index={ index } onClickListner={ () => PrevRequests( index, val.request_status ) } leave="SHORT LEAVE" request_status={ val.request_status } requested_date={ val.requested_date } leave_time={ val.leave_time } />
                                                            :
                                                            content = <HistoryItm index={ index } onClickListner={ () => PrevRequests( index, val.request_status ) } leave="LEAVE" request_status={ val.request_status } requested_date={ val.requested_date } date_from={ val.leave_from ? val.leave_from.substring(0,10) : null } date_to={ val.leave_to === null ? 'Single Day Leave' : val.leave_to.substring(0,10) } />

                                                            return (
                                                                <>
                                                                    {
                                                                        content
                                                                    }
                                                                </>
                                                            )

                                                        }
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className="Grid_Right2">
                                            <div className="Right2_TopBox mb-3">
                                                {
                                                    LeaveTook.length === 0
                                                    ?
                                                    null
                                                    :
                                                    LeaveTook.map(
                                                        ( value, index )=> {

                                                            return (
                                                                <div style={ { animationDelay: ( 0 + '.' + index ).toString() + 's' } } key={ index } className={ "TopBox_Leave TopBox_Leave" + index }><div><p>{ value.maxLeave + '/' + value.val }</p><p>{ value.leaveType }</p></div></div>
                                                            )

                                                        }
                                                    )
                                                }
                                            </div>
                                            <div className="Right2_BottomBox" style={ { animationDelay: ( 0 + '.' + index ).toString() + 's' } }>
                                                {
                                                    val.leave_time
                                                    ?
                                                    <div className="BottomBox_info">
                                                        <div className="font-weight-bolder">Leave Time</div>
                                                        <div className="font-weight-bolder">Leave Date</div>
                                                        <div></div>
                                                        <div>{ val.leave_time }</div>
                                                        <div> { val.date.substring(0,10) } </div>
                                                    </div>
                                                    :
                                                    val.one_day_leave === 1
                                                    ?
                                                    <div className="BottomBox_info">
                                                        <div className="font-weight-bolder">Single Day Leave</div>
                                                        <div className="font-weight-bolder">Date</div>
                                                        <div>{ leaveFrom }</div>
                                                    </div>
                                                    :
                                                    <div className="BottomBox_info">
                                                        <div className="font-weight-bolder">From</div>
                                                        <div className="font-weight-bolder">To</div>
                                                        <div className="font-weight-bolder">No of Days</div>
                                                        <div>{ leaveFrom }</div>
                                                        <div>{ leaveTo }</div>
                                                        <div> { val.days } </div>
                                                    </div>
                                                }
                                                <p className="font-weight-bolder mb-1">Purpose Of Leave :</p>
                                                <p className="mb-0 text-justify" style={ { wordBreak: 'break-word' } }>
                                                    { val.leave_purpose }
                                                </p>
                                            </div>
                                            {
                                                val.request_status !== 'Accepted' && val.request_status !== 'Rejected'
                                                ?
                                                    <div className="Right2_BottomBox mt-2 py-2 text-right">
                                                        <button className="btn btn-sm btn-danger mr-2" onClick={() => RequestDenied(val.requested_by, val.leave_id)}>Denied</button>
                                                        <button className="btn btn-sm btn-primary" onClick={() => RequestAccept(val.requested_by, val.leave_id)}>Accept</button>
                                                    </div>
                                                :
                                                    null
                                            }
                                        </div>
                                    </div>
                                )

                            }
                        )
                    }
                </div>
            </div>
        </>
    )
}
export default Leave_Application_Details;