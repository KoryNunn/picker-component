var createPicker = require('../'),
    crel = require('crel');

window.onload = function(){



    // Minimal usage:
    var defaultPicker = createPicker({
            options: ['foo', 'bar', 'baz']
        });

    defaultPicker.on('change', function(value){
        console.log(value);
    });

    crel(document.body,
        defaultPicker.element
    );





    // More advanced usage:
    var picker2 = createPicker({

        options: [
            {
                something: 'Foo',
                someKey: 1
            },
            {
                something: 'Bar',
                someKey: 2
            },
            {
                something: 'Baz',
                someKey: 3
            }
        ],

        itemTemplate: function(model, scope, select, renderItem){
            var item = renderItem(model.get('item.something'));

            item.on('click', select);

            return item;
        },

        currentTemplate: function(model){
            var selectedValue = model.get('item.something');
            return crel('div', selectedValue ? 'You picked ' + model.get('item.something') : 'Pick a value');
        }
    });

    picker2.on('change', function(value){
        console.log(value);
    });

    picker2.value(picker2.options()[1])

    crel(document.body,
        picker2.element
    );




    // fastn.js usage

    var fastn = require('fastn')({
        text: require('fastn/textComponent'),
        _generic: require('fastn/genericComponent'),
        list: require('fastn/listComponent'),
        templater: require('fastn/templaterComponent'),
        modal: require('modal-component/modalComponent'),
        picker: require('../pickerComponent')
    });

    var fastnPicker = fastn('picker', {
            options: fastn.binding('items')
        })
        .attach({
            items: ['foo', 'bar', 'baz']
        })
        .render();

    fastnPicker.on('change', function(value){
        console.log(value);
    });

    crel(document.body,
        fastnPicker.element
    );

    // fastn.js usage multiple

    var fastn = require('fastn')({
        text: require('fastn/textComponent'),
        _generic: require('fastn/genericComponent'),
        list: require('fastn/listComponent'),
        templater: require('fastn/templaterComponent'),
        modal: require('modal-component/modalComponent'),
        picker: require('../pickerComponent')
    });

    var fastnPicker = fastn('picker', {
            options: fastn.binding('items'),
            multiple: true
        })
        .attach({
            items: ['foo', 'bar', 'baz']
        })
        .render();

    fastnPicker.on('change', function(value){
        console.log(value);
    });

    crel(document.body,
        fastnPicker.element
    );
};