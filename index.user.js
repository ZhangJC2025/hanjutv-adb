// ==UserScript==
// @name         hanju-adb
// @namespace    https://github.com/ZhangJC2025/hanjutv-adb/
// @version      2026-02-20
// @description  fuck hanju1.tv's adult ads
// @author       ZhangJC
// @match        https://hanju1.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hanju1.tv
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.head.appendChild(document.createElement('style')).textContent = `[style*="z-index: 2147483646"] { display: none !important; }`;

    setInterval(() => {
        document.querySelectorAll('*').forEach(el => {
            if (getComputedStyle(el).zIndex === '2147483646') {
                el.remove();
            }
        });
    }, 100);
})();