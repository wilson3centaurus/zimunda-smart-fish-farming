from flask import Flask, render_template, request
import subprocess

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('./index.html')
  

@app.route('/run_script', methods=['POST'])
def run_script():
    subprocess.Popen(['python', 'app.py'])
    return 'Script started successfully...'

if __name__ == '__main__':
    app.run(debug=True)
