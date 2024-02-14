
import React, { useState, useEffect } from 'react';
import './App.css';

enum Mode {
  View = 'view',
  Edit = 'edit',
}

const LOAD_LAST_NOTE = true
// const FILE_DATETIME_FORMAT = '%a-%d-%b-%Y_%H-%M-%S'

const getNewTimestamp = () => {return new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}

function App() {
  // the text that is saved in the current file
  const [savedText, setSavedText] = useState('');

  // the list of files in the current directory
  const [notes, setNotes] = useState<string[]>([]);
  
  // the index of the currently focused file
  const [focusedFile, setFocusedFile] = useState(-1);

  // the timestamp of the current note being edited
  const [timestamp, setTimestamp] = useState('')
    

  // Retrieve data from API calls to a local server
  useEffect(() => {

    // Load the last note if the flag is set
    if (LOAD_LAST_NOTE) {
      setFocusedFile(1)
      
      loadSavedNote((data)=> { 
        setSavedText(data.text);
        setLocalText(data.text);
        setTimestamp(data.path.split('/').pop());
      })
    
    // Otherwise, create a new note with the current timestamp
    } else {
      setTimestamp(getNewTimestamp())
      setSavedText(`${timestamp}:\n- `);
    }

    // Load the list of notes
    fetch('http://localhost:5000/api/list')
      .then((response) => response.json())
      .then((data) => {
        setNotes(data.notes);
        // STUB: highlight the currently focused file
        // STUB: add folders/some other organization to the notes based on the path/timestamp
      });
  }, []);

  // the text that is currently being edited
  const [localText, setLocalText] = useState('');

  // the mode of the editor
  const [mode, setMode] = useState('view');

  // the text to display on the save button
  // this will be updated on click to reflect the number of characters written to the file
  const [saveButtonText, setSaveButtonText] = useState('Save Changes');
  
  // the function to handle text input changes in the main text area
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalText(event.target.value);
  };

  // the function to handle the reset button click, which will reset the local text to the saved text
  const handleResetClick = () => {
    setLocalText(savedText);
  };

  // the function to handle the save button click, which will save the local text to the current file
  const handleSaveClick = () => {
    saveInputText()
  };

  // the function to handle the mode toggle button click, which will toggle the mode between view and edit
  const handleModeToggle = () => {
    setMode(mode === Mode.View ? Mode.Edit : Mode.View);
    // STUB: Toggle the editability of the input field and enable Markdown rendering
  };
    
  // the function to load the currently focused file into the editor
  const loadSavedNote = (callback: (data: any) => void) => {
    fetch(`http://localhost:5000/api/read/${focusedFile}`)
      .then((response) => response.json())
      .then(callback);
  }

  // the function to handle the file button click, which will load the selected file into the editor
  const saveInputText = () => {

    console.log('Saving text:', localText);
    console.log('Timestamp:', timestamp);

    // Send the text to the server to be saved
    fetch('http://localhost:5000/api/write', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: localText, 
        timestamp: timestamp
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSavedText(localText);
      
        // path = data.path (fullname) split from the last '/' and get the last element
        // Update the notes array to include the new path
        const path = data.path.split('/').pop();
        console.log('path:', path);
        setNotes([path, ...notes]);

        // Update the save button text to reflect the number of characters written for 5 seconds
        setSaveButtonText(`${data.chars_written} characters written to ${path}`);
        setTimeout(() => {
          setSaveButtonText('Save Changes');
        }, 5000);
      });
  }

  const handleFileButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log('File button clicked:', event.currentTarget.textContent);
    console.log('Saved text:', savedText);
    console.log('Local text:', localText);
    const index = notes.indexOf(event.currentTarget.textContent as string);
    console.log('Index:', index);
    setFocusedFile(index);
    loadSavedNote((data)=> { 
      setSavedText(data.text);
      setLocalText(data.text);
      setTimestamp(data.path.split('/').pop());
    })
    console.log('Saved text:', savedText);
    console.log('Local text:', localText);
  }

  return (
    <div className="app-container">
      <div className="left-column">
        <button onClick={handleResetClick}>Reset</button>
        <button onClick={handleSaveClick}>{saveButtonText}</button>
        <button onClick={handleModeToggle}>{mode === Mode.View ? 'Editing' : 'Viewing'}</button>
        <input type="text" value={localText} onChange={handleInputChange} />
      </div>
        <div className="right-column">
          {notes.map((filename: string, index: number) => (
            <button key={filename} 
                    className={`${index === focusedFile ? "focused" : ""} note`} 
                    onClick={handleFileButtonClick}>
                {filename}
            </button>
          ))}
        </div>
      </div>
  );
}

export default App;
