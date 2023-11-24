import axios from '../../../../../axios';
import $ from 'jquery';
import JSAlert from 'js-alert';
import moment from 'moment';

export const GetCompanies = ( setCompanies ) => {
    axios.get('/getallcompanies')
    .then(
        res => 
        {     
            setCompanies(res.data);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
}

export const acceptAssignedTask = ( task_id, review_id, setGrowthReviewDetails, setConfirmAcceptance, setAcceptanceContent, setGrowthCategories ) => {
    document.getElementById('confirmBtn').setAttribute('disabled', true);
    $("fieldset").prop('disabled', true);
    setAcceptanceContent(
        <>
            <h6 className='text-center p-3 mb-0'><b>Please Wait....</b></h6>
        </>
    );
    axios.post(
        '/acr/growth-review/accept/task',
        {
            id: task_id
        }
    )
    .then(
        () => {
            setConfirmAcceptance(false);
            setAcceptanceContent(<></>);
            $("fieldset").prop('disabled', false);
            JSAlert.alert("Task has been accepted.", 'Success', JSAlert.Icons.Success).dismissIn(1000 * 2);
            loadGrowthReviewDetails( window.location.href.split('/').pop(), setGrowthReviewDetails, setGrowthCategories );
        }
    ).catch(
        err => {    
            setConfirmAcceptance(false);
            setAcceptanceContent(<></>);
            $("fieldset").prop('disabled', false);
            console.log(err);
            JSAlert.alert(`Something went wrong. ${err}`, 'Request Failed', JSAlert.Icons.Failed);
        }
    );
}

export const rejectAssignedTask = ( e, task_id, review_id, setGrowthReviewDetails, setConfirmAcceptance, setAcceptanceContent, setGrowthCategories ) => {
    e.preventDefault();
    const remarks = e.target['remarks'].value;
    if (remarks.trim().length < 20) {
        JSAlert.alert("Reason must contains 20 characters.", 'Validation Error', JSAlert.Icons.Warning).dismissIn(1000 * 4);
        return false;
    }
    document.getElementById('confirmBtn').setAttribute('disabled', true);
    $("fieldset").prop('disabled', true);
    setAcceptanceContent(<>
        <h6 className='p-3 mb-0 text-center'><b>Please Wait...</b></h6>
    </>);

    axios.post(
        '/acr/growth-review/reject/task',
        {
            id: task_id,
            remarks: remarks
        }
    )
    .then(
        () => 
        {
            setConfirmAcceptance(false);
            setAcceptanceContent(<></>);
            $("fieldset").prop('disabled', false);
            JSAlert.alert("Task has been rejected.", 'Success', JSAlert.Icons.Success).dismissIn(1000 * 2);
            loadGrowthReviewDetails( window.location.href.split('/').pop(), setGrowthReviewDetails, setGrowthCategories );
        }
    ).catch(
        err => {
            setConfirmAcceptance(false);
            setAcceptanceContent(<></>);
            $("fieldset").prop('disabled', false);
            console.log(err);
            JSAlert.alert(`Something went wrong. ${err}`, 'Request Failed', JSAlert.Icons.Failed);
        }
    );
}

export const addRow = ( e, category, List, setList ) => {
    e.preventDefault();
    const task = e.target['task'].value;
    const start_date = e.target['start_date'].value;
    const deadline = e.target['deadline'].value;
    // if ( deadline < moment().format('YYYY-MM-DD') )
    // {
    //     JSAlert.alert("Deadline should be greater than the current date!!!.").dismissIn(1000 * 2);
    //     return false;
    // }
    if ( !List )
    {
        const arr = [{category: category, task: task, deadline: deadline, start_date: start_date}];
        setList(arr);
    }else
    {
        let arr = List;
        arr = [...arr, {category: category, task: task, deadline: deadline, start_date: start_date}]
        setList(arr);
    }
    document.getElementById("addRowForm").reset();
    document.getElementById("addRowForm" + category).reset();
}

export const setInCompleteTask = ( e, task_id, review_id, setGrowthReviewDetails, setConfirmAction, setActionContent, setGrowthCategories, confirmed ) => {
    e.preventDefault();
    const remarks = e.target['remarks'].value;
    if (remarks.trim().length < 20) {
        JSAlert.alert("Remarks must contains 20 characters.", 'Validation Error', JSAlert.Icons.Warning).dismissIn(1000 * 4);
        return false;
    }

    setActionContent(<>
        <h6 className='p-3 mb-0 text-center'><b>Please Wait...</b></h6>
    </>);
    document.getElementById('confirmBtn').setAttribute('disabled', true);
    $("fieldset").prop('disabled', true);
    axios.post(
        '/acr/growth-review/task/incomplete',
        {
            id: task_id,
            confirmed: confirmed === undefined ? null : confirmed === true ? 1 : 0,
            remarks: remarks
        }
    )
    .then(
        () => 
        {
            $("fieldset").prop('disabled', false);
            JSAlert.alert("Task has been set to incomplete.", "Alright", JSAlert.Icons.Success).dismissIn(1000 * 2);
            loadGrowthReviewDetails( window.location.href.split('/').pop(), setGrowthReviewDetails, setGrowthCategories );
            setConfirmAction(false);
            setActionContent(<></>);
        }
    ).catch(
        err => {
            setConfirmAction(false);
            setActionContent(<></>);
            $("fieldset").prop('disabled', false);
            console.log(err);
            JSAlert.alert(`Something went wrong. ${err}`, 'Request Failed', JSAlert.Icons.Failed);
        }
    );
}

export const setCompleteTask = ( e, task_id, review_id, setGrowthReviewDetails, setConfirmAction, setActionContent, setGrowthCategories, confirmed ) => {
    e.preventDefault();
    const remarks = e.target['remarks'].value;
    if (remarks.trim().length < 20) {
        JSAlert.alert("Remarks must contains 20 characters.", 'Validation Error', JSAlert.Icons.Warning).dismissIn(1000 * 4);
        return false;
    }
    document.getElementById('confirmBtn').setAttribute('disabled', true);
    $("fieldset").prop('disabled', true);
    setActionContent(
        <>
            <h6 className='text-center p-3 mb-0'><b>Please Wait....</b></h6>
        </>
    );

    axios.post(
        '/acr/growth-review/task/complete',
        {
            id: task_id,
            confirmed: confirmed === undefined ? null : confirmed === true ? 1 : 0,
            remarks: remarks
        }
    )
    .then(
        () => 
        {
            $("fieldset").prop('disabled', false);
            if (confirmed === undefined) {
                JSAlert.alert("You have completed a task.", "Congratulations", JSAlert.Icons.Success).dismissIn(1000 * 2);
            }else {
                JSAlert.alert("The task has been completed.", "Success", JSAlert.Icons.Success).dismissIn(1000 * 2);
            }
            loadGrowthReviewDetails( window.location.href.split('/').pop(), setGrowthReviewDetails, setGrowthCategories );
            setConfirmAction(false);
            setActionContent(<></>);
        }
    ).catch(
        err => {
            setConfirmAction(false);
            setActionContent(<></>);
            $("fieldset").prop('disabled', false);
            console.log(err);
            JSAlert.alert(`Something went wrong. ${err}`, 'Request Failed', JSAlert.Icons.Failed);
        }
    );
}

export const loadSubordinates = ( AccessControls, setEmployees ) => {

    let accessKey = 0;
    if ( AccessControls && Object.keys(AccessControls).length > 0 )
    {
        for ( let y = 0; y < JSON.parse(AccessControls.access).length; y++ )
        {
            if ( parseInt(JSON.parse(AccessControls.access)[y]) === 0 || parseInt(JSON.parse(AccessControls.access)[y]) === 36 )
            {
                accessKey = 1;
            }else
            if ( parseInt(JSON.parse(AccessControls.access)[y]) === 40 )
            {
                accessKey = 2;
            }else
            if ( parseInt(JSON.parse(AccessControls.access)[y]) === 41 )
            {
                accessKey = 3;
            }
        }
    }
    axios.post(
        '/get/employees/all',
        {
            emp_id: localStorage.getItem('EmpID'),
            accessKey: accessKey,
            company_code: AccessControls.company_code,
            department_code: AccessControls.department_code
        }
    ).then(
        res => {
            setEmployees( res.data );
        }
    ).catch(
        err => {
            console.log( err );
        }
    );
    return accessKey;

}

export const loadSubordinatesForGrowthReview = ( quarter, setEmployees ) => {
    axios.post(
        '/acr/growth-review/employees/all',
        {
            emp_id: localStorage.getItem('EmpID'),
            quarter: quarter,
        }
    ).then(
        res => {
            setEmployees( res.data );
        }
    ).catch(
        err => {
            console.log( err );
        }
    );
}

export const loadPeers = ( quarter, setEmployees ) => {
    axios.post(
        '/acr/peer-review/employees/all',
        {
            emp_id: localStorage.getItem('EmpID'),
            quarter: quarter,
        }
    ).then(
        res => {
            setEmployees( res.data );
        }
    ).catch(
        err => {
            console.log( err );
        }
    );
}

export const loadAllSelfSubmissions = ( setSelfSubmissions ) => {
    axios.get('/acr/self-assessment/submissions/all').then(
        res => {
            setSelfSubmissions( res.data );
        }
    ).catch(
        err => {
            console.log( err );
        }
    );
}

export const loadSeniors = ( setEmployees ) => {

    axios.post(
        '/get_employee_sr',
        {
            empID: localStorage.getItem('EmpID')
        }
    ).then(
        res => {

            setEmployees( res.data );

        }
    ).catch(
        err => {

            console.log( err );

        }
    );

}

export const loadSelfAssessmentData = ( setSelfAssessmentData ) => {
    axios.post(
        '/acr/self-assessment/data',
        {
            empID: localStorage.getItem('EmpID')
        }
    ).then(
        res => {
            setSelfAssessmentData( res.data );
        }
    ).catch(
        err => {
            console.log( err );
        }
    );
}

export const loadGrowthReviewData = ( setGrowthReviewData ) => {
    axios.post(
        '/acr/growth-review/data',
        {
            empID: window.location.href.split('/').pop()
        }
    ).then(
        res => {
            setGrowthReviewData( res.data );
        }
    ).catch(
        err => {
            console.log( err );
        }
    );
}

export const loadEmpPeerReview = ( setPeerReviewData ) => {
    axios.post(
        '/acr/peer-review/data',
        {
            empID: window.location.href.split('/').pop(),
            review_by: localStorage.getItem('EmpID')
        }
    ).then(
        res => {
            setPeerReviewData( res.data );
        }
    ).catch(
        err => {
            console.log( err );
        }
    );
}

export const loadEmpGrowthReviewData = ( setEmpGrowthReviewData ) => {
    axios.post(
        '/acr/growth-review/emp_data',
        {
            empID: localStorage.getItem('EmpID')
        }
    ).then(
        res => {
            setEmpGrowthReviewData( res.data );
        }
    ).catch(
        err => {
            console.log( err );
        }
    );
}

export const loadSelfAssessmentDetails = ( id, setSelfAssessmentDetails ) => {
    axios.post(
        '/acr/self-assessment/details',
        {
            id: id
        }
    ).then(
        res => {
            setSelfAssessmentDetails(
                {
                    details: res.data[0][0],
                    tickets: res.data[1]
                }
            );
        }
    ).catch(
        err => {
            console.log( err );
        }
    );
}

export const loadAllTickets = ( setAllTickets ) => {
    axios.get('/acr/performance/tickets/all').then(
        res => {
            console.log(res.data);
            setAllTickets(res.data);
        }
    ).catch(
        err => {
            console.log( err );
        }
    );
}

export const loadPeerReviewDetails = ( id, setPeerReviewDetails ) => {
    axios.post(
        '/acr/peer-review/details',
        {
            id: id
        }
    ).then(
        res => {
            setPeerReviewDetails( res.data[0] );
        }
    ).catch(
        err => {
            console.log( err );
        }
    );
}

export const enterReply = ( ticket_id, reply, generated_by, emp_id, generated_date, setList ) => {
    $(".reply_btn").prop('disabled', true);
    axios.post(
        '/acr/ticket/reply',
        {
            ticket_id: ticket_id,
            reply: reply,
            generated_by: generated_by, 
            emp_id: emp_id,
            generated_date: generated_date
        }
    ).then(
        () => {
            JSAlert.alert(`Reply added!!!`).dismissIn(1000 * 2);
            loadTicketIssued( setList );
        }
    ).catch(
        err => {
            console.log( err );
            $(".reply_btn").prop('disabled', false);
        }
    );
}

export const deleteTicket = ( data, allTickets, setConfirmRemoval, setList, setAllTickets ) => {
    $('#removalConfirmationBtn').prop('disabled', true);
    axios.post(
        '/acr/ticket/delete',
        {
            data: JSON.stringify(data)
        }
    ).then(
        () => {
            $('#removalConfirmationBtn').prop('disabled', false);
            setConfirmRemoval(false);
            if( allTickets ) {
                loadAllTickets(setAllTickets);
            }else {
                loadTicketIssued( setList );
            }
        }
    ).catch(
        err => {
            $('#removalConfirmationBtn').prop('disabled', false);
            console.log( err );
        }
    );
}

export const addNewCategory = ( e, setGrowthCategories, setCategoryModal ) => {
    const category = e.target['category'].value;
    if (category.trim().length === 0) {
        JSAlert.alert("Category is required.", 'Validation Error', JSAlert.Icons.Warning).dismissIn(1000 * 4);
        return false;
    }
    setGrowthCategories();
    $("fieldset").prop('disabled', true);
    setCategoryModal(
        <>
            <h6 className='text-center p-3 mb-0'><b>Creating Category....</b></h6>
        </>
    )
    axios.post(
        '/acr/growth-review/category/add',
        {
            category: category,
            emp_id: window.location.href.split('/').pop(),
            created_by: localStorage.getItem('EmpID')
        }
    ).then(
        () => {
            setCategoryModal();
            $("fieldset").prop('disabled', false);
            JSAlert.alert("New category has been added successfully.", "Category Created", JSAlert.Icons.Success).dismissIn(1000 * 2);
            loadCategories( setGrowthCategories );
        }
    ).catch(
        err => {
            setCategoryModal();
            $("fieldset").prop('disabled', false);
            console.log(err);
            JSAlert.alert(`Something went wrong. ${err}`, 'Request Failed', JSAlert.Icons.Failed);
        }
    );
}

export const updateCategory = ( e, id, setCategoryModal, setGrowthCategories ) => {
    const category = e.target['category'].value;
    if (category.trim().length === 0) {
        JSAlert.alert("Category is required.", 'Validation Error', JSAlert.Icons.Warning).dismissIn(1000 * 4);
        return false;
    }
    setGrowthCategories();
    $("fieldset").prop('disabled', true);
    setCategoryModal(
        <>
            <h6 className='text-center p-3 mb-0'><b>Updating Category....</b></h6>
        </>
    )
    axios.post(
        '/acr/growth-review/category/update',
        {
            category: category,
            id: id
        }
    ).then(
        () => {
            setCategoryModal();
            $("fieldset").prop('disabled', false);
            JSAlert.alert("Category has been updated successfully.", "Name Has Changed", JSAlert.Icons.Success).dismissIn(1000 * 2);
            loadCategories( setGrowthCategories );
        }
    ).catch(
        err => {
            setCategoryModal();
            $("fieldset").prop('disabled', false);
            console.log(err);
            JSAlert.alert(`Something went wrong. ${err}`, 'Request Failed', JSAlert.Icons.Failed);
        }
    );
}

export const loadCategories = (setGrowthCategories) => {
    axios.post(
        '/acr/growth-review/categories',
        {
            emp_id: window.location.href.split('/').pop()
        }
    ).then(
        res => {
            setGrowthCategories(res.data);
        }
    ).catch(
        err => {
            console.log( err );
        }
    );
}

export const loadGrowthReviewDetails = ( id, setGrowthReviewDetails, setGrowthCategories ) => {
    axios.post(
        '/acr/growth-review/details',
        {
            emp_id: id
        }
    ).then(
        res => {
            loadCategories( setGrowthCategories )
            setGrowthReviewDetails(res.data);
        }
    ).catch(
        err => {
            console.log( err );
        }
    );
}

export const loadGrowthReviewDetailsFiltered = ( id, start_date, end_date, setGrowthReviewDetails, setGrowthCategories ) => {
    axios.post(
        '/acr/growth-review/details/filter',
        {
            emp_id: id,
            start_date: start_date,
            end_date: end_date
        }
    ).then(
        res => {
            loadCategories( setGrowthCategories )
            setGrowthReviewDetails(res.data);
        }
    ).catch(
        err => {
            console.log( err );
        }
    );
}

export const loadTicketIssued = ( setList ) => {

    axios.post(
        '/employees/tickets/fetch/issued',
        {
            emp_id: localStorage.getItem('EmpID')
        }
    ).then(
        res => {
            setList( res.data );
            $(".reply_btn").prop('disabled', false);
        }
    ).catch(
        err => {

            console.log( err );

        }
    );

}

export const issueTicket = ( e, Ticket, Employee, history, setContent, setSubmitConfirm ) => {

    e.preventDefault();
    const remarks = e.target['remarks'].value;

    if ( !Employee )
    {
        JSAlert.alert("Kindly select an employee.").dismissIn(1000 * 2);
        return false;
    }

    if ( !Ticket )
    {
        JSAlert.alert("Kindly select a ticket.").dismissIn(1000 * 2);
        return false;
    }

    setContent(
        <>
            <form onSubmit={ (e) => issueTicketConfirmed( e, remarks, Ticket, Employee, history ) }>
                <fieldset>
                    <h6 className='text-capitalize'>Confirm To Issue {Ticket} Ticket To {Employee.name}?</h6>
                    <button className='btn d-block ml-auto mt-3 submit'>Confirm</button>
                </fieldset>
            </form>
        </>
    );
    setSubmitConfirm(true);

}

export const issueTicketConfirmed = ( e, remarks, Ticket, Employee, history ) => {

    e.preventDefault();

    $('fieldset').prop('disabled', true);
    axios.post(
        '/employees/tickets/generate',
        {
            emp_id: Employee.emp_id,
            ticket: Ticket,
            remarks: remarks,
            generated_by: localStorage.getItem('EmpID')
        }
    ).then(
        () => {

            JSAlert.alert("Ticket Generated.").dismissIn(1000 * 2);
            history.replace('/acr/options');

        }
    ).catch(
        err => {

            $('fieldset').prop('disabled', false);
            console.log( err );

        }
    );

}