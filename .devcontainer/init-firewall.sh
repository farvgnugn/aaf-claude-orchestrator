#!/bin/bash

# Claude Code DevContainer Firewall Setup
# This script establishes network security rules for the devcontainer

set -e

echo "🔥 Initializing Claude Code DevContainer Firewall..."

# Check if iptables is available
if ! command -v iptables &> /dev/null; then
    echo "⚠️  iptables not found, installing..."
    apk add --no-cache iptables
fi

# Flush existing rules
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X

# Set default policies
iptables -P INPUT ACCEPT
iptables -P FORWARD DROP
iptables -P OUTPUT DROP

# Allow loopback traffic
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# Allow established and related connections
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Allow DNS queries
iptables -A OUTPUT -p udp --dport 53 -j ACCEPT
iptables -A OUTPUT -p tcp --dport 53 -j ACCEPT

# Allow HTTP/HTTPS for package downloads
iptables -A OUTPUT -p tcp --dport 80 -j ACCEPT
iptables -A OUTPUT -p tcp --dport 443 -j ACCEPT

# Allow SSH (if needed)
iptables -A OUTPUT -p tcp --dport 22 -j ACCEPT

# Allow local network access for development
iptables -A OUTPUT -d 127.0.0.0/8 -j ACCEPT
iptables -A OUTPUT -d 10.0.0.0/8 -j ACCEPT
iptables -A OUTPUT -d 172.16.0.0/12 -j ACCEPT
iptables -A OUTPUT -d 192.168.0.0/16 -j ACCEPT

# Allow application ports
iptables -A INPUT -p tcp --dport 4000 -j ACCEPT  # API
iptables -A INPUT -p tcp --dport 5433 -j ACCEPT  # PostgreSQL
iptables -A INPUT -p tcp --dport 6380 -j ACCEPT  # Redis

# Log dropped packets for debugging
iptables -A INPUT -j LOG --log-prefix "DEVCONTAINER-INPUT-DROP: "
iptables -A OUTPUT -j LOG --log-prefix "DEVCONTAINER-OUTPUT-DROP: "

echo "✅ Firewall rules established successfully"
echo "🔐 DevContainer is now secured with network restrictions"

# Validate firewall rules
echo "📋 Current firewall rules:"
iptables -L -n --line-numbers

echo "🚀 Claude Code DevContainer is ready for secure development!"