export const onChangeHandler = ( e, Form, setForm ) => {

    const { name, value } = e.target;
    const val ={
        ...Form,
        [name]: value
    };

    setForm( val );

}

export const EnterNewItem = ( e, axios, Form, toast, Editing, setForm, setItemsList, setEditing, setLog ) => {

    e.preventDefault();

    axios.post(
        Editing ? '/edititemname' : '/enternewitemname',
        {
            item_name: Form.item_name,
            item_id: Form.id ? Form.id : null
        }
    ).then(
        () => {

            setLog(
                Editing
                ?
                ( Form.item_name + " Edited Successfully" )
                :
                ( "New " + Form.item_name + " Item Added Successfully" )
            )
            toast.dark("SUCCESS", {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            document.getElementById("newItemForm").reset();
            setForm(
                {
                    item_name: ''
                }
            );
            GetAllItems( axios, setItemsList );
            setEditing( false );

        }
    ).catch(
        err => {

            setLog( err.message );
            console.log( err );

        }
    )

}

export const GetAllItems = ( axios, setItemsList, setLog ) => {

    axios.get(
        '/getallitemsnames'
    ).then(
        res => {

            setItemsList( res.data );

        }
    ).catch(
        err => {

            setLog( err.message );
            console.log( err );

        }
    )

}

export const Delete = ( index, axios, ItemsList, setItemsList, setLog ) => {

    axios.post(
        '/deleteitemname',
        {
            id: ItemsList[index].id
        }
    ).then(
        () => {

            setLog("Item Deleted Successfully");
            GetAllItems( axios, setItemsList, setLog );

        }
    ).catch(
        err => {

            setLog( err.message );
            console.log( err );

        }
    )

}

export const Edit = ( index, ItemsList, setForm, setEditing ) => {

    const obj = ItemsList[index];
    setForm( obj );
    setEditing( true );

}