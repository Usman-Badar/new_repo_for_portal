import React from 'react';
import './UI.css';

const UI = () => {

    return (
        <div className='Inward'>

            <div className='gridContainer'>

                <form>
                    <div className='divs'>

                        <h5>
                            STOCK INWARD ENTRY
                        </h5>

                        {/* <div className='formGrid'>

                            <div className='itemListContainer'>
                                <label>Item</label>
                                <input type="text" className='form-control form-control-sm' name="" value={''} required />
                                <div className='list'></div>
                            </div>
                            
                            <div>
                                <label>Quantity</label>
                                <input type="number" className='form-control form-control-sm' name="" value={''} required />
                            </div>

                        </div> */}

                        <table className="table table-sm mt-4">

                            <tr className="bg-light">

                                <th>Sr No.</th>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Reason / Details</th>
                                                                            
                            </tr>

                        </table>

                        <label>Note</label>
                        <textarea type="text" className='form-control form-control-sm' name="" value={''} required />

                    </div>
                </form>

                <div>
                    <div className='divs'></div>
                </div>

            </div>            

        </div>
    )

}

export default UI;