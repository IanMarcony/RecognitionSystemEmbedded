from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def conn_db():
    return db