import React from 'react';
import { useHistory } from 'react-router-dom';
import { useErrorBoundary } from "react-error-boundary";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import JSAlert from 'js-alert';

const Error = ({ error }) => {
    const { resetBoundary } = useErrorBoundary();
    const history = useHistory();
    const showMessage = () => {
        JSAlert.alert('Copied To Clipboard', "Success", JSAlert.Icons.Success).dismissIn(1000);
    }
    const goBack = () => {
        history.goBack();
        setTimeout(() => {
            resetBoundary();
        }, 300);
    }
    return (
        <div className='w-100 vh-100 py-5 popUps' style={{ overflow: 'auto' }}>
            <div className='w-50 mx-auto'>
                <h1 className='text-center display-3 font-weight-bold'>
                    Ooo<span className='text-warning'>p</span>s!
                </h1>
                <h6 className='text-center'>It seems like there is something wrong, kindly take a snapshot or copy the error and contact your <b className='text-warning'>IT</b> Support.</h6>
                <hr />
                <div className='d-flex justify-content-between align-items-center mb-2'>
                    <h5 className='mb-0'>Error Message</h5>
                    <CopyToClipboard text={error.message}>
                        <button onClick={showMessage} className='btn light'>Copy</button>
                    </CopyToClipboard>
                </div>
                <p style={{ fontFamily: 'fangsong' }} className='bg-light p-2 rounded'>{error.message}</p>
                
                <div className='d-flex justify-content-between align-items-center mb-2'>
                    <h5 className='mb-0'>Error Stack</h5>
                    <CopyToClipboard text={error.stack}>
                        <button onClick={showMessage} className='btn light'>Copy</button>
                    </CopyToClipboard>
                </div>
                <p style={{ fontFamily: 'fangsong', maxHeight: '40vh', overflow: 'auto' }} className='bg-light p-2 rounded'>{error.stack}</p>

                <div className='text-center'>
                    <button onClick={goBack} className='btn mr-2 submit p-3 px-5'>Go Back</button>
                    <button onClick={resetBoundary} className='btn ml-2 cancle p-3 px-5'>Try Again</button>
                </div>
            </div>
        </div>
    )
}

export default Error;