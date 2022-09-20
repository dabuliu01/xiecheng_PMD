// 移动端轮播图功能和基本PC端一致
// 1.可以自动播放图片(自动播放功能)
// 1)开启定时器
// 2)移动端移动,可以使用translate移动(不需要加定位就能移动)
// 3)想要图片优雅地移动,请添加过渡效果
// 4)自动播放功能-无缝滚动
// 注意:我们判断条件是要等到图片滚动完毕再去判断,就是过渡完成后判断
// 此时需要添加检测过渡完成事件 transitionend
// 判断条件：如果索引号等于3 说明走到最后一张图片，此时索引号要复原为0
// 此时图片，去掉过渡效果，然后移动
// 如果索引号小于0，说明是倒着走，索引号等于2
// 此时图片，去掉过渡效果，然后移动
// 2.手指可以拖动播放轮播图
window.addEventListener('load', function () {
    // alert('你好');
    // 1.获取元素
    var focus = document.querySelector('.focus');
    var ul = focus.children[0];
    var ol = focus.children[1];
    // 获得focus的宽度
    var w = focus.offsetWidth;
    var index = 0;
    var timer = setInterval(function () {
        index++;
        var translatex = -index * w;
        ul.style.transition = 'all .3s'
        ul.style.transform = 'translateX(' + translatex + 'px)'
    }, 2000);
    // 等着我们过渡完成之后，再去判断，监听过渡完成的事件 transitionend
    ul.addEventListener('transitionend', function () {
        // 无缝滚动
        if (index >= 3) {
            index = 0;
            // 去掉过渡效果，这样让我们的ul 快速地跳到目标位置
            ul.style.transition = 'none';
            // 利用最新索引号乘以宽度 去滚动图片
            var translatex = -index * w;
            ul.style.transform = 'translateX(' + translatex + 'px)';
        } else if (index < 0) {
            // 如果索引号小于0，说明是倒着走，索引号等于
            index = 2;
            // 去掉过渡效果，这样让我们的ul 快速地跳到目标位置
            ul.style.transition = 'none';
            // 利用最新索引号乘以宽度 去滚动图片
            var translatex = -index * w;
            ul.style.transform = 'translateX(' + translatex + 'px)';
        }
        // 3.小圆点跟随变化效果(多选一)
        // 把ol里面li带有current类名的选出来去掉类名remove
        ol.querySelector('li.current').classList.remove('current');
        // 让当前索引号的li 加上current add
        ol.children[index].classList.add('current');
        // 但是，是等着过渡结束之后变化，所以这个写到transitioned事件里面
    });
    // 4.手指滑动轮播图
    // 本质就是ul跟随着手指移动，简单来说就是移动端拖动元素
    // 触摸元素touchstart:获取手指初始坐标
    // 移动手指touchmove:计算手指的滑动距离，并且移动盒子
    // 离开手指touchend:根据滑动的距离分不同情况
    // 如果移动距离小于某个像素 就弹回原来位置
    // 如果移动距离大于某个像素就上一张下一张滑动
    var startX = 0; // 获取手指初始坐标
    var moveX = 0; // 后面我们会使用这个移动距离，所以要定义一个全局变量
    var flag = false;
    ul.addEventListener('touchstart', function (e) {
        startX = e.targetTouches[0].pageX;
        // 手指触摸的时候就停止定时器
        clearInterval(timer);
    });
    ul.addEventListener('touchmove', function (e) {
        moveX = e.targetTouches[0].pageX - startX;
        // 移动盒子：盒子原来位置 + 手指移动距离
        var translatex = -index * w + moveX;
        // 手指拖动的时候，不需要动画效果，所以要取消过渡效果
        ul.style.transition = 'none';
        ul.style.transform = 'translateX(' + translatex + 'px)';
        flag = true; // 如果用户手指移动过，我们再去判断，否则不做判断效果
        e.preventDefault(); // 阻止默认行为（屏幕滚动）
    })
    // 手指离开 根据移动距离去判断是回弹还是播放上一张下一张
    ul.addEventListener('touchend', function (e) {
        if (flag) {
            // 1）如果移动距离大于50像素我们就播放上一张或者下一张
            // 因为moveX可能是正也可能是负  所以用 Math.abs 取绝对值
            if (Math.abs(moveX) > 50) {
                // 如果是右滑就是 播放上一张 moveX是正值
                if (moveX > 0) {
                    index--;
                } else {
                    // 如果是左滑就是 播放下一张 moveX是负值
                    index++;
                }
                var translatex = -index * w;
                ul.style.transition = 'all .3s';
                ul.style.transform = 'translateX(' + translatex + 'px)';
            } else {
                // 2）如果移动距离小于某个像素 就弹回原来位置
                var translatex = -index * w;
                ul.style.transition = 'all .1s';
                ul.style.transform = 'translateX(' + translatex + 'px)';
            }
        }
        // 手指离开的时候就重新开启定时器
        // 开启之前先清除定时器，这样能保证只有一个定时器在运行
        clearInterval(timer);
        timer = setInterval(function () {
            index++;
            var translatex = -index * w;
            ul.style.transition = 'all .3s'
            ul.style.transform = 'translateX(' + translatex + 'px)'
        }, 2000);
    })

    // 返回顶部模块制作
    // 滚动到某个地方显示
    // 事件：scroll页面滚动事件
    // 如果被卷去的头部(window.pageYOffset)大于某个值
    // 点击，window.scroll(0,0)返回顶部
    var goBack = document.querySelector('.goBack');
    var nav = document.querySelector('nav');
    window.addEventListener('scroll', function () {
        if (window.pageYOffset >= nav.offsetTop) {
            goBack.style.display = 'block';
        } else {
            goBack.style.display = 'none';
        }
    })
    goBack.addEventListener('click', function () {
        window.scroll(0, 0);
    })
})