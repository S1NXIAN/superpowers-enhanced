#!/bin/bash

# Zeus 2.0 Skills Utility

COMMAND=$1
SHIFT_ARGS="${@:2}"

case $COMMAND in
  list)
    if [ -d "skills" ]; then
      ls -F skills/
    else
      echo "Error: skills/ directory not found."
      exit 1
    fi
    ;;
  bootstrap)
    if [ -f "bin/init-memory.mjs" ]; then
      node bin/init-memory.mjs
    else
      echo "Error: bin/init-memory.mjs not found."
      exit 1
    fi
    ;;
  audit)
    FILE=$2
    if [ -z "$FILE" ]; then
      echo "Usage: $0 audit <file>"
      exit 1
    fi

    if [[ "$FILE" == *".test."* ]] || [[ "$FILE" == *".spec."* ]] || [[ "$FILE" == *"tests/"* ]]; then
      echo "qa-pro"
    elif [[ "$FILE" == *"auth"* ]] || [[ "$FILE" == *"security"* ]] || [[ "$FILE" == *"crypto"* ]]; then
      echo "hacker"
    elif [[ "$FILE" == *"refactor"* ]] || [[ "$FILE" == *"clean"* ]] || [[ "$FILE" == *"util"* ]]; then
      echo "cleaner"
    elif [[ "$FILE" == *"arch"* ]] || [[ "$FILE" == *"schema"* ]] || [[ "$FILE" == *"model"* ]]; then
      echo "architect"
    else
      echo "architect"
    fi
    ;;
  *)
    echo "Usage: $0 {list|bootstrap|audit <file>}"
    exit 1
    ;;
esac
