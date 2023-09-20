import React from 'react';
import './Style.css';

import $ from 'jquery';

// CUSTOM LOADING COMPONENT
import Loading from '../../../../../UI/Loading/Loading';
import LoadingIcon from '../../../../../../images/loadingIcons/icons8-loading-circle.gif';

const UI = ( { Specifications, Requests, Details, Comments, OpenRequest, newComment, CloseRequest, issueToInventory } ) => {

    return (
        <>
            <div className="inventory_requests_page">

                <div className="inventory_requests_page_content">

                    <h3 className="heading">
                        Inventory Requests
                        <sub>Item Requirements</sub>
                    </h3>

                    <hr />
                    
                    {
                        Details
                        ?
                        <DetailsContainer
                            details={ Details[0][0] }
                            specifications={ Details[1] }
                            Comments={ Comments }
                            Details={ Details }

                            newComment={ newComment }
                            issueToInventory={ issueToInventory }
                            CloseRequest={ CloseRequest }
                        />
                        :
                        Requests
                        ?
                        Requests.length === 0
                        ?
                        <h6 className="text-center">No Request Found</h6>
                        :
                        <table className="table table-bordered tbl table-hover">
                            <thead>
                                <tr>

                                    <th>Sr.No</th>
                                    <th>Requested By</th>
                                    <th>Request Date/Time</th>
                                    <th>Status</th>
                                    <th>Required Items</th>

                                </tr>
                            </thead>

                            <tbody>
                                {
                                    Requests.map(
                                        ( val, index ) => {

                                            let arr = [];
                                            if ( Specifications )
                                            {
                                                for ( let x = 0; x < Specifications.length; x++ )
                                                {
                                                    if ( Specifications[x].request_id === val.id )
                                                    {
                                                        arr.push( <><span>{Specifications[x].name} : <b>{ Specifications[x].assigned_quantity }</b> Qty</span> <br /></> )
                                                    }
                                                }
                                            }

                                            return (
                                                <tr title="Double Click To View" key={ index } onDoubleClick={ () => OpenRequest( index ) }>

                                                    <td>{ index + 1 }</td>
                                                    <td>
                                                        <b>{ val.sender_name }</b>
                                                        <br />
                                                        <span>{ val.sender_designation }</span>
                                                    </td>
                                                    <td>
                                                        <div className="status_column">
                                                            {
                                                                val.accepted_by
                                                                ?
                                                                val.issued
                                                                ?
                                                                <span className='badge badge-pill px-3 badge-green'> Issued </span>
                                                                :
                                                                <span className='badge badge-pill px-3 badge-dark'> Viewed </span>
                                                                :
                                                                <span className='badge badge-pill px-3 badge-danger'> Pending </span>
                                                            }
                                                        </div>
                                                        { new Date(val.request_date).toDateString() } 
                                                        <br />
                                                        { val.request_time }
                                                    </td>
                                                    <td>
                                                        {
                                                            val.accepted_by
                                                            ?
                                                            val.issued
                                                            ?
                                                            <span className='badge badge-pill px-3 badge-green'> Issued </span>
                                                            :
                                                            <span className='badge badge-pill px-3 badge-dark'> Viewed </span>
                                                            :
                                                            <span className='badge badge-pill px-3 badge-danger'> Pending </span>
                                                        }
                                                    </td>
                                                    <td>
                                                        { arr }
                                                    </td>

                                                </tr>
                                            )

                                        }
                                    )
                                }
                            </tbody>
                        </table>
                        :
                        <h6 className="text-center">Loading Requests...</h6>
                    }

                </div>
                
            </div>
        </>
    )

}

export default UI;

const CommentBox = ( { Comments, newComment } ) => {

    return (
        <>

            <div className='commentBox not_fixed'>
                <div className='header' onClick={ () => $('.commentBox').toggleClass('open') }>
                    Comment Section

                    {
                        Comments.length === 0
                        ?null
                        :
                        <span className='counting'>
                            { Comments.length }
                        </span>
                    }
                </div>
                <div className='comments_content' id="comments_content">

                    {
                        Comments.length === 0
                        ?
                        <div className='text-center'>No Comments</div>
                        :
                        Comments.map(
                            val => {

                                return (
                                    <div className={ parseInt( val.sender_id ) === parseInt(localStorage.getItem('EmpID')) ? 'comment mine' : 'comment' }>
                                        <small className={ parseInt( val.sender_id ) === parseInt(localStorage.getItem('EmpID')) ? 'mine' : '' }> <b>{val.name}</b> </small>
                                        <p className={ parseInt( val.sender_id ) === parseInt(localStorage.getItem('EmpID')) ? 'mine' : '' }> {val.comment} </p>
                                        <small className={ parseInt( val.sender_id ) === parseInt(localStorage.getItem('EmpID')) ? 'mine' : '' }> { new Date( val.send_date ).toDateString() } at { val.send_time } </small>
                                    </div>
                                ) 

                            }
                        )
                    }

                </div>
                <form className='newComment' id="commentForm" onSubmit={ newComment }>
                    <input required type="text" name="comment" />
                    <button><i className="las la-paper-plane"></i></button>
                </form>
            </div>

        </>
    )

}

