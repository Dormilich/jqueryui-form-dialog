(function ($) {
    function _userAlert(title, text)
    {
        $('<pre/>').text(text).dialog({
            title: title,
            close: function () {
                $(this).dialog('destroy');
            }
        });
    }

    // jQuery AJAX error handler
    function _showErrors(jqXHR)
    {
        try {
            var data = $.parseJSON(jqXHR.responseText);
            $.each(data.form, function (field, errors) {
                this.find('*[name="'+field+'"]:first').before(_createErrorList(errors));
            }.bind(this));
            if (data.error) {
                this.find('form').addBack('form').prepend(_createErrorList([data.error]));
            }
        }
        catch (e) {
            // e.g. simple or empty strings
            // console.log(e.message);
        }
    }

    function _createErrorList(errors)
    {
        var $ul = $('<ul class="error"/>');
        var $li = $('<li/>');
        $.each(errors, function (index, error) {
            $li.clone().text(error).appendTo($ul);
        });
        return $ul;
    }

    /**
     * Create a jQueryUI dialog from the element. The AJAX URL, data, and method 
     * are read from the contained form.
     * 
     * @param (object) options [optional] jQueryUI dialog options / plugin options
     * @param (function) success [optional] jQuery AJAX success handler
     * @return jQuery
     */
    $.fn.formDialog = function (options, success) {
        if ($.isFunction(options)) {
            success = options;
        }
        if (typeof options !== 'object') { // null is ignored in $.extend()
            options = {};
        }
        var plugin  = $.fn.formDialog;
        var setting = $.extend({}, plugin.defaults, options);

        setting.buttons = [{
            text:  plugin.translate(setting.language, setting.actionLabel),
            click: function (evt) {
                var button  = evt.target; // the 'Save' button
                var $dialog = $(this);
                var $form   = $dialog.find('form').addBack('form');
                if ($form.find(':invalid').length > 0) {
                    return false;
                }

                button.disabled = true;
                $dialog.find('ul.error').remove();

                var ajax = $.ajax($form.prop('action'), {
                    type: $form.prop('method'),
                    data: $form.serialize(),
                    context: $dialog,
                    statusCode: {
                        400: _showErrors,
                        500: function (jqXHR, textStatus, errorThrown) {
                            this.dialog('close');
                            _userAlert(plugin.translate(setting.language, 'Error'), jqXHR.responseText || errorThrown);
                        }
                    }
                }).always(function () {
                    button.disabled = false;
                });

                if (setting.autoClose) {
                    ajax.done(function () {
                        this.dialog('close');
                    });
                }

                if ($.isFunction(success)) {
                    ajax.done(success);
                }

                if ($.isFunction(setting.success)) {
                    ajax.done(setting.success);
                }
            }
        }, {
            text:  plugin.translate(setting.language, 'Cancel'),
            click: function () {
                $(this).dialog('close');
            }
        }];

        // dialog() is a widget itself, so there’s no need to use each()
        return this.dialog(setting);
    };

    // global defaults
    $.fn.formDialog.defaults = {
        // dialog options:

        autoOpen: false,
        modal: true,
        width: 500,

        // plugin options:

        // The language to be used for translating buttons and labels.
        language: 'en',
        // The name to be used on the "submit" button.  
        actionLabel: 'Save',
        // Close the dialog automatically if the AJAX submit was successful.
        autoClose: true
    };

    $.fn.formDialog.dictionary = {
        de: {
            Cancel: 'Abbrechen',
            Delete: 'Löschen',
            Edit:   'Bearbeiten',
            Error:  'Fehler',
            Save:   'Speichern'
        }
    };

    $.fn.formDialog.translate = function (language, key) {
        if (!(language in $.fn.formDialog.dictionary)) {
            return key;
        }
        var dictionary = $.fn.formDialog.dictionary[language];
        if (key in dictionary) {
            return dictionary[key];
        }
        return key;
    };
}(jQuery));