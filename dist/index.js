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
    this.handlers = []
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
        this.addevent(barContainer, 'mousedown', function (event) {
            var event = window.event || event
            self.sy = event.pageY 
            self.ost = bar.offsetTop
        })
        this.addevent(barContainer, 'mouseover', function () {
            self.setStyle(bar,{
                opacity: 1
            })
        })
        this.addevent(document.body, 'mousemove', function(event){
            var event = window.event || event
            var y = event.pageY    
            if(self.sy !== ''){
                self.movey = y-self.sy
                self.afterCpTop = self.ost + self.movey
                if(self.afterCpTop < 0){
                    self.afterCpTop = 0
                }
                if(self.afterCpTop > barContainer.offsetHeight - bar.offsetHeight){
                    self.afterCpTop = barContainer.offsetHeight - bar.offsetHeight
                }
                
                bar.style.top = self.afterCpTop + 'px'
                self.el.scrollTop = self.afterCpTop*totalh/viewh
                barContainer.style.top = self.el.scrollTop + 'px'
            }
        })
        this.addevent(document.body, 'mouseup', function(){
            self.sy = ''
            self.setStyle(bar,{
                opacity: 0.4
            })
        })
    }
    var type = 'mousewheel'
    if (type === 'mousewheel' && document.mozFullScreen !== undefined) {
        type = 'DOMMouseScroll'
    }
    this.addevent(this.el, type, function(event){
        event.stopPropagation()
        var content = document.querySelector('.content')
        var ph = 100 
        var ev = self.mouseEventCompat(event)
        if (ev.delta > 0) {
            self.el.scrollTop -= ph                        
        } else {
            self.el.scrollTop += ph
        }
        if(self.needBar){
            var barContainer = document.querySelector('.sg-scrollbar .sg-bar-contanier')
            var bar = document.querySelector('.sg-scrollbar .sg-bar')
            barContainer.style.top = self.el.scrollTop + 'px'
            bar.style.top = self.el.scrollTop * self.el.offsetHeight/content.offsetHeight + 'px'
        }
    })    
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
        this.handlers.forEach(ele=>{
            this.offEvent(ele.el,ele.event,ele.callback)
        })
        this.offEvent(document.body, 'mousemove')
        this.offEvent(document.body, 'mouseup')
        var bar = document.querySelector('.sg-bar-contanier')
        bar&&this.el.removeChild(bar)
    }
    var elClass = this.el.getAttribute('class')
    this.el.setAttribute('class',elClass.replace(/sg-scrollbar/,''))    
}

MyScrollbar.prototype.addevent = function (el, eventName, callback) {
    this.handlers.push({
        el:el,
        event:eventName,
        callback:callback
    })
    if (el.addEventListener) {
      el.addEventListener(eventName, callback, false)
    } else if (el.attachEvent) {
      el.attachEvent('on' + eventName, callback)
    }
}
MyScrollbar.prototype.offEvent =function (el, eventName,callback) {
    if (el.removeEventListener) {
      el.removeEventListener(eventName, callback, false)
    } else if (el.attachEvent) {
      el.detachEvent('on' + eventName, callback)
    }
}

export default MyScrollbar

