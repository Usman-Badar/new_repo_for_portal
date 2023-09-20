import React, { useEffect, useState } from "react";
import AdminLogbookUI from './AdminLogbookUI';

import IMG from '../../../../images/img1.jpg';

import $ from 'jquery'

const AdminLogbook = () => {

    const [LogContext, setLogContext] = useState([]);

    useEffect(
        () => {

            setLogContext(
                [
                    {
                        id: 1,
                        imge: IMG,
                        Mainheading: 'Heading 1',
                        heading1: 'Heading1',
                        heading2: 'Heading2',
                        heading3: 'Heading3',
                        heading4: 'Heading4',
                        desc1: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document',
                        desc2: 'g on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is',
                    },
                    {
                        id: 2,
                        imge: IMG,
                        Mainheading: 'Heading 2',
                        heading1: 'Heading1',
                        heading2: 'Heading2',
                        heading3: 'Heading3',
                        heading4: 'Heading4',
                        desc1: ' publishers bundled the text with their software. Today its seen all around the web; on templates, websites,',
                        desc2: 'ne answered a curious reader, “Its ‘words’ loosely approximate the frequency with which letters occur in English, which is why at a glance it looks pretty real.',
                    },
                    {
                        id: 3,
                        imge: IMG,
                        Mainheading: 'Heading 3',
                        heading1: 'Heading1',
                        heading2: 'Heading2',
                        heading3: 'Heading3',
                        heading4: 'Heading4',
                        desc1: 'uisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit',
                        desc2: 'McClintocs eye for detail certainly helped narrow the whereabouts of lorem ipsums origin, however',
                    },
                    {
                        id: 4,
                        imge: IMG,
                        Mainheading: 'Heading 4',
                        heading1: 'Heading1',
                        heading2: 'Heading2',
                        heading3: 'Heading3',
                        heading4: 'Heading4',
                        desc1: 'Creation timelines for the standard lorem ipsum passage vary',
                        desc2: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document',
                    },
                ]
            );

        }, []


    )

    useEffect(
        () => {
            $('.ShowHideDiv').hide(0);
            $('.Buttondiv1').addClass('BottomColor');
            $('.Button1Data').show();
            $('.Button2Data').hide();
            $('.Button3Data').hide();
            $('.Mainheading').hide(0);
            $('.CopyTextdiv').hide();
        }
    )

    const ShowDIv = ( clasnm, clasnm1, clasnm2 ) => {
        $('.ShowHideDiv').hide(500);
        $('.' + clasnm).slideToggle(500);
        $('.HideMainHeading').fadeIn(500);
        $('.' + clasnm2).fadeOut(300);
        $('.Mainheading').fadeOut(500);
        $('.' + clasnm1).fadeIn(500);  

        
        
        $('.Button').removeClass('BottomColor');
        $('.Buttondiv' + 1).addClass('BottomColor');
        $('.Data').hide();
        $('.Button' + 1 + 'Data').show();
    }

    const ShowButton = ( index ) => {

        $('.Button').removeClass('BottomColor');
        $('.Buttondiv' + index).addClass('BottomColor');
        $('.Data').hide();
        $('.Button' + index + 'Data').show();

    }

    const showCopyTextdiv = () => {
        $('.CopyTextdiv').show();
        $('.CopyTextdiv').delay(1000).fadeOut('slow');
    }

    // const ShowButton2 = () => {
    //     $('.Buttondiv1').removeClass('BottomColor');
    //     $('.Buttondiv2').addClass('BottomColor');
    //     $('.Buttondiv3').removeClass('BottomColor');
    //     $('.Button1Data').hide();
    //     $('.Button2Data').show();
    //     $('.Button3Data').hide();
    // }

    // const ShowButton3 = () => {
    //     $('.Buttondiv1').removeClass('BottomColor');
    //     $('.Buttondiv2').removeClass('BottomColor');
    //     $('.Buttondiv3').addClass('BottomColor');
    //     $('.Button1Data').hide();
    //     $('.Button2Data').hide();
    //     $('.Button3Data').show();
    // }


    return (
        <>
            <AdminLogbookUI
                ShowDIv={ShowDIv}
                LogContext = { LogContext }
                // ShowButton1 ={ ShowButton1 }
                // ShowButton2 ={ ShowButton2 }
                // ShowButton3 ={ ShowButton3 }

                ShowButton={ ShowButton }
                showCopyTextdiv={ showCopyTextdiv }
            />
        </>
    )
}
export default AdminLogbook;