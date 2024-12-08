from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
from datetime import datetime
import os

app = Flask(__name__, static_folder='.')
CORS(app)  # Enable CORS for all routes

# Create a data directory if it doesn't exist
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
if not os.path.exists(DATA_DIR):
    try:
        os.makedirs(DATA_DIR)
    except Exception as e:
        print(f"Warning: Could not create data directory: {e}")

def safe_write_json(file_path, data):
    """Safely write JSON data to file with error handling"""
    try:
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
        return True
    except Exception as e:
        print(f"Error writing to {file_path}: {e}")
        return False

def safe_read_json(file_path):
    """Safely read JSON data from file with error handling"""
    try:
        if os.path.exists(file_path):
            with open(file_path, 'r') as f:
                return json.load(f)
    except Exception as e:
        print(f"Error reading from {file_path}: {e}")
    return []

def get_all_data():
    """Get all stored data for initial load"""
    data = {
        'emails': safe_read_json(os.path.join(DATA_DIR, 'emails.json')),
        'numbers': safe_read_json(os.path.join(DATA_DIR, 'numbers.json')),
        'dates': safe_read_json(os.path.join(DATA_DIR, 'dates.json')),
        'ranges': safe_read_json(os.path.join(DATA_DIR, 'ranges.json')),
        'colors': safe_read_json(os.path.join(DATA_DIR, 'colors.json'))
    }
    return data

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/data', methods=['GET'])
def get_data():
    """Endpoint to get all stored data"""
    return jsonify(get_all_data())

@app.route('/api/stats', methods=['GET'])
def get_stats():
    try:
        stats = {
            'emails': len(safe_read_json(os.path.join(DATA_DIR, 'emails.json'))),
            'numbers': len(safe_read_json(os.path.join(DATA_DIR, 'numbers.json'))),
            'dates': len(safe_read_json(os.path.join(DATA_DIR, 'dates.json'))),
            'ranges': len(safe_read_json(os.path.join(DATA_DIR, 'ranges.json'))),
            'colors': len(safe_read_json(os.path.join(DATA_DIR, 'colors.json')))
        }
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/submit/email', methods=['POST'])
def submit_email():
    try:
        data = request.json
        email = data.get('email')
        email_type = data.get('email_type', 'other')
        
        file_path = os.path.join(DATA_DIR, 'emails.json')
        emails = safe_read_json(file_path)
        
        submission = {
            'email': email,
            'type': email_type,
            'timestamp': datetime.now().isoformat()
        }
        
        emails.append(submission)
        if safe_write_json(file_path, emails):
            return jsonify({'success': True, 'message': 'Email submitted successfully', 'data': get_all_data()})
        else:
            return jsonify({'success': False, 'message': 'Failed to save email'}), 500
            
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/submit/number', methods=['POST'])
def submit_number():
    try:
        data = request.json
        number = data.get('number')
        
        file_path = os.path.join(DATA_DIR, 'numbers.json')
        numbers = safe_read_json(file_path)
        
        submission = {
            'number': number,
            'timestamp': datetime.now().isoformat()
        }
        
        numbers.append(submission)
        if safe_write_json(file_path, numbers):
            return jsonify({'success': True, 'message': 'Number submitted successfully', 'data': get_all_data()})
        else:
            return jsonify({'success': False, 'message': 'Failed to save number'}), 500
            
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/submit/date', methods=['POST'])
def submit_date():
    try:
        data = request.json
        date = data.get('date')
        
        file_path = os.path.join(DATA_DIR, 'dates.json')
        dates = safe_read_json(file_path)
        
        submission = {
            'date': date,
            'timestamp': datetime.now().isoformat()
        }
        
        dates.append(submission)
        if safe_write_json(file_path, dates):
            return jsonify({'success': True, 'message': 'Date submitted successfully', 'data': get_all_data()})
        else:
            return jsonify({'success': False, 'message': 'Failed to save date'}), 500
            
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/submit/range', methods=['POST'])
def submit_range():
    try:
        data = request.json
        range_value = data.get('range')
        
        file_path = os.path.join(DATA_DIR, 'ranges.json')
        ranges = safe_read_json(file_path)
        
        submission = {
            'range': range_value,
            'timestamp': datetime.now().isoformat()
        }
        
        ranges.append(submission)
        if safe_write_json(file_path, ranges):
            return jsonify({'success': True, 'message': 'Range submitted successfully', 'data': get_all_data()})
        else:
            return jsonify({'success': False, 'message': 'Failed to save range'}), 500
            
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/submit/color', methods=['POST'])
def submit_color():
    try:
        data = request.json
        color = data.get('color')
        
        file_path = os.path.join(DATA_DIR, 'colors.json')
        colors = safe_read_json(file_path)
        
        submission = {
            'color': color,
            'timestamp': datetime.now().isoformat()
        }
        
        colors.append(submission)
        if safe_write_json(file_path, colors):
            return jsonify({'success': True, 'message': 'Color submitted successfully', 'data': get_all_data()})
        else:
            return jsonify({'success': False, 'message': 'Failed to save color'}), 500
            
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    # Ensure data directory exists
    os.makedirs(DATA_DIR, exist_ok=True)
    # Initialize empty JSON files if they don't exist
    for data_type in ['emails', 'numbers', 'dates', 'ranges', 'colors']:
        file_path = os.path.join(DATA_DIR, f'{data_type}.json')
        if not os.path.exists(file_path):
            safe_write_json(file_path, [])
    
    print(f"Data directory: {DATA_DIR}")
    app.run(debug=True)
