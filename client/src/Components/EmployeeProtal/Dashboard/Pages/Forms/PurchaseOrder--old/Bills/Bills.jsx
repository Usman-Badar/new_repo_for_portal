import React, { useEffect, useState } from 'react';

// IMPORT CSS
import './Bills.css';

const Bills = ( props ) => {

    const [ AttachBills, setAttachBills ] = useState([]); // FOR ATTACH BILLS
    const [ Details, setDetails ] = useState([]); // FOR ATTACH BILLS
    const [ BillPreview, setBillPreview ] = useState([]); // FOR BILLS PREVIEW

    useEffect(
        () => {

            setAttachBills( props.AttachBills );
            setBillPreview( props.BillPreview );
            setDetails( props.Details );

        }, [ props.AttachBills, props.BillPreview, props.Details ]
    )

    return (
        <div className="AttachedBills">

            {/* FOR ATTACH BILLS */}
            <div className="Attach">
                {
                    Details[0]
                    ?
                    Details[0].status === "Viewed" || Details[0].status === "Sent"
                    ?
                    <>
                        <input type="file" onChange={ props.onAttachBills } name="attachments" className="d-none" id="upload-bills" multiple accept="image/*" />
                        <label className='label'> UPLOAD BILLS </label>
                        <label className="AttachContent" for="upload-bills">
                            <div>
                                <i className="las la-file"></i>
                                <p>Upload Bills in image format</p>
                            </div>
                        </label>
                    </>
                    :
                    null
                    :
                    <>
                        <input type="file" onChange={ props.onAttachBills } name="attachments" className="d-none" id="upload-bills" multiple accept="image/*" />
                        <label className='label'> UPLOAD BILLS </label>
                        <label className="AttachContent" for="upload-bills">
                            <div>
                                <i className="las la-file"></i>
                                <p>Upload Bills in image format</p>
                            </div>
                        </label>
                    </>
                }
            </div>
            
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
                                            {
                                                Details[0]
                                                ?
                                                Details[0].status === "Viewed" || Details[0].status === "Sent"
                                                ?
                                                <button className='btn btn-sm btn-light' onClick={ () => props.RemoveBill( index ) }>Remove</button>
                                                :
                                                null
                                                :
                                                <button className='btn btn-sm btn-light' onClick={ () => props.RemoveBill( index ) }>Remove</button>
                                            }
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