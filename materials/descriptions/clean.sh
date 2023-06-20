#!/bin/bash

input="${1:-/dev/stdin}"
output="${2:-/dev/stdout}"

# Squashes consecutive blanks, then deletes blank lines.
tr -s  '[:blank:]' ' ' < "$input" | sed '/^[ \t]*$/d' > "$output"
