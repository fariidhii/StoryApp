class HomeView {
    constructor() {
        this._content = document.getElementById('content');
    }

    show() {
        this._content.innerHTML = `
            <div class="home-container">
                <h1>Welcome to Story App</h1>
                <p>Share your stories with the world!</p>
                <div class="features">
                    <div class="feature">
                        <h2>Create Stories</h2>
                        <p>Share your experiences with photos and locations</p>
                    </div>
                    <div class="feature">
                        <h2>View Stories</h2>
                        <p>Explore stories from around the world</p>
                    </div>
                    <div class="feature">
                        <h2>Interactive Map</h2>
                        <p>See where stories are happening</p>
                    </div>
                </div>
                <div class="cta">
                    <a href="#/stories" class="button">View Stories</a>
                    <a href="#/add" class="button">Add Story</a>
                </div>
            </div>
        `;
    }
}

export default HomeView; 