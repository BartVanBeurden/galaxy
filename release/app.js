!function e(t,r,n){function a(o,s){if(!r[o]){if(!t[o]){var d="function"==typeof require&&require;if(!s&&d)return d(o,!0);if(i)return i(o,!0);var u=new Error("Cannot find module '"+o+"'");throw u.code="MODULE_NOT_FOUND",u}var c=r[o]={exports:{}};t[o][0].call(c.exports,function(e){var r=t[o][1][e];return a(r?r:e)},c,c.exports,e,t,r,n)}return r[o].exports}for(var i="function"==typeof require&&require,o=0;o<n.length;o++)a(n[o]);return a}({1:[function(e,t,r){var n=function(e,t,r){this._context=e,this._window=t,this._viewport=r,this._image=e.createImageData(r.width,r.height),this._buffer=new ArrayBuffer(r.width*r.height*4),this._worker=new Worker("./worker.js"),this._readyState=n.ReadyState.IDLE,this._worker.postMessage({type:"setWindow",window:this._window}),this._worker.postMessage({type:"setViewport",viewport:this._viewport}),this._worker.onmessage=function(e){switch(e.data.type){case"render":this._buffer=e.data.buffer,this._image.data.set(new Uint8ClampedArray(this._buffer)),this._readyState=n.ReadyState.READY;break;case"error":this._readyState=n.ReadyState.ERROR}}.bind(this)};n.create=function(e,t,r){return new n(e,t,r)},n.ReadyState={IDLE:"IDLE",READY:"READY",WORKING:"WORKING",ERROR:"ERROR"},n.prototype.getReadyState=function(){return this._readyState},n.prototype.bindPlanet=function(e){this._worker.postMessage({type:"setPlanet",planet:e})},n.prototype.render=function(e){switch(this._readyState){case n.ReadyState.IDLE:return this._readyState=n.ReadyState.WORKING,this._worker.postMessage({type:"render",angle:e,buffer:this._buffer},[this._buffer]),!0;case n.ReadyState.WORKING:return!1;default:return}},n.prototype.draw=function(){this._context.putImageData(this._image,this._viewport.x,this._viewport.y),this._readyState=n.ReadyState.IDLE},n.prototype.destroy=function(){this._worker.terminate()},t.exports=n},{}],2:[function(e,t,r){var n=e("./ViewRegion.js"),a=function(e,t){return function(r){return r[e].apply(r,t)}},i=function(e){var t=4,r=window.navigator.hardwareConcurrency||t,n=e%r;return n?r-n:r},o=function(){var e=document.querySelector("[name='view']"),t=document.querySelector("[name='planet.seed']"),r=document.querySelector("[name='view.animate']"),o=document.querySelector("[name='view.detail']"),s=e.getContext("2d"),d=0,u=!1,c=[],h={seed:0,detail:3},f=function(t){e.width=t,e.height=t,c.forEach(a("destroy")),c=[];for(var r=i(t),o=1/r,d=0;r>d;d++){var u={width:1,height:o,x:0,y:d*o},h={width:t,height:t*o,x:0,y:d*t*o};c[d]=n.create(s,u,h)}},w=function(e){h.detail=e,f(8<<e),c.forEach(a("bindPlanet",[h]))},p=function(e){h.seed=e,c.forEach(a("bindPlanet",[h]))},y=function(e){u=e},_=function(e){var t=c.reduce(function(e,t){return t.getReadyState()==n.ReadyState.READY?e+1:e},0)==c.length;t&&(c.forEach(a("draw")),u&&(d+=Math.PI/180)),c.forEach(a("render",[d])),(!t||u)&&window.requestAnimationFrame(_)};_.lastTimestamp=0,t.addEventListener("change",function(){p(parseInt(t.value)),u||_()}),r.addEventListener("change",function(){y(r.checked),u&&_()}),o.addEventListener("change",function(){w(parseInt(o.value)),u||_()}),p(parseInt(t.value),parseInt(o.value)),y(r.checked),w(parseInt(o.value)),_()};"interactive"==document.readyState?o():document.addEventListener("DOMContentLoaded",o)},{"./ViewRegion.js":1}]},{},[2]);
