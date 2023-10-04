import React, { useEffect, useState } from 'react';
import './Loading.css';
import Typewriter from 'typewriter-effect';

const Loading = ( props ) => {

    const [ ShowLoading, setShowLoading ] = useState( false );
    const [ Styling, setStyling ] = useState({});

    useEffect(
        () => {

            setShowLoading( props.display );
            setStyling( props.styling );

        }, [ props.display, props.styling, props.icon, props.txt ]
    )

    return (
        <>
            {/* IF THE STATE IS TRUE THEN THE LOADING PAGE WILL SHOW OTHERWISE IT WILL BE HIDE */}
            {
                ShowLoading
                ?
                <>
                    <div 
                        className="Loading d-center text-center"
                        style={ Styling }
                    >

                        <div>
                            {/* LOADING IMAGE */}
                            {
                                props.icon
                            }
                            <p className='text-center text-light mb-3 company'>
                                SEABOARD
                            </p>
                            {/* LOADING TEXT */}
                            <p className='text-center text-light mb-0' style={{fontSize: 18}}>
                                <Typewriter
                                    options={{
                                        strings: [props.txt, 'Please Wait...', "Loading Content..."],
                                        autoStart: true,
                                        loop: true,
                                        delay: 100
                                    }}
                                />
                            </p>
                        </div>

                    </div>
                </>
                :
                null
            }
        </>
    )

}

export default Loading;