/* eslint-disable eqeqeq */
import axios from '../../../../../axios';

export const getLeaveData = ( User, LeaveType, setLeaveData ) => {

    axios.post(
        '/dashboard/data/pendings/leaves',
        {
            user: User,
            leave_type: LeaveType,
            emp_id: localStorage.getItem("EmpID")
        }
    )
    .then(
        res => 
        {
            setLeaveData(
                {
                    total_leaves_sent: res.data[0][0].sent,
                    total_leaves_received: res.data[1][0].received
                }
            )
        }
    ).catch(
        err => {
            console.log(err);
        }
    );

}

export const getLeaveChartData = ( User, LeaveType, setInitialLeaveData ) => {

    axios.post(
        '/dashboard/data/pendings/leaves/chart',
        {
            user: User,
            leave_type: LeaveType,
            emp_id: localStorage.getItem("EmpID")
        }
    )
    .then(
        res => 
        {
            setInitialLeaveData(
                {
                    leaves_by_you: res.data[0],
                    leaves_to_you: res.data[1]
                }
            )
        }
    ).catch(
        err => {
            console.log(err);
        }
    );

}

export const sortLeavesData = ( Leaves, GroupBy, setLeaves ) => {

    const colors = [
        {
            status: [ "accepted", 'casual' ],
            color: "#34d156"
        },
        {
            status: [ "authorized", 'sick' ],
            color: "#28A744"
        },
        {
            status: [ "rejected" ],
            color: "#DC3545"
        },
        {
            status: [ "sent", 'other' ],
            color: "#d8a91c"
        },
        {
            status: [ "waiting for approval", 'privilege' ],
            color: "#FFC107"
        },
    ]
    for ( let x = 0; x < Leaves.leaves_by_you.length; x++ )
    {
        const name = filter( GroupBy, Leaves.leaves_by_you[x] );
        const color = colors.filter(
            val => {
                return val.status.includes(name.toLowerCase())
            }
        );
        Leaves.leaves_by_you[x].color = color[0] ? color[0].color : "#000";
        Leaves.leaves_by_you[x].name = Leaves.leaves_by_you[x].counting + " - " + name.toLowerCase();
        Leaves.leaves_by_you[x].y = Leaves.leaves_by_you[x].counting;
    }
    for ( let x = 0; x < Leaves.leaves_to_you.length; x++ )
    {
        const name = filter( GroupBy, Leaves.leaves_by_you[x] );
        const color = colors.filter(
            val => {
                return val.status.includes(name.toLowerCase())
            }
        );
        Leaves.leaves_to_you[x].color = color[0] ? color[0].color : "#000";
        Leaves.leaves_to_you[x].name = Leaves.leaves_to_you[x].counting + " - " + name.toLowerCase();
        Leaves.leaves_to_you[x].y = Leaves.leaves_to_you[x].counting;
    }
    setLeaves(
        {
            leaves_by_you: Leaves.leaves_by_you,
            leaves_to_you: Leaves.leaves_to_you
        }
    );

}

const filter = ( GroupBy, obj ) => {
    let val;
    if ( GroupBy == '1' )
    {
        val = obj.request_status.toLowerCase();
    }
    if ( GroupBy == '2' )
    {
        val = obj.leave_type.toLowerCase();
    }
    return val;
}