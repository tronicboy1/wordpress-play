FROM wordpress:latest
WORKDIR /var/www/html

ENV HTTPD_PHP_ERROR_LOG=true
ENV WORDPRESS_DEBUG=1

COPY src/themes wp-content/themes
COPY src/plugins wp-content/plugins
