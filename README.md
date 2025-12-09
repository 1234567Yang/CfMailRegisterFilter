
<div align="center">
  <h1>Cloudflare Email Register Filter</h1>
  
  [中文](https://github.com/1234567Yang/CfMailRegisterFilter) | [English](https://github-com.translate.goog/1234567Yang/CfMailRegisterFilter?_x_tr_sl=zh-CN&_x_tr_tl=en&_x_tr_hl=zh-CN&_x_tr_pto=wapp)

</div>

## 使用前提

买个域名，绑定至 Cloudflare 。

## 使用教程

* 自己域名底下开启邮件转发，教程可以 [看这里](https://www.cloudflare.com/zh-cn/developer-platform/products/email-routing/) 。
* 放个 `all-spam-and-promote-go-here@yourdomain.com`
  * 邮件转发至 Cloudflare email worker
* 把 `worker.js` 粘贴进去，然后 `TARGET_EMAIL_ADDR` 选择你要转发到的地址
  * 实测发现如果转发至另一个 Cloudflare 名下的域名，即使另一个收件规则是 `FORWARD` ，会无效（比如：`all-spam-and-promote-go-here@yourdomain.com` 不能转发至 `hello@yourdomain.com` 或  `also_hosted_on_cloudflare@yourotherdomain.com`）。不知道是否属于 Cloudflare 的 BUG。
  * 最好是你自己的 Gmail 或 Outlook
* 如果真的是人工手动发送的重要邮件，那么应该会查看回复。你可以在 `SECOND_EMAIL_ADDR` 输入你希望他发送到的地址，在被邮件过滤器拦截后会自动回复一封邮件，显示 `[Auto reply] No verification/signup/login keywords found. If this is not a spam, please send to SECOND_EMAIL_ADDR . If this is a spam: 你推销邮件在狗叫什么？"`
* 有三种模式，轻松模式、正常模式 和 强力模式。可以通过 `EMAIL_FILTERING_STRENGTH` 设置。
  * 轻松模式：仅检测黑名单字符（如：promotion、促销、优惠等），如果未发现就自动转发。（0）
  * 正常模式：检测白名单字符（如：verification、验证、注册等），如果发现了就自动转发。（1）
  * 强力模式：不仅先检测白名单字符，还会再过滤一遍黑名单字符。只有出现了白名单字符 并且 没有出现黑名单字符，才会转发。（默认，2）
  * 如果设置了其它数值，则不过滤。
* 用另一个邮箱测试发邮件：邮件正文或标题内包含 `login`, `signup` 等字样，会转发，否则会屏蔽。目前支持中英双语关键词。
* 下次注册**小平台/无关紧要的平台**的时候，使用 `all-spam-and-promote-go-here@yourdomain.com`。
  * 警告：非常不建议使用这个注册重要的平台，如自己的 VPS，长期频繁使用的账号等。这里点名批评阿里云推销邮件，根本退订不了。
  * 提示：如果因为邮件过滤错过优惠码概不负责。

## 杂记

使用了此脚本后 ~~腿不酸了，腰不痛了~~ ，推销邮件好久都不见了，有点怀念捏。
