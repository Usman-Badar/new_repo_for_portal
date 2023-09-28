import React, { useEffect, useState } from 'react';
import './Attendance.css';

import $ from 'jquery';
import axios from '../../../../../../axios';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '../../../../../UI/Modal/Modal';
import { createFromObjectArray } from "styled-xl";
import { saveAs } from "file-saver";
import moment from 'moment';
import JSAlert from 'js-alert';
import LoadingIcon from '../../../../../../images/loadingIcons/icons8-iphone-spinner.gif';
import SuccessIcon from '../../../../../../images/check-circle.gif';

const Attendance = () => {
    const EmpData = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    const ref = React.createRef();
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    const wordsToBold = ["Present", "Late", 'leave', "Absent", 'OFF'];

    const [ temporaryStaff, setTemporaryStaff ] = useState(false);
    const [ loadThumbsPermission, setLoadThumbsPermission ] = useState(false);
    const [ showChangesModal, setShowChangesModal ] = useState(false);
    const [ modalContent, setModalContent ] = useState(<></>);
    const [ Name, setName ] = useState('');
    const [ DailyAttendance, setDailyAttendance ] = useState([]);
    const [ Logs, setLogs ] = useState([]);
    const [ Thumbs, setThumbs ] = useState([]);
    const [ Companies, setCompanies ] = useState([]);
    const [ Filters, setFilters ] = useState(
        {
            dateFrom: '', dateTo: '', company: null
        }
    );
    const [ checkedList, setCheckedList ] = useState([]);
    const [ checkedTemporaryList, setCheckedTemporaryList ] = useState([]);

    useEffect(
        () => {
            if ( Filters.dateFrom !== '' || Filters.dateTo !== '' || Filters.company !== null ) {
                fetchAttendance();
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ temporaryStaff, Filters.dateFrom, Filters.dateTo, Filters.company ]
    );
    useEffect(
        () => {
            if (DailyAttendance.length > 0 && loadThumbsPermission) loadThumbs(DailyAttendance.filter(val => val.name.toLowerCase().includes(Name.toLowerCase())));
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ DailyAttendance, loadThumbsPermission ]
    );
    useEffect(
        () => {

            axios.get('/getcompaniescodes').then( response => {

                setCompanies( response.data );

            } ).catch( err => {

                toast.dark( err , {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

            } );

        }, []
    );
    const fetchAttendance = () => {
        let company = Filters.company === null ? EmpData.company_code : Filters.company;
        let dateFrom = Filters.dateFrom;
        let dateTo = Filters.dateTo;

        if (dateFrom === '' && dateTo === '') {
            return false;
        }

        if ( dateFrom !== '' && dateTo !== '' && dateTo < dateFrom )
        {
            toast.dark( "Date To should greater than Date From", {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return false;
        }
        if (JSON.parse(AccessControls.access).includes(0) || JSON.parse(AccessControls.access).includes(63) || JSON.parse(AccessControls.access).includes(60) || JSON.parse(AccessControls.access).includes(61)) {
            
            setModalContent(
                <>
                    <img src={LoadingIcon} alt="loading..." width="50" className='d-block mx-auto mb-3' />
                    <h6 className='text-center mb-0'>Fetching...</h6>
                </>
            );
            setShowChangesModal(true);

            const Data = new FormData();
            Data.append('DateFrom', dateFrom);
            Data.append('DateTo', dateTo);
            Data.append('CompanyCode', company);
            Data.append('temporaryStaff', temporaryStaff ? 1 : 0);
            Data.append('AccessControls', JSON.stringify(AccessControls));
            axios.post('/allemployeesattcompanywiseaccordingtodate', Data).then( res => {
    
                $(".checkboxes").prop('checked', false);
                setCheckedList([]);
                setCheckedTemporaryList([]);
                setDailyAttendance( res.data );
                setShowChangesModal(false);
    
            } ).catch( err => console.log(err));
        }else {
            alert("You don't have access to fetch attendance.");
        }
    }
    const loadLogs = (attendance) => {
        setModalContent(
            <>
                <img src={LoadingIcon} alt="loading..." width="50" className='d-block mx-auto mb-3' />
                <h6 className='text-center mb-1'>Loading Logs</h6>
                {
                    DailyAttendance.filter(val => val.name.toLowerCase().includes(Name.toLowerCase())).length >= 500
                    ?
                    <p className='text-center mb-0'>This may take a while, so please wait while we're fetching the records.</p>
                    :null
                }
            </>
        );
        if (attendance.length > 0) axios.post('/attendance/update/logs', {attendance: JSON.stringify(attendance)}).then(res => {
            setLogs( res.data );
            setModalContent(<></>);
            setShowChangesModal(false);
        }).catch(err => console.log(err));
    }
    const loadThumbs = (attendance) => {
        setModalContent(
            <>
                <img src={LoadingIcon} alt="loading..." width="50" className='d-block mx-auto mb-3' />
                <h6 className='text-center mb-1'>Loading Punches</h6>
                {
                    DailyAttendance.filter(val => val.name.toLowerCase().includes(Name.toLowerCase())).length >= 500
                    ?
                    <p className='text-center mb-0'>This may take a while, so please wait while we're fetching the records.</p>
                    :null
                }
            </>
        );
        setShowChangesModal(true);
        axios.post('/attendance/thumbs/records', {attendance: JSON.stringify(attendance)}).then(res => {setThumbs( res.data );loadLogs(attendance);}).catch(err => console.log(err));
    }
    const OnFilter = ( e ) => {

        const { name, value } = e.target;

        const val = {
            ...Filters,
            [name]: value
        }

        setFilters( val );

    }
    const exportDataInExcel = () => {


        // var objData = [
        //     {firstName: "Tom", lastName: "Antony", mat: 30, phy: 90, che: 76 }
        // ];

        var objData = [];
        var normalRow = [];
        var status = "";
        var styling = {};
        var days;
        var d;
        var dayName;

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        for ( let x = 0; x < DailyAttendance.length; x++ )
        {
            days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            d = new Date(DailyAttendance[x].emp_date.toString().substring(0, 10));
            dayName = days[d.getDay()];
            styling = { backgroundColor: dayName === 'Sunday' ? '#C6E0E5' : DailyAttendance[x].status === 'Holiday' ? '#C6E0E5' : DailyAttendance[x].status === 'OFF' ? '#C6E0E5' : DailyAttendance[x].status === 'Absent' ? '#EBCCCF' : DailyAttendance[x].status === 'leave' ? '#F2E7C3' : DailyAttendance[x].status === 'Late' ? '#eff2f5' : '#fff' };
            if ( DailyAttendance[x].status === 'leave' && DailyAttendance[x].time_in === null && DailyAttendance[x].time_out === null && DailyAttendance[x].break_in === null && DailyAttendance[x].break_out === null )
            {
                status = capitalizeFirstLetter(DailyAttendance[x].status);
                normalRow = {
                    "ID": DailyAttendance[x].emp_id,
                    "Name": DailyAttendance[x].name,
                    "Date": new Date(DailyAttendance[x].emp_date).toDateString(),
                    "Day": dayName,
                    "Time In": "",
                    "Time Out": "",
                    "Start Break": "",
                    "End Break": "",
                    "Status": status,
                }
            }else
            if ( DailyAttendance[x].status === 'leave' && (DailyAttendance[x].time_in !== null || DailyAttendance[x].time_out !== null || DailyAttendance[x].break_in !== null || DailyAttendance[x].break_out !== null) )
            {
                status = "Short Leave";
                normalRow = {
                    "ID": DailyAttendance[x].emp_id,
                    "Name": DailyAttendance[x].name,
                    "Date": new Date(DailyAttendance[x].emp_date).toDateString(),
                    "Day": dayName,
                    "Time In": DailyAttendance[x].time_in ? DailyAttendance[x].time_in : "",
                    "Time Out": DailyAttendance[x].time_out ? DailyAttendance[x].time_out : "",
                    "Start Break": DailyAttendance[x].break_in ? DailyAttendance[x].break_in : "",
                    "End Break": DailyAttendance[x].break_out ? DailyAttendance[x].break_out : "",
                    "Status": status,
                }
            }else
            {
                status = capitalizeFirstLetter(DailyAttendance[x].status);
                normalRow = {
                    "ID": DailyAttendance[x].emp_id,
                    "Name": DailyAttendance[x].name,
                    "Date": new Date(DailyAttendance[x].emp_date).toDateString(),
                    "Day": dayName,
                    "Time In": DailyAttendance[x].time_in ? DailyAttendance[x].time_in : "",
                    "Time Out": DailyAttendance[x].time_out ? DailyAttendance[x].time_out : "",
                    "Start Break": DailyAttendance[x].break_in ? DailyAttendance[x].break_in : "",
                    "End Break": DailyAttendance[x].break_out ? DailyAttendance[x].break_out : "",
                    "Status": status,
                }
            }
            objData.push(normalRow)
        }
    
        var sheetName = "attendance-sheet";
        const headerStyle = {
            horizontalAlignment: "center",
            backgroundColor: "#1167b1",
            fontColor: "#FFFFFF",
            fontName: "Arial",
            fontSize: 12
        };
    
          //create a constant contentStyle with default styles for the all the rows
        const contentStyle = {
            fontSize: 12
        };

        var darkGrayStyle = { backgroundColor: "#899499", fontColor: "#ffffff" };
        var statusDarkGrayColor = [
            { type: "equal", style: darkGrayStyle, value: "5000" },
        ];

        const columnConfig = [
            {
                key: "ID",
                displayName: "ID",
                width: 10,
                conditionalFormatRules: statusDarkGrayColor,
                applyConditionalFormatToCols: ["all"],
                style: {
                    backgroundColor: '#fff',
                    fontColor: "#000"
                }
            },
            {
                key: "Name",
                displayName: "Name",
                width: 25,
                // conditionalFormatRules: statusDarkGrayColor,
                // applyConditionalFormatToCols: ["all"],
                style: {
                    backgroundColor: '#fff',
                    fontColor: "#000"
                }
            },
            {
                key: "Date",
                displayName: "Date",
                width: 20,
                // conditionalFormatRules: statusDarkGrayColor,
                // applyConditionalFormatToCols: ["all"],
                style: {
                    backgroundColor: '#fff',
                    fontColor: "#000"
                }
            },
            {
                key: "Day",
                displayName: "Day",
                width: 15,
                // conditionalFormatRules: statusDarkGrayColor,
                // applyConditionalFormatToCols: ["all"],
                style: {
                    backgroundColor: '#fff',
                    fontColor: "#000"
                }
            },
            {
                key: "Time In",
                displayName: "Time In",
                width: 15,
                // conditionalFormatRules: statusDarkGrayColor,
                // applyConditionalFormatToCols: ["all"],
                style: {
                    backgroundColor: '#fff',
                    fontColor: "#000"
                }
            },
            {
                key: "Time Out",
                displayName: "Time Out",
                width: 15,
                // conditionalFormatRules: statusDarkGrayColor,
                // applyConditionalFormatToCols: ["all"],
                style: {
                    backgroundColor: '#fff',
                    fontColor: "#000"
                }
            },
            {
                key: "Start Break",
                displayName: "Start Break",
                width: 15,
                // conditionalFormatRules: statusDarkGrayColor,
                // applyConditionalFormatToCols: ["all"],
                style: {
                    backgroundColor: '#fff',
                    fontColor: "#000"
                }
            },
            {
                key: "End Break",
                displayName: "End Break",
                width: 15,
                // conditionalFormatRules: statusDarkGrayColor,
                // applyConditionalFormatToCols: ["all"],
                style: {
                    backgroundColor: '#fff',
                    fontColor: "#000"
                }
            },
            {
                key: "Status",
                displayName: "Status",
                width: 10,
                style: {
                    backgroundColor: '#fff',
                    fontColor: "#000"
                }
            }
        ]
    
        var filePromise = createFromObjectArray(
            sheetName,//Sheet name
            objData, // array of objects to be converted to xlsx,
            contentStyle,
            headerStyle,
            columnConfig,
            null,
            true
        );
        filePromise.then((blob) => {
            saveAs(blob, "attendance-sheet.xlsx");
        });

    }
    const checkboxChange = (value) => {
        let arr = checkedList.slice();
        const index = arr.findIndex(val => val.id === value.id);
        if (index >= 0) {
            arr.splice(index, 1);
        } else {
            arr.push(value);
        }
        setCheckedList(arr);
    }
    const checkboxTempChange = (value) => {
        let arr = checkedTemporaryList.slice();
        const index = arr.findIndex(val => val.id === value.id);
        if (index >= 0) {
            arr.splice(index, 1);
        } else {
            arr.push(value);
        }
        setCheckedTemporaryList(arr);
    }
    const makeViewForGroupedAttendanceChanges = () => {
        setModalContent(
            <>
                <h5 className="heading">
                    Update Attendance 
                    <sub>Change The Statuses</sub>
                </h5>
                <hr />
                <div className='alert alert-warning'>
                    <b>Important Note</b><br />
                    <span>All checked rows' ({checkedList.length}) statues will update according to the selected status below.</span>
                </div>
                <form onSubmit={updateStatus}>
                    <fieldset>
                        <label className='mb-0'><b>Change Status To<sup className='text-danger'>*</sup></b></label>
                        <select name="status" className='form-control' required>
                            <option value="">Select The Option</option>
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                            <option value="OFF">OFF</option>
                        </select>
                        <button className='btn submit d-block ml-auto mt-3'>Confirm Changes</button>
                    </fieldset>
                </form>
            </>
        )
        setShowChangesModal(!showChangesModal);
    }
    const updateStatus = (e) => {
        e.preventDefault();
        $('fieldset').prop('disabled', true);
        axios.post(
            '/attendance/update/status',
            {
                emp_id: localStorage.getItem("EmpID"),
                name: localStorage.getItem("name"),
                new_status: e.target['status'].value,
                list: JSON.stringify(checkedList)
            }
        ).then(() => {
            hideModal();
            $(".checkboxes").prop('checked', false);
            JSAlert.alert("Records' statuses has been updated", "Success", JSAlert.Icons.Success).dismissIn(1000 * 2);
            fetchAttendance();
        }).catch(err => {
            $('fieldset').prop('disabled', false);
            console.log(err)
        });
    }
    const updateRecord = (e, value) => {
        e.preventDefault();
        $('fieldset').prop('disabled', true);
        const changes = {
            status: false,
            time_out: false,
        };
        let time_out = e.target['time_out'].value;

        if (e.target['time_out'].value === '') time_out = value.time_out;
        if (value.status !== e.target['status'].value) changes.status = true;
        if (value.time_out !== time_out) changes.time_out = true;
        if (!changes.status && !changes.time_out) {
            JSAlert.alert("No changes found in the current record.", "Nothing Change", JSAlert.Icons.Information).dismissIn(1000 * 2);
            $('fieldset').prop('disabled', false);
            return false;
        }

        axios.post(
            '/attendance/update/record',
            {
                emp_id: localStorage.getItem("EmpID"),
                name: localStorage.getItem("name"),
                new_status: e.target['status'].value,
                new_time_out: e.target['time_out'].value,
                value: JSON.stringify(value),
                changes: JSON.stringify(changes)
            }
        ).then(() => {
            hideModal();
            $(".checkboxes").prop('checked', false);
            JSAlert.alert("Record has been updated", "Success", JSAlert.Icons.Success).dismissIn(1000 * 2);
            fetchAttendance();
        }).catch(err => {
            $('fieldset').prop('disabled', false);
            console.log(err)
        });
    }
    const hideModal = () => {
        setShowChangesModal(false);
        setModalContent(<></>);
    }
    const makeViewForRecordUpdate = (value) => {
        if (!temporaryStaff && (JSON.parse(AccessControls.access).includes(59) || JSON.parse(AccessControls.access).includes(0))) {
            const {name, emp_id, status, emp_date, time_in, time_out} = value;
            setModalContent(
                <>
                    <h5 className="heading">
                        Update Attendance 
                        <sub>Alter The Attendance Row</sub>
                    </h5>
                    <hr />
                    <table className='table table-borderless table-sm bg-light border rounded'>
                        <tbody>
                            <tr>
                                <td>
                                    <b>Code</b><br />
                                    <span>{emp_id}</span>
                                </td>
                                <td>
                                    <b>Name</b><br />
                                    <span>{name}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table className='table table-sm mt-2'>
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Time IN</th>
                                <th>Time OUT</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{status}</td>
                                <td>{new Date(emp_date).toDateString()}</td>
                                <td>{time_in}</td>
                                <td>{time_out}</td>
                            </tr>
                        </tbody>
                    </table>
                    <form onSubmit={(e) => updateRecord(e, value)}>
                        <fieldset>
                            <label className='mb-0'><b>Change Status To<sup className='text-danger'>*</sup></b></label>
                            <select name="status" className='form-control mb-3' required>
                                <option value="">Select The Option</option>
                                <option selected={status === "Present"} value="Present">Present</option>
                                <option selected={status === "Absent"} value="Absent">Absent</option>
                                {status === "Late" ? <option selected={status === "Late"} value="Late">Late</option> : null}
                                {status === "leave" ? <option selected={status === "leave"} value="leave">Leave</option> : null}
                                <option selected={status === "OFF"} value="OFF">OFF</option>
                            </select>
                            <label className='mb-0'><b>Change Time Out To</b></label>
                            <input type='time' name="time_out" className='form-control' />
                            <button className='btn submit d-block ml-auto mt-3'>Confirm Changes</button>
                        </fieldset>
                    </form>
                </>
            )
            setShowChangesModal(!showChangesModal);
            setCheckedList([]);
            $(".checkboxes").prop('checked', false);
        }
    }
    function formattedText(input) {
        return input.replace(new RegExp('(\\b)(' + wordsToBold.join('|') + ')(\\b)','ig'), '$1<b>$2</b>$3');
    }
    function exportInExcel() {
        setModalContent(
            <>
                <img src={LoadingIcon} alt="loading..." width="50" className='d-block mx-auto mb-3' />
                <h6 className='text-center mb-0'>Creating Excel Sheet</h6>
            </>
        );
        setShowChangesModal(true);
        if (temporaryStaff) {
            for ( let x = 0; x < DailyAttendance.length; x++ ) {
                DailyAttendance[x].status = DailyAttendance[x].paid === 1 ? "Paid" : "Unpaid";
            }
        }
        axios.post(
            '/attendance/create/excel',
            {
                emp_id: localStorage.getItem("EmpID"),
                data: JSON.stringify(DailyAttendance.filter(val => val.name.toLowerCase().includes(Name.toLowerCase()))),
                logs: JSON.stringify(Logs),
                punch: JSON.stringify(Thumbs),
            }
        ).then(() => {
            setModalContent(
                <>
                    <img src={SuccessIcon} alt="loading..." width="50" className='d-block mx-auto mb-3' />
                    <h6 className='text-center mb-0'>Excel Sheet Has Been Created</h6>
                </>
            );
            axios.get(process.env.REACT_APP_SERVER + "/assets/portal/assets/excel/attendance/" + localStorage.getItem("EmpID") + "_attendance.xlsx", {
                method: 'GET',
                responseType: 'blob',
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${Date.now()}.xlsx`);
                document.body.appendChild(link);
                setModalContent(<></>);
                setShowChangesModal(false);
                link.click();
            });
        }).catch(err => {
            console.log(err)
        });
    }
    const markAsPaid = () => {
        axios.post(
            '/attendance/update/mark_as_paid',
            {
                emp_id: localStorage.getItem("EmpID"),
                name: localStorage.getItem("name"),
                list: JSON.stringify(checkedTemporaryList)
            }
        ).then(() => {
            $(".checkboxes").prop('checked', false);
            JSAlert.alert("Records has been marked as paid", "Success", JSAlert.Icons.Success).dismissIn(1000 * 2);
            fetchAttendance();
        }).catch(err => {
            $('fieldset').prop('disabled', false);
            console.log(err)
        });
    }

    if (!AccessControls.access) {
        return <></>
    }
    if (!JSON.parse(AccessControls.access).includes(0) && !JSON.parse(AccessControls.access).includes(63) && !JSON.parse(AccessControls.access).includes(60) && !JSON.parse(AccessControls.access).includes(61)) {
        return (
            <>
                <div className="View_Employee_Attendance page">
                    <div className="page-content">
                        <h5 className='mb-0 text-center'>No Access Found</h5>
                    </div>    
                </div>
            </>
        )
    }

    return (
        <>
            <ToastContainer />
            <Modal show={showChangesModal} Hide={hideModal} content={modalContent} />
            <div className="View_Employee_Attendance page">
                <div className="page-content mb-4">
                    <div className="Filters">
                        <h4 className="heading">
                            Attendance Module
                            <sub>Fetch Monthly Attendance</sub>
                        </h4>
                        <hr />
                        <div className="d-flex align-items-center">
                            {
                                JSON.parse(AccessControls.access).includes(18) || JSON.parse(AccessControls.access).includes(0)
                                ?
                                <div className="w-100 px-1">
                                    <label className="mb-0 font-weight-bold">Company</label>
                                    <select
                                        className="form-control bg-light"
                                        variant="standard"
                                        style={{ width: '100%', fontSize: '12px', fontFamily: 'Quicksand' }}
                                        onChange={ OnFilter }
                                        name='company'
                                    >
                                        <option
                                            value=''
                                        >
                                            Select the Option
                                        </option>
                                            {Companies.map(
                                            (val, index) => {
                                                
                                                let content = <></>;
                                                if ( val.Status_View === 'Y' )
                                                {
                                                    content = <option
                                                        key={index}
                                                        value={val.company_code}
                                                    >
                                                        {val.company_name}
                                                    </option>
                                                }
                                                return content;
                                                

                                            })}
                                    </select>
                                </div>
                                :null
                            }
                            <div className="w-100 px-1">
                                <label className="mb-0 font-weight-bold">Date From</label>
                                <input className="form-control form-control-sm bg-light" name="dateFrom" onChange={ OnFilter } type="date" variant="standard" style={ { marginBottom: '10px' } } fullWidth />
                            </div>
                            <div className="w-100 px-1">
                                <label className="mb-0 font-weight-bold">Date To</label>
                                <input className="form-control form-control-sm bg-light" name="dateTo" onChange={ OnFilter } type="date" variant="standard" style={ { marginBottom: '10px' } } fullWidth />
                            </div>
                            <div className="w-100 px-1">
                                <label className="mb-0 font-weight-bold">Search Employees</label>
                                <input type='search' placeholder='Search By Name...' className='form-control form-control-sm bg-light' variant="standard" style={ { marginBottom: '10px' } } fullWidth onChange={ (e) => setName(e.target.value) } />
                            </div>
                        </div>
                        <div className='d-flex flex-column justify-content-start align-items-start mt-3'>
                            {
                                !temporaryStaff && (JSON.parse(AccessControls.access).includes(59) || JSON.parse(AccessControls.access).includes(0))
                                ?
                                <div className='d-flex align-items-center justify-content-end mb-2'>
                                    <input type="checkbox" onChange={() => setLoadThumbsPermission(!loadThumbsPermission)} className='form-control' />
                                    <span className='ml-2'>Load Punches & Logs</span>
                                </div>
                                :null
                            }
                            {
                                JSON.parse(AccessControls.access).includes(60) || JSON.parse(AccessControls.access).includes(0)
                                ?
                                <div className='d-flex align-items-center justify-content-end'>
                                    <input type="checkbox" onChange={(e) => setTemporaryStaff(e.target.checked)} className='form-control' />
                                    <span className='ml-2'>Temporary Staff</span>
                                </div>
                                :null
                            }
                        </div>
                        <div className='d-flex align-items-center justify-content-end'>
                            {
                                DailyAttendance.length > 0
                                ?
                                <>
                                    <button className="btn btn-success text-white download-table-xls-button" onClick={exportInExcel}>Export in Excel</button>
                                    {/* <ReactHTMLTableToExcel
                                        id="test-table-xls-button"
                                        className="d-none"
                                        table="table-to-xls"
                                        filename={`Attendance-Sheet`}
                                        sheet={ [ "List" ] }
                                        buttonText="Export in Excel"
                                    /> */}
                                </>
                                :null
                            }
                        </div>
                    </div>
                </div>
                {
                    DailyAttendance.length === 0
                    ?
                    <div className='page-content'>
                        <h5 className='text-center mb-0'>No Record Found</h5>
                    </div>
                    :
                    <div className="Attendance page-content">
                        <div className='d-flex align-items-center justify-content-between' style={{ height: 40 }}>
                            <h4 className='text-uppercase mb-0'>Records Found: {DailyAttendance.filter(val => val.name.toLowerCase().includes(Name.toLowerCase())).length}</h4>
                            <div>
                                {checkedList.length > 0 ? <button className='btn light' onClick={makeViewForGroupedAttendanceChanges}>Make Changes</button> : null}
                                {checkedTemporaryList.length > 0 ? <button id="mar_as_paid" className='btn btn-success text-white' onClick={markAsPaid}>Mark as Paid</button> : null}
                            </div>
                        </div>
                        <hr />
                        <div className="attendance-content">
                            <table className="table mb-0" id="table-to-xls" ref={ ref }>
                                <thead>
                                    <tr>
                                        {!temporaryStaff && (JSON.parse(AccessControls.access).includes(59) || JSON.parse(AccessControls.access).includes(0)) ? <th className='border-top-0'></th> : null}
                                        <th className='border-top-0'></th>
                                        <th className='border-top-0'>Employee Code</th>
                                        <th className='border-top-0'>Name</th>
                                        <th className='border-top-0'>Date</th>
                                        <th className="d-none">Day</th>
                                        <th className='border-top-0'>Time IN</th>
                                        <th className='border-top-0'>Time OUT</th>
                                        {
                                            !temporaryStaff
                                            ?
                                            <>
                                                <th className='border-top-0'>Break IN</th>
                                                <th className='border-top-0'>Break OUT</th>
                                            </>
                                            :null
                                        }
                                        <th className='border-top-0'>Hour(s)</th>
                                        {!temporaryStaff?<th className='border-top-0'>Status</th>:null}
                                        {temporaryStaff?<th className='border-top-0'>Paid/Unpaid</th>:null}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        DailyAttendance.filter(val => val.name.toLowerCase().includes(Name.toLowerCase())).map(
                                            (val, index) => {
                                                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                                const d = new Date(val.emp_date.toString().substring(0, 10));
                                                const dayName = days[d.getDay()];
                                                const startTime = moment(val.time_in, 'HH:mm:ss a');
                                                const endTime = moment(val.time_out, 'HH:mm:ss a');
                                                const duration = moment.duration(endTime.diff(startTime));
                                                const hours = parseInt(duration.asHours());
                                                const minutes = parseInt(duration.asMinutes()) % 60;
                                                return (
                                                    <tr className={ !temporaryStaff && (JSON.parse(AccessControls.access).includes(59) || JSON.parse(AccessControls.access).includes(0)) ? 'pointer' : '' } key={index} style={ { backgroundColor: dayName === 'Sunday' ? '#C6E0E5' : val.status === 'Holiday' ? '#C6E0E5' : val.status === 'OFF' ? '#C6E0E5' : val.status === 'Absent' ? '#EBCCCF' : val.status === 'leave' ? '#F2E7C3' : val.status === 'Late' ? '#eff2f5' : '#fff' } }>
                                                        {
                                                            !temporaryStaff && (JSON.parse(AccessControls.access).includes(59) || JSON.parse(AccessControls.access).includes(0)) ? 
                                                            <>
                                                                <div className='data-container' id="accordion">
                                                                    <h6 className="heading mb-0">
                                                                        {val.name}
                                                                    </h6>
                                                                    <hr />
                                                                    <div className='px-3 py-2 bg-light border' id="Logs" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                                        <b>Logs</b>
                                                                    </div>
                                                                    <div id="collapseOne" class="collapse show" aria-labelledby="Logs" data-parent="#accordion">
                                                                        <div className='bg-light border p-3 logs_list'>
                                                                            {
                                                                                Logs.filter(value => value.attendance_record_id === val.id).length === 0
                                                                                ?
                                                                                <h6 className='text-center mb-0'>No Log Found</h6>
                                                                                :
                                                                                Logs.filter(value => value.attendance_record_id === val.id).map(
                                                                                    ({message, name, created_at}, i) => {
                                                                                        return (
                                                                                            <p key={i} className='mb-0'>
                                                                                                <span dangerouslySetInnerHTML={{__html: formattedText(message)}}></span><br />
                                                                                                <small><b>{name} at {new Date(created_at).toLocaleString()}</b></small>
                                                                                            </p>
                                                                                        )
                                                                                    }
                                                                                )
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div className='px-3 py-2 bg-light border' id="Thumbs" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                                                                        <b>Thumbs</b>
                                                                    </div>
                                                                    <div id="collapseTwo" class="collapse show" aria-labelledby="Thumbs" data-parent="#accordion">
                                                                        <div className='bg-light border pt-3 logs_list'>
                                                                            {
                                                                                Thumbs.filter(value => value.emp_id === val.emp_id && value.date === val.emp_date).length === 0
                                                                                ?
                                                                                <h6 className='text-center mb-0'>No Thumb Found</h6>
                                                                                :
                                                                                <table className='table table-sm'>
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <th>Sr.No</th>
                                                                                            <th>Punch Time</th>
                                                                                            <th>Location</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {
                                                                                            Thumbs.filter(value => value.emp_id === val.emp_id && value.date === val.emp_date).map(
                                                                                                ({time, location_name}, i) => {
                                                                                                    return (
                                                                                                        <tr key={i}>
                                                                                                            <td>{i+1}</td>
                                                                                                            <td>{time}</td>
                                                                                                            <td>{location_name}</td>
                                                                                                        </tr>
                                                                                                    )
                                                                                                }
                                                                                            )
                                                                                        }
                                                                                    </tbody>
                                                                                </table>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <td>
                                                                    <input type="checkbox" className='form-control checkboxes' onChange={() => checkboxChange(val)} />
                                                                </td>
                                                            </>
                                                            :
                                                            <td>
                                                                {temporaryStaff && val.paid === 0?<input type="checkbox" className='form-control checkboxes' onChange={() => checkboxTempChange(val)} />:null}
                                                            </td>
                                                        }
                                                        <td onClick={() => makeViewForRecordUpdate(val)}> {val.emp_id} </td>
                                                        <td onClick={() => makeViewForRecordUpdate(val)}> {val.name} </td>
                                                        <td onClick={() => makeViewForRecordUpdate(val)}> {val.emp_date.toString().substring(0, 10)} </td>
                                                        <td onClick={() => makeViewForRecordUpdate(val)} className="d-none"> {dayName} </td>
                                                        {
                                                            val.status === 'leave' && val.time_in === null && val.time_out === null && val.break_in === null && val.break_out === null
                                                            ?
                                                            <>
                                                                <td></td>
                                                                <td></td>
                                                                {
                                                                    !temporaryStaff
                                                                    ?
                                                                    <>
                                                                        <td></td>
                                                                        <td></td>
                                                                    </>
                                                                    :null
                                                                }
                                                            </>
                                                            :
                                                            val.status === 'leave' && (val.time_in !== null || val.time_out !== null || val.break_in !== null || val.break_out !== null)
                                                            ?
                                                            <>
                                                                <td onClick={() => makeViewForRecordUpdate(val)}> {val.time_in === null ? <span></span> : val.time_in} </td>
                                                                <td onClick={() => makeViewForRecordUpdate(val)}> {val.time_out === null ? <span></span> : val.time_out} </td>
                                                                {
                                                                    !temporaryStaff
                                                                    ?
                                                                    <>
                                                                        <td onClick={() => makeViewForRecordUpdate(val)}> {val.break_in === null ? <span></span> : val.break_in} </td>
                                                                        <td onClick={() => makeViewForRecordUpdate(val)}> {val.break_out === null ? <span></span> : val.break_out} </td>
                                                                    </>
                                                                    :null
                                                                }
                                                            </>
                                                            :
                                                            <>
                                                                <td onClick={() => makeViewForRecordUpdate(val)}> {val.time_in === null ? <span></span> : val.time_in} </td>
                                                                <td onClick={() => makeViewForRecordUpdate(val)}> {val.time_out === null ? <span></span> : val.time_out} </td>
                                                                {
                                                                    !temporaryStaff
                                                                    ?
                                                                    <>
                                                                        <td onClick={() => makeViewForRecordUpdate(val)}> {val.break_in === null ? <span></span> : val.break_in} </td>
                                                                        <td onClick={() => makeViewForRecordUpdate(val)}> {val.break_out === null ? <span></span> : val.break_out} </td>
                                                                    </>
                                                                    :null
                                                                }
                                                            </>
                                                        }
                                                        <td onClick={() => makeViewForRecordUpdate(val)}>
                                                            { val.time_in === null || val.time_out === null ? '---' : <>{hours}:{minutes}</> }
                                                        </td>
                                                        {
                                                            !temporaryStaff
                                                            ?
                                                            <td onClick={() => makeViewForRecordUpdate(val)}> 
                                                                {
                                                                    val.status === 'leave' && val.time_in === null && val.time_out === null && val.break_in === null && val.break_out === null
                                                                ?
                                                                <>
                                                                { val.status }
                                                                </>
                                                                :
                                                                val.status === 'leave' && (val.time_in !== null || val.time_out !== null || val.break_in !== null || val.break_out !== null)
                                                                ?
                                                                <>
                                                                    Short Leave
                                                                </>
                                                                :
                                                                <>
                                                                    { val.status }
                                                                </>
                                                                } 
                                                            </td>
                                                            :null
                                                        }
                                                        {
                                                            temporaryStaff
                                                            ?
                                                            <td>
                                                                {
                                                                    val.paid === 1
                                                                    ?
                                                                    <>
                                                                        <b>Paid</b><br />
                                                                        <span>{new Date(val.paid_date).toDateString()} at {val.paid_time}</span>
                                                                    </>
                                                                    :"Unpaid"
                                                                }
                                                            </td>
                                                            :null
                                                        }
                                                    </tr>
                                                );

                                            }
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
            </div>

        </>
    )

}

export default Attendance;