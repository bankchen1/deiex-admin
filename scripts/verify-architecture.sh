#!/bin/bash

# 架构验证脚本
# 用于快速检查所有模块的架构完整性

echo "🔍 开始验证架构完整性..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
PASS=0
FAIL=0
WARN=0

# 检查函数
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASS++))
        return 0
    else
        echo -e "${RED}✗${NC} $1 (缺失)"
        ((FAIL++))
        return 1
    fi
}

check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $1 包含 '$2'"
        ((PASS++))
        return 0
    else
        echo -e "${YELLOW}⚠${NC} $1 缺少 '$2'"
        ((WARN++))
        return 1
    fi
}

echo "📦 检查核心模块..."
echo ""

# Users模块（参考标准）
echo "=== Users模块（参考标准）==="
check_file "src/services/api/facade/users.ts"
check_file "src/stores/users.ts"
check_file "src/pages/users/List.vue"
check_file "src/pages/users/Detail.vue"
check_file "src/tables/users/UserTable.vue"
check_content "src/stores/users.ts" "const error = ref"
check_content "src/stores/users.ts" "from '@/services/api/facade'"
echo ""

# Assets模块（参考标准）
echo "=== Assets模块（参考标准）==="
check_file "src/services/api/facade/assets.ts"
check_file "src/stores/assets.ts"
check_file "src/pages/assets/Overview.vue"
check_file "src/pages/assets/Deposits.vue"
check_file "src/pages/assets/Withdrawals.vue"
check_file "src/pages/assets/Wallets.vue"
echo ""

# Orders模块（已修复）
echo "=== Orders模块（已修复）==="
check_file "src/services/api/facade/orders.ts"
check_file "src/stores/orders.ts"
check_file "src/pages/orders/SpotOrders.vue"
check_file "src/pages/orders/FuturesOrders.vue"
check_file "src/pages/orders/Positions.vue"
check_file "src/pages/orders/Liquidations.vue"
check_file "src/pages/orders/CopyTrading.vue"
check_file "src/tables/orders/SpotOrderTable.vue"
check_content "src/stores/orders.ts" "const error = ref"
check_content "src/stores/orders.ts" "listCopyTradingRelations"
echo ""

# Risk模块（已修复）
echo "=== Risk模块（已修复）==="
check_file "src/services/api/facade/risk.ts"
check_file "src/stores/risk.ts"
check_file "src/pages/risk/index.vue"
check_file "src/pages/risk/Rules.vue"
check_file "src/pages/risk/Limits.vue"
check_file "src/pages/risk/Blacklist.vue"
check_file "src/tables/risk/RiskRuleTable.vue"
check_content "src/stores/risk.ts" "fetchPublishedRules"
check_content "src/stores/risk.ts" "fetchLimits"
echo ""

# Config模块
echo "=== Config模块 ==="
check_file "src/services/api/facade/config.ts"
check_file "src/stores/instruments.ts"
check_file "src/pages/config/instruments/index.vue"
check_file "src/pages/config/margin/index.vue"
check_file "src/pages/config/fees/index.vue"
check_file "src/pages/config/calendar/index.vue"
check_file "src/pages/config/icons/index.vue"
check_file "src/pages/config/mappings/index.vue"
check_file "src/pages/config/security/index.vue"
echo ""

# 路由检查
echo "=== 路由配置 ==="
check_file "src/router/index.ts"
check_file "src/router/modules/users.ts"
check_file "src/router/modules/assets.ts"
check_file "src/router/modules/orders.ts"
check_file "src/router/modules/risk.ts"
check_file "src/router/modules/config.ts"
echo ""

# Mock检查
echo "=== Mock配置 ==="
check_file "src/mock/handlers/users.ts"
check_file "src/mock/handlers/assets.ts"
check_file "src/services/mock/index.ts"
echo ""

# 统计结果
echo ""
echo "================================"
echo "验证结果统计："
echo -e "${GREEN}通过: $PASS${NC}"
echo -e "${YELLOW}警告: $WARN${NC}"
echo -e "${RED}失败: $FAIL${NC}"
echo "================================"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ 架构验证通过！${NC}"
    exit 0
else
    echo -e "${RED}✗ 发现 $FAIL 个问题，请检查上述输出${NC}"
    exit 1
fi
