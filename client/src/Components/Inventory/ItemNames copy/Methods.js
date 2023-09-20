export const onChangeHandler = ( e, Form, setForm ) => {

    const { name, value } = e.target;
    const val ={
        ...Form,
        [name]: value
    };

    setForm( val );

}

export const EnterNewItem = ( e, axios, Form, toast, setDisabled, history ) => {

    e.preventDefault();
    setDisabled( true );

    axios.post(
        '/enternewitemname',
        {
            item_name: Form.item_name,
        }
    ).then(
        () => {

            toast.dark("Item Entered", {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            setTimeout(() => {
                history.replace('/inventory/items_names');
            }, 2000);

        }
    ).catch(
        err => {

            setDisabled( false );
            console.log( err );

        }
    )

}