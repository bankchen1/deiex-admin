#!/bin/bash

echo "Starting systematic update of type imports..."

# Function to update import for a specific file and type
update_import_in_file() {
    local file="$1"
    local old_import_pattern="$2"
    local new_import_statement="$3"
    
    # Replace the import statement
    sed -i '' "s|$old_import_pattern|$new_import_statement|g" "$file"
}

# Get all files that import from old models
files=$(find /Volumes/BankChen/deiex1/deiex-admin/src -name "*.ts" -o -name "*.vue" -exec grep -l "from '@/types/models'" {} \;)

echo "Found $(echo "$files" | wc -l) files to update"

# Process each file individually
for file in $files; do
    echo "Processing $file..."
    
    # Process each import type one by one with specific mappings
    
    # Users module types
    if grep -q "User" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type {[^}]*User[^}]*} from '@/types/models'|import type { User } from '@/contracts/users'|" "$file"
        sed -i '' "s|import type { User } from '@/types/models'|import type { User } from '@/contracts/users'|" "$file"
    fi
    
    if grep -q "LoginRecord" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { LoginRecord } from '@/types/models'|import type { LoginRecord } from '@/contracts/users'|" "$file"
    fi
    
    if grep -q "DeviceInfo" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { DeviceInfo } from '@/types/models'|import type { DeviceInfo } from '@/contracts/users'|" "$file"
    fi
    
    # Assets module types
    if grep -q "Deposit" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { Deposit } from '@/types/models'|import type { Deposit } from '@/contracts/assets'|" "$file"
    fi
    
    if grep -q "Withdrawal" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { Withdrawal } from '@/types/models'|import type { Withdrawal } from '@/contracts/assets'|" "$file"
    fi
    
    if grep -q "WalletAddress" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { WalletAddress } from '@/types/models'|import type { WalletAddress } from '@/contracts/assets'|" "$file"
    fi
    
    if grep -q "ChainHealth" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { ChainHealth } from '@/types/models'|import type { ChainHealth } from '@/contracts/assets'|" "$file"
    fi
    
    if grep -q "RetryTask" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { RetryTask } from '@/types/models'|import type { RetryTask } from '@/contracts/assets'|" "$file"
    fi
    
    # KYC module types
    if grep -q "KycApplication" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { KycApplication } from '@/types/models'|import type { KycApplication } from '@/contracts/kyc'|" "$file"
    fi
    
    if grep -q "KycDocument" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { KycDocument } from '@/types/models'|import type { KycDocument } from '@/contracts/kyc'|" "$file"
    fi
    
    # Orders module types
    if grep -q "Order" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { Order } from '@/types/models'|import type { Order } from '@/contracts/orders'|" "$file"
    fi
    
    if grep -q "FuturesOrder" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { FuturesOrder } from '@/types/models'|import type { FuturesOrder } from '@/contracts/orders'|" "$file"
    fi
    
    if grep -q "Position" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { Position } from '@/types/models'|import type { Position } from '@/contracts/orders'|" "$file"
    fi
    
    if grep -q "Liquidation" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { Liquidation } from '@/types/models'|import type { Liquidation } from '@/contracts/orders'|" "$file"
    fi
    
    if grep -q "CopyTradingRelation" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { CopyTradingRelation } from '@/types/models'|import type { CopyTradingRelation } from '@/contracts/orders'|" "$file"
    fi
    
    # Risk module types
    if grep -q "RiskRule" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { RiskRule } from '@/types/models'|import type { RiskRule } from '@/contracts/risk'|" "$file"
    fi
    
    if grep -q "RiskLimit" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { RiskLimit } from '@/types/models'|import type { RiskLimit } from '@/contracts/risk'|" "$file"
    fi
    
    if grep -q "BlacklistEntry" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { BlacklistEntry } from '@/types/models'|import type { BlacklistEntry } from '@/contracts/risk'|" "$file"
    fi
    
    # Config module types
    if grep -q "Instrument" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { Instrument } from '@/types/models'|import type { Instrument } from '@/contracts/config'|" "$file"
    fi
    
    if grep -q "MarginTemplate" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { MarginTemplate } from '@/types/models'|import type { MarginTemplate } from '@/contracts/config'|" "$file"
    fi
    
    # Calendar module types
    if grep -q "FundingRule" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { FundingRule } from '@/types/models'|import type { FundingRule } from '@/contracts/calendar'|" "$file"
    fi
    
    if grep -q "MaintenanceWindow" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { MaintenanceWindow } from '@/types/models'|import type { MaintenanceWindow } from '@/contracts/calendar'|" "$file"
    fi
    
    if grep -q "Announcement" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { Announcement } from '@/types/models'|import type { Announcement } from '@/contracts/calendar'|" "$file"
    fi
    
    # Fees module types
    if grep -q "TradingFeeTemplate" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { TradingFeeTemplate } from '@/types/models'|import type { TradingFeeTemplate } from '@/contracts/fees'|" "$file"
    fi
    
    if grep -q "WithdrawalFeeTemplate" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { WithdrawalFeeTemplate } from '@/types/models'|import type { WithdrawalFeeTemplate } from '@/contracts/fees'|" "$file"
    fi
    
    # Strategies module types
    if grep -q "StrategyTemplate" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { StrategyTemplate } from '@/types/models'|import type { StrategyTemplate } from '@/contracts/strategies'|" "$file"
    fi
    
    if grep -q "StrategyInstance" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { StrategyInstance } from '@/types/models'|import type { StrategyInstance } from '@/contracts/strategies'|" "$file"
    fi
    
    if grep -q "BacktestResult" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { BacktestResult } from '@/types/models'|import type { BacktestResult } from '@/contracts/strategies'|" "$file"
    fi
    
    # Content module types
    if grep -q "Article" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { Article } from '@/types/models'|import type { Article } from '@/contracts/content'|" "$file"
    fi
    
    if grep -q "Category" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { Category } from '@/types/models'|import type { Category } from '@/contracts/content'|" "$file"
    fi
    
    if grep -q "Comment" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { Comment } from '@/types/models'|import type { Comment } from '@/contracts/content'|" "$file"
    fi
    
    if grep -q "Notification" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { Notification } from '@/types/models'|import type { Notification } from '@/contracts/content'|" "$file"
    fi
    
    if grep -q "EmailTemplate" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { EmailTemplate } from '@/types/models'|import type { EmailTemplate } from '@/contracts/content'|" "$file"
    fi
    
    if grep -q "EmailCampaign" "$file" && grep -q "@/types/models" "$file"; then
        sed -i '' "s|import type { EmailCampaign } from '@/types/models'|import type { EmailCampaign } from '@/contracts/content'|" "$file"
    fi
done

echo "All files updated! Running build to verify."