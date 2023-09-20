import React from 'react';

import './ChatDrive.css';
import InsteadImg from '../../../../../../images/not found.png';

function ChatDrive( props ) {
    return (
        <div>
            <div className="Chat_Employee_Drive_Grid" >
                {
                    props.Drive.length === 0
                        ?
                        <>
                            {
                                props.Loading
                            }
                        </>
                        :
                        props.Drive.map(
                            (val, index) => {

                                let icon = null;
                                let title = null;

                                if (val.doc_type) {
                                    if (
                                        val.doc_type.toLowerCase() === 'jpeg' ||
                                        val.doc_type.toLowerCase() === 'jpg' ||
                                        val.doc_type.toLowerCase() === 'png' ||
                                        val.doc_type.toLowerCase() === 'gif'
                                    ) {
                                        icon = <i className="lar la-image"></i>
                                        title = <img src={
                                            val.doc_type ?
                                                val.doc_type.toLowerCase() === 'jpeg' ||
                                                    val.doc_type.toLowerCase() === 'jpg' ||
                                                    val.doc_type.toLowerCase() === 'png' ||
                                                    val.doc_type.toLowerCase() === 'gif'
                                                    ?
                                                    ('images/drive/' + val.name)
                                                    :
                                                    InsteadImg
                                                :
                                                null
                                        }
                                            alt="Image1"
                                        />
                                    } else

                                        if (
                                            val.doc_type.toLowerCase() === 'psd' ||
                                            val.doc_type.toLowerCase() === 'ai' ||
                                            val.doc_type.toLowerCase() === 'svg' ||
                                            val.doc_type.toLowerCase() === 'tiff'
                                        ) {
                                            icon = <i className="lab la-adobe"></i>
                                            title = <img src={
                                                val.doc_type ?
                                                    val.doc_type.toLowerCase() === 'jpeg' ||
                                                        val.doc_type.toLowerCase() === 'jpg' ||
                                                        val.doc_type.toLowerCase() === 'png' ||
                                                        val.doc_type.toLowerCase() === 'gif'
                                                        ?
                                                        ('images/drive/' + val.name)
                                                        :
                                                        InsteadImg
                                                    :
                                                    null
                                            }
                                                alt="Image1"
                                            />
                                        } else

                                            if (val.doc_type.toLowerCase() === 'html' || val.doc_type.toLowerCase() === 'htm' || val.doc_type.toLowerCase() === 'xml') {
                                                icon = <i className="lar la-file-code"></i>
                                                title = <iframe src={'images/drive/' + val.name} width="100%" height="500" title="description"></iframe>
                                            } else

                                                if (val.doc_type.toLowerCase() === 'css' || val.doc_type.toLowerCase() === 'scss' || val.doc_type.toLowerCase() === 'sass' || val.doc_type.toLowerCase() === 'less') {
                                                    icon = <i className="lab la-css3"></i>
                                                    title = <iframe src={'images/drive/' + val.name} width="100%" height="500" title="description"></iframe>
                                                } else

                                                    if (val.doc_type.toLowerCase() === 'js' || val.doc_type.toLowerCase() === 'jsx') {
                                                        icon = <i className="lab la-node-js"></i>
                                                        title = <iframe src={'images/drive/' + val.name} width="100%" height="500" title="description"></iframe>
                                                    } else

                                                        if (val.doc_type.toLowerCase() === 'php') {
                                                            icon = <i className="lab la-php"></i>
                                                            title = <iframe src={'images/drive/' + val.name} width="100%" height="500" title="description"></iframe>
                                                        } else

                                                            if (val.doc_type.toLowerCase() === 'pdf') {
                                                                icon = <i className="las la-file-pdf"></i>
                                                                title = <iframe src={'images/drive/' + val.name} width="100%" height="500" title="description"></iframe>
                                                            } else

                                                                if (
                                                                    val.doc_type.toLowerCase() === 'docx' ||
                                                                    val.doc_type.toLowerCase() === 'doc' ||
                                                                    val.doc_type.toLowerCase() === 'docm' ||
                                                                    val.doc_type.toLowerCase() === 'dotx' ||
                                                                    val.doc_type.toLowerCase() === 'dot'

                                                                ) {
                                                                    icon = <i className="las la-file-word"></i>
                                                                    title = <img src={
                                                                        val.doc_type ?
                                                                            val.doc_type.toLowerCase() === 'jpeg' ||
                                                                                val.doc_type.toLowerCase() === 'jpg' ||
                                                                                val.doc_type.toLowerCase() === 'png' ||
                                                                                val.doc_type.toLowerCase() === 'gif'
                                                                                ?
                                                                                ('images/drive/' + val.name)
                                                                                :
                                                                                InsteadImg
                                                                            :
                                                                            null
                                                                    }
                                                                        alt="Image1"
                                                                    />
                                                                } else

                                                                    if (
                                                                        val.doc_type.toLowerCase() === 'xlsx' ||
                                                                        val.doc_type.toLowerCase() === 'xlsm' ||
                                                                        val.doc_type.toLowerCase() === 'xltx' ||
                                                                        val.doc_type.toLowerCase() === 'xls' ||
                                                                        val.doc_type.toLowerCase() === 'xla'

                                                                    ) {
                                                                        icon = <i className="las la-file-excel"></i>
                                                                        title = <img src={
                                                                            val.doc_type ?
                                                                                val.doc_type.toLowerCase() === 'jpeg' ||
                                                                                    val.doc_type.toLowerCase() === 'jpg' ||
                                                                                    val.doc_type.toLowerCase() === 'png' ||
                                                                                    val.doc_type.toLowerCase() === 'gif'
                                                                                    ?
                                                                                    ('images/drive/' + val.name)
                                                                                    :
                                                                                    InsteadImg
                                                                                :
                                                                                null
                                                                        }
                                                                            alt="Image1"
                                                                        />
                                                                    } else

                                                                        if (
                                                                            val.doc_type.toLowerCase() === 'mov' ||
                                                                            val.doc_type.toLowerCase() === 'mp4' ||
                                                                            val.doc_type.toLowerCase() === 'avi' ||
                                                                            val.doc_type.toLowerCase() === 'flv' ||
                                                                            val.doc_type.toLowerCase() === 'mpeg' ||
                                                                            val.doc_type.toLowerCase() === 'wmv' ||
                                                                            val.doc_type.toLowerCase() === 'mpg'
                                                                        ) {
                                                                            icon = <i className="las la-video"></i>
                                                                            title = <video width="100%">
                                                                                <source src={'images/drive/' + val.name} type="video/mp4" />
                                                                                Your browser does not support the video tag.
                                                                            </video>
                                                                        } else {
                                                                            icon = <i className="las la-file"></i>
                                                                            title = <img src={
                                                                                val.doc_type ?
                                                                                    val.doc_type.toLowerCase() === 'jpeg' ||
                                                                                        val.doc_type.toLowerCase() === 'jpg' ||
                                                                                        val.doc_type.toLowerCase() === 'png' ||
                                                                                        val.doc_type.toLowerCase() === 'gif'
                                                                                        ?
                                                                                        ('images/drive/' + val.name)
                                                                                        :
                                                                                        InsteadImg
                                                                                    :
                                                                                    null
                                                                            }
                                                                                alt="Image1"
                                                                            />
                                                                        }
                                }

                                return (
                                    <>
                                        <div className={"Div1 Div1key" + index} key={index} onClick={() => props.SelectItem(index, 'Div1key' + index)} style={{ animationDelay: (0 + '.' + index).toString() + 's' }}>
                                            <div className="Div1_IMG" >
                                                {
                                                    title
                                                }
                                            </div>
                                            <div className="Employee_Drive_Text">
                                                <div>
                                                    <div className="pr-lg-2 pr-md-2 pr-sm-0">
                                                        {
                                                            icon
                                                        }
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-weight-bold mb-0"> {val.name ? val.name.split('/').pop().substring(0, 35) : null} </p>
                                                    {/* <p className='mb-0'>you uploaded it past week</p> */}
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
    );
}

export default ChatDrive;