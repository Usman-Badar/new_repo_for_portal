import React from 'react';

import './Venders.css';

const Venders = ( props ) => {

    return (
        <div className="Vender" key={ props.key }>
            <h6>
                { props.name }
            </h6>
            <p>
                { props.phone }
            </p>
            <p>
                { props.address }
            </p>
            <i className="lar la-trash-alt" onClick={ () => props.RemoveVender( props.name ) }></i>
        </div>
    );
}

export default Venders;