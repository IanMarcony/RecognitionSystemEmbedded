from flask import jsonify, abort
from ..models.LogsAuditoria import LogsAuditoria
from ....db import conn_db

db = conn_db()

class LogsController:   
    
    def index(self):        
        logs = LogsAuditoria.query.all()
        return jsonify([{"id": log.id} for log in logs])
