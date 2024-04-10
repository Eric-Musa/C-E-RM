# C-E-RM
I need a CRM software to help me not only remember to talk or respond to people, but also remind me of other recurring obligations.


## 09 Apr 2024
Committing old work and documenting how to run:
- `cd` to [backend-C-E-RM](backend-C-E-RM/), and then run `python app.py`
    - this starts the backend API server providing the notes (subject to change!)
- `nvm && nvm use --lts` with my custom `nvm` script and alias... basically activate `npm`
- then from within [frontend-C-E-RM](frontend-C-E-RM/), run `npm run dev`
  - if [`node-modules`](frontend-C-E-RM/node-modules) is not present, run `npm install` first
- be ready for some weird CORS errors from the frontend, visible if the list of notes in the right column does not render
  - `flask-cors` is running in [`app.py`](backend-C-E-RM/app.py) so refreshing the frontend a few times should resolve this issue


## 13 Feb 2024
Wrote functional React frontend (no styling yet, haha) and Flask API backend. I am running into issues with state asynchronic behavior, I think due to my use of promise chaining instead of async/await to update states. Saving my promise chaining code first though.


## 06 Feb 2024

### Notetaking app
- file based DB
- React frontend
- Node backend
- 


## 16 Nov 2023

### Project plan:
1. Find examples of cool-looking features and bring them here
2. Use ChatGpt to rebuild it
3. 


### Node:
```
ericmusa@Erics-MacBook-Pro C-E-RM % nvm       
activating nvm
nvm activated
ericmusa@Erics-MacBook-Pro C-E-RM % nvm install --lts
Installing latest LTS version.
Downloading and installing node v20.9.0...
Downloading https://nodejs.org/dist/v20.9.0/node-v20.9.0-darwin-arm64.tar.xz...
############################################################################################################################################### 100.0%
Computing checksum with shasum -a 256
Checksums matched!
Now using node v20.9.0 (npm v10.1.0)
ericmusa@Erics-MacBook-Pro C-E-RM % nvm use --lts
Now using node v20.9.0 (npm v10.1.0)
```