from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
import os
import random

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///location_tracker.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    otp = db.Column(db.String(6), nullable=True)
    is_master = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    approved = db.Column(db.Boolean, default=False)
    rejected = db.Column(db.Boolean, default=False)
    blocked = db.Column(db.Boolean, default=False)
    last_login = db.Column(db.DateTime, nullable=True)
    tracking_started_at = db.Column(db.DateTime, nullable=True)
    tracking_stopped_at = db.Column(db.DateTime, nullable=True)
    locations = db.relationship('Location', backref='user', lazy=True, cascade='all, delete-orphan')

class Location(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    is_tracking = db.Column(db.Boolean, default=True)

# Create tables (creates only if they don't exist)
with app.app_context():
    db.create_all()
    # Create default master user if not exists
    master = User.query.filter_by(email='master@office.com').first()
    if not master:
        master = User(
            name='Master Admin',
            email='master@office.com',
            password=generate_password_hash('master123'),
            is_master=True,
            approved=True,
            rejected=False
        )
        db.session.add(master)
        db.session.commit()
        print("Master user created: master@office.com / master123")
    else:
        print("Database loaded. Master user exists.")

# Token required decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token.split(' ')[1]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

# Routes
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    if not name or not email or not password:
        return jsonify({'message': 'Name, email and password are required!'}), 400
    
    # Check if user exists
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({'message': 'User already exists!'}), 400
    
    # Generate 6-digit OTP
    otp = str(random.randint(100000, 999999))
    
    # Create new user - NOT approved (master approval required)
    hashed_password = generate_password_hash(password)
    new_user = User(name=name, email=email, password=hashed_password, otp=otp, approved=False, rejected=False)
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({
        'message': 'Signup successful! Wait for master approval to login.',
        'user_id': new_user.id
    }), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    email = data.get('email')
    otp = data.get('otp')
    
    if not email or not otp:
        return jsonify({'message': 'Email and OTP are required!'}), 400
    
    user = User.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({'message': 'User not found!'}), 401
    
    if user.rejected:
        return jsonify({'message': 'Your signup request was rejected by master!'}), 403
    
    if user.blocked:
        return jsonify({'message': 'Your account has been blocked by master!'}), 403
    
    if not user.approved and not user.is_master:
        return jsonify({'message': 'Your account is pending approval from master!'}), 403
    
    if user.otp != otp:
        return jsonify({'message': 'Invalid OTP!'}), 401
    
    # Update last login time
    user.last_login = datetime.datetime.utcnow()
    db.session.commit()
    
    # Generate token
    token = jwt.encode({
        'user_id': user.id,
        'email': user.email,
        'name': user.name,
        'is_master': user.is_master,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
    }, app.config['SECRET_KEY'], algorithm='HS256')
    
    return jsonify({
        'message': 'Login successful!',
        'token': token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'is_master': user.is_master
        }
    }), 200

@app.route('/api/master/login', methods=['POST'])
def master_login():
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'Email and password are required!'}), 400
    
    user = User.query.filter_by(email=email, is_master=True).first()
    
    if not user:
        return jsonify({'message': 'Master user not found!'}), 401
    
    if not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid password!'}), 401
    
    # Generate token
    token = jwt.encode({
        'user_id': user.id,
        'email': user.email,
        'is_master': user.is_master,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
    }, app.config['SECRET_KEY'], algorithm='HS256')
    
    return jsonify({
        'message': 'Master login successful!',
        'token': token,
        'user': {
            'id': user.id,
            'email': user.email,
            'is_master': user.is_master
        }
    }), 200

@app.route('/api/location/start', methods=['POST'])
@token_required
def start_tracking(current_user):
    data = request.get_json()
    
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    
    if latitude is None or longitude is None:
        return jsonify({'message': 'Latitude and longitude are required!'}), 400
    
    # Update user's tracking start time
    current_user.tracking_started_at = datetime.datetime.utcnow()
    current_user.tracking_stopped_at = None  # Clear stopped time when starting
    
    new_location = Location(
        user_id=current_user.id,
        latitude=latitude,
        longitude=longitude,
        is_tracking=True
    )
    
    db.session.add(new_location)
    db.session.commit()
    
    return jsonify({
        'message': 'Location tracking started!',
        'location_id': new_location.id
    }), 201

@app.route('/api/location/update', methods=['POST'])
@token_required
def update_location(current_user):
    data = request.get_json()
    
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    
    if latitude is None or longitude is None:
        return jsonify({'message': 'Latitude and longitude are required!'}), 400
    
    new_location = Location(
        user_id=current_user.id,
        latitude=latitude,
        longitude=longitude,
        is_tracking=True
    )
    
    db.session.add(new_location)
    db.session.commit()
    
    return jsonify({'message': 'Location updated!'}), 200

@app.route('/api/location/stop', methods=['POST'])
@token_required
def stop_tracking(current_user):
    # Update user's tracking stop time
    current_user.tracking_stopped_at = datetime.datetime.utcnow()
    
    # Update all tracking locations to false
    Location.query.filter_by(user_id=current_user.id, is_tracking=True).update({'is_tracking': False})
    db.session.commit()
    
    return jsonify({'message': 'Location tracking stopped!'}), 200

