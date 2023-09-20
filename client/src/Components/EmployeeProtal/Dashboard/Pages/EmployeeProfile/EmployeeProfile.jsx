/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import './EmployeeProfile.css';

import { useHistory } from 'react-router-dom';
import $ from 'jquery';
import { useDispatch, useSelector } from 'react-redux';
import { EmployeeLogin } from '../../../../../Redux/Actions/Action';
import axios from '../../../../../axios';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import moment from 'moment';

const EmployeeProfile = () => {

    const history = useHistory();
    const ProfileData = useSelector((state) => state.EmpAuth.EmployeeData);

    const [View, setView] = useState('');
    const [SubView, setSubView] = useState('');
    const [SubCategories, setSubCategories] = useState([]);
    const [Category, setCategory] = useState([]);
    const [EmpNotifications, setEmpNotifications] = useState([]);

    useEffect(
        () => {

            let arr = window.location.href.split('/');

            setView(arr[arr.length - 2]);
            $('#' + arr[arr.length - 2]).addClass('active');

        }, [window.location.href]
    );

    useEffect(
        () => {

            setSubCategories(
                [
                    [
                        {
                            title: 'Account',
                            link: '/profile/personal/info',
                            id: "info"
                        },
                        {
                            title: 'Contact',
                            link: '/profile/personal/contact',
                            id: "contact"
                        },
                        {
                            title: 'Email',
                            link: '/profile/personal/email',
                            id: "email"
                        },
                        {
                            title: 'Office',
                            link: '/profile/personal/office',
                            id: "office"
                        },
                        {
                            title: 'Password',
                            link: '/profile/personal/password',
                            id: "password"
                        },
                        {
                            title: 'Documents',
                            link: '/profile/personal/documents',
                            id: "documents"
                        }
                    ],
                    [
                        {
                            title: 'Attendance Sheet',
                            link: '/profile/attendance/sheet',
                            id: "sheet"
                        }
                    ],
                    [
                        {
                            title: 'Notifications',
                            link: '/profile/notifications/all',
                            id: "all"
                        }
                    ],
                    [
                        {
                            title: 'Tickets Issued',
                            link: '/profile/tickets/all',
                            id: "all"
                        }
                    ]
                ]
            )

        }, []
    )

    useEffect(
        () => {

            if (View !== '') {
                if (View === 'personal') {
                    setCategory(
                        SubCategories[0]
                    );
                } else
                    if (View === 'attendance') {
                        setCategory(
                            SubCategories[1]
                        );
                    } else
                        if (View === 'notifications') {
                            GetAllNotifications();
                            setCategory(
                                SubCategories[2]
                            );
                        } else
                            if (View === 'tickets') {
                                GetAllNotifications();
                                setCategory(
                                    SubCategories[3]
                                );
                            }

                let arr = window.location.href.split('/');
                setSubView(arr[arr.length - 1]);
            }

        }, [View]
    );

    useEffect(
        () => {

            if (SubView !== '') {
                let arr = window.location.href.split('/');
                $('#' + arr[arr.length - 1]).addClass('active');
            }

        }, [SubView, window.location.href]
    );

    const GetAllNotifications = () => {

        axios.post(
            '/getallnotifications',
            {
                emp_id: localStorage.getItem("EmpID")
            }
        ).then(
            res => {

                setEmpNotifications(res.data);

            }
        ).catch(
            err => {

                console.log(err);

            }
        )

    }

    if (Object.keys(ProfileData).length === 0) {
        return <></>
    }

    return (
        <div className="Profile">

            <div className="Center w-100">

                <div className="profile_cover">
                    <div className='blackCover'></div>
                    <img src={'images/employees/' + ProfileData.emp_image} alt="employee" />
                    <div className="intro">
                        <h5>{ProfileData.name}</h5>
                        <h6 className='text-secondary'>{ProfileData.designation_name} in {ProfileData.department_name} Department, {ProfileData.company_name}, {ProfileData.location_name}</h6>
                    </div>
                    <div className='profileNavBar'>
                        <div className='NavBar_content'>
                            <LinkItem
                                event={() => history.replace('/profile/personal/info')}
                                icon={<i style={{ color: 'var(--blue)' }} className="las la-user"></i>}
                                title="Personal"
                                id="personal"
                            />

                            <LinkItem
                                event={() => history.replace('/profile/attendance/sheet')}
                                icon={<i style={{ color: 'var(--c-green)' }} className="las la-calendar-week"></i>}
                                title="Attendance"
                                id="attendance"
                            />

                            <LinkItem
                                event={() => history.replace('/profile/notifications/all')}
                                icon={<i style={{ color: 'var(--orange)' }} className="las la-bell"></i>}
                                title="Notifications"
                                id="notifications"
                            />
                        </div>
                    </div>
                </div>

                <br />
                <br />
                <br />
                <br />
                <br />

                <div className="center_div_content">
                    {
                        ProfileData
                            ?
                            <>
                                {
                                    View === 'personal'
                                        ?
                                        <AccountInfo
                                            ProfileData={ProfileData}
                                            View={View}
                                            SubView={SubView}
                                        />
                                        :
                                        View === 'attendance'
                                            ?
                                            <Attendance
                                                ProfileData={ProfileData}
                                                View={View}
                                                SubView={SubView}
                                            />
                                            :
                                            View === 'notifications'
                                                ?
                                                <Notifications
                                                    ProfileData={ProfileData}
                                                    EmpNotifications={EmpNotifications}
                                                    View={View}
                                                    SubView={SubView}
                                                />
                                                :
                                                null
                                }
                            </>
                            : null
                    }

                </div>

            </div>

        </div>
    )
}
export default EmployeeProfile;

