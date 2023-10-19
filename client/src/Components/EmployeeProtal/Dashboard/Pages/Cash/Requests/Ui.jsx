/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from 'react';
import './Style.css';

import moment from 'moment';
import CanvasJSReact from '../../../../../../canvasjs.react';
import { useHistory } from 'react-router-dom';

import ReactTooltip from 'react-tooltip';

function UI({ Range, ShowFilters, Status, RequestStatuses, Company, Amount, Requests, Keyword, Companies, setStatus, updateEndValue, setShowFilters, setKeyword, setAmount, setCompany }) {

    const CanvasJSChart = CanvasJSReact.CanvasJSChart;
    const d = moment(moment()).format('YYYY-MM-DD');
    const { FormatMoney } = require('format-money-js');
    const fm = new FormatMoney({ symbol: 'Rs ', decimals: 2 });
    const history = useHistory();
    const options = {
        title: null,
        theme: "light2",
        height: 200,
        data: [
        {
            // Change type to "doughnut", "line", "splineArea", etc.
            type: "column",
            dataPoints: [
                { label: "Apple",  y: 10, color: '#2E4D82'  },
                { label: "Orange", y: 15, color: '#2E4D82'  },
                { label: "Banana", y: 25, color: '#2E4D82'  },
                { label: "Mango",  y: 30, color: '#2E4D82'  },
                { label: "Grape",  y: 28, color: '#2E4D82'  }
            ]
        }
        ]
    }
    const types = {
        amount: 'amount',
    };

    const [ DateFilter, setDateFilter ] = useState('');
    const [ List, setList ] = useState([]);
    useEffect(
        () => {
            const Arr = Requests.filter(val => {return val.status.toLowerCase().includes(Status.toLowerCase()) && val.requested_emp_name.toLowerCase().includes(Keyword.toLowerCase()) && val.company_name.toLowerCase().includes(Company.toLowerCase()) && val.amount >= Amount && moment(new Date(val.receival_date)).format('YYYY-MM-DD') > DateFilter});
            setList(Arr);
        }, [ Requests, Status, Keyword, Company, Amount, DateFilter ]
    )

    // function splitToNChunks(array, n) {
    //     let result = [];
    //     for (let i = n; i > 0; i--) {
    //         result.push(array.splice(0, Math.ceil(array.length / i)));
    //     }
    //     return result;
    // }

    const sortArray = ( type, in_de, dataType ) => {
        const sortProperty = types[type];
        let sorted = sort( sortProperty, in_de, dataType );
        setList(sorted);
    };

    const sort = ( property, in_de, dataType ) => {
        const result =
        dataType === "number"
        ? sortNumber(property, in_de)
        : dataType === "string"
        ? sortString(property, in_de)
        : dataType === 'date'
        ? sortDate(property, in_de)
        : [];

        return result;
    }

    const sortNumber = ( property, in_de ) => {
        let sorted;
        if ( in_de > 0 )
        {
            sorted = [...List].sort((a, b) => b[property] - a[property]);
        }else
        {
            sorted = [...List].sort((a, b) => a[property] - b[property]);
        }
        return sorted;
    }

    const sortString = ( property, in_de ) => {
        let sorted;
        if ( in_de > 0 )
        {
            sorted = [...List].sort((a, b) => b[property].localeCompare(a[property]));
        }else
        {
            sorted = [...List].sort((a, b) => a[property].localeCompare(b[property]));
        }
        return sorted;
    }

    const sortDate = ( property, in_de ) => {
        let sorted;
        if ( in_de > 0 )
        {
            sorted = [...List].sort((a, b) => new Date(b[property]) - new Date(a[property]));
        }else
        {
            sorted = [...List].sort((a, b) => new Date(a[property]) - new Date(b[property]));
        }
        return sorted;
    }

    const resetFilters = () => {
        sessionStorage.removeItem('AC_Filters_Company');
        sessionStorage.removeItem('AC_Filters_Amount');
        sessionStorage.removeItem('AC_Filters_Keyword');
        setKeyword("");
        setCompany("");
        setAmount(0);
    }

    return (
        <>
            <div className="advance_cash_request page">
                <div className="advance_cash_request_container page-content">
                    <div className="d-flex align-items-center justify-content-between">
                        <h3 className="heading">
                            Advance Cash Requests
                            <sub>All The List Of The Cash Requests</sub>
                        </h3>
                        <div className='d-flex'>
                            <button className="btn submit px-2 filter-emit" onClick={() => setShowFilters(!ShowFilters)} type='button'>
                                {
                                    ShowFilters
                                        ?
                                        <>
                                            <i className="las la-times"></i>
                                        </>
                                        :
                                        <div data-tip data-for='filter'>
                                            {
                                                Keyword !== '' || Company !== '' || Amount !== 0 || DateFilter !== ''
                                                    ?
                                                    <div className='filterisOpen'></div>
                                                    :
                                                    null
                                            }
                                            <i className="las la-filter"></i>
                                            <ReactTooltip id='filter' place="top">
                                                Filters
                                            </ReactTooltip>
                                        </div>
                                }
                            </button>
                            <button className="btn submit px-3 ml-2 filter-emit" onClick={ () => history.push('/cash/form') } type='button'>
                                New
                            </button>
                        </div>
                    </div>
                    <br />
                    {
                        ShowFilters
                        ?
                            <>
                                <div className='filter-content popUps'>
                                    <div className='flex'>
                                        <div className='w-100'>
                                            <label className="font-weight-bold mb-0">Search Employee</label>
                                            <input placeholder='Search Keywords...' type="search" value={Keyword} onChange={(e) => setKeyword(e.target.value)} className='form-control form-control-sm mb-2' />
                                        </div>
                                        <div className='w-50'>
                                            {
                                                Companies
                                                    ?
                                                    <>
                                                        <label className="font-weight-bold mb-0">Company</label>
                                                        <select className='form-control form-control-sm mb-2' value={Company} onChange={(e) => setCompany(e.target.value)}>
                                                            <option value=''>Select Option</option>
                                                            {
                                                                Companies.sort().map(
                                                                    (company, index) => {

                                                                        return <option key={index} value={company}>{company}</option>;

                                                                    }
                                                                )
                                                            }
                                                        </select>
                                                    </>
                                                    : null
                                            }
                                        </div>
                                        <div className='w-50'>
                                            <label className="font-weight-bold mb-0">Amount</label>
                                            <input placeholder='Amount Greater (>) Than' type="number" value={Amount} onChange={(e) => setAmount(e.target.value)} className='form-control form-control-sm mb-2' />
                                        </div>
                                        <div className='w-50'>
                                            <label className="font-weight-bold mb-0">Due Since</label>
                                            <select className='form-control form-control-sm mb-2' value={DateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                                                <option value=''>Select Option</option>
                                                <option value={moment(d).subtract(7, 'days').format('YYYY-MM-DD')}>7 days+</option>
                                                <option value={moment(d).subtract(14, 'days').format('YYYY-MM-DD')}>14 days+</option>
                                                <option value={moment(d).subtract(28, 'days').format('YYYY-MM-DD')}>28 days+</option>
                                            </select>
                                        </div>
                                        <button className='btn green d-block ml-auto mt-2' type='button' onClick={resetFilters}>Reset All</button>
                                    </div>
                                </div>
                                <br />
                            </>
                        :null
                    }
                    <ul className="nav nav-tabs mb-3">
                        {/* <li className="nav-item" onClick={ () => { setStatus('overview'); sessionStorage.setItem('ACStatus', 'overview') } }>
                            <a className={ Status === 'overview' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>overview</a>
                        </li> */}
                        <li className="nav-item" onClick={ () => { setStatus(''); sessionStorage.setItem('ACStatus', '') } }>
                            <a className={ Status === '' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>all { Status === '' ? `(${List.length})` : "" }</a>
                        </li>
                        {
                            RequestStatuses.map(
                                ( status, index ) => {
                                    return (
                                        <li className="nav-item" onClick={ () => { setStatus( status ); sessionStorage.setItem('ACStatus', status) } } key={ index }>
                                            <a className={ Status === status ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>
                                                { status } { Status === status ? `(${List.length})` : "" }
                                            </a>
                                        </li>
                                    )
                                }
                            )
                        }
                    </ul>
                    {
                        Status === 'overview'
                        ?
                        <div className='overview'>
                            <div className='grid grid-333'>
                                <div className='item'>
                                    <h6 className='font-weight-bold mb-0'>Requests Overview</h6>
                                    <hr />
                                    <CanvasJSChart options={options} />
                                </div>
                            </div>
                        </div>
                        :
                        <div className='records-container' style={{ maxHeight: '70vh' }}>
                            {
                                List.length === 0
                                ?
                                <h6 className='text-center'>No Record Found</h6>
                                :
                                <>
                                    <table className="table"> 
                                        <thead>
                                            <tr>
                                                <th className='border-top-0'>Sr.No</th>
                                                <th className='border-top-0'>Requested Employee</th>
                                                <th className='border-top-0'>Co & Loc</th>
                                                <th className='border-top-0'>Reason</th>
                                                <th className='border-top-0'>
                                                    <div className='d-flex align-items-center'>
                                                        Amount
                                                        <div className='ml-2'>
                                                            <i onClick={ () => sortArray('amount', 1, 'number') } className="las la-chevron-up d-block" style={{ cursor: 'pointer' }}></i>
                                                            <i onClick={ () => sortArray('amount', 0, 'number') } className="las la-chevron-down d-block" style={{ cursor: 'pointer' }}></i>
                                                        </div>
                                                    </div>
                                                </th>
                                                <th className='border-top-0'>Overdue By</th>
                                                <th className='border-top-0'>Due Date</th>
                                                <th className='border-top-0'>Status</th>
                                                <th className='border-top-0'>Collected</th>
                                            </tr>   
                                        </thead>
                                        <tbody>
                                            {
                                                List.map(
                                                    ( val, index ) => {
                                                        const receival_date = val.receival_date ? new Date(val.receival_date).toDateString() : null;
                                                        const submit_date = val.submit_date ? new Date(val.submit_date).toDateString() : null;

                                                        const dueSinsStart = moment(val.receival_date, "YYYY-MM-DD");
                                                        const dueSinsEnd = val.clearance_date ? moment(val.clearance_date, "YYYY-MM-DD") : moment().startOf('day');

                                                        return (
                                                            <tr key={index} className='pointer pointer-hover' onClick={ () => history.push('/cash/request/' + val.id) }>
                                                                <td>{ val.company_code_name + '-' + val.series_year + '-' + val.serial_no }</td>
                                                                <td>
                                                                    <b>{ val.requested_emp_name }</b><br />
                                                                    {submit_date}{val.submit_time ? ( " at " + moment(val.submit_time,'h:mm:ss a').format('hh:mm A') ) : null}
                                                                </td>
                                                                <td>
                                                                    { val.company_name }<br />
                                                                    { val.location_name }
                                                                </td>
                                                                <td><span className='overflow_text'>{ val.reason }</span></td>
                                                                <td><span style={{ fontFamily: "Exo", fontWeight: 500 }}>{ fm.from(val.amount) }</span></td>
                                                                {
                                                                    val.clearance_date ?
                                                                    <td className='text-danger'><span className='text-success'>Cash Has Been Cleared</span></td> :
                                                                    val.receival_date ?
                                                                    <td className='text-danger'><span className="font-weight-bold" style={{ fontFamily: "Exo" }}>{moment.duration(dueSinsEnd.diff(dueSinsStart)).asDays()}</span> { moment.duration(dueSinsEnd.diff(dueSinsStart)).asDays() === 1 ? "Day" : "Days" }</td>
                                                                    :<td className='text-danger'><span className='text-danger'>Cash Not Collected</span></td>
                                                                }
                                                                <td>
                                                                    {receival_date ? receival_date : <span className='text-danger'>Cash Not Collected</span>}{val.receival_time ? ( " at " + moment(val.receival_time,'h:mm:ss a').format('hh:mm A') ) : null}
                                                                </td>
                                                                <td>
                                                                    <div className='d-flex align-items-center'>
                                                                        <div 
                                                                            className={
                                                                                "dot mr-1 "
                                                                                +
                                                                                (
                                                                                    val.status === 'approved' || val.status === 'cleared'
                                                                                    ?
                                                                                    "bg-success"
                                                                                    :
                                                                                    val.status === 'rejected'
                                                                                    ?
                                                                                    "bg-danger"
                                                                                    :
                                                                                    val.status === 'waiting for approval' || val.status === 'pending for verification'
                                                                                    ?
                                                                                    "bg-warning"
                                                                                    :
                                                                                    val.status === 'issued'
                                                                                    ?
                                                                                    "bg-info"
                                                                                    :
                                                                                    "bg-dark"
                                                                                )
                                                                            }
                                                                        ></div>
                                                                        <div
                                                                            className={
                                                                                "text-capitalize "
                                                                                +
                                                                                (
                                                                                    val.status === 'approved' || val.status === 'cleared'
                                                                                    ?
                                                                                    "text-success"
                                                                                    :
                                                                                    val.status === 'rejected'
                                                                                    ?
                                                                                    "text-danger"
                                                                                    :
                                                                                    val.status === 'waiting for approval' || val.status === 'pending for verification'
                                                                                    ?
                                                                                    "text-warning"
                                                                                    :
                                                                                    val.status === 'issued'
                                                                                    ?
                                                                                    "text-info"
                                                                                    :
                                                                                    "text-dark"
                                                                                )
                                                                            }
                                                                        >{ val.status }</div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    {val.receival_date ? <span className='text-success'>Cash Collected</span> : <span className='text-danger'>Cash Not Collected</span>}
                                                                    {val.pr_id !== null ? <div className='attached_pr'>PR</div> : null}
                                                                    {val.previous_slip !== null ? <div className='attached_slip'>Slip</div> : null}
                                                                    {val.shp_line_adv === 'Y' ? <div className='attached_shp'>Shipping</div> : null}
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )
                                            }
                                        </tbody>
                                    </table>
                                    {/* <div className='records-controls d-flex align-items-center justify-content-start'>
                                        <div>
                                            <select className='form-control' onChange={ updateEndValue }>
                                                <option value={10}>10</option>
                                                { Arr.length > 10 && <option value={15}>15</option> }
                                                { Arr.length > 15 && <option value={20}>20</option> }
                                                { Arr.length > 20 && <option value={25}>25</option> }
                                            </select>
                                        </div>
                                        <div></div>
                                    </div> */}
                                </>
                            }
                        </div>
                    }
                </div>
            </div>
        </>
    );

}

export default UI;