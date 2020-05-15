function values(object){
    if(Array.isArray(object)){
        return object.slice();
    }

    var result = [];

    for(var key in object){
        result.push(object[key]);
    }

    return result;
}

var defaultCss = require('defaultcss');

defaultCss('picker-component', '.picker-component-modal{position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,0.5);}.picker-component-modal .content{background:white}');

module.exports = function(fastn, picker, type, settings, children){
    var tabKey = 9,
        enterKey = 13,
        excapeKey = 27,
        downKey = 40,
        upKey = 38,
        spaceKey = 32,
        closeKeys = [tabKey, excapeKey, enterKey],
        showKeys = [downKey, spaceKey],
        navKeys = [upKey, downKey],
        pickerModel = new fastn.Model({
            options:[],
            show: false
        }),
        currentModel = new fastn.Model({
            item:null
        });


    if(!settings.itemTemplate){
        settings.itemTemplate = function(model, scope, select, renderItem){
            return renderItem(fastn.binding('item')).on('click', select);
        };
    }

    if(!settings.pickValue){
        settings.pickValue = function(value){
            return value;
        };
    }

    if(!settings.currentTemplate){
        settings.currentTemplate = function(model, scope){
            return fastn.binding('item', function(item){
                return (item && picker.multiple() ? item.length && item : false) || 'Pick a value';
            });
        };
    }

    pickerModel.on('value', function(value){
        currentModel.set('item', value);
    });

    settings.tabindex = 0;
    settings.class = fastn.binding('show', fastn.binding.from(settings.class), function(show, extraClasses){
        return [
            'picker-component',
            (show ? 'show' : ''),
            extraClasses
        ];
    }).attach(pickerModel);

    picker.extend('_generic', settings, children);
    picker.setProperty('options');
    picker.setProperty('value');
    picker.setProperty('multiple');
    picker.setProperty('show');

    function keyHandler(event){
        if(!picker.show()){
            if(~showKeys.indexOf(event.which)){
                event.preventDefault();
                picker.show(true);
            }
        }else{
            if(~navKeys.indexOf(event.which)){
                event.preventDefault();
                var options = values(pickerModel.get('options')),
                    currentIndex = options.indexOf(pickerModel.get('value'));

                var nextIndex =  (currentIndex + (event.which === upKey ? -1 : 1) + options.length) % options.length;

                pickerModel.set('value', options[nextIndex]);
            }
            if(~closeKeys.indexOf(event.which)){
                picker.show(false);
            }
        }
    }

    picker.on('keydown', keyHandler);

    function renderItem(model, scope){
        return settings.itemTemplate(model, scope, function(){
            if(picker.multiple()){
                var value = pickerModel.get('value'),
                    item = model.get('item');

                if(!Array.isArray(value)){
                    value = [];
                    picker.value(value);
                }

                var index = value.indexOf(item);

                if(!~index){
                    pickerModel.push('value', model.get('item'));
                }else{
                    pickerModel.remove('value', index);
                }

                picker.emit('change', pickerModel.get('value'))

                return;
            }

            pickerModel.set('value', model.get('item'));
            picker.emit('change', model.get('item'))

            // Delay closing to allow for animations.
            setTimeout(function(){
                pickerModel.set('show', false);
                picker.element && picker.element.focus();
            }, settings.closeDelay || 0);

        }, function(content){
            return fastn('div',
                {
                    'class':fastn.binding('item', fastn.binding('value|*').attach(pickerModel), function(item, value){
                        var selected = picker.multiple() && Array.isArray(value) && ~value.indexOf(item) || item === value;
                        return [
                            'option',
                            selected ? 'selected' : ''
                        ];
                    })
                },
                fastn('i', {'class':fastn.binding('multiple', function(multiple){
                    return multiple && 'selectedIcon';
                }).attach(pickerModel)}),
                content
            );
        });
    }

    picker.insert(
        fastn('div', {
                'class':'current'
            },
            fastn('templater', {
                'class':'current',
                data: fastn.binding('value|*').attach(pickerModel),
                template: settings.currentTemplate
            })
        )
        .on('click', function(){
            pickerModel.set('show', !pickerModel.get('show'));
            picker.element.focus();
        }),
        fastn('modal',  {
            show: fastn.binding('show').attach(pickerModel),
            content: function(scope){
                return fastn('div',
                    fastn('list', {
                        'class': 'options',
                        items: fastn.binding('options|*'),
                        template: renderItem
                    }).attach(pickerModel),
                    fastn('templater', {
                        data: fastn.binding('options|*', function(options){
                            return options && !!Object.keys(options).length;
                        }).attach(pickerModel),
                        template: function(model){
                            if(!model.get('item')){
                                return fastn('h3', 'There are no options available');
                            }
                        }
                    }),
                    fastn('nav', {'class':'footer'},
                        fastn('templater', {
                            data: fastn.binding('multiple').attach(pickerModel),
                            template: function(model){
                                if(model.get('item')){
                                    return fastn('button', {
                                            type: 'button'
                                        },
                                        'OK'
                                    ).on('click', function(){
                                        pickerModel.set('show', false);
                                    });
                                }
                            }
                        })
                    )
                ).on('keydown', keyHandler);
            }
        }).on('render', function(){
            if(this.modalElement.classList){
                this.modalElement.classList.add('picker-component-modal');
            }
        })
    );

    function updateValue(value){

        var options = pickerModel.get('options');
        var result = Array.isArray(options) ? options.filter(function(option){
            return settings.pickValue(option) === value;
        }).pop() : value;

        pickerModel.set('value', picker.multiple() ? value || [] : result);
    }

    picker.options.on('update', function(){
        var options = picker.options();
        if(!options || typeof options !== 'object'){
            return;
        }

        pickerModel.set('options', options);
        updateValue(picker.value());
    });

    pickerModel.on('options', picker.options);

    function updateMultiple(multiple){
        if(multiple && !Array.isArray(pickerModel.get('value'))){
            pickerModel.set('value', []);
        }
    }
    pickerModel.on('multiple', updateMultiple);
    updateMultiple(settings.multiple);

    picker.value.on('change', updateValue);
    pickerModel.on('value|*', function(value){
        picker.value(settings.pickValue(value));
    });

    picker.show.on('change', pickerModel.set.bind(pickerModel, 'show'));
    pickerModel.on('show', picker.show);

    picker.multiple.on('change', pickerModel.set.bind(pickerModel, 'multiple'));

    picker.on('destroy', pickerModel.detach.bind(pickerModel));

    return picker;
};

module.exports.expectedComponents = ['modal', 'text', '_generic', 'list', 'templater'];