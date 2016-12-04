'use strict'

//修改av为对应视频编号即可
const av = 'av7260153'

const http = require('http');
const cheerio = require('cheerio');
const fs = require('fs');
const util = require('util');
const path = require('path');
const url = 'http://www.bilibili.com/video/' + av + '/';

http.get(url, function(res) {
    let html = '';
    res.on('data', (data) => { html += data; });

    res.on('end', () => {
        let data = danmakuFilter(html);
        let dir = path.resolve(_dirName)
        writeData(dir, data.data);
    })
}).on('error', (err) => { console.log(err); });

function danmakuFilter(html) {
    let $ = cheerio.load(html);
    let danmakus = $('.danmaku-info-row');
    let titleName = $('.v-title');
    let danmakuData = [];

    danmakus.each(function(item) {
        let danmaku = $(this);
        let time = danmaku.find('.danmaku-info-time').text();
        let date = danmaku.find('.danmaku-info-date').text();
        let content = danmaku.find('.danmaku-info-danmaku').text();
        danmakuData.push({
            time,
            date,
            content
        });
    });
    return {
        titleName,
        danmakuData
    };
}

function writeData(path, data) {
    fs.writeFile(path, util.inspect(data), (err) => {
        if (err) return console.log(err);
    });
}