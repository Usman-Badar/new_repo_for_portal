import React, { lazy, Suspense } from "react";

const UI = lazy( () => import('./UI') );

const MiscSetup = () => {

    return (
        <>
            <Suspense fallback={ <div>Loading....</div> }>
                <UI />
            </Suspense>
        </>
    )

}

export default MiscSetup;