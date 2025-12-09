export default {
  async email(message, env, ctx) {
    const TARGET_EMAIL_ADDR = "YOUR_EMAIL_HERE";
    const SECOND_EMAIL_ADDR = "YOUR_CLOUDFLARE_HOSTED_EMAIL_HERE; Like: contact@yourdomain.com";
    const EMAIL_FILTERING_STRENGTH = 2;

    // 需要匹配的关键词列表
    const keywords = [
      "verification",
      "verify",
      "login",
      "log-in",
      "confirm",
      "signup",
      "sign-up",
      "sign-in",
      "authentication",
      "注册",
      "激活",
      "找回",
      "密码",
      "登录",
      "验证",
    ];

    const negative_keywords = [
      "promote", 
      "promotion", 
      "offer", 
      "discount",
      "sale",
      "time limited",
      "time-limited",
      // "prize", 可能有歧义
      "gift",
      "event",
      "促销",
      "折扣",
      "优惠",
      "限时",
    ];

    // 只获取 subject（标题）
    const subject = message.headers.get("subject") || "";

    // 读取原始邮件
    const rawEmail = await new Response(message.raw).text();

    // 提取 body 部分（headers 和 body 之间用空行分隔）
    const bodyStartIndex = rawEmail.search(/\r?\n\r?\n/);
    const body = bodyStartIndex !== -1 ? rawEmail.substring(bodyStartIndex + 4) : rawEmail;

    // 只检查 subject 和 body
    const contentToCheck = (subject + "\n" + body).toLowerCase();

    // 查找所有匹配的关键词
    const matchedKeywords = keywords.filter(keyword => {
      const regex = new RegExp(keyword, "i");
      return regex.test(contentToCheck);
    });

    const matchedNegativeKeywords = negative_keywords.filter(keyword => {
      const regex = new RegExp(keyword, "i");
      return regex.test(contentToCheck);
    });

    let should_forward = true;
    switch(EMAIL_FILTERING_STRENGTH){
      case 0:
        should_forward = matchedNegativeKeywords.length == 0;
        break;
      case 1:
        should_forward = matchedKeywords.length > 0;
        break;
      case 2:
        should_forward = matchedKeywords.length > 0 && matchedNegativeKeywords.length == 0;
        break;
      default:
        should_forward = true;
    }

    if (should_forward) {
      // 包含关键词，转发邮件，并添加自定义头显示匹配到的关键词
      await message.forward(TARGET_EMAIL_ADDR, new Headers({
        "X-Matched-Keywords": matchedKeywords.join(", ")
      }));
    } else {
      // 不包含关键词，拒绝邮件
      message.setReject("[Auto email filter] No verification/signup/login keywords found. If this is not a spam, please send to " + SECOND_EMAIL_ADDR + ". If this is a spam: 你推销邮件在狗叫什么？");
    }
  },
};