const LinkItem = ({ icon, title, desc, event, id }) => {

    return (
        <div className="LinkItem" onClick={event} id={id}>

            {icon}

            <div className="pl-2">

                <p> {title} </p>
                <p> {desc} </p>

            </div>

        </div>
    )

}

const Item = ({ label, txt }) => {

    return (
        <div className="AccountInfoItem">
            <label> {label} </label>
            <p> {txt} </p>
        </div>
    )

}

const FileItem = ({ label, source }) => {

    let elm;
    let path;
    if (source.includes('CV')) {
        path = "/documents/cv/";
    } else
        if (source.includes('Driving_License')) {
            path = "/documents/licenses/driving/";
        } else
            if (source.includes('Armed_License')) {
                path = "/documents/licenses/armed/";
            } else
                if (source.includes('proof_of_address')) {
                    path = "/documents/address/";
                } else
                    if (source.includes('_front')) {
                        path = "/documents/cnic/front/";
                    } else
                        if (source.includes('_back')) {
                            path = "/documents/cnic/back/";
                        }
    if (source.includes('.pdf')) {
        elm = <iframe src={'images' + path + source} width="100%" title="CV"></iframe>
    } else {
        elm = <img src={'images' + path + source} alt="document" width="100%" title="CV" />
    }

    return (
        <div className="AccountInfoItem">
            <label> {label} </label>
            {elm}
        </div>
    )

}

const EditItem = ({ label, value, type, name, onChangeHandler }) => {

    return (
        <div className="AccountInfoItem">
            <label> {label} </label>
            <input type={type} className="inputs" value={value} onChange={onChangeHandler} name={name} />
        </div>
    )

}

