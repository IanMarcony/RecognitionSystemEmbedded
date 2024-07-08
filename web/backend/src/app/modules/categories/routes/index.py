from flask import Blueprint, request
from flask_cors import cross_origin
from ..controllers.index import CategoriesController
categories_routes = Blueprint('categories', __name__)
categories_controller = CategoriesController()

@cross_origin(supports_credentials=True)
@categories_routes.route('/', methods=['GET'])
def get_categories():
    return categories_controller.index()

@cross_origin(supports_credentials=True)
@categories_routes.route('/<int:category_id>', methods=['GET'])
def get_unique_category(category_id):
    return categories_controller.get_unique(category_id)

@cross_origin(supports_credentials=True)
@categories_routes.route('/', methods=['POST'])
def create_category():
    return categories_controller.create(request)

@cross_origin(supports_credentials=True)
@categories_routes.route('/<int:category_id>', methods=['PUT'])
def change_category(category_id):
    return categories_controller.change(request, category_id)

@cross_origin(supports_credentials=True)
@categories_routes.route('/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    return categories_controller.delete(category_id)
