const initialState = {
    EmployeeData: {},
    Relations: [],
    Menu: [],
    EmpLogin: false
}

const EmpLogin = ( state = initialState, action ) => {

    switch ( action.type )
    {
        
        case "EMPLOGIN":

            const { data } = action.payload;

            return {
                ...state,
                EmployeeData: data[0][0], Relations: data[1], Menu: data[2], EmpLogin: true
            }
        default:
            return state;

    }

}

export default EmpLogin;