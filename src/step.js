/*!
 * simple-step
 * http://alex1990.github.com/simple-step
*/
;(function($) {

    // Default settings.
    var defaults = {
        el             : '',                 // The container element or selector.
        effect         : 'none',             // The switch effect, 'none' or 'slide' supported.
        duration       : 350,                // The effect duration.
        startAt        : 0,                  // The index (zero-based) which is set the initial step.
        showCancel     : true,               // Whether to show the "cancel" button.
        showPrev       : true,               // Whether to show the "previous" button, which is hidden on the first step.
        showNext       : true,               // Whether to show the "next" button, which is hidden on the last step.
        showFinish     : false,              // Whether to show the "finish" button on every step.
        activatedCls   : 'activated',        // The previous displayed steps.
        activeCls      : 'active',           // The current step.
        onprev         : function(index) {}, // When switch to the previous step, this callback will be called.
        onnext         : function(index) {}, // When switch to the next step, this callback will be called.
        oncancel       : function(index) {}, // When trigger the "cancel" button, this callback will be called.
        onfinish       : function(index) {}, // When trigger the "finish" button, this callback will be called.
        onbeforeprev   : function(index) {}, // This callback will be called before switching to the previous step.
        onbeforenext   : function(index) {}  // This callback will be called before switching to the next step.
    };

    // The `Step` constructor.
    function Step(opts) {

        // Merge the settings.
        opts = this.opts = $.extend({}, defaults, opts);

        if (!opts.el) {
            throw 'Need the selector';
        }

        this.$el = $(opts.el);

        this.btns = {
            cancel : this.$el.find('.step-footer .step-cancel'),
            prev   : this.$el.find('.step-footer .step-prev'),
            next   : this.$el.find('.step-footer .step-next'),
            finish : this.$el.find('.step-footer .step-finish')
        };

        // Indicate and control if the previous and next buttons are enabled.
        this.prevEnabled = this.nextEnabled = true;

        this.index = opts.startAt;
        this.totalCount = this.$el.find('.step-header-item').length;

        this.init();
    }

    // All the prototype properties and methods.
    $.extend(Step.prototype, {

        init: function() {

            this.initButtons();
            this.bindEvents();
        },

        // Initialize the buttons.
        initButtons: function() {

            if (!this.opts.showCancel) {
                this.btns.cancel.remove();
            }
            if (!this.opts.showPrev) {
                this.btns.prev.remove();
            }

            this.gotoStep(this.index);
        },

        // Bind events to the buttons.
        bindEvents: function() {
            var self = this;

            self.$el
                .delegate('.step-footer .step-cancel', 'click', function(){
                    self.cancel();
                })
                .delegate('.step-footer .step-finish', 'click', function(){
                    self.finish();
                })
                .delegate('.step-footer .step-prev', 'click', function(){
                    self.opts.onbeforeprev.call(this, this.index);
                    self.prevEnabled && self.prev();
                })
                .delegate('.step-footer .step-next', 'click', function(){
                    self.opts.onbeforenext.call(this, this.index);
                    self.nextEnabled && self.next();
                });
        },

        // Return the index of the current step.
        index: function() {
            return this.index;
        },

        // Skip to the index (zero-based) step.
        gotoStep: function(index) {

            this.index = index;

            var $activeHeader = this.$el.find('.step-header-item').eq(index),
                $activeBody   = $($activeHeader.data('body'));

            var effect = this.sequence ? this.opts.effect : 'none';

            // When click the "previous" or "next" button, set the style of all the step bodies.
            // The reason why set the style in here is the width of the step bodies isn't your 
            // expected if the step is hidden at first.
            if (this.sequence && !this.isSetDimension) {
                var $stepBody = this.$el.find('.step-body');

                this.stepBodyWidth = $stepBody.width();

                $stepBody.css({
                    position: 'relative',
                    width: this.stepBodyWidth,
                    height: $stepBody.height(),
                    overflow: 'hidden'
                });

                $stepBody.find('.step-body-item').css({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                });
            }

            this.effectExecutors[effect].call(this, $activeHeader, $activeBody);

            var btns = this.btns;

            // Determine if the buttons is displayed or not
            if (index <= 0) {
                btns.prev.hide();
            } else {
                btns.prev.show();
            }

            if (index >= this.totalCount - 1) {
                btns.next.hide();
                btns.finish.show();
            } else {
                btns.next.show();
                btns.finish.hide();
            }

            if (this.opts.showFinish) {
                btns.finish.show();
            }
        },

        // Skip to the previous step.
        prev: function() {
            if (this.index > 0) {
                this.index--;
                this.sequence = 'prev';
                this.gotoStep(this.index);
            }
            this.opts.onprev.call(this, this.index);
        },

        // Skip to the next step.
        next: function() {
            if (this.index < this.totalCount - 1) {
                this.index++;
                this.sequence = 'next';
                this.gotoStep(this.index);
            }
            this.opts.onnext.call(this, this.index);
        },

        // Cancel the step.
        cancel: function() {
            this.opts.oncancel.call(this, this.index);
        },

        // Finish the step.
        finish: function() {
            this.opts.onfinish.call(this, this.index);
        },

        // Switch the `class` of the steps.
        // The value of the variable `activeCls` will be added to the current step.
        // And, the value of the variable `activatedCls` will be added to all the previous steps.
        activeClass: function($activeHeader, $activeBody) {
            var activeCls    = this.opts.activeCls,
                activatedCls = this.opts.activatedCls;

            $activeHeader.siblings('.step-header-item').removeClass(activeCls + ' ' + activatedCls)
                .end().addClass(activeCls).removeClass(activatedCls)
                .prevAll('.step-header-item').addClass(activatedCls);

            $activeBody.siblings('.step-body-item').removeClass(activeCls + ' ' + activatedCls)
                .end().addClass(activeCls).removeClass(activatedCls)
                .prevAll('.step-body-item').addClass(activatedCls);
        },

        // The switch effect executor.
        effectExecutors: {

            // None effect.
            none: function($activeHeader, $activeBody) {
                this.activeClass($activeHeader, $activeBody);
            },

            // Slide horizontally.
            slide: function($activeHeader, $activeBody) {
                var self = this,
                    sequenceMap = {
                        prev: {
                            left: -self.stepBodyWidth,
                            $el: $activeBody.next('.step-body-item')
                        },
                        next: {
                            left: self.stepBodyWidth,
                            $el: $activeBody.prev('.step-body-item')
                        }
                    };

                    $activeBody.css({
                            left: sequenceMap[self.sequence].left
                        })
                        .show()
                        .animate({
                            left: 0
                        }, self.opts.duration, function() {
                            sequenceMap[self.sequence].$el.hide();
                            self.activeClass($activeHeader, $activeBody);
                        });

                    sequenceMap[self.sequence].$el
                        .animate({
                            left: -sequenceMap[self.sequence].left
                        }, self.opts.duration);
            }
        }
    });

    var noConflict = $.fn.step;

    // Support the calling on the jQuery object.
    $.fn.step = function(opts) {
        opts = $.extend({el: this}, opts);
        return new Step(opts);
    };

    $.fn.step.noConflict = noConflict;

})(jQuery);