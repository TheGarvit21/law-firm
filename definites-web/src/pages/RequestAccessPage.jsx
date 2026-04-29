import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const RequestAccessPage = () => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [caseDetails, setCaseDetails] = useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const { registerRequest } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await registerRequest({ email, phone, caseDetails });
            setMessage(res.message);
            setSuccess(true);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Request failed');
            setSuccess(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Request Portal Access</h2>
                <p>Provide your details for admin verification</p>
                {message && (
                    <div className={success ? "success-msg" : "error-msg"}>
                        {message}
                    </div>
                )}
                {!success && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                placeholder="name@example.com" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input 
                                type="tel" 
                                placeholder="+91 00000 00000" 
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Case Summary</label>
                            <textarea 
                                placeholder="Briefly describe your legal requirements..." 
                                value={caseDetails} 
                                onChange={(e) => setCaseDetails(e.target.value)} 
                                required 
                            />
                        </div>
                        <button type="submit" className="btn-auth">Submit Request</button>
                    </form>
                )}
                <div className="auth-footer">
                    Already have credentials? <Link to="/login">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default RequestAccessPage;
