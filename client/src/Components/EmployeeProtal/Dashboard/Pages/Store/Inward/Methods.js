export const onChangeHandler = ( e, Entity, setEntity, GetStoreItems ) => {

    const { name, value } = e.target;
    const val = {
        ...Entity,
        [name]: value
    };

    setEntity( val );

    if ( name === 'item_name' )
    {
        GetStoreItems( value );
    }

}