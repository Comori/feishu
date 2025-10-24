import axios from 'axios'
import * as core from '@actions/core'
import { Dictionary } from './type'

export class SelfBuiltApp {
  appId: string
  appSecret: string
  isLark: boolean

  host: string

  constructor(appId: string, appSecret: string, isLark: boolean) {
    this.appId = appId
    this.appSecret = appSecret
    this.isLark = isLark
    if (isLark) {
      this.host = 'https://open.larksuite.com/'
    } else {
      this.host = 'https://open.feishu.cn/'
    }
  }

  private async auth(): Promise<string | null> {
    const config = {
      method: 'POST',
      url: `${this.host}open-apis/auth/v3/tenant_access_token/internal`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        app_id: this.appId,
        app_secret: this.appSecret
      })
    }

    const resp = await axios(config)
    if (resp.data.code === 0) {
      return resp.data.tenant_access_token
    }
    return null
  }

  async getUserOpenIdByEmail(email: string): Promise<string | null> {
    const token = await this.auth()
    if (token != null) {
      const config = {
        method: 'POST',
        url: `${this.host}open-apis/contact/v3/users/batch_get_id?user_id_type=open_id`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        data: JSON.stringify({
          emails: [email],
          include_resigned: true
        })
      }
      core.debug(
        `[SelfBuiltApp] getUserOpenIdByEmail config = ${JSON.stringify(config.data)}`
      )
      const resp = await axios(config)
      if (
        resp.data.code === 0 &&
        resp.data.data.user_list &&
        resp.data.data.user_list.length > 0
      ) {
        return resp.data.data.user_list[0].user_id
      } else {
        core.warning(`⚠️ Cannot find user with email: ${email}`)
      }
    }
    return null
  }

  private async send(
    receiveIds: string[],
    msgType: string,
    content: string,
    receiveIdType: 'chat_id' | 'open_id' = 'chat_id'
  ): Promise<string[]> {
    const token = await this.auth()
    const msgIds = []
    for (const receiveId of receiveIds) {
      if (token != null) {
        const data = JSON.stringify({
          receive_id: receiveId,
          msg_type: msgType,
          content
        })
        const config = {
          method: 'POST',
          url: `${this.host}open-apis/im/v1/messages?receive_id_type=${receiveIdType}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          data
        }
        core.debug(`[SelfBuiltApp] send config = ${data}`)
        const resp = await axios(config)
        if (resp.data.code === 0) {
          msgIds.push(resp.data.data.message_id)
        }
      }
    }
    return msgIds
  }

  async sendText(
    chatId: string[],
    content: string,
    receiveIdType: 'chat_id' | 'open_id' = 'chat_id'
  ): Promise<string[]> {
    return this.send(
      chatId,
      'text',
      JSON.stringify({
        text: content
      }),
      receiveIdType
    )
  }

  async sendCard(
    chatId: string[],
    content: string,
    color: string,
    title: string,
    receiveIdType: 'chat_id' | 'open_id' = 'chat_id'
  ): Promise<string[]> {
    return this.send(
      chatId,
      'interactive',
      JSON.stringify({
        config: {
          wide_screen_mode: true
        },
        elements: [
          {
            tag: 'markdown',
            content
          }
        ],
        header: {
          template: color,
          title: {
            content: title,
            tag: 'plain_text'
          }
        }
      }),
      receiveIdType
    )
  }

  async sendCardKit(
    chatId: string[],
    cardkitId: string,
    cardkitVersion: string,
    kv: Dictionary<string, string>,
    receiveIdType: 'chat_id' | 'open_id' = 'chat_id'
  ): Promise<string[]> {
    return this.send(
      chatId,
      'interactive',
      JSON.stringify({
        type: 'template',
        data: {
          template_id: cardkitId,
          template_version_name: cardkitVersion,
          template_variable: kv
        }
      }),
      receiveIdType
    )
  }

  private async updateCardInner(
    messageIds: string[],
    content: string
  ): Promise<boolean> {
    const token = await this.auth()
    if (token != null) {
      for (const msgId of messageIds) {
        const config = {
          method: 'PATCH',
          url: `${this.host}open-apis/im/v1/messages/${msgId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          data: JSON.stringify({
            content
          })
        }
        const resp = await axios(config)
        console.log(resp.data)
      }
    }
    return true
  }

  async updateCard(
    messageIds: string[],
    content: string,
    color: string,
    title: string
  ): Promise<boolean> {
    return this.updateCardInner(
      messageIds,
      JSON.stringify({
        config: {
          wide_screen_mode: true
        },
        elements: [
          {
            tag: 'markdown',
            content
          }
        ],
        header: {
          template: color,
          title: {
            content: title,
            tag: 'plain_text'
          }
        }
      })
    )
  }

  async updateCardKit(
    messageIds: string[],
    cardkitId: string,
    cardkitVersion: string,
    kv: Dictionary<string, string>
  ): Promise<boolean> {
    return this.updateCardInner(
      messageIds,
      JSON.stringify({
        type: 'template',
        data: {
          template_id: cardkitId,
          template_version_name: cardkitVersion,
          template_variable: kv
        }
      })
    )
  }
}
