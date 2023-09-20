export const getRequests = ( axios, setRequests, setSpecifications ) => {

    axios.get(
        '/store/get_inventory_requests'
    ).then(
        res => {

            setRequests( res.data[0] );
            setSpecifications( res.data[1] );

        }
    ).catch(
        err => {

            console.log( err );

        }
    )

}

export const OpenRequest = ( toast, index, axios, accepted_by, Requests, setDetails, setComments ) => {

    let obj = Requests[index];
    GetComments( axios, obj.request_id, setComments );

    if ( !obj.accepted_by )
    {
        toast.dark("Setting Up The Details", {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        axios.post(
            '/store/accept_inventory_request',
            {
                accepted_by: accepted_by,
                request_id: obj.id
            }
        ).then(
            () => {
                fetchDetails( axios, obj, setDetails );
                toast.dark("Opening The Request", {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        )
    }else
    {
        fetchDetails( axios, obj, setDetails );
        toast.dark("Opening The Request", {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

}

const fetchDetails = ( axios, obj, setDetails ) => {

    axios.post(
        '/store/inventory_request/details',
        {
            request_id: obj.id
        }
    ).then(
        res => {

            setDetails( res.data );

        }
    ).catch(
        err => {

            console.log( err );

        }
    )

}

export const GetComments = ( axios, id, setComments ) => {

    axios.post('/getitemrequestcomments', { id: id })
    .then(
        res => 
        {

            setComments( res.data );
            setTimeout(() => {
                let objDiv = document.getElementById("comments_content");
                if (objDiv) {
                    objDiv.scrollTop = objDiv.scrollHeight;
                }
            }, 500);

        }
    ).catch(
        err => {

            console.log(err);

        }
    );

}

export const newComment = ( e, axios, request_id, socket, setComments ) => {

    e.preventDefault();
    axios.post(
        '/newitemrequestcomment', 
        {
            comment: e.target['comment'].value,
            item_request_id: request_id,
            sender_id: localStorage.getItem("EmpID")
        }
    ).then(
        () => {

            document.getElementById('commentForm').reset();
            GetComments( axios, request_id, setComments );
            socket.emit( 'newitemrequestcomment', request_id );
        
        }
    ).catch(
        err => {

            console.log( err );

        }
    );

}

export const issueToInventory = ( request_id, id, axios, setDetails, setComments, setRequests ) => {

    axios.post(
        '/store/issue_items_to_inventory', 
        {
            id: id,
            request_id: request_id,
            issued_by: localStorage.getItem("EmpID")
        }
    ).then(
        () => {

            setDetails();
            setComments([]);
            getRequests( axios, setRequests );
        
        }
    ).catch(
        err => {

            console.log( err );

        }
    );

}