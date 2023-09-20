import moment from "moment";
import JSAlert from 'js-alert';
import axios from '../../../../../axios';

export const addRow = ( e, quarter, List, setList ) => {
    e.preventDefault();
    const task = e.target['task'].value;
    const deadline = e.target['deadline'].value;
    const deadlineQuarter = Math.floor((new Date(deadline).getMonth() + 3) / 3);
    // if ( deadline < moment().format('YYYY-MM-DD') )
    // {
    //     JSAlert.alert("Deadline should be greater than the current date!!!.").dismissIn(1000 * 2);
    //     return false;
    // }else
    // if ( quarter === 4 && deadlineQuarter !== 1 )
    // {
    //     JSAlert.alert("Deadline should be within quarter 1!!!.").dismissIn(1000 * 2);
    //     return false;
    // }else
    // if ( deadlineQuarter !== quarter )
    // {
    //     JSAlert.alert(`Deadline should be within quarter ${quarter}!!!.`).dismissIn(1000 * 2);
    //     return false;
    // }
    if ( !List )
    {
        const arr = [{task: task, deadline: deadline}];
        setList(arr);
    }else
    {
        let arr = List;
        arr = [...arr, {task: task, deadline: deadline}]
        setList(arr);
    }
    document.getElementById("addRowForm").reset();
}

export const onSubmit = ( history, quarter, List ) => {
    document.getElementById('growthreviewsubmitbtn').setAttribute('disabled', true);
    axios.post(
        '/acr/growth-review/submission',
        {
            tasks: JSON.stringify(List),
            submit_by: localStorage.getItem('EmpID'),
            emp_id: window.location.href.split('/').pop().split('&&name=').shift(),
            quarter: quarter
        }
    ).then(
        res => {
            if ( res.data === 'success' ) {
                JSAlert.alert("Form Submitted").dismissIn(1000 * 2);
                history.push('/acr/options');
            }else
            {
                document.getElementById('growthreviewsubmitbtn').setAttribute('disabled', false);
                JSAlert.alert("Something went wrong!!!").dismissIn(1000 * 2);
            }
        }
    ).catch(
        err => {
            document.getElementById('growthreviewsubmitbtn').setAttribute('disabled', false);
            console.log( err );
        }
    )
}