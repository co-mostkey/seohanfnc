/**
 * 슬랙 웹훅을 통한 알림 전송 기능
 * [TRISID] 2024-12-19: 시스템 설정 알림 기능 추가
 */

export interface SlackMessage {
    title: string;
    content: string;
    type: 'info' | 'warning' | 'error' | 'success';
    url?: string;
}

export interface SlackResult {
    success: boolean;
    error?: string;
}

/**
 * 슬랙 웹훅으로 메시지 전송
 * @param webhookUrl 슬랙 웹훅 URL
 * @param message 전송할 메시지
 * @returns 전송 결과
 */
export async function sendSlackNotification(
    webhookUrl: string,
    message: SlackMessage
): Promise<SlackResult> {
    // 웹훅 URL이 없으면 스킵
    if (!webhookUrl || !webhookUrl.startsWith('https://hooks.slack.com/')) {
        return {
            success: false,
            error: '유효하지 않은 슬랙 웹훅 URL입니다.'
        };
    }

    try {
        // 메시지 타입에 따른 이모지 및 색상 설정
        const getMessageStyle = (type: string) => {
            switch (type) {
                case 'error':
                    return { emoji: '🚨', color: '#FF0000' };
                case 'warning':
                    return { emoji: '⚠️', color: '#FFA500' };
                case 'success':
                    return { emoji: '✅', color: '#00FF00' };
                default:
                    return { emoji: '🔔', color: '#0066CC' };
            }
        };

        const style = getMessageStyle(message.type);

        // 슬랙 메시지 구조
        const slackPayload = {
            text: `${style.emoji} ${message.title}`,
            attachments: [
                {
                    color: style.color,
                    fields: [
                        {
                            title: "내용",
                            value: message.content,
                            short: false
                        },
                        {
                            title: "시간",
                            value: new Date().toLocaleString('ko-KR'),
                            short: true
                        },
                        {
                            title: "유형",
                            value: message.type.toUpperCase(),
                            short: true
                        }
                    ]
                }
            ]
        };

        // 링크가 있으면 추가
        if (message.url) {
            slackPayload.attachments[0].fields.push({
                title: "링크",
                value: `<${message.url}|자세히 보기>`,
                short: false
            });
        }

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(slackPayload),
        });

        if (response.ok) {
            return { success: true };
        } else {
            const errorText = await response.text();
            return {
                success: false,
                error: `슬랙 API 오류: ${response.status} - ${errorText}`
            };
        }
    } catch (error) {
        console.error('슬랙 알림 전송 실패:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : '알 수 없는 오류'
        };
    }
}

/**
 * 문의 접수 슬랙 알림
 * @param webhookUrl 슬랙 웹훅 URL
 * @param inquiryData 문의 데이터
 * @returns 전송 결과
 */
export async function sendInquirySlackNotification(
    webhookUrl: string,
    inquiryData: {
        id: string;
        title: string;
        customerName: string;
        customerEmail: string;
        type: string;
    }
): Promise<SlackResult> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://seohanfc.com';

    return await sendSlackNotification(webhookUrl, {
        title: '새로운 문의가 접수되었습니다',
        content: `**제목:** ${inquiryData.title}\n**고객명:** ${inquiryData.customerName}\n**이메일:** ${inquiryData.customerEmail}\n**유형:** ${inquiryData.type}`,
        type: 'info',
        url: `${baseUrl}/admin/inquiries/${inquiryData.id}`
    });
}

/**
 * 시스템 알림 슬랙 메시지
 * @param webhookUrl 슬랙 웹훅 URL
 * @param systemMessage 시스템 메시지
 * @returns 전송 결과
 */
export async function sendSystemSlackNotification(
    webhookUrl: string,
    systemMessage: {
        title: string;
        message: string;
        level: 'info' | 'warning' | 'error';
    }
): Promise<SlackResult> {
    return await sendSlackNotification(webhookUrl, {
        title: `[시스템 알림] ${systemMessage.title}`,
        content: systemMessage.message,
        type: systemMessage.level
    });
} 