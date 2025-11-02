#!/bin/bash

# Vercel Deployment Script for DEIEX Admin Panel
# This script handles deployment to Vercel with Doppler secrets integration

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ADMIN_DIR="$PROJECT_DIR/deiex-admin"
ENVIRONMENT="${ENVIRONMENT:-production}"
DEPLOY_LOG="$PROJECT_DIR/logs/vercel_deploy.log"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$DEPLOY_LOG"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$DEPLOY_LOG"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$DEPLOY_LOG"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$DEPLOY_LOG"
}

print_step() {
    echo -e "${PURPLE}[STEP]${NC} $1" | tee -a "$DEPLOY_LOG"
}

# Function to check prerequisites
check_prerequisites() {
    print_step "Checking deployment prerequisites..."
    
    # Check required tools
    local required_tools=("vercel" "doppler" "npm")
    for tool in "${required_tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            print_error "$tool is required but not installed"
            exit 1
        fi
    done
    
    # Check if in correct directory
    if [[ ! -f "$ADMIN_DIR/package.json" ]]; then
        print_error "deiex-admin directory not found"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Function to validate Doppler setup
validate_doppler() {
    print_step "Validating Doppler setup..."
    
    # Check if Doppler project is configured
    if ! doppler projects list | grep -q "deiex-admin"; then
        print_warning "Doppler project 'deiex-admin' not found, using local .env file"
        return 0
    fi
    
    # Check if we can access secrets
    if ! doppler secrets --project deiex-admin --config "$ENVIRONMENT" list &> /dev/null; then
        print_error "Cannot access Doppler secrets for deiex-admin in $ENVIRONMENT environment"
        exit 1
    fi
    
    print_success "Doppler setup validated"
}

# Function to prepare environment
prepare_environment() {
    print_step "Preparing environment..."
    
    cd "$ADMIN_DIR"
    
    # Install dependencies
    print_status "Installing dependencies..."
    npm ci
    
    # Check if Doppler project exists
    if doppler projects list | grep -q "deiex-admin"; then
        print_status "Using Doppler secrets for environment variables"
        # Download secrets to .env file
        doppler secrets --project deiex-admin --config "$ENVIRONMENT" download --format env > .env.local
    else
        print_warning "Doppler project not found, using existing .env.local file"
        if [[ ! -f ".env.local" ]]; then
            print_warning "No .env.local file found, deployment may fail"
        fi
    fi
    
    print_success "Environment prepared"
}

# Function to run pre-deployment checks
run_pre_checks() {
    print_step "Running pre-deployment checks..."
    
    cd "$ADMIN_DIR"
    
    # Run linting
    print_status "Running code linting..."
    if ! npm run lint; then
        print_warning "Code linting issues found"
    fi
    
    # Run format check
    print_status "Running format check..."
    if ! npm run format; then
        print_warning "Code formatting issues found"
    fi
    
    print_success "Pre-deployment checks completed"
}

# Function to deploy to Vercel
deploy_to_vercel() {
    print_step "Deploying to Vercel..."
    
    cd "$ADMIN_DIR"
    
    local vercel_args="--yes"
    
    # Add environment-specific flags
    if [[ "$ENVIRONMENT" == "production" ]]; then
        vercel_args="$vercel_args --prod"
        print_status "Deploying to production environment"
    else
        print_status "Deploying to preview environment"
    fi
    
    # Deploy with Vercel CLI
    print_status "Starting Vercel deployment..."
    local deploy_output
    deploy_output=$(vercel $vercel_args 2>&1)
    local deploy_exit_code=$?
    
    if [[ $deploy_exit_code -ne 0 ]]; then
        print_error "Vercel deployment failed"
        echo "$deploy_output" | tee -a "$DEPLOY_LOG"
        exit 1
    fi
    
    # Extract deployment URL
    local deploy_url
    deploy_url=$(echo "$deploy_output" | grep -E "https://[a-zA-Z0-9.-]+\.vercel\.app" | tail -1)
    
    print_success "Deployment completed successfully"
    print_status "Deployment URL: $deploy_url"
    
    echo "$deploy_output" >> "$DEPLOY_LOG"
}

# Function to run post-deployment checks
run_post_checks() {
    print_step "Running post-deployment checks..."
    
    cd "$ADMIN_DIR"
    
    # Check if we can access the deployed application
    local deploy_url
    deploy_url=$(vercel --token "$VERCEL_TOKEN" --scope "$VERCEL_ORG_ID" inspect --json | jq -r '.url')
    
    if [[ -n "$deploy_url" ]]; then
        print_status "Verifying deployment accessibility..."
        if curl -f -s "$deploy_url/" > /dev/null; then
            print_success "Application is accessible"
        else
            print_warning "Could not verify application accessibility"
        fi
    fi
    
    print_success "Post-deployment checks completed"
}

# Function to cleanup
cleanup() {
    print_step "Cleaning up..."
    
    cd "$ADMIN_DIR"
    
    # Remove temporary files
    if [[ -f ".env.local" ]]; then
        # Only remove if it was generated from Doppler
        if grep -q "doppler" .env.local 2>/dev/null; then
            rm -f .env.local
        fi
    fi
    
    print_success "Cleanup completed"
}

# Main deployment function
main() {
    local start_time=$(date +%s)
    
    echo "" | tee -a "$DEPLOY_LOG"
    echo "🚀 DEIEX Admin Panel Vercel Deployment Script" | tee -a "$DEPLOY_LOG"
    echo "===========================================" | tee -a "$DEPLOY_LOG"
    echo "Environment: $ENVIRONMENT" | tee -a "$DEPLOY_LOG"
    echo "Project: deiex-admin" | tee -a "$DEPLOY_LOG"
    echo "Timestamp: $(date)" | tee -a "$DEPLOY_LOG"
    echo "" | tee -a "$DEPLOY_LOG"
    
    # Parse command line arguments
    local skip_tests=false
    local force=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-tests)
                skip_tests=true
                shift
                ;;
            --force)
                force=true
                shift
                ;;
            --environment)
                ENVIRONMENT="$2"
                shift 2
                ;;
            --help)
                echo "Usage: $0 [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  --skip-tests     Skip running tests"
                echo "  --force          Force deployment without confirmations"
                echo "  --environment    Set deployment environment (default: production)"
                echo "  --help           Show this help message"
                echo ""
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Confirmation for production deployment
    if [[ "$ENVIRONMENT" == "production" ]] && [[ "$force" != "true" ]]; then
        print_warning "⚠️  You are about to deploy deiex-admin to PRODUCTION on Vercel!"
        echo ""
        read -p "Are you sure you want to proceed? [y/N]: " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_status "Deployment cancelled"
            exit 0
        fi
    fi
    
    # Execute deployment steps
    check_prerequisites
    validate_doppler
    prepare_environment
    
    if [[ "$skip_tests" != "true" ]]; then
        run_pre_checks
    fi
    
    deploy_to_vercel
    run_post_checks
    cleanup
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    echo "" | tee -a "$DEPLOY_LOG"
    print_success "🎉 deiex-admin deployment to Vercel completed successfully in ${duration} seconds!" | tee -a "$DEPLOY_LOG"
}

# Run main function with all arguments
main "$@"