import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import appLogo from '../assets/app-logo.png';

function Terms() {
    const navigate = useNavigate();

    return (
        <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', padding: '40px 20px', fontFamily: 'Outfit, sans-serif' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <button 
                    onClick={() => navigate(-1)} 
                    style={{ background: 'transparent', border: 'none', color: '#6B7280', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}
                >
                    <FontAwesomeIcon icon={faArrowLeft} /> Back
                </button>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                    <img src={appLogo} alt="Mr.Money" style={{ width: '40px' }} />
                    <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#111827' }}>Mr.Money</h1>
                </div>

                <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#111827', marginBottom: '24px' }}>Terms & Privacy Policy</h2>
                
                <div style={{ color: '#4B5563', lineHeight: '1.6', fontSize: '16px' }}>
                    <h3 style={{ color: '#111827', fontSize: '20px', marginTop: '32px', marginBottom: '12px' }}>1. Introduction</h3>
                    <p>Welcome to Mr.Money. By using our application, you agree to these Terms of Service and our Privacy Policy. Our platform is designed to help you track income, manage expenses, and analyze your spending securely.</p>
                    
                    <h3 style={{ color: '#111827', fontSize: '20px', marginTop: '32px', marginBottom: '12px' }}>2. Data Collection and Privacy</h3>
                    <p>We take your privacy seriously. Mr.Money collects only the information necessary to provide you with our financial management services. Your financial data is securely stored and never shared with third-party advertisers.</p>
                    <ul style={{ paddingLeft: '24px', marginTop: '12px', marginBottom: '12px' }}>
                        <li style={{ marginBottom: '8px' }}>Your authentication is securely managed via Google OAuth.</li>
                        <li style={{ marginBottom: '8px' }}>Your transaction data is encrypted and accessible only by you.</li>
                    </ul>

                    <h3 style={{ color: '#111827', fontSize: '20px', marginTop: '32px', marginBottom: '12px' }}>3. User Responsibilities</h3>
                    <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to use Mr.Money only for lawful purposes and not to engage in any activity that disrupts the platform's functionality.</p>
                    
                    <h3 style={{ color: '#111827', fontSize: '20px', marginTop: '32px', marginBottom: '12px' }}>4. Changes to Terms</h3>
                    <p>We may update our Terms & Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page. Your continued use of the service constitutes acceptance of those changes.</p>
                </div>
                
                <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #E5E7EB', color: '#9CA3AF', fontSize: '14px', textAlign: 'center' }}>
                    © {new Date().getFullYear()} Mr.Money. All rights reserved.
                </div>
            </div>
        </div>
    );
}

export default Terms;
