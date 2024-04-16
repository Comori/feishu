import axios from 'axios'
import type { AxiosInstance } from 'axios'

export class WebhookBot {
  instance: AxiosInstance

  constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
      timeout: 30000
    })
  }

  async sendText(content: string): Promise<boolean> {
    const response = await this.instance.post(
      '',
      {
        msg_type: 'text',
        content: {
          text: content
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    return response.data.code === 0
  }

  async sendCard(
    title: string,
    color: string,
    content: string
  ): Promise<boolean> {
    const response = await this.instance.post(
      '',
      {
        msg_type: 'interactive',
        card: {
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
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    return response.data.code === 0
  }

  async sendCardkit(
    cardkitId: string,
    cardkitVersion: string,
    kv: Map<string, string>
  ): Promise<boolean> {
    const response = await this.instance.post(
      '',
      {
        msg_type: 'interactive',
        card: {
          type: 'template',
          data: {
            template_id: cardkitId,
            template_version_name: cardkitVersion,
            template_variable: kv
          }
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    return response.data.code === 0
  }
}
