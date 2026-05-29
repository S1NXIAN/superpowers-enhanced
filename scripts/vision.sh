#!/usr/bin/env bash
# Zeus Vision — Visual Preview Controller

set -euo pipefail

PID_FILE="/tmp/zeus-vision.pid"
PORT=3000

# Force absolute pathing for the digital anatomy
BIN_DIR="${HOME}/.config/opencode/bin"
PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)

start() {
    if [[ -f "$PID_FILE" ]]; then
        echo "Zeus Vision is already running (PID: $(cat "$PID_FILE"))"
        return
    fi
    mkdir -p "$PROJECT_ROOT/docs/zeus/previews"
    node "$BIN_DIR/visual-server.mjs" > /dev/null 2>&1 &
    echo $! > "$PID_FILE"
    echo "Zeus Vision started on port $PORT"
}

stop() {
    if [[ -f "$PID_FILE" ]]; then
        PID=$(cat "$PID_FILE")
        kill "$PID" || true
        rm "$PID_FILE"
        echo "Zeus Vision stopped."
    else
        echo "Zeus Vision is not running."
    fi
}

status() {
    if [[ -f "$PID_FILE" ]]; then
        echo "Zeus Vision is running (PID: $(cat "$PID_FILE"))"
    else
        echo "Zeus Vision is stopped."
    fi
}

case "${1:-}" in
    start) start ;;
    stop) stop ;;
    status) status ;;
    *) echo "Usage: $0 {start|stop|status}" ;;
esac
