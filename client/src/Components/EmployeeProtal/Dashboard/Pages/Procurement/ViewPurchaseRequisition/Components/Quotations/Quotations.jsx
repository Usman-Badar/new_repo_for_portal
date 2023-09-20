import React, { useEffect, useState } from 'react';

// IMPORT CSS
import './Quotations.css';

const Quotations = (props) => {

    const [AttachQuotations, setAttachQuotations] = useState([]); // FOR ATTACH QUOTATIONS
    const [List, setList] = useState([]); // FOR ATTACH QUOTATIONS
    const [QuotationPreview, setQuotationPreview] = useState([]); // FOR QUOTATION PREVIEW

    useEffect(
        () => {

            setAttachQuotations(props.AttachQuotations);
            setQuotationPreview(props.QuotationPreview);
            setList(props.List);

        }, [props.AttachQuotations, props.QuotationPreview, props.List]
    )

    return (
        <div className="AttachedQuotations">

            {/* FOR ATTACH QUOTATIONS */}
            <div className="Attach">
                {
                    List[0]
                        ?
                        List[0].status === 'Viewed' || List[0].status === 'Sent'
                            ?
                            <>
                                <input type="file" onChange={props.onAttachQuotations} name="attachments" className="d-none" id="upload-quotations" multiple accept="image/*" />
                                <label className='label'> UPLOAD QUOTATIONS </label>
                                <label className="AttachContent" for="upload-quotations">
                                    <div>
                                        <i className="las la-file"></i>
                                        <p>Upload Quotations in image format</p>
                                    </div>
                                </label>
                            </>
                            :
                            null
                        :
                        null
                }
            </div>

            {/* FOR ATTACHMENT PREVIEW */}
            <div className="AttachmentPreview">
                <label className='label'> QUOTATIONS PREVIEW </label>
                <div className="Preview"
                    style={
                        {
                            backgroundImage: "url('" + (QuotationPreview.length > 0 ? QuotationPreview[0].image ? ('images/Inventory/pr_attachments/' + QuotationPreview[0].image) : URL.createObjectURL(QuotationPreview[0].file) : null) + "')"
                        }
                    }
                >
                    {
                        QuotationPreview.length === 0
                            ?
                            <p>No Quotation Selected</p>
                            :
                            null
                    }
                </div>
            </div>

            {/* QUOTATIONS */}
            <div className="QuotationsList">
                {
                    AttachQuotations.map(
                        (val, index) => {

                            let image;
                            if (val.image) {
                                image = 'images/Inventory/pr_attachments/' + val.image;
                            } else {
                                image = URL.createObjectURL(val.file)
                            }

                            return (

                                <div className="QuotationItem" key={index}>
                                    <div className="thumbnail"
                                        style={
                                            {
                                                backgroundImage: "url('" + image + "')"
                                            }
                                        }
                                    ></div>
                                    <div className="d-flex justify-content-between flex-column">
                                        <p className="font-weight-bold">IMage1.jpg</p>
                                        <div className="btn-group">
                                            <button className='btn btn-sm btn-light' onClick={() => props.PreviewQuotation(index)}>View</button>
                                            {
                                                List[0]
                                                    ?
                                                    List[0].status === 'Viewed' || List[0].status === 'Sent'
                                                        ?
                                                        <>
                                                            <button className='btn btn-sm btn-light' onClick={() => props.RemoveQuotation(index)}>Remove</button>
                                                        </>
                                                        :
                                                        null
                                                    :
                                                    null
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

export default Quotations;