const AccountInfo = (props) => {

    let key = 'real secret keys should be long and random';
    const encryptor = require('simple-encryptor')(key);
    const dispatch = useDispatch();

    const [Form, setForm] = useState(
        {
            residential_address: props.ProfileData.residential_address,
            emergency_person_name: props.ProfileData.emergency_person_name,
            emergency_person_number: props.ProfileData.emergency_person_number,
            landline: props.ProfileData.landline,
            cell: props.ProfileData.cell,
            email: props.ProfileData.email,
            login_id: encryptor.decrypt(props.ProfileData.login_id),
            emp_password: encryptor.decrypt(props.ProfileData.emp_password)
        }
    );
    const [Mode, setMode] = useState(sessionStorage.getItem("Mode"));
    const [ShowLoginID, setShowLoginID] = useState(false);
    const [CV, setCV] = useState(
        {
            file: '', name: ""
        }
    );
    const [PRF, setPRF] = useState(
        {
            file: '', name: ""
        }
    );
    const [ShowPassword, setShowPassword] = useState(false);
    const [Disabled, setDisabled] = useState(false);

    useEffect(
        () => {

            if (sessionStorage.getItem("Mode")) {
                $('.Profile .ContainerHeader .ModeContainer #' + sessionStorage.getItem("Mode")).addClass('active');
            } else {
                $('.Profile .ContainerHeader .ModeContainer #Normal').addClass('active');
            }

        }, [Mode, sessionStorage.getItem("Mode")]
    )

    useEffect(
        () => {

            if (
                Form.residential_address === '' ||
                Form.emergency_person_name === '' ||
                Form.emergency_person_number === '' ||
                Form.landline === '' ||
                Form.cell === '' ||
                Form.email === '' ||
                Form.login_id === '' ||
                Form.emp_password === ''
            ) {
                setDisabled(true);
            } else {
                setDisabled(false);
            }

        }, [Form.residential_address, Form.emergency_person_name, Form.emergency_person_number, Form.landline, Form.cell, Form.email, Form.login_id, Form.emp_password]
    )

    const ChangeMode = (mode) => {

        $('.Profile .ContainerHeader .ModeContainer .mode').removeClass('active');
        $('.Profile .ContainerHeader .ModeContainer #' + mode).addClass('active');
        sessionStorage.setItem("Mode", mode);
        setMode(mode);

    }

    const onImageUpload = (event) => {

        const reader = new FileReader();
        const { name } = event.target;

        let Name = props.ProfileData.name;
        let subName = Name.substring(0, 3);

        let Profession = props.ProfileData.father_name;
        let subProfession = Profession.substring(0, 3);

        let Passport = props.ProfileData.cnic;
        let subPassport = Passport.substring(0, 8);

        let ImageCurrentName = subName + subProfession + subPassport;

        reader.onload = () => {

            if (reader.readyState === 2) {
                if (name === 'CV') {
                    setCV({ file: event.target.files[0], name: ImageCurrentName + '_CV' });
                } else
                    if (name === 'PRF') {
                        setPRF({ file: event.target.files[0], name: ImageCurrentName + '_proof_of_address' });
                    }
            }

        }

        if (event.target.files[0]) {
            reader.readAsDataURL(event.target.files[0]);
        }

    }

    const onChangeHandler = (e) => {

        const { name, value } = e.target;
        const val = {
            ...Form,
            [name]: value
        };

        setForm(val);

    }

    const UpdateProfile = () => {

        const Data = new FormData();
        Data.append('emp_id', localStorage.getItem('EmpID'));
        Data.append('residential_address', Form.residential_address);
        Data.append('emergency_person_name', Form.emergency_person_name);
        Data.append('emergency_person_number', Form.emergency_person_number);
        Data.append('landline', Form.landline);
        Data.append('cell', Form.cell);
        Data.append('email', Form.email);
        Data.append('login_id', encryptor.encrypt(Form.login_id));
        Data.append('emp_password', encryptor.encrypt(Form.emp_password));
        Data.append('CV', CV.file);
        Data.append('CVName', CV.name);
        Data.append('PRF', PRF.file);
        Data.append('PRFName', PRF.name);

        axios.post(
            '/updateprofile',
            Data,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        ).then(
            () => {

                alert('Profile Updated');
                axios.post(
                    '/getemployee',
                    {
                        empID: localStorage.getItem('EmpID'),
                        view: 'portal'
                    }
                ).then(res => {

                    dispatch(EmployeeLogin(res.data));

                }).catch(err => {

                    alert(err);

                });

            }
        ).catch(
            err => {

                console.log(err);

            }
        )

    }

    if (!props.ProfileData) {
        return <></>
    }

    return (
        <div className="AccountInfo w-100">

            <div className="ContainerHeader">

                <h4> Employee Details </h4>
                <div className="ModeContainer">
                    <div id="Normal" onClick={() => ChangeMode('Normal')} className="mode">Default</div>
                    <div id="Edit" onClick={() => ChangeMode('Edit')} className="mode">Edit</div>
                </div>

            </div>
            <br />

            <div className="margin-x">

                <div className="detailsContainer">

                    <h6>Accounts</h6>

                    <div className='detailsContainer-grid'>

                        <Item
                            label="employee id"
                            txt={props.ProfileData.emp_id}
                        />

                        <Item
                            label="father name"
                            txt={props.ProfileData.father_name}
                        />

                        <Item
                            label="date of birth"
                            txt={props.ProfileData.date_of_birth ? new Date(props.ProfileData.date_of_birth.substring(0, 10)).toDateString() : null}
                        />

                        <Item
                            label="place of birth"
                            txt={props.ProfileData.place_of_birth}
                        />

                        <Item
                            label="gender"
                            txt={props.ProfileData.gender}
                        />

                    </div>



                </div>

                <hr />

                <div className="detailsContainer">

                    <h6>Contact</h6>

                    <div className='detailsContainer-grid'>

                        {
                            Mode === 'Edit'
                                ?
                                <EditItem
                                    label="residential address"
                                    value={Form.residential_address}
                                    onChangeHandler={onChangeHandler}
                                    type="text"
                                    name="residential_address"
                                />
                                :
                                <Item
                                    label="residential address"
                                    txt={props.ProfileData.residential_address}
                                />
                        }

                        <Item
                            label="permanent address"
                            txt={props.ProfileData.permanent_address}
                        />

                        {
                            Mode === 'Edit'
                                ?
                                <EditItem
                                    label="emergency person"
                                    value={Form.emergency_person_name}
                                    onChangeHandler={onChangeHandler}
                                    type="text"
                                    name="emergency_person_name"
                                />
                                :
                                <Item
                                    label="emergency person"
                                    txt={props.ProfileData.emergency_person_name}
                                />
                        }

                        {
                            Mode === 'Edit'
                                ?
                                <EditItem
                                    label="emergency person number"
                                    value={Form.emergency_person_number}
                                    onChangeHandler={onChangeHandler}
                                    type="number"
                                    name="emergency_person_number"
                                />
                                :
                                <Item
                                    label="emergency person number"
                                    txt={props.ProfileData.emergency_person_number}
                                />
                        }

                        {
                            Mode === 'Edit'
                                ?
                                <EditItem
                                    label="landline"
                                    value={Form.landline}
                                    onChangeHandler={onChangeHandler}
                                    type="number"
                                    name="landline"
                                />
                                :
                                <Item
                                    label="landline"
                                    txt={props.ProfileData.landline}
                                />
                        }

                        {
                            Mode === 'Edit'
                                ?
                                <EditItem
                                    label="cell phone"
                                    value={Form.cell}
                                    onChangeHandler={onChangeHandler}
                                    type="number"
                                    name="cell"
                                />
                                :
                                <Item
                                    label="cell phone"
                                    txt={props.ProfileData.cell}
                                />
                        }

                    </div>

                </div>

                <hr />

                <div className="detailsContainer">

                    <h6>Email</h6>

                    <div className='detailsContainer-grid'>

                        {
                            Mode === 'Edit'
                                ?
                                <EditItem
                                    label="email"
                                    value={Form.email}
                                    onChangeHandler={onChangeHandler}
                                    type="email"
                                    name="email"
                                />
                                :
                                <Item
                                    label="email"
                                    txt={props.ProfileData.email}
                                />
                        }

                    </div>

                </div>

                <hr />

                <div className="detailsContainer">

                    <h6>Office</h6>

                    <div className='detailsContainer-grid'>


                        <Item
                            label="designation"
                            txt={props.ProfileData.designation_name}
                        />

                        <Item
                            label="department"
                            txt={props.ProfileData.department_name}
                        />

                        <Item
                            label="company"
                            txt={props.ProfileData.company_name}
                        />

                        <Item
                            label="location"
                            txt={props.ProfileData.location_name}
                        />

                        <Item
                            label="Employment"
                            txt={props.ProfileData.emp_status}
                        />

                        <Item
                            label="Date of Join"
                            txt={new Date(props.ProfileData.date_of_join.substring(0, 10)).toDateString()}
                        />

                        <Item
                            label="time in"
                            txt={props.ProfileData.time_in}
                        />

                        <Item
                            label="time out"
                            txt={props.ProfileData.time_out}
                        />

                        <Item
                            label="Additional off"
                            txt={
                                JSON.parse(props.ProfileData.additional_off).length === 0
                                    ?
                                    "No Additional Off"
                                    :
                                    JSON.parse(props.ProfileData.additional_off).map(
                                        (val, index) => {
                                            return <span>{val} {(index + 1) === JSON.parse(props.ProfileData.additional_off).length ? "" : ', '}</span>
                                        }
                                    )
                            }
                        />

                    </div>

                </div>

                <hr />

                <div className="detailsContainer">

                    <h6>Credentials</h6>

                    <div className='detailsContainer-grid'>

                        {
                            Mode === 'Edit'
                                ?
                                <div>
                                    <EditItem
                                        label="login id"
                                        value={Form.login_id}
                                        onChangeHandler={onChangeHandler}
                                        type={ShowLoginID ? 'text' : "password"}
                                        name="login_id"
                                    />
                                    <div className="d-flex align-items-center mt-2">
                                        <input type="checkbox" onChange={(e) => setShowLoginID(e.target.checked)} className="mr-1" /> Show Login ID
                                    </div>
                                </div>
                                :
                                <Item
                                    label="login id"
                                    txt={
                                        encryptor.decrypt(props.ProfileData.login_id).split('').map(
                                            () => {

                                                return <span style={{ fontSize: '15px' }}> * </span>

                                            }
                                        )
                                    }
                                />
                        }

                        {
                            Mode === 'Edit'
                                ?
                                <div>
                                    <EditItem
                                        label="password"
                                        value={Form.emp_password}
                                        onChangeHandler={onChangeHandler}
                                        type={ShowPassword ? 'text' : "password"}
                                        name="emp_password"
                                    />
                                    <div className="d-flex align-items-center mt-2">
                                        <input type="checkbox" onChange={(e) => setShowPassword(e.target.checked)} className="mr-1" /> Show Password
                                    </div>
                                </div>
                                :
                                <Item
                                    label="password"
                                    txt={
                                        encryptor.decrypt(props.ProfileData.emp_password).split('').map(
                                            () => {

                                                return <span style={{ fontSize: '15px' }}> * </span>

                                            }
                                        )
                                    }
                                />
                        }

                    </div>

                </div>

                <hr />

                <div className="detailsContainer">

                    <h6>Documents</h6>

                    <div className='detailsContainer-grid'>
                        <FileItem
                            label="CNIC (front)"
                            source={props.ProfileData.cnic_front_image}
                        />

                        <FileItem
                            label="CNIC (back)"
                            source={props.ProfileData.cnic_back_image}
                        />

                        {
                            Mode === 'Edit'
                                ?
                                <div className="AccountInfoItem">
                                    <label> {'CV'} </label>
                                    <input type={'file'} className="inputs" name="CV" onChange={onImageUpload} accept=".jpg, .jpeg, .png, .pdf" />
                                </div>
                                :
                                <FileItem
                                    label="CV"
                                    source={props.ProfileData.cv}
                                />
                        }

                        {
                            Mode === 'Edit'
                                ?
                                <div className="AccountInfoItem">
                                    <label> {'Proof of address'} </label>
                                    <input type={'file'} className="inputs" name="PRF" onChange={onImageUpload} accept=".jpg, .jpeg, .png, .pdf" />
                                </div>
                                :
                                <FileItem
                                    label="Proof of address"
                                    source={props.ProfileData.proof_of_address}
                                />
                        }

                        {
                            props.ProfileData.driving_license !== null
                                ?
                                <FileItem
                                    label="driving license"
                                    source={props.ProfileData.driving_license}
                                />
                                : null
                        }

                        {
                            props.ProfileData.armed_license !== null
                                ?
                                <FileItem
                                    label="armed license"
                                    source={props.ProfileData.armed_license}
                                />
                                : null
                        }
                    </div>

                </div>

                {
                    Mode === 'Edit'
                        ?
                        <button className="btn updateBtn" disabled={Disabled} onClick={UpdateProfile}>Update</button>
                        : null
                }

            </div>

        </div>
    )

}

