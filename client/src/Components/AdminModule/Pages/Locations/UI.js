import React from 'react';
import './UI.css';

const UI = ( { Error, LocationsList, Location, OpenForm, Edit, Delete, BackToLocations, OpenFormFunc, onChangeHandler, onSubmitForm } ) => {

    return (
        <>
            <div className='LocationsContainer'>

                {
                    OpenForm
                    ?
                    <FormComponent
                        Error={ Error }

                        onChangeHandler={ onChangeHandler }
                        BackToLocations={ BackToLocations }
                        onSubmitForm={ onSubmitForm }
                    />
                    :
                    Location
                    ?
                    <LocationDetails 
                        Location={ Location }
                        Error={ Error }

                        onChangeHandler={ onChangeHandler }
                        BackToLocations={ BackToLocations }
                        onSubmitForm={ onSubmitForm }
                    />
                    :
                    <List 
                        LocationsList={ LocationsList }
                        Error={ Error }

                        Edit={ Edit }
                        Delete={ Delete }
                        OpenFormFunc={ OpenFormFunc }
                    />
                }
                
                <div className='grid_column2'>
                    {
                        Location
                        ?
                        <iframe
                            src={ Location.map }
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowfullscreen=""
                            loading="lazy"
                            className='map'
                            title="map"
                        ></iframe>
                        :null
                    }
                </div>

            </div>
        </>
    )

}

export default UI;

const FormComponent = ( { Error, BackToLocations, onChangeHandler, onSubmitForm } ) => {

    return (
        <form className='grid_column details' onSubmit={ (e) => onSubmitForm(e, '/addlocation') }>

            <div className='d-flex align-items-center justify-content-between'>
                <h5 className='mb-0'>
                    Enter New Location
                </h5>
                <button className='btn submit' type="button" onClick={ BackToLocations }>
                    back
                </button>
            </div>

            <hr />

            {
                Error
                ?
                <div className='logContainer'>
                    <div className="log"> 
                        <span>{ Error }</span>
                    </div>
                </div>
                :null
            }
            
            <p className='font-weight-bold mb-0'>
                Location Name
            </p>
            <input required className='form-control form-control-sm' name="location_name" onChange={ onChangeHandler } type="text" />
            
            <br />

            <p className='font-weight-bold mb-0'>
                Location Phone
            </p>
            <input required className='form-control form-control-sm' name="location_phone" onChange={ onChangeHandler } type="text" />

            <br />

            <p className='font-weight-bold mb-0'>
                Location Address
            </p>
            <textarea required className='form-control form-control-sm' name="address" onChange={ onChangeHandler } type="text" />

            <br />

            <p className='font-weight-bold mb-0'>
                Location Attendance Mode
            </p>
            <input required className='form-control form-control-sm' name="attendance_mode" onChange={ onChangeHandler } type="text" />

            <button className='btn submit cancle mt-3 d-block ml-auto' type="submit">
                submit
            </button>

        </form>
    )

}

const LocationDetails = ( { Error, Location, onChangeHandler, BackToLocations, onSubmitForm } ) => {

    return (
        <form className='grid_column details' onSubmit={ (e) => onSubmitForm(e, '/updatelocation') }>

            <div className='d-flex align-items-center justify-content-between'>
                <h5 className='mb-0'>
                    Location Details
                </h5>
                <button className='btn submit' type="button" onClick={ BackToLocations }>
                    back
                </button>
            </div>

            <hr />
            
            {
                Error
                ?
                <div className='logContainer'>
                    <div className="log"> 
                        <span>{ Error }</span>
                    </div>
                </div>
                :null
            }
            
            <p className='font-weight-bold mb-0'>
                Location Name
            </p>
            required <input className='form-control form-control-sm' name="location_name" value={ Location.location_name } onChange={ onChangeHandler } type="text" />
            
            <br />

            <p className='font-weight-bold mb-0'>
                Location Phone
            </p>
            <input required className='form-control form-control-sm' name="location_phone" value={ Location.location_phone } onChange={ onChangeHandler } type="text" />

            <br />

            <p className='font-weight-bold mb-0'>
                Location Address
            </p>
            <textarea required className='form-control form-control-sm' name="address" value={ Location.address } onChange={ onChangeHandler } type="text" />

            <br />

            <p className='font-weight-bold mb-0'>
                Location Attendance Mode
            </p>
            <input required className='form-control form-control-sm' name="attendance_mode" value={ Location.attendance_mode } onChange={ onChangeHandler } type="text" />

            <button className='btn submit cancle mt-3 d-block ml-auto' type="submit">
                submit
            </button>

        </form>
    )

}

const List = ( { Error, LocationsList, Edit, OpenFormFunc, Delete } ) => {

    return (
        <div className='grid_column'>

            <div className='d-flex align-items-center justify-content-between'>
                <h5 className='mb-0'>
                    Locations
                </h5>
                <button className='btn submit' onClick={ OpenFormFunc }>
                    New
                </button>
            </div>

            <hr />

            {
                Error
                ?
                <div className='logContainer'>
                    <div className="log"> 
                        <span>{ Error }</span>
                    </div>
                </div>
                :null
            }

            <div className='listContainer'>

                {
                    typeof( LocationsList ) === 'string'
                    ?
                    <h6 className='text-center'>
                        {
                            LocationsList
                        }
                    </h6>
                    :
                    LocationsList.length === 0
                    ?
                    <h6 className='text-center'>
                        No Record Found
                    </h6>
                    :
                    LocationsList.map(
                        ( val, index ) => {

                            return (
                                <ListItem
                                    index={ index }
                                    location_name={ val.location_name }
                                    location_phone={ val.location_phone }
                                    location_code={ val.location_code }

                                    Edit={ Edit }
                                    Delete={ Delete }
                                />
                            )

                        }
                    )
                }

            </div>

        </div>
    )

}

const ListItem = ( { index, location_name, location_phone, location_code, Edit, Delete } ) => {

    return (
        <div className='listItem'>

            <div>
                <p className='mb-0 title'>
                    <b>{ location_name }</b>
                </p>
                <p className='mb-0 title'>
                    { location_phone }
                </p>
            </div>
            <div>
                <button className='btn btn-sm mr-1 editBtn' onClick={ () => Edit( index ) }>
                    <i className="lar la-edit"></i>
                </button>
                <button className='btn btn-sm ml-1' onClick={ () => Delete( location_code ) }>
                    <i className="las la-trash"></i>
                </button>
            </div>

        </div>
    )

}