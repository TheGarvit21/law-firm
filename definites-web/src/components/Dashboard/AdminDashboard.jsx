import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [requests, setRequests] = useState([]);
    const { logout } = useAuth();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const statsRes = await axios.get('/api/dashboard/admin');
            setStats(statsRes.data);
            const reqRes = await axios.get('/api/admin/requests');
            setRequests(reqRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleApprove = async (id) => {
        try {
            await axios.post(`/api/admin/approve-request/${id}`);
            fetchData();
            alert('Request Approved!');
        } catch (err) {
            alert(err.response?.data?.message || 'Approval failed');
        }
    };

    const handleReject = async (id) => {
        if (window.confirm('Are you sure you want to reject this request?')) {
            try {
                await axios.delete(`/api/admin/reject-request/${id}`);
                fetchData();
                alert('Request Rejected');
            } catch (err) {
                alert('Rejection failed');
            }
        }
    };

    return (
        <div className="dashboard admin-dashboard">
            <header>
                <h1>Admin Control Panel</h1>
                <button className="btn-logout" onClick={logout}>Logout</button>
            </header>
            
            <section className="stats">
                <div className="card">
                    <h3>Total Users</h3>
                    <p>{stats?.totalUsers || 0}</p>
                </div>
                <div className="card">
                    <h3>Pending Requests</h3>
                    <p>{stats?.pendingRequests || 0}</p>
                </div>
            </section>

            <section className="requests">
                <h2>Access Requests</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Case</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(req => (
                            <tr key={req._id}>
                                <td>{req.email}</td>
                                <td>{req.phone}</td>
                                <td>{req.caseDetails}</td>
                                <td className="actions-cell">
                                    <button className="btn-approve" onClick={() => handleApprove(req._id)}>Approve</button>
                                    <button className="btn-reject" onClick={() => handleReject(req._id)}>Decline</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );

};

export default AdminDashboard;
