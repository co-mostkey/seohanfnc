# 서한F&C 웹사이트 - NHN 클라우드 배포용 Dockerfile (최신 보안 강화)
FROM node:22.11.0-alpine3.20 AS base

# 보안 업데이트 및 필수 시스템 패키지 설치
RUN apk update && apk upgrade && \
    apk add --no-cache libc6-compat curl ca-certificates dumb-init && \
    rm -rf /var/cache/apk/*

# 작업 디렉토리 설정
WORKDIR /app

# pnpm 설치 (최신 버전)
RUN npm install -g pnpm@latest

# 종속성 설치 단계
FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --prod=false

# 빌드 단계
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 프로덕션 빌드 실행
RUN pnpm build

# 런타임 단계 (최신 보안 강화)
FROM node:22.11.0-alpine3.20 AS runner

# 보안 업데이트 및 필수 패키지
RUN apk update && apk upgrade && \
    apk add --no-cache curl ca-certificates dumb-init && \
    rm -rf /var/cache/apk/*

# 보안을 위한 사용자 생성
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 파일들 복사
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/content ./content

# 로그 디렉토리 생성 및 권한 설정
RUN mkdir -p ./logs && chown nextjs:nodejs ./logs

# 파일 권한 설정
RUN chown -R nextjs:nodejs /app

# 보안을 위한 non-root 사용자로 전환
USER nextjs

# 포트 설정
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# 헬스체크 설정
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# dumb-init을 사용한 안전한 프로세스 시작
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "server.js"] 