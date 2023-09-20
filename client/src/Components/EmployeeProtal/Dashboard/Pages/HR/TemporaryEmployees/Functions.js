import axios from '../../../../../../axios';
import JSAlert from 'js-alert';
import $ from 'jquery';

export const loadRequests = (access, companies, setRequests) => {
    const verification_person = JSON.parse(access).filter(acs => acs === 58)[0];
    axios.post(
        '/fetch/hr/temporary/employees/list',
        {
            companies: JSON.stringify(companies),
            verification_person: verification_person ? 1 : 0
        }
    )
    .then(
        res => {
            setRequests(res.data);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
}

export const GetCompanies = (setCompanies, setLocations, setDepartments) => {
    axios.get('/getallcompanies')
        .then(
            res => {
                let arr = [
                    {
                        text: "Select one option",
                        value: "",
                    }
                ];
                res.data.map(val => arr.push({ text: val.company_name, value: val.company_code }));
                setCompanies(arr);
                GetLocations(setLocations, setDepartments);
            }
        ).catch(
            err => {
                console.log(err);
            }
        );
}

export const GetLocations = (setLocations, setDepartments) => {
    axios.get('/getalllocations').then(
        res => {
            let arr = [
                {
                    text: "Select one option",
                    value: "",
                }
            ];
            res.data.map(val => arr.push({ text: val.location_name, value: val.location_code }));
            setLocations(arr);
            GetDepartments(setDepartments);
        }
    ).catch(
        err => {
            console.log(err);
        }
    )
}

export const GetDepartments = (setDepartments) => {
    setDepartments([]);
    // axios.get('/getalldepartments').then( response => {
    //     let arr = [
    //         {
    //             text: "Select one option",
    //             value: "",
    //         }
    //     ];
    //     response.data.map(val => arr.push({ text: val.department_name, value: val.department_code }));
    //     setDepartments( arr );
    // } ).catch(err => console.log(err));
}

export const GetDesignations = (department, setDesignations) => {
    axios.post('/getdesignations', { departID: department }).then(response => {
        let arr = [
            {
                text: "Select one option",
                value: "",
            }
        ];
        response.data.map(val => arr.push({ text: val.designation_name, value: val.designation_code }));
        setDesignations(arr);
    }).catch(err => console.log(err));
}

export const onSubmit = ( e, setLoading, CNICFront, CNICBack, empImage, history ) => {

    if ( !CNICFront || !CNICBack ) {
        JSAlert.alert("CNIC Information is required", "Warning", JSAlert.Icons.Warning, "Close").dismissIn(1500);
        return false;
    }

    setLoading(true);
    const Data = new FormData();
    Data.append("company_code", e.target['company_code'].value);
    Data.append("location_code", e.target['location_code'].value);
    Data.append("department", e.target['department'].value);
    Data.append("designation", e.target['designation'].value);
    Data.append("additional_notes", e.target['additional_notes'].value);
    Data.append("name", e.target['name'].value);
    Data.append("f_name", e.target['f_name'].value);
    Data.append("d_o_b", e.target['d_o_b'].value);
    Data.append("cell", e.target['cell'].value);
    Data.append("gender", e.target['gender'].value);
    Data.append("address", e.target['address'].value);
    Data.append("cnic_no", e.target['cnic_no'].value);
    Data.append("cnic_d_o_i", e.target['cnic_d_o_i'].value);
    Data.append("cnic_d_o_e", e.target['cnic_d_o_e'].value);
    Data.append("CNICFront", CNICFront.file);
    Data.append("CNICBack", CNICBack.file);
    Data.append("empImage", empImage.file);
    Data.append("created_by", localStorage.getItem("EmpID"));
    axios.post('/temporary/employee/create', Data, { headers: { 'content-type': 'multipart/form-data' } }).then(res => {
        setLoading(false);
        if ( res.data === 'SUCCESS' ) {
            JSAlert.alert("Employment request has been received", "Success", JSAlert.Icons.Success, "Okay").dismissIn(2000);
            setTimeout(() => {
                history.replace('/hr/temporary/employees/list');
            }, 1500);
        }else 
        JSAlert.alert("Something went wrong!!!.", "Error", JSAlert.Icons.Failed, "Try Again").dismissIn(1500);
    }).catch(err => {
        console.log(err);
        setLoading(false);
        JSAlert.alert("Something went wrong:" + err, "Error", JSAlert.Icons.Failed, "Try Again").dismissIn(1500);
    });
}

export const loadDetails = (emp_id, setDetails) => {
    axios.post('/hr/temporary/employee/data', { emp_id: emp_id }).then(response => {
        setDetails(response.data[0]);
    }).catch(err => console.log(err));
}

export const approveTempEmployee = (e, history) => {
    e.preventDefault();
    $('fieldset').prop('disabled', true);
    axios.post('/temporary/employee/confirm', { emp_id: window.location.href.split('/').pop(), approved_by: localStorage.getItem("EmpID"), remarks: e.target['remarks'].value }).then(res => {
        if ( res.data === 'SUCCESS' ) {
            JSAlert.alert("Employee status is active.", "Success", JSAlert.Icons.Success, "Okay").dismissIn(1500);
            setTimeout(() => {
                history.push('/hr/temporary/employees/list');
            }, 1500);
        }else
        JSAlert.alert("Something went wrong!!!.", "Error", JSAlert.Icons.Failed, "Try Again").dismissIn(1500);
        document.getElementById('submission').removeAttribute('disabled');
    }).catch(err => console.log(err));
}

export const verifyRequest = (e, history) => {
    e.preventDefault();
    $('fieldset').prop('disabled', true);
    axios.post('/temporary/employee/verification', { emp_id: window.location.href.split('/').pop(), verified_by: localStorage.getItem("EmpID"), remarks: e.target['remarks'].value }).then(res => {
        if ( res.data === 'SUCCESS' ) {
            JSAlert.alert("Employment request has been sent for approval.", "Success", JSAlert.Icons.Success, "Okay").dismissIn(1500);
            setTimeout(() => {
                history.push('/hr/temporary/employees/list');
            }, 1500);
        }else
        JSAlert.alert("Something went wrong!!!.", "Error", JSAlert.Icons.Failed, "Try Again").dismissIn(1500);
        document.getElementById('submission').removeAttribute('disabled');
    }).catch(err => console.log(err));
}