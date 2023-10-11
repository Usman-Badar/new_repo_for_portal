import $ from 'jquery';

export const saveScrollValue = (id, key) => {
    sessionStorage.setItem('scrollValue', JSON.stringify({
        key: key,
        value: $(`#${id}`).scrollTop()
    }));
}
export const loadScrollValue = (id, key) => {
    if (sessionStorage.getItem('scrollValue')) {
        const obj = JSON.parse(sessionStorage.getItem('scrollValue'));
        if (obj.key === key) {
            $(`#${id}`).animate({
                scrollTop: obj.value
            }, 1000);
        }
    }
}