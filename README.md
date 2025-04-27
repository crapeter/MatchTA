# MatchTA

This project is a web application for efficiently generating and managing assignments between Courses and Teaching Assistants (TAs).
It features a Python Flask backend and a ReactJS frontend styled with Bootstrap.
Tech Stack

    Backend: Python, Flask

    Frontend: ReactJS

    Communication: RESTful APIs

## Installation

### Backend Setup

Clone the repository:

    git clone https://github.com/crapeter/MatchTA
    cd MatchTA

Navigate to the Server

    cd MatchTA_Server

Create and activate a virtual environment:

    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate

Install backend dependencies:

    pip install -r requirements.txt

Run the Flask server:

    python ./main.py

By default, the backend will be available at <http://localhost:5000>

### Frontend Setup

Navigate to the frontend directory:

    cd ../
    cd MatchTA_UI

Install frontend dependencies:

    npm install

Start the React app:

    npm start

By default, the frontend will run at <http://localhost:3000>
