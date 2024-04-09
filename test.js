const chalk = require('chalk')
const axios = require('axios')

class Request {
  instance

  constructor(url) {
    this.instance = axios.create({
      baseURL: url,
      timeout: 30000
    })
  }

  async sendText(content) {
    const response = await this.instance.post(
      '',
      {
        msg_type: 'interactive',
        card: {
          type: 'template',
          data: {
            template_id: 'AAqUaosT4u3q1',
            template_version_name: '1.0.0',
            template_variable: {
              key1: 'value1',
              key2: 'value2'
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
    console.log(response.data)
    return response.data.code == 0
  }
}

const r = new Request(
  'https://open.feishu.cn/open-apis/bot/v2/hook/dc238bbe-f234-4ad3-b46c-3a9cabb73653'
)
r.sendText('sssssss').then(res => {
  console.log(res)
})
