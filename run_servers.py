import subprocess
import webbrowser
import time
import os
import signal
import sys

def run_flask_server(app_dir, port):
    """Run a Flask server in the specified directory on the given port"""
    try:
        return subprocess.Popen(
            ['python3', 'app.py'],
            cwd=app_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            preexec_fn=os.setsid  # This makes the process a session leader
        )
    except Exception as e:
        print(f"Error starting server in {app_dir}: {e}")
        return None

def open_browser(port, delay=2):
    """Open browser after a delay to ensure server is running"""
    time.sleep(delay)
    try:
        webbrowser.open(f'http://localhost:{port}')
    except Exception as e:
        print(f"Error opening browser: {e}")

def cleanup_servers(processes):
    """Cleanup server processes on exit"""
    for process in processes:
        if process:
            try:
                os.killpg(os.getpgid(process.pid), signal.SIGTERM)
            except Exception as e:
                print(f"Error cleaning up process {process.pid}: {e}")

def main():
    # Get the absolute path to the project directories
    base_dir = os.path.dirname(os.path.abspath(__file__))
    html5_dir = os.path.join(base_dir, 'HTML5_Input_Types')
    comp_form_dir = os.path.join(base_dir, 'Comprehensive_Web_Form')
    
    processes = []
    
    try:
        # Start HTML5 Input Types server
        print("Starting HTML5 Input Types server...")
        html5_server = run_flask_server(html5_dir, 5000)
        if html5_server:
            processes.append(html5_server)
            print("HTML5 Input Types server started on port 5000")
        
        # Start Comprehensive Web Form server
        print("Starting Comprehensive Web Form server...")
        comp_form_server = run_flask_server(comp_form_dir, 5001)
        if comp_form_server:
            processes.append(comp_form_server)
            print("Comprehensive Web Form server started on port 5001")
        
        # Open browsers
        if processes:
            print("Opening browsers...")
            open_browser(5000)
            open_browser(5001)
            
            print("\nServers are running!")
            print("HTML5 Input Types: http://localhost:5000")
            print("Comprehensive Web Form: http://localhost:5001")
            print("\nPress Ctrl+C to stop the servers...")
            
            # Keep the script running
            while True:
                time.sleep(1)
                
    except KeyboardInterrupt:
        print("\nShutting down servers...")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        cleanup_servers(processes)
        print("Servers stopped.")

if __name__ == '__main__':
    main()
