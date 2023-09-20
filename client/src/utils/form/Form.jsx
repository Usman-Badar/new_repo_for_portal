/* eslint-disable no-lone-blocks */
import React, { useEffect, useState } from 'react';
import './ui.css';

import axios from '../../axios';
import JSAlert from 'js-alert';
import { useHistory } from 'react-router-dom';
import $ from 'jquery';

import Loading1 from '../../images/loadingIcons/icons8-loading-circle.gif';
import Loading2 from '../../images/loadingIcons/loading2.gif';
import Loading3 from '../../images/loadingIcons/icons8-iphone-spinner.gif';

const Form = ({ loading, submission, btn, heading, bg, additionalClasses, fields }) => {
    const history = useHistory();
    const { alignment, list, space } = btn;
    const { handler, custom, api, parameters, successMessage, redirectUrl } = submission;

    const [ ShowLoading, setShowLoading ] = useState(true);
    useEffect(
        () => {
            setShowLoading(false);
        }, []
    )

    const handleSubmit = (e) => {
        e.preventDefault();
        if ( custom )
        {
            handler(e, setShowLoading);
        }else
        {
            setShowLoading(true);
            axios.post(
                api,
                parameters
            ).then(
                res => {
                    if ( res.data === 'err' )
                    {
                        setShowLoading(false);
                        JSAlert.alert("Something went wrong!!!").dismissIn(1500 * 1);
                    }else
                    {
                        JSAlert.alert(successMessage).dismissIn(1500 * 1);
                        history.push(redirectUrl);
                    }
                }
            ).catch(
                err => {
                    setShowLoading(false);
                    console.log(err);
                }
            )
        }
    }
    const uploadFiles = (event, preview, id, changeHandler) => {
        const reader = new FileReader();
        reader.onload = () => {
            if( reader.readyState === 2 )
            {
                if ( event.target.files.length > 1 )
                {
                    let arr = [];
                    for ( let x= 0; x < event.target.files.length; x++ )
                    {
                        if (preview) $(id).append(`<img src="${URL.createObjectURL(event.target.files[x])}" alt="preview" width="100%" />`);
                        arr.push({file: event.target.files[x], name: event.target.files[x].name, extension: event.target.files[x].type});
                    }
                    changeHandler(arr);
                }else
                {
                    if (preview) $(id).attr('src', URL.createObjectURL(event.target.files[0]));
                    changeHandler({file: event.target.files[0], name: event.target.files[0].name, extension: event.target.files[0].type});
                }
            }
        }
        if ( event.target.files[0] ) {
            reader.readAsDataURL( event.target.files[0] );
        }
    }

    return (
        <>
            <form onSubmit={ handleSubmit } className={ (bg === false ? ' custom-form' : 'custom-form page-content p-relative ') + additionalClasses }>
                {
                    loading && ShowLoading?
                    <div className='loading-screen popUps'>
                        { loading.type === 1 ? <img src={Loading1} width={loading.width?loading.width:'50px'} height={loading.height?loading.height:'50px'} alt="loading" /> : null }
                        { loading.type === 2 ? <img src={Loading2} width={loading.width?loading.width:'50px'} height={loading.height?loading.height:'50px'} alt="loading" /> : null }
                        { loading.type === 3 ? <img src={Loading3} width={loading.width?loading.width:'50px'} height={loading.height?loading.height:'50px'} alt="loading" /> : null }
                    </div>
                    :null
                }
                {
                    heading?
                    <Head heading={ heading } />
                    :null
                }
                <fieldset>
                    {
                        fields.map(
                            ({grid, list}, ii) => {
                                return (
                                    <>
                                        {
                                            grid === 1
                                            ?
                                            <div className='grid grid-1' key={ii} id={ "field_" + ii }>
                                                {
                                                    list.map(
                                                        (
                                                            { name, accept, preview, multiple, options, label, value, max, min, type, minLength, disabled, required, inputType, pattern, placeholder, inputAdditionalClasses, changeHandler }, 
                                                            index
                                                        ) => {
                                                            let field = <></>;
                                                            if ( inputType === 'input' )
                                                            {
                                                                field = (
                                                                    <div>
                                                                        <label className={ 'mb-0 ' + (label.bold ? 'font-weight-bold' : '') }>{label.text}</label>
                                                                        <input 
                                                                            value={ value ? value : undefined }
                                                                            className={ 'mb-2 form-control ' + inputAdditionalClasses }
                                                                            key={ index }
                                                                            type={ type }
                                                                            pattern={ pattern }
                                                                            onChange={ type === 'file' ? (e) => uploadFiles(e, preview, "#field_" + ii + " #preview-grid-" + index, changeHandler) : changeHandler ? (e) => changeHandler( e.target.value ) : undefined }
                                                                            placeholder={ placeholder }
                                                                            required={ required }
                                                                            disabled={ disabled }
                                                                            minLength={ minLength }
                                                                            min={ min }
                                                                            max={ max }
                                                                            multiple={ multiple }
                                                                            accept={ accept }
                                                                            name={name}
                                                                        />
                                                                        {
                                                                            type === 'file' && preview
                                                                            ?
                                                                            multiple?
                                                                            <div className={ 'preview-grid grid-' + preview.grid } id={ "preview-grid-" + index }></div>
                                                                            :
                                                                            <div className='text-center'><img width={preview.width?preview.width:'100%'} height={preview.height?preview.height:'100%'} alt="preview" id={ "preview-grid-" + index } /></div>
                                                                            :null
                                                                        }
                                                                    </div>
                                                                )
                                                            }else
                                                            if ( inputType === 'select' )
                                                            {
                                                                field = (
                                                                    <div>
                                                                        <label className={ 'mb-0 ' + (label.bold ? 'font-weight-bold' : '') }>{label.text}</label>
                                                                        <select 
                                                                            value={ value ? value : undefined }
                                                                            className={ 'mb-2 form-control ' + inputAdditionalClasses }
                                                                            key={ index }
                                                                            onChange={ type === 'file' ? (e) => uploadFiles(e, preview, "#field_" + ii + " #preview-grid-" + index, changeHandler) : changeHandler ? (e) => changeHandler( e.target.value ) : undefined }
                                                                            required={ required }
                                                                            disabled={ disabled }
                                                                            name={name}
                                                                        >
                                                                            {
                                                                                options.map(
                                                                                    ({text, value}, i) => {
                                                                                        return (
                                                                                            <option key={i} value={value}>{text}</option>
                                                                                        )
                                                                                    }
                                                                                )
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                )
                                                            }
                                                            return field;
                                                        }
                                                    )
                                                }
                                            </div>
                                            :
                                            grid === 2
                                            ?
                                            <div className='grid grid-2' key={ii} id={ "field_" + ii }>
                                                {
                                                    list.map(
                                                        (
                                                            { name, accept, preview, multiple, options, label, value, max, min, type, minLength, disabled, required, inputType, pattern, placeholder, inputAdditionalClasses, changeHandler }, 
                                                            index
                                                        ) => {
                                                            let field = <></>;
                                                            if ( inputType === 'input' )
                                                            {
                                                                field = (
                                                                    <div>
                                                                        <label className={ 'mb-0 ' + (label.bold ? 'font-weight-bold' : '') }>{label.text}</label>
                                                                        <input 
                                                                            value={ value ? value : undefined }
                                                                            className={ 'mb-2 form-control ' + inputAdditionalClasses }
                                                                            key={ index }
                                                                            type={ type }
                                                                            pattern={ pattern }
                                                                            onChange={ type === 'file' ? (e) => uploadFiles(e, preview, "#field_" + ii + " #preview-grid-" + index, changeHandler) : changeHandler ? (e) => changeHandler( e.target.value ) : undefined }
                                                                            placeholder={ placeholder }
                                                                            required={ required }
                                                                            disabled={ disabled }
                                                                            minLength={ minLength }
                                                                            min={ min }
                                                                            max={ max }
                                                                            multiple={ multiple }
                                                                            accept={ accept }
                                                                            name={name}
                                                                        />
                                                                        {
                                                                            type === 'file' && preview
                                                                            ?
                                                                            multiple?
                                                                            <div className={ 'preview-grid grid-' + preview.grid } id={ "preview-grid-" + index }></div>
                                                                            :
                                                                            <div className='text-center'><img width={preview.width?preview.width:'100%'} height={preview.height?preview.height:'100%'} alt="preview" id={ "preview-grid-" + index } /></div>
                                                                            :null
                                                                        }
                                                                    </div>
                                                                )
                                                            }else
                                                            if ( inputType === 'select' )
                                                            {
                                                                field = (
                                                                    <div>
                                                                        <label className={ 'mb-0 ' + (label.bold ? 'font-weight-bold' : '') }>{label.text}</label>
                                                                        <select 
                                                                            value={ value ? value : undefined }
                                                                            className={ 'mb-2 form-control ' + inputAdditionalClasses }
                                                                            key={ index }
                                                                            onChange={ type === 'file' ? (e) => uploadFiles(e, preview, "#field_" + ii + " #preview-grid-" + index, changeHandler) : changeHandler ? (e) => changeHandler( e.target.value ) : undefined }
                                                                            required={ required }
                                                                            disabled={ disabled }
                                                                            name={name}
                                                                        >
                                                                            {
                                                                                options.map(
                                                                                    ({text, value}, i) => {
                                                                                        return (
                                                                                            <option key={i} value={value}>{text}</option>
                                                                                        )
                                                                                    }
                                                                                )
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                )
                                                            }
                                                            return field;
                                                        }
                                                    )
                                                }
                                            </div>
                                            :
                                            grid === 3
                                            ?
                                            <div className='grid grid-3' key={ii} id={ "field_" + ii }>
                                                {
                                                    list.map(
                                                        (
                                                            { name, accept, preview, multiple, options, label, value, max, min, type, minLength, disabled, required, inputType, pattern, placeholder, inputAdditionalClasses, changeHandler }, 
                                                            index
                                                        ) => {
                                                            let field = <></>;
                                                            if ( inputType === 'input' )
                                                            {
                                                                field = (
                                                                    <div>
                                                                        <label className={ 'mb-0 ' + (label.bold ? 'font-weight-bold' : '') }>{label.text}</label>
                                                                        <input 
                                                                            value={ value ? value : undefined }
                                                                            className={ 'mb-2 form-control ' + inputAdditionalClasses }
                                                                            key={ index }
                                                                            type={ type }
                                                                            pattern={ pattern }
                                                                            onChange={ type === 'file' ? (e) => uploadFiles(e, preview, "#field_" + ii + " #preview-grid-" + index, changeHandler) : changeHandler ? (e) => changeHandler( e.target.value ) : undefined }
                                                                            placeholder={ placeholder }
                                                                            required={ required }
                                                                            disabled={ disabled }
                                                                            minLength={ minLength }
                                                                            min={ min }
                                                                            max={ max }
                                                                            multiple={ multiple }
                                                                            accept={ accept }
                                                                            name={name}
                                                                        />
                                                                        {
                                                                            type === 'file' && preview
                                                                            ?
                                                                            multiple?
                                                                            <div className={ 'preview-grid grid-' + preview.grid } id={ "preview-grid-" + index }></div>
                                                                            :
                                                                            <div className='text-center'><img width={preview.width?preview.width:'100%'} height={preview.height?preview.height:'100%'} alt="preview" id={ "preview-grid-" + index } /></div>
                                                                            :null
                                                                        }
                                                                    </div>
                                                                )
                                                            }else
                                                            if ( inputType === 'select' )
                                                            {
                                                                field = (
                                                                    <div>
                                                                        <label className={ 'mb-0 ' + (label.bold ? 'font-weight-bold' : '') }>{label.text}</label>
                                                                        <select 
                                                                            value={ value ? value : undefined }
                                                                            className={ 'mb-2 form-control ' + inputAdditionalClasses }
                                                                            key={ index }
                                                                            onChange={ type === 'file' ? (e) => uploadFiles(e, preview, "#field_" + ii + " #preview-grid-" + index, changeHandler) : changeHandler ? (e) => changeHandler( e.target.value ) : undefined }
                                                                            required={ required }
                                                                            disabled={ disabled }
                                                                            name={name}
                                                                        >
                                                                            {
                                                                                options.map(
                                                                                    ({text, value}, i) => {
                                                                                        return (
                                                                                            <option key={i} value={value}>{text}</option>
                                                                                        )
                                                                                    }
                                                                                )
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                )
                                                            }
                                                            return field;
                                                        }
                                                    )
                                                }
                                            </div>
                                            :null
                                        }
                                    </>
                                )
                            }
                        )
                    }
                    <div className={ 'd-flex align-items-center justify-content-' + alignment + ' ' + (space ? 'mt-3' : '') }>
                        {
                            list.map(
                                ( { text, type, color, btnAdditionalClasses }, index ) => {
                                    return (
                                        <button type={ type } className={ ('btn ' + color) + ' ' + (btnAdditionalClasses?btnAdditionalClasses:'') } key={index}>{ text }</button>
                                    )
                                }
                            )
                        }
                    </div>
                </fieldset>
            </form>
        </>
    )
}

export default Form;

const Head = ({ heading }) => {
    const { type, title, subTitle, line, space, buttons } = heading;
    if ( type === 'page-heading' )
    {
        return (
            <>
                <div className='d-flex justify-content-between'>
                    <h3 className="heading">
                        {title}
                        <sub>{subTitle}</sub>
                    </h3>
                    {buttons}
                </div>
                <hr />
            </>
        )
    }else
    if ( type === 'center' )
    {
        return (
            <>
                <h3 className='text-center mb-1'>
                    {title}
                </h3>
                <h5 className='text-center'>
                    {subTitle}
                </h5>
                { line ? <hr /> : null }
                { space ? <br /> : null }
            </>
        )
    }
    return false;
}

{/* <Form  */}
    // if heading is required
    // heading={
    //     {
    //         type: 'page-heading', // page-heading, center
    //         title: '',
    //         subTitle: '',
    //         line: true, // true or false
    //         space: true // true or false
    //     }
    // }
    // fields={
    //     [
    //         {
    //             max: '', // optional
    //             min: '', // optional
    //             minLength: '', // optional
    //             disabled: '', // optional
    //             pattern: '', // optional
    //             inputAdditionalClasses: '', // optional
    //             value: UserName, // State Value   // optional                          
    //             type: 'input', // text, number, date, month, etc...
    //             required: true, // true or false
    //             inputType: 'input', // input, select, textarea
    //             placeholder: "Admin Login ID", // optional
    //             changeHandler: setUserName, // setState
    //             options: [
                //     {
                //         text: '',
                //         value: '',
                //     }
                // ]
    //         }
    //     ]
    // }
    // btn={
    //     {
    //         alignment: 'end', // left, center, end
    //         space: true, // true or false
    //         list: [
    //             {
    //                 text: '',
    //                 type: '', // submit, button, reset
    //                 color: '', // submit, cancle, green
    //                 btnAdditionalClasses: '', // like btn-dark, etc...
    //             }
    //         ]
    //     }
    // }
// />