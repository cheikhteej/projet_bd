from flask import request, jsonify, session
from app.services.auth_service import AuthService
from app.models.user import User
from . import auth_routes

auth_service = AuthService()

@auth_routes.route('/login', methods=['POST'])
def login():
    """Route pour la connexion des utilisateurs."""
    username = request.json.get('username')
    password = request.json.get('password')
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        auth_service.login(user)
        return jsonify({"message": "Connexion réussie", "user": {"id": user.id, "username": user.username, "role": user.role}})
    else:
        return jsonify({"message": "Nom d'utilisateur ou mot de passe incorrect"}), 401

@auth_routes.route('/logout', methods=['POST'])
def logout():
    """Route pour la déconnexion des utilisateurs."""
    auth_service.logout()
    return jsonify({"message": "Déconnexion réussie"})

@auth_routes.route('/me', methods=['GET'])
def get_current_user():
    """Route pour obtenir les informations de l'utilisateur connecté."""
    user = auth_service.get_current_user()
    if user:
        return jsonify({"user": {"id": user.id, "username": user.username, "role": user.role}})
    else:
        return jsonify({"message": "Non authentifié"}), 401