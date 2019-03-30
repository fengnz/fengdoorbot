

## 这是一个开源项目，峰哥出品
# Telegram 电报聊天群管理机器人	

# 功能
## 欢迎消息
- 当有新人进群的时候，发送欢迎消息
- 欢迎消息支持30秒自毁 
- 支持设置欢迎消息的内容包含群描述和置顶消息
- 支持自定义欢迎消息
- 自定义欢迎消息支持使用变量，可以嵌入新成员的名字，群描述，置顶内容和链接等
- 欢迎消息可以在设置中关闭，30秒自毁功能也可以关闭
## 进群验证
- 支持开启进群验证功能
- 支持自动踢出在一定时间内没有完成验证的成员
- 支持定期清除到期未验证的成员
- 进群验证可以和欢迎消息一起使用，当两个功能都开启的时候，新成员要验证过后才能看到欢迎消息
- 验证过后，验证消息自毁

## 更多功能添加中， 欢迎有兴趣的小伙伴加入，欢迎 Pull Request
- 有兴趣的朋友加我的Telegram 电报群 https://t.me/fengsharegroup
- 本说明中不明确或错误之处，请有编辑权限的开发人员一起编辑完善， 比如我没有考虑到的一些新手容易碰到的问题

# 如何使用 
	这只是一个简要的说明，可能不太适合新手，更多说明正在编辑中


- 克隆或者下载本代码，开发者请fork, 希望大家能一起提交pull request
- 更改 Const.js 里面的变量， 主要是你自己机器人的token
- 安装 nodejs (npm)
- 安装谷歌 clasp
- clasp login 登录谷歌
- clasp create 创建一个Google Apps Script 的项目
- clasp push 推送代码到谷歌
- clasp deploy 发布

然后到 [https://script.google.com/home](https://script.google.com/home) 找到你刚刚用clasp create 创建的项目, 

打住，找到项目后， 剩下的你就应该会了， 如果你还没有做过任何的 Telegram 电报聊天机器人，可以到这个Youtube 播放列表看看我的视频 

[https://www.youtube.com/playlist?list=PL3dZh-p-vVofZ0BOQ4LnPlhJV3sVAQX8h](https://www.youtube.com/playlist?list=PL3dZh-p-vVofZ0BOQ4LnPlhJV3sVAQX8h)

只要看完前两集，花一小时做成功了回声机器人， 你就可以回来这里了使用这里的源码了

本机器人使用的是Restheart的MongoDB 数据库，没有的话可以联系峰哥，或者你可以直接使用源码中的数据库，它是工作的。

关联上机器人和数据库后先用 /initdb 命令初始化数据库， 这条命令会创建几个空的数据集。 这条命令是安全的，多次执行不会影响已经存在的数据集。

然后用 /help 开始

# 关于峰哥

更多峰哥的机器人
抽奖机器人 @fengdrawbot
关键字识别机器人 @fengfaqbot，可以删粗话，回复FAQ等
置顶机器人 @fengpinbot, 可以同时在频道和群中工作


以下是峰哥的 Youtube 频道与一些信息

本频道旨在分享生活中各种小技巧, 如用小米盒子看国内视频, 如何使用KODI看电影等等. 点击进入我的频道: goo.gl/5tyxcf

- 🔷 订阅我的频道： goo.gl/KuF3bY
- 🔷 telegram电报群: t.me/fengsharegroup
- 🔷 我的博客: www.dengnz.com/blog
- 🔷 Facebook: www.facebook.com/fengnz
- 🔷 Twitter: https://twitter.com/fennng

觉得我的视频对你帮助很大的话， 请我喝杯咖啡吧
微信赞赏码: goo.gl/uKoE8w



