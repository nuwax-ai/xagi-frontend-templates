#!/bin/bash

# XAGI Frontend Templates Validation Script
# Non-interactive and repeatable local checks for template quality gates.

set -uo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

run_check() {
  local check_name="$1"
  local check_cmd="$2"

  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  log_info "Running: ${check_name}"

  if eval "$check_cmd"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
    log_success "Passed: ${check_name}"
  else
    FAILED_TESTS=$((FAILED_TESTS + 1))
    log_error "Failed: ${check_name}"
  fi

  echo "----------------------------------------"
}

main() {
  log_info "Start template validation"
  log_info "Time: $(date)"
  echo "========================================"

  run_check "Version consistency (check:versions)" "pnpm check:versions"
  run_check "React Vite quality gate (pnpm check)" "pnpm -C packages/react-vite run check"
  run_check "Vue3 Vite quality gate (pnpm check)" "pnpm -C packages/vue3-vite run check"
  run_check "React Vite build" "pnpm -C packages/react-vite run build"
  run_check "Vue3 Vite build" "pnpm -C packages/vue3-vite run build"

  echo "========================================"
  log_info "Validation summary"
  log_info "Total checks: $TOTAL_TESTS"
  log_success "Passed checks: $PASSED_TESTS"

  if [ $FAILED_TESTS -gt 0 ]; then
    log_error "Failed checks: $FAILED_TESTS"
    exit 1
  fi

  log_success "Failed checks: $FAILED_TESTS"
  log_success "All template checks passed"
}

main
