import React, { useEffect, useLayoutEffect, useState } from 'react';

// IMPORT CSS FILE
import './SearchFilters.css';

import $ from 'jquery';

const SearchFilters = React.memo(
    ( props ) => {

    const [Companies, setCompanies] = useState([]);
    const [Locations, setLocations] = useState([]);

    // const [ WindowSize, setWindowSize ] = useState(
    //     {
    //         width: 0,
    //         height: 0
    //     }
    // );

    useEffect(
        () => {

            setCompanies( props.Companies );
            setLocations( props.Locations );

            $('.closebutton').hide();

        }, [ props.Locations, props.Companies ]
    );

    const showfilter = () =>{

        if ( window.screen.width < 768 ) {
            $('.SearchnFilterDiv').css('display', 'block');
            $('.filtericon').hide(0);
            $('.filterdiv').slideDown(
                "slow", () => {
                    $('.closebutton').show();
                }
            );
        }
    }

    const closefilter = () =>{
        $('.filterdiv').slideUp(
            "slow", () => {
                $('.filtericon').show();
                $('.SearchnFilterDiv').css('display', 'grid');
            }
        );
    }

    return (
        <div className="SearchnFilterDiv">
                    <div className="searchdiv">
                        <div><i class="las la-search"></i></div>
                        <input
                            type="text"
                            placeholder="Tap To Search"
                            className="form-control"
                            onChange={(e) => props.onSearchPR('Key', e)}
                        />
                    </div>
                    <div className="filterdiv">
                        <div>
                            <label >Companies</label>
                            <select name="companies" id="" onChange={props.onChangeCompany} className="form-control">
                                <option value="">Default</option>
                                {
                                    Companies.map(
                                        (val) => {
                                            return (
                                                <>
                                                    <option value={val.company_code}>{val.company_name}</option>
                                                </>
                                            )
                                        }
                                    )
                                }
                            </select>
                        </div>
                        <div>
                            <label >Locations</label>
                            <select onChange={props.onChangeLocation} className="form-control">
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
                        <div>
                            <label >Status</label>
                            <select onChange={(e) => props.onSearchPR('Status', e)} className="form-control">
                                <option value="">Default</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Waiting For Approval">Waiting For Approval</option>
                                <option value="Sent">Sent</option>
                                <option value="Viewed">Viewed</option>
                            </select>
                        </div>
                        <div>
                            <label >Date</label>
                            <input type="date" onChange={(e) => props.onSearchPR('MyDate', e)} className="form-control" name="" />
                        </div>
                        <div className='closebutton text-center' onClick={closefilter}>
                            <p>tap to close</p>
                        </div>
                    </div>
                    <div className='filtericon' onClick={showfilter}>
                        <i className="las la-filter"></i>
                    </div>
                </div>
    );
}
)

export default SearchFilters;