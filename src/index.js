/*
* @self
* dom dom节点
* capture 事件捕获
* needBar 是否需要滚动轴
* barColor 滚动轴颜色
* barbgColor 滚动轴背景颜色
*/

function MyScrollbar (args) {

    var el = args.dom || null
    var capture = args.capture || false
    var needBar = args.needBar || false
    var barColor = args.barColor || '#ff6600'
    var barbgColor = args.barbgColor || 'rgba(0,0,0,.1)'

    var self = this
    this.sy = ''    //鼠标位置Y
    this.ost = ''   //滚动轴位置
    this.movey = '' // y轴运动距离
    this.afterCpTop = ''  // 滚动轴计算后位置
    if(!el){
        throw Error('no found element')
    }
    var elClass = el.getAttribute('class')
    el.setAttribute('class',elClass + ' sg-scrollbar')
    var content = el.querySelector('.content')
    if(!content){
        throw Error('please add the class name "content" to your child element ')
    }

    // 内容高度高于容器高度才展示滚动轴
    if(el.offsetHeight >= content.offsetHeight){
        needBar = false
    }
    // 生成滚动轴
    if(needBar){
        var barContainer = document.createElement('div')
        var bar = document.createElement('div')
        barContainer.setAttribute('class','scrollbar')
        barContainer.style.backgroundColor = barbgColor
        bar.setAttribute('class','bar')
        bar.style.backgroundColor = barColor
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
        var ph = 100 
        var ev = self.mouseEventCompat(event)
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
                barContainer.style.top = el.scrollTop + 'px'
            }
            
        }
        document.body.onmouseup = function(){
            self.sy = '' 
        }
    }
    this.mouseEventCompat = function(event){
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
    
}
// var _eventCompat = function (event) 
new MyScrollbar({
    dom:document.querySelector('.dd'),
    capture:false,
    needBar:true
})