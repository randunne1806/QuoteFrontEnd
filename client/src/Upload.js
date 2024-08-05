import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import "./Upload.css";

function UploadScreen() {
    const location = useLocation();
    const partNum = location.state.partNum;

    return (
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
            <h1>Amitron Quoting: My Quotes</h1>
            <div className="upload-container">
                <div className="info-container">
                    <div className="info">
                        <h2>Part Number: {partNum}</h2>
                    </div>
                    <div className="loading-content">
                        <div className="loading-indicator"></div>
                        <div>
                            <h2>Processing</h2>
                            <h3>This may take 1-5 minutes. You will be notified by email when this quote is processed</h3>
                        </div>
                    </div>
                </div>
                <Link to="/myQuotes">
                    <button className="button-containerss">My Quotes</button>
                </Link>
            </div>
        </div>
    );
}

export default UploadScreen;
