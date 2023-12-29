/* eslint-disable eqeqeq */
import moment from 'moment';
import axios from '../../../../../axios';
import JSAlert from 'js-alert';

const colors = [
    {
        status: [ "accepted", 'casual' ],
        color: "#007C61"
    },
    {
        status: [ 'off' ],
        color: "#1E7BFF"
    },
    {
        status: [ 'holiday' ],
        color: "#6C767D"
    },
    {
        status: [ 'leave', 'short leave' ],
        color: "#007C61"
    },
    {
        status: [ "authorized", 'sick', 'present' ],
        color: "#28A744"
    },
    {
        status: [ "rejected", 'absent' ],
        color: "#A3574C"
    },
    {
        status: [ "sent", 'other' ],
        color: "#d8a91c"
    },
    {
        status: [ "waiting for approval", 'privilege', 'late' ],
        color: "#EEE8A9"
    },
];
const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const getWeather = ( key, Coordinates, setWeatherData ) => {    
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + Coordinates.latitude + '&lon=' + Coordinates.longitude + '&appid=' + key).then(
        response => {
            return response.json();
        }
    ).then(
        data => {
            const obj = {
                city: data.name,
                min_temp: Math.round(data.main.temp_min - 273.15),
                max_temp: Math.round(data.main.temp_max - 273.15),
                temp: Math.round( data.main.temp - 273.15 ) + ' °C',
                wind_speed: data.wind.speed + ' m/s',
                humidity: data.main.humidity + '%',
                current_time: moment(new Date()).format('hh:mm A'),
                weather_icon: "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png",
                day: weekday[new Date().getDay()]
            };

            setWeatherData(obj);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const loadAdvanceCashDetails = ( setAdvanceCashData, setAbsents ) => {
    axios.get('/dashboard/home/advance_cash')
    .then(
        res => 
        {
            let arr = [];
            for ( let x = 0; x < res.data.length; x++ )
            {
                if ( arr.length === 0 )
                {
                    res.data[x].name = monthNames[res.data[x].month];
                    res.data[x][capitalizeFirstLetter(res.data[x].status)] = res.data[x].no_of_requests;
                    arr.push(res.data[x]);
                }else
                {
                    const i = arr.findIndex( val => val.month === res.data[x].month );
                    if ( i < 0 )
                    {
                        res.data[x].name = monthNames[res.data[x].month];
                        res.data[x][capitalizeFirstLetter(res.data[x].status)] = res.data[x].no_of_requests;
                        arr.push(res.data[x]);
                    }else
                    {
                        arr[i][capitalizeFirstLetter(res.data[x].status)] = res.data[x].no_of_requests;
                        arr[i].amount = arr[i].amount + res.data[x].amount;
                    }
                }
            }
            setAdvanceCashData(arr);
            getAbsentsOfEmployees(new Date().getFullYear() + '-' + parseInt( new Date().getMonth() + 1 ), setAbsents);
            // loadAttendanceSummery();
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
}

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

export const loadData = ( setDataLoaded, setACNotCleared, setACCleared, setACData, setAttendanceSummery, setZeroLatesEmps, setHomeData, setPurchases, setVendors ) => {
    axios.post(
        '/dashboard/home/data',
        {
            emp_id: localStorage.getItem("EmpID")
        }
    )
    .then(
        res => 
        {   
            const d = new Date().getFullYear() + '-' + parseInt( new Date().getMonth() + 1 );
            // const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            for ( let x = 0; x < res.data[0].length; x++ )
            {
                res.data[0][x].color = "#2D5A83";
                res.data[0][x].label = monthNames[res.data[0][x].month];
                res.data[0][x].y = res.data[0][x].no_of_requests;
            }
            for ( let x = 0; x < res.data[1].length; x++ )
            {
                res.data[1][x].color = "#5985A4";
                res.data[1][x].label = monthNames[res.data[1][x].month];
                res.data[1][x].y = res.data[1][x].no_of_requests;
            }
            const ac_not_cleared = {
                type: "column",
                name: "No. of requests received",
                // legendText: "No. of requests received",
                toolTipContent: `<b>No. of requests approved:</b> {y}<br /><b>Amount:</b> Rs <b>{amount}</b>/-<hr />`,
                dataPoints: res.data[0]
            };
            const ac_cleared = {
                type: "column",
                name: "No. of requests cleared",
                // legendText: "No. of requests cleared",
                toolTipContent: `<b>No. of requests cleared:</b> {y}<br /><b>Amount:</b> Rs <b>{amount}</b>/-`,
                axisYType: "secondary",
                dataPoints: res.data[1]
            }
            let chatArr = [];
            let lastChats = [];
            for ( let x = 0; x < res.data[5].length; x++ )
            {
                const color = colors.filter(
                    val => {
                        return val.status.includes(res.data[5][x].status.toLowerCase())
                    }
                );
                res.data[5][x].color = color[0] ? color[0].color : "#000";
                res.data[5][x].label = res.data[5][x].status;
                res.data[5][x].y = res.data[5][x].count;
            }
            for ( let x = 0; x < res.data[6].length; x++ )
            {
                if ( chatArr.includes(res.data[6][x].sender_id) )
                {
                    // nothing happen
                }else
                {
                    if ( lastChats.length < 3 )
                    {
                        chatArr.push(res.data[6][x].sender_id);
                        lastChats.push(res.data[6][x]);
                    }
                }
            }
            for ( let x = 0; x < res.data[7].length; x++ )
            {
                // const color = colors.filter(
                //     val => {
                //         return val.status.includes(res.data[7][x].status.toLowerCase())
                //     }
                // );
                // res.data[7][x].color = color[0] ? color[0].color : "#000";
                res.data[7][x].label = res.data[7][x].verified === 1 ? "Verified" : "Not Verified";
                res.data[7][x].y = res.data[7][x].count;
            }
            setDataLoaded(true);
            setACNotCleared(ac_not_cleared);
            setACCleared(ac_cleared);
            setACData(res.data[2]);
            setHomeData(
                {
                    todays_attendance: res.data[4],
                    monthly_attendance_summery: res.data[5],
                    last_chats: lastChats
                }
            );
            setVendors(res.data[7]);

            loadMonthlyPurchases( d, setPurchases )
            getZeroLatesEmployees(d, setZeroLatesEmps);
            loadAttendanceSummery(d, setAttendanceSummery);
            // console.log(res.data);
            // for ( let x = 0; x < res.data[1].length; x++ )
            // {
            //     const color = colors.filter(
            //         val => {
            //             return val.status.includes(res.data[1][x].status.toLowerCase())
            //         }
            //     );
            //     res.data[1][x].color = color[0] ? color[0].color : "#000";
            //     res.data[1][x].label = res.data[1][x].status;
            //     res.data[1][x].y = res.data[1][x].count;
            // }
            // let chatArr = [];
            // let lastChats = [];
            // for ( let x = 0; x < res.data[2].length; x++ )
            // {
            //     if ( chatArr.includes(res.data[2][x].sender_id) )
            //     {
            //         // nothing happen
            //     }else
            //     {
            //         if ( lastChats.length < 3 )
            //         {
            //             chatArr.push(res.data[2][x].sender_id);
            //             lastChats.push(res.data[2][x]);
            //         }
            //     }
            // }
            // setInventoryData(
            //     {
            //         total_products: res.data[3][0]?.total_products,
            //         total_inward_quantity: res.data[4][0]?.total_inward_quantity,
            //         total_inward_value: res.data[4][0]?.total_inward_value,
            //         total_inward_entries: res.data[4][0]?.total_inward_entries,
            //         total_outward_quantity: res.data[5][0]?.total_outward_quantity,
            //         total_outward_value: res.data[5][0]?.total_outward_value,
            //         total_outward_entries: res.data[5][0]?.total_outward_entries,
            //         total_stored_quantity: res.data[6][0]?.total_stored_quantity,
            //         total_stored_value: res.data[6][0]?.total_stored_value,
            //         products_have_h_inwards: res.data[7],
            //         products_have_h_outwards: res.data[8],
            //         products_type_data: res.data[9],
            //         products_issued_data: res.data[10][0],
            //         products_pending_issued_data: res.data[11][0],
            //         products_pending_preview_data: res.data[12][0]
            //     }
            // );
            // setACData(
            //     {
            //         total_requests: res.data[13][0].total_requests ? res.data[13][0].total_requests : '0',
            //         total_amount_issued: res.data[14][0].total_amount_issued ? res.data[14][0].total_amount_issued : '0',
            //         total_amount_collected: res.data[15][0].total_amount_collected ? res.data[15][0].total_amount_collected : '0',
            //         total_amount_not_collected: res.data[16][0].total_amount_not_collected ? res.data[16][0].total_amount_not_collected : '0',
            //         total_amount_pending: res.data[17][0].total_amount_pending ? res.data[17][0].total_amount_pending : '0',
            //         total_amount_cleared: res.data[18][0].total_amount_cleared ? res.data[18][0].total_amount_cleared : '0',
            //         employees: res.data[19]
            //     }
            // )
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
}

export const loadAttendanceSummery = ( date, setAttendanceSummery ) => {
    axios.post(
        '/dashboard/home/monthly/attendance',
        {
            month: date.split('-').pop(),
            year: date.split('-').shift()
        }
    )
    .then(
        res => 
        {   
            let arr = [];
            const totalMonthArr = res.data[1];
            for ( let x = 0; x < res.data[0].length; x++ )
            {
                if ( arr.length === 0 )
                {
                    res.data[0][x].name = monthNames[res.data[0][x].month];
                    res.data[0][x][capitalizeFirstLetter(res.data[0][x].status)] = parseInt((res.data[0][x].attendance / totalMonthArr.filter(val => val.month === res.data[0][x].month)[0].total_attendance) * 100);
                    arr.push(res.data[0][x]);
                }else
                {
                    const i = arr.findIndex( val => val.month === res.data[0][x].month );
                    if ( i < 0 )
                    {
                        res.data[0][x].name = monthNames[res.data[0][x].month];
                        res.data[0][x][capitalizeFirstLetter(res.data[0][x].status)] = parseInt((res.data[0][x].attendance / totalMonthArr.filter(val => val.month === res.data[0][x].month)[0].total_attendance) * 100);
                        arr.push(res.data[0][x]);
                    }else
                    {
                        arr[i][capitalizeFirstLetter(res.data[0][x].status)] = parseInt((res.data[0][x].attendance / totalMonthArr.filter(val => val.month === res.data[0][x].month)[0].total_attendance) * 100);
                    }
                }
                // res.data[0][x].name = capitalizeFirstLetter(res.data[0][x].status);
                // res.data[0][x][capitalizeFirstLetter(res.data[0][x].status)] = ;
                // arr.push(res.data[0][x]);
            }
            // parseInt((res.data[0][x].attendance / res.data[1][0].total_attendance) * 100)
            setAttendanceSummery(arr);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
}

export const loadMonthlyPurchases = ( date, setPurchases ) => {
    axios.post(
        '/dashboard/home/monthly/purchases',
        {
            month: date.split('-').pop(),
            year: date.split('-').shift()
        }
    )
    .then(
        res => 
        {   
            let arr = [];
            for ( let x = 0; x < res.data.length; x++ )
            {
                if ( arr.length === 0 )
                {
                    res.data[x].name = new Date(res.data[x].requested_date).getDate();
                    res.data[x][capitalizeFirstLetter(res.data[x].status)] = res.data[x].count;
                    arr.push(res.data[x]);
                }else
                {
                    const i = arr.findIndex( val => val.name === new Date(res.data[x].requested_date).getDate() );
                    if ( i < 0 )
                    {
                        res.data[x].name = new Date(res.data[x].requested_date).getDate();
                        res.data[x][capitalizeFirstLetter(res.data[x].status)] = res.data[x].count;
                        arr.push(res.data[x]);
                    }else
                    {
                        arr[i][capitalizeFirstLetter(res.data[x].status)] = res.data[x].count;
                    }
                }
            }
            // for ( let x = 0; x < res.data.length; x++ )
            // {
            //     const c = ["#6F9AB5", "#5985A4", "#427193", "#2D5A83", "#164572", "#043161"];
            //     res.data[x].lineColor = c[Math.floor(Math.random() * c.length)];
            //     res.data[x].color = '#272F3E';
            //     res.data[x].label = new Date(res.data[x].requested_date).getDate();
            //     res.data[x].x = new Date(res.data[x].requested_date).getDate();
            //     res.data[x].y = res.data[x].count;
            // }
            // const obj = {
            //     type: "line",
            //     toolTipContent: "Date: {x}: No. of requests {y}",
            //     dataPoints: res.data
            // };
            setPurchases(arr);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
}

export const getZeroLatesEmployees = ( date, setZeroLatesEmps ) => {
    axios.post(
        '/dashboard/home/monthly/attendance/zero_lates',
        {
            month: date.split('-').pop(),
            year: date.split('-').shift(),
            emp_id: localStorage.getItem('EmpID')
        }
    )
    .then(
        res => 
        {   
            setZeroLatesEmps(res.data);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
}

export const getAbsentsOfEmployees = ( date, setAbsents ) => {
    axios.post(
        '/dashboard/home/monthly/attendance/absents',
        {
            month: date.split('-').pop(),
            year: date.split('-').shift()
        }
    )
    .then(
        res => 
        {   
            setAbsents(res.data);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
}

export const loadACRequest = ( emp_id, setRequests ) => {
    axios.post(
        '/cash/load/emp/requests',
        {
            emp_id: emp_id
        }
    )
    .then(
        res => 
        {   
            setRequests(res.data);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
}