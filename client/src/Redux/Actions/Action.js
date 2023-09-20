export const UserLogin = ( data ) => {

    return {
        type: "USRLOGIN",
        payload: {
            data: data
        }
    }

}

export const EmployeeLogin = ( data ) => {

    return {
        type: "EMPLOGIN",
        payload: {
            data: data
        }
    }

}

export const ShowSideBar = ( Condition ) => {

    return {
        type: "SHOWSIDEBAR",
        payload: {
            data: Condition
        }
    }

}

export const Chatbot = ( message ) => {

    return {
        type: "CHATBOT",
        payload: {
            data: message
        }
    }

}