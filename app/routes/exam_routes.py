from flask import request, jsonify
from app.models.exam import Exam
from app.services.auth_service import AuthService
from . import exam_routes
from app.models import db

auth_service = AuthService()

@exam_routes.route('/exams', methods=['GET'])
def get_exams():
    """Route pour obtenir la liste des examens."""
    exams = Exam.query.all()
    return jsonify([{"id": exam.id, "title": exam.title, "description": exam.description, "created_by": exam.created_by} for exam in exams])

@exam_routes.route('/exams', methods=['POST'])
def create_exam():
    """Route pour créer un nouvel examen (réservé aux professeurs)."""
    if not auth_service.is_professor():
        return jsonify({"message": "Accès refusé"}), 403

    data = request.json
    new_exam = Exam(
        title=data.get('title'),
        description=data.get('description'),
        file_path=data.get('file_path'),  # Chemin du fichier PDF ou texte
        created_by=auth_service.get_current_user().id
    )
    db.session.add(new_exam)
    db.session.commit()
    return jsonify({"message": "Examen créé", "exam_id": new_exam.id}), 201

@exam_routes.route('/exams/<int:exam_id>', methods=['GET'])
def get_exam(exam_id):
    """Route pour obtenir les détails d'un examen spécifique."""
    exam = Exam.query.get_or_404(exam_id)
    return jsonify({"id": exam.id, "title": exam.title, "description": exam.description, "created_by": exam.created_by})