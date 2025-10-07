from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__, static_folder='static', template_folder='.')

# Configure Flask for production
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 31536000  # Cache static files for 1 year

@app.route('/')
def index():
    """Serve the main index page"""
    return render_template('index.html')

@app.route('/favicon.ico')
def favicon():
    """Serve favicon"""
    return send_from_directory('.', 'feri.png', mimetype='image/png')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files (CSS, JS, images)"""
    return send_from_directory('.', filename)

@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors by redirecting to home"""
    return render_template('index.html')

if __name__ == '__main__':
    # For development only - use gunicorn in production
    app.run(host='0.0.0.0', port=8080, debug=False)

