from flask import jsonify, abort
from ..models.LogsAuditoria import LogsAuditoria
from ...categories.models.Categories import Categories
from ...products.models.Products import Products
from ....db import conn_db
from sqlalchemy import func

db = conn_db()

class LogsController:   
    
    def index(self):  
        most_frequent_product = db.session.query(
            LogsAuditoria.id_product,
            func.count(LogsAuditoria.id_product).label('frequency')
        ).group_by(
            LogsAuditoria.id_product
        ).order_by(
            func.count(LogsAuditoria.id_product).desc()
        ).first()        
        
        most_frequent_category = db.session.query(
            LogsAuditoria.id_category,
            func.count(LogsAuditoria.id_category).label('frequency')
        ).group_by(
            LogsAuditoria.id_category
        ).order_by(
            func.count(LogsAuditoria.id_category).desc()
        ).first()
        
        count_products = LogsAuditoria.query.count()
        
        if most_frequent_product:
            product_id = most_frequent_product.id_product
            frequency = most_frequent_product.frequency

            product = Products.query.get(product_id)
            most_frequent_product = {
                'product_id': product_id,
                'product_name': product.name,
                'frequency': frequency
            }
        else:
            most_frequent_product = None
            
        if most_frequent_category:
            category_id = most_frequent_category.id_category
            frequency = most_frequent_category.frequency

            category = Categories.query.get(category_id)
            most_frequent_category = {
                'category_id': category_id,
                'category_name': category.name,
                'frequency': frequency
            }
        else:
            most_frequent_category = None
        
        return jsonify({"most_frequent_product": most_frequent_product, 
                        "count_products": count_products, 
                        "most_frequent_category": most_frequent_category})
    
    def create(self, app, body):
        with app.app_context():
            product_name = body['product_name']
            product = Products.query.filter_by(name=product_name).first()

            if product:
                log = LogsAuditoria(
                    id_product= product.id,
                    id_category= product.id_category,
                    imagem_capturada= "default",
                )
                db.session.add(log)
                db.session.commit()
                return log
            else:
                print("Product not found")
        
        
