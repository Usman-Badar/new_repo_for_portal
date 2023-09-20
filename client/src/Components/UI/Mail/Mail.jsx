/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import $ from 'jquery';

export const Mail = ( { data } ) => {
    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();

        // emailjs.sendForm(process.env.REACT_APP_MAIL_SERVICE_ID, process.env.REACT_APP_MAIL_TEMPLATE_ID, form.current, process.env.REACT_APP_MAIL_PUBLIC_KEY)
        //     .then((result) => {
        //         console.log(result.text);
        //     }, (error) => {
        //         console.log(error.text);
        //     });
    };

    // var data = {
    //     service_id: process.env.REACT_APP_MAIL_SERVICE_ID,
    //     template_id: process.env.REACT_APP_MAIL_TEMPLATE_ID,
    //     user_id: process.env.REACT_APP_MAIL_PUBLIC_KEY,
    //     template_params: {
    //         "subject": "New Short Leave",
    //         "send_to": "usman.umer0335@gmail.com",
    //         "gender": "Sir",
    //         "receiver": "Relations[x].name",
    //         "message": ' apply for a short leave on the portal',
    //         'g-recaptcha-response': '03AHJ_ASjnLA214KSNKFJAK12sfKASfehbmfd...'
    //     }
    // };
     
    // $.ajax('https://api.emailjs.com/api/v1.0/email/send', {
    //     type: 'POST',
    //     data: JSON.stringify(data),
    //     contentType: 'application/json'
    // }).done(function() {
    //     alert('Your mail is sent!');
    // }).fail(function(error) {
    //     alert('Oops... ' + JSON.stringify(error));
    // });

    return (
        <form className='d-none' ref={form} onSubmit={sendEmail}>
            <label>Receiver</label>
            <input required type="text" name="to_name" defaultValue={ data.receiver } readOnly />
            <label>Gender</label>
            <select required name="gender" defaultValue={ data.gender }>
                <option value="Sir">Sir</option>
                <option value="Mam">Mam</option>
            </select>
            <label>Subject</label>
            <input required type="text" name="subject" defaultValue={ data.subject } readOnly />
            <label>Email</label>
            <input required type="email" name="send_to" defaultValue={ data.send_to } readOnly />
            <label>Message</label>
            <textarea required name="message" defaultValue={ data.message } />
            <input type="submit" value="Send" id="mail_form" />
        </form>
    );
};

export default Mail;