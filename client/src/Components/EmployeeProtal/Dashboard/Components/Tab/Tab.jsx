/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

const Tab = ({ Arr }) => {
    return (
        <ul className="nav nav-tabs">
            <li className="nav-item">
                <a className="nav-link active text-capitalize">all</a>
            </li>
            {
                Arr.map(
                    (status, index) => {
                        return (
                            <li className="nav-item" key={index}>
                                <a className="nav-link text-capitalize">{status}</a>
                            </li>
                        )
                    }
                )
            }
        </ul>
    )
}

export default Tab;