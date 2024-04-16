import * as core from '@actions/core'
import { TYPE_CARD, TYPE_CARDKIT, TYPE_TEXT } from './constant'
import { Client } from './client'

export class MainRunner {
  webhookUrl?: string
  msgType: string
  cardkitId?: string
  cardkitVersion: string
  title?: string
  titleColor: string
  content: string[]
  useSelfBuiltApp: boolean
  appId?: string
  appSecret?: string
  chatId?: string[]
  messageIds?: string[]
  updateCard: boolean

  client?: Client

  constructor() {
    this.useSelfBuiltApp = core.getBooleanInput('use-self-built-app')
    core.debug(
      `useSelfBuiltApp == ${this.useSelfBuiltApp}---${core.getInput('use-self-built-app')}`
    )
    this.updateCard = core.getBooleanInput('update-card')
    core.debug(
      `updateCard == ${this.updateCard}---${core.getInput('update-card')}`
    )
    if (this.useSelfBuiltApp) {
      this.appId = core.getInput('app-id', { required: true })
      this.appSecret = core.getInput('app-secret', { required: true })
      core.debug(`appId == ${this.appId}--- appSecret == ${this.appSecret}`)
      if (this.updateCard) {
        this.messageIds = core.getMultilineInput('message-id', {
          required: true
        })
      } else {
        this.chatId = core.getMultilineInput('chat-id', { required: true })
        core.debug(`chatId == ${this.chatId}`)
      }
    } else {
      this.webhookUrl = core.getInput('webhook-url')
    }
    this.msgType = core.getInput('msg-type')
    this.content = core.getMultilineInput('content', { required: true })
    this.cardkitId = core.getInput('cardkit-id')
    this.cardkitVersion = core.getInput('cardkit-version')
    this.title = core.getInput('title')
    this.titleColor = core.getInput('title-color')
  }

  async run(): Promise<boolean> {
    let valid = true
    if (this.useSelfBuiltApp) {
      if (this.appId == null || this.appId.length <= 0) {
        core.error(`❌ appId is null!!!`)
        valid = false
      }
      if (this.appSecret == null || this.appSecret.length <= 0) {
        core.error(`❌ appSecret is null!!!`)
        valid = false
      }
      if (this.chatId == null || this.chatId.length <= 0) {
        core.error(`❌ chatId is null!!!`)
        valid = false
      }
    } else {
      if (this.webhookUrl == null || this.webhookUrl.length <= 0) {
        core.error(`❌ webhookUrl is null!!!`)
        valid = false
      }
    }

    if (this.msgType == null || this.msgType.length <= 0) {
      core.error(`❌ msgType is null!!!`)
      valid = false
    }
    if (
      this.msgType !== TYPE_CARDKIT &&
      (this.content == null || this.content.length <= 0)
    ) {
      core.error(`❌ content is null!!!`)
      valid = false
    }
    if (
      this.msgType === TYPE_CARD &&
      (this.title == null || this.title.length <= 0)
    ) {
      core.error(`❌ car title is null!!!`)
      valid = false
    }
    if (
      this.msgType === TYPE_CARDKIT &&
      (this.cardkitId == null || this.cardkitId.length <= 0)
    ) {
      core.error(`❌ cardkit id is null!!!`)
      valid = false
    }
    if (!valid) {
      core.setFailed('😭 feishu params is invalid!!')
      return false
    }

    this.client = new Client(this.useSelfBuiltApp, {
      webhookUrl: this.webhookUrl,
      appId: this.appId,
      appSecret: this.appSecret,
      chatId: this.chatId,
      messageIds: this.messageIds
    })
    let sendResult
    try {
      if (this.msgType === TYPE_TEXT) {
        sendResult = await this.client.sendText(this.content.join('\n'))
      } else if (this.msgType === TYPE_CARD) {
        core.debug(`useSelfBuiltApp == ${this.useSelfBuiltApp}`)
        sendResult = await this.client.sendCard(
          this.title!,
          this.titleColor,
          this.content.join('\n')
        )
      } else if (this.msgType === TYPE_CARDKIT) {
        const kvMap = new Map<string, string>()
        for (const element of this.content) {
          const kvItems = element.split('=')
          if (kvItems.length === 2) {
            kvMap.set(kvItems[0], kvItems[1])
          }
        }
        sendResult = await this.client.sendCardKit(
          this.cardkitId!,
          this.cardkitVersion,
          kvMap
        )
      }
    } catch (error: unknown) {
      core.debug(`error = ${error}`)
    }

    if (sendResult) {
      core.info('✅ send message successfully!!')
      if (Array.isArray(sendResult)) {
        core.info(`👝 The messageId list: ${sendResult}`)
        core.setOutput('message-ids', sendResult.join('\n'))
      }
    } else {
      core.error('❌ send message fail!!')
    }

    return true
  }
}
