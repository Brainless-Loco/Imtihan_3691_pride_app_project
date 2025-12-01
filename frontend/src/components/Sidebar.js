import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Updated Sidebar for Pride STEM Networking
 * - Added "Search" page (renamed from your request)
 * - Navigation items to match client expectations
 * - Navigation now uses react-router-dom
 */

const ICONS = {
    communities: (
        <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M12 12a3 3 0 100-6 3 3 0 000 6zm6 1a3 3 0 100-6 3 3 0 000 6zM6 13a3 3 0 100-6 3 3 0 000 6zM12 14c-4 0-8 2-8 5v1h16v-1c0-3-4-5-8-5z" />
        </svg>
    ),
    messages: (
        <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M20 2H4a2 2 0 00-2 2v14l4-3h14a2 2 0 002-2V4a2 2 0 00-2-2z" />
        </svg>
    ),
    events: (
        <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M7 10h5v5H7zM19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" />
        </svg>
    ),
    resources: (
        <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M6 2h9a3 3 0 013 3v15l-4-2-4 2-4-2V5a3 3 0 013-3z" />
        </svg>
    ),
    search: (
        <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M10 2a8 8 0 105.29 14.29l4.42 4.42 1.42-1.42-4.42-4.42A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
        </svg>
    ),
    profile: (
        <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4 0-8 2-8 5v1h16v-1c0-3-4-5-8-5z" />
        </svg>
    ),
    settings: (
        <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M19.14 12.94a7.07 7.07 0 000-1.88l2.03-1.58a.5.5 0 00.12-.64l-1.92-3.32a.5.5 0 00-.6-.22l-2.39.96a7.1 7.1 0 00-1.62-.94L14.5 2h-5l-.28 2.32c-.56.2-1.09.48-1.6.84l-2.4-.96a.5.5 0 00-.6.22L1.78 8.84a.5.5 0 00.12.64l2.03 1.58a7.07 7.07 0 000 1.88L1.9 14.5a.5.5 0 00-.12.64l1.92 3.32c.14.24.43.34.68.22l2.39-.96c.5.36 1.04.64 1.6.84L9.5 22h5l.28-2.32c.56-.2 1.09-.48 1.62-.84l2.39.96c.25.12.54.02.68-.22l1.92-3.32a.5.5 0 00-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z" />
        </svg>
    ),
    logout: (
        <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M16 13v-2H7V8l-5 4 5 4v-3zM20 3h-8v2h8v14h-8v2h8a2 2 0 002-2V5a2 2 0 00-2-2z" />
        </svg>
    ),
    toggle: (
        <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M10 17l5-5-5-5v10zM4 6h4v12H4z" />
        </svg>
    ),
};

// Updated nav items to match requested UI + new Search page
const DEFAULT_ITEMS = [
    { key: "communities", label: "Communities", icon: ICONS.communities },
    { key: "messages", label: "Messages", icon: ICONS.messages },
    { key: "events", label: "Events", icon: ICONS.events },
    { key: "resources", label: "Resources", icon: ICONS.resources },
    { key: "search", label: "Search", icon: ICONS.search }, // NEW
];

const FOOTER_ITEMS = [
    { key: "profile", label: "Profile", icon: ICONS.profile },
    { key: "settings", label: "Settings", icon: ICONS.settings },
    { key: "logout", label: "Logout", icon: ICONS.logout },
];

export default function Sidebar() {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [active, setActive] = useState("communities");

    const handleNavigate = (key) => {
        setActive(key);
        navigate(`/${key}`);
    };

    return (
        <nav className={`psn-sidebar ${collapsed ? "collapsed" : ""}`}>
            <div className="top">
                <div className="psn-logo" onClick={() => handleNavigate("communities")}>
                    <div className="mark" />
                    {!collapsed && <div className="title">Pride STEM</div>}
                </div>

                <button className="psn-toggle" onClick={() => setCollapsed(!collapsed)}>
                    {ICONS.toggle}
                </button>
            </div>

            <div className="psn-nav">
                {DEFAULT_ITEMS.map((it) => (
                    <div
                        key={it.key}
                        className={`psn-item ${active === it.key ? "active" : ""}`}
                        onClick={() => handleNavigate(it.key)}
                    >
                        <span className="icon">{it.icon}</span>
                        <span className="label">{it.label}</span>
                    </div>
                ))}
            </div>

            <div className="psn-separator" />

            <div className="psn-footer">
                {FOOTER_ITEMS.map((it) => (
                    <div
                        key={it.key}
                        className={`psn-item ${active === it.key ? "active" : ""}`}
                        onClick={() => handleNavigate(it.key)}
                    >
                        <span className="icon">{it.icon}</span>
                        <span className="label">{it.label}</span>
                    </div>
                ))}
            </div>
        </nav>
    );
}
