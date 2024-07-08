from flask import Blueprint, request
from flask_cors import cross_origin
from ..controllers.index import CategoriesController
categories_routes = Blueprint('categories', __name__)
categories_controller = CategoriesController()

@categories_routes.route('/', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_categories():
    return categories_controller.index()

@categories_routes.route('/<int:category_id>', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_unique_category(category_id):
    return categories_controller.get_unique(category_id)

@categories_routes.route('/', methods=['POST'])
@cross_origin(supports_credentials=True)
def create_category():
    return categories_controller.create(request)

@categories_routes.route('/<int:category_id>', methods=['PUT'])
@cross_origin(supports_credentials=True)
def change_category(category_id):
    return categories_controller.change(request, category_id)

@categories_routes.route('/<int:category_id>', methods=['DELETE'])
@cross_origin(supports_credentials=True)
def delete_category(category_id):
    return categories_controller.delete(category_id)
