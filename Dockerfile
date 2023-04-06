FROM wordpress:latest
WORKDIR /var/www/html

COPY src/themes wp-content/themes
COPY src/plugins wp-content/plugins
