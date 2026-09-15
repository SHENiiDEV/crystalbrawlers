# Crystal Brawlers • Production Deployment Guide

Complete step-by-step deployment guide for deploying **Crystal Brawlers** on an Ubuntu/Debian Linux VPS / Dedicated Server at `/var/www/crystalbrawlers` with **Nginx**, **PHP-FPM 8.4**, **Node.js WebSocket Server (Systemd)**, and **Let's Encrypt SSL**.

---

## 1. Server Prerequisites & System Packages

```bash
# Update package repositories
sudo apt update && sudo apt upgrade -y

# Install essential dependencies, git, curl, unzip
sudo apt install -y software-properties-common curl git unzip ufw supervisor

# Add ondrej/php repository for PHP 8.4
sudo add-apt-repository -y ppa:ondrej/php
sudo apt update

# Install PHP 8.4 and required extensions
sudo apt install -y php8.4-fpm php8.4-cli php8.4-common php8.4-sqlite3 php8.4-mysql \
  php8.4-mbstring php8.4-xml php8.4-curl php8.4-bcmath php8.4-zip php8.4-intl php8.4-gd

# Install Node.js (v20+ LTS or v22)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs nginx certbot python3-certbot-nginx

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

---

## 2. Clone & Setup Project Repository

```bash
# Create web directory and set ownership
sudo mkdir -p /var/www/crystalbrawlers
sudo chown -R $USER:www-data /var/www/crystalbrawlers

# Clone repository
git clone https://github.com/SHENiiDEV/crystalbrawlers.git /var/www/crystalbrawlers
cd /var/www/crystalbrawlers

# Install PHP and Node dependencies
composer install --no-dev --optimize-autoloader
npm install
npm run build

# Configure Environment
cp .env.example .env
nano .env
```

### Production `.env` Configuration:
```ini
APP_NAME="Crystal Brawlers"
APP_ENV=production
APP_KEY=base64:... (generate with: php artisan key:generate)
APP_DEBUG=false
APP_URL=https://crystalbrawlers.com

DB_CONNECTION=sqlite
DB_DATABASE=/var/www/crystalbrawlers/database/database.sqlite

# Namecheap PrivateEmail SMTP configuration
MAIL_MAILER=smtp
MAIL_HOST=mail.privateemail.com
MAIL_PORT=465
MAIL_USERNAME=info@crystalbrawlers.com
MAIL_PASSWORD="YOUR_ACTUAL_PRIVATEEMAIL_PASSWORD"
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS="info@crystalbrawlers.com"
MAIL_FROM_NAME="Crystal Brawlers"

# Real-time WebSocket Arena URL & Secret
ARENA_WS_URL=https://crystalbrawlers.com/socket.io
LARAVEL_API_URL=http://127.0.0.1:8000
ARENA_SERVER_SECRET="YOUR_RANDOM_SECURE_HMAC_SECRET"
```

```bash
# Initialize SQLite database & storage permissions
touch database/database.sqlite
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set strict permissions for www-data
sudo chown -R www-data:www-data /var/www/crystalbrawlers/storage /var/www/crystalbrawlers/bootstrap/cache /var/www/crystalbrawlers/database
sudo chmod -R 775 /var/www/crystalbrawlers/storage /var/www/crystalbrawlers/bootstrap/cache /var/www/crystalbrawlers/database
```

---

## 3. Node.js WebSocket Arena Daemon (Systemd Service)

Create a systemd unit file to keep the 30 TPS WebSocket arena server running permanently in the background:

```bash
sudo nano /etc/systemd/system/crystal-arena.service
```

Paste the following configuration:
```ini
[Unit]
Description=Crystal Brawlers 30 TPS WebSocket Arena Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/crystalbrawlers
ExecStart=/usr/bin/node server/arena.js
Restart=always
RestartSec=3
Environment=NODE_ENV=production
Environment=PORT=3008
Environment=LARAVEL_API_URL=http://127.0.0.1:8000
Environment=ARENA_SERVER_SECRET=crystal-brawlers-super-secret-key

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable crystal-arena
sudo systemctl start crystal-arena
sudo systemctl status crystal-arena
```

---

## 4. Nginx Web Server Configuration

```bash
sudo nano /etc/nginx/sites-available/crystalbrawlers.conf
```

Paste the configuration below:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name crystalbrawlers.com www.crystalbrawlers.com;
    root /var/www/crystalbrawlers/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    index index.php index.html;
    charset utf-8;

    # Static Assets Caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        access_log off;
        add_header Cache-Control "public, no-transform";
    }

    # Proxy WebSocket Traffic to Node.js Arena Server (Port 3008)
    location /socket.io/ {
        proxy_pass http://127.0.0.1:3008;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }

    # Laravel Web Traffic (PHP 8.4 FPM)
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Enable Nginx site and test configuration:
```bash
sudo ln -s /etc/nginx/sites-available/crystalbrawlers.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 5. Free SSL Certificate (Let's Encrypt)

```bash
sudo certbot --nginx -d crystalbrawlers.com -d www.crystalbrawlers.com
```

Certbot will automatically configure HTTPS redirection and renew your certificate every 90 days.

---

## 6. Maintenance Commands

```bash
# Deploying Updates:
cd /var/www/crystalbrawlers
git pull origin main
composer install --no-dev --optimize-autoloader
npm install && npm run build
php artisan migrate --force
php artisan config:cache
php artisan route:cache
sudo systemctl restart crystal-arena
sudo systemctl reload php8.4-fpm
```
