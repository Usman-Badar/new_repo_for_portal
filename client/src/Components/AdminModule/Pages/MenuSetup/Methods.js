export const GetMenuItems = ( axios, setMenuItems ) => {

    axios.get(
        '/admin_getallmenuitems'
    ).then(
        res => {

            setMenuItems( res.data );

        }
    ).catch(
        err => {
            
            console.log( err );
            setMenuItems( err.message );

        }
    )

}

export const GetAllEnteredViews = ( axios, setAllViews ) => {

    axios.get(
        '/admin_getallmenuitemviews'
    ).then(
        res => {

            setAllViews( res.data );

        }
    ).catch(
        err => {
            
            console.log( err );
            setAllViews( err.message );

        }
    )

}

export const GetAllEnteredOptionIDs = ( axios, setAllOptions ) => {

    axios.get(
        '/admin_getallmenuitemoptions'
    ).then(
        res => {

            setAllOptions( res.data );

        }
    ).catch(
        err => {
            
            console.log( err );
            setAllOptions( err.message );

        }
    )

}

export const onChangeHandler = ( e, Form, setForm ) => {

    const { name, value } = e.target;
    const val = {
        ...Form,
        [name]: value
    }

    setForm( val );

}

export const AddNewMenuItem = ( e, Form, axios, Edit, setEdit, setForm, setMenuItems, setAllOptions, setAllViews ) => {

    e.preventDefault();
    let url = '/admin_enternewmenuitem';
    if ( Edit )
    {
        url = '/admin_editmenuitem';
    }

    axios.post(
        url,
        {
            id: Form.id ? Form.id : null,
            menu_txt: Form.menu_txt,
            icon_class_name: Form.icon_class_name,
            type: Form.type,
            option_id: Form.option_id,
            link: Form.link,
            view: Form.view,
            under_menu: Form.under_menu,
            access: Form.access
        }
    ).then(
        () => {

            alert("SUCCESS");
            setForm(
                {
                    menu_txt: '',
                    icon_class_name: '',
                    type: 'link',
                    option_id: null,
                    link: null,
                    view: 'portal',
                    under_menu: null,
                    access: null
                }
            );

            setEdit();
            GetMenuItems( axios, setMenuItems );
            GetAllEnteredOptionIDs( axios, setAllOptions );
            GetAllEnteredViews( axios, setAllViews );

        }
    ).catch(
        err => {
            
            console.log( err );
            setMenuItems( err.message );

        }
    )

}

export const EditItem = ( index, MenuItems, setEdit, setForm ) => {

    const obj = MenuItems[index];
    setEdit( obj.menu_txt );
    setForm( obj );

}

export const RemoveItem = ( index, MenuItems, axios, setMenuItems ) => {

    const obj = MenuItems[index];
    axios.post(
        '/admin_removemenuitem',
        {
            id: obj.id
        }
    ).then(
        () => {

            alert("SUCCESS");
            GetMenuItems( axios, setMenuItems );

        }
    ).catch(
        err => {
            
            console.log( err );

        }
    )

}

export const onChangeIndex = ( e, index, axios, MenuItems, setMenuItems ) => {

    if ( e.keyCode === 13 )
    {
        axios.post(
            '/admin_changemenuitemindexing',
            {
                index: e.target.value,
                id: MenuItems[index].id
            }
        ).then(
            () => {
    
                alert("SUCCESS");
                setMenuItems([]);
                GetMenuItems( axios, setMenuItems );
    
            }
        ).catch(
            err => {
                
                console.log( err );
    
            }
        )
    }

}