# Fold Chair PTT

一個可以永遠讓視窗浮動在最上面的 PTT 持續追蹤推文工具。

為什麼叫折凳 PTT ?

因為折凳的奧妙之處，就是可以藏在民居之中，隨手可得，還可以坐著它來隱藏殺機，就算被警察抓到也告不了你。

同理，Fold Chair PTT 可以隱藏在桌面各個角落，關注留言不中斷。

好拉我承認是用來看 PTT 股版閒聊用的，不過某些時刻也可以用來看其他版的推文。

## DEMO

[![YT DEOM](http://img.youtube.com/vi/FTYzaqCdMTs/0.jpg)](http://www.youtube.com/watch?v=FTYzaqCdMTs)

點擊上方圖片觀看 Youtube Demo

## 下載

[MacOS v1.0.0](https://drive.google.com/file/d/1jWpvlBCL5CQvN7FsDVorxIu3y5It93zK/view?usp=sharing)

[Windows v0.0.1](https://drive.google.com/file/d/1CoETduVhbDtcKNlWMOzxd-Mp2evzStR3/view?usp=sharing)

## 自建

如果你對已經打包好的執行檔不放心，反正都開源了，可以自己打包，本程式是用 electron 建制的，細節查一下 Chatgpt 就好，大致流程如下：

```bash
npm install
npm run build
# 應該就能在 ./release 找到執行檔了
```

## Versions

### 1.0.0

* 可以過濾名單
* 版本更新通知
* 點入文章的時候不要出現滾動效果
* 偵測圖片有沒有辦法顯示，沒有就顯示 url
* 連結不要顯示 <a> 而是 url
* 如果即時資料沒有工作，就重新去獲取即時資料的 token，而不是刷新整個頁面
* 取消 Loading 動畫，顯得比較不煩躁
* 1秒更新的時候不會反覆閃爍更新按鈕
* 訊息捲動速度不再需要刷新文章
