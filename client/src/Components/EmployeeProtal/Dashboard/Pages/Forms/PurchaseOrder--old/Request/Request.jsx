import React from 'react';
import { Link } from 'react-router-dom';

import './Request.css';

const Request = ( props ) => {
    return (
        <div className="PreviousPORequest">
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center w-75">
                    <img src={ 'images/employees/' + props.data.emp_image } alt="employeeImg" />
                    <div>
                        <p className="font-weight-bolder"> { props.data.name } </p>
                        <p> { props.data.designation_name } in { props.data.department_name }, { props.data.company_name } </p>
                    </div>
                </div>
                <div className="w-25">
                    <p className="font-weight-bolder">Total</p>
                    <p> Rs { props.data.total.toLocaleString('en-US') }</p>
                </div>
            </div>
            <div className="py-3">
                <div className="d-flex justify-content-between">
                    <div>
                        <p className="font-weight-bolder">Date</p>
                        <p> { props.d.toDateString() } </p>
                    </div>
                    <div>
                        <p className="font-weight-bolder">Status</p>
                        <p style={{ backgroundColor: props.bgColor, fontSize: '10px' }} className="text-white text-center rounded-pill px-2"> { props.txt } </p>
                    </div>
                </div>
            </div>
            <div className="d-flex align-items-center">
                <i className="las la-map-marker-alt"></i>
                <div>
                    <p className="font-weight-bolder"> { props.data.company_name } </p>
                    <p> { props.data.location_name } </p>
                </div>
            </div>
            <div className="ViewPrRequests_button">
                <Link to={"/purchaseorder/view=previousrequests/" + props.data.pr_id + '/' + props.data.po_id}>
                    <button className="btn">View</button>
                </Link>
            </div>
        </div>
    );
}

export default Request;