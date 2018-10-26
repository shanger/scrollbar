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
        barContainer.style.backgroundColor = this.barbgColor
        bar.setAttribute('class','sg-bar')
        bar.style.backgroundColor = this.barColor
        barContainer.appendChild(bar)
        this.el.appendChild(barContainer)
        var viewh = this.el.offsetHeight
        var totalh = content.offsetHeight
        bar.style.height = viewh/totalh*100 + '%'
    }
    var type = 'mousewheel'
    if (type === 'mousewheel' && document.mozFullScreen !== undefined) {
        type = 'DOMMouseScroll'
    }
    addevent(this.el, type, function (event) {
        event.stopPropagation()
        var ph = 100 
        var ev = self.mouseEventCompat(event)
        if (ev.delta > 0) {
            self.el.scrollTop -= ph                        
        } else {
            self.el.scrollTop += ph
        }
        if(self.needBar){
            barContainer.style.top = self.el.scrollTop + 'px'
            bar.style.top = self.el.scrollTop * self.el.offsetHeight/content.offsetHeight + 'px'
        }
    })
    if(this.needBar){
        addevent(barContainer, 'mousedown', function (event) {
            self.sy = event.pageY 
            self.ost = bar.offsetTop
        })
        addevent(document.body, 'mousemove', function (event) {
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
        addevent(document.body, 'mouseup', function (event) {
            self.sy = ''
        })
    }
    
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

function addevent (el, eventName, callback) {
    if (el.addEventListener) {
      el.addEventListener(eventName, callback, false)
    } else if (el.attachEvent) {
      el.attachEvent('on' + eventName, callback)
    }
}

// var _eventCompat = function (event) 
