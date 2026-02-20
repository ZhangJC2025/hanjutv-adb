// ==UserScript==
// @name         hanju-adb
// @namespace    https://github.com/ZhangJC2025/hanjutv-adb/
// @version      1.0.1
// @description  fuck hanju1.tv's adult ads
// @author       ZhangJC
// @match        *://hanju1.tv/*
// @icon         https://youke.xn--y7xa690gmna.cn/s1/2026/02/20/6997d69af32ab.ico
// @license      MIT
// @grant        none
// ==/UserScript==
 
(function() {
    'use strict';
 
    function blockAds() {
        document.querySelectorAll('*').forEach(x=> {if (getComputedStyle(x).zIndex === '2147483646') {x.remove();}})
    }
 
    setInterval(blockAds, 1000);
})();