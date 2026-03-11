#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   sudo bash setup-vps.sh <repo_url> <domain>
# Example:
#   sudo bash setup-vps.sh https://github.com/Sahil-webdev/teamtracker.git api.teamtracker.com

REPO_URL="${1:-}"
DOMAIN="${2:-}"
APP_DIR="/var/www/locationtracker"
SERVICE_FILE="/etc/systemd/system/locationtracker.service"
NGINX_AVAILABLE="/etc/nginx/sites-available/locationtracker"
NGINX_ENABLED="/etc/nginx/sites-enabled/locationtracker"

if [[ -z "$REPO_URL" || -z "$DOMAIN" ]]; then
  echo "Usage: sudo bash setup-vps.sh <repo_url> <domain>"
  exit 1
fi

apt update
apt install -y python3 python3-venv python3-pip nginx git

mkdir -p /var/www
if [[ ! -d "$APP_DIR/.git" ]]; then
  git clone "$REPO_URL" "$APP_DIR"
else
  git -C "$APP_DIR" pull origin main
fi

cd "$APP_DIR/backend"
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

if [[ ! -f .env ]]; then
  cp .env.example .env
fi

cp "$APP_DIR/deploy/vps/locationtracker.service" "$SERVICE_FILE"
systemctl daemon-reload
systemctl enable locationtracker
systemctl restart locationtracker

sed "s/__DOMAIN__/$DOMAIN/g" "$APP_DIR/deploy/vps/nginx-locationtracker.conf" > "$NGINX_AVAILABLE"
ln -sf "$NGINX_AVAILABLE" "$NGINX_ENABLED"
nginx -t
systemctl restart nginx

apt install -y certbot python3-certbot-nginx
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m admin@"$DOMAIN" || true

echo "Setup complete."
echo "Check service: systemctl status locationtracker"
echo "Check API: https://$DOMAIN/api/test"
