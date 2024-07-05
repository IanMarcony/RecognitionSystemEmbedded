from flask import Flask
from .db import conn_db
db = conn_db()
def create_app():
    app = Flask(__name__)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    from .modules.products.routes.index import products_routes
    from .modules.categories.routes.index import categories_routes
    from .modules.logs.routes.index import logs_routes
    app.register_blueprint(products_routes, url_prefix='/products')
    app.register_blueprint(categories_routes, url_prefix='/categories')
    app.register_blueprint(logs_routes, url_prefix='/logs')

    return app
