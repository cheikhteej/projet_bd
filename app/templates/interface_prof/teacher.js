import { config } from './config.js';

class TeacherExamManager {
    constructor() {
        this.setupEventListeners();
        this.initializeEditors();
        this.loadProfile();
    }

    setupEventListeners() {
        // Gestion des onglets
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => this.switchTab(e));
        });

        // Gestion des fichiers
        document.getElementById('examUpload').addEventListener('change', (e) => this.handleExamUpload(e));
        
        // Boutons d'action
        document.getElementById('saveExam').addEventListener('click', () => this.saveExam());
        document.getElementById('previewCorrection').addEventListener('click', () => this.previewCorrection());
        document.getElementById('addQuestion').addEventListener('click', () => this.addNewQuestion());

        // Slider IA
        document.getElementById('aiThreshold').addEventListener('input', (e) => {
            document.getElementById('thresholdValue').textContent = `${e.target.value}%`;
        });
    }

    async initializeEditors() {
        const editor = await import('ace-builds');
        this.setupEditor('editor1');
    }

    setupEditor(elementId) {
        const editor = ace.edit(elementId);
        editor.setTheme("ace/theme/monokai");
        editor.session.setMode("ace/mode/sql");
        editor.setOptions({
            fontSize: "12pt",
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true
        });
    }

    switchTab(event) {
        const targetTab = event.target.dataset.tab;
        
        // Mise à jour des boutons
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });
        event.target.classList.add('active');

        // Mise à jour du contenu
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(targetTab).classList.add('active');
    }

    async handleExamUpload(event) {
        const file = event.target.files[0];
        if (file) {
            try {
                const pdfUrl = URL.createObjectURL(file);
                const pdfPreview = document.getElementById('pdfPreview');
                pdfPreview.src = pdfUrl;
                
                // Add preview controls
                const previewContainer = document.getElementById('pdfPreviewContainer');
                
                if (!document.querySelector('.preview-controls')) {
                    const controls = document.createElement('div');
                    controls.className = 'preview-controls';
                    controls.innerHTML = `
                        <div class="zoom-controls">
                            <button class="zoom-button" data-action="zoom-out">
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M19 13H5v-2h14v2z"/>
                                </svg>
                            </button>
                            <span class="zoom-level">100%</span>
                            <button class="zoom-button" data-action="zoom-in">
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                </svg>
                            </button>
                        </div>
                    `;
                    previewContainer.appendChild(controls);
                }
            } catch (error) {
                console.error('Erreur lors du chargement de l\'examen:', error);
            }
        }
    }

    loadProfile() {
        const profile = {
            firstName: 'Prof',
            lastName: 'SGBD',
            teacherId: 'PROF001'
        };
        this.updateProfileDisplay(profile);
    }

    updateProfileDisplay(profile) {
        const initials = (profile.firstName[0] + profile.lastName[0]).toUpperCase();
        document.querySelector('.profile-avatar').textContent = initials;
        document.querySelector('.profile-name').textContent = `${profile.firstName} ${profile.lastName}`;
        document.getElementById('teacherId').textContent = profile.teacherId;
    }

    addNewQuestion() {
        const solutionList = document.querySelector('.solution-list');
        const questionNumber = document.querySelectorAll('.solution-item').length + 1;
        
        const newQuestion = document.createElement('div');
        newQuestion.className = 'solution-item';
        newQuestion.innerHTML = `
            <h4>Question ${questionNumber}</h4>
            <div id="editor${questionNumber}" class="sql-editor"></div>
            <button class="add-example">Ajouter un exemple</button>
        `;
        
        solutionList.insertBefore(newQuestion, document.getElementById('addQuestion'));
        this.setupEditor(`editor${questionNumber}`);
    }

    saveExam() {
        // Logique de sauvegarde de l'examen
        console.log('Sauvegarde de l\'examen...');
    }

    previewCorrection() {
        // Logique de prévisualisation de la correction
        console.log('Prévisualisation de la correction...');
    }
}

const teacherApp = new TeacherExamManager();