/**
 * 暂时只支持input简单验证
 * author: chenxiaomain
 * mail: bestmian@foxmail.com
 */
;(function($){
  // 获取输入框结果
  function getValue($el){
    return  $el.is('[type="checkbox"]') ? $el.prop('checked') :
            $el.is('[type="radio"]')    ? !!$('[name="' + $el.attr('name') + '"]:checked').length : $el.val();
  }
  // 判断提示是否为空
  function isEmpty(msg){
    return typeof msg === 'string' && msg !== '' && msg;
  }
  // mValidate类
  var mValidate = function(form, options){
    this.$form = $(form);
    // 查找提交按钮
    this.$btn = this.$form.find("input[type='submit'],button[type='submit']");
    // 扩展配置
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
    // 监听表单事件
    this.$form.on('input change focus', this.onInput.bind(this));
    this.$form.on('focusout', this.runValidate.bind(this));
    this.$form.on('submit', this.onSubmit.bind(this));
    this.$form.attr("novalidate", true);
  };

  // 插件默认配置
  mValidate.OPTIONS = {

  };

  // 验证器
  mValidate.VALIDATORS = {
    // 是否为空
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
    // 长度判断
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
    // 正则判断
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

  // 公用方法
  mValidate.prototype = {
    constructor: mValidate,
    // 输入框输入时事件
    onInput: function(e){
      var $el = $(e.target);
          field = $el.attr('data-mv-field'),
          $group = $el.closest('.form-group');
      $group.removeClass("has-error has-success").find(".help-block").hide();
    },
    // 输入框离开焦点时，验证判断
    runValidate: function(e){
      var $el = $(e.target);
          field = $el.attr('data-mv-field');
      if(field !== null && field){
        this.validateField(field);
      }
    },
    // 加载验证提示项
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
    // 获取配置中的提示
    getMessage: function(field, validatorName){
      var options = this.options.fields[field].validators[validatorName];
      return !!options.message && options.message;
    },
    // 验证事件
    validate: function(){
      for(var field in this.options.fields){
        this.validateField(field);
      }
    },
    // 验证单个字段
    validateField: function(field){
      var $field = $(':input[name="' + field + '"]');
      var validators = this.options.fields[field].validators;
      var validatorName, validateResult,
          errors = [];
      // 获取验证器，并对输入框内容进行验证
      for(validatorName in validators){
        if(typeof mValidate.VALIDATORS[validatorName] === 'function'){
          validateResult = mValidate.VALIDATORS[validatorName].call(this, $field, validators[validatorName]);
        }
        if(validateResult.valid)  errors.push(validateResult);
      }
      // 缓存错误结果，并给出提示
      if(errors.length > 0){
        $field.data('mv.field.errors', errors);
        this.showError(field);
      }else{
        $field.data('mv.field.errors', []);
        this.clearError(field);
      }
    },
    // 显示提示
    showError: function(field){
      var $el = $(':input[name="' + field + '"]'),
          $group = $el.closest('.form-group'),
          $allErrors = $group.find('.help-block[data-mv-for="'+ field +'"]'),
          errors = $el.data('mv.field.errors'),
          $error = errors[0] ? $allErrors.filter('[data-mv-validator="'+ errors[0].validName +'"]') : $allErrors;
      $group.removeClass("has-success").addClass("has-error");
      $error.attr('data-mv-result', this.STATUS_INVALID).show();
    },
    // 清除提示
    clearError: function(field){
      var $el = $(':input[name="' + field + '"]'),
          $group = $el.closest('.form-group'),
          $allErrors = $group.find('.help-block[data-mv-for="'+ field +'"]');
      $group.removeClass("has-error").addClass("has-success").find(".help-block").hide();
    },
    // 判断单个字段是否验证完成
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
    // 判断全部字段是否验证完成
    isValidate: function(){
      for(var field in this.options.fields){
        if (!this.isvalidateField(field)) {
          return false;
        }
      }
      return true;
    },
    // 提交事件，阻止浏览器默认行为
    onSubmit : function(e){
      e.preventDefault();
      this.validate();
      if(this.isValidate()){
        var callback = this.options.submitCallback;
        typeof callback === 'function' && callback();
      }
    }
  };
  
  // jquery插件扩展方法
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