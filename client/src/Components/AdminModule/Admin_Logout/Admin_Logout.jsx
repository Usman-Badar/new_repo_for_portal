import React from 'react';

import { useHistory } from 'react-router-dom';

const Logout = () => {

    const history = useHistory();

    if ( sessionStorage.getItem('UserID') ) {

        sessionStorage.removeItem('UserID');
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('UserImg');

        history.replace('/admin_login');

    } else {

        history.replace('/admin_login');

    }

    return(
        <>
        </>
    )
    
}

export default Logout;