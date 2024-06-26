from flask import jsonify, abort
from ..models.Categories import Categories
from ....db import conn_db

db = conn_db()

class CategoriesController:   

    def index(self):
        categories = Categories.query.all()
        return jsonify([{"id": category.id,
                        "name": category.name,
                        "description": category.description,
                        "created_at": category.created_at} for category in categories])

    def get_unique(self, category_id):
        category = Categories.query.get_or_404(category_id)
        print(category)
        return jsonify({"id": category.id,
                        "name": category.name,
                        "description": category.description,
                        "created_at": category.created_at})

    def create(self, body_category):
        if not body_category.json or not 'name' in body_category.json:
            abort(400)
        category = Categories(name=body_category.json['name'],
                        description=body_category.json['description'])
        db.session.add(category)
        db.session.commit()
        return jsonify({'id': category.id}), 201

    def change(self, body_category, category_id):
        if not body_category.json:
            abort(400)
            
        category = Categories.query.get_or_404(category_id)
        
        if 'name' in body_category.json:
            category.name = body_category.json['name']
        if 'description' in body_category.json:
            category.description = body_category.json['description']
        db.session.commit()
        
        return jsonify({'id': category.id})    

    def delete(self, category_id):
        category = Categories.query.get_or_404(category_id)
        db.session.delete(category)
        db.session.commit()
        return jsonify({}), 204
        