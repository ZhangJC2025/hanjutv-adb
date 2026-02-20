// ==UserScript==
// @name         Fuck hanju1.tv's ads
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Block ads in https://hanju1.tv/
// @author       ZhangJC
// @match        *://hanju1.tv/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @icon         https://icon.bqb.cool/?url=https://hanju1.tv/
// ==/UserScript==

(function() {
    'use strict';
    
    const urlPattern = /^(https|ws|wss):\/\/[a-z0-9]+\.[a-z0-9]+\.[a-z]{2,3}:\d{1,6}\/([a-z]{1,3}\/){0,1}\d+\?[a-z]+=[a-z0-9]+($|&)/;
    
    function isUrlMatched(url) {
        if (!url) return false;
        return urlPattern.test(url);
    }
    
    // 1. 拦截脚本加载（多种方式）
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        const element = originalCreateElement.call(document, tagName);
        
        if (tagName.toLowerCase() === 'script') {
            // 拦截 setAttribute
            const originalSetAttribute = element.setAttribute;
            element.setAttribute = function(name, value) {
                if (name === 'src' && isUrlMatched(value)) {
                    console.log('[Blocked] Script src attribute:', value);
                    return;
                }
                return originalSetAttribute.call(this, name, value);
            };
            
            // 拦截属性设置
            Object.defineProperty(element, 'src', {
                set: function(value) {
                    if (isUrlMatched(value)) {
                        console.log('[Blocked] Script src property:', value);
                        return;
                    }
                    originalSetAttribute.call(this, 'src', value);
                },
                get: function() {
                    return originalGetAttribute ? originalGetAttribute.call(this, 'src') : '';
                }
            });
        }
        
        return element;
    };
    
    // 2. 拦截动态添加的脚本
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeName === 'SCRIPT' && node.src && isUrlMatched(node.src)) {
                    console.log('[Blocked] Dynamically added script:', node.src);
                    node.src = ''; // 清空 src
                    node.type = 'javascript/blocked'; // 更改类型使其不执行
                }
            });
        });
    });
    
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
    
    // 3. 正确拦截 WebSocket
    const OriginalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        if (isUrlMatched(url)) {
            console.log('[Blocked] WebSocket connection:', url);
            // 返回一个不会真正连接的对象
            return {
                send: function() {},
                close: function() {},
                readyState: 3 // CLOSED
            };
        }
        return new OriginalWebSocket(url, protocols);
    };
    
    // 保留原型链
    window.WebSocket.prototype = OriginalWebSocket.prototype;
    window.WebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
    window.WebSocket.OPEN = OriginalWebSocket.OPEN;
    window.WebSocket.CLOSING = OriginalWebSocket.CLOSING;
    window.WebSocket.CLOSED = OriginalWebSocket.CLOSED;
    
    // 4. 拦截通过脚本注入方式
    const originalAppendChild = Node.prototype.appendChild;
    Node.prototype.appendChild = function(node) {
        if (node.nodeName === 'SCRIPT' && node.src && isUrlMatched(node.src)) {
            console.log('[Blocked] Script appendChild:', node.src);
            return node; // 返回但不添加
        }
        return originalAppendChild.call(this, node);
    };
    
    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function(newNode, referenceNode) {
        if (newNode.nodeName === 'SCRIPT' && newNode.src && isUrlMatched(newNode.src)) {
            console.log('[Blocked] Script insertBefore:', newNode.src);
            return newNode; // 返回但不插入
        }
        return originalInsertBefore.call(this, newNode, referenceNode);
    };
    
    console.log('Resource blocker initialized');
})();