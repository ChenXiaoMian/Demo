;(function($){
  function getValue($el){
    return  $el.is('[type="checkbox"]') ? $el.prop('checked') :
            $el.is('[type="radio"]')    ? !!$('[name="' + $el.attr('name') + '"]:checked').length : $el.val();
  }
  function fieldIsRequired(){
    var value = getValue($(this));
    return !(typeof value == "string" ? $.trim(value) : value);
  }
  function isEmpty(msg){
    return typeof msg === 'string' && msg !== '' && msg;
  }

  var mValidate = function(form, options){
    this.$form = $(form);
    this.$btn = this.$form.find("input[type='submit'],button[type='submit']");
    this.options = $.extend({}, mValidate.OPTIONS, options);
    
    // 验证状态
    this.STATUS_NOT_VALIDATED = 'NOT_VALIDATED';                // 未验证
    this.STATUS_VALIDATING    = 'VALIDATING';                   // 验证中
    this.STATUS_INVALID       = 'INVALID';                      // 验证不通过
    this.STATUS_VALID         = 'VALID';                        // 验证通过

    // 初始化验证项
    for(var field in this.options.fields){
      this.initField(field);
    }

    this.$form.on('input change focus', this.onInput.bind(this));
    this.$form.on('focusout', this.runValidate.bind(this));
    this.$form.on('submit', this.onSubmit.bind(this));
    this.$form.attr("novalidate", true);
  };

  mValidate.OPTIONS = {

  };

  // 验证器
  mValidate.VALIDATORS = {
    'required': function($ele, opt){
      var value = getValue($ele),
          isValid = !(typeof value == "string" ? $.trim(value) : value),
          message = isEmpty(opt.message);
      return {
        validName: 'required',
        valid: isValid,
        message: message
      };
    },
    'stringLength': function($ele, opt){
      var value = getValue($ele),
          isValid = value === null || value.length < +opt.min || value.length >= +opt.max;
          message = isEmpty(opt.message);
      return {
        validName: 'stringLength',
        valid: isValid,
        message: message
      }
    },
    'regexp': function($ele, opt){
      var value = getValue($ele),
          regexp = opt.regexp != 'undefined' && opt.regexp,
          isValid = !regexp.test(value),
          message = isEmpty(opt.message);
      return {
        validName: 'regexp',
        valid: isValid,
        message: message
      }
    }
  };

  mValidate.prototype = {
    constructor: mValidate,
    onInput: function(e){
      var $el = $(e.target);
          field = $el.attr('data-mv-field'),
          $group = $el.closest('.form-group');
      $group.removeClass("has-error has-success").find(".help-block").hide();
    },
    runValidate: function(e){
      var $el = $(e.target);
          field = $el.attr('data-mv-field');
      if(field !== null && field){
        this.validateField(field);
      }
    },
    initField: function(field){
      var $input = $(':input[name="' + field + '"]');
      var $group = $input.closest('.form-group');
      var _this = this;
      if($input.length === 0) return;
      if(this.options.fields[field] === null || this.options.fields[field].validators === null) return;
      $input.attr('data-mv-field', field);
      
      var validatorName;
      for(validatorName in this.options.fields[field].validators){
        $('<small/>').css('display', 'none')
          .addClass('help-block')
          .attr('data-mv-validator', validatorName)
          .attr('data-mv-for', field)
          .attr('data-mv-result', this.STATUS_NOT_VALIDATED)
          .html(_this.getMessage(field, validatorName))
          .appendTo($group);
      }
    },
    getMessage: function(field, validatorName){
      var options = this.options.fields[field].validators[validatorName];
      return !!options.message && options.message;
    },
    validate: function(){
      for(var field in this.options.fields){
        this.validateField(field);
      }
    },
    validateField: function(field){
      var $field = $(':input[name="' + field + '"]');
      var validators = this.options.fields[field].validators;
      var validatorName, validateResult,
          errors = [];
      for(validatorName in validators){
        if(typeof mValidate.VALIDATORS[validatorName] === 'function'){
          validateResult = mValidate.VALIDATORS[validatorName].call(this, $field, validators[validatorName]);
        }
        if(validateResult.valid)  errors.push(validateResult);
      }
      if(errors.length > 0){
        $field.data('mv.field.errors', errors);
        this.showError(field);
      }else{
        $field.data('mv.field.errors', []);
        this.clearError(field);
      }
    },
    showError: function(field){
      var $el = $(':input[name="' + field + '"]'),
          $group = $el.closest('.form-group'),
          $allErrors = $group.find('.help-block[data-mv-for="'+ field +'"]'),
          errors = $el.data('mv.field.errors'),
          $error = errors[0] ? $allErrors.filter('[data-mv-validator="'+ errors[0].validName +'"]') : $allErrors;
      $group.removeClass("has-success").addClass("has-error");
      $error.attr('data-mv-result', this.STATUS_INVALID).show();
    },
    clearError: function(field){
      var $el = $(':input[name="' + field + '"]'),
          $group = $el.closest('.form-group'),
          $allErrors = $group.find('.help-block[data-mv-for="'+ field +'"]');
      $group.removeClass("has-error").addClass("has-success").find(".help-block").hide();
    },
    isvalidateField: function(field){
      var $field = $(':input[name="' + field + '"]');
      var validators = this.options.fields[field].validators;
      var validatorName, validateResult,
          errors = [];
      for(validatorName in validators){
        if(typeof mValidate.VALIDATORS[validatorName] === 'function'){
          validateResult = mValidate.VALIDATORS[validatorName].call(this, $field, validators[validatorName]);
        }
        if(validateResult.valid)  return false;
      }
      return true;
    },
    isValidate: function(){
      for(var field in this.options.fields){
        if (!this.isvalidateField(field)) {
          return false;
        }
      }
      return true;
    },
    onSubmit : function(e){
      e.preventDefault();
      this.validate();
      if(this.isValidate()){
        var callback = this.options.submitCallback;
        typeof callback === 'function' && callback();
      }
    }
  };

  $.fn.mValidate = function(option){
    return this.each(function(){
      var $this   = $(this),
          data    = $this.data('mValidate'),
          options  = 'object' === typeof option && option;
      if (!data) {
          data = new mValidate(this, options);
          $this.data('mValidate', data);
      }
    });
  };
  
}(window.jQuery));