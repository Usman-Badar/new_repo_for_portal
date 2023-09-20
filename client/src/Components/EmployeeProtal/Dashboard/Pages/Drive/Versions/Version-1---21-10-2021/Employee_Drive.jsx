import React from 'react';
import './Employee_Drive.css';
import IMG from '../../../../../images/no-user.png';
import IMG1 from '../../../../../images/no-user.png';
import IMG2 from '../../../../../images/no-user.png';

const Employee_Drive = () => {

    return (
        <>
            <div className="Employee_Drive">
                <h5>Recent Upload</h5>
                <div className="Employee_Drive_Grid" >
                    <div className="Div1">
                        <img src={IMG} alt="Image1" />
                        <div className="p-3">
                            <p className="font-weight-bold"> Picture name img1 </p>
                            <p>you uploaded it past week</p>
                        </div>
                    </div>
                    <div className="Div1" >
                        <img src={IMG1} alt="Image1" />
                        <div className="p-3">
                            <p className="font-weight-bold"> Picture name img1 </p>
                            <p>you uploaded it past week</p>
                        </div>
                    </div>
                    <div className="Div1">
                        <img src={IMG2} alt="Image1" />
                        <div className="p-3">
                            <p className="font-weight-bold"> Picture name img1 </p>
                            <p>you uploaded it past week</p>
                        </div>
                    </div>
                    <div className="Div1" >
                        <img src={IMG} alt="Image1" />
                        <div className="p-3">
                            <p className="font-weight-bold"> Picture name img1 </p>
                            <p>you uploaded it past week</p>
                        </div>
                    </div>
                    <div className="Div1" >
                        <img src={IMG1} alt="Image1" />
                        <div className="p-3">
                            <p className="font-weight-bold"> Picture name img1 </p>
                            <p>you uploaded it past week</p>
                        </div>
                    </div>
                    <div className="Div1">
                        <img src={IMG2} alt="Image1" />
                        <div className="p-3">
                            <p className="font-weight-bold"> Picture name img1 </p>
                            <p>you uploaded it past week</p>
                        </div>
                    </div>
                </div>
                <h5 className="pt-2">Folders</h5>
                <div className="Employee_Drive_Grid" >
                    <div className="Div1 d-flex p-3">
                        <i class="las la-wallet"></i> <p className="font-weight-bold"> Folder1 </p>
                    </div>
                </div>
                <h5 className="pt-2">Files</h5>
                <div className="Employee_Drive_Grid" >
                    <div className="Div1">
                        <img src={IMG} alt="Image1" />
                        <div className="p-3">
                            <p className="font-weight-bold"> Picture name img1 </p>
                            <p>you uploaded it past week</p>
                        </div>
                    </div>
                    <div className="Div1" >
                        <img src={IMG1} alt="Image1" />
                        <div className="p-3">
                            <p className="font-weight-bold"> Picture name img1 </p>
                            <p>you uploaded it past week</p>
                        </div>
                    </div>
                    <div className="Div1">
                        <img src={IMG2} alt="Image1" />
                        <div className="p-3">
                            <p className="font-weight-bold"> Picture name img1 </p>
                            <p>you uploaded it past week</p>
                        </div>
                    </div>
                    <div className="Div1" >
                        <img src={IMG} alt="Image1" />
                        <div className="p-3">
                            <p className="font-weight-bold"> Picture name img1 </p>
                            <p>you uploaded it past week</p>
                        </div>
                    </div>
                    <div className="Div1" >
                        <img src={IMG1} alt="Image1" />
                        <div className="p-3">
                            <p className="font-weight-bold"> Picture name img1 </p>
                            <p>you uploaded it past week</p>
                        </div>
                    </div>
                    <div className="Div1">
                        <img src={IMG2} alt="Image1" />
                        <div className="p-3">
                            <p className="font-weight-bold"> Picture name img1 </p>
                            <p>you uploaded it past week</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Employee_Drive;
