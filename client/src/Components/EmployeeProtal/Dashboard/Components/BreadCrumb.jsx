import React from 'react';
import { Link } from 'react-router-dom';

const BreadCrumb = ({ links, currentLabel }) => {
    return (
        <nav aria-label="breadcrumb" style={{ fontFamily: 'sans-serif', fontSize: '13px' }}>
            <ol className="breadcrumb">
                {
                    links.map(
                        ( val, index ) => {
                            return <li key={index} className="breadcrumb-item"><Link className='clickable' to={ val.href }>{ val.label }</Link></li>
                        }
                    )
                }
                <li className="breadcrumb-item active" aria-current="page">{ currentLabel }</li>
            </ol>
        </nav>
    )
}

export default BreadCrumb;