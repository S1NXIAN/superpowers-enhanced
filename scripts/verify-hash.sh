#!/usr/bin/env bash
# ===========================================================================
# verify-hash.sh — Ephemeral State Hashing (Anti-TOCTOU Protection)
#
# Implements cryptographic file-integrity verification to prevent
# Time-of-Check to Time-of-Use (TOCTOU) exploits. When a sub-agent submits
# a code change, this tool generates an in-memory SHA-256 hash of the file.
# Before test/execution, it recalculates the hash. If the hash mutated
# between check and use, execution is blocked and an alert is thrown.
#
# Usage:
#   verify-hash.sh store <file>        — Store hash for a file
#   verify-hash.sh verify <file>       — Verify file hasn't changed (exit 0/1)
#   verify-hash.sh check               — Verify all tracked files
#   verify-hash.sh clear               — Clear all stored hashes
#   verify-hash.sh status              — Show tracked files and their hash status
#
# Return codes:
#   0 — verification passed
#   1 — verification failed (file tampered)
#   2 — no hash stored for file
#   3 — file not found
#   4 — usage error
# ===========================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
HASH_STORE_DIR="${HOME}/.cache/opencode-file-hashes"
HASH_ALGO="sha256"

# ---------------------------------------------------------------------------
# Help
# ---------------------------------------------------------------------------
show_help() {
  cat <<EOF
verify-hash.sh — Ephemeral State Hashing (Anti-TOCTOU Protection)

Usage:
  verify-hash.sh store <file>     Store SHA-256 hash for a file
  verify-hash.sh verify <file>    Verify file integrity (exit 0=pass, 1=fail)
  verify-hash.sh check            Verify all tracked files
  verify-hash.sh clear            Clear all stored hashes
  verify-hash.sh status           Show tracked files and hash status
  verify-hash.sh help             Show this help

Return codes:
  0  — verification passed
  1  — verification failed (file content changed)
  2  — no hash stored for file
  3  — file not found
  4  — usage error
EOF
  exit 0
}

# ---------------------------------------------------------------------------
# Terminal styling
# ---------------------------------------------------------------------------
if [[ -t 1 ]]; then
  RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
  BLUE='\033[0;34m'; BOLD='\033[1m'; DIM='\033[2m'; NC='\033[0m'
else
  RED=''; GREEN=''; YELLOW=''; BLUE=''; BOLD=''; DIM=''; NC=''
fi

info()    { echo -e "  ${BLUE}•${NC} $1"; }
ok()      { echo -e "  ${GREEN}✓${NC} $1"; }
warn()    { echo -e "  ${YELLOW}⚠${NC} $1"; }
error()   { echo -e "  ${RED}✗${NC} $1"; }
subdued() { echo -e "  ${DIM}$1${NC}"; }

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
hash_file() {
  local file="$1"
  if command -v sha256sum &>/dev/null; then
    sha256sum "$file" | cut -d' ' -f1
  elif command -v shasum &>/dev/null; then
    shasum -a 256 "$file" | cut -d' ' -f1
  elif command -v openssl &>/dev/null; then
    openssl dgst -sha256 "$file" | cut -d' ' -f2
  else
    error "No SHA-256 tool found (sha256sum, shasum, or openssl required)"
    exit 5
  fi
}

hash_path() {
  # Convert absolute file path to a safe hash store path
  # /home/xian/project/src/file.py → home_xian_project_src_file_py.sha256
  echo "$1" | sed 's|^/||; s|/|_|g'
}

ensure_store() {
  mkdir -p "$HASH_STORE_DIR"
}

# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------
cmd_store() {
  local file="$1"

  if [[ ! -f "$file" ]]; then
    error "File not found: $file"
    exit 3
  fi

  ensure_store
  local hash
  hash="$(hash_file "$file")"
  local store_path="${HASH_STORE_DIR}/$(hash_path "$file")"

  echo "$hash" > "$store_path"
  ok "Stored hash for ${file}"
  subdued "  ${hash}"
}

