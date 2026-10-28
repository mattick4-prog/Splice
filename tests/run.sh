#!/bin/bash
# Builds the game, then runs every browser test (headless Chromium via Playwright).
cd "$(dirname "$0")"
../build.sh || exit 1
mkdir -p shots
fail=0
for t in test*.js; do
  out=$(timeout 150 node "$t" 2>&1)
  if [ "$(echo "$out" | tail -1)" = "[]" ]; then echo "PASS $t"; else echo "FAIL $t"; echo "$out" | tail -5; fail=1; fi
done
[ $fail = 0 ] && echo "All tests passed." || echo "Some tests failed."
exit $fail
