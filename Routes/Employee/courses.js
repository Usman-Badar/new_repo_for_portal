const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/allcourses', ( req, res ) => {

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {
                res.status(503).send(err);
                res.end();
            }else
            {
                connection.query(
                    "SELECT * FROM emp_courses",
                    ( err, rslt ) => {
            
                        if( err )
                        {

                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {

                            res.send( rslt );
                            res.end();
                            connection.release();
            
                        }
            
                    }
                )
            }

        }
    )

} );

router.post('/getempenrolledcourses', ( req, res ) => {

    const { empID } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT ADDDATE(emp_enrolled_in_course.enrolled_date, INTERVAL 1 DAY) `enrolled_date`, emp_enrolled_in_course.enrolled_time, emp_enrolled_in_course.seened, emp_enrolled_in_course.status, emp_courses.* \
                    FROM `emp_enrolled_in_course` \
                    RIGHT OUTER JOIN employees ON employees.emp_id = emp_enrolled_in_course.emp_id  \
                    LEFT OUTER JOIN emp_courses ON emp_courses.course_id = emp_enrolled_in_course.course_id  \
                    WHERE employees.emp_id = " + empID,
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
                            
                            res.send( rslt );
                            res.end();
                            connection.release();
            
                        }
            
                    }
                )
            }

        }
    )

} );

router.post('/getempenrolledcoursevideos', ( req, res ) => {

    const { courseID } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                
                res.status(503).send(err);
                res.end();
                
            }else
            {
                connection.query(
                    // "SELECT emp_course_categories.category_name, emp_courses.course_name, emp_course_videos.* \
                    // FROM emp_courses \
                    // LEFT OUTER JOIN emp_course_categories ON emp_courses.course_id = emp_course_categories.course_id \
                    // LEFT OUTER JOIN emp_course_videos ON emp_course_categories.cc_id = emp_course_videos.cc_id \
                    // WHERE emp_courses.course_id = " + courseID,
                    "SELECT \
                    emp_course_categories.category_name, \
                    emp_courses.course_name, \
                    emp_course_videos.*, \
                    emp_enrolled_in_course_videos.video_duration, \
                    emp_enrolled_in_course_videos.video_seen, \
                    emp_enrolled_in_course_videos.status \
                    FROM emp_courses  \
                    LEFT OUTER JOIN emp_course_categories ON emp_courses.course_id = emp_course_categories.course_id  \
                    LEFT OUTER JOIN emp_course_videos ON emp_course_categories.cc_id = emp_course_videos.cc_id \
                    LEFT OUTER JOIN emp_enrolled_in_course_videos ON emp_course_videos.v_id = emp_enrolled_in_course_videos.v_id  \
                    WHERE emp_courses.course_id = " + courseID,
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
                            
                            res.send( rslt );
                            res.end();
                            connection.release();
            
                        }
            
                    }
                )
            }

        }
    )

} );

module.exports = router;