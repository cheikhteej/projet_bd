from flask import request, jsonify
from app.models.submission import Submission
from app.services.auth_service import AuthService
from app.services.pdf_extractor import PDFExtractor
from app.services.deepseek_local import DeepSeekLocal
from . import submission_routes
from app.models import db
from app.models.correction import Correction


auth_service = AuthService()
deepseek_service = DeepSeekLocal()

@submission_routes.route('/submissions', methods=['POST'])
def submit():
    """Route pour soumettre une réponse à un examen."""
    if not auth_service.is_student():
        return jsonify({"message": "Accès refusé"}), 403

    exam_id = request.json.get('exam_id')
    file = request.files['file']
    file_path = f"/tmp/{file.filename}"
    file.save(file_path)

    # Extraction du texte du PDF
    pdf_extractor = PDFExtractor(file_path)
    text = pdf_extractor.extract_text()

    # Correction automatique avec DeepSeek
    correction_text = deepseek_service.evaluate_sql_query(text)

    # Création de la soumission
    new_submission = Submission(
        exam_id=exam_id,
        student_id=auth_service.get_current_user().id,
        file_path=file_path
    )
    db.session.add(new_submission)
    db.session.commit()

    # Création de la correction
    new_correction = Correction(
        submission_id=new_submission.id,
        correction_text=correction_text,
        grade=0.0  # Note par défaut (à ajuster selon la correction)
    )
    db.session.add(new_correction)
    db.session.commit()

    return jsonify({"message": "Soumission réussie", "submission_id": new_submission.id}), 201

@submission_routes.route('/submissions/<int:submission_id>', methods=['GET'])
def get_submission(submission_id):
    """Route pour obtenir les détails d'une soumission spécifique."""
    submission = Submission.query.get_or_404(submission_id)
    return jsonify({
        "id": submission.id,
        "exam_id": submission.exam_id,
        "student_id": submission.student_id,
        "file_path": submission.file_path,
        "grade": submission.grade
    })