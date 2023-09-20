import React, { useEffect, useState } from 'react';
import './Companies.css';

import axios from '../../../../axios';

const Companies = () => {

    const [ Form, setForm ] = useState(
        {
            company_code: "",
            code: "",
            company_name: "",
            website: null,
            logo: null
        }
    )
    const [ Companies, setCompanies ] = useState([]);
    const [ Details, setDetails ] = useState(
        {
            companyInfo: null,
            logs: []
        }
    );

    useEffect(
        () => {

            GetCompanies();

        }, []
    );

    const OpenCompanyDetails = ( index ) => {

        const data = Companies[index];
        setDetails(
            {
                ...Details,
                companyInfo: data
            }
        )

    }

    const GetCompanies = () => {

        axios.get(
            '/getcompaniescodes'
        ).then(
            res => {

                setCompanies( res.data );

            }
        ).catch(
            err => {

                console.log( err );

            }
        )

    }

    const onChangeHandler = ( e ) => {

        const { name, value } = e.target;
        const val = {
            ...Form,
            [name]: value
        };

        setForm( val );

    }

    const onImageUpload = (event) => {

        const reader = new FileReader();

        reader.onload = () => {

            if (reader.readyState === 2) {

                setForm(
                    {
                        ...Form,
                        logo: reader.result
                    }
                );

            }

        }

        reader.readAsDataURL(event.target.files[0]);

    }

    const AddNewCompany = ( e ) => {

        e.preventDefault();
        axios.post(
            '/addnewcompany',
            {
                company_code: Form.company_code,
                code: Form.code,
                company_name: Form.company_name,
                website: Form.website,
                logo: Form.logo
            }
        ).then(
            res => {

                if ( res.data === 'COMPANY EXISTS' )
                {
                    alert("Company With Company Code: " + Form.company_code + " Already Exists");
                    return false;
                }
                alert("New Company " + Form.company_name + " Added");
                GetCompanies();
                setForm(
                    {
                        company_code: "",
                        code: "",
                        company_name: "",
                        website: null,
                        logo: null
                    }
                )

            }
        ).catch(
            err => {

                console.log( err );

            }
        )

    }

    const Back = () => {

        setDetails(
            {
                companyInfo: null,
                logs: []
            }
        )

    }

    return (
        <>
            <div className='AdminCompanies'>

                <div className='left'>
                    <CompanyForm 
                        Form={ Form }
                        onImageUpload={ onImageUpload }
                        onChangeHandler={ onChangeHandler }
                        AddNewCompany={ AddNewCompany }
                    />
                </div>

                {
                    Details.companyInfo === null
                    ?
                    Companies.length > 0
                    ?
                    <div className='right'>

                        {
                            Companies.map(
                                ( val, index ) => {

                                    let src;
                                    if ( val.logo === null )
                                    {
                                        src = 'https://pbs.twimg.com/profile_images/578844000267816960/6cj6d4oZ_400x400.png';
                                    }else
                                    {
                                        src = val.logo;
                                    }

                                    return (
                                        <Company
                                            val={ val }
                                            src={ src }
                                            index={ index }
                                            OpenCompanyDetails={ OpenCompanyDetails }
                                        />
                                    )

                                }
                            )
                        }

                    </div>
                    :
                    <h3 className='text-center'>No Company Found</h3>
                    :
                    <CompanyDetails
                        data={ Details.companyInfo }
                        Back={ Back }
                        setDetails={ setDetails } 
                        Details={ Details }
                    />
                }

            </div>
        </>
    )

}

export default Companies;

