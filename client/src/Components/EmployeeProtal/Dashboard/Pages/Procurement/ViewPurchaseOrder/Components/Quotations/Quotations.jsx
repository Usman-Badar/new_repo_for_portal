import React, { useEffect, useState } from 'react';

// IMPORT CSS
import './Quotations.css';

const Quotations = ( props ) => {

    const [ AttachQuotations, setAttachQuotations ] = useState([]); // FOR ATTACH QUOTATIONS
    const [ QuotationPreview, setQuotationPreview ] = useState([]); // FOR QUOTATION PREVIEW

    useEffect(
        () => {

            setAttachQuotations( props.AttachQuotations );
            setQuotationPreview( props.QuotationPreview );

        }, [ props.AttachQuotations, props.QuotationPreview ]
    )

    return (
        <div className="AttachedQuotations">

            {/* FOR ATTACH QUOTATIONS */}
            <div className="Attach"></div>
            
            {/* FOR ATTACHMENT PREVIEW */}
            <div className="AttachmentPreview">
                <label className='label'> QUOTATIONS PREVIEW </label>
                <div className="Preview"
                    style={
                        {
                            backgroundImage: "url('" + ( QuotationPreview.length > 0 ? QuotationPreview[0].image ? ( 'images/Inventory/pr_attachments/' + QuotationPreview[0].image ) : URL.createObjectURL( QuotationPreview[0].file ) : null ) + "')"
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
                        ( val, index ) => {

                            let image;
                            if ( val.image )
                            {
                                image = 'images/Inventory/pr_attachments/' + val.image;
                            }else
                            {
                                image = URL.createObjectURL( val.file )
                            }

                            return(

                                <div className="QuotationItem" key={ index }>
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
                                            <button className='btn btn-sm btn-light' onClick={ () => props.PreviewQuotation( index ) }>View</button>
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