export const newStore = ( key, payload ) => {

    localStorage.setItem( key, payload );
    return 'success';

};

export const getStore = ( key ) => {

    let data = localStorage.getItem( key );
    return JSON.parse( data );

};


export const updateStore = ( key, payload ) => {

    let data = JSON.parse( localStorage.getItem( key ) );
    data.push( payload );
    localStorage.setItem( key, JSON.stringify( data ) );
    return 'success';

};

export const deleteStore = ( key ) => {

    localStorage.removeItem( key );
    return 'success';

};