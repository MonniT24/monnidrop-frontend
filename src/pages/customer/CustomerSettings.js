import React from "react";

import {
  FaWhatsapp,
  FaFacebookF
} from "react-icons/fa";

import {
  FaXTwitter
} from "react-icons/fa6";

import {
  FiMessageCircle,
  FiLink,
  FiMoreHorizontal
} from "react-icons/fi";

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

  const updateSavedSettings = (key,value) => {
    const savedSettings =
      JSON.parse(
        localStorage.getItem("monnidropCustomerSettings") || "{}"
      );

    localStorage.setItem(
      "monnidropCustomerSettings",
      JSON.stringify({
        ...savedSettings,
        [key]:value
      })
    );
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

  : selectedSetting === "Privacy policy" ||
    selectedSetting === "Terms of use" ||
    selectedSetting === "Refund policy" ||
    selectedSetting === "Intellectual property policy"

  ? () => setSelectedSetting("Legal terms & policies")

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
                onChange={(e)=>{
                  const selectedCountry =
                    e.target.value;

                  setCountry(selectedCountry);

                  localStorage.setItem(
                    "monnidropCountry",
                    selectedCountry
                  );

                  updateSavedSettings(
                    "country",
                    selectedCountry
                  );
                }}
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
                onChange={(e)=>{
                  const selectedLanguage =
                    e.target.value;

                  setLanguage(selectedLanguage);

                  localStorage.setItem(
                    "monnidropLanguage",
                    selectedLanguage
                  );

                  updateSavedSettings(
                    "language",
                    selectedLanguage
                  );
                }}
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
                onChange={(e)=>{
                  const selectedCurrency =
                    e.target.value;

                  setCurrency(selectedCurrency);

                  localStorage.setItem(
                    "monnidropCurrency",
                    selectedCurrency
                  );

                  updateSavedSettings(
                    "currency",
                    selectedCurrency
                  );
                }}
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
                  Phone: +233 244 095 101
                </p>
              </InfoBox>
            )

           : selectedSetting === "Legal terms & policies" ? (
  <div>
    {[
      "Privacy policy",
      "Terms of use",
      "Refund policy",
      "Intellectual property policy"
    ].map((item)=>(
      <div
        key={item}
        onClick={()=>setSelectedSetting(item)}
        style={policyRowStyle}
      >
        <div style={policyTextStyle}>
          {item}
        </div>

        <div style={policyArrowStyle}>
          ›
        </div>
      </div>
    ))}
  </div>
)

: selectedSetting === "Privacy policy" ? (
  <InfoBox>

    <div style={smallHeadingStyle}>
      Privacy Policy
    </div>

    <div style={lastUpdatedStyle}>
      Last Updated: June 2026
    </div>

    <p style={smallTextStyle}>
      MonniDrop collects only the information needed to provide account,
      delivery, payment and customer support services.
    </p>

    <p style={smallTextStyle}>
      This may include your name, phone number, email address, delivery
      locations, payment method and order history.
    </p>

    <p style={smallTextStyle}>
      Your personal information is used to process deliveries, assign riders,
      improve customer service and keep your account secure.
    </p>

    <p style={smallTextStyle}>
      MonniDrop does not sell your personal information to third parties.
    </p>

    <p style={smallTextStyle}>
      We may share limited information with riders, admins or payment services
      only when needed to complete your delivery or support request.
    </p>

    <p style={smallTextStyle}>
      Users are responsible for keeping their login details private and
      reporting suspicious account activity quickly.
    </p>

  </InfoBox>
)

: selectedSetting === "Terms of use" ? (
  <InfoBox>

    <div style={smallHeadingStyle}>
      Terms of Use
    </div>

    <div
  style={{
    fontSize:"14px",
    fontWeight:"700",
    color:"#94a3b8",
    marginBottom:"18px"
  }}
>
  Last Updated: June 2026
</div>

    <p style={smallTextStyle}>
      Users must provide accurate information when creating accounts and
      placing delivery requests.
    </p>

    <p style={smallTextStyle}>
      Fraudulent activities, misuse of the platform, fake orders,
      impersonation and abuse of riders are strictly prohibited.
    </p>

    <p style={smallTextStyle}>
      Customers are responsible for providing correct pickup and
      delivery locations to ensure successful deliveries.
    </p>

    <p style={smallTextStyle}>
      Riders are expected to handle packages professionally,
      follow delivery instructions and comply with all applicable
      road and safety regulations.
    </p>

    <p style={smallTextStyle}>
      MonniDrop reserves the right to suspend or permanently
      disable accounts that violate platform rules, engage in
      fraudulent activities or compromise the safety of users.
    </p>

    <p style={smallTextStyle}>
      Users are responsible for maintaining the confidentiality
      of their login credentials and account information.
    </p>

    <p style={smallTextStyle}>
      MonniDrop may update these terms periodically to improve
      service quality, security, operational efficiency and
      regulatory compliance.
    </p>

  </InfoBox>
)

