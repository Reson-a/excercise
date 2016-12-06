'use strict'

//修改此处url即可
const url = 'http://www.bilibili.com/video/av7260153/';

const request = require('request');
const cheerio = require('cheerio');
const xml2js = require('xml2js');
const http = require('http');
const fs = require('fs');
const util = require('util');
const path = require('path');

const options = {
    url,
    gzip: true,
    method: 'GET',
    //encoding: 'utf-8'
}

let videoMsg = {
    title: '',
    author: '',
    category: '',
    time: '',
    aid: '',
    cid: '',
    details: {},
    //danmaku: []
};


//获取视频名称及chaiID
request(options, function(err, res, body) {
    getVideoMsg(body);
    //getDanmaku(videoMsg.cid);


}).on('error', (err) => { console.log(err); });

function getVideoMsg(html) {
    let $ = cheerio.load(html);
    videoMsg.title = $('.v-title').text();
    videoMsg.author = $('.usname .name').text();
    videoMsg.time = $('.tminfo time i').text();
    videoMsg.category = $('.tminfo span a').text();
    videoMsg.cid = $('script').text().match(/cid=([^&]+)/)[1]; //获取aid
    videoMsg.aid = $('script').text().match(/aid=([^&]+)/)[1]; //获取cid

    getDetails();
}

function getDetails() {
    //根据aid和cid调用接口获取详细信息
    request('http://interface.bilibili.com/player?cid=' + videoMsg.cid + '&aid=' + videoMsg.aid,
        function(err, res, body) {
            xml2js.parseString('<xml>' + body + '</xml>', { explicitArray: false }, function(err, json) {
                videoMsg.details = json["xml"]; //这里偷了个懒，应该把一部分无关信息筛掉
            });
            let dir = path.resolve(__dirname, 'av' + videoMsg.aid + '.rtf'); //指定路径写入文件
            writeData(dir, videoMsg);
        });
}

/*
function getDanmaku(chatID) {//这部分有乱码问题暂时没有解决
    request({
        url: 'http://comment.bilibili.com/' + chatID + '.xml?html5=1',
        method: 'GET',
        //encoding: null
    }, function(err, res, body) {
        //let str = iconv.decode(body, 'utf-8');
        //console.log(str);
        //console.log(xml2js.parseString(body));
        let $ = cheerio.load(body.toString());
        $('p').text();
        //console.log(videoMsg);
    });
}*/


//将数据作为字符串写入文件
function writeData(path, data) {
    fs.writeFile(path, util.inspect(data, true, null), (err) => {
        if (err) return console.log(err);
    });
}