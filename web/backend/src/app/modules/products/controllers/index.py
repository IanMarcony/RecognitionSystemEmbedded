from flask import jsonify, abort
from ..models.Products import Products
from ....db import conn_db

db = conn_db()

class ProductsController:   

    def index(self):
        products = Products.query.all()
        return jsonify([{"id": product.id,
                        "name": product.name,
                        "imagem": product.imagem,
                        "description": product.description,
                        "created_at": product.created_at} for product in products])

    def get_unique(self, product_id):
        product = Products.query.get_or_404(product_id)
        return jsonify({"id": product.id,
                        "name": product.name,
                        "imagem": product.imagem,
                        "description": product.description,
                        "created_at": product.created_at})

    def create(self, body_product):
        if not body_product.json or not 'name' in body_product.json:
            abort(400)
        product = Products(name=body_product.json['name'],
                        imagem=body_product.json['imagem'],
                        description=body_product.json['description'])
        db.session.add(product)
        db.session.commit()
        return jsonify({'id': product.id}), 201

    def change(self, body_product, product_id):
        if not body_product.json:
            abort(400)
            
        product = Products.query.get_or_404(product_id)
        
        if 'name' in body_product.json:
            product.name = body_product.json['name']
        if 'description' in body_product.json:
            product.description = body_product.json['description']
        db.session.commit()
        
        return jsonify({'id': product.id})    

    def delete(self, product_id):
        product = Products.query.get_or_404(product_id)
        db.session.delete(product)
        db.session.commit()
        return jsonify({}), 204
        