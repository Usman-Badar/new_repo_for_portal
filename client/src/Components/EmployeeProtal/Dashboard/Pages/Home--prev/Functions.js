/* eslint-disable eqeqeq */
import moment from 'moment';
import axios from '../../../../../axios';
import JSAlert from 'js-alert';

const colors = [
    {
        status: [ "accepted", 'casual' ],
        color: "#34d156"
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
        color: "#17A2B8"
    },
    {
        status: [ "authorized", 'sick', 'present' ],
        color: "#28A744"
    },
    {
        status: [ "rejected", 'absent' ],
        color: "#DC3545"
    },
    {
        status: [ "sent", 'other' ],
        color: "#d8a91c"
    },
    {
        status: [ "waiting for approval", 'privilege', 'late' ],
        color: "#FFC107"
    },
]

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

export const loadData = ( setHomeData, setInventoryData, setACData ) => {
    axios.post(
        '/dashboard/home/data',
        {
            emp_id: localStorage.getItem("EmpID")
        }
    )
    .then(
        res => 
        {   
            for ( let x = 0; x < res.data[1].length; x++ )
            {
                const color = colors.filter(
                    val => {
                        return val.status.includes(res.data[1][x].status.toLowerCase())
                    }
                );
                res.data[1][x].color = color[0] ? color[0].color : "#000";
                res.data[1][x].label = res.data[1][x].status;
                res.data[1][x].y = res.data[1][x].count;
            }
            let chatArr = [];
            let lastChats = [];
            for ( let x = 0; x < res.data[2].length; x++ )
            {
                if ( chatArr.includes(res.data[2][x].sender_id) )
                {
                    // nothing happen
                }else
                {
                    if ( lastChats.length < 3 )
                    {
                        chatArr.push(res.data[2][x].sender_id);
                        lastChats.push(res.data[2][x]);
                    }
                }
            }
            setHomeData(
                {
                    todays_attendance: res.data[0],
                    monthly_attendance_summery: res.data[1],
                    last_chats: lastChats
                }
            );
            setInventoryData(
                {
                    total_products: res.data[3][0]?.total_products,
                    total_inward_quantity: res.data[4][0]?.total_inward_quantity,
                    total_inward_value: res.data[4][0]?.total_inward_value,
                    total_inward_entries: res.data[4][0]?.total_inward_entries,
                    total_outward_quantity: res.data[5][0]?.total_outward_quantity,
                    total_outward_value: res.data[5][0]?.total_outward_value,
                    total_outward_entries: res.data[5][0]?.total_outward_entries,
                    total_stored_quantity: res.data[6][0]?.total_stored_quantity,
                    total_stored_value: res.data[6][0]?.total_stored_value,
                    products_have_h_inwards: res.data[7],
                    products_have_h_outwards: res.data[8],
                    products_type_data: res.data[9],
                    products_issued_data: res.data[10][0],
                    products_pending_issued_data: res.data[11][0],
                    products_pending_preview_data: res.data[12][0]
                }
            );
            setACData(
                {
                    total_requests: res.data[13][0].total_requests ? res.data[13][0].total_requests : '0',
                    total_amount_issued: res.data[14][0].total_amount_issued ? res.data[14][0].total_amount_issued : '0',
                    total_amount_collected: res.data[15][0].total_amount_collected ? res.data[15][0].total_amount_collected : '0',
                    total_amount_not_collected: res.data[16][0].total_amount_not_collected ? res.data[16][0].total_amount_not_collected : '0',
                    total_amount_pending: res.data[17][0].total_amount_pending ? res.data[17][0].total_amount_pending : '0',
                    total_amount_cleared: res.data[18][0].total_amount_cleared ? res.data[18][0].total_amount_cleared : '0',
                    employees: res.data[19]
                }
            )
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