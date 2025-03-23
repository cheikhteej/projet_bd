from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app.config import Config

# Initialisation de SQLAlchemy
db = SQLAlchemy()

def create_app():
    """Factory pour créer et configurer l'application Flask."""
    app = Flask(__name__)

    # Charger la configuration
    app.config.from_object(Config)

    # Initialiser la base de données
    db.init_app(app)

    # Enregistrer les Blueprints
    from app.routes.auth_routes import auth_routes
    from app.routes.exam_routes import exam_routes
    from app.routes.submission_routes import submission_routes

    app.register_blueprint(auth_routes, url_prefix='/api/auth')
    app.register_blueprint(exam_routes, url_prefix='/api/exams')
    app.register_blueprint(submission_routes, url_prefix='/api/submissions')

    # Créer les tables de la base de données si elles n'existent pas
    with app.app_context():
        db.create_all()

    return app