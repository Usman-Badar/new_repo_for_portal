import React, { useState } from "react";
import './Style.css';
import JSAlert from 'js-alert';
import moment from "moment";

const UI = ({ currentQuarter, quarter, AccessControls, List, history, onSubmit, addRow, setList }) => {
    const [ ShowCreateTask, setShowCreateTask ] = useState(false);

    const submission = (e) => {
        e.preventDefault();
        if ( !List || List.length === 0 )
        {
            JSAlert.alert("At least one task is required!!!").dismissIn(1000 * 2);
            return false;
        }
        onSubmit();
    }
    const onChangeHandler = (e, id) => {
        const { value, name } = e.target;
        let arr = List.slice();
        arr[id][name] = value;
        setList(arr);
    }
    const removeTask = ( index ) => {
        const arr = List.filter((val, i) => i !== index);
        setList(arr);
    }
    // const array_move = (arr, old_index, new_index) => {
    //     if (new_index >= arr.length) {
    //         var k = new_index - arr.length + 1;
    //         while (k--) {
    //             arr.push(undefined);
    //         }
    //     }
    //     arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    //     return arr; // for testing
    // };
    return (
        <>
            <div className="GrowthReview page">
                <div className="GrowthReview-content page-content">
                    <div className="firstform">
                        <div className="d-flex align-items-center justify-content-between">
                            <h3 className="heading">
                                Growth Review
                                <sub>List down the tasks</sub>
                            </h3>

                            <div>
                                <button className="btn light" onClick={ () => history.goBack() }>Back</button>
                                {/* <button className="btn ml-2 cancle" onClick={ () => history.goBack() }>Clear</button>
                                <button className="btn ml-2 submit" onClick={ () => history.goBack() }>Save</button> */}
                            </div>
                        </div>
                        <hr />
                        <div className="grid-div">
                            <div className="d-flex align-items-center px-3 leftdiv">
                                <h6 className="mb-0">If this form is part of an annual performance review, discuss the form with your manager and then select and answer those questions that most apply to you. Note that this form also includes some preparation questions to consider for the next year.</h6>
                            </div>
                            <div className="rightdiv">
                                <div className="rightdiv-details mb-2">
                                    <h6 className="font-weight-bold mb-0">Name</h6>
                                    <input type="text" className="form-control" defaultValue={ AccessControls.name } disabled />
                                </div>
                                <div className="rightdiv-details mb-2">
                                    <h6 className="font-weight-bold mb-0">Designation</h6>
                                    <input type="text" className="form-control" defaultValue={ AccessControls.designation_name } disabled />
                                </div>
                                {/* <div className="rightdiv-details mb-2">
                                    <h6 className="font-weight-bold mb-0">Current Quarter</h6>
                                    <input type="text" className="form-control" defaultValue={ currentQuarter } disabled />
                                </div>
                                <div className="rightdiv-details mb-2">
                                    <h6 className="font-weight-bold mb-0">Next Quarter</h6>
                                    <input type="text" className="form-control" defaultValue={ quarter } disabled />
                                </div> */}
                                <div className="rightdiv-details">
                                    <h6 className="font-weight-bold mb-0">Date</h6>
                                    <input type="text" className="form-control" defaultValue={ new Date().toDateString() } disabled />
                                </div>
                            </div>
                        </div>
                        <div className="px-4">
                            <label className="mb-0 font-weight-bold">Assigning To</label>
                            <input value={ window.location.href.split('/').pop().split('&&name=').pop().split('%20').join(' ') } className="form-control text-capitalize" name="employee" disabled />
                            <button className="btn submit px-2 d-block mt-3 ml-auto filter-emit" onClick={ () => setShowCreateTask(!ShowCreateTask) } type='button'>
                                { ShowCreateTask ? <><i className="las la-times"></i> Close</> : <><i className="las la-plus"></i> Add Task</> }
                            </button>
                            {
                                ShowCreateTask
                                ?
                                <form onSubmit={ addRow } id="addRowForm" className="popUps border mt-3 p-3 rounded">
                                    <div className="d-flex" style={{ gap: '15px' }}>
                                        <div className="w-50">
                                            <h6 className="mb-1 font-weight-bold">Task</h6>
                                            <input className="form-control" placeholder="Enter the task in detail...." name="task" required minLength={30} />
                                        </div>
                                        <div className="w-50">
                                            <h6 className="mb-1 font-weight-bold">Deadline</h6>
                                            <input type="date" className="form-control" name="deadline" required />
                                        </div>
                                    </div>
                                    <button className="btn submit d-block ml-auto mt-3" type="submit">Add</button>
                                </form>
                                :null
                            }
                            {
                                List && List.length > 0
                                ?
                                <>
                                    <table className="table mb-0">
                                        <thead>
                                            <tr>
                                                <th className="border-top-0">Sr.No</th>
                                                <th className="border-top-0">Tasks</th>
                                                <th className="border-top-0">Deadline</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                List.map(
                                                    ( val, index ) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>
                                                                    <textarea name='task' className="contentEditableInput form-control" onChange={ (e) => onChangeHandler( e, index ) } value={ val.task } />
                                                                </td>
                                                                <td style={{ position: 'relative' }}>
                                                                    <div className="d-flex align-items-center pr-5">
                                                                        <input name='deadline' type="date" className="contentEditableInput form-control" value={ val.deadline } onChange={ (e) => onChangeHandler( e, index ) } />
                                                                        <i className="las la-trash text-danger" onDoubleClick={ () => removeTask( index ) }></i>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                )
                                            }
                                        </tbody>
                                    </table>
                                    <button className="btn submit d-block ml-auto mt-3" id="growthreviewsubmitbtn" onClick={ submission }>Submit</button>
                                </>
                                :null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default UI;