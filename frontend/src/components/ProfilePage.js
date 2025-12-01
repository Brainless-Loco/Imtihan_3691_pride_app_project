import { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavTabs from "./NavTabs";

export default function ProfilePage() {
  const navigate = useNavigate();
  
  const defaultAvatar = "/default_avatar.png";
  
  const [userId, setUserId] = useState(null);
 
  const [src, setSrc] = useState(defaultAvatar);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if(id){
      console.log(id);
      setUserId(id);
  

      const avatar = `http://localhost:4000/api/profile/avatar/${id}`;
      setSrc(avatar);
    }

    async function loadData() {
    try {
      const res = await fetch(`http://localhost:4000/api/profile/${id}`);

      if (!res.ok) {
        throw new Error("Data Request failed with status " + res.status);
      }

      const data = await res.json();
  
      setUser(data);

    } catch (err) {
      console.error("Error:", err);
    }
  }

  loadData();
    
  }, []);

  if (!user) {
    return (
      <>
        <NavTabs />

        <div className="ps-page">
          <div className="ps-panel">
            <div className="ps-card" style={{ textAlign: "center" }}>
              <h1>No Profile Found</h1>
              <p className="ps-step" style={{ marginBottom: "20px" }}>
                You haven’t created your profile yet.
              </p>

              <button
                onClick={() => navigate("/edit-profile")}
                className="ps-btn"
                style={{ width: "100%" }}
              >
                Create Profile
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Navbar */}
      <NavTabs />

      <div className="ps-page">
        <div className="ps-panel">

            {/* Banner */}
            <div
              style={{
                width: "100%",
                height: "140px",
                borderRadius: "18px",
                background:
                  "linear-gradient(90deg, var(--accent-2), var(--accent-1))",
                position: "relative",
                marginBottom: "60px",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              {/* Profile Picture */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: "-40px",
                  transform: "translateX(-50%)",
                  width: "110px",
                  height: "110px",
                  borderRadius: "50%",
                  border: "5px solid white",
                  background: "#fff",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-lg)",
                }}
              >
                <img
                  src={src}
                  alt="Profile"
                  onError={() => {
                    setSrc(defaultAvatar);
                  }}
                  className="w-full h-full rounded-full object-contain bg-white p-1"
                />
              </div>
            </div>

            {/* Info */}
            <h1 style={{ textAlign: "center", marginBottom: "8px" }}>
              {user.name}
            </h1>

            <p
              style={{
                textAlign: "center",
                color: "#333",
                marginBottom: "6px",
                fontSize: "15px",
              }}
            >
              {user.role} {user.company && <span>@ {user.company}</span>}
            </p>

            <p
              style={{
                textAlign: "center",
                color: "#555",
                marginBottom: "14px",
                fontSize: "14px",
              }}
            >
              {user.age} years old • {user.location}
            </p>

            {/* Interests */}
            {user.interests?.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  marginBottom: "12px",
                }}
              >
                {user.interests.map((interest) => (
                  <span
                    key={interest}
                    style={{
                      padding: "6px 12px",
                      background: "var(--accent-1)",
                      borderRadius: "var(--pill-radius)",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            )}

            {/* Tags */}
            {user.tags?.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  marginBottom: "18px",
                }}
              >
                {user.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: "6px 12px",
                      background: "var(--accent-2)",
                      borderRadius: "var(--pill-radius)",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "white",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* About Me */}
            <div style={{ marginTop: "22px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#333",
                }}
              >
                About Me
              </label>
              <p
                style={{
                  color: "#444",
                  lineHeight: "1.55",
                  fontSize: "14px",
                }}
              >
                {user.bio}
              </p>
            </div>

            {/* Buttons */}
            <div className="ps-actions" style={{ marginTop: "30px" }}>
              <button
                onClick={() => navigate("/edit-profile")}
                className="ps-btn"
                style={{ width: "48%" }}
              >
                Edit Profile
              </button>

              {/* Now matching edit profile style */}
              <button className="ps-btn" style={{ width: "48%" }}>
                Message
              </button>
          </div>
        </div>
      </div>
    </>
  );
}