from flask import Blueprint, request
from flask_cors import cross_origin
from ..controllers.index import ProductsController
products_routes = Blueprint('products', __name__)
products_controller = ProductsController()

@products_routes.route('/', methods=['GET'])
@cross_origin()
def get_products():
    print('get_products')
    return products_controller.index()

@products_routes.route('/<int:product_id>', methods=['GET'])
@cross_origin()
def get_unique_product(product_id):
    return products_controller.get_unique(product_id)

@products_routes.route('/', methods=['POST'])
@cross_origin()
def create_product():
    return products_controller.create(request)

@products_routes.route('/<int:product_id>', methods=['PUT'])
@cross_origin()
def change_product(product_id):
    return products_controller.change(request, product_id)

@products_routes.route('/<int:product_id>', methods=['DELETE'])
@cross_origin()
def delete_product(product_id):
    return products_controller.delete(product_id)
