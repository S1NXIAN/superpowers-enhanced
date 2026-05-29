#!/usr/bin/env bash

set -euo pipefail

# Zeus 2.0 Skills Utility

readonly COMMAND="${1:-}"

# Function to determine audit tag based on filename
get_audit_tag() {
    local -r file="$1"
    
    # QA/Testing
    if [[ "$file" =~ (\.test\.|\.spec\.|tests/) ]]; then
        echo "qa-pro"
        return
    fi

    # Security sensitive
    if [[ "$file" =~ (auth|security|crypto) ]]; then
        echo "hacker"
        return
    fi

    # Maintenance/Utils
    if [[ "$file" =~ (refactor|clean|util) ]]; then
        echo "cleaner"
        return
    fi

    # Architecture/Structure
    if [[ "$file" =~ (arch|schema|model) ]]; then
        echo "architect"
        return
    fi

    # Default
    echo "architect"
}

case "$COMMAND" in
    list)
        if [[ -d "skills" ]]; then
            ls -F "skills/"
        else
            echo "Error: skills/ directory not found." >&2
            exit 1
        fi
        ;;
    bootstrap)
        if [[ -f "bin/init-memory.mjs" ]]; then
            node "bin/init-memory.mjs"
        else
            echo "Error: bin/init-memory.mjs not found." >&2
            exit 1
        fi
        ;;
    audit)
        FILE="${2:-}"
        if [[ -z "$FILE" ]]; then
            echo "Usage: $0 audit <file>" >&2
            exit 1
        fi
        get_audit_tag "$FILE"
        ;;
    *)
        echo "Usage: $0 {list|bootstrap|audit <file>}" >&2
        exit 1
        ;;
esac
