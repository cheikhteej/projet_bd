from app import create_app

# Créer l'application Flask
app = create_app()

if __name__ == '__main__':
    # Lancer l'application en mode développement
    app.run(debug=True)