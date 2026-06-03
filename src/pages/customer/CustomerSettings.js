import React from "react";

export default function CustomerSettings({
  setSelectedSetting,
  selectedSetting,

  country,
  setCountry,

  language,
  setLanguage,

  currency,
  setCurrency
}) {
  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const closeSettings = () => {
    setSelectedSetting("");
  };

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <>
      <div style={topCardStyle}>
        <h1 style={titleStyle}>
          Settings
        </h1>

        <h2 style={greenTitleStyle}>
          Your account is protected
        </h2>

        <p style={paragraphStyle}>
          MonniDrop protects your personal information and keeps it private,
          safe and secure.
        </p>
      </div>

      <div style={boxStyle}>
        <div style={sectionTitleStyle}>
          Preferences
        </div>

        {[
          "Country & region",
          "Language",
          "Currency",
          "Notifications",
          "About this app",
          "Legal terms & policies",
          "Share this app",
          "Switch account",
          "Sign out"
        ].map((item)=>(
          <div
            key={item}
            onClick={()=>setSelectedSetting(item)}
            style={rowStyle}
          >
            <div style={rowTextStyle}>
              {item}
            </div>

            <div style={arrowStyle}>
              ›
            </div>
          </div>
        ))}
      </div>

      {selectedSetting && (
        <div style={overlayStyle}>
          <div
            style={{
              ...modalStyle,
              maxWidth:
                selectedSetting === "Share this app"
                ? "780px"
                : "520px"
            }}
          >
            <div style={modalHeaderStyle}>
              <button
                type="button"
                onClick={
                  selectedSetting === "About MonniDrop" ||
                  selectedSetting === "Contact us"
                  ? () => setSelectedSetting("About this app")
                  : closeSettings
                }
                style={backButtonStyle}
              >
                ←
              </button>

              <div style={modalTitleStyle}>
                {selectedSetting}
              </div>
            </div>

            {selectedSetting === "Country & region" ? (
              <select
                value={country}
                onChange={(e)=>setCountry(e.target.value)}
                style={selectStyle}
              >
                <option value="Ghana">Ghana</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Kenya">Kenya</option>
                <option value="South Africa">South Africa</option>
              </select>
            )

            : selectedSetting === "Language" ? (
              <select
                value={language}
                onChange={(e)=>setLanguage(e.target.value)}
                style={selectStyle}
              >
                <option value="English">English</option>
                <option value="Twi">Twi</option>
                <option value="French">French</option>
              </select>
            )

            : selectedSetting === "Currency" ? (
              <select
                value={currency}
                onChange={(e)=>setCurrency(e.target.value)}
                style={selectStyle}
              >
                <option value="GHS">GHS</option>
                <option value="USD">USD</option>
                <option value="NGN">NGN</option>
              </select>
            )

            : selectedSetting === "Notifications" ? (
              <InfoBox>
                Notifications are enabled for order updates, rider messages,
                payment updates, and delivery alerts.
              </InfoBox>
            )

            : selectedSetting === "About this app" ? (
              <div>
                {["About MonniDrop", "Contact us"].map((item)=>(
                  <div
                    key={item}
                    onClick={()=>setSelectedSetting(item)}
                    style={rowStyle}
                  >
                    <div style={rowTextStyle}>
                      {item}
                    </div>

                    <div style={arrowStyle}>
                      ›
                    </div>
                  </div>
                ))}
              </div>
            )

            : selectedSetting === "About MonniDrop" ? (
              <InfoBox>
                <div style={smallHeadingStyle}>
                  MonniDrop
                </div>

                <p style={smallTextStyle}>
                  MonniDrop is a delivery platform that connects customers,
                  riders, and admins for fast and reliable deliveries.
                </p>

                <p style={smallTextStyle}>
                  App version 1.0.0
                </p>
              </InfoBox>
            )

            : selectedSetting === "Contact us" ? (
              <InfoBox>
                <div style={smallHeadingStyle}>
                  Contact MonniDrop
                </div>

                <p style={smallTextStyle}>
                  Address: Accra, Ghana
                </p>

                <p style={smallTextStyle}>
                  Email: support@monnidrop.com
                </p>

                <p style={smallTextStyle}>
                  Phone: +233 000 000 000
                </p>
              </InfoBox>
            )

            : selectedSetting === "Legal terms & policies" ? (
              <InfoBox>
                By using MonniDrop, you agree to use the app responsibly.
                Delivery information, account details, and payment records are
                handled securely to support your orders and customer service.
              </InfoBox>
            )

            : selectedSetting === "Share this app" ? (
              <div style={shareGridStyle}>
                {[
                  { name:"Message", icon:"💬" },
                  { name:"Facebook", icon:"f" },
                  { name:"WhatsApp", icon:"☎" },
                  { name:"X", icon:"𝕏" },
                  { name:"Copy Link", icon:"🔗" },
                  { name:"More", icon:"⋯" }
                ].map((item)=>(
                  <div
                    key={item.name}
                    style={shareItemStyle}
                  >
                    <div style={shareIconStyle}>
                      {item.icon}
                    </div>

                    <div style={shareTextStyle}>
                      {item.name}
                    </div>
                  </div>
                ))}
              </div>
            )

            : selectedSetting === "Switch account" ? (
              <InfoBox>
                <div style={smallHeadingStyle}>
                  Current account
                </div>

                <p style={smallTextStyle}>
                  {user?.name || "Customer"}
                </p>

                <p style={smallTextStyle}>
                  {user?.email || "No email found"}
                </p>

                <button
                  type="button"
                  onClick={signOut}
                  style={mainButtonStyle}
                >
                  Add new account
                </button>
              </InfoBox>
            )

            : selectedSetting === "Sign out" ? (
              <InfoBox>
                <div style={smallHeadingStyle}>
                  Sign out of MonniDrop?
                </div>

                <p style={smallTextStyle}>
                  You will need to log in again to access your account.
                </p>

                <button
                  type="button"
                  onClick={signOut}
                  style={dangerButtonStyle}
                >
                  Sign out
                </button>
              </InfoBox>
            )

            : (
              <InfoBox>
                This setting will be added next.
              </InfoBox>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function InfoBox({ children }) {
  return (
    <div style={infoBoxStyle}>
      {children}
    </div>
  );
}

const topCardStyle = {
  background:"#ffffff",
  borderRadius:"28px",
  padding:"26px",
  marginBottom:"18px",
  border:"1px solid #e5e7eb",
  boxShadow:"0 14px 34px rgba(15,23,42,0.06)"
};

const titleStyle = {
  margin:"0 0 18px",
  fontSize:"34px",
  fontWeight:"900",
  color:"#0f172a"
};

const greenTitleStyle = {
  margin:"0 0 8px",
  fontSize:"30px",
  fontWeight:"900",
  color:"#15803d"
};

const paragraphStyle = {
  margin:"0",
  fontSize:"18px",
  fontWeight:"700",
  color:"#64748b",
  lineHeight:"1.5"
};

const boxStyle = {
  background:"#ffffff",
  borderRadius:"24px",
  padding:"22px",
  border:"1px solid rgba(29,78,216,0.12)",
  boxShadow:"0 10px 26px rgba(15,23,42,0.05)",
  marginBottom:"24px"
};

const sectionTitleStyle = {
  fontSize:"26px",
  fontWeight:"900",
  color:"#0f172a",
  marginBottom:"18px"
};

const rowStyle = {
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  padding:"18px 0",
  borderBottom:"1px solid #eef2f7",
  cursor:"pointer"
};

const rowTextStyle = {
  fontSize:"18px",
  fontWeight:"800",
  color:"#0f172a"
};

const arrowStyle = {
  color:"#1d4ed8",
  fontSize:"26px"
};

const overlayStyle = {
  position:"fixed",
  top:0,
  left:0,
  width:"100%",
  height:"100%",
  background:"rgba(15,23,42,0.72)",
  backdropFilter:"blur(8px)",
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  zIndex:2000
};

const modalStyle = {
  width:"92%",
  background:"linear-gradient(180deg,#ffffff,#f8fafc)",
  border:"1px solid rgba(29,78,216,0.12)",
  borderRadius:"30px",
  padding:"32px",
  boxShadow:"0 30px 80px rgba(15,23,42,0.18)",
  maxHeight:"85vh",
  overflowY:"auto"
};

const modalHeaderStyle = {
  display:"flex",
  alignItems:"center",
  gap:"10px",
  marginBottom:"18px"
};

const backButtonStyle = {
  width:"36px",
  height:"36px",
  borderRadius:"13px",
  border:"none",
  display:"inline-flex",
  alignItems:"center",
  justifyContent:"center",
  background:"linear-gradient(135deg,#0f172a,#1d4ed8)",
  color:"#facc15",
  fontWeight:"900",
  cursor:"pointer",
  fontSize:"20px"
};

const modalTitleStyle = {
  fontSize:"28px",
  fontWeight:"900",
  background:"linear-gradient(135deg,#0f172a,#1d4ed8)",
  WebkitBackgroundClip:"text",
  WebkitTextFillColor:"transparent"
};

const selectStyle = {
  width:"100%",
  padding:"14px",
  borderRadius:"14px",
  border:"1px solid rgba(29,78,216,0.18)",
  fontWeight:"800",
  color:"#0f172a",
  outline:"none"
};

const infoBoxStyle = {
  background:"#f8fafc",
  border:"1px solid #e5e7eb",
  borderRadius:"18px",
  padding:"18px",
  color:"#64748b",
  fontWeight:"800",
  lineHeight:"1.6"
};

const smallHeadingStyle = {
  fontSize:"22px",
  fontWeight:"900",
  color:"#0f172a",
  marginBottom:"10px"
};

const smallTextStyle = {
  margin:"0 0 10px",
  fontSize:"16px",
  fontWeight:"700",
  color:"#64748b",
  lineHeight:"1.6"
};

const shareGridStyle = {
  display:"grid",
  gridTemplateColumns:"repeat(4,1fr)",
  gap:"14px"
};

const shareItemStyle = {
  background:"#ffffff",
  border:"1px solid #e5e7eb",
  borderRadius:"18px",
  padding:"16px 10px",
  textAlign:"center",
  cursor:"pointer",
  boxShadow:"0 8px 18px rgba(15,23,42,0.05)"
};

const shareIconStyle = {
  width:"44px",
  height:"44px",
  borderRadius:"15px",
  margin:"0 auto 8px",
  background:"linear-gradient(135deg,#0f172a,#1d4ed8)",
  color:"#facc15",
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  fontSize:"22px",
  fontWeight:"900"
};

const shareTextStyle = {
  fontSize:"14px",
  fontWeight:"900",
  color:"#0f172a"
};

const mainButtonStyle = {
  width:"100%",
  marginTop:"14px",
  padding:"14px",
  borderRadius:"14px",
  border:"none",
  background:"linear-gradient(135deg,#0f172a,#1d4ed8)",
  color:"#ffffff",
  fontSize:"16px",
  fontWeight:"900",
  cursor:"pointer"
};

const dangerButtonStyle = {
  width:"100%",
  marginTop:"14px",
  padding:"14px",
  borderRadius:"14px",
  border:"none",
  background:"#dc2626",
  color:"#ffffff",
  fontSize:"16px",
  fontWeight:"900",
  cursor:"pointer"
};