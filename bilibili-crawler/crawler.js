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

//request参数配置
const options = {
    url,
    gzip: true,
    method: 'GET',
    //encoding: 'utf-8'
}

getBodyAsnyc(options)
    .then(getVideoMsgAsnyc)
    .then((msg) => {
        return Promise.all([getDetailsAsnyc(msg), getDanmakuAsnyc(msg)]); //并行异步操作都resolve之后再执行下一步
    }).then(writeData)
    .catch((error) => {
        console.log(error);
    });


//获取html文档信息
function getBodyAsnyc(options) {
    return new Promise(function(resolve, reject) {
        request(options, function(err, res, body) {
            if (err) return console.log(err);
            resolve(body);
        });
    });
}

//获取视频基本信息
function getVideoMsgAsnyc(body) {
    return new Promise(function(resolve, reject) {
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
        let $ = cheerio.load(body);
        videoMsg.title = $('.v-title').text();
        videoMsg.author = $('.usname .name').text();
        videoMsg.time = $('.tminfo time i').text();
        videoMsg.category = $('.tminfo span a').text();
        videoMsg.cid = $('script').text().match(/cid=([^&]+)/)[1]; //获取aid
        videoMsg.aid = $('script').text().match(/aid=([^&]+)/)[1]; //获取cid        
        resolve(videoMsg);
    })
}

//获取视频详细信息
function getDetailsAsnyc(msg) {
    return new Promise(function(resolve, reject) {
        request('http://interface.bilibili.com/player?cid=' + msg.cid + '&aid=' + msg.aid, //根据aid和cid调用接口
            function(err, res, body) {
                if (err) return console.log(err);
                xml2js.parseString('<xml>' + body + '</xml>', { explicitArray: false }, function(err, json) {
                    msg.details = json["xml"]; //这里偷了个懒，应该把一部分无关信息筛掉
                });
                resolve(msg);
            });
    });
}

//获取弹幕详细信息，这部分有乱码问题暂时没有解决
function getDanmakuAsnyc(msg) {
    return new Promise(function(resolve, reject) {
        /*
        request({
            url: 'http://comment.bilibili.com/' + msg.cid + '.xml?html5=1',
            method: 'GET',
            //encoding: null
        }, function(err, res, body) {
            //let str = iconv.decode(body, 'utf-8');
            //console.log(str);
            let $ = cheerio.load(body.toString());
            $('p').text();
        });*/
        resolve(msg);
    });
}

//将数据写入文件
function writeData(msg) {
    if (msg.length > 0) msg = msg[msg.length - 1]; //多个异步操作情况下只取一个数据
    let dir = path.resolve(__dirname, 'av' + msg.aid + '.rtf'); //指定路径写入文件 
    fs.writeFile(dir, util.inspect(msg, true, null), (err) => {
        if (err) return console.log(err);
    });
}