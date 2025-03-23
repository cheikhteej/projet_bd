from . import db

class Exam(db.Model):
    """Modèle pour les sujets d'examens."""
    __tablename__ = 'exams'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    file_path = db.Column(db.String(500), nullable=False)  # Chemin du fichier PDF ou texte
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    # Relations
    submissions = db.relationship('Submission', backref='exam', lazy=True)

    def __repr__(self):
        return f"<Exam {self.title}, Created by: {self.created_by}>"