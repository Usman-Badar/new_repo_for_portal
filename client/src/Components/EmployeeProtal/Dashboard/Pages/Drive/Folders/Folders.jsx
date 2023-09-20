import React, { useState, useEffect } from 'react';

const Folders = React.memo(
    ( props ) => {
    
    const [ Folders, setFolders ] = useState([]);

    useEffect(
        () => {

            setFolders( props.Folders );
        
        }, [ props.Folders ]
    );

    return (
        <>
            {
            Folders.length > 0
                ?
                <>
                    <h5 className="pt-2">Folders</h5>
                    <hr />
                    <div className="Employee_Drive_Grid folders">
                        {
                            Folders.length === 0
                                ?
                                null
                                :
                                Folders.map(
                        (val, index) => {

                            return (
                                <>
                                    <div className="Div1 d-flex p-2 align-items-center justify-content-between" onDoubleClick={() => props.OpenFolder(val.id, val.name)}>
                                        <div className='d-flex align-items-center'>
                                            <i className="las la-wallet"></i> <p className="font-weight-bold"> {val.name} </p>
                                        </div>
                                        <div className="Drive_Icon">
                                            <i className="las la-ellipsis-v mr-0"
                                                onClick={() => props.ShowChangesMenuDiv1("Show_Changes_Menu-1" + index)}
                                            ></i>
                                            <div
                                                style={{ top: '5%', right: '100%', width: '150px' }}
                                                className={"Show_Changes_Menu Show_Changes_Menu-1" + index}>
                                                    <div className="DropDown_Drive_Menu">
                                                    <div className="d-flex align-items-center my-2 px-3 py-1" onClick={() => props.OpenFolder(val.id, val.name)}>
                                                        <i className="las la-share"></i>
                                                        <p>Open</p>
                                                    </div>
                                                    <div className="d-flex align-items-center my-2 px-3 py-1" onClick={() => props.DeleteDoc(index, 'folder')}>
                                                        <i className="las la-trash-alt"></i>
                                                        <p>Delete</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )

                        }
                                )
                        }
                    </div>
                </>
                :
                null
            }
        </>
    );
}
)

export default Folders;