class LoginView {
    constructor() {
        this._content = document.getElementById('content');
    }

    showForm() {
        this._content.innerHTML = `
            <div class="form-container">
                <h2>Login</h2>
                <form id="loginForm">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required autocomplete="username">
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required autocomplete="current-password">
                    </div>
                    <button type="submit">Login</button>
                </form>
                <p>Belum punya akun? <a href="#/register">Register</a></p>
            </div>
        `;
        this._setupEventListeners();
    }

    _setupEventListeners() {
        const form = document.getElementById('loginForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            if (this.onSubmit) {
                this.onSubmit({ email, password });
            }
        });
    }

    showError(message) {
        this._content.innerHTML += `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
    }

    showLoading() {
        this._content.innerHTML += `
            <div class="loading">
                <p>Loading...</p>
            </div>
        `;
    }
}

export default LoginView; 