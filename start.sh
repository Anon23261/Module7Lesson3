#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════╗"
echo "║        Starting HTML5 Forms Demo          ║"
echo "╚═══════════════════════════════════════════╝"
echo -e "${NC}"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python3 is not installed. Please install Python3 to continue."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "pip3 is not installed. Please install pip3 to continue."
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Run the Python script
echo -e "${GREEN}Starting servers...${NC}"
python3 run_servers.py
