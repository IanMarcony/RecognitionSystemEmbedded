from flask import Flask
from .db import conn_db
db = conn_db()
def create_app():
    app = Flask(__name__)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    from .modules.products.routes.index import products_routes
    app.register_blueprint(products_routes, url_prefix='/products')

    return app
