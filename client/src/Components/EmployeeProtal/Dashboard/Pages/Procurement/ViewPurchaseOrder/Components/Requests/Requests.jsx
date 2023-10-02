import React from "react";

import './Requests.css';
import { Link } from 'react-router-dom';

const Requests = ( props ) => {

    let bgColor = 'var(--blue)';
    let txt = props.data.status;

    if (props.data.status === 'Approved' || props.data.status === 'Delivered') {
        bgColor = 'var(--success)';
        txt = "Approved By accounts";
    }
    if (props.data.status === 'Rejected') {
        bgColor = 'var(--orange)';
        txt = "Rejected by accounts";
    }
    if (props.data.status === 'Waiting For Approval') {
        bgColor = 'var(--c-green)';
        txt = "Received";
    }
    if ( props.data.status === "Sent" )
    {
        txt = "Received";
    }
    if ( props.data.status === "Viewed" )
    {
        txt = "Viewed";
    }

    return (
        <div className="ViewPoRequests_div" key={ props.key }>
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center w-75">
                    <img src={process.env.REACT_APP_SERVER+'/images/employees/' + props.data.emp_image} alt="" />
                    <div>
                        <p className="font-weight-bolder"> {props.data.name} </p>
                        <p> {props.data.designation_name + ' in ' + props.data.department_name + ' Department, ' + props.data.company_name} </p>
                    </div>
                </div>
                <div className="w-25">
                    <p className="font-weight-bolder">Total</p>
                    <p> Rs {props.data.total.toLocaleString('en-US')}</p>
                </div>
            </div>
            <div className="py-3">
                <div className="d-flex justify-content-between">
                    <div>
                        <p className="font-weight-bolder">Date</p>
                        <p>{props.date.toDateString()}</p>
                    </div>
                    <div>
                        <p className="font-weight-bolder">Status</p>
                        <p style={ { backgroundColor: bgColor, fontSize: '10px' } } className="text-white text-center rounded-pill px-2">{ txt }</p>
                    </div>
                </div>
            </div>
            <div className="d-flex align-items-center">
                <i class="las la-map-marker-alt"></i>
                <div>
                    <p className="font-weight-bolder">{props.data.company_name}</p>
                    <p>{props.data.location_name}</p>
                </div>
            </div>
            <div className="ViewPoRequests_button" onClick={ () => props.ViewRequestDetails( props.data.po_id, props.data.status ) }>
                {/* <button className="btn">Decline</button> */}
                <Link className="btn" to={ "/purchaseorder/window=purchaseorder&&id=" + props.data.po_id }>
                    View
                </Link>
            </div>
        </div>
    )

}

export default Requests;