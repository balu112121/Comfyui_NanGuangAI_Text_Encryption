# Comfyui 南光AI文本加密插件

## 插件名称
**南光AI文本加密**

## 功能说明

### 节点：南光AI文本加密

**功能一：加密开关控制**
- 节点界面包含一个多行文本输入框，用于编写提示词文本
- 文本框下方有一个"加密开关"（布尔值开关）
- **默认关闭**：文本框完整展示内容，可自由编辑
- **开启加密**：文本框内容被星号遮挡（如 `********`），同时加密开关本身也会隐藏

**功能二：密码解锁**
- 当文本处于加密状态时，选择该节点 → 右键点击 → 弹出菜单中选择 **"南光AI文本加密（解锁）"**
- 弹出密码输入框，输入密码 **** 后，文本框恢复显示原文，加密开关重新出现
- 密码错误则提示无法解锁

**功能三：文本输出**
- 节点输出端为 `STRING` 类型，可连接至其他文本输入节点（如 CLIP文本编码器 等）

## 安装方法

将本文件夹 `Comfyui_NanGuangAI_Text_Encryption` 放入 ComfyUI 的 `custom_nodes` 目录下：

```
ComfyUI/
└── custom_nodes/
    └── Comfyui_NanGuangAI_Text_Encryption/
        ├── __init__.py
        ├── nodes/
        │   └── text_encryption.py
        ├── js/
        │   └── text_encryption.js
        └── README.md
```

重启 ComfyUI 即可使用。

## 节点位置
在节点添加菜单中查找：**南光AI/加密/南光AI文本加密**

## 使用场景
- 保护工作流中的敏感提示词不被他人查看
- 分享工作流时隐藏关键提示词内容
- 团队协作时控制提示词访问权限

## 技术说明
- 前端加密状态会随工作流保存和加载
- 后端始终输出原文，加密仅为前端显示控制

## 版本信息
- 版本：1.1.0
- 作者：南光AIGC
- 适配：ComfyUI 最新版

### 南光AIGC绘画

南光AIGC-AIGC全能方案设计解决专家 VX:nankodesign2001

RH新人注册网址---
粉丝福利：https://pre.runninghub.cn/?inviteCode=t7ztfeiw-填入邀请码，领1000RH币，每天登录还有100币 邀请码：t7ztfeiw

仙宫云新人注册网址---
https://www.xiangongyun.com/register/MJAT43 新人注册仙宫云送5元代金券， 填写邀请码（输入我们的邀请码：MJAT43 ）还额外送3元代金券 完成后可以得到仙宫云8元账户余额，可以免费带你玩转5小时发高配4090 D显卡AIGC绘画。


PS软件（AI）插件
https://istarry.com.cn/?sfrom=jbEHmC
提供多种强大的AI功能，轻松提升设计效率，邀您免费体验


### 三大自媒体平台

小红书
https://www.xiaohongshu.com/user/profile/5fe63b41000000000100811d?m_source=itab

抖音
https://www.douyin.com/user/self?showTab=post

bilibili（B站）
https://space.bilibili.com/404783526


### 如果您受益于本项目，不妨请作者喝杯咖啡，您的支持是我最大的动力

<div style="display: flex; justify-content: left; gap: 20px;">
    <img src="https://github.com/balu112121/ComfyUI_NanKo_AI_Recognize/blob/main/Alipay.jpg" width="300" alt="支付宝收款码">
    <img src="https://github.com/balu112121/ComfyUI_NanKo_AI_Recognize/blob/main/WeChat.jpg" width="300" alt="微信收款码">
</div>

# 商务合作
如果您有定制工作流/节点的需求，或者想要学习插件制作的相关课程，请联系我
wechat:nankodesign2001

## 作者
南光AI

## 许可
MIT License
