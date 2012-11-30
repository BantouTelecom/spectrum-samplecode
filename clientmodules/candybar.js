/* global ich:true */
(function () {
  var Reformer = function (spec) {
    var f = function () {}, // empty func
      item;
      
    this.states = {
      active: ['hangup', 'mute', 'push'],
      muted: ['hangup', 'unmute'],
      inactive: [],
      remote: ['take']
    };
  };
  
  Reformer.prototype.render = function () {
    if (!this.dom) {
      this.dom = this.domify(template(this));
      this.dom.addEventListener('submit', function (e) {
        e.preventDefault(); // stop submit, always
      }, true);
      this.dom.addEventListener('input', function (e) {
        self.handleInputChange.apply(self, arguments);
      }, true);
      this.dom.addEventListener('blur', function (e) {
        self.handleInputChange.apply(self, arguments);
      }, true);
      this.dom.addEventListener('change', function (e) {
        self.handleInputChange.apply(self, arguments);
      }, true);
      this.dom.addEventListener('invalid', function (e) {
        e.preventDefault();
      }, true);
    } else {
      this.dom.innerHTML = this.domify(template(this)).innerHTML;
    }
    this.storeDomRef();
    this.fields.forEach(function (field) {
        if (field.type === 'select' && field.value) {
            field.inputEl.value = field.value + '';
        }
    });
    
    this.addButtonHandlers();
    return this.dom;
  };
  
  Reformer.prototype.addButtonHandlers = function () {
    var self = this,
      i = 0,
      l = buttons.length;
    
    for (; i < l; i++) {
      buttons[i].addEventListener('click', function (e) {
        var cls = e.target.className,
          handler;
        if (self.submitRe.test(cls)) {
          self.handleSubmit();
          e.stopPropagation();
          return false;
        } else {
          handler = self.settings[cls];
          if (handler) {
            e.preventDefault();
            e.stopPropagation();
            handler();
            return false;
          }
        }
        // fall through
      }, true);
    }
  };
  
  Reformer.prototype.clearAll = function () {
    this.fields.forEach(function (field) {
      field.inputEl.value = '';
      field.errors = [];
    });
    return true;
  };
  
  Reformer.prototype.validate = function (cb) {
    var self = this,
      isValid = true;
    
  };
  
  Reformer.prototype.domify = function (str) {
    var div = document.createElement('div');
    div.innerHTML = str;
    return div.querySelector('form');
  };

  window.Reformer = Reformer;
})(window);