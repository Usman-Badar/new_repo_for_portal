import React from 'react';

import './Venders.css';

const Venders = ( props ) => {

    return (
        <div className="Vender" key={ props.key }>
            <p className="font-weight-bold">
                { props.name }
            </p>
            <p>
                { props.phone }
            </p>
            <p>
                { props.address }
            </p>
        </div>
    );
}

export default Venders;