import dotenv
dotenv.load_dotenv()
import os
from datetime import datetime

DATA_PATH = os.environ.get('DATA_PATH')
NOTES_PATH = f'{DATA_PATH}/notes'

FILENAME_DT_FORMAT = '%a-%d-%b-%Y_%H-%M-%S'
INLINE_DT_FORMAT = '%a %d %b, %Y %H:%M'


def save_note(text, filename=None):
    if isinstance(filename, datetime):
        filename = filename.strftime(FILENAME_DT_FORMAT)
    filename = filename or f'{datetime.now().strftime(FILENAME_DT_FORMAT)}.md'
    if not filename.endswith('.md'):
        filename += '.md'
    
    path = f'{NOTES_PATH}/{filename}'
    
    with open(path, 'w') as f:
        return path, f.write(text)


def list_notes():
    timestamps_and_notes = {
        datetime.strptime(note.split('.')[0], FILENAME_DT_FORMAT): note \
            for note in os.listdir(NOTES_PATH)
    }
    return [v for k, v in sorted(timestamps_and_notes.items(), reverse=True)]


def get_note_path(chrono_index):
    assert 0 <= chrono_index < len(list_notes()), f'Index {chrono_index} out of range for {len(list_notes())}'
    return f'{NOTES_PATH}/{list_notes()[chrono_index]}'


def read_note(path=None):
    if isinstance(path, int):
        path = get_note_path(path)
    elif path is None:
        path = get_note_path(0)
    else:
        assert os.path.exists(path), f'File {path} does not exist in {NOTES_PATH} directory'
    with open(path, 'r') as f:
        return path, f.read()

