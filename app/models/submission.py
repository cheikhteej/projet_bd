from . import db

class Submission(db.Model):
    """Modèle pour les réponses soumises par les étudiants."""
    __tablename__ = 'submissions'

    id = db.Column(db.Integer, primary_key=True)
    exam_id = db.Column(db.Integer, db.ForeignKey('exams.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)  # Chemin du fichier PDF
    submitted_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    grade = db.Column(db.Float, nullable=True)  # Note attribuée

    # Relations
    corrections = db.relationship('Correction', backref='submission', lazy=True)

    def __repr__(self):
        return f"<Submission {self.id}, Exam: {self.exam_id}, Student: {self.student_id}>"