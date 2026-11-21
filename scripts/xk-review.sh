#!/usr/bin/env bash
# Independent design/engineering reviewer.
#
# Runs xkcode (deepseek-v4.1-flash via the CommandCode shim) as a SEPARATE agent
# over real screenshot files. It must Read the images before answering - source
# code review alone is not the job.
#
# usage: scripts/xk-review.sh "<prompt>" shot1.png [shot2.png ...]
set -euo pipefail
[ $# -ge 2 ] || { echo "usage: $0 \"<prompt>\" img1.png [img2.png...]" >&2; exit 2; }
PROMPT="$1"; shift

LIST=$(printf -- '  - %s\n' "$@")
BODY="$PROMPT

Use the Read tool on EVERY one of these image files (absolute paths) BEFORE answering:
$LIST

Rules:
  - Judge the RENDERED experience, not the source code.
  - Answer in English only.
  - Cite the specific screenshot and region for every claim.
  - Separate defects (broken/wrong) from taste (opinion).
  - Do not praise to be agreeable; find what is actually wrong."

XKCODE_BUILTIN_PROVIDER_CONFIG_FILE=/opt/xKCode/resources/config/provider/zcode-builtin.json \
XKIRO_API_KEY=x-shim \
XKIRO_BASE_URL=http://127.0.0.1:4141 \
node /opt/xKCode/resources/glm/zcode.cjs -p "$BODY" --cwd "$PWD" --mode yolo --no-color
