from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from data import save_note, read_note, list_notes, FILENAME_DT_FORMAT, INLINE_DT_FORMAT
import requests

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return 'Welcome to my Flask app!'


@app.route('/api/write', methods=['POST'])
def write_note():
    """
    Request body: {text: str, timestamp: str}
    Response: {path: str, chars_written: int}
    """
    request_body = request.get_json()
    note_text = request_body['text']
    if 'timestamp' in request_body:
        # timestamp = datetime.strptime(request_body['timestamp'], INLINE_DT_FORMAT)
        # timestamp = datetime.strptime(request_body['timestamp'], '%Y-%m-%dT%H:%M:%S.%fZ')
        timestamp = datetime.strptime(request_body['timestamp'], '%m/%d/%Y, %I:%M:%S %p')
    else:
        timestamp = datetime.now()

    path, chars_written = save_note(note_text, timestamp)
    assert chars_written == len(note_text), f'Expected {len(note_text)} chars written, got {chars_written}'
    return {'path': path, 'chars_written': chars_written}


@app.route('/api/list', methods=['GET'])
def list_all_notes():
    """
    Request body: None
    Response: {notes: List[str]}
    """
    
    notes = list_notes()
    return {'notes': notes}


@app.route('/api/read/<int:chrono_index>', methods=['GET'])
def read_from_db(chrono_index):
    """
    Request body: None
    Response: {path: str, text: str}
    """
    path, text = read_note(chrono_index)
    return {'path': path, 'text': text}


if __name__ == '__main__':

    testing = False

    if not testing:
        app.run(debug=True)

    if testing:
        url = 'http://127.0.0.1:5000'
        write_note_url = f'{url}/api/write'
        read_note_url = f'{url}/api/read'
        list_notes_url = f'{url}/api/list'
        write_result = requests.post(write_note_url, json={'text': 'Hello, world!'})
        print(write_result.json())

        list_result = requests.get(list_notes_url)
        print(list_result.json())

        read_result = requests.get(read_note_url, json={'chrono_index': 0})
        print(read_result.json())


