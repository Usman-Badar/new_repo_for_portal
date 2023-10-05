import React from 'react';

import { useHistory } from 'react-router-dom';

import socket from '../../../../io';

const Logout = () => {

    const history = useHistory();

    if ( localStorage.getItem('EmpID') ) {

        socket.emit(
            'UserLost', localStorage.getItem('EmpID')
        )
        localStorage.removeItem('Token');
        localStorage.removeItem('name');
        localStorage.removeItem('EmpID');

        localStorage.clear();
        sessionStorage.clear();


    }

    history.replace('/login');

    return(<></>)
    
}

export default Logout;