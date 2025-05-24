"""
Personal Health Records Manager (PHRM) - Entry point script
This script serves as a convenient entry point for the PHRM application.
"""
import webbrowser
from pathlib import Path
import time
import subprocess
import sys
import os


def print_banner():
    """Print a welcome banner for the application."""
    print("\n" + "=" * 70)
    print("  PERSONAL HEALTH RECORDS MANAGER (PHRM)")
    print("  A secure application for managing health records with AI insights")
    print("=" * 70)
    print("\nStarting PHRM setup and services...\n")


def check_environment():
    """Check if the development environment is properly set up."""
    print("✓ Checking environment...")
    
    # Check Python version
    python_version = sys.version_info
    if python_version.major < 3 or (python_version.major == 3 and python_version.minor < 10):
        print("✗ Error: Python 3.10+ is required")
        return False
    print(f"✓ Python version: {python_version.major}.{python_version.minor}.{python_version.micro}")
    
    # Check if virtual environment is activated
    if not os.environ.get("VIRTUAL_ENV"):
        print("! Warning: No virtual environment detected. It's recommended to use a virtual environment.")
    
    return True


def main():
    """Main entry point for the PHRM application."""
    print_banner()
    
    if not check_environment():
        print("\n✗ Environment check failed. Please fix the issues and try again.")
        return
    
    print("\n✓ Environment check passed.\n")
    print("To start the PHRM application, run the following commands:")
    print("\nBackend:")
    print("  cd backend")
    print("  uvicorn app.main:app --reload")
    print("\nFrontend:")
    print("  cd frontend")
    print("  npm run dev")
    
    print("\nFor detailed development tasks, see TASKS.md")
    print("\nTo create a new project from scratch, follow the step-by-step guide in TASKS.md")


if __name__ == "__main__":
    main()
