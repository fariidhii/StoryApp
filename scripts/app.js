import StoryPresenter from './presenters/StoryPresenter.js';
import AddStoryPresenter from './presenters/AddStoryPresenter.js';
import HomePresenter from './presenters/HomePresenter.js';
import LoginPresenter from './presenters/LoginPresenter.js';
import RegisterPresenter from './presenters/RegisterPresenter.js';
import StoryModel from './models/StoryModel.js';

class App {
    constructor() {
        this._model = new StoryModel();
        this._setupNavigation();
        this._setupRouting();
    }

    _setupNavigation() {
        const hamburger = document.getElementById('hamburger');
        const navigationDrawer = document.getElementById('navigationDrawer');

        hamburger.addEventListener('click', () => {
            navigationDrawer.classList.toggle('open');
        });

        // Close drawer when clicking outside
        document.addEventListener('click', (event) => {
            if (!navigationDrawer.contains(event.target) && event.target !== hamburger) {
                navigationDrawer.classList.remove('open');
            }
        });

        this._renderNavLinks();
    }

    _renderNavLinks() {
        const navigationDrawer = document.getElementById('navigationDrawer');
        const ul = navigationDrawer.querySelector('ul');
        ul.innerHTML = `
            <li><a href="#/home">Home</a></li>
            <li><a href="#/stories">Stories</a></li>
            <li><a href="#/add">Add Story</a></li>
            ${this._model.isLoggedIn() ? '<li><a href="#/logout" id="logoutLink">Logout</a></li>' : '<li><a href="#/login">Login</a></li><li><a href="#/register">Register</a></li>'}
        `;
        // Logout event
        const logoutLink = document.getElementById('logoutLink');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                this._model.logout();
                window.location.hash = '#/login';
                this._renderNavLinks();
            });
        }
    }

    _setupRouting() {
        const routes = {
            '/home': () => {
                const homePresenter = new HomePresenter();
                homePresenter.show();
            },
            '/stories': () => {
                const storyPresenter = new StoryPresenter();
                storyPresenter.show();
            },
            '/add': () => {
                const addStoryPresenter = new AddStoryPresenter();
                addStoryPresenter.show();
            },
            '/login': () => {
                const loginPresenter = new LoginPresenter();
                loginPresenter.show();
            },
            '/register': () => {
                const registerPresenter = new RegisterPresenter();
                registerPresenter.show();
            },
            '/logout': () => {
                this._model.logout();
                this._renderNavLinks();
                window.location.hash = '#/login';
            }
        };

        const defaultRoute = '/home';

        const router = () => {
            // Matikan kamera jika ada instance AddStoryView
            if (window._addStoryView && typeof window._addStoryView.stopCamera === 'function') {
                window._addStoryView.stopCamera();
                window._addStoryView = null;
            }
            this._renderNavLinks();
            const path = window.location.hash.slice(1) || defaultRoute;
            const route = routes[path] || routes[defaultRoute];
            
            // Start view transition
            if (document.startViewTransition) {
                document.startViewTransition(() => {
                    route();
                });
            } else {
                route();
            }
        };

        window.addEventListener('hashchange', router);
        window.addEventListener('load', router);
    }
}

// Initialize the app
const app = new App(); 