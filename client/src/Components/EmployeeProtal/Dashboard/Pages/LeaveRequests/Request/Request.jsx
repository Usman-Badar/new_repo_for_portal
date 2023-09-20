import React from 'react';

import './Request.css';

const Request = ( props ) => {
    return (
        <div className="requests" style={ { animationDelay: ( 0 + '.' + props.index ).toString() + 's' } }>
            <div onClick={ props.onClickListner }>

            <div className="d-flex align-items-center justify-content-between">
                <h6 className='mb-0 font-weight-bold'>
                    { props.leaveType }
                </h6>
                {
                    props.status === 'Accepted'
                    ?
                        <p className='mb-0 status statusa'>
                            Accepted
                        </p>
                    :
                    props.status === 'Rejected'
                    ?
                        <p className='mb-0 status statusr'>
                            Rejected
                        </p>
                    :
                    props.status === 'Waiting For Approval'
                    ?
                        <p className='mb-0 status statusp'>
                            Waiting
                        </p>
                    :
                    <p className='mb-0 status statusp'>
                        Pending
                    </p>
                }
            </div>
            <div>
                <p className='mb-0'>
                    { props.requestDate }
                </p>
            </div>
            <div className="d-flex align-items-center mt-1">
                <img src={ props.image } className="rounded-circle" alt='Employee Img' width='30' height='30' />
                <p className='mb-0'>
                    <b className="pl-1">{ props.Employee }</b>
                </p>
            </div>
            <div className="d-flex align-items-center">
                <i className="las la-calendar-check bg-primary text-white rounded-circle mr-1" style={{ padding: '5px', fontSize: '20px' }}></i>
                {
                    props.leaveType === 'Leave'
                    ?
                        <div>
                            <div>
                                <p className='mb-0'>
                                    Leave From <b className="pl-1">{ props.leaveFrom }</b>
                                </p>
                            </div>
                            <div>
                                <p className='mb-0'>
                                    Leave To <b className="pl-1">{ props.leaveTo }</b>
                                </p>
                            </div>
                        </div>
                    :
                        <div>
                            <div className="py-2">
                                <p className='mb-0'>
                                    Leave Time <b className="pl-1">{ props.leaveFrom }</b>
                                </p>
                            </div>
                        </div>
                }
            </div>
            </div>
            <div className={ "text-justify mt-1 shortDetails shortDetails" + props.index }>
                <p className='mb-0' style={ { wordBreak: 'break-word' } }>
                    { props.reason }
                </p>
                <button className="btn d-block ml-auto shadow-sm bg-white btn-sm rounded-0" onClick={ props.OnShowDetails }>View Details</button>
            </div>
        </div>
    );
}

export default Request;