: selectedSetting === "Refund policy" ? (
  <InfoBox>

    <div style={smallHeadingStyle}>
      Refund Policy
    </div>

    <div style={lastUpdatedStyle}>
      Last Updated: June 2026
    </div>

    <p style={smallTextStyle}>
      Refund requests are reviewed based on delivery status, payment
      confirmation and the reason for the request.
    </p>

    <p style={smallTextStyle}>
      A refund may be considered if payment was made but the delivery service
      was not completed due to a verified issue.
    </p>

    <p style={smallTextStyle}>
      Refunds may not apply where incorrect pickup or drop-off information was
      provided by the customer.
    </p>

    <p style={smallTextStyle}>
      Cash payment issues may require confirmation from the rider, customer and
      admin before any settlement decision is made.
    </p>

    <p style={smallTextStyle}>
      Approved refunds will be processed through the original payment method
      where possible.
    </p>

    <p style={smallTextStyle}>
      MonniDrop may reject refund requests that involve fraud, false claims or
      misuse of the platform.
    </p>

  </InfoBox>
)

: selectedSetting === "Intellectual property policy" ? (
  <InfoBox>

    <div style={smallHeadingStyle}>
      Intellectual Property Policy
    </div>

    <div style={lastUpdatedStyle}>
      Last Updated: June 2026
    </div>

    <p style={smallTextStyle}>
      The MonniDrop name, logo, branding, app design, platform features,
      software and written content are protected intellectual property.
    </p>

    <p style={smallTextStyle}>
      Users may not copy, reproduce, modify, distribute or commercially use
      MonniDrop materials without permission.
    </p>

    <p style={smallTextStyle}>
      Riders, customers and admins may only use MonniDrop materials for normal
      platform activities.
    </p>

    <p style={smallTextStyle}>
      Any unauthorized use of MonniDrop branding, screenshots, code or business
      materials may result in account restriction or legal action.
    </p>

    <p style={smallTextStyle}>
      If you believe your intellectual property has been used improperly on
      MonniDrop, contact support for review.
    </p>

  </InfoBox>
)
            : selectedSetting === "Share this app" ? (
              <div style={shareGridStyle}>
               {[
  { name:"Message", icon:<FiMessageCircle /> },
  { name:"Facebook", icon:<FaFacebookF /> },
  { name:"WhatsApp", icon:<FaWhatsapp /> },
  { name:"X", icon:<FaXTwitter /> },
  { name:"Copy Link", icon:<FiLink /> },
  { name:"More", icon:<FiMoreHorizontal /> }
].map((item)=>(
                  <div
                    key={item.name}
                   onClick={()=>{

  const appLink =
    window.location.origin;

  const shareText =
    `Check out MonniDrop: ${appLink}`;

  if(item.name === "Message"){
    window.location.href =
      `sms:?body=${encodeURIComponent(shareText)}`;
  }

  if(item.name === "WhatsApp"){
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  }

  if(item.name === "Facebook"){
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appLink)}`,
      "_blank"
    );
  }

  if(item.name === "X"){
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  }

  if(item.name === "Copy Link"){
    navigator.clipboard.writeText(appLink);
    alert("MonniDrop link copied!");
  }

  if(item.name === "More"){
    if(navigator.share){
      navigator.share({
        title:"MonniDrop",
        text:"Check out MonniDrop",
        url:appLink
      });
    }else{
      navigator.clipboard.writeText(appLink);
      alert("Sharing is not supported here. Link copied instead!");
    }
  }

}}
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
  padding:"22px",
  color:"#64748b",
  fontWeight:"600",
  fontSize:"17px",
  lineHeight:"1.8"
};

const smallHeadingStyle = {
  fontSize:"22px",
  fontWeight:"900",
  color:"#0f172a",
  marginBottom:"10px"
};

const smallTextStyle = {
  margin:"0 0 12px",
  fontSize:"14px",
  fontWeight:"600",
  color:"#334155",
  lineHeight:"1.7"
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

const policyRowStyle = {
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  padding:"22px 4px",
  borderBottom:"1px solid #e5e7eb",
  cursor:"pointer"
};

const policyTextStyle = {
  fontSize:"22px",
  fontWeight:"800",
  color:"#0f172a"
};

const policyArrowStyle = {
  fontSize:"34px",
  color:"#94a3b8",
  fontWeight:"500"
};

const lastUpdatedStyle = {
  fontSize:"13px",
  fontWeight:"700",
  color:"#64748b",
  marginBottom:"16px"
};