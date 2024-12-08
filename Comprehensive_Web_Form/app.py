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

@app.route('/')
def serve_static():
    return send_from_directory('.', 'index.html')

@app.route('/api/submit/profile', methods=['POST'])
def submit_profile():
    try:
        data = request.json
        profile = {
            'languages': data.get('languages', []),
            'expertise': data.get('expertise', ''),
            'platforms': data.get('platforms', []),
            'timestamp': datetime.now().isoformat()
        }
        
        file_path = os.path.join(DATA_DIR, 'profiles.json')
        profiles = safe_read_json(file_path)
        profiles.append(profile)
        
        if safe_write_json(file_path, profiles):
            return jsonify({
                'status': 'success',
                'message': 'Profile stored successfully'
            })
        else:
            return jsonify({
                'status': 'error',
                'message': 'Failed to store profile'
            }), 500
            
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    profiles = safe_read_json(os.path.join(DATA_DIR, 'profiles.json'))
    
    stats = {
        'total_submissions': len(profiles),
        'languages': {},
        'expertise_levels': {},
        'platforms': {}
    }
    
    for profile in profiles:
        # Count programming languages
        for lang in profile.get('languages', []):
            stats['languages'][lang] = stats['languages'].get(lang, 0) + 1
            
        # Count expertise levels
        expertise = profile.get('expertise', '')
        if expertise:
            stats['expertise_levels'][expertise] = stats['expertise_levels'].get(expertise, 0) + 1
            
        # Count platforms
        for platform in profile.get('platforms', []):
            stats['platforms'][platform] = stats['platforms'].get(platform, 0) + 1
    
    return jsonify(stats)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
