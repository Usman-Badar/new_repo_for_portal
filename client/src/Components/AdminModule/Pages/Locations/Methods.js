export const GetAllLocations = ( axios, setLocationsList, setError ) => {

    axios.get(
        '/getalllocations'
    ).then(
        res => {

            setLocationsList( res.data );

        }
    ).catch(
        err => {

            setError( err );
            setLocationsList( err.message );

        }
    )

}

export const Edit = ( index, LocationsList, setLocation ) => {

    const arr = LocationsList[index];
    setLocation( arr );

}

export const BackToLocations = ( setLocation, setOpenForm ) => {

    setOpenForm( false );
    setLocation();

}

export const OpenFormFunc = ( OpenForm, setOpenForm ) => {

    setOpenForm(!OpenForm);

}

export const onChangeHandler = ( e, Location, setLocation ) => {

    const { name, value } = e.target;
    const val ={
        ...Location,
        [name]: value
    };

    setLocation( val );

}

export const onSubmitForm = ( e, url, Location, axios, setLocation, setOpenForm, setLocationsList, setError ) => {

    e.preventDefault();

    axios.post(
        url,
        {
            location_name: Location.location_name, 
            address: Location.address, 
            map: Location.map, 
            attendance_mode: Location.attendance_mode, 
            location_phone: Location.location_phone,
            location_code: Location.location_code ? Location.location_code : null
        }
    ).then(
        () => {

            alert("SUCCESS");
            setLocation();
            setOpenForm(false);
            GetAllLocations( axios, setLocationsList );

        }
    ).catch(
        err => {

            setError( err.message );

        }
    )

}

export const Delete = ( index, axios, setLocationsList, setError ) => {

    axios.post(
        '/deletelocation',
        {
            location_code:  index
        }
    ).then(
        () => {

            GetAllLocations( axios, setLocationsList );

        }
    ).catch(
        err => {

            setError( err.message );

        }
    )

}