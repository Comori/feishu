import { SelfBuiltApp } from './selfbuiltApp'
import { Dictionary } from './type'
import { WebhookBot } from './webhookBot'

export interface ClientOptions {
  webhookUrl?: string
  appId?: string
  appSecret?: string
  chatId?: string[]
  messageIds?: string[]
}

export class Client {
  useSelfBuiltApp: boolean

  options: ClientOptions

  constructor(useSelfBuiltApp: boolean, options: ClientOptions) {
    this.useSelfBuiltApp = useSelfBuiltApp
    this.options = options
  }

  async sendText(content: string): Promise<boolean | string[]> {
    if (!this.useSelfBuiltApp) {
      return new WebhookBot(this.options.webhookUrl!).sendText(content)
    } else {
      return new SelfBuiltApp(
        this.options.appId!,
        this.options.appSecret!
      ).sendText(this.options.chatId!, content)
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
      return new SelfBuiltApp(
        this.options.appId!,
        this.options.appSecret!
      ).sendCard(this.options.chatId!, content, color, title)
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
      return new SelfBuiltApp(
        this.options.appId!,
        this.options.appSecret!
      ).sendCardKit(this.options.chatId!, cardkitId, cardkitVersion, kv)
    }
  }

  async updateCard(
    title: string,
    color: string,
    content: string
  ): Promise<boolean> {
    return new SelfBuiltApp(
      this.options.appId!,
      this.options.appSecret!
    ).updateCard(this.options.messageIds!, content, color, title)
  }

  async updateCardKit(
    cardkitId: string,
    cardkitVersion: string,
    kv: Dictionary<string, string>
  ): Promise<boolean> {
    return new SelfBuiltApp(
      this.options.appId!,
      this.options.appSecret!
    ).updateCardKit(this.options.messageIds!, cardkitId, cardkitVersion, kv)
  }
}
