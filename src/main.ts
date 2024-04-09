import * as core from '@actions/core'
import { Request } from './request'

const TYPE_CARD = 'card'
const TYPE_TEXT = 'text'
const TYPE_CARDKIT = 'cardkit'

export class MainRunner {
  webhookUrl: string
  msgType: string
  cardkitId?: string
  cardkitVersion: string
  title?: string
  titleColor: string
  content: string[]

  request?: Request

  constructor() {
    this.webhookUrl = core.getInput('webhook-url', { required: true })
    this.msgType = core.getInput('msg-type')
    this.content = core.getMultilineInput('content', { required: true })
    this.cardkitId = core.getInput('cardkit-id')
    this.cardkitVersion = core.getInput('cardkit-version')
    this.title = core.getInput('title')
    this.titleColor = core.getInput('title-color')
  }

  async run(): Promise<boolean> {
    let valid = true
    if (this.webhookUrl == null || this.webhookUrl.length <= 0) {
      core.error(`❌ webhookUrl is null!!!`)
      valid = false
    }
    if (this.msgType == null || this.msgType.length <= 0) {
      core.error(`❌ msgType is null!!!`)
      valid = false
    }
    if (this.content == null || this.content.length <= 0) {
      core.error(`❌ msgType is null!!!`)
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

    this.request = new Request(this.webhookUrl)
    let sendOk = false
    if (this.msgType === TYPE_TEXT) {
      sendOk = await this.request.sendText(this.content.join('\n'))
    } else if (this.msgType === TYPE_CARD) {
      sendOk = await this.request.sendCard(
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
      sendOk = await this.request.sendCardkit(
        this.cardkitId!,
        this.cardkitVersion,
        kvMap
      )
    }

    if (sendOk) {
      core.info('✅ send message successfully!!')
    } else {
      core.error('❌ send message fail!!')
    }

    return sendOk
  }
}
