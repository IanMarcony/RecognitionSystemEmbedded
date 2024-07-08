from flask import Blueprint, request
from flask_cors import cross_origin
from ..controllers.index import ProductsController
products_routes = Blueprint('products', __name__)
products_controller = ProductsController()

@cross_origin(supports_credentials=True)
@products_routes.route('/', methods=['GET'])
def get_products():
    print('get_products')
    return products_controller.index()

@cross_origin(supports_credentials=True)
@products_routes.route('/<int:product_id>', methods=['GET'])
def get_unique_product(product_id):
    return products_controller.get_unique(product_id)

@cross_origin(supports_credentials=True)
@products_routes.route('/', methods=['POST'])
def create_product():
    return products_controller.create(request)

@cross_origin(supports_credentials=True)
@products_routes.route('/<int:product_id>', methods=['PUT'])
def change_product(product_id):
    return products_controller.change(request, product_id)

@cross_origin(supports_credentials=True)
@products_routes.route('/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    return products_controller.delete(product_id)
