/*!
 * simple-step
 * http://alex1990.github.com/simple-step
*/
!function(a){function b(b){if(b=this.opts=a.extend({},c,b),!b.el)throw"Need the selector";this.$el=a(b.el),this.btns={cancel:this.$el.find(".step-footer .step-cancel"),prev:this.$el.find(".step-footer .step-prev"),next:this.$el.find(".step-footer .step-next"),finish:this.$el.find(".step-footer .step-finish")},this.prevEnabled=this.nextEnabled=!0,this.index=b.startAt,this.totalCount=this.$el.find(".step-header-item").length,this.init()}var c={el:"",effect:"none",duration:350,startAt:0,showCancel:!0,showPrev:!0,showNext:!0,showFinish:!1,activeCls:"active",activatedCls:"activated",onprev:a.noop,onnext:a.noop,oncancel:a.noop,onfinish:a.noop,onbeforeprev:a.noop,onbeforenext:a.noop};a.extend(b.prototype,{init:function(){this.initButtons(),this.bindEvents()},initButtons:function(){this.opts.showCancel||this.btns.cancel.remove(),this.opts.showPrev||this.btns.prev.remove(),this.gotoStep(this.index)},bindEvents:function(){var a=this;a.$el.delegate(".step-footer .step-cancel","click",function(){a.cancel()}).delegate(".step-footer .step-finish","click",function(){a.finish()}).delegate(".step-footer .step-prev","click",function(){a.opts.onbeforeprev.call(this,this.index),a.prevEnabled&&a.prev()}).delegate(".step-footer .step-next","click",function(){a.opts.onbeforenext.call(this,this.index),a.nextEnabled&&a.next()})},index:function(){return this.index},gotoStep:function(b,c){this.index=b;var d=this.$el.find(".step-header-item").eq(b),e=a(d.data("body")),f=this.sequence?this.opts.effect:"none";if(this.sequence&&!this.isSetDimension){var g=this.$el.find(".step-body");this.stepBodyWidth=g.width(),g.css({position:"relative",width:this.stepBodyWidth,height:g.height(),overflow:"hidden"}),g.find(".step-body-item").css({position:"absolute",top:0,left:0,width:"100%"})}this.effectExecutors[f].call(this,d,e,c);var h=this.btns;0>=b?h.prev.hide():h.prev.show(),b>=this.totalCount-1?(h.next.hide(),h.finish.show()):(h.next.show(),h.finish.hide()),this.opts.showFinish&&h.finish.show()},prev:function(){this.index>0&&(this.index--,this.sequence="prev",this.gotoStep(this.index,this.opts.onprev))},next:function(){this.index<this.totalCount-1&&(this.index++,this.sequence="next",this.gotoStep(this.index,this.opts.onnext))},cancel:function(){this.opts.oncancel.call(this,this.index)},finish:function(){this.opts.onfinish.call(this,this.index)},activeClass:function(a,b){var c=this.opts.activeCls,d=this.opts.activatedCls;a.siblings(".step-header-item").removeClass(c+" "+d).end().addClass(c).removeClass(d).prevAll(".step-header-item").addClass(d),b.siblings(".step-body-item").removeClass(c+" "+d).end().addClass(c).removeClass(d).prevAll(".step-body-item").addClass(d)},effectExecutors:{none:function(a,b,c){this.activeClass(a,b),c&&c.call(this,this.index)},slide:function(a,b,c){var d=this,e={prev:{left:-d.stepBodyWidth,$el:b.next(".step-body-item")},next:{left:d.stepBodyWidth,$el:b.prev(".step-body-item")}};b.css({left:e[d.sequence].left}).show().animate({left:0},d.opts.duration,function(){e[d.sequence].$el.hide(),d.activeClass(a,b),c&&c.call(d,d.index)}),e[d.sequence].$el.animate({left:-e[d.sequence].left},d.opts.duration)}}});var d=a.fn.step;a.fn.step=function(c){return c=a.extend({el:this},c),new b(c)},a.fn.step.noConflict=d}(jQuery);