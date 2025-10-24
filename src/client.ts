import { SelfBuiltApp } from './selfBuiltApp'
import { Dictionary } from './type'
import { WebhookBot } from './webhookBot'

export interface ClientOptions {
  webhookUrl?: string
  appId?: string
  appSecret?: string
  chatId?: string[]
  messageIds?: string[]
  useOpenId?: boolean
}

export class Client {
  useSelfBuiltApp: boolean

  options: ClientOptions

  isLark: boolean

  constructor(
    useSelfBuiltApp: boolean,
    options: ClientOptions,
    isLark: boolean
  ) {
    this.useSelfBuiltApp = useSelfBuiltApp
    this.options = options
    this.isLark = isLark
  }

  async sendText(content: string): Promise<boolean | string[]> {
    if (!this.useSelfBuiltApp) {
      return new WebhookBot(this.options.webhookUrl!).sendText(content)
    } else {
      const receiveIdType = this.options.useOpenId ? 'open_id' : 'chat_id'
      return new SelfBuiltApp(
        this.options.appId!,
        this.options.appSecret!,
        this.isLark
      ).sendText(this.options.chatId!, content, receiveIdType)
    }
  }

  async sendCard(
    title: string,
    color: string,
    content: string
  ): Promise<boolean | string[]> {
    if (!this.useSelfBuiltApp) {
      return new WebhookBot(this.options.webhookUrl!).sendCard(
        title,
        color,
        content
      )
    } else {
      const receiveIdType = this.options.useOpenId ? 'open_id' : 'chat_id'
      return new SelfBuiltApp(
        this.options.appId!,
        this.options.appSecret!,
        this.isLark
      ).sendCard(this.options.chatId!, content, color, title, receiveIdType)
    }
  }

  async sendCardKit(
    cardkitId: string,
    cardkitVersion: string,
    kv: Dictionary<string, string>
  ): Promise<boolean | string[]> {
    if (!this.useSelfBuiltApp) {
      return new WebhookBot(this.options.webhookUrl!).sendCardkit(
        cardkitId,
        cardkitVersion,
        kv
      )
    } else {
      const receiveIdType = this.options.useOpenId ? 'open_id' : 'chat_id'
      return new SelfBuiltApp(
        this.options.appId!,
        this.options.appSecret!,
        this.isLark
      ).sendCardKit(
        this.options.chatId!,
        cardkitId,
        cardkitVersion,
        kv,
        receiveIdType
      )
    }
  }

  async updateCard(
    title: string,
    color: string,
    content: string
  ): Promise<boolean> {
    return new SelfBuiltApp(
      this.options.appId!,
      this.options.appSecret!,
      this.isLark
    ).updateCard(this.options.messageIds!, content, color, title)
  }

  async updateCardKit(
    cardkitId: string,
    cardkitVersion: string,
    kv: Dictionary<string, string>
  ): Promise<boolean> {
    return new SelfBuiltApp(
      this.options.appId!,
      this.options.appSecret!,
      this.isLark
    ).updateCardKit(this.options.messageIds!, cardkitId, cardkitVersion, kv)
  }
}
