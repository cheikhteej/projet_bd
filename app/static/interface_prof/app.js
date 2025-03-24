import { config } from './config.js';

class StudentExamViewer {
    constructor() {
        this.setupEventListeners();
        this.loadExam();
        this.loadProfile();
    }

    setupEventListeners() {
        document.getElementById('answerUpload').addEventListener('change', (e) => this.handleAnswerUpload(e));
        document.getElementById('downloadExam').addEventListener('click', () => this.downloadExam());
        
        // Add profile event listeners
        document.querySelector('.profile-info').addEventListener('click', () => this.openProfileModal());
        document.getElementById('saveProfile').addEventListener('click', () => this.saveProfile());
        document.getElementById('cancelProfile').addEventListener('click', () => this.closeProfileModal());
    }

    async loadExam() {
        try {
            const response = await fetch('/examen_bd.pdf');
            const pdfBytes = await response.arrayBuffer();
            
            // Create URL for PDF preview
            const pdfUrl = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
            const pdfPreview = document.getElementById('pdfPreview');
            pdfPreview.src = pdfUrl;
            
            // Add preview controls
            const previewContainer = document.getElementById('pdfPreviewContainer');
            previewContainer.classList.remove('hidden');
            
            // Add zoom controls
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
            
            // Store PDF for download
            const base64Pdf = this._arrayBufferToBase64(pdfBytes);
            localStorage.setItem('examPdf', base64Pdf);
        } catch (error) {
            console.error('Erreur lors du chargement de l\'examen:', error);
        }
    }

    loadProfile() {
        const profile = JSON.parse(localStorage.getItem('studentProfile')) || config.defaultProfile;
        this.updateProfileDisplay(profile);
    }

    updateProfileDisplay(profile) {
        const initials = (profile.firstName[0] + profile.lastName[0]).toUpperCase();
        document.querySelector('.profile-avatar').textContent = initials;
        document.querySelector('.profile-name').textContent = `${profile.firstName} ${profile.lastName}`;
        document.getElementById('studentId').textContent = profile.studentId;
    }

    openProfileModal() {
        const profile = JSON.parse(localStorage.getItem('studentProfile')) || config.defaultProfile;
        document.getElementById('firstName').value = profile.firstName;
        document.getElementById('lastName').value = profile.lastName;
        document.getElementById('studentIdInput').value = profile.studentId;
        document.querySelector('.modal-overlay').classList.remove('hidden');
        document.querySelector('.profile-modal').classList.remove('hidden');
    }

    closeProfileModal() {
        document.querySelector('.modal-overlay').classList.add('hidden');
        document.querySelector('.profile-modal').classList.add('hidden');
    }

    saveProfile() {
        const profile = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            studentId: document.getElementById('studentIdInput').value
        };
        localStorage.setItem('studentProfile', JSON.stringify(profile));
        this.updateProfileDisplay(profile);
        this.closeProfileModal();
    }

    async handleAnswerUpload(event) {
        const file = event.target.files[0];
        if (file) {
            try {
                // Simulate SQL evaluation results
                setTimeout(() => {
                    const results = {
                        score: 15,
                        totalPoints: 20,
                        feedback: {
                            general: 'Bonne compréhension générale des concepts SQL.',
                            details: [
                                { type: 'success', message: 'Requêtes SELECT bien structurées' },
                                { type: 'warning', message: 'Jointures complexes à optimiser' },
                                { type: 'success', message: 'Bonne utilisation des groupements' },
                                { type: 'error', message: 'Erreur dans la clause WHERE' }
                            ],
                            queryAnalysis: {
                                correct: 7,
                                partial: 2,
                                incorrect: 1
                            }
                        }
                    };

                    this.displayResults(results);
                }, 1500);
            } catch (error) {
                console.error('Erreur lors du chargement de la réponse:', error);
            }
        }
    }

    displayResults(results) {
        const resultZone = document.querySelector('.result-zone');
        resultZone.classList.remove('hidden');
        
        // Update score
        document.getElementById('score').textContent = `Note: ${results.score}/${results.totalPoints}`;
        
        // Update feedback
        const feedbackEl = document.getElementById('feedback');
        feedbackEl.innerHTML = `
            <div class="feedback-general">${results.feedback.general}</div>
            
            <div class="feedback-details">
                ${results.feedback.details.map(detail => `
                    <div class="feedback-item feedback-${detail.type}">
                        <span class="feedback-icon">${this.getFeedbackIcon(detail.type)}</span>
                        ${detail.message}
                    </div>
                `).join('')}
            </div>
            
            <div class="query-analysis">
                <h4>Analyse des requêtes</h4>
                <div class="query-stats">
                    <div class="stat-item">
                        <div class="stat-value correct">${results.feedback.queryAnalysis.correct}</div>
                        <div class="stat-label">Correctes</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value partial">${results.feedback.queryAnalysis.partial}</div>
                        <div class="stat-label">Partielles</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value incorrect">${results.feedback.queryAnalysis.incorrect}</div>
                        <div class="stat-label">Incorrectes</div>
                    </div>
                </div>
            </div>
        `;
    }

    getFeedbackIcon(type) {
        switch(type) {
            case 'success':
                return '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
            case 'warning':
                return '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>';
            case 'error':
                return '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
            default:
                return '';
        }
    }

    downloadExam() {
        const base64Pdf = localStorage.getItem('examPdf');
        if (base64Pdf) {
            const binaryStr = this._base64ToArrayBuffer(base64Pdf);
            const blob = new Blob([binaryStr], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'examen_bd.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            alert('Aucun examen disponible');
        }
    }

    _arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    _base64ToArrayBuffer(base64) {
        const binaryString = window.atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }
}

const app = new StudentExamViewer();