# from flask import Flask
# from app.routes import auth_routes, exam_routes, submission_routes
# from app.models import init_db

# app = Flask(__name__)

# # Initialisation de la base de données
# init_db(app)

# # Enregistrement des Blueprints
# app.register_blueprint(auth_routes, url_prefix='/api/auth')
# app.register_blueprint(exam_routes, url_prefix='/api/exams')
# app.register_blueprint(submission_routes, url_prefix='/api/submissions')

# if __name__ == '__main__':
#     app.run(debug=True)


from app import create_app

# Créer l'application Flask
app = create_app()

if __name__ == '__main__':
    # Lancer l'application en mode développement
    app.run(debug=True)
