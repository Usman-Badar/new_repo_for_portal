import React, { useEffect, useState } from 'react';

import './Drive.css';

const Drive = ( props ) => {

    const [ Data, setData ] = useState([]);

    useEffect(
        () => {

            setData( props.data );

        }, [ props.data ]
    )

    return (
        <div className="DicussionDrive">
            {
                Data.map(
                    ( val, index ) => {

                        return (
                            <div 
                                key={ index } 
                                className="DriveItem"
                                style={
                                    {
                                        backgroundImage: "url('images/drive/" + val.name + "')"
                                    }
                                }
                                onClick={ () => props.AttachDrive( val.name ) }
                            ></div>
                        )

                    }
                )
            }
        </div>
    );
}

export default Drive;