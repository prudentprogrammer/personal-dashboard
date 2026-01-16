#!/usr/bin/env python3
"""
Fetch financial data from Monarch Money and save to JSON.

Setup:
    pip install monarchmoney

First run (interactive login with MFA):
    python scripts/fetch_monarch.py --login

Subsequent runs (uses saved session):
    python scripts/fetch_monarch.py

Schedule with cron for automatic updates:
    0 */6 * * * cd /path/to/personal-dashboard && python scripts/fetch_monarch.py
"""

import asyncio
import json
import argparse
from datetime import datetime
from pathlib import Path

try:
    from monarchmoney import MonarchMoney
except ImportError:
    print("Please install monarchmoney: pip install monarchmoney")
    exit(1)

# Output path for JSON data
OUTPUT_PATH = Path(__file__).parent.parent / "public" / "monarch-data.json"
SESSION_PATH = Path(__file__).parent / ".monarch_session"


async def login_interactive():
    """Interactive login with MFA support."""
    mm = MonarchMoney()
    await mm.interactive_login()
    mm.save_session(str(SESSION_PATH))
    print(f"Session saved to {SESSION_PATH}")
    return mm


async def login_from_session():
    """Load existing session."""
    mm = MonarchMoney()
    mm.load_session(str(SESSION_PATH))
    return mm


async def fetch_monarch_data(mm: MonarchMoney) -> dict:
    """Fetch all relevant financial data."""

    # Get accounts
    accounts_data = await mm.get_accounts()

    # Get cashflow summary
    cashflow = await mm.get_cashflow_summary()

    # Process accounts by type
    accounts = []
    total_assets = 0
    total_liabilities = 0

    for account in accounts_data.get("accounts", []):
        acc = {
            "id": account.get("id"),
            "name": account.get("displayName"),
            "type": account.get("type", {}).get("display", "Other"),
            "subtype": account.get("subtype", {}).get("display", ""),
            "balance": account.get("displayBalance", 0),
            "institution": account.get("institution", {}).get("name", "Unknown"),
            "lastUpdated": account.get("updatedAt"),
        }
        accounts.append(acc)

        balance = float(account.get("displayBalance", 0) or 0)
        if account.get("isAsset", True):
            total_assets += balance
        else:
            total_liabilities += abs(balance)

    # Sort accounts by balance (highest first)
    accounts.sort(key=lambda x: abs(float(x["balance"] or 0)), reverse=True)

    # Group accounts by type
    accounts_by_type = {}
    for acc in accounts:
        acc_type = acc["type"]
        if acc_type not in accounts_by_type:
            accounts_by_type[acc_type] = []
        accounts_by_type[acc_type].append(acc)

    net_worth = total_assets - total_liabilities

    return {
        "lastUpdated": datetime.now().isoformat(),
        "netWorth": round(net_worth, 2),
        "totalAssets": round(total_assets, 2),
        "totalLiabilities": round(total_liabilities, 2),
        "accounts": accounts,
        "accountsByType": accounts_by_type,
        "cashflow": {
            "income": cashflow.get("summary", [{}])[0].get("sumIncome", 0) if cashflow.get("summary") else 0,
            "expenses": cashflow.get("summary", [{}])[0].get("sumExpense", 0) if cashflow.get("summary") else 0,
            "savings": cashflow.get("summary", [{}])[0].get("savings", 0) if cashflow.get("summary") else 0,
            "savingsRate": cashflow.get("summary", [{}])[0].get("savingsRate", 0) if cashflow.get("summary") else 0,
        }
    }


async def main():
    parser = argparse.ArgumentParser(description="Fetch Monarch Money data")
    parser.add_argument("--login", action="store_true", help="Interactive login (first time setup)")
    args = parser.parse_args()

    try:
        if args.login or not SESSION_PATH.exists():
            print("Starting interactive login...")
            mm = await login_interactive()
        else:
            print("Loading saved session...")
            mm = await login_from_session()

        print("Fetching financial data...")
        data = await fetch_monarch_data(mm)

        # Ensure output directory exists
        OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

        # Save to JSON
        with open(OUTPUT_PATH, "w") as f:
            json.dump(data, f, indent=2)

        print(f"Data saved to {OUTPUT_PATH}")
        print(f"Net Worth: ${data['netWorth']:,.2f}")
        print(f"Total Accounts: {len(data['accounts'])}")

    except Exception as e:
        print(f"Error: {e}")
        raise


if __name__ == "__main__":
    asyncio.run(main())
