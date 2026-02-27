import React from 'react';
import './App.css';

const App = () => {
  const [showChart, setShowChart] = React.useState(false);

  return (
    <div className="app">
      <button 
        className="chart-link-btn" 
        onClick={() => setShowChart(!showChart)}
        title="View System Flowchart"
      >
        {showChart ? '✖ Close Chart' : '📊 View Flow Chart'}
      </button>

      {showChart && (
        <div className="chart-modal">
          <div className="chart-container">
            <h2>Event Management System - Flow Chart</h2>
            <svg viewBox="0 0 800 1200" className="flowchart">
              {/* SVG Flowchart */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#333" />
                </marker>
              </defs>

              {/* START */}
              <ellipse cx="400" cy="50" rx="60" ry="30" fill="#4CAF50" stroke="#333" strokeWidth="2" />
              <text x="400" y="55" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">START</text>

              {/* Arrow */}
              <line x1="400" y1="80" x2="400" y2="120" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />

              {/* INDEX */}
              <rect x="300" y="120" width="200" height="60" fill="#2196F3" stroke="#333" strokeWidth="2" rx="5" />
              <text x="400" y="155" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">INDEX / HOME</text>

              {/* Arrow */}
              <line x1="400" y1="180" x2="400" y2="220" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />

              {/* LOGIN CHOICE */}
              <path d="M 400 250 L 500 320 L 400 390 L 300 320 Z" fill="#FF9800" stroke="#333" strokeWidth="2" />
              <text x="400" y="320" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Select Role</text>
              <text x="400" y="335" textAnchor="middle" fill="white" fontSize="11">(Admin/Vendor/User)</text>

              {/* ADMIN PATH */}
              <line x1="300" y1="320" x2="200" y2="320" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <rect x="50" y="290" width="150" height="60" fill="#9C27B0" stroke="#333" strokeWidth="2" rx="5" />
              <text x="127" y="325" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Admin Login</text>

              {/* VENDOR PATH */}
              <line x1="400" y1="390" x2="400" y2="430" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <rect x="300" y="430" width="200" height="60" fill="#009688" stroke="#333" strokeWidth="2" rx="5" />
              <text x="400" y="465" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Vendor Login</text>

              {/* USER PATH */}
              <line x1="500" y1="320" x2="600" y2="320" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <rect x="600" y="290" width="150" height="60" fill="#F44336" stroke="#333" strokeWidth="2" rx="5" />
              <text x="675" y="325" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">User Login</text>

              {/* DASHBOARDS */}
              {/* Admin Dashboard */}
              <line x1="127" y1="290" x2="127" y2="550" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <rect x="27" y="550" width="200" height="80" fill="#9C27B0" stroke="#333" strokeWidth="2" rx="5" />
              <text x="127" y="575" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Admin Dashboard</text>
              <text x="127" y="595" textAnchor="middle" fill="white" fontSize="10">Maintain Users</text>
              <text x="127" y="610" textAnchor="middle" fill="white" fontSize="10">Maintain Vendors</text>
              <text x="127" y="625" textAnchor="middle" fill="white" fontSize="10">Membership</text>

              {/* Vendor Dashboard */}
              <line x1="400" y1="490" x2="400" y2="550" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <rect x="300" y="550" width="200" height="80" fill="#009688" stroke="#333" strokeWidth="2" rx="5" />
              <text x="400" y="575" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Vendor Dashboard</text>
              <text x="400" y="595" textAnchor="middle" fill="white" fontSize="10">Your Items</text>
              <text x="400" y="610" textAnchor="middle" fill="white" fontSize="10">Add New Item</text>
              <text x="400" y="625" textAnchor="middle" fill="white" fontSize="10">Orders</text>

              {/* User Dashboard */}
              <line x1="675" y1="290" x2="675" y2="550" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <rect x="575" y="550" width="200" height="80" fill="#F44336" stroke="#333" strokeWidth="2" rx="5" />
              <text x="675" y="575" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">User Dashboard</text>
              <text x="675" y="595" textAnchor="middle" fill="white" fontSize="10">Vendors</text>
              <text x="675" y="610" textAnchor="middle" fill="white" fontSize="10">Cart</text>
              <text x="675" y="625" textAnchor="middle" fill="white" fontSize="10">Order Status</text>

              {/* OPERATIONS */}
              <line x1="127" y1="630" x2="127" y2="700" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <rect x="27" y="700" width="200" height="60" fill="#5C6BC0" stroke="#333" strokeWidth="2" rx="5" />
              <text x="127" y="730" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Admin Operations</text>

              <line x1="400" y1="630" x2="400" y2="700" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <rect x="300" y="700" width="200" height="60" fill="#5C6BC0" stroke="#333" strokeWidth="2" rx="5" />
              <text x="400" y="730" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Vendor Operations</text>

              <line x1="675" y1="630" x2="675" y2="700" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <rect x="575" y="700" width="200" height="60" fill="#5C6BC0" stroke="#333" strokeWidth="2" rx="5" />
              <text x="675" y="730" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">User Operations</text>

              {/* REPORTS & TRANSACTIONS */}
              <line x1="127" y1="760" x2="127" y2="830" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <line x1="400" y1="760" x2="400" y2="830" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <line x1="675" y1="760" x2="675" y2="830" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />

              <rect x="27" y="830" width="200" height="60" fill="#FF5722" stroke="#333" strokeWidth="2" rx="5" />
              <text x="127" y="860" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Reports & Transactions</text>

              <rect x="300" y="830" width="200" height="60" fill="#FF5722" stroke="#333" strokeWidth="2" rx="5" />
              <text x="400" y="860" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Reports & Transactions</text>

              <rect x="575" y="830" width="200" height="60" fill="#FF5722" stroke="#333" strokeWidth="2" rx="5" />
              <text x="675" y="860" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Reports & Transactions</text>

              {/* LOGOUT */}
              <line x1="400" y1="900" x2="400" y2="950" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <rect x="300" y="950" width="200" height="60" fill="#E91E63" stroke="#333" strokeWidth="2" rx="5" />
              <text x="400" y="985" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">LOGOUT</text>

              {/* END */}
              <line x1="400" y1="1010" x2="400" y2="1050" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <ellipse cx="400" cy="1100" rx="60" ry="30" fill="#4CAF50" stroke="#333" strokeWidth="2" />
              <text x="400" y="1105" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">END</text>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
