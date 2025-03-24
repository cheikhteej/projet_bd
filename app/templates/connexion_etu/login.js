import { config } from './config.js';

class LoginManager {
    constructor() {
        this.setupEventListeners();
        this.checkAuthentication();
    }

    setupEventListeners() {
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
    }

    checkAuthentication() {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (isAuthenticated) {
            window.location.href = 'exam.html';
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const studentId = document.getElementById('studentId').value;
        const password = document.getElementById('password').value;
        const errorElement = document.getElementById('loginError');

        try {
            // Simulate authentication
            if (studentId === config.defaultProfile.studentId && password === config.auth.defaultPassword) {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('studentProfile', JSON.stringify({
                    ...config.defaultProfile,
                    studentId
                }));
                window.location.href = config.auth.loginRedirect;
            } else {
                errorElement.textContent = 'Numéro étudiant ou mot de passe incorrect';
                errorElement.classList.remove('hidden');
            }
        } catch (error) {
            errorElement.textContent = 'Une erreur est survenue lors de la connexion';
            errorElement.classList.remove('hidden');
        }
    }
}

const login = new LoginManager();