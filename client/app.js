/* ═══════════════════════════════════════════════════════
   PREPMATE — VANILLA AUTH LOGIC
═══════════════════════════════════════════════════════ */

const API_URL = '/api/auth';

// State
let isLogin = false;

// DOM Elements
const authCard = document.getElementById('auth-card');
const dashboardView = document.getElementById('dashboard-view');
const signupForm = document.getElementById('signup-form');
const submitBtn = document.getElementById('submit-btn');
const toggleAuth = document.getElementById('toggle-auth');
const authTitle = document.getElementById('auth-title');
const authSubtitle = document.getElementById('auth-subtitle');
const toggleText = document.getElementById('toggle-text');
const nameGroup = document.getElementById('name-group');
const togglePasswordBtn = document.getElementById('toggle-password');
const passwordInput = document.getElementById('password');
const toastContainer = document.getElementById('toast-container');

// Toast Helper
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'error' : ''}`;
    toast.innerText = message;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Toggle Password Visibility
togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePasswordBtn.innerHTML = isPassword 
        ? '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'
        : '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
});

// Switch between Login and Signup
toggleAuth.addEventListener('click', () => {
    isLogin = !isLogin;
    
    authTitle.innerText = isLogin ? 'Sign in to PrepMate' : 'Create your account';
    authSubtitle.innerText = isLogin ? 'Welcome back, explorer' : 'Start practicing in under 60 seconds';
    toggleText.innerText = isLogin ? "Don't have an account?" : "Already have an account?";
    toggleAuth.innerText = isLogin ? 'Sign up' : 'Log in';
    submitBtn.querySelector('.btn-text').innerText = isLogin ? 'Sign in →' : 'Get started free →';
    
    nameGroup.classList.toggle('hidden', isLogin);
    if (isLogin) {
        document.getElementById('fullName').removeAttribute('required');
    } else {
        document.getElementById('fullName').setAttribute('required', '');
    }
});

// Real-time Validation
const validateField = (input, regex, errorMsg) => {
    const container = input.parentElement;
    const msgElement = container.querySelector('.validation-msg') || container.parentElement.querySelector('.validation-msg');
    
    if (!regex.test(input.value)) {
        input.classList.add('invalid');
        if (msgElement) msgElement.innerText = errorMsg;
        return false;
    } else {
        input.classList.remove('invalid');
        if (msgElement) msgElement.innerText = '';
        return true;
    }
};

const inputs = {
    fullName: { regex: /^.{2,}$/, msg: 'Name must be at least 2 characters' },
    email: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: 'Please enter a valid email' },
    password: { regex: /^.{8,}$/, msg: 'Password must be at least 8 characters' }
};

Object.keys(inputs).forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => {
        if (!isLogin || id !== 'fullName') {
            validateField(el, inputs[id].regex, inputs[id].msg);
        }
    });
});

// Form Submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Final validation
    let isValid = true;
    if (!isLogin && !validateField(document.getElementById('fullName'), inputs.fullName.regex, inputs.fullName.msg)) isValid = false;
    if (!validateField(document.getElementById('email'), inputs.email.regex, inputs.email.msg)) isValid = false;
    if (!validateField(document.getElementById('password'), inputs.password.regex, inputs.password.msg)) isValid = false;
    
    if (!isValid) return;

    const data = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
    if (!isLogin) data.fullName = document.getElementById('fullName').value;

    const endpoint = isLogin ? '/login' : '/signup';
    
    setLoading(true);

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            handleAuthSuccess(result.user);
        } else {
            showToast(result.message || 'Authentication failed', 'error');
        }
    } catch (err) {
        showToast('Connection error. Please try again.', 'error');
    } finally {
        setLoading(false);
    }
});

function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.querySelector('.btn-text').classList.toggle('hidden', isLoading);
    submitBtn.querySelector('.btn-loader').classList.toggle('hidden', !isLoading);
}

function handleAuthSuccess(user) {
    showToast(`Successfully ${isLogin ? 'logged in' : 'signed up'}!`);
    authCard.classList.add('hidden');
    dashboardView.classList.remove('hidden');
    document.getElementById('user-name').innerText = user.fullName.split(' ')[0];
    
    // Store token if needed (though we use httpOnly cookies)
    // Redirect after delay
    setTimeout(() => {
        window.location.href = '/dashboard';
    }, 2000);
}

// Google OAuth Handler
window.handleCredentialResponse = async (response) => {
    // Decode JWT from Google
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const profile = JSON.parse(jsonPayload);

    try {
        const res = await fetch(`${API_URL}/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: response.credential, profile })
        });

        const result = await res.json();
        if (result.success) {
            handleAuthSuccess(result.user);
        } else {
            showToast('Google Sign-In failed', 'error');
        }
    } catch (err) {
        showToast('Google integration error', 'error');
    }
};
