/**
 * Windsurf 구성 파일
 * 
 * 이 파일은 Windsurf 서버 연결 설정을 구성합니다.
 * 연결 오류가 발생할 경우 이 설정을 조정하세요.
 */

module.exports = {
  server: {
    port: 3000,                     // 서버 포트 (Next.js 포트와 일치)
    timeout: 30000,                 // 타임아웃 시간 증가 (ms)
    maxRetries: 5,                  // 연결 재시도 횟수
    retryInterval: 2000,            // 재시도 간격 (ms)
    reconnectOnError: true,         // 오류 발생 시 자동 재연결
    debug: true,                    // 디버그 모드 활성화
  },
  client: {
    connectionTimeout: 10000,       // 클라이언트 연결 타임아웃 (ms)
    requestTimeout: 30000,          // 요청 타임아웃 (ms)
    autoReconnect: true,            // 자동 재연결 활성화
    backoff: {                      // 지수 백오프 설정
      initialDelay: 1000,
      maxDelay: 30000,
      factor: 2
    }
  },
  logging: {
    level: 'debug',                 // 로깅 수준 (debug, info, warn, error)
    errorFile: './logs/windsurf-errors.log',
    enabled: true
  },
  development: {
    allowedOrigins: [
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ]
  }
};
