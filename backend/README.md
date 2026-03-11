# Location Tracker Backend

## Local Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
python app.py
```

The server will run on `http://localhost:5000`.

## Production on VPS (Fast Path)

Deployment templates are in `deploy/vps/`.

Run on VPS:
```bash
sudo bash /var/www/locationtracker/deploy/vps/setup-vps.sh https://github.com/Sahil-webdev/teamtracker.git api.yourdomain.com
```

Then update app APK build with production API:
```bash
cd c:\RNProjects\LocationTracker\android
.\gradlew.bat :app:assembleUserRelease :app:assembleMasterRelease -PAPI_BASE_URL=https://api.yourdomain.com/api
```

## Default Master Credentials
- Email: `master@office.com`
- Password: `master123`

## API Endpoints

### User Routes
- `POST /api/signup` - User signup (email, password)
- `POST /api/login` - User login (email, password)
- `POST /api/location/start` - Start location tracking (requires auth token)
- `POST /api/location/update` - Update location (requires auth token)
- `POST /api/location/stop` - Stop location tracking (requires auth token)

### Master Routes
- `POST /api/master/login` - Master login
- `GET /api/master/users` - Get all users (requires master auth)
- `POST /api/master/approve/<user_id>` - Approve user (requires master auth)
- `GET /api/master/user/<user_id>/locations` - Get user location history (requires master auth)

### Test Route
- `GET /api/test` - Test if backend is running
