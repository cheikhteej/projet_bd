from . import db

class Correction(db.Model):
    """Modèle pour les corrections automatiques."""
    __tablename__ = 'corrections'

    id = db.Column(db.Integer, primary_key=True)
    submission_id = db.Column(db.Integer, db.ForeignKey('submissions.id'), nullable=False)
    correction_text = db.Column(db.Text, nullable=False)  # Texte de la correction générée par DeepSeek
    grade = db.Column(db.Float, nullable=False)  # Note attribuée
    corrected_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __repr__(self):
        return f"<Correction {self.id}, Submission: {self.submission_id}, Grade: {self.grade}>"