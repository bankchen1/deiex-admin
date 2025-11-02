#!/bin/bash

# DEIEX Admin Panel E2E Test Script
# Tests admin API endpoints systematically

BASE_URL="http://localhost:8082/api/v1"
ADMIN_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwODJkMmFmMi0zNTJkLTRmMjItYThiOS04OWE2ZWRlMjk2YTYiLCJlbWFpbCI6InRlc3RAaW50ZWdyYXRpb24uY29tIiwiaXNzIjoiZGVpZXgtYmFja2VuZCIsImV4cCI6MTc2MjY3NjQ0NiwibmJmIjoxNzYyMDcxNjQ2LCJpYXQiOjE3NjIwNzE2NDZ9.oNlhgI9QHEIcCQAA6qXUM4brEc77LiwN6DQu4imVtcI"

PASS=0
FAIL=0

test_endpoint() {
    local name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    local auth="$5"
    local expected="$6"

    if [ "$auth" == "true" ]; then
        if [ "$method" == "GET" ]; then
            result=$(curl -s -H "Authorization: Bearer ${ADMIN_TOKEN}" "${BASE_URL}${endpoint}")
        else
            result=$(curl -s -X "$method" -H "Authorization: Bearer ${ADMIN_TOKEN}" -H "Content-Type: application/json" "${BASE_URL}${endpoint}" -d "$data")
        fi
    else
        if [ "$method" == "GET" ]; then
            result=$(curl -s "${BASE_URL}${endpoint}")
        else
            result=$(curl -s -X "$method" -H "Content-Type: application/json" "${BASE_URL}${endpoint}" -d "$data")
        fi
    fi

    if echo "$result" | grep -q "\"success\":$expected"; then
        echo "✅ PASS: $name"
        ((PASS++))
    else
        echo "❌ FAIL: $name"
        echo "   Response: $(echo $result | head -c 100)"
        ((FAIL++))
    fi
}

echo "================================================"
echo "DEIEX Admin Panel E2E Test Report"
echo "================================================"
echo ""
echo "Backend: $BASE_URL"
echo "Test Date: $(date)"
echo ""

echo "1. ADMIN AUTHENTICATION"
echo "------------------------------------"
test_endpoint "Admin Login" "POST" "/auth/login" '{"email":"test@integration.com","password":"Test123456"}' "false" "true"
echo ""

echo "2. ADMIN ENDPOINTS (Authenticated)"
echo "------------------------------------"
test_endpoint "Get User Behavior Summary" "GET" "/admin/analytics/user-behavior/summary" "" "true" "true"
test_endpoint "Get User Retention" "GET" "/admin/analytics/user-behavior/retention" "" "true" "true"
test_endpoint "Get Geographic Distribution" "GET" "/admin/analytics/user-behavior/geo" "" "true" "true"
test_endpoint "Get Top Activities" "GET" "/admin/analytics/user-behavior/top" "" "true" "true"
test_endpoint "Get Audit Logs" "GET" "/admin/compliance/audit" "" "true" "true"
test_endpoint "Get Deposits" "GET" "/admin/deposits" "" "true" "true"
test_endpoint "Get Withdrawals" "GET" "/admin/withdrawals" "" "true" "true"
test_endpoint "Get Wallet Addresses" "GET" "/admin/wallets/addresses" "" "true" "true"
test_endpoint "Get Chain Health" "GET" "/admin/wallets/chain-health" "" "true" "true"
test_endpoint "Get Retry Queue" "GET" "/admin/wallets/retry-queue" "" "true" "true"
echo ""

echo "================================================"
echo "TEST SUMMARY"
echo "================================================"
echo "Total Tests: $((PASS + FAIL))"
echo "Passed: $PASS"
echo "Failed: $FAIL"
echo "Pass Rate: $(echo "scale=1; $PASS*100/($PASS+$FAIL)" | bc)%"
echo "================================================"