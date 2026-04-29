import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const RequestAccess = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [caseDetails, setCaseDetails] = useState('');
    const [message, setMessage] = useState('');
    const { registerRequest } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await registerRequest({ email, phone, caseDetails });
            setMessage(res.message);
            setTimeout(() => onClose(), 2000);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Request failed');
        }
    };

    return (
        <div className="auth-modal">
            <div className="auth-content">
                <h2>Request Access</h2>
                {message && <p className="info">{message}</p>}
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <input 
                        type="tel" 
                        placeholder="Phone Number" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        required 
                    />
                    <textarea 
                        placeholder="Describe your case" 
                        value={caseDetails} 
                        onChange={(e) => setCaseDetails(e.target.value)} 
                        required 
                    />
                    <button type="submit">Send Request</button>
                </form>
                <button className="close-btn" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default RequestAccess;
