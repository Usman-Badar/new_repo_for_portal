export const FetchData = ( Filters, EmpData, toast, axios, setDailyAttendance, setStartLoading ) => {

    let company = Filters.company === null ? EmpData.company_code : Filters.company;
    let dateFrom = Filters.dateFrom;
    let dateTo = Filters.dateTo;

    if ( dateFrom !== '' && dateTo !== '' && dateTo < dateFrom )
    {
        toast.dark( "Date To should greater than Date From", {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        return false;
    }
    
    setStartLoading(true);
    const Data = new FormData();
    Data.append('DateFrom', dateFrom);
    Data.append('DateTo', dateTo);
    Data.append('CompanyCode', company);
    axios.post('/allemployeesattcompanywiseaccordingtodate', Data).then( res => {

        setStartLoading(false);
        setDailyAttendance( res.data );

    } ).catch( err => {

        setStartLoading(false);
        toast.dark( err , {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

    } );

}

export const FetchCompanies = ( axios, toast, setCompanies ) => {

    axios.get('/getcompaniescodes').then( response => {

        setCompanies( response.data );

    } ).catch( err => {

        toast.dark( err , {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

    } );

}

export const OnFilter = ( e, Filters, setFilters ) => {

    const { name, value } = e.target;

    const val = {
        ...Filters,
        [name]: value
    }

    setFilters( val );

}