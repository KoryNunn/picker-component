# picker-component

A flexible component to use where you might use a `<select>`

Built with `fastn.js`

# Usage

## Settings

```js
{
    options: array or object of options
    value: optional, any type
    multiple: boolean, optional, default false

    pickValue: optional, function(item){ // A function to pick a "value" for each item, to match it against the pickers "value"
        return anything

        eg:

        return item.id
    },

    itemTemplate: function(model, scope, select, renderItem){ // A template function for rendering items in the pick list
        var item = renderItem(model.get('item.something'));

        item.on('click', select);

        return item;
    },

    currentTemplate: function(model){ // A template function for rendering the currently selected value
        var selectedValue = model.get('item.something');
        return crel('div', selectedValue ? 'You picked ' + model.get('item.something') : 'Pick a value');
    },

    class: optional, string or array of strings
}
```

## Standalone

```js
// Create the picker
var picker = createPicker({
        options: ['foo', 'bar', 'baz']
    });

// Watch for changes to the picker's value
picker.value.on('change', function(value){
    console.log(value);
});

// Put the picker's element somewhere in the DOM.
document.body.appendChild(picker.element);
```

## Fastn component

```js
var fastn = require('fastn')({
    ... other components...
    picker: require('picker-component/pickerComponent')
});

var picker = fastn('picker', { options... });
```

## Inserting

```js
someDomNode.appendChild(picker.element);
```

## Properties

The below properties are getter/setters, and event emitters.

 - options
 - value
 - multiple

Example usage of value property:

```js
// retrieve value
picker.value(); // returns value

// set value
picker.value(newValue); -// returns picker.value property

// watch for changes
picker.value.on('change', function(value){
    // Do something
});
```

### Developing

```sh
npm i

npm start
```

Then open http://localhost:8080

## Major changes

v2: No longer emits change event when updating the components "value" progmatically. More alligned to how native web elements work.