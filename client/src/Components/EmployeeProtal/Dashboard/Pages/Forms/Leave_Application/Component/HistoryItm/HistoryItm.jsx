import React from 'react';

import './HistoryItm.css';

const HistoryItm = ( props ) => {
    return (
        <div className="histories mb-3" onClick={ props.onClickListner } style={ { animationDelay: ( 0 + '.' + props.index ).toString() + 's' } }>
            {
                props.request_status === 'Sent'
                    ?
                    <div className="statuss d-flex align-items-center">
                        <div className="w-100">
                            <i className="las la-bookmark"></i>
                            <p className="text-center mb-0">
                                Sent
                            </p>
                        </div>
                    </div>
                    :
                    props.request_status === 'Waiting For Approval'
                        ?
                        <div className="statusp d-flex align-items-center">
                            <div className="w-100">
                                <i className="las la-hourglass-half"></i>
                                <p className="text-center mb-0">
                                    Waiting For Approval
                                </p>
                            </div>
                        </div>
                        :
                        props.request_status === 'Accepted'
                            ?
                            <div className="statusg d-flex align-items-center">
                                <div>
                                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                        <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                                        <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                                    </svg>
                                    <p className="text-center mb-0">
                                        Approved
                                    </p>
                                </div>
                            </div>
                            :
                            <div className="statusr d-flex align-items-center">
                                <div>
                                    <svg className="cross__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                        <circle className="cross__circle" cx="26" cy="26" r="25" fill="none" />
                                        <path className="cross__path cross__path--right f" fill="none" d="M16,16 l20,20" />
                                        <path className="cross__path cross__path--right l" fill="none" d="M16,36 l20,-20" />
                                    </svg>
                                    <p className="text-center mb-0">
                                        Rejected
                                    </p>
                                </div>
                            </div>
            }
            <div>
                <div className="d-flex align-items-center justify-content-between mb-1">
                    <div className="pr-3">
                        {/* <h6 className="mb-0 font-weight-bold">Short Leave</h6> */}
                    </div>
                    <div>
                        <h6 className="mb-0">{props.requested_date.substring(0, 10)}</h6>
                    </div>
                </div>
                {
                    props.leave === "LEAVE"
                    ?
                        <div className="d-flex align-items-center">
                            <div className="pr-3">
                                <p className="mb-0 font-weight-bold">From</p>
                                <p className="mb-0">{props.date_from}</p>
                            </div>
                            <div>
                                <p className="mb-0 font-weight-bold">To</p>
                                <p className="mb-0">{props.date_to}</p>
                            </div>
                        </div>
                    :
                        <div className="d-flex align-items-center">
                            <div className="pr-3">
                                <p className="mb-0 font-weight-bold">Leave For</p>
                                <p className="mb-0">{props.leave_for}</p>
                            </div>
                        </div>

                }
            </div>
        </div>
    );
}

export default HistoryItm;