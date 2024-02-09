import axios from '../../../../../../axios';

export const loadAllRequests = ( ShipViewer, CashViewer, Admin, Cashier, companyViewer, companies, location_code, setRequests ) => {
    axios.post(
        '/cash/load/requests',
        {
            emp_id: localStorage.getItem('EmpID'),
            // shipViewer: ShipViewer ? 1 : 0,
            shp_line_adv_cash_viewer: ShipViewer ? 1 : 0,
            cashViewer: CashViewer ? 1 : 0,
            accessKey: Admin ? 1 : 0,
            cashier: Cashier ? 1 : 0,
            companies: companies, 
            companyViewer: companyViewer ? 1 : 0,
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