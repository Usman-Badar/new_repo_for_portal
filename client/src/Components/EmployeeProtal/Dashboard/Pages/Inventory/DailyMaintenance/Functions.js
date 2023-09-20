import axios from '../../../../../../axios';
import $ from 'jquery';
import JSAlert from 'js-alert';

export const loadList = ( setList ) => {

    axios.get('/workshop/daily_reports')
    .then(
        res => 
        {
                
            setList(res.data);

        }
    ).catch(
        err => {

            console.log(err);

        }
    );

}

export const loadDetails = ( report_id, setDetails ) => {

    axios.post(
        '/workshop/get/report',
        {
            report_id: report_id
        }
    )
    .then(
        res => 
        {
                
            setDetails(
                {
                    details: res.data[0],
                    items: res.data[1]
                }
            );

        }
    ).catch(
        err => {

            console.log(err);

        }
    );

}

export const loadChecklist = ( setCheckList ) => {

    axios.get('/workshop/list')
    .then(
        res => 
        {
            setCheckList(res.data);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );

}

export const addNewCheckItem = ( e, Edit, setShowModal, setCheckList ) => {

    e.preventDefault();
    $('fieldset').prop('disabled', true);
    const url = Edit ? "/workshop/editcheckitem" : "/workshop/newcheckitem"
    axios.post(
        url,
        {
            title: e.target['title'].value,
            id: Edit ? Edit.id : null
        }
    )
    .then(
        () => 
        {
            $('fieldset').prop('disabled', false);
            $('#resetForm').trigger('click');
            setShowModal(false);
            JSAlert.alert(Edit ? "Item Updated" : "New Item Added").dismissIn(1000 * 2);
            loadChecklist( setCheckList );
        }
    ).catch(
        err => {
            $('fieldset').prop('disabled', false);
            console.log(err);
        }
    );

}

export const deleteItem = ( id, setCheckList ) => {

    JSAlert.alert("Please Wait...").dismissIn(1000 * 1);
    axios.post(
        "/workshop/deletecheckitem",
        {
            id: id
        }
    )
    .then(
        () => 
        {
            JSAlert.alert("Item Deleted").dismissIn(1000 * 2);
            loadChecklist( setCheckList );
        }
    ).catch(
        err => {
            console.log(err);
        }
    );

}