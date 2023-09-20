import React, { useEffect, useState } from 'react';

import './Home.css';
import ReactTooltip from 'react-tooltip';
import CanvasJSReact from '../../../../../../../canvasjs.react';

const Home = (props) => {

    const CanvasJS = CanvasJSReact.CanvasJS;
    const CanvasJSChart = CanvasJSReact.CanvasJSChart;

    const [DataSet, setDataSet] = useState([]);

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

    // useEffect(
    //     () => {

    //         let total = 0.00;
    //         for( let x = 0; x < props.ViewRequest.length; x++ )
    //         {

    //             total = total + parseFloat( props.ViewRequest[x].total );

    //         }

    //         setTotalValue( total );

    //     }, [ props.ViewRequest ]
    // )

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
                    <h1 className="font-weight-bolder">
                        {props.CountRequests} <small className="text-secondary">Sent</small>
                    </h1>
                </div>
                <div className="RequestStatusChart">
                    <CanvasJSChart options = {options}
                        /* onRef={ref => this.chart = ref} */
                    />
                </div>
            </div>
        </div>
    );
}

export default Home;