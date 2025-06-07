#!/usr/bin/env bash
set -e
systemctl stop nginx || true
pm2 delete seohan-website || true
rm -rf /var/www/seohan-website
apt-get update -y
apt-get install -y nginx git
mkdir -p /var/www
cd /var/www
git clone https://github.com/co-mostkey/seohanfnc.git seohan-website
cd seohan-website
if ! command -v pnpm >/dev/null 2>&1; then npm install -g pnpm@8; fi
pnpm install --frozen-lockfile
pnpm run build
pm2 start ecosystem.config.js --update-env
pm2 save
mkdir -p /etc/ssl/seohan
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/seohan/selfsigned.key \
  -out   /etc/ssl/seohan/selfsigned.crt \
  -subj "/C=KR/ST=Seoul/L=Seoul/O=SeohanFNC/OU=Dev/CN=$(curl -s ifconfig.me)"

cat > /etc/nginx/sites-available/seohan.conf <<'NGINXCONF'
server {
    listen 80 default_server;
    server_name _;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
server {
    listen 443 ssl;
    server_name _;
    ssl_certificate     /etc/ssl/seohan/selfsigned.crt;
    ssl_certificate_key /etc/ssl/seohan/selfsigned.key;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINXCONF

ln -sf /etc/nginx/sites-available/seohan.conf /etc/nginx/sites-enabled/seohan.conf
nginx -t
systemctl restart nginx
