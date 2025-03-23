import os

class Config:
    """Configuration de base de l'application."""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'une_clé_secrète_tres_securisee'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'mysql+pymysql://root:@localhost/bd_platform'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = 'uploads'  # Dossier pour stocker les fichiers uploadés
    ALLOWED_EXTENSIONS = {'pdf'}  # Types de fichiers autorisés