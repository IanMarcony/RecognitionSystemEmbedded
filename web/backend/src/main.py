from app import create_app
from app.db import conn_db
from flask_migrate import Migrate

app = create_app()
db = conn_db()
migrate = Migrate(app, db)

@app.after_request
def add_headers(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add(
        "Access-Control-Allow-Headers",
        "Content-Type,Authorization")
    return response


if __name__ == "__main__":
    app.run(debug=True)