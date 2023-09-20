import React, { Suspense, lazy, useEffect, useState } from 'react';

import { loadCategories, loadQuestions, loadTickets, onSubmit } from './functions';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import $ from 'jquery';
const UI = lazy(() => import('./UI'));

const SelfAssessmentForm = () => {
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    const history = useHistory();
    const today = new Date();
    const quarter = Math.floor((today.getMonth() + 3) / 3);
    const [ Categories, setCategories ] = useState([]);
    const [ Questions, setQuestions ] = useState();
    const [ Tickets, setTickets ] = useState();

    useEffect(
        () => {
            loadCategories(setCategories);
        }, []
    )
    useEffect(
        () => {
            if ( Categories.length > 0 ) loadQuestions(setQuestions, setTickets);
        }, [Categories]
    );
    useEffect(
        () => {
            if ( Questions && Questions.length > 0 )
            {
                if ( localStorage.getItem("self-assessment-review-draft") )
                {
                    let arr = JSON.parse(localStorage.getItem("self-assessment-review-draft")).filter(val => parseInt(val.emp_id) === parseInt(localStorage.getItem("EmpID")));
                    for ( let x = 0; x < arr.length; x++ )
                    {
                        if ( arr[x].answer )
                        {
                            Questions[parseInt(arr[x].index)].answer = arr[x].answer;
                        }
                        if ( arr[x].applicable !== undefined )
                        {
                            Questions[parseInt(arr[x].index)].applicable = parseInt(arr[x].applicable);
                        }
                    }
                }
            }
        }, [Questions]
    );

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        let arr = Questions.slice();
        const index = arr.findIndex(val => val.name === name);
        arr[index].answer = value;
        setQuestions(arr);
        saveToDraft(index, 'answer', value);
    }
    const onChangeHandlerTickets = (e) => {
        const { name, value } = e.target;
        let arr = Tickets.slice();
        const index = arr.findIndex(val => val.name === name);
        arr[index].explanation = value;
        setTickets(arr);
    }
    const onChangeCheckBoxes = (e) => {
        const { name, checked } = e.target;
        let arr = Questions.slice();
        const index = arr.findIndex(val => val.name === name);
        arr[index].applicable = checked ? 0 :1;
        setQuestions(arr);
        saveToDraft(index, 'checkbox', checked ? 0 :1);
    }
    const needExplanation = (index) => {
        let arr = Tickets.slice();
        if ( arr[index].need_explanation )
        {
            arr[index].explanation = "";
        }
        arr[index].need_explanation = !arr[index].need_explanation;
        setTickets(arr);
    }
    const saveToDraft = ( index, type, value ) => {
        let obj = {};
        if ( localStorage.getItem("self-assessment-review-draft") )
        {
            let arr = JSON.parse(localStorage.getItem("self-assessment-review-draft"));
            const i = arr.findIndex(val => parseInt(val.index) === index && parseInt(val.emp_id) === parseInt(localStorage.getItem("EmpID")));
            if ( i < 0 )
            {
                if ( type === 'answer' ) obj = { emp_id: localStorage.getItem('EmpID'), index: index, answer: value };
                if ( type === 'checkbox' ) obj = { emp_id: localStorage.getItem('EmpID'), index: index, applicable: value };
                arr.push(obj);
                localStorage.setItem("self-assessment-review-draft", JSON.stringify(arr));
            }else
            {
                if ( type === 'answer' ) arr[i].answer = value;
                if ( type === 'checkbox' ) arr[i].applicable = value;
                localStorage.setItem("self-assessment-review-draft", JSON.stringify(arr));
            }
        }else
        {
            if ( type === 'answer' ) obj = { emp_id: localStorage.getItem('EmpID'), index: index, answer: value };
            if ( type === 'checkbox' ) obj = { emp_id: localStorage.getItem('EmpID'), index: index, applicable: value };
            localStorage.setItem("self-assessment-review-draft", JSON.stringify([obj]));
        }

        $('.las.la-sync').addClass('animate');
        $('.las.la-sync').toggleClass('text-secondary');
        $('.savingTxt').addClass('animate');
        setTimeout(
            () => {
                $('.las.la-sync').removeClass('animate');
                $('.las.la-sync').toggleClass('text-secondary');
                $('.savingTxt').removeClass('animate');
            }, 2000
        )
    }

    return (
        <>
            <Suspense fallback={<div>Loading....</div>}>
                <UI 
                    history={ history }
                    quarter={ quarter }
                    AccessControls={ AccessControls }
                    Categories={ Categories }
                    Tickets={ Tickets }
                    Questions={ Questions }

                    needExplanation={ needExplanation }
                    onSubmit={ (e) => onSubmit( e, history, quarter, Questions, Tickets ) }
                    onChangeCheckBoxes={ onChangeCheckBoxes }
                    onChangeHandler={ onChangeHandler }
                    onChangeHandlerTickets={ onChangeHandlerTickets }
                />
            </Suspense>
        </>
    )
}
export default SelfAssessmentForm;