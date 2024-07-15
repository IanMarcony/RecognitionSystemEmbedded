from flask_migrate import Migrate
from flask_cors import CORS
from app import create_app
from app.db import conn_db

app = create_app()
db = conn_db()
migrate = Migrate(app, db)
CORS(app)

if __name__ == "__main__":
    app.run(debug=True, threaded=True, port=3000, host='0.0.0.0')