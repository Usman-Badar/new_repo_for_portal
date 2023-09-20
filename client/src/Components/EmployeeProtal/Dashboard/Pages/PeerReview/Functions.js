import JSAlert from 'js-alert';
import axios from '../../../../../axios';
import $ from 'jquery';

export const submitForm = (history, Form, quarter) => {
    $('fieldset').prop('disabled', true);
    axios.post(
        '/acr/peer-review/submission',
        {
            data: JSON.stringify(Form),
            submit_by: localStorage.getItem('EmpID'),
            emp_id: window.location.href.split('/').pop().split('&&name=').shift(),
            quarter: quarter
        }
    ).then(
        () => {
            JSAlert.alert("Form Submitted!!!").dismissIn(1000 * 2);
            history.push('/acr/options');
        }
    ).catch(
        err => {
            console.log( err );
            $('fieldset').prop('disabled', false);
        }
    )
}