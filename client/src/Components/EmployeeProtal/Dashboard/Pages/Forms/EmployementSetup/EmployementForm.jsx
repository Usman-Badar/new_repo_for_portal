import React, { useEffect, useRef, useState } from 'react';
import './EmployementForm.css';

import Webcam from 'react-webcam';
import $ from 'jquery';
import axios from '../../../../../../axios';

import { useHistory } from 'react-router-dom';

import Menu from '../../../../../UI/Menu/Menu';


const EmployementForm = () => {

    const history = useHistory();
    const refs = useRef(null);

    // To store the Employee Form Data
    const [Employee, setEmployee] = useState({
        Name: '', FatherName: '', Dob: '', PoB: '', Image: '', ImageName: '', RsdtAddress: '', PrmtAddress: '', Emergency_contact_person: '',
        Emergency_contact_number: '', landlineHome: '', personal_no: '', cnic: '', cnic_PoI: '', cnic_DoI: '', cnic_DoE: '', additionalOFF: '', gender: '', email: '', maritalStatus: '',
        ChildCount: 0
    });

    const [Children, setChildren] = useState(
        {
            childName: '', childAge: '', childGender: ''
        }
    );

    const [ChildrenAdded, setChildrenAdded] = useState([]);

    const [Camera, setCamera] = useState(false);
    const [empImages, setempImages] = useState('');

    const [empCNIC, setempCNIC] = useState({
        front: '', back: '', frontCNICName: '', backCNICName: ''
    });

    const [empCV, setempCV] = useState(
        {
            CV: '', CVName: ''
        }
    );

    const [empPrfAddrs, setempPrfAddrs] = useState(
        {
            PrfAddrs: '', PrfAddrsName: ''
        }
    );

    const [empDrvLicense, setempDrvLicense] = useState(
        {
            License: '', LicenseName: ''
        }
    );

    const [empArmdLicense, setempArmdLicense] = useState(
        {
            License: '', LicenseName: ''
        }
    );

    const [ArmdLcnse, setArmdLcnse] = useState(false);
    const [DrvLcnse, setDrvLcnse] = useState(false);

    
    const [Data, setData] = useState([{}]);

    useEffect(
        () => {

            setData(
                [
                    {
                        icon: 'las la-cloud-upload-alt',
                        txt: 'Create Employee',
                        link: true,
                        href: '/employment_setup/form',
                    },
                    {
                        icon: 'las la-cloud-upload-alt',
                        txt: 'View Employee',
                        link: true,
                        href: '/employment_setup/employees'
                    },
                    {
                        icon: 'las la-cloud-upload-alt',
                        txt: 'Employement Request',
                        link: true,
                        href: '/employment_setup/requests'
                    }
                ]

            );

        }, []
    )



    useEffect(
        () => {

            setInterval(() => {
                navigator.getUserMedia({ video: true }, () => { setCamera(true); }, () => { setCamera(false); });
            }, 100);

        }, [history]
    );

    // React lifecycle
    useEffect(() => {

        const d = new Date();

        $('.Step2').slideUp(0);
        $('.Step3').slideUp(0);
        $('.Step4').slideUp(0);
        $('.Step5').slideUp(0);

        $('.form1').on('submit', (e) => {

            e.preventDefault();

            let dateString = $('input[name=Dob]').val();
            let myDate = new Date(dateString);

            if (myDate < d) {
                $('.Step1').slideUp();
                $('.Step2').slideDown();
                $('.cnic_icon').addClass('activeStep');
            } else {
                
                console.log(alert('invalid date of birth'))
            }

        });

        $('.step2_btn_prev').on('click', () => {
            $('.Step1').slideDown();
            $('.Step2').slideUp();
            $('.cnic_icon').removeClass('activeStep');
        });

        $('.form2').on('submit', (e) => {

            e.preventDefault();
            let doi = $('input[name=cnic_DoI]').val();
            let doe = $('input[name=cnic_DoE]').val();

            let date1 = new Date(doi);
            let date2 = new Date(doe);

            if (date1.toString() === date2.toString()) {

                console.log(alert('invalid date'))

            } else if (date1 > d) {

                console.log(alert('invalid date'))

            } else if (date2 < date1) {

                console.log(alert('invalid date'))

            } else {
                $('.Step3').slideDown();
                $('.Step2').slideUp();
                $('.contact_icon').addClass('activeStep');
            }

        });

        $('.step3_btn_prev').on('click', () => {
            $('.Step2').slideDown();
            $('.Step3').slideUp();
            $('.contact_icon').removeClass('activeStep');
        });

        $('.form3').on('submit', (e) => {

            e.preventDefault();

            $('.Step4').slideDown();
            $('.Step3').slideUp();
            $('.documents_icon').addClass('activeStep');

        });

        $('.step4_btn_prev').on('click', () => {
            $('.Step3').slideDown();
            $('.Step4').slideUp();
            $('.documents_icon').removeClass('activeStep');
        });

        $('.form4').on('submit', (e) => {

            e.preventDefault();
            $('.Step4').slideUp();
            $('.Step5').slideDown();
            $('.documents_icon').addClass('activeStep');

        });

    }, []);


    const b64toBlob = (b64Data, contentType, sliceSize) => {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data); // window.atob(b64Data)
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    const takePhoto = () => {

        var screenshot = refs.current.getScreenshot();
        setEmployee({ ...Employee, Image: screenshot });
        setempImages(screenshot);
        $('.close').trigger('click');

        let block = screenshot.split(";");
        var contentType = block[0].split(":")[1];
        var realData = block[1].split(",")[1];
        var blob = b64toBlob(realData, contentType);

        let Name = Employee.Name;
        let subName = Name.substring(0, 3);

        let Profession = new Date();
        let subProfession = Profession.getTime();

        let Passport = Employee.Emergency_contact_person;
        let subPassport = Passport.substring(0, 3);

        let ImageCurrentName = subName + subProfession + subPassport;

        setEmployee({ ...Employee, Image: blob, ImageName: ImageCurrentName });

    }

    // Function onchange which is called to store data into usestate()
    const onChangeHandler = (e) => {

        const { name, value } = e.target;
        const setVal = {
            ...Employee,
            [name]: value
        }
        setEmployee(setVal);

        if (name === 'ChildCount' && value > 0) {
            $('.AddChildBtn').trigger('click');
        }

    }

    // When user enter his education information this function will call
    const onChildrenChange = (e) => {

        const { name, value } = e.target;
        const Val = {
            ...Children,
            [name]: value
        }

        setChildren(Val);

    }

    // On Adding Education to form
    const AddChildren = (e) => {

        e.preventDefault();
        setChildrenAdded([...ChildrenAdded, Children]);
        setChildren({ ...Children, childName: '', childAge: '', childGender: '' });

    }

    // On form submittion
    const EmplloyeeSetup = (e) => {
        e.preventDefault();

        if (Employee.ImageName !== '') {

            $('.Step5').slideDown();
            $('.Step4').slideUp();

            const FormsData = new FormData();

            FormsData.append('Name', Employee.Name);
            FormsData.append('FatherName', Employee.FatherName);
            FormsData.append('Dob', Employee.Dob);
            FormsData.append('PoB', Employee.PoB);
            FormsData.append('ImageName', Employee.ImageName);
            FormsData.append('RsdtAddress', Employee.RsdtAddress);
            FormsData.append('PrmtAddress', Employee.PrmtAddress);
            FormsData.append('Emergency_contact_person', Employee.Emergency_contact_person);
            FormsData.append('Emergency_contact_number', Employee.Emergency_contact_number);
            FormsData.append('landlineHome', Employee.landlineHome);
            FormsData.append('personal_no', Employee.personal_no);
            FormsData.append('cnic', Employee.cnic);
            FormsData.append('cnic_PoI', Employee.cnic_PoI);
            FormsData.append('cnic_DoI', Employee.cnic_DoI);
            FormsData.append('cnic_DoE', Employee.cnic_DoE);
            FormsData.append('children', JSON.stringify(ChildrenAdded));
            FormsData.append('maritalStatus', Employee.maritalStatus);
            FormsData.append('gender', Employee.gender);

            FormsData.append('Image', Employee.Image);

            FormsData.append('CNICFrontImage', empCNIC.front);
            FormsData.append('CNICFrontImageName', empCNIC.frontCNICName);

            FormsData.append('CNICBackImage', empCNIC.back);
            FormsData.append('CNICBackImageName', empCNIC.backCNICName);

            FormsData.append('CVImage', empCV.CV);
            FormsData.append('CVImageName', empCV.CVName);

            FormsData.append('AddressImage', empPrfAddrs.PrfAddrs);
            FormsData.append('AddressImageName', empPrfAddrs.PrfAddrsName);

            FormsData.append('DrivingLicense', empDrvLicense.License);
            FormsData.append('DrivingLicenseName', empDrvLicense.LicenseName);

            FormsData.append('ArmedLicense', empArmdLicense.License);
            FormsData.append('ArmedLicenseName', empArmdLicense.LicenseName);

            FormsData.append('userID', sessionStorage.getItem('UserID'));
            FormsData.append('Email', Employee.email);

            axios.post('/initializeemployee', FormsData, {

                headers: { 'content-type': 'multipart/form-data' }

            }).then(() => {

                history.replace('/employment_setup/form');

            }).catch(error => {

                console.log(error)

            });

        } else {

            alert('Please take employee photo')

        }
    }

    const onImageUpload = (event) => {

        const reader = new FileReader();
        const { name } = event.target;

        let Name = Employee.Name;
        let subName = Name.substring(0, 3);

        let Profession = Employee.FatherName;
        let subProfession = Profession.substring(0, 3);

        let Passport = Employee.cnic;
        let subPassport = Passport.substring(0, 8);

        let ImageCurrentName = subName + subProfession + subPassport;

        reader.onload = () => {

            if (reader.readyState === 2) {

                if (name === 'cnic_front_photo') {
                    setempCNIC({ ...empCNIC, front: event.target.files[0], frontCNICName: ImageCurrentName + '_front' });
                } else if (name === 'cnic_back_photo') {
                    setempCNIC({ ...empCNIC, back: event.target.files[0], backCNICName: ImageCurrentName + '_back' });
                } else if (name === 'emp_cv') {
                    setempCV({ ...empCV, CV: event.target.files[0], CVName: ImageCurrentName + '_CV' });
                } else if (name === 'emp_prfaddrs') {
                    setempPrfAddrs({ ...empPrfAddrs, PrfAddrs: event.target.files[0], PrfAddrsName: ImageCurrentName + '_proof_of_address' });
                } else if (name === 'DrvLicense') {
                    setempDrvLicense({ ...empDrvLicense, License: event.target.files[0], LicenseName: ImageCurrentName + '_Driving_License' });
                } else if (name === 'ArmdLicense') {
                    setempArmdLicense({ ...empArmdLicense, License: event.target.files[0], LicenseName: ImageCurrentName + '_Armed_License' });
                }

            }

        }

        reader.readAsDataURL(event.target.files[0]);

    }

    const OnLicenseChange = (e) => {

        const { value, checked } = e.target;
        if (value === 'drivingLicense') {

            if (checked) {
                setDrvLcnse(true);
            } else {
                setDrvLcnse(false);
                setempDrvLicense({ ...empDrvLicense, License: '', LicenseName: '' });
            }

        } else {

            if (checked) {
                setArmdLcnse(true);
            } else {
                setArmdLcnse(false);
                setempArmdLicense({ ...empArmdLicense, License: '', LicenseName: '' });
            }

        }

    }

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    }

    return (

        <>

            <Menu data={Data} />

            <div className="EmployeeForm d-center">
                <div className="EmployeeForm-content">
                    <div className="firstform">
                        <div className="text-center mb-3 emp_heading">
                            <h3 className="text-uppercase formName mb-1">Employment Form</h3>
                            <p>Seaboard Group Employee Data Form</p>
                        </div>

                        <div className="steps">
                            <div>
                                <i className="las la-universal-access activeStep"></i>
                                <p className="mb-0 mt-1 text-center">Personal</p>
                            </div>
                            <div>
                                <i className="las la-list-ol cnic_icon"></i>
                                <p className="mb-0 mt-1 text-center ">CNIC</p>
                            </div>
                            <div>
                                <i className="las la-phone-volume contact_icon"></i>
                                <p className="mb-0 mt-1 text-center ">Contact</p>
                            </div>
                            <div>
                                <i className="las la-file-alt documents_icon"></i>
                                <p className="mb-0 mt-1 text-center ">Documents</p>
                            </div>
                        </div>

                        <div className="Step1">
                            <form className="form1">
                                <div className="d-lg-flex justify-content-center mb-2">
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">Name:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="las la-font"></i>
                                            <input onChange={onChangeHandler} name="Name" type="text" pattern="[a-zA-Z][a-zA-Z\s]*" title="Name only contains letters" className="form-control" required minLength="3" />
                                        </div>
                                    </div>
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">Father Name:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="las la-bold"></i>
                                            <input onChange={onChangeHandler} name="FatherName" type="text" pattern="[a-zA-Z][a-zA-Z\s]*" title="Father Name only contains letters" className="form-control" required minLength="3" />
                                        </div>
                                    </div>
                                </div>
                                <div className="d-lg-flex justify-content-center mb-2">
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">Date of Birth:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="lar la-calendar"></i>
                                            <input onChange={onChangeHandler} name="Dob" type="date" className="form-control" required />
                                        </div>
                                    </div>
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">Place of Birth:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="las la-location-arrow"></i>
                                            <input list="cities" onChange={onChangeHandler} name="PoB" type="text" className="form-control" pattern="^[A-Za-z]+$" title="Place of birth only contains letters" required minLength="3" placeholder="City" />
                                            <datalist id="cities">
                                                <option value="Karachi" />
                                                <option value="Lahore" />
                                                <option value="Queta" />
                                                <option value="Peshawer" />
                                                <option value="Kashmir" />
                                            </datalist>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-lg-flex justify-content-center mb-2">
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">Gender:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="las la-mercury"></i>
                                            <select onChange={onChangeHandler} name="gender" className="form-control" required>
                                                <option value="">Select The Option</option>
                                                <option value="Male">Male</option>
                                                <option value="FeMale">FeMale</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">Email:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="las la-envelope"></i>
                                            <input onChange={onChangeHandler} name="email" type="email" className="form-control" required />
                                        </div>
                                    </div>
                                </div>
                                <div className="d-lg-flex justify-content-center mb-2">
                                    <div className={Employee.maritalStatus === 'Married' ? "leftRight mr-2" : "leftRight mr-2 w-100"}>
                                        <label className="mb-0 font-weight-bold">Marital Status:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="las la-ring"></i>
                                            <select onChange={onChangeHandler} name="maritalStatus" className="form-control" required>
                                                <option value="">Select The Option</option>
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                            </select>
                                        </div>
                                    </div>
                                    {
                                        Employee.maritalStatus === 'Married'
                                            ?
                                            <div className="leftRight mr-2">
                                                <label className="mb-0 font-weight-bold">NO. of Children ( if any ):</label>
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <i className="las la-baby"></i>
                                                    <input onChange={onChangeHandler} name="ChildCount" type='number' className="form-control" required />
                                                </div>
                                            </div>
                                            :
                                            <></>
                                    }
                                </div>
                                {
                                    Employee.ChildCount > 0 && Employee.maritalStatus === 'Married'
                                        ?
                                        <>
                                            {
                                                parseInt(ChildrenAdded.length) === parseInt(Employee.ChildCount)
                                                    ?
                                                    null
                                                    :
                                                    <div className="d-lg-flex justify-content-center mb-2">
                                                        <input type="text" className="d-none" required />
                                                        <div className="leftRight mr-2 w-100">
                                                            <input className="btn btn-sm d-block mx-auto AddChildBtn" type="button" data-toggle="modal" data-target="#AddChild" value="Add Child" required />
                                                        </div>
                                                    </div>
                                            }
                                            <div className="d-lg-flex justify-content-center mb-2">
                                                <div className="leftRight mr-2 w-100">
                                                    <label className="mb-0 font-weight-bold">Children Details:</label>
                                                    <div className="d-flex justify-content-between align-items-center px-5 mx-auto">
                                                        <p className="font-weight-bold">Sr.NO</p>
                                                        <p className="font-weight-bold">Name</p>
                                                        <p className="font-weight-bold">Age</p>
                                                        <p className="font-weight-bold">Gender</p>
                                                    </div>
                                                    {
                                                        ChildrenAdded.map(
                                                            (val, index) => {
                                                                return (
                                                                    <div className="d-flex justify-content-between align-items-center px-5 mx-auto" key={index}>
                                                                        <p className="mb-0 border-bottom"> {index + 1} </p>
                                                                        <p className="mb-0 border-bottom"> {val.childName} </p>
                                                                        <p className="mb-0 border-bottom"> {val.childAge} </p>
                                                                        <p className="mb-0 border-bottom"> {val.childGender} </p>
                                                                    </div>
                                                                )
                                                            }
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </>
                                        :
                                        <></>
                                }
                                <button className="btn btn-sm d-none mx-auto AddChildBtn" type="button" data-toggle="modal" data-target="#AddChild">Add Child</button>
                                <div className="text-right mt-3 mr-2">
                                    <button type="submit" className="btn btn-sm step1_btn_next">Next</button>
                                </div>
                            </form>
                        </div>

                        <div className="Step2">
                            <form className="form2">
                                <div className="d-lg-flex justify-content-center mb-2">
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">CNIC:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="las la-list-ol"></i>
                                            <input onChange={onChangeHandler} name="cnic" type="text" pattern="^[0-9]+$" title="CNIC only contains numbers" className="form-control" required minLength="13" maxLength="13" />
                                        </div>
                                    </div>
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">Date of Issue:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="lar la-calendar-check"></i>
                                            <input onChange={onChangeHandler} name="cnic_DoI" type="date" className="form-control" required />
                                        </div>
                                    </div>
                                </div>
                                <div className="d-lg-flex justify-content-center mb-2">
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">Place of Issue:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="las la-map-marked-alt"></i>
                                            <input onChange={onChangeHandler} name="cnic_PoI" type="text" className="form-control" pattern="[a-zA-Z][a-zA-Z\s]*" title="Place Of Issue only contains letters" required minLength="3" maxLength="30" placeholder="city" />
                                        </div>
                                    </div>
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">Date of Expiry:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="lar la-calendar-times"></i>
                                            <input onChange={onChangeHandler} name="cnic_DoE" type="date" className="form-control" required />
                                            <datalist id="cities">
                                                <option value="Karachi" />
                                                <option value="Lahore" />
                                                <option value="Queta" />
                                                <option value="Peshawer" />
                                                <option value="Kashmir" />
                                            </datalist>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-lg-flex justify-content-center mb-2">
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">CNIC Front Image:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="las la-id-card-alt"></i>
                                            <input onChange={onImageUpload} name="cnic_front_photo" type="file" className="form-control" required accept=".jpg, .jpeg, .png" />
                                        </div>
                                    </div>
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">CNIC Back Image:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="las la-folder-open"></i>
                                            <input onChange={onImageUpload} name="cnic_back_photo" type="file" className="form-control" required accept=".jpg, .jpeg, .png" />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right mt-3 mr-2">
                                    <button type="button" className="btn btn-sm step2_btn_prev">Previous</button>
                                    <button type="submit" className="btn btn-sm step2_btn_next">Next</button>
                                </div>
                            </form>
                        </div>

                        <div className="Step3">
                            <form className="form3">
                                <div className="d-lg-flex justify-content-center mb-2">
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">Residential Address:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="las la-map-marked"></i>
                                            <input onChange={onChangeHandler} name="RsdtAddress" type="text" className="form-control" minLength="10" required />
                                        </div>
                                    </div>
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">Permanent Address:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="las la-map-marker"></i>
                                            <input onChange={onChangeHandler} name="PrmtAddress" type="text" className="form-control" minLength="10" required />
                                        </div>
                                    </div>
                                </div>
                                <div className="d-lg-flex justify-content-center mb-2">
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">Emergency Contact Person:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="las la-ambulance"></i>
                                            <input onChange={onChangeHandler} name="Emergency_contact_person" type="text" className="form-control" pattern="[a-zA-Z][a-zA-Z\s]*" title="Emergency Contact Person Name only contains letters" minLength="3" required />
                                        </div>
                                    </div>
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">Emergency Contact Number:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="las la-mobile-alt"></i>
                                            <input onChange={onChangeHandler} name="Emergency_contact_number" pattern="^[0-9]+$" title="Emergency Person Number only contains number" type="text" className="form-control" minLength="11" maxLength="13" required />
                                        </div>
                                    </div>
                                </div>
                                <div className="d-lg-flex justify-content-center mb-2">
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">Landline Home:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="las la-phone-volume"></i>
                                            <input onChange={onChangeHandler} name="landlineHome" type="text" className="form-control" pattern="^[0-9]+$" title="Lanline Home only contains numbers" minLength="3" maxLength="15" required />
                                        </div>
                                    </div>
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">Personal Cell Phone Number:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="las la-phone-square-alt"></i>
                                            <input onChange={onChangeHandler} name="personal_no" pattern="^[0-9]+$" type="text" className="form-control" minLength="11" maxLength="13" required />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right mt-3 mr-2">
                                    <button type="button" className="btn btn-sm step3_btn_prev">Previous</button>
                                    <button type="submit" className="btn btn-sm step3_btn_next">Next</button>
                                </div>
                            </form>
                        </div>

                        <div className="Step4">
                            <form onSubmit={EmplloyeeSetup} encType="multipart/form-data">
                                <div className="d-lg-flex justify-content-center mb-2">
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">CV:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="las la-id-card"></i>
                                            <input onChange={onImageUpload} multiple name="emp_cv" type="file" className="form-control" accept=".jpg, .jpeg, .png, .pdf" required />
                                        </div>
                                    </div>
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">Proof of Address:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="lar la-id-badge"></i>
                                            <input onChange={onImageUpload} name="emp_prfaddrs" type="file" className="form-control" accept=".jpg, .jpeg, .png" required />
                                        </div>
                                    </div>
                                </div>
                                <div className="d-lg-flex justify-content-center mb-2 px-5">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th colSpan="2">Licences ( If the employee is driver or a guard )</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    Driving License
                                                </td>
                                                <td>
                                                    <input type="checkbox" value="drivingLicense" onChange={OnLicenseChange} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    Armed License
                                                </td>
                                                <td>
                                                    <input type="checkbox" value="armedLicense" onChange={OnLicenseChange} />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                {
                                    DrvLcnse
                                        ?
                                        <div className="d-lg-flex justify-content-center mb-2">
                                            <div className="leftRight mr-2 w-100">
                                                <label className="mb-0 font-weight-bold">Driving License:</label>
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <i className="las la-newspaper"></i>
                                                    <input onChange={onImageUpload} name="DrvLicense" type="file" className="form-control" accept=".jpg, .jpeg, .png" required />
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                                {
                                    ArmdLcnse
                                        ?
                                        <div className="d-lg-flex justify-content-center mb-2">
                                            <div className="leftRight mr-2 w-100">
                                                <label className="mb-0 font-weight-bold">Armed License:</label>
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <i className="las la-toilet-paper"></i>
                                                    <input onChange={onImageUpload} name="ArmdLicense" type="file" className="form-control" accept=".jpg, .jpeg, .png" required />
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                                <div className="d-lg-flex justify-content-center mb-2">
                                    <div className="leftRight mr-2 w-100">
                                        <div className="d-lg-flex justify-content-center mb-2">
                                            <div className="employee_img" data-toggle="modal" data-target="#myModal" style={{ 'backgroundImage': "url('" + empImages + "')" }}></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right mt-3 mr-2">
                                    <button type="button" className="btn btn-sm step4_btn_prev">Previous</button>
                                    <button type="submit" className="btn btn-sm step4_btn_next">Submit</button>
                                </div>
                            </form>
                        </div>

                        <div className="Step5">
                            <div className="d-lg-flex justify-content-center mb-2">
                                <h3 className="mt-4">Form Submitted Successfully</h3>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div id="myModal" className="modal fade empModals" role="dialog">
                <div className="modal-dialog modal-dialog-centered">


                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">LIVE CAMERA</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            {
                                Camera ?
                                    <>
                                        <Webcam
                                            audio={false}
                                            screenshotFormat="image/jpeg"
                                            width='100%'
                                            ref={refs}
                                            videoConstraints={videoConstraints}
                                        />
                                        <button className="btn btn-sm btn-block mt-3" onClick={takePhoto}>TAKE YOUR PHOTO</button>
                                    </>
                                    :
                                    <h4 className="text-center my-3">Camera Not Found</h4>
                            }
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>

                </div>
            </div>

            <div id="AddChild" className="modal fade empModals" role="dialog">
                <div className="modal-dialog modal-dialog-centered">


                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Enter Children Details</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="add_div">
                                <label className="mb-0">Name</label>
                                <input onChange={onChildrenChange} name="childName" type="text" className="form-control" value={Children.childName} />
                                <label className="mb-0">Age</label>
                                <input onChange={onChildrenChange} name="childAge" type="number" className="form-control" value={Children.childAge} />
                                <label className="mb-0">Gender</label>
                                <select onChange={onChildrenChange} name="childGender" className="form-control" value={Children.childGender}>
                                    <option value="">Select an option</option>
                                    <option value="Male">Male</option>
                                    <option value="FeMale">FeMale</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-sm btn-default" data-dismiss="modal" onClick={AddChildren}>Add</button>
                        </div>
                    </div>

                </div>
            </div>

        </>

    )

}

export default EmployementForm;