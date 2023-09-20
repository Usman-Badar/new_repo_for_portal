import axios from '../../../../../axios';
import JSAlert from 'js-alert';
import $ from 'jquery';

export const loadCategories = (setCategories) => {
    axios.get('/acr/self-assessment/categories')
    .then(
        res => 
        {
            setCategories(res.data);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
}
export const loadQuestions = (setQuestions, setTickets) => {
    axios.get('/acr/self-assessment/questions')
    .then(
        res => 
        {
            for ( let x = 0; x < res.data.length; x++ )
            {
                res.data[x].answer = "";
                res.data[x].name = 'answer_' + res.data[x].question_id;
                res.data[x].applicable = 1;
            }
            setQuestions(res.data);
            loadTickets(setTickets);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
}
export const loadTickets = (setTickets) => {
    axios.post(
        '/acr/self-assessment/tickets',
        {
            emp_id: localStorage.getItem("EmpID")
        }
    )
    .then(
        res => 
        {
            for ( let x = 0; x < res.data.length; x++ )
            {
                res.data[x].explanation = "";
                res.data[x].need_explanation = false;
                res.data[x].name = 'explanation_' + res.data[x].ticket_id;
            }
            setTickets(res.data);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
}
export const onSubmit = ( e, history, quarter, Questions, Tickets ) => {
    e.preventDefault();
    $('fieldset').prop('disabled', true);
    const arr = [];
    for ( let x = 0; x < Tickets.length; x++ )
    {
        if ( Tickets[x].need_explanation || Tickets[x].explanation.length > 0 )
        {
            arr.push(Tickets[x]);
        }
    }
    axios.post(
        '/acr/self-assessment/submission',
        {
            quarter: quarter,
            emp_id: localStorage.getItem('EmpID'),
            formData: JSON.stringify(Questions),
            tickets: JSON.stringify(arr) 
        }
    )
    .then(
        () => 
        {
            JSAlert.alert("Form Submitted!!!").dismissIn(1000 * 2);
            history.push('/acr/options');
        }
    ).catch(
        err => {
            $('fieldset').prop('disabled', false);
            console.log(err);
        }
    );
}