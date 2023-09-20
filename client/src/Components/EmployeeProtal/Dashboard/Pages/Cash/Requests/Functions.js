import axios from '../../../../../../axios';

export const loadAllRequests = ( Admin, Cashier, location_code, setRequests ) => {
    axios.post(
        '/cash/load/requests',
        {
            emp_id: localStorage.getItem('EmpID'),
            accessKey: Admin ? 1 : 0,
            cashier: Cashier ? 1 : 0,
            location_code: location_code
        }
    )
    .then(
        res => 
        {
            setRequests(res.data);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
}