from flask_sqlalchemy import SQLAlchemy

# Initialisation de SQLAlchemy
db = SQLAlchemy()

def init_db(app):
    """Initialise la base de données avec l'application Flask."""
    # Configuration de la base de données MySQL
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://user:pwd@localhost/bd_platform'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    # Créer les tables si elles n'existent pas
    with app.app_context():
        db.create_all()