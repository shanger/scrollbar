var addEvent = function (el, capture,needBar) {
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
        var item = el.querySelectorAll('li')
        var viewh = el.offsetHeight
        var totalh = item[0].offsetHeight * item.length
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
        var sy = '';
        var ost = ''
        barContainer.onmousedown = function(event){
            sy = event.pageY 
            ost = bar.offsetTop
        }
        var movey = ''
        var _top = ''
        barContainer.onmousemove = function(event){
            var y = event.pageY 
            if(sy!=''){
                movey = y-sy
                _top = ost + movey
                if(_top < 0){
                    _top = 0
                }
                if(_top > barContainer.offsetHeight - bar.offsetHeight){
                    _top = barContainer.offsetHeight - bar.offsetHeight
                }
                
                bar.style.top = _top + 'px'
                el.scrollTop = _top*totalh/viewh
                barContainer.style.top = el.scrollTop
            }
            
        }
        bar.onmouseup = function(){
            sy = '' 
        }
        bar.onmouseleave = function(){
            sy = '' 
        }
        bar.onmouseout = function(){
            sy = '' 
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
addEvent(document.querySelector('.dd'), false,false)