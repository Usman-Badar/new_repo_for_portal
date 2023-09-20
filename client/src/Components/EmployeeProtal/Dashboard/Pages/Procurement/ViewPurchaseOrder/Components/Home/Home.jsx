import React, { useEffect, useState } from 'react';

import './Home.css';
import CanvasJSReact from '../../../../../../../../canvasjs.react';
import ReactTooltip from 'react-tooltip';

const Home = (props) => {

    const CanvasJS = CanvasJSReact.CanvasJS;
    const CanvasJSChart = CanvasJSReact.CanvasJSChart;

    const [DataSet, setDataSet] = useState([]);
    const [MonthlyRequests, setMonthlyRequests] = useState([]);
    const [RequestsSplit, setRequestsSplit] = useState([]);

    const [MinMax, setMinMax] = useState([]);
    const [EmpData, setEmpData] = useState({});
    
    const [TotalValue, setTotalValue] = useState(0.00);

    useEffect(
        () => {

            // IMPORTANT VARIABLES
            let count = [];
            let rejected = 0;
            let approved = 0;
            let waiting = 0;
            let sent = 0;
            let viewed = 0;

            // FOR REJECTED
            for (let x = 0; x < props.CountStatus.length; x++) {

                if (props.CountStatus[x] === 'Rejected') {
                    rejected = rejected + 1;
                }

            }

            // FOR APPROVED
            for (let x = 0; x < props.CountStatus.length; x++) {

                if (props.CountStatus[x] === 'Approved') {
                    approved = approved + 1;
                }

            }

            // FOR WAITING
            for (let x = 0; x < props.CountStatus.length; x++) {

                if (props.CountStatus[x] === 'Waiting For Approval') {
                    waiting = waiting + 1;
                }

            }

            // FOR SENT
            for (let x = 0; x < props.CountStatus.length; x++) {

                if (props.CountStatus[x] === 'Sent') {
                    sent = sent + 1;
                }

            }

            // FOR VIEWED
            for (let x = 0; x < props.CountStatus.length; x++) {

                if (props.CountStatus[x] === 'Viewed') {
                    viewed = viewed + 1;
                }

            }

            count.push(
                { y: rejected, label: 'rejected' },
                { y: approved, label: 'approved' },
                { y: waiting, label: 'waiting' },
                { y: sent, label: 'sent' },
                { y: viewed, label: 'viewed' }
            )
            setDataSet( count );


        }, [props.CountStatus]
    );

    useEffect(
        () => {

            setMonthlyRequests(props.MonthlyRequests);
            let arr = [];

            for ( let x = 0; x < props.MonthlyRequests.length; x++ )
            {
                arr.push( props.MonthlyRequests[x].count );
            }

            setMinMax( arr );

        }, [props.MonthlyRequests]
    )

    useEffect(
        () => {

            let companies = [];
            let data = [];
            for ( let x = 0; x < props.ViewRequest.length; x++ )
            {
                if ( !companies.includes( props.ViewRequest[x].company_name ) )
                {
                    companies.push( props.ViewRequest[x].company_name );
                }
            }

            for ( let x = 0; x < companies.length; x++ )
            {
                let arr = props.ViewRequest.filter(
                    ( val ) => {

                        return val.company_name === companies[x];

                    }
                );

                let total = 0.00;
                for( let x = 0; x < arr.length; x++ )
                {

                    total = total + parseFloat( arr[x].total );

                }

                data.push(
                    {
                        company: companies[x],
                        count: arr.length,
                        total: total
                    }
                )
            }

            setRequestsSplit( data );

            let total = 0.00;
            for( let x = 0; x < props.ViewRequest.length; x++ )
            {

                total = total + parseFloat( props.ViewRequest[x].total );

            }

            setTotalValue( total );

        }, [ props.ViewRequest ]
    )

    useEffect(
        () => {

            setEmpData( props.EmpData );

        }, [ props.EmpData ]
    )

    useEffect(
        () => {

            ReactTooltip.rebuild();

        }
    )

    CanvasJS.addColorSet(
        "customShades",
        [//colorSet Array

        "#E7604A",
        "#56CC82",
        "#29C7CA",
        "#5C6E9C",
        "#5C6E9C"             
        ]
    );

    const options = {
        exportEnabled: false,
        animationEnabled: true,
        title: {
            text: "Summery"
        },
        colorSet: "customShades",
        data: [{
            type: "pie",
            startAngle: 75,
            toolTipContent: "<b>{label}</b>: {y}%",
            showInLegend: "true",
            legendText: "{label}",
            indexLabelFontSize: 10,
            indexLabel: "{label} - {y}%",
            dataPoints: DataSet
        }]
    }

    return (
        <div className="Home">
            <ReactTooltip />
            <div className="three">
                <div className="Calculate px-4">
                    <small className="text-secondary">Total Requests</small>
                    <h3 className="font-weight-bolder">
                        {props.CountRequests} <small className="text-secondary">Received</small>
                    </h3>
                    {
                        Object.keys(EmpData).length === 0
                        ?
                        null
                        :
                        EmpData.access ? JSON.parse(EmpData.access).includes(522) || JSON.parse(EmpData.access).includes(1)
                        ?
                            <>
                                <small className="text-secondary">Total Value Rs</small>
                                <h3 className="font-weight-bolder">
                                    { TotalValue.toLocaleString('en-US') } <small className="text-secondary">Estimated</small>
                                </h3>
                            </>
                            :
                            null
                        :
                        null
                    }
                </div>
                <div className="RequestStatusChart">
                    <CanvasJSChart options = {options}
                        /* onRef={ref => this.chart = ref} */
                    />
                </div>
                <div className="RequestStatusChart py-4 px-3">
                    {
                        RequestsSplit.map(
                            ( val, index ) => {

                                return (
                                    <div 
                                        className=" mb-3"
                                        style={
                                            {
                                                fontSize: '13px'
                                            }
                                        }
                                        key={ index }
                                    >
                                        <div className="font-weight-bold">
                                            {
                                                val.company
                                            }: 
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between"> 
                                            <div>
                                                {
                                                    val.count
                                                } <sub>Requests</sub>
                                            </div>
                                            <div>
                                                PKR 
                                                <span className="ml-2">
                                                    {
                                                        val.total.toLocaleString('en-US')
                                                    } /-
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )

                            }
                        )
                    }
                </div>
            </div>
            {/* <div className="graph">
                <div className='Heading'> <h4> Monthly Requests </h4> </div>
                {
                    MonthlyRequests.map(
                        (val, index) => {

                            let totalCount = 0;
                            for (let x = 0; x < MonthlyRequests.length; x++) {
                                totalCount = totalCount + MonthlyRequests[x].count;
                            }

                            let percent = (val.count / totalCount) * 85;

                            return (
                                <div
                                    style={
                                        {
                                            height: percent + '%'
                                        }
                                    }
                                    className='GraphItem'
                                    data-tip={val.month + ' ' + val.year} key={index}
                                >
                                    <div> {val.count} </div>
                                </div>
                            )

                        }
                    )
                }
            </div> */}
            <div className="ViewPrRequests_graph">
                <div className="border-bottom mb-3"><h4>Monthly Requests</h4></div>
                <div className="d-flex">
                    <div style={{ display: "grid", marginRight: "10px" }} >
                        <p className="font-weight-bolder">{Math.max(...MinMax)}</p>
                        <p className="d-flex align-items-end font-weight-bolder">{Math.min(...MinMax)}</p>
                    </div>
                    <div className="ViewPrRequests_graphdiv">
                        <div className="graph_data ">
                            <div className="Graph_Bargrid">
                                {
                                    MonthlyRequests.map(
                                        (val, index) => {

                                            let totalCount = 0;

                                            for (let x = 0; x < MonthlyRequests.length; x++) {
                                                totalCount = totalCount + MonthlyRequests[x].count;
                                            }

                                            let percent = (val.count / totalCount) * 100;

                                            return (
                                                <>
                                                    <div key={ index } className="graphbar" style={{ height: percent + '%' }}>
                                                        <div className="tooltip">{val.count} Requests</div>
                                                    </div>
                                                </>
                                            )
                                        }
                                    )
                                }
                            </div>
                            <div className="Graph_monthgrid">
                                {
                                     MonthlyRequests.map(
                                        (val, index) => {

                                            return (
                                                <>
                                                    <div key={ index }>{val.month}</div>
                                                </>
                                            )
                                        }
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="graphyear">
                    2022
                </div>
            </div>
        </div>
    );
}

export default Home;