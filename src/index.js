/*
* @self
* dom dom节点
* capture 事件捕获
* needBar 是否需要滚动轴
* barColor 滚动轴颜色
* barbgColor 滚动轴背景颜色
*/

function MyScrollbar (args) {
    this.el = args.dom || null
    this.capture = args.capture || false
    this.needBar = args.needBar || false
    this.barColor = args.barColor || '#ff6600'
    this.barbgColor = args.barbgColor || 'rgba(0,0,0,.1)'
    
    this.sy = ''    //鼠标位置Y
    this.ost = ''   //滚动轴位置
    this.movey = '' // y轴运动距离
    this.afterCpTop = ''  // 滚动轴计算后位置
}
MyScrollbar.prototype.init = function(){
    var self = this 
    if(!this.el){
        throw Error('no found element')
    }
    var elClass = this.el.getAttribute('class')
    this.el.setAttribute('class',elClass + ' sg-scrollbar')
    this.setStyle(this.el,{
        overflow: 'hidden',
        position: 'relative'
    })
    var content = this.el.querySelector('.content')
    if(!content){
        throw Error('please add the class name "content" to your child element ')
    }

    // 内容高度高于容器高度才展示滚动轴
    if(this.el.offsetHeight >= content.offsetHeight){
        this.needBar = false
    }
    // 生成滚动轴
    if(this.needBar && !this.el.querySelector('.sg-scrollbar')){
        var barContainer = document.createElement('div')
        var bar = document.createElement('div')
        barContainer.setAttribute('class','sg-bar-contanier')
        this.setStyle(barContainer,{
            position: 'absolute',
            zIndex: 1,
            height: '100%',
            width: '6px',
            borderRadius: '5px',
            top: 0,
            right: 0,
            backgroundColor: this.barbgColor
        })
        bar.setAttribute('class','sg-bar')
        this.setStyle(bar,{
            position: 'absolute',
            width: '6px',
            borderRadius: '5px',
            top: 0,
            right: 0,
            opacity: 0.4,
            backgroundColor: this.barColor
        })
        barContainer.appendChild(bar)
        this.el.appendChild(barContainer)
        var viewh = this.el.offsetHeight
        var totalh = content.offsetHeight
        bar.style.height = viewh/totalh*100 + '%'

        // 绑定事件
        addevent(barContainer, 'mousedown', function (event) {
            self.sy = event.pageY 
            self.ost = bar.offsetTop
        })
        addevent(barContainer, 'mouseover', function (event) {
            self.setStyle(bar,{
                opacity: 1
            })
        })
        addevent(document.body, 'mousemove', this.bodyMouseMove.bind(this))
        addevent(document.body, 'mouseup', this.bodyMouseUp.bind(this))
    }
    var type = 'mousewheel'
    if (type === 'mousewheel' && document.mozFullScreen !== undefined) {
        type = 'DOMMouseScroll'
    }
    addevent(this.el, type, this.mainOption.bind(this))    
}
MyScrollbar.prototype.mouseEventCompat = function(event){
    var type = event.type
    if (type === 'DOMMouseScroll' || type === 'mousewheel') {
        event.delta = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3
    }
    if (event.srcElement && !event.target) {
        event.target = event.srcElement
    }
    if (!event.preventDefault && event.returnValue !== undefined) {
        event.preventDefault = function () {
        event.returnValue = false
        }
    }
    return event
}
MyScrollbar.prototype.setStyle = function(el,style){
    for(var key in style){
        el.style[key] = style[key]
    }
}
MyScrollbar.prototype.mainOption = function(event){
    event.stopPropagation()
    var content = document.querySelector('.content')
    var ph = 100 
    var ev = this.mouseEventCompat(event)
    if (ev.delta > 0) {
        this.el.scrollTop -= ph                        
    } else {
        this.el.scrollTop += ph
    }
    if(this.needBar){
        var barContainer = document.querySelector('.sg-scrollbar .sg-bar-contanier')
        var bar = document.querySelector('.sg-scrollbar .sg-bar')
        barContainer.style.top = this.el.scrollTop + 'px'
        bar.style.top = this.el.scrollTop * this.el.offsetHeight/content.offsetHeight + 'px'
    }
}
MyScrollbar.prototype.bodyMouseMove = function(event){
    var barContainer = document.querySelector('.sg-scrollbar .sg-bar-contanier')
    var bar = document.querySelector('.sg-scrollbar .sg-bar')
    if(barContainer){
        var y = event.pageY
        var viewh = this.el.offsetHeight
        var totalh = document.querySelector('.content').offsetHeight          
        if(this.sy !== ''){
            this.movey = y-this.sy
            this.afterCpTop = this.ost + this.movey
            if(this.afterCpTop < 0){
                this.afterCpTop = 0
            }
            if(this.afterCpTop > barContainer.offsetHeight - bar.offsetHeight){
                this.afterCpTop = barContainer.offsetHeight - bar.offsetHeight
            }
            
            bar.style.top = this.afterCpTop + 'px'
            this.el.scrollTop = this.afterCpTop*totalh/viewh
            barContainer.style.top = this.el.scrollTop + 'px'
        }
    }
    
}

MyScrollbar.prototype.bodyMouseUp = function(event){
    var bar = document.querySelector('.sg-scrollbar .sg-bar')
    if(bar){
        this.sy = ''
        this.setStyle(bar,{
            opacity: 0.4
        })
    }
    
}

// 销毁
MyScrollbar.prototype.destory = function(){
    if(this.needBar){
        offEvent(document.body, 'mousemove', this.bodyMouseMove.bind(this))
        offEvent(document.body, 'mouseup', this.bodyMouseUp.bind(this))
        var bar = document.querySelector('.sg-bar-contanier')
        bar&&this.el.removeChild(bar)
    }
    var elClass = this.el.getAttribute('class')
    this.el.setAttribute('class',elClass.replace(/sg-scrollbar/,''))    
}

function addevent (el, eventName, callback) {
    if (el.addEventListener) {
      el.addEventListener(eventName, callback, false)
    } else if (el.attachEvent) {
      el.attachEvent('on' + eventName, callback)
    }
}
function offEvent (el, eventName, callback) {
    if (el.removeEventListener) {
      el.removeEventListener(eventName, callback, false)
    } else if (el.attachEvent) {
      el.detachEvent('on' + eventName, callback)
    }
}

// var _eventCompat = function (event) 