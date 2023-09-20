const initialState = {
    UserData: {}
}

const UserLogin = ( state = initialState, action ) => {

    switch ( action.type )
    {
        
        case "USRLOGIN":

            const { data } = action.payload;

            return {
                ...state,
                UserData: data
            }
        default:
            return state;

    }

}

export default UserLogin;