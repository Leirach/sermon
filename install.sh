#!/bin/bash
if [ "$(id -u)" -ne 0 ]; then
    echo "ERROR: This script must be run with sudo"
    exit 1
fi

IS_ACTIVE=$(systemctl is-active sermon.service)
if [ "$IS_ACTIVE" == "active" ]; then
    echo "Service is already installed and active"
    exit 0
fi

export NODE_BINARY=$(which node)
if [ -z "$NODE_BINARY" ]; then
    echo "Node binary not found. Please make sure Node.js is installed and in your PATH."
    exit 1
fi

WG_BIN=$(which wg)
if [ -z "$WG_BIN" ]; then
    echo "wireguard not found, adding default path /usr/bin/wg to sudoers"
    WG_BIN=/usr/bin/wg
fi

SUDOERS_FILE=/etc/sudoers.d/wg_allow_$SUDO_USER

echo "$SUDO_USER ALL=(ALL) NOPASSWD: $WG_BIN" | tee $SUDOERS_FILE >/dev/null
chmod 0440 $SUDOERS_FILE

echo "Added $WG_BIN to $SUDOERS_FILE"

envsubst < service.template > /etc/systemd/system/sermon.service

systemctl daemon-reload
systemctl enable sermon.service
systemctl start sermon.service
