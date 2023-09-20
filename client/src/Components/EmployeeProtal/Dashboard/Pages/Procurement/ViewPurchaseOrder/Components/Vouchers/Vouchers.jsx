import React, { useEffect, useState } from 'react';

// IMPORT CSS
import './Vouchers.css';

const Vouchers = ( props ) => {

    const [ AttachVouchers, setAttachVouchers ] = useState([]); // FOR ATTACH VOUCHERS
    const [ Details, setDetails ] = useState([]); // FOR ATTACH VOUCHERS
    const [ VoucherPreview, setVoucherPreview ] = useState([]); // FOR VOUCHERS PREVIEW

    useEffect(
        () => {

            setAttachVouchers( props.AttachVouchers );
            setVoucherPreview( props.VoucherPreview );
            setDetails( props.Details );

        }, [ props.AttachVouchers, props.VoucherPreview, props.Details ]
    )

    return (
        <div className="AttachedVouchers">

            {/* FOR ATTACH VOUCHERS */}
            <div className="Attach">
                {
                    Details[0]
                    ?
                    Details[0].status === "Viewed" || Details[0].status === "Sent"
                    ?
                    <>
                        <input type="file" onChange={ props.onAttachVouchers } name="attachments" className="d-none" id="upload-vouchers" multiple accept="image/*" />
                        <label className='label'> UPLOAD VOUCHERS </label>
                        <label className="AttachContent" for="upload-vouchers">
                            <div>
                                <i className="las la-file"></i>
                                <p>Upload Vouchers in image format</p>
                            </div>
                        </label>
                    </>
                    :
                    null
                    :
                    <>
                        <input type="file" onChange={ props.onAttachVouchers } name="attachments" className="d-none" id="upload-vouchers" multiple accept="image/*" />
                        <label className='label'> UPLOAD VOUCHERS </label>
                        <label className="AttachContent" for="upload-vouchers">
                            <div>
                                <i className="las la-file"></i>
                                <p>Upload Vouchers in image format</p>
                            </div>
                        </label>
                    </>
                }
            </div>
            
            {/* FOR ATTACHMENT PREVIEW */}
            <div className="AttachmentPreview">
                <label className='label'> VOUCHER PREVIEW </label>
                <div className="Preview"
                    style={
                        {
                            backgroundImage: "url('" + ( VoucherPreview.length > 0 ? VoucherPreview[0].voucher ? ( 'images/Inventory/po_vouchers/' + VoucherPreview[0].voucher ) : URL.createObjectURL( VoucherPreview[0].file ) : null ) + "')"
                        }
                    }
                >
                    {
                        VoucherPreview.length === 0
                        ?
                        <p>No Voucher Selected</p>
                        :
                        null
                    }
                </div>
            </div>
            
            {/* VOUCHERS */}
            <div className="VouchersList">
                {
                    AttachVouchers.map(
                        ( val, index ) => {

                            let image;
                            if ( val.voucher )
                            {
                                image = 'images/Inventory/po_vouchers/' + val.voucher;
                            }else
                            {
                                image = URL.createObjectURL( val.file )
                            }

                            return(

                                <div className="VoucherItem" key={ index }>
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
                                            <button className='btn btn-sm btn-light' onClick={ () => props.PreviewVoucher( index ) }>View</button>
                                            {
                                                Details[0]
                                                ?
                                                Details[0].status === "Viewed" || Details[0].status === "Sent"
                                                ?
                                                <button className='btn btn-sm btn-light' onClick={ () => props.RemoveVoucher( index ) }>Remove</button>
                                                :
                                                null
                                                :
                                                <button className='btn btn-sm btn-light' onClick={ () => props.RemoveVoucher( index ) }>Remove</button>
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

export default Vouchers;