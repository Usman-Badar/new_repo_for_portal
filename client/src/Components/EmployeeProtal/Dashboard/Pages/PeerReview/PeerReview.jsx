/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import $ from 'jquery';
import { useHistory } from 'react-router-dom';
import { submitForm } from './Functions';
const UI = lazy(() => import('./UI'));

const PeerReview = () => {
    // const googleTranslateElementInit = () => {
    //     new window.google.translate.TranslateElement(
    //         {
    //             pageLanguage: "en"
    //         },
    //         "google_translate_element"
    //     );
    // };
    const peer = window.location.href.split('/').pop().split('&&name=').shift();
    const history = useHistory();
    const today = new Date();
    const quarter = Math.floor((today.getMonth() + 3) / 3);
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    const name = window.location.href.split('&&name=').pop().split('%20').join(' ');
    const [ Form, setForm ] = useState(
        [
            {
                q: "What are " + name + "'s strengths and weaknesses?",
                translation: "ان کی صلاحیتیں اور کمزوریاں کیا ہیں؟",
                type: 'text',
                id: 'input_1',
                answer: ''
            },
            {
                q: "What three words would you use to describe " + name + "?",
                translation: "آپ انہیں بیان کرنے کے لیے کون سے تین الفاظ کا استعمال کریں گے؟",
                type: 'multiple',
                id: 'input_3',
                answers: [
                    {answer: '', id: 'input_1'},
                    {answer: '', id: 'input_2'},
                    {answer: '', id: 'input_3'},
                ]
            },
            {
                q: "In what area do you want " + name + " to improve",
                translation: "انہیں کس شعبے میں بہتری کی ضرورت ہے؟",
                type: 'text',
                id: 'input_4',
                answer: ''
            },
            {
                q: "How effectively did " + name + " contribute to team projects and goals?",
                translation: "انہوں نے ادارے کے منصوبوں اور نتائج میں کتنے اچھے طریقے سے تعاون کیا؟",
                type: 'text',
                id: 'input_6',
                answer: ''
            },
            {
                q: "What should " + name + " continue to do?",
                translation: "انہیں کیا کرتے رہنا چاہیے؟",
                type: 'text',
                id: 'input_7',
                answer: ''
            },
            {
                q: "Did " + name + " exhibit strong attention to detail and produce high-quality work?",
                translation: "کیا انہوں نے کام پر توجہ دی اور اچھا کام کیا؟",
                type: 'text',
                id: 'input_8',
                answer: ''
            },
            {
                q: "Is " + name + " open to learning new skills and taking on new challenges?",
                translation: "کیا وہ نئی چیزیں سیکھ رہے تھے اور نئے چیلنجز کا سامنا کر رہے تھے",
                type: 'text',
                id: 'input_9',
                answer: ''
            },
            {
                q: "Did " + name + " demonstrate a commitment to their personal and professional growth?",
                translation: "کیا انہوں نے اپنی پیشہ ورانہ ترقی کے لیے کوئی بہتر کام کیا؟",
                type: 'text',
                id: 'input_10',
                answer: ''
            },
            {
                q: "How well does " + name + " adapt to changing priorities? (select at least two answers)",
                translation: "وہ ترجیحات کو تبدیل کرنے میں کتنی اچھی طرح سے سمجھتے ہیں؟ (کم از کم دو جوابات منتخب کریں)",
                type: 'checkbox',
                id: 'input_11',
                answers: [
                    {translation: "بالکل موافقت نہیں۔", label: 'Not flexible at all', checked: false, id: 'input_1'},
                    {translation: "شکایات بہت ہیں۔", label: 'Complaints a lot', checked: false, id: 'input_2'},
                    {translation: "کوئی اعتراض نہیں ہے", label: 'Does not mind', checked: false, id: 'input_3'},
                    {translation: "بہت سخت", label: 'Very rigid', checked: false, id: 'input_4'},
                    {translation: "بہت آسانی سے", label: 'Easy going', checked: false, id: 'input_5'},
                ]
            },
            {
                q: "How well does " + name + " manage their time and workload? (select at least two answers)",
                translation: "وہ اپنے وقت اور کام کو کتنی اچھی طرح سے سنبھالتے ہیں؟ (کم از کم دو جوابات منتخب کریں",
                type: 'checkbox',
                id: 'input_12',
                answers: [
                    {translation: "بہت اچھی طرح", label: 'Yes', checked: false, id: 'input_1'},
                    {translation: "وقت کا انتظام کرنے میں اچھا ہے لیکن کام کا بوجھ بہت زیادہ ہے۔", label: 'Good at managing time but has too much workload', checked: false, id: 'input_2'},
                    {translation: "ہمیشہ کام مکمل کرتا ہے", label: 'Always completes task but last minute', checked: false, id: 'input_3'},
                    {translation: "زیادہ کام نہیں ہے، ان وجہ سے وقت پر کرلیتا ہے", label: "Does not have enough work to do that’s why on time", checked: false, id: 'input_4'},
                    {translation: "بلکل نہیں سنبھال پاتا", label: 'No', checked: false, id: 'input_5'},
                ]
            },
            {
                q: "Is " + name + " dependable in meeting deadlines and completing assigned tasks?",
                translation: "کیا وہ دیے گۓ کام کو مقررہ وقت میں کرنے کے لیے قابل اعتماد ہیں",
                type: 'radio',
                id: 'input_13',
                answers: [
                    {translation: "جی ہاں", label: 'Yes', no: 'no_1', checked: false, id: 'input_1'},
                    {translation: "نہیں", label: 'No', no: 'no_2', checked: false, id: 'input_1'},
                    {translation: "نہیں جانتا", label: 'Do not know', no: 'no_3', checked: false, id: 'input_1'},
                ]
            },
            {
                q: "How well did " + name + " communicate with team members and other departments?",
                translation: "انہوں نے ادارے کے اراکین اور دیگر محکموں کے ساتھ کتنی اچھی طرح سے بات چیت کی؟",
                type: 'radio',
                id: 'input_14',
                answers: [
                    {translation: "بات چیت میں بہت اچھا", label: 'Very good at communicating', no: 'no_1', checked: false, id: 'input_1'},
                    {translation: "یقینی بناتا ہے اور دوسروں کی مدد کرتا ہے۔", label: 'Ensures and helps others', no: 'no_2', checked: false, id: 'input_1'},
                    {translation: "کبھی کبھی موجود نہیں ہوتا", label: 'Is not available sometimes', no: 'no_3', checked: false, id: 'input_1'},
                    {translation: "جواب نہیں دیتا", label: 'Does not respond', no: 'no_4', checked: false, id: 'input_1'},
                    {translation: "معلوم نہیں۔", label: 'Not sure', no: 'no_5', checked: false, id: 'input_1'},
                ]
            },
            {
                q: "Did " + name + " collaborate effectively with others, or did they work independently?",
                translation: "کیا انہوں نے دوسروں کے ساتھ بہتر طریقے سے تعاون کیا",
                type: 'radio',
                id: 'input_15',
                answers: [
                    {translation: "جی ہاں", label: 'Yes', no: 'no_1', checked: false, id: 'input_1'},
                    {translation: "نہیں", label: 'No', no: 'no_2', checked: false, id: 'input_1'},
                    {translation: "شاید", label: 'Maybe', no: 'no_3', checked: false, id: 'input_1'},
                ]
            },
            {
                q: "Did " + name + " demonstrate strong problem-solving skills?",
                translation: "کیا ان میں مسائل کو حل کرنے کی صلاحیت ہے؟",
                type: 'radio',
                id: 'input_16',
                answers: [
                    {translation: "جی ہاں", label: 'Yes', no: 'no_1', checked: false, id: 'input_1'},
                    {translation: "نہیں", label: 'No', no: 'no_2', checked: false, id: 'input_1'},
                    {translation: "شاید", label: 'Maybe', no: 'no_3', checked: false, id: 'input_1'},
                ]
            },
            {
                q: "Is " + name + " proactive in seeking feedback and improving their work?",
                translation: "کیا وہ ضروری معلومات حاصل کرنے اور اپنے کام کو بہتر بنانے والے ہیں؟",
                type: 'radio',
                id: 'input_17',
                answers: [
                    {translation: "جی ہاں", label: 'Yes', no: 'no_1', checked: false, id: 'input_1'},
                    {translation: "نہیں", label: 'No', no: 'no_2', checked: false, id: 'input_1'},
                    {translation: "شاید", label: 'Maybe', no: 'no_3', checked: false, id: 'input_1'},
                ]
            },
            {
                q: "Did " + name + " take responsibility for their mistakes? (select at least two answers)",
                translation: "کیا انہوں نے اپنی غلطیوں کو قبول کیا؟ (کم از کم دو جوابات منتخب کریں)",
                type: 'checkbox',
                id: 'input_18',
                answers: [
                    {translation: "ہاں قبول کرتا ہے جب وہ غلطی پر ہو۔", label: 'Yes accepts when they are at fault', checked: false, id: 'input_1'},
                    {translation: "نہیں جب غلطی ہو تو قبول نہیں کرتا", label: 'No does not accept when at fault', checked: false, id: 'input_2'},
                    {translation: "غلطی پر مشتعل ہو جاتا ہے۔", label: 'Gets agitated when at fault', checked: false, id: 'input_3'},
                    {translation: "غلطی ہونے پر رابطے سے گریز کرتا ہے۔", label: "Avoids contact when at fault", checked: false, id: 'input_4'},
                    {translation: "غلطی ہونے پر قبول کرتا ہے اور بہتر کرنے کی کوشش کرتا ہے۔", label: 'Accepts and tries to improve when at fault', checked: false, id: 'input_5'},
                ]
            },
            {
                q: "How well did " + name + " adapt to change and handle challenging situations?",
                translation: "انہوں نے کتنی اچھی طرح سے نۓ اور مشکل حالات کو سنبھالا؟",
                type: 'radio',
                id: 'input_19',
                answers: [
                    {translation: "اچھی طرح سے اپناتا ہے۔", label: 'Adapts well', no: 'no_1', checked: false, id: 'input_1'},
                    {translation: "انے اپنانا مشکل لگتا ہے۔", label: 'Finds it difficult to adapt', no: 'no_2', checked: false, id: 'input_1'},
                    {translation: "کچھ اندازہ نہیں", label: 'No idea', no: 'no_3', checked: false, id: 'input_1'},
                ]
            },
            {
                q: "Does " + name + " provide constructive feedback and support to their peers?",
                translation: "کیا وہ اپنے ساتھیوں کی مدد کرتے ہیں؟",
                type: 'radio',
                id: 'input_20',
                answers: [
                    {translation: "جی ہاں", label: 'Yes', no: 'no_1', checked: false, id: 'input_1'},
                    {translation: "ہمیشہ نہیں", label: 'Not always', no: 'no_2', checked: false, id: 'input_1'},
                    {translation: "کبھی نہیں۔", label: 'Never', no: 'no_3', checked: false, id: 'input_1'},
                    {translation: "کچھ اندازہ نہیں", label: 'No idea', no: 'no_4', checked: false, id: 'input_1'},
                ]
            },
            {
                q: "Did " + name + " demonstrate a positive attitude and contribute to a positive work environment? (select atleast two answers)",
                translation: "*کیا انہوں نے بہتری کا مظاہرہ کیا اور بہتر کام کے لیے حصہ ڈالا؟ (کم از کم دو جوابات منتخب کریں)",
                type: 'checkbox',
                id: 'input_21',
                answers: [
                    {translation: "ان کا رويہ منفی ہے", label: 'I get negative vibes', checked: false, id: 'input_1'},
                    {translation: "غیر جانبدار", label: 'Neutral', checked: false, id: 'input_2'},
                    {translation: "بہت محنتی اور محنتی ۔", label: 'Very diligent and hardworking ', checked: false, id: 'input_3'},
                    {translation: "میں نہیں جانتا", label: "I do not know", checked: false, id: 'input_4'},
                    {translation: "اچھے اخلاق", label: 'Good attitude', checked: false, id: 'input_5'},
                ]
            },
            {
                q: "Is " + name + " respectful and professional in their interactions with others?",
                translation: "کیا وہ دوسروں کے ساتھ احترام سے بات چیت کرتے ہیں؟",
                type: 'radio',
                id: 'input_22',
                answers: [
                    {translation: "کبھی کبھی", label: 'Sometimes', no: 'no_1', checked: false, id: 'input_1'},
                    {translation: "ہمیشہ", label: 'Always', no: 'no_2', checked: false, id: 'input_1'},
                    {translation: "کبھی نہیں۔", label: 'Never', no: 'no_3', checked: false, id: 'input_1'},
                    {translation: "نہیں", label: 'No', no: 'no_4', checked: false, id: 'input_1'},
                ]
            },
            {
                q: "Did " + name + " demonstrate strong leadership skills when necessary?",
                translation: "کیا ضرورت پڑنے پر انہوں نے زمہ دارانہ صلاحیتوں کا مظاہرہ کیا؟",
                type: 'radio',
                id: 'input_23',
                answers: [
                    {translation: "یقین نہیں۔", label: 'Not sure', no: 'no_1', checked: false, id: 'input_1'},
                    {translation: "جی ہاں", label: 'Yes', no: 'no_2', checked: false, id: 'input_1'},
                    {translation: "حیرت انگیز", label: 'Amazing', no: 'no_3', checked: false, id: 'input_1'},
                ]
            },
            {
                q: "Did " + name + " actively seek to develop and maintain positive relationships with team members and managers? (select at least two answers)",
                translation: "کیا انہوں نے ادارے کے اراکین کے ساتھ بہتر تعلقات رکھنے کی کوشش کی؟ (کم از کم دو جوابات منتخب کریں)",
                type: 'checkbox',
                id: 'input_24',
                answers: [
                    {translation: "دوسروں کے لیے تھوڑی عزت ہے۔", label: 'Has little respect for others', checked: false, id: 'input_1'},
                    {translation: "دوسروں کا احترام کرتا ہے اور ہر بات سے اتفاق کرتا ہے۔", label: 'Respects others and agrees to everything said', checked: false, id: 'input_2'},
                    {translation: "خیالات کو احترام کے ساتھ پیش کرتا ہے۔", label: 'Presents ideas in a respectful way', checked: false, id: 'input_3'},
                    {translation: "مزاج پر منحصر ہے۔", label: "Depends on the mood", checked: false, id: 'input_4'},
                    {translation: "ہمیشہ غیر متوقع", label: 'Always unpredictable', checked: false, id: 'input_5'},
                ]
            },
            {
                q: "Did " + name + " demonstrate strong organizational skills? (select at least two answers)",
                translation: "کیا انہوں نے بہترین صلاحیتوں کا مظاہرہ کیا؟ (کم از کم دو جوابات منتخب کریں)",
                type: 'checkbox',
                id: 'input_25',
                answers: [
                    {translation: "نہیں، لیکن وہ جانتا ہے کہ چیزیں کہاں تلاش کرنی ہیں۔", label: 'Is messy but knows where to find stuff', checked: false, id: 'input_1'},
                    {translation: "کبھی کبھی", label: 'Sometimes', checked: false, id: 'input_2'},
                    {translation: "ہمیشہ", label: 'Always', checked: false, id: 'input_3'},
                    {translation: "منظم لیکن کبھی کبھار چیزیں بھول جاتا ہے۔", label: "Organized but forgets stuff occasionally", checked: false, id: 'input_4'},
                ]
            },
            {
                q: "Did " + name + " demonstrate a strong work ethic and commitment to the organization's goals and values?",
                translation: "کیا انہوں نے ادارے کے اہداف اور اقدار سے وابستگی کا مظاہرہ کیا؟",
                type: 'radio',
                id: 'input_26',
                answers: [
                    {translation: "میں تنظیم کے مقاصد اور اقدار کو نہیں جانتا", label: 'I do not know organization goals and values', no: 'no_1', checked: false, id: 'input_1'},
                    {translation: "ہاں", label: 'Yes', no: 'no_2', checked: false, id: 'input_1'},
                    {translation: "نہیں", label: 'No', no: 'no_3', checked: false, id: 'input_1'},
                ]
            },
        ]
    );
    const [ ChangeInRadio, setChangeInRadio ] = useState();
    // const [ Loaded, setLoaded ] = useState(false);
    // useEffect(() => {
    //     if ( document.getElementById('google_translate_element') !== null && document.getElementById('google_translate_element') !== undefined )
    //     {
    //         var addScript = document.createElement("script");
    //         addScript.setAttribute(
    //             "src",
    //             "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    //         );
    //         document.getElementById('google_translate_element').appendChild(addScript);
    //         window.googleTranslateElementInit = googleTranslateElementInit;
    //     }
    //     return false;
    // }, [Loaded]);

    useEffect(
        () => {
            // loadData(window.location.href.split('/').pop());
            if (ChangeInRadio)
            {
                let arr = Form.slice();
                arr[ChangeInRadio.index].answers[ChangeInRadio.i].checked = true;
                setForm(arr);
                saveToDraft(arr);
            }
        }, [ChangeInRadio]
    )
    useEffect(
        () => {
            if ( localStorage.getItem("peer-review-draft") )
            {
                let arr = JSON.parse(localStorage.getItem("peer-review-draft")).filter(val => parseInt(val.emp_id) === parseInt(localStorage.getItem("EmpID")) && parseInt(peer) === parseInt(val.peer));
                if ( arr.length > 0 )
                {
                    setForm(arr[0].form_data);
                }
            }
        }, []
    );

    const onChangeHandler = (e) => {
        const { name, value, className, checked, id } = e.target;
        let arr = Form.slice();
        if ( className.includes('multiple') )
        {
            const index = arr.findIndex(val => val.id === name.split('-').shift());
            const i = arr[index].answers.findIndex(val => val.id === name.split('-').pop());
            arr[index].answers[i].answer = value;
        }else
        if ( className.includes('checkbox') )
        {
            const index = arr.findIndex(val => val.id === name.split('-').shift());
            const i = arr[index].answers.findIndex(val => val.id === name.split('-').pop());
            arr[index].answers[i].checked = checked;
        }else
        if ( className.includes('radio') )
        {
            const index = arr.findIndex(val => val.id === name.split('-').shift());
            const i = arr[index].answers.findIndex(val => val.no === id);
            for ( let x = 0; x < arr[index].answers.length; x++ )
            {
                arr[index].answers[x].checked = false;    
            }
            arr[index].answers[i].checked = checked;
        }else
        {
            const index = arr.findIndex(val => val.id === name);
            arr[index].answer = value;
        }
        setForm(arr);
        saveToDraft(arr);
    }
    const onChangeHandlerRadio = (e) => {
        const { name } = e.target;
        let arr = Form.slice();
        const index = arr.findIndex(val => val.id === name.split('-').shift());
        const i = arr[index].answers.findIndex(val => val.id === name.split('-').pop());
        for ( let x = 0; x < arr[index].answers.length; x++ )
        {
            arr[index].answers[x].checked = false;
        }
        setChangeInRadio({ index: index, i: i });;
        setForm(arr);
    }
    const saveToDraft = ( arr ) => {
        const obj = {
            emp_id: localStorage.getItem('EmpID'),
            peer: peer,
            form_data: arr
        };
        if ( localStorage.getItem("peer-review-draft") )
        {
            let data = JSON.parse(localStorage.getItem("peer-review-draft"));
            const i = data.findIndex(val => parseInt(val.emp_id) === parseInt(localStorage.getItem('EmpID')) && parseInt(peer) === parseInt(val.peer));
            if ( i < 0 )
            {
                data.push(obj);
                localStorage.setItem("peer-review-draft", JSON.stringify(data));
            }else
            {
                data[i].form_data = arr;
                localStorage.setItem("peer-review-draft", JSON.stringify(data));
            }
        }else
        {
            localStorage.setItem("peer-review-draft", JSON.stringify([obj]));
        }

        $('.las.la-sync').addClass('animate');
        $('.las.la-sync').toggleClass('text-secondary');
        $('.savingTxt').addClass('animate');
        setTimeout(
            () => {
                $('.las.la-sync').removeClass('animate');
                $('.las.la-sync').toggleClass('text-secondary');
                $('.savingTxt').removeClass('animate');
            }, 2000
        )
    }

    return (
        <>
            <Suspense fallback={<div>Loading....</div>}>
                <UI 
                    Form={ Form }
                    history={ history }
                    quarter={ quarter }
                    AccessControls={ AccessControls }
                    name={ name }

                    submitForm={ () => submitForm( history, Form, quarter ) }
                    // setLoaded={ setLoaded }
                    onChangeHandlerRadio={ onChangeHandlerRadio }
                    onChangeHandler={ onChangeHandler }
                />
            </Suspense>
        </>
    )
}
export default PeerReview;