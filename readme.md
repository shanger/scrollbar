# MyScrollbar

> 简单的自定义滚动轴
* 滚动轴可选
* 滚动轴颜色可定义


# how to use

## npm
npm install scrollbar

`import MyScrollbar from 'sg-scrollbar'`

`var mybar = new MyScrollbar({
    dom:document.querySelector('.dd'),
    needBar:true
})
`

`mybar.init()
`
## 直接引入
`<script src="src/index.js"></script>`

`var mybar = new MyScrollbar({
    dom:document.querySelector('.dd'),
    needBar:true
})
`

`mybar.init()
`

# destory

`mybar.destory()`

`mybar = null`