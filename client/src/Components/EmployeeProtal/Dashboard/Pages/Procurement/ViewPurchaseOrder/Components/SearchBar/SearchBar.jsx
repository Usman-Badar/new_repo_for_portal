import React, { useEffect, useState } from 'react';

import './SearchBar.css';

const SearchBar = ( props ) => {

    // LOCATIONS LIST
    const [Companies, setCompanies] = useState([]);
    // COMPANIES LIST
    const [Locations, setLocations] = useState([]);

    useEffect(
        () => {

            setCompanies( props.Companies );
            setLocations( props.Locations );

        }, [ props.Locations, props.Companies ]
    )

    return (
        <>
            {/* TOP BAR */}
            {/* WHERE EMPLOYEE CAN SEARCH REQUESTS */}
            {/* BY COMPANY, BY LOCATION, BY STATUS, BY DATE */}
            <div className="SearchContainer">

                {/* SEARCH BAR */}
                {/* TEXT FIELD TO SEARCH REQUEST BY NAME */}
                <div className="SearchBar">

                    {/* SEARCH ICON */}
                    <div>
                        <i class="las la-search"></i>
                    </div>
                    {/* SEARCH FIELD */}
                    <input
                        type="text"
                        placeholder="Tap To Search"
                        className="form-control"
                        onChange={(e) => props.onSearchPO('Key', e)}
                    />


                </div>
                    {/* FILTERS */}
                    {/* CONTAINER */}
                    <div className="SearchFiltersContainer">

                        {/* SEARCH BY COMPANY */}
                        {/* DROPDOWN FIELD */}
                        <div>
                            <label >Companies</label>
                            <select name="companies" id="" onChange={ props.onChangeCompany } className="form-control">
                                <option value="">Default</option>
                                {
                                    Companies.map(
                                        (val) => {

                                            return (
                                                <>
                                                    <option value={ val.company_code }>{ val.company_name }</option>
                                                </>
                                            )
                                        }
                                    )
                                }
                            </select>
                        </div>
                        {/* SEARCH BY LOCATION */}
                        {/* DROPDOWN FIELD */}
                        <div>
                            <label >Locations</label>
                            <select onChange={ props.onChangeLocation } className="form-control">
                                <option value="">Default</option>
                                {
                                    Locations.map(
                                        (val) => {
                                            return (
                                                <>
                                                    <option value={val.location_code}>{val.location_name}</option>
                                                </>
                                            )
                                        }
                                    )
                                }
                            </select>
                        </div>
                        {/* SEARCH BY STATUS */}
                        {/* DROPDOWN FIELD */}
                        <div>
                            <label >Status</label>
                            <select onChange={(e) => props.onSearchPO('Status', e)} className="form-control">
                                <option value="">Default</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Waiting For Approval">Waiting For Approval</option>
                                <option value="Sent">Sent</option>
                                <option value="Viewed">Viewed</option>
                            </select>
                        </div>
                        {/* SEARCH BY DATE */}
                        {/* DATE FIELD */}
                        <div>
                            <label >Date</label>
                            <input type="date" onChange={(e) => props.onSearchPO('MyDate', e)} className="form-control" name="" />
                        </div>

                    </div>

            </div>
        </>
    );
}

export default SearchBar;
