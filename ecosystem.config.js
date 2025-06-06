module.exports = {
    apps: [{
        name: 'seohan-website',
        script: 'npm',
        args: 'start',
        cwd: '/var/www/seohan-website',
        instances: 'max', // CPU 코어 수만큼 인스턴스 생성
        exec_mode: 'cluster',
        env: {
            NODE_ENV: 'production',
            PORT: 3000,
            NEXT_PUBLIC_DOMAIN: 'https://seohanfnc.co.kr',
            DATA_DIR: './content/data',
            LOG_LEVEL: 'info',
            JWT_SECRET: 'seohan-fnc-jwt-secret-2024-production',
            ADMIN_DEFAULT_PASSWORD: 'seohanfnc2024!@#'
        },
        env_production: {
            NODE_ENV: 'production',
            PORT: 3000,
            JWT_SECRET: 'seohan-fnc-jwt-secret-2024-production',
            ADMIN_DEFAULT_PASSWORD: 'seohanfnc2024!@#'
        },
        // 로그 설정
        log_file: './logs/combined.log',
        out_file: './logs/out.log',
        error_file: './logs/error.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        merge_logs: true,

        // 재시작 정책
        restart_delay: 5000,
        max_restarts: 10,
        min_uptime: '10s',

        // 메모리 관리
        max_memory_restart: '500M',

        // 모니터링
        monitoring: true,

        // 헬스체크
        health_check_grace_period: 3000,
        health_check_fatal_exceptions: true,

        // 정상 종료 대기 시간
        kill_timeout: 5000,

        // 고급 설정
        node_args: '--max-old-space-size=2048',
        source_map_support: true,

        // 자동 재시작 조건
        watch: false, // 프로덕션에서는 false
        ignore_watch: ['node_modules', 'logs', '.git'],

        // 클러스터 모드 옵션
        instance_var: 'INSTANCE_ID',

        // 환경별 설정
        env_development: {
            NODE_ENV: 'development',
            PORT: 3000,
            NEXT_PUBLIC_DEBUG: 'true'
        },

        env_staging: {
            NODE_ENV: 'production',
            PORT: 3000,
            NEXT_PUBLIC_DOMAIN: 'https://staging.seohanfnc.co.kr'
        }
    }],

    // 배포 설정 (옵션)
    deploy: {
        production: {
            user: 'root',
            host: ['157.230.38.118'],
            ref: 'origin/main',
            repo: 'https://github.com/your-username/seohan-website.git',
            path: '/var/www/seohan-website',
            'post-deploy': 'pnpm install && pnpm build && pm2 reload ecosystem.config.js --env production',
            'pre-setup': 'apt update && apt install git -y'
        }
    }
}; 