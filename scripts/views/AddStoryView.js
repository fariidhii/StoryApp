class AddStoryView {
    constructor() {
        this._content = document.getElementById('content');
        this._photoPreview = null;
        this._map = null;
        this._marker = null;
        this._selectedLocation = null;
        this._stream = null;
        this._isPhotoTaken = false;
    }

    showForm() {
        this._content.innerHTML = `
            <div class="form-container">
                <h2>Add New Story</h2>
                <form id="addStoryForm">
                    <div class="form-group">
                        <label for="description">Description</label>
                        <textarea id="description" name="description" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Take Photo</label>
                        <div class="camera-container">
                            <video id="cameraPreview" autoplay playsinline></video>
                        </div>
                        <div id="photoPreview"></div>
                        <div class="photo-buttons">
                            <button type="button" id="captureButton">Capture Photo</button>
                            <button type="button" id="retakeButton" style="display:none;">Retake Photo</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Location (click on map to select)</label>
                        <div id="map" style="height: 300px;"></div>
                    </div>
                    <button type="submit">Add Story</button>
                </form>
            </div>
        `;

        this._initMap();
        this._setupEventListeners();
        setTimeout(() => this._initCamera(), 100);
    }

    _initMap() {
        // Initialize Leaflet map
        this._map = L.map('map').setView([0, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this._map);

        // Add click handler to set location
        this._map.on('click', (e) => {
            if (this._marker) {
                this._map.removeLayer(this._marker);
            }
            this._marker = L.marker(e.latlng).addTo(this._map);
            this._selectedLocation = e.latlng;
        });
    }

    async _initCamera() {
        try {
            this._stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' }
            });
            const video = document.getElementById('cameraPreview');
            video.srcObject = this._stream;
            video.style.display = 'block';
        } catch (error) {
            console.error('Error accessing camera:', error);
            this.showError('Could not access camera. Please ensure camera permissions are granted.');
        }
    }

    _stopCamera() {
        if (this._stream) {
            this._stream.getTracks().forEach(track => track.stop());
            this._stream = null;
        }
        const video = document.getElementById('cameraPreview');
        if (video) video.style.display = 'none';
    }

    _setupEventListeners() {
        const form = document.getElementById('addStoryForm');
        const captureButton = document.getElementById('captureButton');
        const retakeButton = document.getElementById('retakeButton');
        const photoPreview = document.getElementById('photoPreview');
        const video = document.getElementById('cameraPreview');

        captureButton.addEventListener('click', () => {
            // Capture photo
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            if (this._photoPreview) {
                photoPreview.removeChild(this._photoPreview);
            }
            this._photoPreview = document.createElement('img');
            this._photoPreview.src = canvas.toDataURL('image/jpeg');
            this._photoPreview.style.maxWidth = '200px';
            photoPreview.appendChild(this._photoPreview);

            // Stop camera after capture
            this._stopCamera();
            captureButton.style.display = 'none';
            retakeButton.style.display = 'inline-block';
        });

        retakeButton.addEventListener('click', async () => {
            if (this._photoPreview) {
                photoPreview.removeChild(this._photoPreview);
                this._photoPreview = null;
            }
            await this._initCamera();
            captureButton.style.display = 'inline-block';
            retakeButton.style.display = 'none';
        });

        // Handle form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const description = document.getElementById('description').value;
            const location = this._selectedLocation;

            if (!this._photoPreview) {
                this.showError('Please capture a photo first');
                return;
            }

            // Convert base64 image to blob
            fetch(this._photoPreview.src)
                .then(res => res.blob())
                .then(blob => {
                    if (this.onSubmit) {
                        this.onSubmit({
                            description,
                            photo: new File([blob], 'photo.jpg', { type: 'image/jpeg' }),
                            lat: location ? location.lat : null,
                            lon: location ? location.lng : null
                        });
                    }
                });
        });
    }

    showSuccess() {
        this._content.innerHTML = `
            <div class="success-message">
                <h2>Success!</h2>
                <p>Your story has been added successfully.</p>
                <a href="#/stories">View Stories</a>
            </div>
        `;
    }

    showError(message) {
        this._content.innerHTML = `
            <div class="error-message">
                <h2>Error</h2>
                <p>${message}</p>
            </div>
        `;
    }

    showLoading() {
        this._content.innerHTML = `
            <div class="loading">
                <p>Adding your story...</p>
            </div>
        `;
    }
}

export default AddStoryView; 