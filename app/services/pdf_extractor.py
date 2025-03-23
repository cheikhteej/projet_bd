from PyPDF2 import PdfReader

class PDFExtractor:
    def __init__(self, file_path):
        """Initialise l'extracteur de PDF."""
        self.file_path = file_path

    def extract_text(self):
        """Extrait le texte du fichier PDF."""
        reader = PdfReader(self.file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        return text