const CompanyDetails = ( { data, setDetails, Details, Back } ) => {

    useEffect(
        () => {

            axios.post(
                '/getcompanylogs',
                {
                    company_code: data.company_code
                }
            ).then(
                res => {
    
                    setDetails(
                        {
                            ...Details,
                            logs: res.data
                        }
                    );
    
                }
            ).catch(
                err => {
    
                    console.log( err );
    
                }
            )

        }, []
    )

    return (
        <div>
            <div className='CompanyDetails'>
                <i className="las la-arrow-alt-circle-left la-2x" onClick={ Back }></i>

                <img src={ data.logo === null ? 'https://pbs.twimg.com/profile_images/578844000267816960/6cj6d4oZ_400x400.png' : data.logo } width="30%" height='auto' alt="Logo" />

                <div className='rightSide w-100'>

                    <div>
                        <p className='font-weight-bold mb-0'>Company Code</p>
                        <p className='mb-0'> { data.company_code } </p>
                    </div>
                    <div>
                        <p className='font-weight-bold mb-0'>Company Name</p>
                        <p className='mb-0'> { data.company_name } </p>
                    </div>
                    
                    <div>
                        <p className='font-weight-bold mb-0'>Short Code</p>
                        <p className='mb-0'> { data.code === null ? "No Code" : data.code } </p>
                    </div>
                    <div>
                        <p className='font-weight-bold mb-0'>Website</p>
                        <p className='mb-0'> { data.website === null ? "No Website" : data.website } </p>
                    </div>
                    
                    <div>
                        <button className='btn submit btn-block'>
                            Edit
                        </button>
                    </div>

                    <div>
                        <button className='btn cancle btn-block'>
                            Delete
                        </button>
                    </div>

                </div>

            </div>

            <br />

            <div className='CompanyDetails d-block'>

                <h4>
                    Logs
                </h4>

                <div className='logContainer mt-3'>

                    {
                        Details.logs.length === 0
                        ?
                        <p className='text-center mb-0'> No Log Found </p>
                        :
                        Details.logs.map(
                            val => {

                                return (
                                    <div key={ val.log_id } className="log"> 
                                        <span>{ val.log }</span>
                                        <span>{ new Date( val.log_date ).toDateString() } at { val.log_time }</span>
                                    </div>
                                )

                            }
                        )
                    }

                </div>

            </div>
        </div>
    )

}

const Company = ( { val, src, index, OpenCompanyDetails } ) => {

    return (
        <>
            <div key={ val.company_code } className='companyDiv' onClick={ () => OpenCompanyDetails( index ) }>
                <img src={ src } alt="logo" height="100" />
                <p className='font-weight-bold mb-0'>
                    { val.company_name }
                </p>
                <p className='mb-0'>
                    { val.website === null ? "No Website" : val.website }
                </p>
                <p className='mb-0'>
                    { val.code === null ? "No Code" : val.code }
                </p>
            </div>
        </>
    )

}

const CompanyForm = ( { AddNewCompany, onChangeHandler, onImageUpload, Form } ) => {

    return (
        <>
            <form className='left' onSubmit={ AddNewCompany }>

                <h6 className='mb-3 font-weight-bold'>Enter New Company</h6>

                {
                    Form.logo !== null
                    ?
                    <div className='text-center'>
                        <img className='rounded-circle' src={ Form.logo } alt="Logo" width='100' height='100' />
                    </div>
                    :null
                }

                <br />
                
                <label className="mb-0"> Company Code </label>
                <input required type="text" className="form-control form-control-sm mb-2" onChange={ onChangeHandler } value={ Form.company_code } name="company_code" />

                <label className="mb-0"> Short Code </label>
                <input type="text" className="form-control form-control-sm mb-2" onChange={ onChangeHandler } value={ Form.code } name="code" />

                <label className="mb-0"> Company Name </label>
                <input required type="text" className="form-control form-control-sm mb-2" onChange={ onChangeHandler } value={ Form.company_name } name="company_name" />
                
                <label className="mb-0"> Website </label>
                <input type="text" className="form-control form-control-sm mb-2" onChange={ onChangeHandler } value={ Form.website } name="website" />

                <label className="mb-0"> Logo </label>
                <input type="file" className="form-control form-control-sm mb-2" onChange={ onImageUpload } name="logo" />

                <button type='submit' className="btn btn-sm submit">add new company</button>

            </form>
        </>
    )

}