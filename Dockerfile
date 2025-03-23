# Utiliser une image de base avec Python et CUDA (si vous utilisez un GPU)
FROM nvidia/cuda:11.8.0-base-ubuntu22.04

# Installer les dépendances système
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    git \
    && rm -rf /var/lib/apt/lists/*

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de l'application
COPY . /app

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Installer Ollama via pip
RUN pip install ollama

# Copier le modèle DeepSeek en local
COPY ./deepseek_model /app/deepseek_model

# Exposer le port Flask
EXPOSE 5000

# Lancer Ollama et l'application Flask
CMD ollama serve & flask run --host=0.0.0.0