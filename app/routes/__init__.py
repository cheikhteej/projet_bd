from flask import Blueprint

# Création des Blueprints
auth_routes = Blueprint('auth_routes', __name__)
exam_routes = Blueprint('exam_routes', __name__)
submission_routes = Blueprint('submission_routes', __name__)

# Import des routes
from . import auth_routes, exam_routes, submission_routes