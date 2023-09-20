import axios from '../../../../../axios';
import JSAlert from 'js-alert';
import $ from 'jquery';

export const loadList = ( setList ) => {

    axios.post(
        '/container/get/list',
        {
            emp_id: localStorage.getItem('EmpID')
        }
    )
    .then(
        res => 
        {
                
            setList(res.data);

        }
    ).catch(
        err => {

            console.log(err);

        }
    );

}

export const GetLocations = ( setLocations ) => {

    axios.get('/getalllocations').then(
        res => {

            setLocations( res.data );

        }
    ).catch(
        err => {

            console.log( err );

        }
    )

}

export const Entry = ( e, history ) => {

    e.preventDefault();
    const container_no = e.target['container_no'].value;
    const location_code = e.target['location_code'].value;
    const status = e.target['status'].value;
    $('fieldset').prop('disabled', true);

    axios.post(
        '/container/new_entry',
        {
            emp_id: localStorage.getItem('EmpID'),
            container_no: container_no,
            location_code: location_code,
            status: status
        }
    )
    .then(
        res => 
        {
                
            if ( res.data === 'exists' )
            {
                JSAlert.alert('Already entered!!!').dismissIn(1000 * 2);
                $('fieldset').prop('disabled', false);
            }else
            {
                JSAlert.alert('New Entry Succeed!!!').dismissIn(1000 * 2);
                setTimeout(() => {
                    history.replace('/qfs/container/in_out');
                }, 1500);
            }

        }
    ).catch(
        err => {

            console.log(err);
            $('fieldset').prop('disabled', false);

        }
    );

}