const DetailsContainer = ( { details, specifications, Comments, Details, newComment, issueToInventory, CloseRequest } ) => {

    return (
        <>
            <div className="details">
            
                <div>
                    <div className="d-flex align-items-center justify-content-between">
                        <h5 className='mb-0'>
                            Request Details & Specifications
                        </h5>
                        <button className='btn submit d-flex align-items-center' onClick={CloseRequest}>
                            Go Back
                        </button>
                    </div>

                    <hr />

                    <table className="table table-sm table-bordered tbl">
                        <tbody>
                            <tr>
                                
                                <th className="bg-light">Requested By</th>
                                <td>{ details.sender_name }</td>

                            </tr>
                            <tr>
                                
                                <th className="bg-light">Request Date/Time</th>
                                <td>{ new Date(details.request_date).toDateString() + " at " + details.request_time }</td>

                            </tr>
                            <tr>
                                
                                <th className="bg-light">Viewed By</th>
                                <td>{ !details.receiver_name ? "N" : details.receiver_name }</td>

                            </tr>
                            <tr>
                                
                                <th className="bg-light">View Date/Time</th>
                                <td>{ !details.accept_date ? "N" : new Date(details.accept_date).toDateString() + " at " + details.accept_time }</td>

                            </tr>
                        </tbody>
                    </table>

                    <br />

                    <div className="products_div">
                        <table className="table table-bordered product_tbl">
                            <thead className="thead-light">
                                <tr>

                                    <th>Sr.No</th>
                                    <th>Product</th>
                                    <th>Description</th>
                                    <th>Company</th>
                                    <th>Location</th>
                                    <th>Sub Location</th>
                                    <th>Required Quantity</th>
                                    <th>Stored Quantity</th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    specifications.map(
                                        ( val, index ) => {

                                            return (
                                                <tr key={ index }>

                                                    <td>{ index + 1 }</td>
                                                    <td>{ val.name }</td>
                                                    <td>{ val.description }</td>
                                                    <td>
                                                        { val.company_name }
                                                        <div className="location_name_column">
                                                            <b>Location Name</b> <br />
                                                            <span>{ val.location_name }</span>
                                                        </div>
                                                        <div className="sub_location_name_column">
                                                            <b>Sub Location Name</b> <br />
                                                            <span>{ val.sub_location_name }</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        { val.location_name }
                                                    </td>
                                                    <td>
                                                        { val.sub_location_name }
                                                    </td>
                                                    <td>{ val.assigned_quantity }</td>
                                                    <td>{ val.current_stored_quantity }</td>

                                                </tr>
                                            )

                                        }
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                    
                    {
                        !details.issued
                        ?
                        <button className="btn btn-sm submit d-block mx-auto px-4" onDoubleClick={ () => issueToInventory( details.request_id, details.id ) } title="Double click to issue">
                            Double Click To Issue
                        </button>
                        :null
                    }
                </div>

                {/* <div>
                    {
                        Comments.length > 0 || Details
                        ?
                        <CommentBox
                            Comments={ Comments }

                            newComment={ newComment }
                        />
                        :null
                    }
                </div> */}

            </div>
        </>
    )

}

const List = ( { Requests, OpenRequest } ) => {

    return (
        <div className="list">

            {
                Requests
                ?
                Requests.length === 0
                ?
                <p className="text-center">No Request Found</p>
                :
                <table className="table table-bordered">

                    <thead>
                        <tr>

                            <th>
                                Request ID
                            </th>
                            <th>
                                Requested By
                            </th>
                            <th>
                                Request Date/Time
                            </th>
                            <th>
                                Accepted (Y/N)
                            </th>
                            <th>
                                Action
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {
                            Requests.map(
                                ( val, index ) => {

                                    return (
                                        <tr key={ index }>

                                            <td>
                                                { val.id }
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center justify-content-start font-italic employee">
                                                    <img src={ "/images/employees/" + val.sender_image } alt="emp" />
                                                    <div>
                                                        <p className='font-weight-bold'>{ val.sender_name }</p>
                                                        <span className='text-secondary'>{ val.sender_designation }</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                { new Date(val.request_date).toDateString() } <br />
                                                { val.request_time }
                                            </td>
                                            <td>
                                                {
                                                    val.accepted_by
                                                    ?
                                                    "Y"
                                                    :
                                                    "N"
                                                }
                                            </td>
                                            <td>
                                                {
                                                    val.accepted_by
                                                    ?
                                                    <button className='btn btn-sm btn-outline-primary rounded-pill px-3' onClick={ () => OpenRequest( index ) }>
                                                        Details
                                                    </button>
                                                    :
                                                    <button className='btn btn-sm btn-outline-success rounded-pill px-3' onClick={ () => OpenRequest( index ) }>
                                                        Accept
                                                    </button>
                                                }
                                            </td>

                                        </tr>
                                    )

                                }
                            )
                        }
                    </tbody>

                </table>
                :
                <Loading 
                    display={ true }
                    styling={
                        {
                            zIndex: 100000,
                            position: 'absolute'
                        }
                    }
                    icon={ 
                        <img 
                            src={ LoadingIcon }
                            className="LoadingImg"
                            alt="LoadingIcon"
                        /> 
                    }
                    txt="Please Wait"
                />
            }

        </div>
    )

}