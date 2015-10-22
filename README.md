# picker-component

A flexible component to use where you might use a `<select>`

Built with `fastn.js`

# Usage

## Settings

```
{
    options: array or object of options
    value: optional, any type
    multiple: boolean, optional, default false
    pickValue: optional, function(item){
        return anything

        eg:

        return item.id
    },
    class: optional, string or array of strings
}
```

## Standalone

```
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

```
var fastn = require('fastn')({
    ... other components...
    picker: require('picker-component/pickerComponent')
});

var picker = fastn('picker', { options... });
```

## Inserting

```
someDomNode.appendChild(picker.element);
```

## Properties

The below properties are getter/setters, and event emitters.

 - options
 - value
 - multiple

Example usage of value property:

```
// retrieve value
picker.value(); // returns value

// set value
picker.value(newValue); -// returns picker.value property

// watch for changes
picker.value.on('change', function(value){
    // Do something
});
```