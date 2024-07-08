from ....db import conn_db
from datetime import datetime

db = conn_db()

class LogsAuditoria(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_product = db.Column(db.Integer, db.ForeignKey('products.id'))
    id_category = db.Column(db.Integer, db.ForeignKey('categories.id'))
    category = db.relationship("Categories")
    product = db.relationship("Products")    
    imagem_capturada = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<LogsAuditoria {self.id}>'