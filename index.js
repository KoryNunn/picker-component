var fastn = require('fastn')({
    _generic: require('fastn/genericComponent'),
    list: require('fastn/listComponent'),
    templater: require('fastn/templaterComponent'),
    text: require('fastn/textComponent'),
    modal: require('modal-component/modalComponent'),
    picker: require('./pickerComponent')
});

module.exports = function(settings){
    return fastn('picker', settings).attach().render();
};