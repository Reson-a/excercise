'use strict'

//修改av为对应视频编号即可
const avID = 'av7260153'

const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const util = require('util');
const path = require('path');
const url = 'http://www.bilibili.com/video/' + avID + '/';

const options = {
    url,
    gzip: true,
    method: 'GET',
    encoding: 'utf-8'
}


let videoMsg = {
    title: '',
    author: '',
    category: '',
    time: '',
    avID,
    chatID: '',
    danmaku: []
};


//获取视频名称及chaiID
request(options, function(err, res, body) {
    getVideoMsg(body);
    //let dir = path.resolve(__dirname, danmaku.name + '.txt');
    //writeData(dir, danmaku.data);

}).on('error', (err) => { console.log(err); });

function getVideoMsg(html) {
    let $ = cheerio.load(html);
    videoMsg.title = $('.v-title').text();
    videoMsg.author = $('.usname .name').text();
    videoMsg.time = $('.tminfo time i').text();
    videoMsg.category = $('.tminfo span a').text();
    videoMsg.chatID = $('script').text().constructor.toString();
    console.log(videoMsg);
}

function writeData(path, data) { //将数据作为字符串写入文件
    fs.writeFile(path, util.inspect(data), (err) => {
        if (err) return console.log(err);
    });
}