import React from "react";
import './Style.css';
import JSAlert from 'js-alert';

const UI = ({ name, AccessControls, submitForm, quarter, history, FormCheckBoxes, Form, setLoaded, onChangeHandlerRadio, onChangeHandler }) => {
    const onSubmit = (e) => {
        e.preventDefault();
        for ( let x = 0; x < Form.length; x++ )
        {
            if ( Form[x].answer && Form[x].answer === '' )
            {
                JSAlert.alert("All fields are required").dismissIn(1000 * 2);
                return false;
            }
        }
        submitForm();
    }
    return (
        <>
            <div className="PeerReviewForm page">
                <div className="PeerReviewForm-content page-content">
                    {/* <div style={{ width: 'fit-content', marginLeft: 'auto' }} id="google_translate_element" onLoad={ () => setLoaded(true) }></div> */}
                    <div className="firstform">
                        <div className="d-flex align-items-center justify-content-between">
                            <h3 className="heading">
                                Peer Review
                                <sub>Answer The Questions</sub>
                            </h3>
                            <div className="d-flex align-items-center" style={{ position: 'relative' }}>
                                <i className="las la-sync la-2x mr-3 text-secondary"></i>
                                <div className="savingTxt">Saving...</div>
                                <button className="btn light" onClick={ () => history.goBack() }>Back</button>
                            </div>
                        </div>
                        <hr />
                        <div className="grid-div">
                            <div className="px-3 pt-3 leftdiv">
                                <h6 className="mb-3">This form will assist us in evaluating the employee. We treat all information with strict confidence and none of the information shared here will be disclosed bearing your name. Anonymous remarks may be used to improve the employee’s performance.</h6>
                                <h6 className="mb-3 urdu ml-auto text-right">یہ فارم ملازم کی کارکردگی کا اندازہ لگانے میں ہماری مدد کرتا ہے۔ ہم اس بات کو یقینی بناتے ہیں کہ یہاں دی گئی معلومات آپ کے نام کے ساتھ ظاہر نہیں کی جائے گی۔</h6>
                                <div className="alert alert-info">
                                    <b>Note</b><br />
                                    <span>Please type in English or Urdu (Roman) to express yourself fully</span>
                                    <div className="text-right">
                                        <b className="urdu">نوٹ</b><br />
                                        <span className="urdu">اپنی بات کو مکمل طور پر واضح کرنے کے لیے براہ کرم انگریزی یا اردو (رومن) میں ٹائپ کریں۔</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="rightdiv">
                                    <div className="rightdiv-details mb-2">
                                        <h6 className="font-weight-bold mb-0">Name</h6>
                                        <input type="text" className="form-control" defaultValue={ localStorage.getItem('name') } disabled />
                                    </div>
                                    <div className="rightdiv-details mb-2">
                                        <h6 className="font-weight-bold mb-0">Designation</h6>
                                        <input type="text" className="form-control" defaultValue={ AccessControls?.designation_name } disabled />
                                    </div>
                                    <div className="rightdiv-details mb-2">
                                        <h6 className="font-weight-bold mb-0">Reviewing</h6>
                                        <input type="text" className="form-control" defaultValue={ name } disabled />
                                    </div>
                                    <div className="rightdiv-details">
                                        <h6 className="font-weight-bold mb-0">Date</h6>
                                        <input type="text" className="form-control" defaultValue={ new Date().toDateString() } disabled />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <form className="" onSubmit={ onSubmit }>
                            <fieldset className="">
                                {
                                    Form.map(
                                        ( val, index ) => {
                                            return (
                                                <div className="ml-3 mb-3" key={index}>
                                                    <div className="d-flex align-items-end justify-content-between question">
                                                        <div className="d-flex align-items-center left">
                                                            <i className="las la-arrow-right mb-0 mr-2"></i>
                                                            <h6 className="mb-1 font-weight-bold">{ val.q } <span className="text-danger">*</span></h6>
                                                        </div>
                                                        <div className="d-flex align-items-center right">
                                                            <label className="mb-1 urdu" style={{ fontSize: '16px' }}><span className="text-danger">*</span>{ val.translation }</label>
                                                            <i className="las la-arrow-left ml-2" style={{ fontSize: '20px' }}></i>
                                                        </div>
                                                    </div>
                                                    {
                                                        val.type === 'text'
                                                        ?
                                                        <textarea className={ "form-control " + val.type } value={ val.answer } onChange={ onChangeHandler } name={ val.id } minLength={20} required />
                                                        :
                                                        val.type === 'multiple'
                                                        ?
                                                        val.answers.map(
                                                            ( value, i ) => <input key={i} value={ value.answer } onChange={ onChangeHandler } className={ "form-control mb-3 mt-2 " + val.type } name={ val.id + '-' + value.id } required />
                                                        )
                                                        :
                                                        val.type === 'checkbox'
                                                        ?
                                                        val.answers.map(
                                                            ( value, i ) => <div className="mt-2 d-flex align-items-center pl-3" key={i}><input checked={ value.checked } onChange={ onChangeHandler } type="checkbox" className={ "form-control mr-2 " + val.type } name={ val.id + '-' + value.id } />{value.label}</div>
                                                        )
                                                        :
                                                        val.type === 'radio'
                                                        ?
                                                        val.answers.map(
                                                            ( value, i ) => <div className="mt-2 d-flex align-items-center pl-3" key={i}><input onChange={ onChangeHandler } type="radio" className={ "form-control mr-2 " + val.type } name={ val.id + '-' + value.id } id={value.no} checked={value.checked} />{value.label}</div>
                                                        ):null
                                                    }
                                                    {/* <div className="mt-2 d-flex align-items-center font-weight-bold"><input type="checkbox" className="form-control mr-2" onChange={ onChangeCheckBoxes } name="position_description" /> Not Applicable</div> */}
                                                </div>
                                            )
                                        }
                                    )
                                }

                                <div className="d-flex align-items-center justify-content-end">
                                    <button className="btn submit" type='submit'>Submit</button>
                                </div>

                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
export default UI;