cmd_verify() {
  local file="$1"

  if [[ ! -f "$file" ]]; then
    error "File not found: $file"
    exit 3
  fi

  local store_path="${HASH_STORE_DIR}/$(hash_path "$file")"

  if [[ ! -f "$store_path" ]]; then
    warn "No stored hash for ${file} — run 'verify-hash.sh store ${file}' first"
    exit 2
  fi

  local stored_hash
  stored_hash="$(cat "$store_path")"
  local current_hash
  current_hash="$(hash_file "$file")"

  if [[ "$stored_hash" == "$current_hash" ]]; then
    ok "Integrity verified: ${file}"
    exit 0
  else
    error "INTEGRITY FAILURE: ${file}"
    error "  Stored hash:   ${stored_hash}"
    error "  Current hash:  ${current_hash}"
    error "  File was modified between check and use — possible TOCTOU exploit."
    exit 1
  fi
}

cmd_check() {
  ensure_store
  local all_pass=true
  local count=0
  local fail_count=0

  if [[ -z "$(ls -A "$HASH_STORE_DIR" 2>/dev/null)" ]]; then
    info "No tracked files"
    exit 0
  fi

  for store_file in "${HASH_STORE_DIR}"/*; do
    local store_name
    store_name="$(basename "$store_file")"

    # Reverse the hash path back to a real path
    local real_path
    real_path="/$(echo "$store_name" | sed 's|_|/|g' | sed 's|\.sha256$||')"

    if [[ ! -f "$real_path" ]]; then
      warn "Tracked file no longer exists: ${real_path}"
      continue
    fi

    ((count++))
    if cmd_verify "$real_path" &>/dev/null; then
      : # already reported by cmd_verify
    else
      all_pass=false
      ((fail_count++))
      cmd_verify "$real_path" || true
    fi
  done

  if $all_pass; then
    ok "All ${count} tracked files verified"
  else
    error "${fail_count}/${count} files failed integrity check"
    exit 1
  fi
}

cmd_clear() {
  if [[ -d "$HASH_STORE_DIR" ]]; then
    rm -rf "$HASH_STORE_DIR"
    ok "Cleared all stored hashes"
  else
    info "No stored hashes to clear"
  fi
}

cmd_status() {
  ensure_store
  if [[ -z "$(ls -A "$HASH_STORE_DIR" 2>/dev/null)" ]]; then
    info "No tracked files"
    exit 0
  fi

  echo -e "${BOLD}Tracked files:${NC}"
  echo ""

  for store_file in "${HASH_STORE_DIR}"/*; do
    local store_name
    store_name="$(basename "$store_file")"
    local real_path
    real_path="/$(echo "$store_name" | sed 's|_|/|g' | sed 's|\.sha256$||')"

    if [[ ! -f "$real_path" ]]; then
      echo -e "  ${YELLOW}MISSING${NC}  ${real_path}"
      continue
    fi

    local stored_hash
    stored_hash="$(cat "$store_file")"
    local current_hash
    current_hash="$(hash_file "$real_path")"

    if [[ "$stored_hash" == "$current_hash" ]]; then
      echo -e "  ${GREEN}OK${NC}      ${real_path}"
    else
      echo -e "  ${RED}TAMPERED${NC} ${real_path}"
    fi
  done
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
COMMAND="${1:-help}"

case "$COMMAND" in
  store)
    [[ -n "${2:-}" ]] || { error "Usage: verify-hash.sh store <file>"; exit 4; }
    cmd_store "$2"
    ;;
  verify)
    [[ -n "${2:-}" ]] || { error "Usage: verify-hash.sh verify <file>"; exit 4; }
    cmd_verify "$2"
    ;;
  check)
    cmd_check
    ;;
  clear)
    cmd_clear
    ;;
  status)
    cmd_status
    ;;
  help|--help|-h)
    show_help
    ;;
  *)
    error "Unknown command: $COMMAND"
    show_help
    exit 4
    ;;
esac

