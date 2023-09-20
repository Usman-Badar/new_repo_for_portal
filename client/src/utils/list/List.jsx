import React from 'react';

const FetchedList = ({ headColumns, small, additionalClasses }) => {
    return (
        <>
            <table className={ "table " + (small ? "table-sm " : " ") + ( additionalClasses?additionalClasses:"" ) }>
                <thead>
                    <tr>
                        {
                            headColumns.map(
                                ( { text, colSpan }, index ) => {
                                    return <th key={index} colSpan={colSpan?colSpan:1}>{text}</th>
                                }
                            )
                        }
                    </tr>
                </thead>
            </table>
        </>
    )
}

export default FetchedList;