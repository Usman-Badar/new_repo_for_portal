import React, { useState } from "react";
import './AdminLogbookUI.css';

import { CopyToClipboard } from 'react-copy-to-clipboard';

const AdminLogbookUI = (props) => {
    const [value, setValue] = useState("My copy text");
    const [copied, setCopied] = useState(false);
    return (
        <>
            <div className="AdminLogbookUI">
                <div className="AdminLogbookDiv">
                    <h1>Getting started</h1>
                    {
                        props.LogContext.map(
                            (val, index) => {
                                return (
                                    <>
                                        <div className="LogbookDIv my-2">
                                            <div className="d-flex">
                                                <div className="SnoCircle" onClick={() => props.ShowDIv("ShowHideDiv" + index, "Mainheading" + index, 'HideMainHeading' + index)} ><p>{val.id}</p></div>
                                                <div className={"HideMainHeading HideMainHeading" + index}><h3>{val.Mainheading}</h3></div>
                                                <div className={"Mainheading Mainheading" + index}><h3>{val.Mainheading}</h3></div>
                                            </div>
                                            <div className={"ShowHideDiv ShowHideDiv" + index}>
                                                <div className="SnoLine mt-2"></div>
                                                <div className="">
                                                    <div className="d-flex mb-2">
                                                        <div className="Button Buttondiv Buttondiv1" onClick={() => props.ShowButton(1)}> <p>Button 1</p></div>
                                                        <div className="Button Buttondiv Buttondiv2" onClick={() => props.ShowButton(2)}> <p>Button 2</p></div>
                                                        <div className="Button Buttondiv Buttondiv3" onClick={() => props.ShowButton(3)}> <p>Button 3</p></div>
                                                    </div>
                                                    <div className="Data Button1Data">
                                                        <h3>{val.heading1}</h3>
                                                        <div className="d-flex justify-content-between">
                                                            <p> {val.desc1}</p>
                                                            <CopyToClipboard
                                                                options={{ debug: props.debug, message: val.desc2 }}
                                                                text={val.desc2}
                                                                onCopy={() => setCopied(true)}
                                                            >
                                                                <div className="d-flex">
                                                                    <div className="CopyTextdiv"><p>Copied to Clipboard</p></div>
                                                                    <div className="CopyIcon" onClick={props.showCopyTextdiv}><i class="las la-copy"></i></div>
                                                                </div>
                                                            </CopyToClipboard>
                                                            {/* {copied ? <span>Copied.</span> : null} */}
                                                        </div>
                                                        <div className="CopyTextarea">
                                                            <p value={val.desc2}
                                                                onChange={(e) => {
                                                                    setValue(e.target.value);
                                                                    setCopied(false);
                                                                }}>{val.desc2}</p>
                                                        </div>
                                                        <h3>{val.heading2}</h3>
                                                        <p>{val.desc2}</p>
                                                    </div>
                                                    <div className="Data Button2Data">
                                                        <h3>{val.heading3}</h3>
                                                        <p>{val.desc1}</p>
                                                        <h3>{val.heading4}</h3>
                                                        <p>{val.desc2}</p>
                                                    </div>
                                                    <div className="Data Button3Data">
                                                        <div className="d-flex py-3">
                                                            <img src={val.imge} alt="" style={{ width: '300px', height: '300px' }} />
                                                            <div className="px-4">
                                                                <h3>{val.heading4}</h3>
                                                                <p>{val.desc2}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )
                            }
                        )
                    }
                </div>
            </div>
        </>
    )
}
export default AdminLogbookUI;