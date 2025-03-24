from flask import session
from werkzeug.security import check_password_hash
from app.models.user import User

class AuthService:
    def __init__(self):
        """Initialise le service d'authentification."""
        pass

    def login(self, user):
        """Authentifie un utilisateur et le connecte."""
        session['user_id'] = user.id
        session['role'] = user.role

    def logout(self):
        """Déconnecte l'utilisateur."""
        session.pop('user_id', None)
        session.pop('role', None)

    def is_authenticated(self):
        """Vérifie si l'utilisateur est authentifié."""
        return 'user_id' in session

    def is_professor(self):
        """Vérifie si l'utilisateur est un professeur."""
        return session.get('role') == 'professeur'

    def is_student(self):
        """Vérifie si l'utilisateur est un étudiant."""
        return session.get('role') == 'étudiant'

    def get_current_user(self):
        """Retourne l'utilisateur actuellement connecté."""
        from app.models import db
        if 'user_id' in session:
            return db.session.get(User, session['user_id'])
        return None