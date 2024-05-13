#!/bin/bash
IS_ACTIVE=$(sudo systemctl is-active sermon.service)
if [ "$IS_ACTIVE" == "active" ]; then
    echo "Service is already installed and active"
    exit 0
fi

export NODE_BINARY=$(which node)
if [ -z "$NODE_BINARY" ]; then
    echo "Node binary not found. Please make sure Node.js is installed and in your PATH."
    exit 1
fi

npm install --omit=dev

WG_BIN=$(which wg)
if [ -z "$WG_BIN" ]; then
    echo "wireguard not found, using default path /usr/bin/wg"
    WG_BIN=/usr/bin/wg
fi

SUDOERS_FILE=/etc/sudoers.d/wg_allow_$USER

echo "$USER ALL=(ALL) NOPASSWD: $WG_BIN" | sudo tee $SUDOERS_FILE > /dev/null
sudo chmod 0440 $SUDOERS_FILE

echo "Added $WG_BIN to $SUDOERS_FILE"

envsubst < service.template | sudo tee -a /etc/systemd/system/sermon.service > /dev/null
sudo systemctl daemon-reload
sudo systemctl enable sermon.service
sudo systemctl start sermon.service
