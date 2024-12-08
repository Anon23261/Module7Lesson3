# HTML5 Forms Demo Projects

This repository contains two interactive web form projects that demonstrate modern HTML5 features, form validation, and data collection with Python backend integration.

## Projects Overview

### 1. HTML5 Input Types Demo
A comprehensive demonstration of HTML5's modern input types with real-time validation and data storage.
- Email input with validation
- Number input with constraints
- Date input with range limits
- Range input with real-time feedback
- Color input with preview
- Real-time statistics dashboard

### 2. Developer Profile Form
A professional web form for collecting developer information with accessibility features.
- Programming language selection
- Experience level tracking
- Development platform preferences
- Interactive statistics dashboard
- Data visualization

## Features

- **Modern UI/UX Design**
  - Responsive layouts
  - Real-time validation
  - Interactive feedback
  - Smooth animations

- **Python Backend**
  - Flask REST API
  - JSON data storage
  - Real-time statistics
  - Error handling

- **Frontend Technologies**
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - ARIA accessibility

## Quick Start

### Option 1: Using the Start Script (Recommended)

1. Make sure you have Python 3.7+ installed
2. Run the start script:
   ```bash
   ./start.sh
   ```
   This will:
   - Create a virtual environment
   - Install all dependencies
   - Start both servers
   - Open the forms in your default browser

### Option 2: Manual Setup

1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies for both projects:
   ```bash
   cd HTML5_Input_Types
   pip install -r requirements.txt
   cd ../Comprehensive_Web_Form
   pip install -r requirements.txt
   cd ..
   ```

3. Start both servers:
   ```bash
   python run_servers.py
   ```

4. Open the forms in your browser:
   - HTML5 Input Types Demo: [http://localhost:5000](http://localhost:5000)
   - Developer Profile Form: [http://localhost:5001](http://localhost:5001)

## Project Structure

```
.
├── HTML5_Input_Types/
│   ├── app.py              # Flask backend
│   ├── requirements.txt    # Python dependencies
│   ├── data/              # JSON data storage
│   ├── static/
│   │   ├── css/
│   │   └── js/
│   └── index.html
│
├── Comprehensive_Web_Form/
│   ├── app.py              # Flask backend
│   ├── requirements.txt    # Python dependencies
│   ├── data/              # JSON data storage
│   ├── static/
│   │   ├── css/
│   │   └── js/
│   └── index.html
│
├── run_servers.py          # Script to run both servers
├── start.sh               # Convenience startup script
└── README.md
```

## Development

- Both projects use Flask for the backend API
- Frontend is built with vanilla JavaScript for simplicity
- Data is stored in JSON files for easy inspection
- Real-time statistics are updated via API calls

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- HTML5 Working Group for modern input types
- Flask team for the excellent web framework
- Mozilla Developer Network for documentation
