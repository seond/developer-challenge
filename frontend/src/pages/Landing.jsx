import React from 'react';

export function Landing() {
    return (
        <div
            className="landing"
            style={{
                width: '300px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'
            }}
        >
            <div style={{ marginBottom: '24px' }}>Bookmark:</div>
            <div>
                <div style={{ marginBottom: '12px' }}>
                    <a href="/studio">DataSpoken: Data Studio</a>
                </div>
                <div>
                    <a href="/journal-central">Conference: Journal Central</a>
                </div>
            </div>
        </div>
    );
}
