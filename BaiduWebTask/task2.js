function isArray(arr) {
    return Object.prototype.toString.call(arr).slice(8, -1) === 'Array';
}

function isFunction(fn) {
    return fn.constructor.toString().match(/function\s([^(]*)/)[1] === 'Function';
} //


// 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
// 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
function cloneObject(src) {
    var result = {};
    for (var o in src) {
        if (typeof src[o] === "object") {
            result[o] = cloneObject(src[o])
        } else {
            result[o] = src[o];
        }
    }
    return result;
    // your implement
}

// 测试用例：
var srcObj = {
    a: 1,
    b: {
        b1: ["hello", "hi"],
        b2: "JavaScript"
    }
};
var abObj = srcObj;
var tarObj = cloneObject(srcObj);

srcObj.a = 2;
srcObj.b.b1[0] = "Hello";

console.log(abObj.a);
console.log(abObj.b.b1[0]);

console.log(tarObj.a); // 1
console.log(tarObj.b.b1[0]); // "hello"


// 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
function uniqArray1(arr) {
    return [...new Set(arr)];
}

// 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
function uniqArray2(arr) {
    var res = [];
    for (var i = 0; i < arr.length; i++) {
        if (res.indexOf[arr[i]] < 0) {
            res.push(arr[i]);
        }
    }
    return res;
}
// 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
function uniqArray3(arr) { //112451
    var res = [];
    for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) j = ++i;
        }
        res.push(arr[i]);
    }
    return res;
}

// 很多同学肯定对于上面的代码看不下去，接下来，我们真正实现一个trim
// 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
// 尝试使用一行简洁的正则表达式完成该题目
function trim(str) {
    return (/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    // your implement
}

// 使用示例
var str = '   hi!  ';
str = trim(str);
console.log(str); // 'hi!'

// 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
function each(arr, fn) {
    for (var i = 0; i < arr.length; i++) {
        fn(arr[i], i);
    }
}

// 其中fn函数可以接受两个参数：item和index

// 使用示例
var arr = ['java', 'c', 'php', 'html'];

function output(item) {
    console.log(item)
}
each(arr, output); // java, c, php, html

// 使用示例
var arr = ['java', 'c', 'php', 'html'];

function output(item, index) {
    console.log(index + ': ' + item)
}
each(arr, output); // 0:java, 1:c, 2:php, 3:html

// 获取一个对象里面第一层元素的数量，返回一个整数
function getObjectLength(obj) {
    return Object.getOwnPropertyNames(obj).length;
}

// 使用示例
var obj = {
    a: 1,
    b: 2,
    c: {
        c1: 3,
        c2: 4
    }
};
console.log(getObjectLength(obj)); // 3

// 判断是否为邮箱地址
function isEmail(emailStr) {
    return /^\w+@\w+\.\w+$/.test(emailStr);
    // your implement
}

// 判断是否为手机号
function isMobilePhone(phone) {
    return /^1\d{9}$/.test(phone);
    // your implement
}

// 为element增加一个样式名为newClassName的新样式
function addClass(element, newClassName) {
    if (('' + element.className + '').indexOf(' ' + newClassName + ' ') < 0)
        element.className += ' ' + newClassName;
    // your implement
}

// 移除element中的样式oldClassName
function removeClass(element, oldClassName) {
    // your implement
    element.className = (' ' + element.className + ' ').replace(' ' + oldClassName + ' ', '').trim();
}

// 判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值
function isSiblingNode(element, siblingNode) {
    // your implement
    return element.parentNode === siblingNode.parentNode && element === siblingNode;
}

// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(element) {
    return {
        x: element.clientTop,
        y: element.clientLeft
    }
    // your implement
}
// your implement

//获取element相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(element) {
    var pos = {
        x: element.offsetTop,
        y: element.offsetLeft
    }
    if (element.offsetParent != null) {
        var posParent = getPosition(element.offsetParent);
        pos.x += posParent.x;
        pos.y += posParent.y;
    }
    return pos;
}
