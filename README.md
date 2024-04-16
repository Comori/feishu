# 发送飞书消息 - 文本/card/卡片模版

[![GitHub Super-Linter](https://github.com/actions/typescript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

可以在workflows中，利用飞书机器人发送 文本/card/卡片模版 消息

> This action support: `linux`, `windows`, `macos`

> > > `>=0.0.3` 版本开始，支持自有应用发送消息以及更新消息卡片

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
- name: feishu-bot-yc
  uses: Comori/feishu@v0.0.3
  with:
    webhook-url: ${{ secrets.WEBHOOK_URL }}
    msg-type: text
    content: |
      This is a test message from github action.
```

**进阶使用**

1. 发送卡片消息. 内容支持 `Markdown`

```yaml
- name: feishu-bot-yc
  uses: Comori/feishu@v0.0.3
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
- name: feishu-bot-yc
  uses: Comori/feishu@v0.0.3
  with:
    webhook-url: ${{ secrets.WEBHOOK_URL }}
    msg-type: cardkit
    cardkit-id: AAqUxxxxxx
    cardkit-version: 1.0.1
    content: |
      title=This is a Title!
      name=xiaoming
      age=18
```

**高阶用法**

自 `0.0.3` 版本开始，支持`自有应用`批量给指定群组发送消息。`chat-id` 可通过飞书
后台查看。

1. 发送文本消息

```yaml
- name: feishu-bot-yc
  uses: Comori/feishu@v0.0.3
  with:
    use-self-built-app: true
    app-id: ${{ secrets.APP_ID }}
    app-secret: ${{ secrets.APP_SECRET }}
    chat-id: oc_9999xxxxxxxxxxxxx
    content: |
      This is a test message from github action.
```

2. 发送卡片消息. 内容支持 `Markdown`

```yaml
- name: feishu-bot-yc
  uses: Comori/feishu@v0.0.3
  with:
    use-self-built-app: true
    app-id: ${{ secrets.APP_ID }}
    app-secret: ${{ secrets.APP_SECRET }}
    chat-id: oc_9999xxxxxxxxxxxxx
    msg-type: card
    title: Card Title
    content: |
      普通文本\n标准emoji😁😢🌞💼🏆❌✅\n*斜体*\n**粗体**\n~~删除线~~\n文字链接\n差异化跳转\n<at id=all></at>
```

3. 发送模版卡片消息.
   > 飞书卡片模版参考： [https://open.larkoffice.com/cardkit]

```yaml
- name: feishu-bot-yc
  uses: Comori/feishu@v0.0.3
  with:
    use-self-built-app: true
    app-id: ${{ secrets.APP_ID }}
    app-secret: ${{ secrets.APP_SECRET }}
    chat-id: oc_9999xxxxxxxxxxxxx
    msg-type: cardkit
    cardkit-id: AAqUaoxxxxxxxx
    cardkit-version: 1.0.1
    content: |
      title=This is a Title!
      name=xiaoming
      age=18
```

**如果需要更新卡片，可以在发送卡片消息之后，通过消息id更新**

示例：

```yaml
- id: create-msg
  name: feishu-bot-yc
  uses: Comori/feishu@v0.0.3
  with:
    use-self-built-app: true
    app-id: ${{ secrets.APP_ID }}
    app-secret: ${{ secrets.APP_SECRET }}
    chat-id: oc_9999xxxxxxxxxxxxx
    msg-type: cardkit
    cardkit-id: AAqUaoxxxxxxxx
    cardkit-version: 1.0.1
    content: |
      title=This is a Title!
      name=xiaoming
      age=18

- id: update-msg
  name: feishu-bot-yc
  uses: Comori/feishu@v0.0.3
  with:
    use-self-built-app: true
    update-card: true
    app-id: ${{ secrets.APP_ID }}
    app-secret: ${{ secrets.APP_SECRET }}
    message-id: ${{ steps.create-msg.outputs.message-ids }}
    msg-type: cardkit
    cardkit-id: AAqUaoxxxxxxxx
    cardkit-version: 1.0.1
    content: |
      title=This is a Update Title!
      name=xiaoming-update
      age=19
```