@app.route('/api/master/users', methods=['GET'])
@token_required
def get_all_users(current_user):
    if not current_user.is_master:
        return jsonify({'message': 'Only master can access this!'}), 403
    
    users = User.query.filter_by(is_master=False, blocked=False).all()
    
    users_list = []
    for user in users:
        latest_location = Location.query.filter_by(user_id=user.id).order_by(Location.timestamp.desc()).first()
        users_list.append({
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'otp': user.otp,
            'approved': user.approved,
            'rejected': user.rejected,
            'blocked': user.blocked,
            'created_at': user.created_at.isoformat(),
            'last_login': user.last_login.isoformat() if user.last_login else None,
            'tracking_started_at': user.tracking_started_at.isoformat() if user.tracking_started_at else None,
            'tracking_stopped_at': user.tracking_stopped_at.isoformat() if user.tracking_stopped_at else None,
            'is_tracking': latest_location.is_tracking if latest_location else False,
            'last_location': {
                'latitude': latest_location.latitude,
                'longitude': latest_location.longitude,
                'timestamp': latest_location.timestamp.isoformat()
            } if latest_location else None
        })
    
    return jsonify({'users': users_list}), 200

@app.route('/api/master/approve/<int:user_id>', methods=['POST'])
@token_required
def approve_user(current_user, user_id):
    if not current_user.is_master:
        return jsonify({'message': 'Only master can approve users!'}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found!'}), 404
    
    user.approved = True
    db.session.commit()
    
    return jsonify({'message': 'User approved successfully!'}), 200

@app.route('/api/master/reject/<int:user_id>', methods=['POST'])
@token_required
def reject_user(current_user, user_id):
    if not current_user.is_master:
        return jsonify({'message': 'Only master can reject users!'}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found!'}), 404
    
    user.rejected = True
    user.approved = False
    db.session.commit()
    
    return jsonify({'message': 'User rejected successfully!'}), 200

@app.route('/api/master/user/<int:user_id>/locations', methods=['GET'])
@token_required
def get_user_locations(current_user, user_id):
    if not current_user.is_master:
        return jsonify({'message': 'Only master can access this!'}), 403
    
    locations = Location.query.filter_by(user_id=user_id).order_by(Location.timestamp.desc()).limit(100).all()
    
    locations_list = []
    for location in locations:
        locations_list.append({
            'id': location.id,
            'latitude': location.latitude,
            'longitude': location.longitude,
            'timestamp': location.timestamp.isoformat(),
            'is_tracking': location.is_tracking
        })
    
    return jsonify({'locations': locations_list}), 200

@app.route('/api/master/user/<int:user_id>', methods=['GET'])
@token_required
def get_user_detail(current_user, user_id):
    if not current_user.is_master:
        return jsonify({'message': 'Only master can access this!'}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found!'}), 404
    
    # Get location count
    location_count = Location.query.filter_by(user_id=user_id).count()
    latest_location = Location.query.filter_by(user_id=user_id).order_by(Location.timestamp.desc()).first()
    
    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'approved': user.approved,
        'rejected': user.rejected,
        'blocked': user.blocked,
        'created_at': user.created_at.isoformat(),
        'last_login': user.last_login.isoformat() if user.last_login else None,
        'tracking_started_at': user.tracking_started_at.isoformat() if user.tracking_started_at else None,
        'tracking_stopped_at': user.tracking_stopped_at.isoformat() if user.tracking_stopped_at else None,
        'is_tracking': latest_location.is_tracking if latest_location else False,
        'location_count': location_count,
        'last_location': {
            'latitude': latest_location.latitude,
            'longitude': latest_location.longitude,
            'timestamp': latest_location.timestamp.isoformat()
        } if latest_location else None
    }), 200

@app.route('/api/master/user/<int:user_id>/delete', methods=['DELETE'])
@token_required
def delete_user(current_user, user_id):
    if not current_user.is_master:
        return jsonify({'message': 'Only master can delete users!'}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found!'}), 404
    
    if user.is_master:
        return jsonify({'message': 'Cannot delete master user!'}), 400
    
    # Delete user (locations will be deleted automatically due to cascade)
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({'message': 'User deleted successfully!'}), 200

@app.route('/api/master/user/<int:user_id>/block', methods=['POST'])
@token_required
def block_user(current_user, user_id):
    if not current_user.is_master:
        return jsonify({'message': 'Only master can block users!'}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found!'}), 404
    
    if user.is_master:
        return jsonify({'message': 'Cannot block master user!'}), 400
    
    user.blocked = True
    db.session.commit()
    
    return jsonify({'message': 'User blocked successfully!'}), 200

@app.route('/api/master/user/<int:user_id>/unblock', methods=['POST'])
@token_required
def unblock_user(current_user, user_id):
    if not current_user.is_master:
        return jsonify({'message': 'Only master can unblock users!'}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found!'}), 404
    
    user.blocked = False
    db.session.commit()
    
    return jsonify({'message': 'User unblocked successfully!'}), 200

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({'message': 'Backend is running!'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
