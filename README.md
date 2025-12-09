
<div align="center">
  <h1>Cloudflare Email Register Filter</h1>
  
  [中文]() | [English]()

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
* 用另一个邮箱测试发邮件：邮件正文或标题内包含 `login`, `signup` 等字样，会转发，否则会屏蔽。目前支持中英双语关键词。