const Notifications = ({ EmpNotifications }) => {

    return (
        <div className="notificationsContainer">
            <div className="ContainerHeader">

                <h4> Notifications </h4>

            </div>
            <br />

            <div className='margin-x'>
                {
                    EmpNotifications.map(
                        val => {
                            return (
                                <Notification
                                    title={val.notification_title}
                                    body={val.notification_body}
                                    date_time={val.notification_date}
                                    event_id={val.event_id}
                                    key={val.notification_id}
                                />
                            )
                        }
                    )
                }
            </div>

            

        </div>
    )

}

const Notification = ({ title, body, event_id, key, date_time }) => {

    const d = new Date(date_time.substring(0, 10));
    let year = d.getFullYear().toString();
    let month = (d.getMonth() + 1).toString().length === 1 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1).toString();
    let date = d.getDate().toString().length === 1 ? "0" + d.getDate() : d.getDate().toString();

    const D = moment(year + month + date, "YYYYMMDD").fromNow();

    return (
        <div className="NotificationItem" key={key}>
            {
                event_id === 1
                    ?
                    <i className="las la-comments mainIcon"></i>
                    :
                    event_id === 2
                        ?
                        <i className="las la-mail-bulk mainIcon"></i>
                        :
                        event_id === 3
                            ?
                            <i className="lar la-credit-card mainIcon"></i>
                            :
                            event_id === 4
                                ?
                                <i className="las la-calendar-day mainIcon"></i>
                                : null
            }
            <div>
                <h6> {title} </h6>
                <p className="mb-0"> {body} </p>
                <div className="d-flex align-items-center"><i className="las la-history"></i> <small className="text-secondary pl-1">{D}</small></div>
            </div>
        </div>
    )

}

