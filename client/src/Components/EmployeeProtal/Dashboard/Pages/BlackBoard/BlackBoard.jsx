import React, { useEffect, useState } from 'react';
import './BlackBoard.css';
import $ from 'jquery';
import VID from '../../../../../images/vid1.mp4';
import VID1 from '../../../../../images/vid2.mp4';
import VID2 from '../../../../../images/vid3.mp4';
import Menu from '../../../../UI/Menu/Menu';

import axios from '../../../../../axios';
import ReactTooltip from 'react-tooltip';

const BlackBoard = () => {
    
    const [Courses, setCourses] = useState([]);
    const [EnrolledCourses, setEnrolledCourses] = useState([]);
    const [CourseName, setCourseName] = useState('');
    const [Videos, setVideos] = useState([]);
    const [Categories, setCategories] = useState([]);
    const [SelectedRow, setSelectedRow] = useState([]);
    const [Data, setData] = useState([]);
    const [TotalViewed, setTotalViewed] = useState();
    const [Index1, setIndex1] = useState();
    const [Index2, setIndex2] = useState();

    useEffect(
        () => {

            axios.get('/allcourses').then( res => {

                setCourses( res.data );

            } ).catch( err => {

                console.log( err );

            } );

            $('.BlackBoard').hide(0);

            setData(
                [
                    {
                        icon: 'las la-video',
                        txt: 'Courses',
                        link: false,
                        func: () => ShowMoreVideos()
                    },
                    {
                        icon: 'las la-graduation-cap',
                        txt: 'Enrolled',
                        link: false,
                        func: () => ShowBlackboard()
                    },
                    {
                        icon: 'las la-play',
                        txt: 'Play List',
                        link: false, // || true
                        func: () => ShowPlayList()
                    }
                ]
            )

        }, []


    )
    useEffect(
        () => {
            if (window.location.href.split('/').pop() === 'BlackBoard_Videos') {
                $('.Menu_Grid').hide(0);
                $('.Menu_Grid').parent('.Menu').css('padding', '0');
            }
            $('.BlackBoard_Videos1').hide(0);
            // $('.Courses_Available').hide(0);
        }, []
    )

    const GetPercentage = () => {

        let marks = 0;
            let div = 0;
            for (let x = 0; x < arr.length; x++) {
                for (let y = 0; y < arr[x].Topics.length; y++) {
                    div = div + 1;
                    marks = marks + arr[x].Topics[y].mark;
                }
            }
        let TotalMarks = marks / div * 100;
        setTotalViewed(TotalMarks.toString().substring(0, 4));

    }

    const arr = [
        {
            id: 1,
            TopicHeading: 'Welcome',
            Topics: [
                {
                    id: 1,
                    title: 'Fundamentals Of MSOffice',
                    video: VID,
                    mark: 1
                },
            ]
        },
        {
            id: 2,
            TopicHeading: 'Introduction',
            Topics: [
                {
                    id: 1,
                    title: 'Setup Your Work Station',
                    video: VID,
                    mark: 1
                },
                {
                    id: 2,
                    title: 'Hello World',
                    video: VID1,
                    mark: 0
                },
                {
                    id: 3,
                    title: 'Understanding Errors',
                    video: VID2,
                    mark: 1
                },
            ]
        },
        {
            id: 3,
            TopicHeading: 'Introduction',
            Topics: [
                {
                    id: 1,
                    title: 'Setup Your Work Station',
                    video: VID,
                    mark: 1
                },
                {
                    id: 2,
                    title: 'Hello World',
                    video: VID,
                    mark: 0
                },
                {
                    id: 3,
                    title: 'Understanding Errors',
                    video: VID,
                    mark: 1
                },
                {
                    id: 4,
                    title: 'Setup Your Work Station',
                    video: VID,
                    mark: 0
                },
                {
                    id: 5,
                    title: 'Hello World',
                    video: VID,
                    mark: 0
                },
                {
                    id: 6,
                    title: 'Understanding Errors',
                    video: VID,
                    mark: 0
                },
                {
                    id: 7,
                    title: 'Understanding Errors',
                    video: VID,
                    mark: 0
                },
            ]
        }
    ]

    const Show = (classnm, index) => {
        $('.' + classnm).slideToggle();
        if ($('.BlackBoard_Videos .Content_Div .las' + index).hasClass('la-angle-down')) {
            $('.BlackBoard_Videos .Content_Div .las' + index).removeClass('la-angle-down');
            $('.BlackBoard_Videos .Content_Div .las' + index).addClass('la-angle-up');
        } else {
            $('.BlackBoard_Videos .Content_Div .las' + index).removeClass('la-angle-up');
            $('.BlackBoard_Videos .Content_Div .las' + index).addClass('la-angle-down');
        }
    }
    const HelpDetails = (index, index2, id) => {
        setIndex1(index);
        setIndex2(index2);

        setSelectedRow([Videos[index2]]);
        PlayVideo();

        if (window.outerWidth < 992) {
            $('.BlackBoard_Videos1').show();
            $('.Courses_Content').toggle();
        } else {
            $('.BlackBoard_Videos1').show();
        }

        // const Data = new FormData();
        // Data.append( 'courseID', id );
        // axios.post('/videoseened', Data).then( res => {

        // } ).catch( err => {

        //     console.log( err );

        // } );
    }

    const PlayVideo = () => {

        let video = document.getElementById("playedVideo");

        let timeStarted = -1;
        let timePlayed = 0;
        let duration = 0;
        // If video metadata is laoded get duration
        if (video.readyState > 0)
            getDuration.call(video);
        //If metadata not loaded, use event to get it
        else {
            video.addEventListener('loadedmetadata', getDuration);
        }
        // remember time user started the video
        function videoStartedPlaying() {
            timeStarted = new Date().getTime() / 1000;
        }
        function videoStoppedPlaying(event) {
            // Start time less then zero means stop event was fired vidout start event
            if (timeStarted > 0) {
                let playedFor = new Date().getTime() / 1000 - timeStarted;
                timeStarted = -1;
                // add the new number of seconds played
                timePlayed += playedFor;
            }
            document.getElementById("played").innerHTML = Math.round(timePlayed) + "";
            // Count as complete only if end of video was reached
            if (timePlayed >= duration && event.type == "ended") {
                document.getElementById("status").className = "complete";
            }
        }

        function getDuration() {
            duration = video.duration;
            document.getElementById("duration").appendChild(new Text(Math.round(duration) + ""));
            console.log("Duration: ", duration);
        }

        video.addEventListener("play", videoStartedPlaying);
        video.addEventListener("playing", videoStartedPlaying);

        video.addEventListener("ended", videoStoppedPlaying);
        video.addEventListener("pause", videoStoppedPlaying);

    }


    const ShowBlackboardVideos = ( id, index ) => {

        const Data = new FormData();
        // Data.append( 'empID', localStorage.getItem('EmpID') );
        Data.append( 'courseID', id );
        axios.post('/getempenrolledcoursevideos', Data).then( res => {

            let categories = [];
            for ( let x = 0; x < res.data.length; x++ )
            {
                categories.push(res.data[x].category_name);
            }
            setCategories( categories );
            setVideos( res.data );
            setCourseName(EnrolledCourses[index].course_name);

            $('.BlackBoard_Videos').show();
            $('.BlackBoard').hide();
            $('.Courses_Available').hide();
            $('.divshow').hide();

        } ).catch( err => {

            console.log( err );

        } );
        
    }
    const ShowBlackboard = () => {

        const Data = new FormData();
        Data.append( 'empID', localStorage.getItem('EmpID') )
        axios.post('/getempenrolledcourses', Data).then( res => {

            setEnrolledCourses( res.data );

            $('.BlackBoard_Videos').hide();
            $('.BlackBoard').show();
            $('.Courses_Available').hide();

        } ).catch( err => {

            console.log( err );

        } );

    }
    const ShowMoreVideos = () => {

        $('.BlackBoard_Videos').hide();
        $('.BlackBoard').hide();
        $('.Courses_Available').show();
    }

    const ShowPlayList = () => {

        $('.Courses_Content').toggle();
        $('.BlackBoard_Videos1').hide();

    }

    return (
        <>
            <Menu data={ Data } />
            <div className="Courses_Available">
                {/* <div className="BacktoBlackboard" style={{ fontSize: "25px" }} onClick={ShowBlackboard}><i class="las la-arrow-left"></i></div> */}
                <div className="Courses_Available_Data">
                    <h1 className="mb-5">Black Board Courses</h1>
                    <div className="Courses_Cards">
                        {
                            Courses.map(
                                (val, index) => {
                                    return (
                                        <>
                                            <div className="DIV border" key={ index } style={ { animationDelay: ( 0 + '.' + index ).toString() + 's' } }>
                                                <div className="IMAGE" style={{ backgroundImage: "url('images/courses/" + val.course_image + "')" }}>
                                                    <div className="Rect">
                                                        <p className="mb-0 font-weight-bolder">JOIN THIS COURSE</p>
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-center align-items-center w-100 Boxes">
                                                    <h4>{val.course_name}</h4>
                                                </div>
                                            </div>
                                        </>
                                    )
                                }
                            )
                        }
                    </div>
                </div>
            </div>
            <div className="BlackBoard">
                <div className="BlackBoard_Data">
                    <div className="Data">
                        <div className="Data_Grid mb-5">
                            <div><h1 className="mb-0">My Courses</h1></div>
                            <div className="d-flex align-items-center">
                                <input type="Search" className="form-control" placeholder="Search Courses" />
                                <button className="btn"><i class="las la-search"></i></button>
                            </div>
                        </div>
                        <div className="Courses_Cards">
                            {
                                EnrolledCourses.map(
                                    ( val, index ) => {

                                        return (
                                            <div className="DIV border" key={ index } style={ { animationDelay: ( 0 + '.' + index ).toString() + 's' } }>
                                                <div className="IMAGE" style={ { backgroundImage: "url('images/courses/" + val.course_image + "')" } }>
                                                    <div className="Circle">
                                                        <p className="mb-0">{val.seened}</p>
                                                    </div>
                                                </div>
                                                <div className="d-flex w-100 Boxes">
                                                    <div className="d-flex justify-content-center align-items-center w-100 border-right py-4" data-tip data-for={ "registerTip" + index }>
                                                        <div className="d-block text-center">
                                                            <i class="lar la-calendar-alt"></i>
                                                            <p className="mb-0">Enrolled</p>
                                                        </div>
                                                        <ReactTooltip id={ "registerTip" + index } place="top">
                                                            Date: { val.enrolled_date.substring(0,10) } <br />
                                                            time: { val.enrolled_time }
                                                        </ReactTooltip>
                                                    </div>
                                                    <div className="d-flex justify-content-center align-items-center w-100 py-4" onClick={() => ShowBlackboardVideos( val.course_id, index )}>
                                                        <div className="d-block text-center">
                                                            <i class="las la-play"></i>
                                                            <p className="mb-0">Continue Course</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )

                                    }
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="BlackBoard_Videos">
                <div className="Courses_Content">
                    <div className="Content_Div">
                        <div className="Course_heading">
                            <h4 className="font-weight-bolder">{ CourseName }</h4>
                            <div className="progress mt-3" style={{ height: "3px" }}>
                                <div className="progress_bar" style={{ width: TotalViewed + '%', backgroundColor: "black" }} role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                            <p className="Views_per">{TotalViewed}%</p>
                        </div>
                        {
                            Categories.map(
                                (value, index) => {

                                    let videos = [];
                                    for ( let x = 0; x < Videos.length; x++ )
                                    {
                                        if ( Videos[x].category_name === value )
                                        {
                                            if (Videos[x].video !== null) 
                                            {
                                                videos.push(1);
                                            }
                                        }
                                    }

                                    return (<>
                                        <div className="d-flex align-items-center justify-content-between py-4 px-2 status" style={{ cursor: "pointer" }} onClick={() => Show("divshow" + index, index)}>
                                            <p className="font-weight-bolder">{value}</p>
                                            <p>{videos.length === 0 ? 'No video' : videos.length === 1 ? videos.length + ' video' : videos.length + ' videos'} <i className={ "las la-angle-down las" + index }></i></p>
                                        </div>
                                        <div className={"divshow divshow" + index}>
                                            {
                                                Videos.map(
                                                    (val, index2) => {

                                                        return (
                                                            <>
                                                                {
                                                                    val.category_name === value
                                                                    ?
                                                                        val.video !== null
                                                                            ?
                                                                            <div className={"Showdiv" + " Showdiv" + index2} onClick={() => HelpDetails(index, index2, val.course_id)} >
                                                                                <div className="d-flex justify-content-center align-items-center">
                                                                                    <p>{val.status === 'Completed' ? <i class="las la-check-circle mr-1" style={{ fontSize: "25px" }}></i> : <i class="las la-circle mr-1" style={{ fontSize: "25px" }}></i>} </p>
                                                                                    <div> <p>{val.video_name}</p>
                                                                                        <div className="d-flex align-items-center m-0 p-0">
                                                                                            <p style={{ fontSize: "12px" }}>Video</p>
                                                                                            <i class="las la-video pl-2" style={{ fontSize: "15px" }}></i>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div><i class="las la-long-arrow-alt-right" style={{ fontSize: "25px", textAlign: "right" }}></i></div>
                                                                            </div>
                                                                            :
                                                                            <div className={"Showdiv" + " Showdiv" + index2}>
                                                                                <p className="mb-0 py-3 pl-3">
                                                                                    No Video Found
                                                                                </p>
                                                                            </div>
                                                                    :
                                                                        null
                                                                }
                                                            </>
                                                        )
                                                    }
                                                )
                                            }
                                        </div>
                                    </>
                                    )
                                }
                            )
                        }
                    </div>
                </div>
                <div className="BlackBoard_Videos1">
                    <div className="d-flex align-items-center justify-content-center" style={{ padding: "20px 0" }}>
                        <div className="d-block text-center">
                            <h1 className="font-weight-bolder"> {SelectedRow.length > 0 ? SelectedRow[0].title : null} </h1>
                        </div>
                    </div>
                    <div className="BlackBoard_Videos1_grid">
                        {
                            <div>
                                <video id="playedVideo" src={SelectedRow.length > 0 ? 'images/courses/' + SelectedRow[0].video : null} controls="controls" autoPlay="true" type="video/mp4"></video>
                                <div id="status" class="incomplete">
                                    <span>Play status: </span>
                                    <span class="status complete">COMPLETE</span>
                                    <span class="status incomplete">INCOMPLETE</span>
                                    <br />
                                </div>
                                <div>
                                    <span id="played">0 </span> seconds out of <span id="duration"> </span> seconds. (only updates when the video pauses)
                                </div>
                            </div>
                        }
                    </div>
                    <div className="d-flex align-items-center justify-content-end mt-4">
                        {/* <button className="btn" onClick={() => HelpDetails(Index1 + 1, Index2)} >Continue  <i class="las la-arrow-right ml-1" style={{ fontSize: "16px" }}></i></button> */}
                    </div>
                </div>
            </div>
            
        </>
    )
}
export default BlackBoard;