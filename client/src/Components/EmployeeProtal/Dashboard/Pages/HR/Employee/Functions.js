import axios from '../../../../../../axios';

export const loadCompanies = ( setCompanies, setCompany ) => {

    axios.post(
        '/getemployeecompaniesauth',
        {
            emp_id: localStorage.getItem('EmpID')
        }
    )
    .then(
        res => 
        {
            setCompanies( res.data );
            if ( res.data.length === 1 )
            {
                setCompany(
                    {
                        company_code: res.data[0].company_code,
                        company_name: res.data[0].company_name
                    }
                );
            }
        }
    ).catch(
        err => {
            console.log(err);
        }
    );

}

export const loadEmployees = ( Company, Companies, setHREmployee ) => {

    axios.post(
        '/get/company/employees',
        {
            company_code: Company.company_code,
            companies: JSON.stringify(Companies)
        }
    )
    .then(
        res => 
        {
            setHREmployee(res.data);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );

}

export const fetchDetails = ( setEmployee ) => {

    axios.post(
        '/hr/employee/data',
        {
            emp_id: window.location.href.split('/').pop()
        }
    )
    .then(
        res => 
        {
            setEmployee(res.data[0]);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );

}

export const fetchList = ( setDesignations, setDepartments, setLocations, setGrades ) => {

    axios.get('/hr/employee/load/data')
    .then(
        res => 
        {
            setDesignations(res.data[0]);
            setDepartments(res.data[1]);
            setLocations(res.data[2]);
            setGrades(res.data[3]);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );

}