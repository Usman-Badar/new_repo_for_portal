const initialState = {
    Data: []
}

const ChatBot = ( state = initialState, action ) => {

    switch ( action.type )
    {
        
        case "CHATBOT":

            const { data } = action.payload;

            return {
                ...state,
                Data: data
            }
        default:
            return state;

    }

}

export default ChatBot;