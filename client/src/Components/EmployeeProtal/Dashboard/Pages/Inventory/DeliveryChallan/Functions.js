import axios from '../../../../../../axios';
import JSAlert from 'js-alert';
import $ from 'jquery';

export const loadList = ( setList ) => {

    axios.get('/delivery_challan/all')
    .then(
        res => 
        {
                
            setList(res.data);

        }
    ).catch(
        err => {

            console.log(err);

        }
    );

}

export const enterItem = ( Item, Items, setItems, setItem ) => {

    if ( Item.description.length === 0 )
    {
        JSAlert.alert('description is required').dismissIn(1000 * 2);
        return false;
    }else
    if ( Item.quantity < 1 )
    {
        JSAlert.alert('minimum 1 quantity is required').dismissIn(1000 * 2);
        return false;
    }else
    {
        const obj = {
            description: Item.description,
            quantity: Item.quantity
        }
        setItem(
            {
                description: '',
                quantity: 1
            }
        )
        setItems(
            [
                ...Items,
                obj
            ]
        );
    }

}

export const onChangeItems = ( e, Item, setItem ) => {

    const { name, value } = e.target;
    const val = {
        ...Item,
        [name]: value
    };
    setItem( val );

}

export const searchVender = ( e, setVendors, setVendor ) => {

    if ( e.target.value === '' )
    {
        setVendors([]);
        setVendor();
        return false;
    }

    axios.post(
        '/inventory/venders/search',
        {
            key: e.target.value
        }
    ).then(
        res => {

            setVendors( res.data );

        }
    ).catch(
        err => {

            console.log( err );

        }
    )

}

export const vendorSelection = ( index, Vendors, setVendor, setVendors ) => {

    const vender = Vendors[index];
    setVendor(vender);
    document.getElementById('vendor_name').value = vender.name;
    setVendors([]);

}

export const createDeliveryChallan = ( e, history, Item, Items, Vender, setVender, setVenders, setItems, setItem ) => {

    e.preventDefault();
    const received_from_name = e.target['received_from_name'].value;
    const received_from_number = e.target['received_from_number'].value;
    const invoice_number = document.getElementById('invoice_no').value;
    const items = Items;

    if ( items.length === 0 )
    {
        JSAlert.alert('Please add at least one item to the list.').dismissIn(1000 * 2);
        return false;
    }else

    if ( Item.description !== '' )
    {
        console.log(Item.description)
        JSAlert.alert('There is a data entered in the input fields, Kindly clear or enter the data.').dismissIn(1000 * 2);
        return false;
    }else
    
    if ( !Vender )
    {
        JSAlert.alert('Please search and select a vender.').dismissIn(1000 * 2);
        return false;
    }

    $('fieldset').prop('disabled', true);

    axios.post(
        '/delivery_challan',
        {
            name: received_from_name,
            number: received_from_number,
            invoice_number: invoice_number === '' ? null : invoice_number,
            items: JSON.stringify(items),
            vender: Vender.vender_id,
            date_time: new Date().toString(),
            received_by: localStorage.getItem("EmpID") // receiver employee name -> currently it is Antash
        }
    ).then(
        () => {

            setItems([]);
            setItem(
                {
                    description: '',
                    quantity: 1
                }
            )
            JSAlert.alert('Delivery challan has been entered.').dismissIn(1000 * 2);
            setVender();
            setVenders([]);
            setTimeout(() => {
                history.replace('/inventory/challan/list');
            }, 1500);

        }
    ).catch(
        err => {

            $('fieldset').prop('disabled', false);
            console.log( err );
            JSAlert.alert('Something went wrong.').dismissIn(1000 * 2);

        }
    )

}