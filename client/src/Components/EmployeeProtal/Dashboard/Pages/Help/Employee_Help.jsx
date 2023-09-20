import React, { useEffect, useState } from 'react';
import './Employee_Help.css';
import $ from 'jquery';
import IMG from '../../../../../images/ezgif.com-gif-maker.gif';
import IMG1 from '../../../../../images/ezgif.com-gif-maker.gif';
import IMG2 from '../../../../../images/ezgif.com-gif-maker.gif';

const Employee_Help = () => {

    const [ SelectedRow, setSelectedRow ] = useState(
        {
            id: 0,
            question: '',
            answer: '',
            details: [
                {
                    img: '',
                    title: '',
                    desc: ''
                }
            ]
        }
    );

    const arr = [
        {
            id: 1,
            question: 'How to send purchase requisition form?',
            answer: 'By filling the form',
            details: [
                {
                    img: IMG,
                    title: 'heading',
                    desc: 'some text'
                },
                {
                    img: IMG1,
                    title: 'heading',
                    desc: 'some text'
                },
                {
                    img: IMG2,
                    title: 'heading',
                    desc: 'some text'
                },
                {
                    img: IMG,
                    title: 'heading',
                    desc: 'some text'
                }
            ]
        },
        {
            id: 2,
            question: 'How to send purchase requisition form?',
            answer: 'By filling the form',
            details: [
                {
                    img: IMG,
                    title: 'heading',
                    desc: 'some text'
                }
            ]
        },
        {
            id: 3,
            question: 'How to send purchase requisition form?',
            answer: 'By filling the form',
            details: [
                {
                    img: IMG,
                    title: 'heading',
                    desc: 'some text'
                }
            ]
        },
        {
            id: 4,
            question: 'How to send purchase requisition form?',
            answer: 'By filling the form',
            details: [
                {
                    img: IMG,
                    title: 'heading',
                    desc: 'some text'
                }
            ]
        },
        {
            id: 5,
            question: 'How to send purchase requisition form?',
            answer: 'By filling the form',
            details: [
                {
                    img: IMG,
                    title: 'heading',
                    desc: 'some text'
                }
            ]
        },
    ]

    useEffect(
        () => {
            $('.Showdiv').slideUp(0);
        }, []

    )
    useEffect(
        () => {
            $('.Employee_Help1').hide(0);
        }, []

    )

    const Show =( classnm ) => {
        $('.' + classnm).slideToggle()
    }
    const HelpDetails= ( id ) => {

        setSelectedRow(arr[id]);

        $('.Employee_Help').hide();
        $('.Employee_Help1').show();

    }
    const backPage= () => {

        $('.Employee_Help1').hide();
        $('.Employee_Help').show();

    }
    return (
        <>
            <div className="Employee_Help">
                <div className="Employee_Questions">
                    <div className="d-block text-center">
                        <i class="las la-question-circle"></i>
                        <h1>How can we help you?</h1>
                        <div className="d-flex inputDiv">
                            <input type="search" />
                            <button type="button" className="btn btn-primary">
                                <i className="las la-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="Employee_FAQs">
                    <div className="FAQs_Div">
                        {
                            arr.map(
                                (value, index) => {
                                    return (<>
                                        <div className="d-flex align-items-center justify-content-between bg-white rounded" onClick={() => Show("Showdiv" + index)}>
                                            <p>{ value.question }</p>
                                            <i className="las la-angle-down"></i>
                                        </div>
                                        <div className={ "Showdiv" + " Showdiv" + index }>
                                            <p>{ value.answer }</p>
                                            <p onClick={ () => HelpDetails( index ) } >Read more</p>
                                        </div>
                                    </>
                                    )
                                }
                            )
                        }
                    </div>
                </div>
            </div>
            <div className="Employee_Help1">
                <div onClick={backPage}>
                    <i class="las la-long-arrow-alt-left"></i>
                </div>
                <div className="d-flex align-items-center justify-content-center">
                    <div className="d-block text-center">
                        <h3> {SelectedRow.question} </h3>
                        <p>{SelectedRow.answer}</p>
                    </div>
                </div>
                {
                    SelectedRow.details.map(
                        ( val, index ) => {

                            return (
                                <div className="Employee_Help1_grid">
                                    {
                                        index % 2 === 0
                                        ?
                                            <>
                                                <div>
                                                    <img src={val.img} alt="#" />
                                                </div>
                                                <div>
                                                    <h3> {val.title} </h3>
                                                    <p>
                                                        {val.desc}
                                                    </p>
                                                </div>
                                            </>
                                        :
                                        <>
                                                <div>
                                                    <h3> {val.title} </h3>
                                                    <p>
                                                        {val.desc}
                                                    </p>
                                                </div>
                                                <div>
                                                    <img src={val.img} alt="#" />
                                                </div>
                                        </>
                                    }
                                </div>
                            )

                        }
                    )
                }
            </div>
            
        </>
    )
}
 export default Employee_Help;