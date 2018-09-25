var addEvent = function (el, capture,needBar) {

    this.sy = ''    //鼠标位置Y
    this.ost = ''   //滚动轴位置
    this.movey = '' // y轴运动距离
    this.afterCpTop = ''  // 滚动轴计算后位置
    var self = this
    if(!el){
        throw Error('no found element')
    }
    var content = document.querySelector('.content')
    // 生成滚动轴
    if(needBar){
        var barContainer = document.createElement('div')
        var bar = document.createElement('div')
        barContainer.setAttribute('class','scrollbar')
        bar.setAttribute('class','bar')
        barContainer.appendChild(bar)
        el.appendChild(barContainer)
        var viewh = el.offsetHeight
        var totalh = content.offsetHeight
        bar.style.height = viewh/totalh*100 + '%'
    }
    var type = 'mousewheel'
    if (type === 'mousewheel' && document.mozFullScreen !== undefined) {
        type = 'DOMMouseScroll'
    }
    el.addEventListener(type, function (event) {
        event.stopPropagation()
        var viewh = el.offsetHeight
        var totalh = content.offsetHeight
        var ph = (totalh - viewh) / 4
        var ev = _eventCompat(event)
        if (ev.delta > 0) {
            el.scrollTop -= ph                        
        } else {
            el.scrollTop += ph
        }
        if(needBar){
            barContainer.style.top = el.scrollTop + 'px'
            bar.style.top = el.scrollTop * el.offsetHeight/content.offsetHeight + 'px'
        }
        
    }, capture || false)
    if(needBar){
        barContainer.onmousedown = function(event){
            self.sy = event.pageY 
            self.ost = bar.offsetTop
        }
        document.body.onmousemove = function(event){
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
                el.scrollTop = self.afterCpTop*totalh/viewh
                barContainer.style.top = el.scrollTop
            }
            
        }
        document.body.onmouseup = function(){
            self.sy = '' 
        }
    }
    
}
var _eventCompat = function (event) {
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
addEvent(document.querySelector('.dd'), false,true)