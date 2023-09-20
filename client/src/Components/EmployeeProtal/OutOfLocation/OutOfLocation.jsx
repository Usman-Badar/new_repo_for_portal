import React from 'react';

import './OutOfLocation.css';

const OutOfLocation = () => {

    return (
        <>
            <div className='OutOfLocation'>
                <div className="OutOfLocation-content">
                    <h1>Sorry to say but you are out of location</h1>
                    <p>
                        Sorry sir you are now out of any registered location, so we can't let you enter to this site. Please try again when you are at any registered location.
                    </p>
                    <button className="btn btn-info">Go To Website</button>
                </div>
            </div>
        </>
    )

}

export default OutOfLocation