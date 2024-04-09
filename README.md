# 发送飞书消息 - 文本/card/卡片模版

[![GitHub Super-Linter](https://github.com/actions/typescript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

可以在workflows中，利用飞书机器人发送 文本/card/卡片模版 消息

> This action support: `linux`, `windows`, `macos`

## 配置说明

See [action.yml](action.yml)

| 字段            | 说明                                                      |
| --------------- | --------------------------------------------------------- |
| webhook-url     | 机器人Webhook 地址 `必填`                                 |
| msg-type        | 消息类型。取值：text/card/cardkit `必填`                  |
| content         | 消息内容。消息类型为cardkit时，是参数列表`k=v`格式 `必填` |
| cardkit-id      | 消息卡片模版ID。消息类型为cardkit时，`必填`               |
| cardkit-version | 消息卡片模版版本号。默认：1.0.0                           |
| title           | 消息卡片title。消息类型为card时 `必填`                    |
| title-color     | 消息卡片title color                                       |

**简单使用**:

发送文本消息

```yaml
- name: send feishu message
  uses: Comori/feishu-bot-yc@v0.0.1
  with:
    webhook-url: ${{ secrets.WEBHOOK_URL }}
    msg-type: text
    content: |
      This is a test message from github action.
```

**进阶使用**

1. 发送卡片消息. 内容支持 `Markdown`

```yaml
- name: send feishu message
  uses: Comori/feishu-bot-yc@v0.0.1
  with:
    webhook-url: ${{ secrets.WEBHOOK_URL }}
    msg-type: card
    title: Card Title
    content: |
      普通文本\n标准emoji😁😢🌞💼🏆❌✅\n*斜体*\n**粗体**\n~~删除线~~\n文字链接\n差异化跳转\n<at id=all></at>
```

2. 发送模版卡片消息.
   > 飞书卡片模版参考： [https://open.larkoffice.com/cardkit]

```yaml
- name: send feishu message
  uses: Comori/feishu-bot-yc@v0.0.1
  with:
    webhook-url: ${{ secrets.WEBHOOK_URL }}
    msg-type: cardkit
    cardkit-id: AAqUaosT4u32w3
    cardkit-version: 1.0.1
    content: |
      title=This is a Title!
      name=xiaoming
      age=18
```
