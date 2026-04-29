import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
    const [data, setData] = useState(null);
    const { user, logout } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [showChangePwd, setShowChangePwd] = useState(false);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await axios.get('/api/dashboard/user');
                setData(res.data);
                if (res.data.userDetails.isFirstLogin) {
                    setShowChangePwd(true);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchDashboard();
    }, []);

    const handleChangePassword = async () => {
        try {
            await axios.put('/api/auth/change-password', { password: newPassword });
            alert('Password changed successfully');
            setShowChangePwd(false);
        } catch (err) {
            alert('Password change failed');
        }
    };

    return (
        <div className="dashboard user-dashboard">
            <header>
                <h1>User Portal</h1>
                <button className="btn-logout" onClick={logout}>Logout</button>
            </header>

            {showChangePwd && (
                <div className="alert-banner">
                    <p>Welcome! Please change your auto-generated password for security.</p>
                    <div className="input-group">
                        <input 
                            type="password" 
                            placeholder="New Password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                        />
                        <button onClick={handleChangePassword}>Update Password</button>
                    </div>
                </div>
            )}

            <div className="welcome">
                <h2>Welcome, {user?.name}</h2>
                <p>Status: Active</p>
            </div>

            <section className="activity">
                <h3>Recent Activity</h3>
                <ul>
                    {data?.recentActivity.map(act => (
                        <li key={act.id}>
                            <strong>{act.type}:</strong> {act.message}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default UserDashboard;