const Attendance = () => {

    const ref = React.createRef();

    const [Sheet, setSheet] = useState([]);

    useEffect(
        () => {

            axios.post(
                '/getempattdetails',
                {
                    empID: localStorage.getItem('EmpID')
                }
            ).then(
                res => {

                    setSheet(res.data);

                }
            ).catch(
                err => {

                    console.log(err);

                }
            )

        }, []
    )

    return (
        <div className="AttendanceContainer">

            <div className="ContainerHeader">

                <h4> Attendance </h4>
                <div className="ModeContainer">
                    {/* <div id="Normal" onClick={ () => {} } style={ { backgroundColor: "var(--orange)" } } className="mode text-white mr-2">Print</div> */}
                    <div id="Edit" onClick={() => { }} style={{ backgroundColor: "var(--blue)" }} className="mode text-white">
                        <ReactHTMLTableToExcel
                            id="test-table-xls-button"
                            className="download-table-xls-button"
                            table="table-to-xls"
                            filename={localStorage.getItem('EmpID') + "_attendance-sheet"}
                            sheet={["Employees", "Employees", "Employees", "Employees"]}
                            buttonText="Export"
                        />
                    </div>
                </div>

            </div>

            <br />

            <div className='margin-x table_wide' >
                <table className="table" id="table-to-xls" ref={ref}>

                    <thead>
                        <tr>

                            <th>ID</th>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Time in</th>
                            <th>Break in</th>
                            <th>Break out</th>
                            <th>Time out</th>
                            <th>Hours</th>
                            <th>Status</th>

                        </tr>
                    </thead>

                    <tbody>
                        {
                            Sheet.map(
                                (val, index) => {

                                    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                    let d = new Date(val.emp_date);
                                    let dayName = days[d.getDay()];

                                    const startTime = moment(val.time_in, 'HH:mm:ss a');
                                    const endTime = moment(val.time_out, 'HH:mm:ss a');
                                    const duration = moment.duration(endTime.diff(startTime));
                                    const hours = parseInt(duration.asHours());
                                    const minutes = parseInt(duration.asMinutes()) % 60;

                                    return (
                                        <tr key={index} style={{ backgroundColor: dayName === 'Sunday' ? "#bbbdc3" : val.status === 'Holiday' ? "#bbbdc3" : val.status === 'OFF' ? "#bbbdc3" : val.status === 'Absent' ? '#F1F3F2' : val.status === 'leave' ? '#F1F3F2' : val.status === 'Late' ? '#F1F3F2' : '#fff' }}>

                                            <td> {localStorage.getItem('EmpID')} </td>
                                            <td>{sessionStorage.getItem("name")}</td>
                                            <td>{d ? d.toDateString() : null}</td>
                                            <td>{val.time_in}</td>
                                            <td>{val.break_in}</td>
                                            <td>{val.break_out}</td>
                                            <td>{val.time_out}</td>
                                            <td>{ val.time_in === null || val.time_out === null ? '---' : <>{hours}:{minutes}</> }</td>
                                            <td>{val.status}</td>

                                        </tr>
                                    )

                                }
                            )
                        }
                    </tbody>

                </table>
            </div>

            <div className='margin-x table_short'>
                <table className="table" id="table-to-xls" ref={ref}>

                    <thead>
                        <tr>

                            <th>Date</th>
                            <th>Time in</th>
                            <th>Time out</th>
                            <th>Status</th>

                        </tr>
                    </thead>

                    <tbody>
                        {
                            Sheet.map(
                                (val, index) => {

                                    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                    let d = new Date(val.emp_date);
                                    let dayName = days[d.getDay()];

                                    const startTime = moment(val.time_in, 'HH:mm:ss a');
                                    const endTime = moment(val.time_out, 'HH:mm:ss a');
                                    const duration = moment.duration(endTime.diff(startTime));
                                    const hours = parseInt(duration.asHours());
                                    const minutes = parseInt(duration.asMinutes()) % 60;

                                    return (
                                        <tr key={index} style={{ backgroundColor: dayName === 'Sunday' ? "#bbbdc3" : val.status === 'Holiday' ? "#bbbdc3" : val.status === 'OFF' ? "#bbbdc3" : val.status === 'Absent' ? '#F1F3F2' : val.status === 'leave' ? '#F1F3F2' : val.status === 'Late' ? '#F1F3F2' : '#fff' }}>

                                            <td>{d ? d.toDateString() : null}</td>
                                            <td>{val.time_in}</td>
                                            <td>{val.time_out}</td>
                                            <td>{val.status}</td>

                                        </tr>
                                    )

                                }
                            )
                        }
                    </tbody>

                </table>
            </div>

        </div>
    )

}