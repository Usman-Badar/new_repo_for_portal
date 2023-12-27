import React, { useEffect, useState } from 'react';

import './View_Emp_Attendance.css';

import axios from '../../../../../axios';
import { useSelector } from 'react-redux';

import $ from 'jquery';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const View_Emp_Attendance = () => {

    const EmpData = useSelector((state) => state.EmpAuth.EmployeeData);
    const ref = React.createRef();
    const AccessControls = useSelector((state) => state.EmpAuth.EmployeeData);

    const [FilterName, setFilterName] = useState('');
    const [SelectedEmployee, setSelectedEmployee] = useState('');
    const [Employees, setEmployees] = useState([]);
    const [DailyAttendance, setDailyAttendance] = useState([]);
    const [Companies, setCompanies] = useState([]);

    const [Clicked, setClicked] = useState(false);
    const [Attendance, setAttendance] = useState(
        {
            time_in: '',
            time_out: '',
            break_in: '',
            break_out: ''
        }
    );

    const [AttendanceDetails, setAttendanceDetails] = useState(
        {
            thumbs: [],
            attendance: [],
            logs: []
        }
    );

    const [Company, setCompany] = useState('');
    const [DateTime, setDateTime] = useState('');

    useEffect(
        () => {
            let names = [];
            for (let x = 0; x < DailyAttendance.length; x++) {
                if (!names.includes(DailyAttendance[x].name)) {
                    names.push(DailyAttendance[x].name);
                }
            }
            setEmployees(names);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [DailyAttendance.length]
    )

    useEffect(
        () => {

            axios.post(
                '/getemployeecompaniesauth',
                {
                    emp_id: EmpData.emp_id
                }
            ).then(
                res => {

                    setCompanies(res.data);
                    if (res.data.length === 1) {
                        setCompany(res.data[0].company_code);
                    }

                }
            ).catch(
                err => {

                    console.log(err);

                }
            )

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []
    )

    const ShowEdit = () => {

        $('.form').fadeIn();
        $('.list').fadeOut(0);
        $('.ButtonDiv2').hide();
        $('.ButtonDiv1').show();
        $('.togglebutton .HideDiv').css('left', '50%');
        $('.togglebutton .HideDiv').html('Eddit');

    }

    const ShowDetails = () => {

        $('.list').fadeIn();
        $('.form').fadeOut(0);
        $('.ButtonDiv2').hide();
        $('.ButtonDiv1').show();
        $('.togglebutton .HideDiv').css('left', '0');
        $('.togglebutton .HideDiv').html('Default');

    }

    const onChangeCompany = (e) => {

        setCompany(e.target.value);
        GetList(DateTime, e.target.value);

    }

    const onChangeDate = (e) => {

        const { value } = e.target;
        GetList(value, Company);

    }

    const GetList = (date, company) => {

        axios.post(
            '/getthatdateemployeeslist',
            {
                date_time: date,
                company: company
            }
        ).then(
            res => {

                setEmployees(res.data);
                setDateTime(date);

            }
        ).catch(
            err => {

                console.log(err);

            }
        )

    }

    const showEmpDetails = (date, emp_id, name) => {

        axios.post(
            '/getemployeefullattendance',
            {
                date: date,
                emp_id: emp_id,
            }
        ).then(
            res => {

                setAttendanceDetails(
                    {
                        name: name,
                        emp_id: emp_id,
                        thumbs: res.data[0],
                        attendance: res.data[1],
                        logs: res.data[2]
                    }
                );

                setAttendance(
                    {
                        time_in: res.data[1][0].time_in,
                        time_out: res.data[1][0].time_out,
                        break_in: res.data[1][0].break_in,
                        break_out: res.data[1][0].break_out
                    }
                )
                setClicked(true);

                ShowDetails();

            }
        ).catch(
            err => {

                console.log(err);

            }
        )

    }

    const changeNewTime = (e) =>{

        const { name, value } = e.target;

        const val = {
            ...Attendance,
            [name]: value
        }

        setAttendance(val);
    }

    const updateattendance = (e) => {

        e.preventDefault();

        const Data = new FormData();
        Data.append('emp_id', AttendanceDetails.attendance[0].emp_id)
        Data.append('record_id', AttendanceDetails.attendance[0].id)
        Data.append('time_in', Attendance.time_in)
        Data.append('time_out', Attendance.time_out)
        Data.append('break_in', Attendance.break_in)
        Data.append('break_out', Attendance.break_out)
        Data.append('previous_time_in', AttendanceDetails.attendance[0].time_in)
        Data.append('previous_time_out', AttendanceDetails.attendance[0].time_out)
        Data.append('previous_break_in', AttendanceDetails.attendance[0].break_in)
        Data.append('previous_break_out', AttendanceDetails.attendance[0].break_out)
        Data.append('edit_by', EmpData.emp_id)
        Data.append('edit_by_name', EmpData.name)

        axios.post(
            '/updateemployeeattendance',
            Data
        ).then(
            () => {

                alert("SUCCESS");
                setAttendance(
                    {
                        time_in: '',
                        time_out: '',
                        break_in: '',
                        break_out: ''
                    }
                );

                setAttendanceDetails(
                    {
                        thumbs: [],
                        attendance: [],
                        logs: []
                    }
                );

            }
        ).catch(
            err => {

                console.log(err)

            }
        )

    } 

    return (
        <>
            <ToastContainer />
            <div className="View_Employee_Attendance page">
                <div className="DivFirst page-content">
                    <div>
                        <h4 className=" font-weight-bold">Edit Employees Attendance</h4>
                    </div>
                    <div className="Filterss">
                        <div className="d-flex align-items-center">
                            <div className="w-100 pr-1">
                                <label className="mb-0 font-weight-bold">Company</label>
                                <select
                                    className="form-control bg-light"
                                    variant="standard"
                                    style={{ width: '100%', fontSize: '12px', fontFamily: 'Quicksand' }}
                                    // onChange={OnFilter}
                                    disabled={Companies.length === 1 ? true : false}
                                    onChange={onChangeCompany}
                                    name='company'
                                >
                                    <option
                                        value=''
                                    >
                                        Select the Option
                                    </option>
                                    {
                                        Companies.map(
                                            (val, index) => {

                                                return (
                                                    <option selected={Companies.length === 1 ? true : false} value={val.company_code} key={index}> {val.company_name} </option>
                                                )

                                            }
                                        )
                                    }
                                </select>
                            </div>
                            <div className="w-100 pl-1">
                                <label className="mb-0 font-weight-bold">Date</label>
                                <input className="form-control bg-light" name="dateFrom" onChange={onChangeDate} type="date" variant="standard" style={{ marginBottom: '10px' }} fullWidth />
                            </div>
                            {/* <div className="w-100">
                                <label className="mb-0">Employees</label>
                                <select
                                    className="form-control bg-light"
                                    variant="standard"
                                    style={{ width: '100%', fontSize: '12px', fontFamily: 'Quicksand' }}
                                    onChange={(e) => setSelectedEmployee(e.target.value)}
                                    name='employee'
                                >
                                    <option
                                        value=''
                                    >
                                        Select the Option
                                    </option>
                                    {Employees.map(
                                        (val, index) => (
                                            <option
                                                key={index}
                                                value={val}
                                            >
                                                {val}
                                            </option>
                                        ))}
                                </select>
                            </div> */}
                        </div>
                    </div>
                </div>
                <div>
                    {/* <h5 className="mb-4 font-weight-bolder">Daily Attendance</h5> */}

                    {
                        Employees.length === 0
                        ?null
                        :
                        <>
                            <br />
                            <div className="DivSecond">
                                <div className="attendance-content page-content">

                                    <h6 className="font-weight-bolder">Search By Name</h6>
                                    <input type='search' className='form-control' placeholder='Search Here...' onChange={ (e) => setFilterName(e.target.value) } />

                                    {
                                        Employees.filter(val => val.name.toLowerCase().includes(FilterName.toLocaleLowerCase())).sort().map(
                                            (val, index) => {
                                                return (
                                                    <>
                                                        <div className="Employee_info" key={index} onClick={() => showEmpDetails(DateTime, val.emp_id, val.name)}>
                                                            <div className='d-flex align-items-center'>
                                                                <img
                                                                    src={process.env.REACT_APP_SERVER+'/images/employees/' + val.emp_image}
                                                                    width='40'
                                                                    height='40'
                                                                    alt="employee img"
                                                                    className='rounded-circle'
                                                                />
                                                                <div className="ml-2">
                                                                    <p className='font-weight-bold'>{val.name}</p>
                                                                    <p><b>Emp Code:</b> {val.emp_id}</p>
                                                                </div>
                                                            </div>

                                                            {
                                                                val.status === 'Present'
                                                                    ?
                                                                    <div className='statusbage' style={{ backgroundColor: '#5C6E9C' }} >
                                                                        <p>{val.status}</p>
                                                                    </div>
                                                                    :
                                                                    val.status === 'Late'
                                                                        ?
                                                                        <div className='statusbage blinkstatus' style={{ backgroundColor: '#E7604A' }} >
                                                                            <p>{val.status}</p>
                                                                        </div>
                                                                        :
                                                                        val.status === 'Absent'
                                                                            ?
                                                                            <div className='statusbage blinkstatus' style={{ backgroundColor: '#E7604A' }}>
                                                                                <p>{val.status}</p>
                                                                            </div>
                                                                            :
                                                                            val.status === 'Holiday'
                                                                                ?
                                                                                <div className='statusbage' style={{ backgroundColor: 'red' }}>
                                                                                    <p>{val.status}</p>
                                                                                </div>
                                                                                :
                                                                                val.status === 'leave'
                                                                                    ?
                                                                                    <div className='statusbage' style={{ backgroundColor: 'red' }}>
                                                                                        <p>{val.status}</p>
                                                                                    </div>
                                                                                    :
                                                                                    val.status === 'leave'
                                                                                        ?
                                                                                        <div className='statusbage' style={{ backgroundColor: 'red' }}>
                                                                                            <p>{val.status}</p>
                                                                                        </div>
                                                                                        :
                                                                                        null
                                                            }

                                                        </div>
                                                    </>
                                                )
                                            }
                                        )
                                    }

                                </div>
                                {
                                    Clicked
                                        ?
                                        AttendanceDetails.thumbs.length === 0
                                            ?
                                            <div className='thumb_details page-content'>
                                                <h6 className="mb-4 font-weight-bolder">No Thumb Found</h6>
                                            </div>
                                            :
                                            <div className='thumb_details page-content'>

                                                <div className='d-flex align-items-center justify-content-between w-100'>
                                                    <h6 className="font-weight-bolder mb-0">{ AttendanceDetails.name } Thumbs</h6>
                                                    <ReactHTMLTableToExcel
                                                        id="test-table-xls-button"
                                                        className="btn btn-sm submit"
                                                        table="table-to-xls"
                                                        filename={ AttendanceDetails.name + "_thumbs" }
                                                        sheet={[ AttendanceDetails.name + " Thumbs"]}
                                                        buttonText="export"
                                                    />
                                                    {/* <button className=''>export</button> */}
                                                </div>
                                                <p className='mb-3'><b>Employee Code:</b> {AttendanceDetails.emp_id}</p>

                                                <table className="table table-sm mb-0" id="table-to-xls" ref={ref}>
                                                    <thead>
                                                        <tr>
                                                            <th className='d-none'>Employee ID</th>
                                                            <th className='d-none'>Employee Name</th>
                                                            <th>Locations</th>
                                                            <th>Code</th>
                                                            <th>Time</th>
                                                            <th>Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            AttendanceDetails.thumbs.map(
                                                                (val) => {
                                                                    return (
                                                                        <tr>
                                                                            <td className='d-none'>{val.emp_id}</td>
                                                                            <td className='d-none'>{AttendanceDetails.name}</td>
                                                                            <td>{val.location_name}</td>
                                                                            <td>{val.status_code ? val.status_code : '-'}</td>
                                                                            <td>{val.time}</td>
                                                                            <td>{new Date(val.date).toDateString()}</td>
                                                                        </tr>
                                                                    )
                                                                }
                                                            )
                                                        }

                                                    </tbody>
                                                    <tfoot className='d-none'>
                                                        <tr>

                                                            <th>Remarks</th>
                                                            <td colSpan={5}>
                                                                {
                                                                    AttendanceDetails.logs.length === 0
                                                                    ?
                                                                    <p className='mb-0 text-center'> No Remarks </p>
                                                                    :
                                                                    AttendanceDetails.logs.map(
                                                                        val => {
                                                                            return (
                                                                                <>
                                                                                    <span>{ val.log }</span>
                                                                                    <br />
                                                                                </>
                                                                            )
                                                                        }
                                                                    )
                                                                }
                                                            </td>

                                                        </tr>
                                                    </tfoot>
                                                </table>

                                            </div>
                                        : null
                                }
                                {
                                    AttendanceDetails.attendance.length === 0
                                        ? null
                                        :
                                        <div className='daily_att_details page-content'>

                                            <div className='d-flex align-items-center justify-content-between mb-3'>
                                                <h6 className="font-weight-bolder">Employee Attendance Details</h6>

                                                <div className='togglebutton'>
                                                    <div className="ClickDiv1" onClick={ShowDetails} >
                                                        <p className="mb-0">Default</p>
                                                    </div>
                                                    <div className="ClickDiv2" onClick={ShowEdit}>
                                                        <p className="mb-0">Edit</p>
                                                    </div>
                                                    <div className="HideDiv">
                                                        <p className="mb-0">Default</p>
                                                    </div>
                                                </div>

                                            </div>


                                            <div className='list'>

                                                <table className="table table-sm mb-0" id="table-to-xls" ref={ref}>
                                                    <thead>
                                                        <tr>
                                                            <th>Time In</th>
                                                            <th>Time Out</th>
                                                            <th>Break In</th>
                                                            <th>Break Out</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {
                                                            AttendanceDetails.attendance.map(
                                                                (val, index) => {
                                                                    return (
                                                                        <tr>
                                                                            <td>{val.time_in}</td>
                                                                            <td>{val.time_out}</td>
                                                                            <td>{val.break_in}</td>
                                                                            <td>{val.break_out}</td>
                                                                        </tr>
                                                                    )
                                                                }
                                                            )
                                                        }

                                                    </tbody>
                                                </table>

                                            </div>


                                            <div >
                                                <form className='form' onSubmit={updateattendance} >
                                                    <div className='d-flex w-100 mb-3'>
                                                        <div className="w-100 px-1">
                                                            <label className="mb-0">Current Time In</label>
                                                            <input className="form-control form-control-sm bg-light" type='text' name="" disabled value={Attendance.time_in} style={{ marginBottom: '10px' }} fullWidth />
                                                        </div>

                                                        <div className="w-100 px-1">
                                                            <label className="mb-0">New Time In</label>
                                                            <input className="form-control form-control-sm bg-light" type='time' onChange={changeNewTime} name="time_in" style={{ marginBottom: '10px' }} fullWidth />
                                                        </div>
                                                    </div>

                                                    <div className='d-flex w-100 mb-3'>
                                                        <div className="w-100 px-1">
                                                            <label className="mb-0">Current Time Out</label>
                                                            <input className="form-control form-control-sm bg-light" type='text' name="" disabled value={Attendance.time_out} style={{ marginBottom: '10px' }} fullWidth />
                                                        </div>

                                                        <div className="w-100 px-1">
                                                            <label className="mb-0">New Time Out</label>
                                                            <input className="form-control form-control-sm bg-light" type='time' onChange={changeNewTime} name="time_out" style={{ marginBottom: '10px' }} fullWidth />
                                                        </div>
                                                    </div>

                                                    <div className='d-flex w-100 mb-3'>
                                                        <div className="w-100 px-1">
                                                            <label className="mb-0">Current Break In</label>
                                                            <input className="form-control form-control-sm bg-light" type='text' name="" disabled value={Attendance.break_in} style={{ marginBottom: '10px' }} fullWidth />
                                                        </div>

                                                        <div className="w-100 px-1">
                                                            <label className="mb-0">New Break In</label>
                                                            <input className="form-control form-control-sm bg-light" type='time' onChange={changeNewTime} name="break_in" style={{ marginBottom: '10px' }} fullWidth />
                                                        </div>
                                                    </div>

                                                    <div className='d-flex w-100 mb-3'>

                                                        <div className="w-100 px-1">
                                                            <label className="mb-0">Current Break Out</label>
                                                            <input className="form-control form-control-sm bg-light" type='text' name="" disabled value={Attendance.break_out} style={{ marginBottom: '10px' }} fullWidth />
                                                        </div>

                                                        <div className="w-100 px-1">
                                                            <label className="mb-0">New Break Out</label>
                                                            <input className="form-control form-control-sm bg-light" type='time' onChange={changeNewTime} name="break_out" style={{ marginBottom: '10px' }} fullWidth />
                                                        </div>
                                                    </div>

                                                    <div className='d-flex align-items-center justify-content-end'>
                                                        <button type='submit' >Update</button>
                                                    </div>
                                                </form>
                                            </div>

                                            <div className='my-2'>

                                                <h6> Logs </h6>

                                                <div className="my-3 logContainer">
                                                    {
                                                        AttendanceDetails.logs.length === 0
                                                        ?
                                                        <p className='mb-0 text-center'> No Log Found </p>
                                                        :
                                                        AttendanceDetails.logs.map(
                                                            val => {
                                                                return (
                                                                    <div key={ val.log_id } className="log"> 
                                                                        <span style={ { textAlign: "justify" } }>{ val.log }</span>
                                                                        <span className='d-block text-right'>{ new Date( val.log_date ).toDateString() } at { val.log_time }</span>
                                                                    </div>
                                                                )
                                                            }
                                                        )
                                                    }
                                                </div>

                                            </div>

                                        </div>
                                }
                            </div>
                        </>
                    }
                </div>
            </div>

        </>
    )

}

export default View_Emp_Attendance;