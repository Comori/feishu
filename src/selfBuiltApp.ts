import axios from 'axios'

export class SelfBuiltApp {

    appId: string
    appSecret: string

    constructor(appId: string, appSecret: string) {
        this.appId = appId
        this.appSecret = appSecret
    }

    private async auth(): Promise<string | null> {
        var data = JSON.stringify({
            "app_id": this.appId,
            "app_secret": this.appSecret
        });

        var config = {
            method: 'POST',
            url: 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        const resp = await axios(config)
        if (resp.data.code === 0) {
            return resp.data.tenant_access_token;
        }
        return null
    }

    private async send(chatIds: string[], msgType: string, content: string): Promise<Array<string>> {

        const token = await this.auth()
        const msgIds = []
        for (const chatId of chatIds) {
            if (token != null) {
                var data = JSON.stringify({
                    "receive_id": chatId,
                    "msg_type": msgType,
                    "content": content
                });

                var config = {
                    method: 'POST',
                    url: 'https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=open_id',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    data: data
                };
                const resp = await axios(config)
                if (resp.data.code == 0) {
                    msgIds.push(resp.data.data.message_id)
                }
            }
        }
        return msgIds
    }

    async sendText(chatId: string[], content: string): Promise<Array<string>> {
        return this.send(chatId, "text", JSON.stringify({
            "text": content
        }))
    }

    async sendCard(chatId: string[], content: string, color: string, title: string): Promise<Array<string>> {
        return this.send(chatId, "interactive", JSON.stringify({
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
        }))
    }

    async sendCardKit(chatId: string[], cardkitId: string,
        cardkitVersion: string,
        kv: Map<string, string>): Promise<Array<string>> {
        return this.send(chatId, "interactive", JSON.stringify({
            type: 'template',
            data: {
                template_id: cardkitId,
                template_version_name: cardkitVersion,
                template_variable: kv
            }
        }))
    }

    private async updateCardInner(messageIds: string[], content: string): Promise<boolean> {
        const token = await this.auth()
        if (token != null) {
            for (const msgId of messageIds) {
                var data = JSON.stringify({
                    "content": content
                });

                var config = {
                    method: 'PATCH',
                    url: `https://open.feishu.cn/open-apis/im/v1/messages/${msgId}`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    data: data
                };
                const resp = await axios(config)
                console.log(resp.data)
            }
        }
        return true
    }

    async updateCard(messageIds: string[], content: string, color: string, title: string): Promise<boolean> {
        return this.updateCardInner(messageIds, JSON.stringify({
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
        }))
    }

    async updateCardKit(messageIds: string[], cardkitId: string,
        cardkitVersion: string,
        kv: Map<string, string>): Promise<boolean> {
        return this.updateCardInner(messageIds, JSON.stringify({
            type: 'template',
            data: {
                template_id: cardkitId,
                template_version_name: cardkitVersion,
                template_variable: kv
            }
        }))
    }

}