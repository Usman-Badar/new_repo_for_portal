import React, { useEffect, useState } from 'react';

// IMPORT CSS
import './Bills.css';

const Bills = ( props ) => {

    const [ AttachBills, setAttachBills ] = useState([]); // FOR ATTACH BILLS
    const [ BillPreview, setBillPreview ] = useState([]); // FOR BILLS PREVIEW

    useEffect(
        () => {

            setAttachBills( props.AttachBills );
            setBillPreview( props.BillPreview );

        }, [ props.AttachBills, props.BillPreview ]
    )

    return (
        <div className="AttachedBills">

            {/* FOR ATTACH BILLS */}
            <div className="Attach"></div>
            
            {/* FOR ATTACHMENT PREVIEW */}
            <div className="AttachmentPreview">
                <label className='label'> BILLS PREVIEW </label>
                <div className="Preview"
                    style={
                        {
                            backgroundImage: "url('" + ( BillPreview.length > 0 ? BillPreview[0].image ? ( 'images/Inventory/po_attachments/' + BillPreview[0].image ) : URL.createObjectURL( BillPreview[0].file ) : null ) + "')"
                        }
                    }
                >
                    {
                        BillPreview.length === 0
                        ?
                        <p>No Bill Selected</p>
                        :
                        null
                    }
                </div>
            </div>
            
            {/* BILLS */}
            <div className="BillsList">
                {
                    AttachBills.map(
                        ( val, index ) => {

                            let image;
                            if ( val.image )
                            {
                                image = 'images/Inventory/po_attachments/' + val.image;
                            }else
                            {
                                image = URL.createObjectURL( val.file )
                            }

                            return(

                                <div className="BillItem" key={ index }>
                                    <div className="thumbnail"
                                        style={
                                            {
                                                backgroundImage: "url('" + image + "')"
                                            }
                                        }
                                    ></div>
                                    <div className="d-flex justify-content-between flex-column">
                                        <p className="font-weight-bold">{ val.name }</p>
                                        <div className="btn-group">
                                            <button className='btn btn-sm btn-light' onClick={ () => props.PreviewBill( index ) }>View</button>
                                        </div>
                                    </div>
                                </div>

                            )

                        }
                    )
                }
            </div>

        </div>
    );
}

export default Bills;