import StoryModel from '../models/StoryModel.js';
import LoginView from '../views/LoginView.js';

class LoginPresenter {
    constructor() {
        this._model = new StoryModel();
        this._view = new LoginView();
        this._view.onSubmit = this._handleSubmit.bind(this);
    }

    show() {
        this._view.showForm();
    }

    async _handleSubmit({ email, password }) {
        try {
            this._view.showLoading();
            await this._model.login({ email, password });
            window.location.hash = '#/stories';
        } catch (error) {
            this._view.showError(error.message);
        }
    }
}

export default LoginPresenter; 