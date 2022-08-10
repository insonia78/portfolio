cmake_minimum_required (VERSION 2.8)

project (system-level-tool-view NONE)

install(
  DIRECTORY bin public lib routes views
  DESTINATION /opt/www/SystemLevelToolView
)

install(
  FILES app.js package.json
  DESTINATION /opt/www/SystemLevelToolView
)

install(
  FILES installation/system-level-tool-view.service
  DESTINATION /lib/systemd/system
)

install(
  FILES installation/nginx-selfsigned.key
  DESTINATION /etc/ssl/alevo-api-keys
)

install(
  FILES installation/nginx-selfsigned.crt
  DESTINATION /etc/ssl/certs
)

