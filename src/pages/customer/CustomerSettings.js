import React from "react";

import API from "../../api/api";

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
  FiMoreHorizontal,
  FiBell,
  FiBox,
  FiCreditCard,
  FiHeadphones,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi";

export default function CustomerSettings({
  setSelectedSetting,
  selectedSetting,

  country,
  setCountry,

  language,
  setLanguage,

  currency,
  setCurrency,

  showSupportChat,
  setShowSupportChat,
  supportMessages = [],
  supportMessage,
  setSupportMessage,
  sendSupportMessage,

  supportImage,
  setSupportImage,
  supportImagePreview,
  setSupportImagePreview
}) {

  const [closeHover,setCloseHover] =
    React.useState(false);

  const [cancelHover,setCancelHover] =
    React.useState(false);

  const [signOutHover,setSignOutHover] =
    React.useState(false);

  const [addAccountHover,setAddAccountHover] =
    React.useState(false);

  const [resetHover,setResetHover] =
    React.useState(false);

  const [removeAccountHover,setRemoveAccountHover] =
    React.useState("");

    const [deleteAccountHover,setDeleteAccountHover] =
  React.useState(false);

  const [editingNotification,setEditingNotification] =
    React.useState("");

  const [supportSearch,setSupportSearch] =
  React.useState("");

const [supportSearchResult,setSupportSearchResult] =
  React.useState("");  

  const [feedbackMessage,setFeedbackMessage] =
  React.useState("");

const [deleteAccountConfirmed,setDeleteAccountConfirmed
] = React.useState(false);  

const [privacyRecommendations,setPrivacyRecommendations] =
  React.useState(
    localStorage.getItem("monnidropPrivacyRecommendations") !== "false"
  );

const [privacyLocation,setPrivacyLocation] =
  React.useState(
    localStorage.getItem("monnidropPrivacyLocation") !== "false"
  );

const [privacyNotifications,setPrivacyNotifications] =
  React.useState(
    localStorage.getItem("monnidropPrivacyNotifications") !== "false"
  );

const [privacyPage,setPrivacyPage] =
  React.useState("");

  const [suspiciousReportOpen,setSuspiciousReportOpen] =
  React.useState(false);

const [suspiciousReceiveMethod,setSuspiciousReceiveMethod] =
  React.useState("");

const [suspiciousEmail,setSuspiciousEmail] =
  React.useState("");

const [suspiciousPlatform,setSuspiciousPlatform] =
  React.useState("");

const [suspiciousLocation,setSuspiciousLocation] =
  React.useState("");

const [suspiciousDate,setSuspiciousDate] =
  React.useState("");

const [suspiciousSummary,setSuspiciousSummary] =
  React.useState("");

const [suspiciousSubmitHover,setSuspiciousSubmitHover] =
  React.useState(false);

const [fakeSiteType,setFakeSiteType] =
  React.useState("Website");

const [fakeSiteLink,setFakeSiteLink] =
  React.useState("");

const [fakeSiteSubmittedInfo,setFakeSiteSubmittedInfo] =
  React.useState([]);

const [fakeSiteLossAmount,setFakeSiteLossAmount] =
  React.useState("");

const [fakeSiteSummary,setFakeSiteSummary] =
  React.useState("");

const [fakeSiteSubmitHover,setFakeSiteSubmitHover] =
  React.useState(false); 
  
const [riderReportSource,setRiderReportSource] =
  React.useState("Facebook");

const [riderReportLink,setRiderReportLink] =
  React.useState("");

const [riderReportLossAmount,setRiderReportLossAmount] =
  React.useState("");

const [riderReportSummary,setRiderReportSummary] =
  React.useState("");

const [riderReportSubmitHover,setRiderReportSubmitHover] =
  React.useState(false);  

  const [notificationSettings,setNotificationSettings] =
    React.useState(()=>{

      const savedSettings =
        localStorage.getItem("monnidropNotificationSettings");

      if(savedSettings){
        return JSON.parse(savedSettings);
      }

      return {

        Promotions:{
          push:true,
          email:true,
          sms:false
        },

        "Order updates":{
          push:true,
          email:true,
          sms:true
        },

        "Chat messages":{
          push:true,
          email:true,
          sms:true
        },

        "Payment alerts":{
          push:true,
          email:true,
          sms:false
        },

        "Support replies":{
          push:true,
          email:false,
          sms:false
        }
      };
    });

 let user = {};

try{

  const savedUser =
    localStorage.getItem("user");

  user =
    savedUser && savedUser !== "undefined"
    ? JSON.parse(savedUser)
    : {};

}catch(err){

  user = {};
}

const [securityPanel,setSecurityPanel] =
  React.useState("");

const [securityMessage,setSecurityMessage] =
  React.useState("");

const [securityPhone,setSecurityPhone] =
  React.useState(user?.phone || "");

const [securityEmail,setSecurityEmail] =
  React.useState(user?.email || "");

const [securityPassword,setSecurityPassword] =
  React.useState("");

const [twoFactorOn,setTwoFactorOn] =
  React.useState(
    localStorage.getItem("monnidropTwoFactorEnabled") === "true"
  );

const [googleLinked,setGoogleLinked] =
  React.useState(
    localStorage.getItem("monnidropGoogleLinked") === "true"
  );

const [facebookLinked,setFacebookLinked] =
  React.useState(
    localStorage.getItem("monnidropFacebookLinked") === "true"
  );  

  React.useEffect(()=>{

  async function loadCustomerSecurity(){

    try{

      const res =
        await API.get(
          "/customer/me"
        );

      const freshUser =
        res.data;

      localStorage.setItem(
        "user",
        JSON.stringify(freshUser)
      );

      setSecurityPhone(
        freshUser?.phone || ""
      );

      setSecurityEmail(
        freshUser?.email || ""
      );

    }catch(err){

      console.log(
        "LOAD CUSTOMER SECURITY ERROR:",
        err
      );
    }
  }

  loadCustomerSecurity();

},[]);

  const [savedAccounts,setSavedAccounts] =
    React.useState(()=>{

      const accounts =
        localStorage.getItem(
          "monnidropSavedAccounts"
        );

      return accounts
        ? JSON.parse(accounts)
        : [];
    });

  function saveCurrentAccount(){

    if(!user?.email){
      return;
    }

    const exists =
      savedAccounts.find(
        (account)=>
          account.email === user.email
      );

    if(exists){
      return;
    }

    const updatedAccounts = [

      ...savedAccounts,

      {
        name:user.name,
        email:user.email
      }

    ];

    setSavedAccounts(
      updatedAccounts
    );

    localStorage.setItem(
      "monnidropSavedAccounts",
      JSON.stringify(updatedAccounts)
    );
  }

  const closeSettings = () => {
    setSelectedSetting("");
  };

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const updateLocalUser = (updates) => {
  const currentUser =
    JSON.parse(localStorage.getItem("user") || "{}");

  const updatedUser = {
    ...currentUser,
    ...updates
  };

  localStorage.setItem(
    "user",
    JSON.stringify(updatedUser)
  );
};

const openSecurityPanel = (panelName) => {
  setSecurityPanel(panelName);
  setSecurityMessage("");
};

 const searchSupportArticle = () => {

  const text =
    supportSearch.trim().toLowerCase();

  if(!text){
    setSupportSearchResult(
      "Please type a question first."
    );
    return;
  }

  if(
    text.includes("fake rider") ||
    text.includes("report rider") ||
    text.includes("suspicious rider") ||
    text.includes("rider")
  ){
    setSupportSearchResult(
      "To report a fake or suspicious rider, go to Contact us, open Live Chat Support, describe the rider and delivery issue, and attach a screenshot or photo if available."
    );
    return;
  }

  if(
    text.includes("fake link") ||
    text.includes("fake website") ||
    text.includes("fake app")
  ){
    setSupportSearchResult(
      "Avoid opening suspicious MB Swift links. Only use the official MB Swift app or website. Report fake links through Contact us."
    );
    return;
  }

  if(
    text.includes("payment") ||
    text.includes("momo") ||
    text.includes("money") ||
    text.includes("pay")
  ){
    setSupportSearchResult(
      "For payment safety, always confirm your payment status inside MB Swift and avoid sending money outside the app."
    );
    return;
  }

  if(
    text.includes("scam") ||
    text.includes("fake") ||
    text.includes("fraud")
  ){
    setSupportSearchResult(
      "Be careful with fake calls, suspicious links, and people asking for payments outside MB Swift."
    );
    return;
  }

  if(
    text.includes("password") ||
    text.includes("secure") ||
    text.includes("account") ||
    text.includes("login")
  ){
    setSupportSearchResult(
      "To make your account more secure, use a strong password, avoid reusing passwords, and enable two-factor authentication when available."
    );
    return;
  }

  setSupportSearchResult(
    "No exact answer found. Please contact MB Swift support from Contact us."
  );
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
          MB Swift protects your personal information and keeps it private,
          safe and secure.
        </p>
      </div>

<div style={securityGridStyle}>

  {[
    {
      title:"Account security",
      icon:"🛡️"
    },
    {
      title:"Privacy",
      icon:"🔒"
    },
    {
      title:"Permissions",
      icon:"🔑"
    },
    {
      title:"Safety center",
      icon:"✅"
    }
  ].map((item)=>(

    <div
      key={item.title}
      onClick={()=>setSelectedSetting(item.title)}
      style={securityCardStyle}
    >
      <div style={securityIconStyle}>
        {item.icon}
      </div>

      <div style={securityTextStyle}>
        {item.title}
      </div>

      <div style={securityArrowStyle}>
        ›
      </div>
    </div>

  ))}

</div>

<div style={boxStyle}>
  <div style={sectionTitleStyle}>
    Preferences
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
                  selectedSetting === "About MB Swift" ||
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

                {[
                  {
                    title:"Promotions",
                    text:"Get notified about offers and discounts.",
                    icon:<FiBell />
                  },
                  {
                    title:"Order updates",
                    text:"Get notified about your order status.",
                    icon:<FiBox />
                  },
                  {
                    title:"Chat messages",
                    text:"Get notified about new messages.",
                    icon:<FiMessageCircle />
                  },
                  {
                    title:"Payment alerts",
                    text:"Get notified about payment activities.",
                    icon:<FiCreditCard />
                  },
                  {
                    title:"Support replies",
                    text:"Get notified about support responses.",
                    icon:<FiHeadphones />
                  }
                ].map((item)=>(

                  <div
                    key={item.title}
                    style={notificationCardStyle}
                  >
                    <div style={notificationTopRowStyle}>

                      <div style={notificationIconStyle}>
                        {item.icon}
                      </div>

                      <div style={{flex:1}}>
                        <div style={notificationTitleStyle}>
                          {item.title}
                        </div>

                        <div style={notificationTextStyle}>
                          {item.text}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={()=>{
                          setEditingNotification(
                            editingNotification === item.title
                            ? ""
                            : item.title
                          );
                        }}
                        style={notificationEditButtonStyle}
                      >
                        {
                          editingNotification === item.title
                          ? "Close"
                          : "Edit"
                        }
                      </button>

                      <div style={notificationArrowStyle}>
                        {
                          editingNotification === item.title
                          ? <FiChevronUp />
                          : <FiChevronDown />
                        }
                      </div>

                    </div>

                    {editingNotification === item.title && (

                      <div style={notificationToggleBoxStyle}>

                        {["push","email","sms"].map((type)=>(

                          <div
                            key={type}
                            style={notificationToggleRowStyle}
                          >
                            <span style={notificationToggleTextStyle}>
                              {type.toUpperCase()}
                            </span>

                            <div
                              onClick={()=>{

                                setNotificationSettings((old)=>{

                                  const updatedSettings = {
                                    ...old,
                                    [item.title]:{
                                      ...old[item.title],
                                      [type]:
                                        !old[item.title]?.[type]
                                    }
                                  };

                                  localStorage.setItem(
                                    "monnidropNotificationSettings",
                                    JSON.stringify(updatedSettings)
                                  );

                                  return updatedSettings;
                                });

                              }}
                              style={{
                                ...notificationSwitchStyle,
                                background:
                                  notificationSettings[item.title]?.[type]
                                  ? "#1d4ed8"
                                  : "#cbd5e1"
                              }}
                            >
                              <div
                                style={{
                                  ...notificationSwitchDotStyle,
                                  left:
                                    notificationSettings[item.title]?.[type]
                                    ? "22px"
                                    : "3px"
                                }}
                              />
                            </div>

                          </div>

                        ))}

                      </div>

                    )}

                  </div>

                ))}

                <div
                  style={{
                    marginTop:"18px",
                    display:"flex",
                    justifyContent:"center"
                  }}
                >
                  <button
                    type="button"
                    onMouseEnter={()=>setResetHover(true)}
                    onMouseLeave={()=>setResetHover(false)}
                    onClick={()=>{

                      const defaultSettings = {

                        Promotions:{
                          push:true,
                          email:true,
                          sms:false
                        },

                        "Order updates":{
                          push:true,
                          email:true,
                          sms:true
                        },

                        "Chat messages":{
                          push:true,
                          email:true,
                          sms:true
                        },

                        "Payment alerts":{
                          push:true,
                          email:true,
                          sms:false
                        },

                        "Support replies":{
                          push:true,
                          email:false,
                          sms:false
                        }

                      };

                      setNotificationSettings(
                        defaultSettings
                      );

                      localStorage.setItem(
                        "monnidropNotificationSettings",
                        JSON.stringify(defaultSettings)
                      );

                    }}
                    style={{
                      ...resetNotificationButtonStyle,
                      background:
                        resetHover
                        ? "#b91c1c"
                        : "#dc2626",
                      transform:
                        resetHover
                        ? "translateY(-2px)"
                        : "translateY(0)",
                      boxShadow:
                        resetHover
                        ? "0 10px 24px rgba(220,38,38,0.35)"
                        : "none",
                      transition:"0.25s ease"
                    }}
                  >
                    Reset to Default
                  </button>
                </div>

              </InfoBox>
            )

            : selectedSetting === "About this app" ? (
              <div>
                {["About MB Swift", "Contact us"].map((item)=>(
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

            : selectedSetting === "About MB Swift" ? (
              <InfoBox>
                <div style={smallHeadingStyle}>
                  MB Swift
                </div>

                <div style={lastUpdatedStyle}>
                  Version 1.0.0
                </div>

                <p style={smallTextStyle}>
                  MB Swift is a modern delivery platform designed to connect
                  customers, riders and administrators through a fast, secure and
                  reliable delivery experience.
                </p>

                <p style={smallTextStyle}>
                  The platform enables customers to create delivery requests,
                  track orders in real time, communicate with riders and receive
                  updates throughout the delivery process.
                </p>

                <p style={smallTextStyle}>
                  Riders can manage delivery assignments, update order status,
                  navigate delivery routes and provide efficient services across
                  different locations.
                </p>

                <p style={smallTextStyle}>
                  Administrators are able to monitor operations, manage riders,
                  oversee payments, review customer support requests and maintain
                  the overall quality of the platform.
                </p>

                <p style={smallTextStyle}>
                  MB Swift is built with a focus on convenience, transparency,
                  security and operational efficiency to help customers receive
                  their items quickly and reliably.
                </p>
              </InfoBox>
            )

            : selectedSetting === "Contact us" ? (
              <InfoBox>
                <div style={smallHeadingStyle}>
                  Contact MB Swift
                </div>

                <div style={lastUpdatedStyle}>
                  Support available for customers, riders and delivery issues.
                </div>

                <div style={contactCardStyle}>
                  <div>
                    <div style={contactTitleStyle}>
                      Call us
                    </div>

                    <div style={contactTextStyle}>
                      Speak directly with MB Swift support.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={()=>{
                      window.location.href = "tel:+233244095101";
                    }}
                    style={contactButtonStyle}
                  >
                    Call
                  </button>
                </div>

                <div style={contactCardStyle}>
                  <div>
                    <div style={contactTitleStyle}>
                      Email us
                    </div>

                    <div style={contactTextStyle}>
                      Send support questions or complaints by email.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={()=>{
                      window.location.href =
                        "mailto:support@mbswiftgh.com?subject=MB Swift Support Request";
                    }}
                    style={contactButtonStyle}
                  >
                    Email
                  </button>
                </div>

                <div style={contactCardStyle}>
                  <div>
                    <div style={contactTitleStyle}>
                      WhatsApp Support
                    </div>

                    <div style={contactTextStyle}>
                      Chat with MB Swift support on WhatsApp.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={()=>{
                      window.open(
                        "https://wa.me/233244095101?text=Hello%20MB Swift%20Support",
                        "_blank"
                      );
                    }}
                    style={contactButtonStyle}
                  >
                    Chat
                  </button>
                </div>

                <div style={contactCardStyle}>
                  <div>
                    <div style={contactTitleStyle}>
                      Live Chat Support
                    </div>

                    <div style={contactTextStyle}>
                      Use in-app support chat for delivery, payment or account issues.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={()=>{
                      setShowSupportChat(true);
                    }}
                    style={contactButtonStyle}
                  >
                    Open
                  </button>
                </div>

                {showSupportChat && (
                  <div style={supportChatBoxStyle}>
                    <div
                      style={{
                        display:"flex",
                        justifyContent:"space-between",
                        alignItems:"center",
                        marginBottom:"10px"
                      }}
                    >
                      <div style={smallHeadingStyle}>
                        Customer Support Chat
                      </div>

                      <button
                        type="button"
                        onClick={()=>{
                          setShowSupportChat(false);
                        }}
                        onMouseEnter={()=>
                          setCloseHover(true)
                        }
                        onMouseLeave={()=>
                          setCloseHover(false)
                        }
                        style={{
                          width:"34px",
                          height:"34px",
                          border:"none",
                          borderRadius:"12px",
                          background:
                            closeHover
                            ? "#7f1d1d"
                            : "#991b1b",
                          color:"#ffffff",
                          fontSize:"18px",
                          fontWeight:"900",
                          cursor:"pointer",
                          transition:"0.25s ease",
                          transform:
                            closeHover
                            ? "scale(1.08)"
                            : "scale(1)"
                        }}
                      >
                        ×
                      </button>
                    </div>

                    <div style={supportChatWindowStyle}>
                      <div style={supportBubbleStyle}>
                        Hello 👋 Welcome to MB Swift Customer support. How can we help you?
                      </div>

                      {supportMessages.map((msg,index)=>{

                        const currentDate =
                          msg.createdAt
                          ? new Date(msg.createdAt).toLocaleDateString("en-GB",{
                              day:"2-digit",
                              month:"short",
                              year:"numeric"
                            })
                          : "Today";

                        const previousMessage =
                          supportMessages[index - 1];

                        const previousDate =
                          previousMessage?.createdAt
                          ? new Date(previousMessage.createdAt).toLocaleDateString("en-GB",{
                              day:"2-digit",
                              month:"short",
                              year:"numeric"
                            })
                          : null;

                        const showDate =
                          currentDate !== previousDate;

                        const messageTime =
                          msg.createdAt
                          ? new Date(msg.createdAt).toLocaleTimeString("en-GB",{
                              hour:"2-digit",
                              minute:"2-digit"
                            })
                          : "Now";

                        const replyTime =
                          msg.repliedAt || msg.updatedAt || msg.createdAt
                          ? new Date(
                              msg.repliedAt || msg.updatedAt || msg.createdAt
                            ).toLocaleTimeString("en-GB",{
                              hour:"2-digit",
                              minute:"2-digit"
                            })
                          : "Now";

                        return (

                          <div key={msg._id || index}>

                            {showDate && (
                              <div style={chatDateStyle}>
                                {currentDate}
                              </div>
                            )}

                            <div style={customerBubbleStyle}>
                              {msg.message && (
                                <div>
                                  You: {msg.message}
                                </div>
                              )}

                              {msg.image && (
                                <img
                                  src={msg.image}
                                  alt="Support attachment"
                                  style={{
                                    width:"100%",
                                    maxWidth:"180px",
                                    borderRadius:"12px",
                                    marginTop:msg.message ? "8px" : "0",
                                    display:"block"
                                  }}
                                />
                              )}

                              <div style={messageTimeStyle}>
                                {messageTime}
                              </div>
                            </div>

                            {msg.reply && (
                              <div style={supportBubbleStyle}>
                                <div>
                                  Support: {msg.reply}
                                </div>

                                <div style={messageTimeStyle}>
                                  {replyTime}
                                </div>
                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>

                    <input
                      id="supportPhotoUpload"
                      type="file"
                      accept="image/*"
                      style={{ display:"none" }}
                      onChange={(e)=>{

                        const file =
                          e.target.files[0];

                        if(file){
                          setSupportImage(file);
                          setSupportImagePreview(
                            URL.createObjectURL(file)
                          );
                        }
                      }}
                    />

                    <input
                      id="supportCameraUpload"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      style={{ display:"none" }}
                      onChange={(e)=>{

                        const file =
                          e.target.files[0];

                        if(file){
                          setSupportImage(file);
                          setSupportImagePreview(
                            URL.createObjectURL(file)
                          );
                        }
                      }}
                    />

                    {supportImagePreview && (
                      <div
                        style={{
                          display:"flex",
                          alignItems:"center",
                          gap:"10px",
                          margin:"8px 0",
                          padding:"8px",
                          background:"#f8fafc",
                          border:"1px solid #e5e7eb",
                          borderRadius:"14px"
                        }}
                      >
                        <img
                          src={supportImagePreview}
                          alt="Selected"
                          style={{
                            width:"70px",
                            height:"70px",
                            objectFit:"cover",
                            borderRadius:"12px"
                          }}
                        />

                        <button
                          type="button"
                          onClick={()=>{
                            setSupportImage(null);
                            setSupportImagePreview("");
                          }}
                          style={{
                            border:"none",
                            background:"#ef4444",
                            color:"#ffffff",
                            padding:"8px 12px",
                            borderRadius:"10px",
                            fontWeight:"900",
                            cursor:"pointer"
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}

               <div
  style={{
    display:"grid",
    gridTemplateColumns:"38px 38px 1fr 72px",
    alignItems:"center",
    gap:"7px",
    width:"100%",
    marginTop:"12px"
  }}
>
                      <button
                        type="button"
                        onClick={()=>
                          document
                            .getElementById("supportPhotoUpload")
                            .click()
                        }
                        style={uploadSmallButtonStyle}
                      >
                        📎
                      </button>

                      <button
                        type="button"
                        onClick={()=>
                          document
                            .getElementById("supportCameraUpload")
                            .click()
                        }
                        style={uploadSmallButtonStyle}
                      >
                        📷
                      </button>

  <input
  id="supportMessageInput"
  value={supportMessage}
  onChange={(e)=>setSupportMessage(e.target.value)}
  placeholder="Type your message..."
  style={supportInputStyle}
/>

                      <button
                        type="button"
                        onClick={sendSupportMessage}
                        style={supportSendButtonStyle}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}

                <div style={contactFooterStyle}>
                  Address: Accra, Ghana
                </div>
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
                  MB Swift collects only the information needed to provide account,
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
                  MB Swift does not sell your personal information to third parties.
                </p>

                <p style={smallTextStyle}>
                  We may share limited information with riders, admins or payment services
                  only when needed to complete your delivery or support request.
                </p>
              </InfoBox>
            )

            : selectedSetting === "Terms of use" ? (
              <InfoBox>
                <div style={smallHeadingStyle}>
                  Terms of Use
                </div>

                <div style={lastUpdatedStyle}>
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
                  Customers are responsible for providing correct pickup and delivery
                  locations to ensure successful deliveries.
                </p>

                <p style={smallTextStyle}>
                  MB Swift reserves the right to suspend or permanently disable accounts
                  that violate platform rules, engage in fraudulent activities or
                  compromise the safety of users.
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
                  Approved refunds will be processed through the original payment method
                  where possible.
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
                  The MB Swift name, logo, branding, app design, platform features,
                  software and written content are protected intellectual property.
                </p>

                <p style={smallTextStyle}>
                  Users may not copy, reproduce, modify, distribute or commercially use
                  MB Swift materials without permission.
                </p>

                <p style={smallTextStyle}>
                  Unauthorized use of MB Swift branding, screenshots, code or business
                  materials may result in account restriction or legal action.
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
                        `Check out MB Swift: ${appLink}`;

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
                        alert("MB Swift link copied!");
                      }

                      if(item.name === "More"){
                        if(navigator.share){
                          navigator.share({
                            title:"MB Swift",
                            text:"Check out MB Swift",
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
                  Switch Account
                </div>

                <div style={lastUpdatedStyle}>
                  Manage the account currently signed in on this device.
                </div>

                <div style={switchAccountCardStyle}>

                  <div style={switchAccountAvatarStyle}>
                    {(user?.name || "Customer").charAt(0).toUpperCase()}
                  </div>

                  <div style={{flex:1}}>
                    <div style={switchAccountNameStyle}>
                      {user?.name || "Customer"}
                    </div>

                    <div style={switchAccountEmailStyle}>
                      {user?.email || "No email found"}
                    </div>

                    <div style={activeAccountBadgeStyle}>
                      Active now
                    </div>
                  </div>

                </div>

                <div style={switchSectionTitleStyle}>
                  Saved accounts
                </div>

                {
                  savedAccounts.length === 0
                  ? (
                    <div style={savedAccountEmptyStyle}>
                      No other saved accounts on this device.
                    </div>
                  )
                  : (
                    <div>
                      {savedAccounts.map((account,index)=>(

                        <div
                          key={account.email || index}
                          style={savedAccountCardStyle}
                        >
                          <div style={savedAccountAvatarStyle}>
                            {(account.name || "A").charAt(0).toUpperCase()}
                          </div>

                          <div style={{flex:1}}>
                            <div style={savedAccountNameStyle}>
                              {account.name || "Saved account"}
                            </div>

                            <div style={savedAccountEmailStyle}>
                              {account.email || "No email found"}
                            </div>
                          </div>

                          <button
                            type="button"
                            onMouseEnter={()=>
                              setRemoveAccountHover(account.email)
                            }
                            onMouseLeave={()=>
                              setRemoveAccountHover("")
                            }
                            onClick={()=>{

                              const updatedAccounts =
                                savedAccounts.filter(
                                  (saved)=>
                                    saved.email !== account.email
                                );

                              setSavedAccounts(
                                updatedAccounts
                              );

                              localStorage.setItem(
                                "monnidropSavedAccounts",
                                JSON.stringify(updatedAccounts)
                              );

                            }}
                            style={{
                              ...removeSavedAccountButtonStyle,

                              background:
                                removeAccountHover === account.email
                                ? "#dc2626"
                                : "#fee2e2",

                              color:
                                removeAccountHover === account.email
                                ? "#ffffff"
                                : "#b91c1c",

                              transform:
                                removeAccountHover === account.email
                                ? "translateY(-2px)"
                                : "translateY(0)",

                              boxShadow:
                                removeAccountHover === account.email
                                ? "0 8px 18px rgba(220,38,38,0.30)"
                                : "none",

                              transition:"0.25s ease"
                            }}
                          >
                            Remove
                          </button>
                        </div>

                      ))}
                    </div>
                  )
                }

                <button
                  type="button"
                  onClick={()=>{

                    saveCurrentAccount();

                    signOut();

                  }}
                  onMouseEnter={()=>setAddAccountHover(true)}
                  onMouseLeave={()=>setAddAccountHover(false)}
                  style={{
                    ...mainButtonStyle,
                    background:addAccountHover
                      ? "linear-gradient(135deg,#0f172a,#1e40af)"
                      : "linear-gradient(135deg,#0f172a,#1d4ed8)",
                    transform:addAccountHover
                      ? "translateY(-2px)"
                      : "translateY(0)",
                    boxShadow:addAccountHover
                      ? "0 12px 26px rgba(29,78,216,0.30)"
                      : "none",
                    transition:"0.25s ease"
                  }}
                >
                  + Add new account
                </button>

              </InfoBox>
            )

           : selectedSetting === "Permissions" ? (
  <InfoBox>

    <div style={permissionHeroStyle}>
      <div style={permissionHeroIconStyle}>
        🔑
      </div>

      <div style={permissionHeroTextStyle}>
        Access certain device features with your permission
      </div>
    </div>

    <PermissionAllowedItem
      title="Camera"
      text="You can allow access to your camera in order to take photos for customer service feedback. If you want to turn off access to this device feature, you can go to settings."
    />

    <PermissionAllowedItem
      title="Notifications"
      text="Enable notifications to get updates on your orders. You can view and edit notifications on the notification page. If you want to turn off access to this device feature, you can go to settings."
    />

    <PermissionAllowedItem
      title="Live Activities"
      text="Live Activities provide real-time updates for order status, rider movement, payment status and delivery progress."
    />

    <div style={permissionLockedSectionStyle}>
      <div style={permissionLockIconStyle}>
        🔒
      </div>

      <div style={permissionLockedTitleStyle}>
        We DO NOT access the following device features
      </div>
    </div>

    <PermissionBlockedItem icon="🎙️" title="Microphone" />
    <PermissionBlockedItem icon="👤" title="Contacts" />
    <PermissionBlockedItem icon="ᛒ" title="Bluetooth" />
    <PermissionBlockedItem icon="📋" title="Clipboard" />

    <PermissionBlockedItem
      icon="📍"
      title="Location"
      text="MB Swift only uses location access when it is needed for delivery tracking, route updates and accurate order movement."
    />

    <PermissionBlockedItem
      icon="🖼️"
      title="Photos"
      text="MB Swift does not access your full photo library. You can still select specific photos when sending support images."
    />

    <PermissionBlockedItem
      icon="•••"
      title="Others"
      text="MB Swift does not request access to other device features such as calendar, reminders or unrelated personal device data."
    />

    <p style={permissionFooterTextStyle}>
      MB Swift believes in being transparent and requesting a minimal amount
      of permissions. You can learn more in the Privacy policy.
    </p>

  </InfoBox>
) 

           : selectedSetting === "Privacy" ? (
  <InfoBox>

    <div style={privacyTopRowStyle}>
      <div style={privacyRowTitleStyle}>
        Required cookies & technologies
      </div>

      <div style={privacyAlwaysOnStyle}>
        Always on
      </div>
    </div>

    <div style={privacySectionStyle}>
      <p style={privacyTextStyle}>
        For details on how we use your data, see our Privacy Policy and
        Cookie and Similar Technologies Policy.
      </p>
    </div>

    <div style={privacySectionStyle}>
      <div style={privacyRowTitleStyle}>
        Personalised advertised listing
      </div>

      <p style={privacyTextStyle}>
        If you choose to turn off personalised advertised listings,
        you will still continue to see listings, but they will no
        longer be tailored to your interests or interactions.
      </p>

      <PrivacyToggle
        enabled={privacyRecommendations}
        onClick={()=>{
          const nextValue =
            !privacyRecommendations;

          setPrivacyRecommendations(
            nextValue
          );

          localStorage.setItem(
            "monnidropPrivacyRecommendations",
            nextValue ? "true" : "false"
          );
        }}
      />
    </div>

    <div style={privacySectionTitleStyle}>
      Additional privacy options
    </div>

    <PrivacyLinkRow
      title="Privacy Policy"
      onClick={()=>setSelectedSetting("Privacy policy")}
    />

    <PrivacyLinkRow
      title="Delete your account"
      danger
      onClick={()=>{
        setSelectedSetting("Account security");
        setSecurityPanel("delete");
      }}
    />

  </InfoBox>
)

  : selectedSetting === "Account security" ? (
  <InfoBox>
    <div style={accountSecurityHeroStyle}>
      <div style={accountSecurityIconStyle}>🛡️</div>

      <div>
        <div style={accountSecurityTitleStyle}>
          Your account is protected
        </div>

        <div style={accountSecurityTextStyle}>
          Your MB Swift account is protected by secure login,
          account verification and delivery safety checks.
        </div>
      </div>
    </div>

    {securityMessage && (

          <div style={securitySuccessMessageStyle}>

            {securityMessage}

          </div>

        )}

    {!securityPanel && (
      <>
        <SecurityRow
          title="Mobile phone number"
          value={securityPhone || "No phone number added"}
          action={securityPhone ? "Edit" : "Add"}
          onClick={()=>openSecurityPanel("phone")}
        />

        <SecurityRow
          title="Email"
          value={securityEmail || "No email added"}
          action={securityEmail ? "Edit" : "Add"}
          onClick={()=>openSecurityPanel("email")}
        />

        <SecurityRow
          title="Password"
          value="Password is hidden for security"
          action="Edit"
          onClick={()=>openSecurityPanel("password")}
        />

        <SecurityRow
          title={`Two-factor authentication: ${twoFactorOn ? "On" : "Off"}`}
          value="Protect your account by adding an extra layer of security."
          action={twoFactorOn ? "Turn off" : "Turn on"}
          onClick={()=>{
            const nextValue = !twoFactorOn;
            setTwoFactorOn(nextValue);

            localStorage.setItem(
              "monnidropTwoFactorEnabled",
              nextValue ? "true" : "false"
            );

            setSecurityMessage(
              nextValue
              ? "✅ Two-factor authentication has been turned on."
              : "✅ Two-factor authentication has been turned off."
            );
          }}
        />

        <div style={securityGroupTitleStyle}>
          Third-party accounts
        </div>

       <SecurityRow
  title="Google"
  value={googleLinked ? "Linked" : "Not linked"}
  action={googleLinked ? "Unlink" : "Link"}
  onClick={()=>{
    if(googleLinked){
      setGoogleLinked(false);
      localStorage.setItem("monnidropGoogleLinked","false");
      setSecurityMessage("✅ Google account unlinked successfully.");
      return;
    }

    window.open(
      "https://accounts.google.com/",
      "_blank"
    );

    setGoogleLinked(true);
    localStorage.setItem("monnidropGoogleLinked","true");
    setSecurityMessage("✅ Google account linked successfully.");
  }}
/>

        <SecurityRow
  title="Facebook"
  value={facebookLinked ? "Linked" : "Not linked"}
  action={facebookLinked ? "Unlink" : "Link"}
  onClick={()=>{
    if(facebookLinked){
      setFacebookLinked(false);
      localStorage.setItem("monnidropFacebookLinked","false");
      setSecurityMessage("✅ Facebook account unlinked successfully.");
      return;
    }

    window.open(
      "https://www.facebook.com/login/",
      "_blank"
    );

    setFacebookLinked(true);
    localStorage.setItem("monnidropFacebookLinked","true");
    setSecurityMessage("✅ Facebook account linked successfully.");
  }}
/>

        <div style={securityGroupTitleStyle}>
          Account activity
        </div>

        <SecurityPlainRow
          title="Sign in activity"
          onClick={()=>openSecurityPanel("signin")}
        />

        <SecurityPlainRow
          title="Recent devices"
          onClick={()=>openSecurityPanel("devices")}
        />

        <SecurityPlainRow
          title="Trusted devices"
          onClick={()=>openSecurityPanel("trusted")}
        />

        <div style={securityGroupTitleStyle}>
          MB Swift security
        </div>

        <SecurityPlainRow
          title="Delivery verification OTP"
          onClick={()=>openSecurityPanel("otp")}
        />

        <SecurityPlainRow
          title="Payment protection"
          onClick={()=>openSecurityPanel("payment")}
        />

        <SecurityPlainRow
          title="Rider verification status"
          onClick={()=>openSecurityPanel("rider")}
        />

        <div style={securityGroupTitleStyle}>
          Security actions
        </div>

        <SecurityPlainRow
          title="Sign out from all devices"
          onClick={()=>{
            localStorage.removeItem("monnidropSavedAccounts");
            setSavedAccounts([]);

            setSecurityMessage(
              "✅ All saved accounts have been removed from this device."
            );
          }}
        />

        <SecurityPlainRow
          title="Delete your MB Swift account"
          danger
          onClick={()=>openSecurityPanel("delete")}
        />
      </>
    )}

   {securityPanel === "phone" && (
  <SecurityEditPage
    title="Edit mobile phone number"
    value={securityPhone}
    setValue={setSecurityPhone}
    placeholder="Enter phone number"
    buttonText="Save phone number"
    onBack={()=>setSecurityPanel("")}
    onSave={async()=>{

      if(!securityPhone.trim()){
        setSecurityMessage("Please enter a valid phone number.");
        return;
      }

      try{

        await API.put(
          "/customer/settings",
          {
            phoneNumber:securityPhone,
            phone:securityPhone
          }
        );

        setSecurityMessage("✅ Phone number updated successfully.");
        setSecurityPanel("");

      }catch(err){

        console.log("PHONE SAVE ERROR:", err);

        setSecurityMessage(
          err.response?.data?.message ||
          "Phone number update failed."
        );
      }

    }}
  />
)}

    {securityPanel === "email" && (
  <SecurityEditPage
    title="Edit email address"
    value={securityEmail}
    setValue={setSecurityEmail}
    placeholder="Enter email address"
    buttonText="Save email"
    onBack={()=>setSecurityPanel("")}
    onSave={()=>{

      setSecurityMessage(
        "For security, email changes must be verified before saving. We will add email verification next."
      );

      setSecurityPanel("");

    }}
  />
)}

    {securityPanel === "password" && (
  <SecurityEditPage
    title="Change password"
    value={securityPassword}
    setValue={setSecurityPassword}
    placeholder="Enter new password"
    type="password"
    buttonText="Save password"
    onBack={()=>setSecurityPanel("")}
    onSave={async()=>{

      if(securityPassword.length < 6){

        setSecurityMessage(
          "Password must be at least 6 characters."
        );

        return;
      }

      try{

        await API.put(
          "/customer/settings",
          {
            password:securityPassword
          }
        );

        setSecurityPassword("");

        setSecurityMessage(
          "✅ Password updated successfully."
        );

        setSecurityPanel("");

      }catch(err){

        setSecurityMessage(
          err.response?.data?.message ||
          "Password update failed."
        );
      }

    }}
  />
)}

{securityPanel === "signin" && (
  <SecurityReadPage
    title="Sign in activity"
    onBack={()=>setSecurityPanel("")}
    items={[
      ["Current device","Chrome on Windows • Active now"],
      ["Last login",new Date().toLocaleString()]
    ]}
  />
)}
    {securityPanel === "devices" && (
      <SecurityReadPage
        title="Recent devices"
        onBack={()=>setSecurityPanel("")}
        items={[
          ["Windows Desktop","Current device"],
          ["Mobile browser","Recently used device"]
        ]}
      />
    )}

    {securityPanel === "trusted" && (
      <SecurityReadPage
        title="Trusted devices"
        onBack={()=>setSecurityPanel("")}
        items={[
          ["This device","Trusted for faster login"]
        ]}
      />
    )}

    {securityPanel === "otp" && (
      <SecurityReadPage
        title="Delivery verification OTP"
        onBack={()=>setSecurityPanel("")}
   Back     items={[
          ["Delivery safety","MB Swift uses delivery OTP verification to confirm that packages are delivered to the correct customer before a delivery is completed."]
        ]}
      />
    )}

    {securityPanel === "payment" && (
      <SecurityReadPage
        title="Payment protection"
        onBack={()=>setSecurityPanel("")}
        items={[
          ["Payment safety","MB Swift protects payments by confirming payment status inside the app and helping customers avoid payments outside the platform."]
        ]}
      />
    )}

    {securityPanel === "rider" && (
      <SecurityReadPage
        title="Rider verification status"
        onBack={()=>setSecurityPanel("")}
        items={[
          ["Rider safety","MB Swift allows riders to be monitored and verified by admins. Customers can report suspicious delivery activity through support."]
        ]}
      />
    )}

   {securityPanel === "delete" && (
  <div style={securityPanelStyle}>
    <button
      type="button"
      onClick={()=>setSecurityPanel("")}
      style={securityPanelBackButtonStyle}
    >
      ← Back
    </button>

    <div style={securityPanelTitleStyle}>
      Delete your MB Swift account
    </div>

    <div
      style={{
        background:"#fef2f2",
        border:"1px solid #fecaca",
        borderRadius:"16px",
        padding:"16px",
        marginBottom:"18px"
      }}
    >
      <div
        style={{
          color:"#b91c1c",
          fontWeight:"900",
          fontSize:"16px",
          marginBottom:"10px"
        }}
      >
        Warning
      </div>

      <div
        style={{
          color:"#7f1d1d",
          lineHeight:"1.7",
          fontWeight:"700"
        }}
      >
        • Your account cannot be recovered after deletion.
        <br /><br />
        • Saved addresses will be removed.
        <br /><br />
        • Saved payment methods will be removed.
        <br /><br />
        • Delivery records may no longer be accessible.
        <br /><br />
        • Rider communication records may be removed.
      </div>
    </div>

    <label
      style={{
        display:"flex",
        alignItems:"center",
        gap:"10px",
        marginBottom:"20px",
        fontWeight:"800",
        cursor:"pointer"
      }}
    >
      <input
        type="checkbox"
        checked={deleteAccountConfirmed}
        onChange={(e)=>
          setDeleteAccountConfirmed(
            e.target.checked
          )
        }
      />

      I understand that deleting my account is permanent.
    </label>

    <button
      type="button"
      disabled={!deleteAccountConfirmed}
      onMouseEnter={()=>setDeleteAccountHover(true)}
      onMouseLeave={()=>setDeleteAccountHover(false)}
      onClick={()=>{
        localStorage.clear();
        window.location.href="/";
      }}
     style={{
  width:"100%",
  border:"none",
  borderRadius:"16px",
  padding:"16px",
  background:
    !deleteAccountConfirmed
    ? "#cbd5e1"
    : deleteAccountHover
    ? "#991b1b"
    : "#dc2626",
  color:"#ffffff",
  fontWeight:"900",
  fontSize:"16px",
  cursor:
    deleteAccountConfirmed
    ? "pointer"
    : "not-allowed",
  transform:
    deleteAccountConfirmed && deleteAccountHover
    ? "translateY(-2px)"
    : "translateY(0)",
  boxShadow:
    deleteAccountConfirmed && deleteAccountHover
    ? "0 12px 26px rgba(220,38,38,0.35)"
    : "none",
  transition:"0.25s ease"
}}
    >
      Delete My Account
    </button>
  </div>
)}
  </InfoBox>
)

            : selectedSetting === "Safety center" ? (
  <InfoBox>
    <div style={safetyHeroStyle}>
      <button
        type="button"
        onClick={() => setSelectedSetting("")}
        style={safetyBackStyle}
      >
        ←
      </button>

      <div>
        <div style={safetyHeroTitleStyle}>
          Safety center
        </div>

        <div style={safetyHeroTextStyle}>
          MB Swift is committed to creating a safe delivery environment.
          Learn how we protect your account, payments and personal information.
        </div>
      </div>

      <div style={safetyShieldStyle}>
        🛡️
      </div>
    </div>

    <div style={safetySectionTitleStyle}>
      We protect your information on MB Swift
    </div>

    <div style={safetyGridStyle}>
      {[
  "Data protection",
  "Account protection",
  "Payment protection"
].map((item)=>(
  <div
    key={item}
   onClick={()=>{
  if(item === "Data protection"){
    setSelectedSetting("Data protection");
  }

  if(item === "Account protection"){
    setSelectedSetting("Account protection");
  }

  if(item === "Payment protection"){
    setSelectedSetting("Payment protection");
  }
}}
    style={safetyCardStyle}
  >
    <div style={safetyIconStyle}>🔒</div>

    <div style={safetyCardTextStyle}>
      {item} ›
    </div>
  </div>
))}
    </div>

    <div style={safetySectionTitleStyle}>
      Stay safe from scammers
    </div>

    <div style={safetyGridStyle}>
     {[
  "Recognize scams",
  "Recognize scam emails",
  "Recognize scam messages"
].map((item)=>(
  <div
    key={item}
    onClick={()=>{
      if(item === "Recognize scams"){
        setSelectedSetting("Recognize scams");
      }

      if(item === "Recognize scam emails"){
        setSelectedSetting("Recognize scam emails");
      }

      if(item === "Recognize scam messages"){
        setSelectedSetting("Recognize scam messages");
      }
    }}
    style={safetyCardStyle}
  >
    <div style={safetyIconStyle}>⚠️</div>

    <div style={safetyCardTextStyle}>
      {item} ›
    </div>
  </div>
))}
    </div>

    <div style={safetySectionTitleStyle}>
      Report something suspicious
    </div>

    {[
  "Report a suspicious phone call, email or SMS/text message",
  "Report a fake website or app similar to MB Swift",
  "Report suspicious rider or delivery activity"
].map((item)=>(
  <div
    key={item}
    onClick={()=>{
      if(
        item ===
        "Report a suspicious phone call, email or SMS/text message"
      ){
      setSelectedSetting(
       "Suspicious report"
      );

      }

     if(
  item ===
  "Report a fake website or app similar to MB Swift"
){
  setSelectedSetting(
    "Fake website report"
  );
}

if(
  item ===
  "Report suspicious rider or delivery activity"
){
  setSelectedSetting(
    "Rider activity report"
  );
}

    }}
    style={safetyReportRowStyle}
  >
    <span>{item}</span>
    <span>›</span>
  </div>
))}

  </InfoBox>
)

: selectedSetting === "Rider activity report" ? (
  <InfoBox>
    <div style={articleHeaderStyle}>
      <button
        type="button"
        onClick={()=>setSelectedSetting("Safety center")}
        style={articleBackButtonStyle}
      >
        ←
      </button>

      <div style={articleTitleBarStyle}>
        Report something suspicious
      </div>
    </div>

    <div style={suspiciousFormBoxStyle}>
      <div style={suspiciousFormTitleStyle}>
        🔒 All data is safeguarded
      </div>

      <label style={suspiciousLabelStyle}>
        How did you receive the suspicious message?*
      </label>

      <select
        value={riderReportSource}
        onChange={(e)=>setRiderReportSource(e.target.value)}
        style={suspiciousInputStyle}
      >
        <option value="Facebook">Facebook</option>
        <option value="WhatsApp">WhatsApp</option>
        <option value="SMS">SMS</option>
        <option value="Phone call">Phone call</option>
        <option value="Inside MB Swift">Inside MB Swift</option>
        <option value="Others">Others</option>
      </select>

      <label style={suspiciousLabelStyle}>
        Enter the suspicious website link, rider name, phone number, or app name
      </label>

      <input
        value={riderReportLink}
        onChange={(e)=>setRiderReportLink(e.target.value)}
        placeholder="Enter link, rider name, phone number, or app name"
        style={suspiciousInputStyle}
      />

      <label style={suspiciousLabelStyle}>
        Has there been a loss of assets? If yes, please fill in the specific amount
      </label>

      <input
        value={riderReportLossAmount}
        onChange={(e)=>setRiderReportLossAmount(e.target.value)}
        placeholder="Example: GHS 30"
        style={suspiciousInputStyle}
      />

      <label style={suspiciousLabelStyle}>
        Summarize the suspicious activity in a few sentences*
      </label>

      <textarea
        value={riderReportSummary}
        onChange={(e)=>setRiderReportSummary(e.target.value)}
        placeholder="Share details about the rider, delivery issue, payment request, fake call, or suspicious activity."
        style={suspiciousTextAreaStyle}
      />

      <button
        type="button"
        onMouseEnter={()=>setRiderReportSubmitHover(true)}
        onMouseLeave={()=>setRiderReportSubmitHover(false)}
        onClick={()=>{
          alert("Suspicious rider or delivery report submitted.");
          setSelectedSetting("Safety center");
        }}
        style={{
          ...suspiciousSubmitButtonStyle,
          background:riderReportSubmitHover ? "#991b1b" : "#dc2626",
          transform:riderReportSubmitHover ? "translateY(-2px)" : "translateY(0)"
        }}
      >
        Submit
      </button>
    </div>
  </InfoBox>
)



: selectedSetting === "Fake website report" ? (
  <InfoBox>
    <div style={articleHeaderStyle}>
      <button
        type="button"
        onClick={()=>setSelectedSetting("Safety center")}
        style={articleBackButtonStyle}
      >
        ←
      </button>

      <div style={articleTitleBarStyle}>
        Report something suspicious
      </div>
    </div>

    <div style={suspiciousFormBoxStyle}>
      <div style={suspiciousFormTitleStyle}>
        🔒 All data is safeguarded
      </div>

      <label style={suspiciousLabelStyle}>
        Did you use a fake website or app?*
      </label>

      <select
        value={fakeSiteType}
        onChange={(e)=>setFakeSiteType(e.target.value)}
        style={suspiciousInputStyle}
      >
        <option value="Website">Website</option>
        <option value="App">App</option>
      </select>

      <label style={suspiciousLabelStyle}>
        Enter the suspicious website link or app name*
      </label>

      <input
        value={fakeSiteLink}
        onChange={(e)=>setFakeSiteLink(e.target.value)}
        placeholder="Enter website link or app name"
        style={suspiciousInputStyle}
      />

      <label style={suspiciousLabelStyle}>
        Did you submit any personal information?*
      </label>

      {[
        "I mentioned my MB Swift account information.",
        "I submitted my bank information.",
        "I submitted my personal email, phone number, or home address.",
        "I did not submit any information.",
        "Others"
      ].map((item)=>(
        <label
          key={item}
          style={fakeCheckboxRowStyle}
        >
          <input
            type="checkbox"
            checked={fakeSiteSubmittedInfo.includes(item)}
            onChange={(e)=>{

              if(e.target.checked){
                setFakeSiteSubmittedInfo([
                  ...fakeSiteSubmittedInfo,
                  item
                ]);
              }else{
                setFakeSiteSubmittedInfo(
                  fakeSiteSubmittedInfo.filter(
                    (saved)=>saved !== item
                  )
                );
              }
            }}
          />

          <span>{item}</span>
        </label>
      ))}

      <label style={suspiciousLabelStyle}>
        Has there been a loss of assets? If yes, please fill in the specific amount
      </label>

      <input
        value={fakeSiteLossAmount}
        onChange={(e)=>setFakeSiteLossAmount(e.target.value)}
        placeholder="Example: GHS 30"
        style={suspiciousInputStyle}
      />

      <label style={suspiciousLabelStyle}>
        Summarize the suspicious activity in a few sentences*
      </label>

      <textarea
        value={fakeSiteSummary}
        onChange={(e)=>setFakeSiteSummary(e.target.value)}
        placeholder="Share details like a website URL or app name that was provided. Do not include sensitive personal information."
        style={suspiciousTextAreaStyle}
      />

      <button
        type="button"
        onMouseEnter={()=>setFakeSiteSubmitHover(true)}
        onMouseLeave={()=>setFakeSiteSubmitHover(false)}
        onClick={()=>{
          alert("Fake website or app report submitted.");
          setSelectedSetting("Safety center");
        }}
        style={{
          ...suspiciousSubmitButtonStyle,
          background:fakeSiteSubmitHover ? "#991b1b" : "#dc2626",
          transform:fakeSiteSubmitHover ? "translateY(-2px)" : "translateY(0)"
        }}
      >
        Submit
      </button>
    </div>
  </InfoBox>
)

: selectedSetting === "Suspicious report" ? (
  <InfoBox>
    <div style={articleHeaderStyle}>
      <button
        type="button"
        onClick={()=>setSelectedSetting("Safety center")}
        style={articleBackButtonStyle}
      >
        ←
      </button>

      <div style={articleTitleBarStyle}>
        Report suspicious message
      </div>
    </div>

    <div style={suspiciousFormBoxStyle}>
      <div style={suspiciousFormTitleStyle}>
        Report suspicious phone call, email or SMS/text message
      </div>

      <label style={suspiciousLabelStyle}>
        How did you receive the suspicious message?*
      </label>

      <div style={suspiciousFieldRowStyle}>
        <select
          value={suspiciousReceiveMethod}
          onChange={(e)=>setSuspiciousReceiveMethod(e.target.value)}
          style={suspiciousInputStyle}
        >
          <option value="">Select method</option>
          <option value="Email">Email</option>
          <option value="SMS">SMS</option>
          <option value="Phone">Phone</option>
        </select>

        <button
          type="button"
          onClick={()=>setSuspiciousReceiveMethod("")}
          style={suspiciousCancelButtonStyle}
        >
          Cancel
        </button>
      </div>

      <label style={suspiciousLabelStyle}>
        Enter the suspicious email address*
      </label>

      <input
        value={suspiciousEmail}
        onChange={(e)=>setSuspiciousEmail(e.target.value)}
        placeholder="example@domain.com"
        style={suspiciousInputStyle}
      />

      <label style={suspiciousLabelStyle}>
        What platform did you receive the scam email on?*
      </label>

      <div style={suspiciousFieldRowStyle}>
        <select
          value={suspiciousPlatform}
          onChange={(e)=>setSuspiciousPlatform(e.target.value)}
          style={suspiciousInputStyle}
        >
          <option value="">Select platform</option>
          <option value="Gmail">Gmail</option>
          <option value="Yahoo">Yahoo</option>
          <option value="Outlook">Outlook</option>
          <option value="Hotmail">Hotmail</option>
          <option value="Live">Live</option>
          <option value="MSN">MSN</option>
          <option value="iCloud">iCloud</option>
          <option value="Others">Others</option>
        </select>

        <button
          type="button"
          onClick={()=>setSuspiciousPlatform("")}
          style={suspiciousCancelButtonStyle}
        >
          Cancel
        </button>
      </div>

      <label style={suspiciousLabelStyle}>
        Where did you find the suspicious email?*
      </label>

      <div style={suspiciousFieldRowStyle}>
        <select
          value={suspiciousLocation}
          onChange={(e)=>setSuspiciousLocation(e.target.value)}
          style={suspiciousInputStyle}
        >
          <option value="">Select location</option>
          <option value="In my inbox">In my inbox</option>
          <option value="In the spam folder">In the spam folder</option>
          <option value="Others">Others</option>
        </select>

        <button
          type="button"
          onClick={()=>setSuspiciousLocation("")}
          style={suspiciousCancelButtonStyle}
        >
          Cancel
        </button>
      </div>

      <label style={suspiciousLabelStyle}>
        When were you first contacted?*
      </label>

      <input
        type="date"
        value={suspiciousDate}
        onChange={(e)=>setSuspiciousDate(e.target.value)}
        style={suspiciousInputStyle}
      />

      <label style={suspiciousLabelStyle}>
        Summarize the suspicious activity in a few sentences*
      </label>

      <textarea
        value={suspiciousSummary}
        onChange={(e)=>setSuspiciousSummary(e.target.value)}
        placeholder="Explain what happened..."
        style={suspiciousTextAreaStyle}
      />

      <button
        type="button"
        onMouseEnter={()=>setSuspiciousSubmitHover(true)}
        onMouseLeave={()=>setSuspiciousSubmitHover(false)}
        onClick={()=>{
          alert("Suspicious activity report submitted.");
          setSelectedSetting("Safety center");
        }}
        style={{
          ...suspiciousSubmitButtonStyle,
          background:suspiciousSubmitHover ? "#991b1b" : "#dc2626",
          transform:suspiciousSubmitHover ? "translateY(-2px)" : "translateY(0)"
        }}
      >
        Submit
      </button>
    </div>
  </InfoBox>
)

: selectedSetting === "Recognize scams" ? (
  <InfoBox>
    <div style={articleHeaderStyle}>
      <button
        type="button"
        onClick={()=>setSelectedSetting("Safety center")}
        style={articleBackButtonStyle}
      >
        ←
      </button>

      <div style={articleTitleBarStyle}>
        Recognize scams
      </div>
    </div>

    <h1 style={articleMainTitleStyle}>
      Protect Yourself from Spam Text Messages and Phishing Scams
    </h1>

    <p style={articleParagraphStyle}>
      Be careful when someone asks you to make payment outside MB Swift,
      share your password, send OTP codes, or click unknown links.
    </p>

    <ul style={articleListStyle}>
      <li>Never share your password or OTP code.</li>
      <li>Do not pay outside MB Swift.</li>
      <li>Avoid suspicious links from unknown people.</li>
      <li>Report suspicious delivery activity to support.</li>
    </ul>
  </InfoBox>
)

: selectedSetting === "Recognize scam emails" ? (
  <InfoBox>
    <div style={articleHeaderStyle}>
      <button
        type="button"
        onClick={()=>setSelectedSetting("Safety center")}
        style={articleBackButtonStyle}
      >
        ←
      </button>

      <div style={articleTitleBarStyle}>
        Recognize scam emails
      </div>
    </div>

    <h1 style={articleMainTitleStyle}>
      How to identify scam emails
    </h1>

    <p style={articleParagraphStyle}>
      Scam emails may pretend to be from MB Swift and ask you to click links,
      confirm payments, reset your password, or share account details.
    </p>

    <ul style={articleListStyle}>
      <li>Check the sender email carefully.</li>
      <li>Do not click suspicious links.</li>
      <li>Do not share login details by email.</li>
      <li>Report suspicious emails to MB Swift support.</li>
    </ul>
  </InfoBox>
)

: selectedSetting === "Recognize scam messages" ? (
  <InfoBox>
    <div style={articleHeaderStyle}>
      <button
        type="button"
        onClick={()=>setSelectedSetting("Safety center")}
        style={articleBackButtonStyle}
      >
        ←
      </button>

      <div style={articleTitleBarStyle}>
        Recognize scam messages
      </div>
    </div>

    <h1 style={articleMainTitleStyle}>
      How to identify scam messages
    </h1>

    <p style={articleParagraphStyle}>
      Scam messages may come through SMS, WhatsApp, or social media claiming
      there is a delivery issue, payment problem, or account warning.
    </p>

    <ul style={articleListStyle}>
      <li>Do not send OTP codes through SMS or WhatsApp.</li>
      <li>Do not open unknown delivery links.</li>
      <li>Confirm order updates only inside MB Swift.</li>
      <li>Contact support if a message looks suspicious.</li>
    </ul>
  </InfoBox>
)

: selectedSetting === "Data protection" ? (
  <InfoBox>
    <div style={articleHeaderStyle}>
      <button
        type="button"
        onClick={()=>setSelectedSetting("Safety center")}
        style={articleBackButtonStyle}
      >
        ←
      </button>

      <div style={articleTitleBarStyle}>
        Data protection
      </div>
    </div>

    <h1 style={articleMainTitleStyle}>
      How MB Swift protects your data
    </h1>

    <p style={articleParagraphStyle}>
      MB Swift protects your personal data by using secure login sessions,
      controlled account access, and protected delivery records.
    </p>

    <ul style={articleListStyle}>
      <li>Your password is encrypted.</li>
      <li>Your delivery details are only used for active orders.</li>
      <li>Your support messages are used only to help resolve issues.</li>
      <li>Your personal details are not sold to third parties.</li>
    </ul>
  </InfoBox>
)

: selectedSetting === "Payment protection" ? (
  <InfoBox>
    <div style={articleHeaderStyle}>
      <button
        type="button"
        onClick={()=>setSelectedSetting("Safety center")}
        style={articleBackButtonStyle}
      >
        ←
      </button>

      <div style={articleTitleBarStyle}>
        Payment protection
      </div>
    </div>

    <h1 style={articleMainTitleStyle}>
      How MB Swift protects payments
    </h1>

    <p style={articleParagraphStyle}>
      MB Swift helps protect payments by tracking payment status,
      delivery cost, mobile money payment records, and cash settlement status.
    </p>

    <ul style={articleListStyle}>
      <li>Always confirm payment status inside MB Swift.</li>
      <li>Do not send money outside the app.</li>
      <li>Report suspicious payment requests to support.</li>
      <li>Admins can verify payment records when needed.</li>
    </ul>
  </InfoBox>
)

: selectedSetting === "Account protection" ? (
  <InfoBox>
    <div style={articleHeaderStyle}>
      <button
        type="button"
        onClick={() => setSelectedSetting("Safety center")}
        style={articleBackButtonStyle}
      >
        ←
      </button>

      <div style={articleTitleBarStyle}>
        How can I make my account more secure?
      </div>
    </div>

   <div style={articleSearchStyle}>
  <input
    value={supportSearch}
    onChange={(e)=>setSupportSearch(e.target.value)}
    onKeyDown={(e)=>{
      if(e.key === "Enter"){
        searchSupportArticle();
      }
    }}
    placeholder="Have any questions? Ask them here!"
    style={articleSearchInputStyle}
  />

  <button
    type="button"
    onClick={searchSupportArticle}
    style={articleSearchIconStyle}
  >
    ⌕
  </button>
</div>

{supportSearch && (
  <div style={searchSuggestionsBoxStyle}>
    {[
      "How can I make my account more secure?",
      "How do I protect my payment?",
      "How do I recognize scams?",
      "How do I report a fake rider?",
      "How do I avoid fake MB Swift links?"
    ]
      .filter((item)=>
        item.toLowerCase().includes(
          supportSearch.toLowerCase()
        )
      )
      .map((item)=>(
        <div
          key={item}
         onClick={()=>{
  setSupportSearch(item);

  const selectedText =
    item.toLowerCase();

  if(selectedText.includes("fake rider")){
    setSupportSearchResult(
      "To report a fake or suspicious rider, go to Contact us, open Live Chat Support, describe the rider and delivery issue, and attach a screenshot or photo if available."
    );
    return;
  }

  if(selectedText.includes("payment")){
    setSupportSearchResult(
      "For payment safety, always confirm your payment status inside MB Swift and avoid sending money outside the app."
    );
    return;
  }

  if(selectedText.includes("scam")){
    setSupportSearchResult(
      "Be careful with fake calls, suspicious links, and people asking for payments outside MB Swift."
    );
    return;
  }

  if(selectedText.includes("fake monnidrop links")){
    setSupportSearchResult(
      "Avoid opening suspicious MB Swift links. Only use the official MB Swift app or website. Report fake links through Contact us."
    );
    return;
  }

  setSupportSearchResult(
    "To make your account more secure, use a strong password, avoid reusing passwords, and enable two-factor authentication when available."
  );
}}
          style={searchSuggestionItemStyle}
        >
          {item}
        </div>
      ))}
  </div>
)}

{supportSearchResult && (
  <div style={articleSearchResultStyle}>
    {supportSearchResult}
  </div>
)}

    <h1 style={articleMainTitleStyle}>
      How can I make my account more secure?
    </h1>

    <p style={articleParagraphStyle}>
      To better protect your account, we recommend that you:
    </p>

    <p style={articleParagraphStyle}>
      <strong>1. Use a strong password</strong>
      <br />
      A strong password should be easy for you to remember but hard for others
      to guess. Best practices include:
    </p>

    <ul style={articleListStyle}>
      <li>Use at least eight characters, longer is better</li>
      <li>Include a mix of uppercase and lowercase letters, numbers, and symbols</li>
      <li>Don&apos;t reuse old passwords or passwords used on other sites</li>
      <li>Avoid dictionary words, keyboard patterns, birthdays, names, or company information</li>
    </ul>

    <p style={articleParagraphStyle}>
      <strong>2. Enable two-factor authentication (2FA)</strong>
      <br />
      2FA adds another layer of protection by asking for a verification code
      when you sign in. This helps ensure that only you can access your account.
    </p>

    <p style={articleParagraphStyle}>
      You can turn on 2FA in{" "}
      <strong>You &gt; Settings &gt; Account Security &gt; Two-factor Authentication.</strong>
    </p>

    <div style={helpfulBoxStyle}>
      {
  !feedbackMessage && (
    <div style={helpfulTextStyle}>
      Is this helpful for you?
    </div>
  )
}

     <div style={helpfulBoxStyle}>
  {
    feedbackMessage
    ? (
      <div style={feedbackSuccessStyle}>
        <span style={feedbackCheckStyle}>✓</span>
        <span>Thanks for your feedback!</span>
      </div>
    )
    : (
      <>
        <div style={helpfulButtonsStyle}>
          <button
            type="button"
            onClick={()=>{
              setFeedbackMessage("yes");
            }}
            style={helpfulButtonStyle}
          >
            👍 Yes
          </button>

          <button
            type="button"
            onClick={()=>{
              setFeedbackMessage("no");
            }}
            style={helpfulButtonStyle}
          >
            👎 No
          </button>
        </div>
      </>
    )
  }
</div>

    </div>
  </InfoBox>
)

            : selectedSetting === "Sign out" ? (
              <InfoBox>
                <div
                  style={{
                    fontSize:"20px",
                    fontWeight:"900",
                    color:"#0f172a",
                    marginBottom:"8px"
                  }}
                >
                  Sign out of MB Swift?
                </div>

                <p style={smallTextStyle}>
                  You are currently signed in as:
                </p>

                <div style={accountMiniCardStyle}>
                  <strong>{user?.name || "Customer"}</strong>
                  <span>{user?.email || "No email found"}</span>
                </div>

                <p style={smallTextStyle}>
                  You will need to log in again to access orders, messages,
                  payments and delivery updates.
                </p>

                <div style={signOutButtonRowStyle}>
                  <button
                    type="button"
                    onClick={closeSettings}
                    onMouseEnter={()=>setCancelHover(true)}
                    onMouseLeave={()=>setCancelHover(false)}
                    style={{
                      ...cancelButtonStyle,
                      background:cancelHover ? "#f1f5f9" : "#ffffff",
                      transform:cancelHover ? "translateY(-2px)" : "translateY(0)",
                      boxShadow:cancelHover
                        ? "0 8px 20px rgba(15,23,42,0.08)"
                        : "none",
                      transition:"0.25s ease"
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={signOut}
                    onMouseEnter={()=>setSignOutHover(true)}
                    onMouseLeave={()=>setSignOutHover(false)}
                    style={{
                      ...dangerButtonStyle,
                      background:signOutHover ? "#b91c1c" : "#dc2626",
                      transform:signOutHover ? "translateY(-2px)" : "translateY(0)",
                      boxShadow:signOutHover
                        ? "0 10px 24px rgba(220,38,38,0.35)"
                        : "none",
                      transition:"0.25s ease"
                    }}
                  >
                    Sign out
                  </button>
                </div>
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
    </div>
    </>
  );
}

function SecurityRow({title,value,action,onClick}) {
  return (
    <div
      onClick={onClick}
      style={securityRowStyle}
    >
      <div>
        <div style={securityRowTitleStyle}>
          {title}
        </div>

        {value && (
          <div style={securityRowValueStyle}>
            {value}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={(e)=>{
          e.stopPropagation();

          if(onClick){
            onClick();
          }
        }}
        style={securityActionButtonStyle}
      >
        {action}
      </button>
    </div>
  );
}

function SecurityPlainRow({title,danger,onClick}) {
  return (
    <div
      onClick={onClick}
      style={securityPlainRowStyle}
    >
      <div
        style={{
          ...securityPlainTextStyle,
          color:danger ? "#dc2626" : "#0f172a"
        }}
      >
        {title}
      </div>

      <div style={securityPlainArrowStyle}>
        ›
      </div>
    </div>
  );
}

function SecurityInfoItem({title,text}) {
  return (
    <div style={securityInfoItemStyle}>
      <div style={securityInfoTitleStyle}>
        {title}
      </div>

      <div style={securityInfoTextStyle}>
        {text}
      </div>
    </div>
  );
}

function SecurityEditPage({
  title,
  value,
  setValue,
  placeholder,
  buttonText,
  onBack,
  onSave,
  type = "text"
}) {
  return (
    <div style={securityPanelStyle}>
      <button
        type="button"
        onClick={onBack}
        style={securityPanelBackButtonStyle}
      >
        ← Back
      </button>

      <div style={securityPanelTitleStyle}>
        {title}
      </div>

      <input
        type={type}
        value={value}
        onChange={(e)=>setValue(e.target.value)}
        placeholder={placeholder}
        style={securityInputStyle}
      />

      <button
        type="button"
        onClick={onSave}
        style={securitySaveButtonStyle}
      >
        {buttonText}
      </button>
    </div>
  );
}

function SecurityReadPage({title,onBack,items}) {
  return (
    <div style={securityPanelStyle}>
      <button
        type="button"
        onClick={onBack}
        style={securityPanelBackButtonStyle}
      >
        ← Back
      </button>

      <div style={securityPanelTitleStyle}>
        {title}
      </div>

      {items.map((item,index)=>(
        <SecurityInfoItem
          key={index}
          title={item[0]}
          text={item[1]}
        />
      ))}
    </div>
  );
}

function PermissionAllowedItem({title,text}) {
  return (
    <div style={permissionAllowedItemStyle}>
      <div style={permissionAllowedTopStyle}>
        <div style={permissionAllowedTitleStyle}>
          {title}
        </div>

        <div style={permissionAllowedBadgeStyle}>
          Allowed
        </div>
      </div>

      <div style={permissionAllowedTextStyle}>
        {text}{" "}
        <button
  type="button"
  onClick={()=>{

    if(
      /Android/i.test(
        navigator.userAgent
      )
    ){

      window.location.href =
        "intent:#Intent;action=android.settings.SETTINGS;end";

      return;
    }

    alert(
      "Open your device Settings app and manage permissions for MB Swift."
    );

  }}
  style={permissionSettingsLinkStyle}
>
  go to settings ›
</button>
      </div>
    </div>
  );
}

function PermissionBlockedItem({icon,title,text}) {
  return (
    <div style={permissionBlockedItemStyle}>
      <div style={permissionBlockedTopStyle}>
        <div style={permissionBlockedLeftStyle}>
          <span style={permissionBlockedIconStyle}>
            {icon}
          </span>

          <span style={permissionBlockedTitleStyle}>
            {title}
          </span>
        </div>

        <span style={permissionNoAccessStyle}>
          ⊘
        </span>
      </div>

      {text && (
        <div style={permissionBlockedTextStyle}>
          {text}
        </div>
      )}
    </div>
  );
}

function PrivacyToggle({enabled,onClick}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...privacyToggleStyle,
        background:enabled ? "#16a34a" : "#cbd5e1"
      }}
    >
      <span
        style={{
          ...privacyToggleDotStyle,
          left:enabled ? "25px" : "4px"
        }}
      />
    </button>
  );
}

function PrivacyLinkRow({title,onClick,danger}) {
  return (
    <div
      onClick={onClick}
      style={privacyLinkRowStyle}
    >
      <div
        style={{
          ...privacyLinkTextStyle,
          color:danger ? "#dc2626" : "#0f172a"
        }}
      >
        {title}
      </div>

      <div style={privacyArrowStyle}>
        ›
      </div>
    </div>
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
  color:"#1d4ed8"
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

const contactCardStyle = {
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  gap:"14px",
  background:"#ffffff",
  border:"1px solid #e5e7eb",
  borderRadius:"16px",
  padding:"16px",
  marginBottom:"12px",
  boxShadow:"0 6px 16px rgba(15,23,42,0.04)"
};

const contactTitleStyle = {
  fontSize:"16px",
  fontWeight:"900",
  color:"#0f172a",
  marginBottom:"4px"
};

const contactTextStyle = {
  fontSize:"13px",
  fontWeight:"600",
  color:"#64748b",
  lineHeight:"1.5"
};

const contactButtonStyle = {
  minWidth:"78px",
  border:"none",
  borderRadius:"13px",
  padding:"11px 14px",
  background:"linear-gradient(135deg,#0f172a,#1d4ed8)",
  color:"#facc15",
  fontSize:"13px",
  fontWeight:"900",
  cursor:"pointer"
};

const contactFooterStyle = {
  marginTop:"14px",
  fontSize:"13px",
  fontWeight:"700",
  color:"#64748b",
  textAlign:"center"
};

const supportChatBoxStyle = {
  marginTop:"14px",
  padding:"16px",
  paddingBottom:"22px",
  borderRadius:"18px",
  background:"#ffffff",
  border:"1px solid #dbeafe"
};

const supportChatWindowStyle = {
  minHeight:"340px",
  maxHeight:"420px",
  overflowY:"auto",
  background:"#f8fafc",
  border:"1px solid #e5e7eb",
  borderRadius:"16px",
  padding:"12px",
  paddingBottom:"20px",
  marginBottom:"14px"
};

const supportBubbleStyle = {
  background:"#dcfce7",
  color:"#0f172a",
  padding:"10px 12px",
  borderRadius:"14px",
  marginBottom:"8px",
  fontSize:"14px",
  fontWeight:"700",
  position:"relative",
  overflow:"hidden",
  wordBreak:"break-word"
};

const customerBubbleStyle = {
  background:"#dbeafe",
  color:"#0f172a",
  padding:"10px 12px",
  borderRadius:"14px",
  marginBottom:"8px",
  fontSize:"14px",
  fontWeight:"700",
  position:"relative",
  overflow:"hidden",
  wordBreak:"break-word"
};

const supportInputStyle = {
  minWidth:0,
  height:"38px",
  padding:"0 12px",
  borderRadius:"14px",
  border:"1px solid #e5e7eb",
  outline:"none",
  fontWeight:"700"
};

const supportSendButtonStyle = {
  width:"72px",
  height:"38px",
  border:"none",
  borderRadius:"13px",
  padding:"11px 14px",
  background:"linear-gradient(135deg,#0f172a,#1d4ed8)",
  color:"#facc15",
  fontSize:"13px",
  fontWeight:"900",
  cursor:"pointer"
};

const chatDateStyle = {
  width:"fit-content",
  margin:"10px auto 12px",
  padding:"6px 12px",
  borderRadius:"999px",
  background:"#e2e8f0",
  color:"#334155",
  fontSize:"12px",
  fontWeight:"900"
};

const messageTimeStyle = {
  marginTop:"6px",
  fontSize:"11px",
  fontWeight:"800",
  color:"#64748b",
  textAlign:"right",
  display:"block",
  position:"static"
};

const accountMiniCardStyle = {
  background:"#ffffff",
  border:"1px solid #e5e7eb",
  borderRadius:"14px",
  padding:"10px 14px",
  margin:"8px 0 12px",
  display:"flex",
  flexDirection:"column",
  gap:"5px",
  color:"#0f172a"
};

const signOutButtonRowStyle = {
  display:"grid",
  gridTemplateColumns:"1fr 1fr",
  gap:"10px",
  marginTop:"10px"
};

const cancelButtonStyle = {
  width:"100%",
  padding:"14px",
  borderRadius:"10px",
  border:"1px solid #cbd5e1",
  background:"#ffffff",
  color:"#0f172a",
  fontSize:"15px",
  fontWeight:"900",
  cursor:"pointer"
};

const notificationCardStyle = {
  background:"#ffffff",
  border:"1px solid #e5e7eb",
  borderRadius:"18px",
  padding:"16px",
  marginBottom:"12px",
  boxShadow:"0 6px 16px rgba(15,23,42,0.04)"
};

const notificationTopRowStyle = {
  display:"flex",
  alignItems:"center",
  gap:"14px"
};

const notificationIconStyle = {
  width:"48px",
  height:"48px",
  borderRadius:"50%",
  background:"#eff6ff",
  color:"#1d4ed8",
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  fontSize:"22px",
  flexShrink:0
};

const notificationTitleStyle = {
  fontSize:"17px",
  fontWeight:"900",
  color:"#0f172a",
  marginBottom:"4px"
};

const notificationTextStyle = {
  fontSize:"14px",
  fontWeight:"600",
  color:"#64748b",
  lineHeight:"1.4"
};

const notificationEditButtonStyle = {
  minWidth:"86px",
  border:"1px solid #1d4ed8",
  borderRadius:"12px",
  padding:"9px 16px",
  background:"#ffffff",
  color:"#1d4ed8",
  fontSize:"14px",
  fontWeight:"900",
  cursor:"pointer",
  flexShrink:0
};

const notificationArrowStyle = {
  color:"#334155",
  fontSize:"22px",
  display:"flex",
  alignItems:"center",
  justifyContent:"center"
};

const notificationToggleBoxStyle = {
  marginTop:"14px",
  padding:"12px",
  background:"#f8fafc",
  border:"1px solid #e5e7eb",
  borderRadius:"14px",
  display:"grid",
  gap:"10px"
};

const notificationToggleRowStyle = {
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  fontSize:"14px",
  fontWeight:"900",
  color:"#0f172a"
};

const notificationToggleTextStyle = {
  letterSpacing:"0.5px"
};

const notificationSwitchStyle = {
  width:"42px",
  height:"23px",
  borderRadius:"999px",
  cursor:"pointer",
  position:"relative",
  transition:"0.25s ease"
};

const notificationSwitchDotStyle = {
  width:"17px",
  height:"17px",
  borderRadius:"50%",
  background:"#ffffff",
  position:"absolute",
  top:"3px",
  transition:"0.25s ease",
  boxShadow:"0 2px 8px rgba(0,0,0,0.15)"
};

const resetNotificationButtonStyle = {
  border:"none",
  borderRadius:"14px",
  padding:"12px 22px",
  background:"#dc2626",
  color:"#ffffff",
  fontSize:"14px",
  fontWeight:"900",
  cursor:"pointer"
};

const switchAccountCardStyle = {
  display:"flex",
  alignItems:"center",
  gap:"14px",
  background:"#ffffff",
  border:"1px solid #e5e7eb",
  borderRadius:"18px",
  padding:"14px",
  margin:"12px 0 16px",
  boxShadow:"0 8px 18px rgba(15,23,42,0.05)"
};

const switchAccountAvatarStyle = {
  width:"52px",
  height:"52px",
  borderRadius:"50%",
  background:"linear-gradient(135deg,#0f172a,#1d4ed8)",
  color:"#facc15",
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  fontSize:"22px",
  fontWeight:"900",
  flexShrink:0
};

const switchAccountNameStyle = {
  fontSize:"17px",
  fontWeight:"900",
  color:"#0f172a",
  marginBottom:"3px"
};

const switchAccountEmailStyle = {
  fontSize:"13px",
  fontWeight:"700",
  color:"#64748b",
  wordBreak:"break-word"
};

const activeAccountBadgeStyle = {
  display:"inline-flex",
  marginTop:"8px",
  padding:"6px 10px",
  borderRadius:"999px",
  background:"#dcfce7",
  color:"#166534",
  fontSize:"12px",
  fontWeight:"900"
};

const switchSectionTitleStyle = {
  fontSize:"15px",
  fontWeight:"900",
  color:"#0f172a",
  margin:"14px 0 8px"
};

const savedAccountEmptyStyle = {
  background:"#f8fafc",
  border:"1px dashed #cbd5e1",
  borderRadius:"14px",
  padding:"12px",
  color:"#64748b",
  fontSize:"13px",
  fontWeight:"700",
  textAlign:"center",
  marginBottom:"14px"
};

const savedAccountCardStyle = {
  display:"flex",
  alignItems:"center",
  gap:"12px",
  background:"#ffffff",
  border:"1px solid #e5e7eb",
  borderRadius:"16px",
  padding:"12px",
  marginBottom:"10px",
  boxShadow:"0 6px 14px rgba(15,23,42,0.04)"
};

const savedAccountAvatarStyle = {
  width:"42px",
  height:"42px",
  borderRadius:"50%",
  background:"#eff6ff",
  color:"#1d4ed8",
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  fontSize:"18px",
  fontWeight:"900",
  flexShrink:0
};

const savedAccountNameStyle = {
  fontSize:"14px",
  fontWeight:"900",
  color:"#0f172a",
  marginBottom:"2px"
};

const savedAccountEmailStyle = {
  fontSize:"12px",
  fontWeight:"700",
  color:"#64748b",
  wordBreak:"break-word"
};

const removeSavedAccountButtonStyle = {
  border:"none",
  borderRadius:"12px",
  padding:"8px 10px",
  background:"#fee2e2",
  color:"#b91c1c",
  fontSize:"12px",
  fontWeight:"900",
  cursor:"pointer",
  flexShrink:0
};

const uploadSmallButtonStyle = {
  width:"38px",
  height:"38px",
  border:"none",
  borderRadius:"13px",
  padding:"0",
  background:"#f1f5f9",
  color:"#0f172a",
  fontSize:"16px",
  fontWeight:"900",
  cursor:"pointer",
  display:"flex",
  alignItems:"center",
  justifyContent:"center"
};

const securityGridStyle = {
  display:"grid",
  gridTemplateColumns:"repeat(2,1fr)",
  gap:"14px",
  marginBottom:"22px"
};

const securityCardStyle = {
  background:"#ffffff",
  border:"1px solid #e5e7eb",
  borderRadius:"16px",
  padding:"18px",
  display:"flex",
  alignItems:"center",
  gap:"12px",
  cursor:"pointer",
  boxShadow:"0 6px 16px rgba(15,23,42,0.04)"
};

const securityIconStyle = {
  width:"48px",
  height:"48px",
  borderRadius:"15px",
  background:"linear-gradient(135deg,#0f172a,#1d4ed8)",
  color:"#facc15",
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  fontSize:"24px",
  flexShrink:0
};

const securityTextStyle = {
  flex:1,
  fontSize:"18px",
  fontWeight:"900",
  color:"#0f172a",
};

const securityArrowStyle = {
  fontSize:"28px",
  color:"#facc15",
  fontWeight:"700"
};

const safetyHeroStyle = {
  background:"linear-gradient(135deg,#15803d,#22c55e)",
  color:"#ffffff",
  borderRadius:"20px",
  padding:"18px",
  marginBottom:"18px",
  display:"flex",
  alignItems:"center",
  justifyContent:"space-between",
  gap:"12px"
};

const safetyBackStyle = {
  border:"none",
  background:"transparent",
  color:"#ffffff",
  fontSize:"24px",
  fontWeight:"900",
  cursor:"pointer"
};

const safetyHeroTitleStyle = {
  color:"#1d4ed8"
};

const safetyHeroTextStyle = {
  fontSize:"14px",
  fontWeight:"700",
  lineHeight:"1.45",
  maxWidth:"360px"
};

const safetyShieldStyle = {
  fontSize:"38px",
  flexShrink:0
};

const safetySectionTitleStyle = {
  fontSize:"20px",
  fontWeight:"900",
  color:"#0f172a",
  margin:"18px 0 12px"
};

const safetyGridStyle = {
  display:"grid",
  gridTemplateColumns:"repeat(3,1fr)",
  gap:"10px",
  marginBottom:"18px"
};

const safetyCardStyle = {
  background:"#ffffff",
  border:"1px solid #e5e7eb",
  borderRadius:"14px",
  minHeight:"110px",
  padding:"12px",
  display:"flex",
  flexDirection:"column",
  alignItems:"center",
  justifyContent:"center",
  textAlign:"center",
  boxShadow:"0 4px 12px rgba(15,23,42,0.04)"
};

const safetyIconStyle = {
  fontSize:"26px",
  marginBottom:"8px"
};

const safetyCardTextStyle = {
  fontSize:"14px",
  fontWeight:"900",
  color:"#0f172a",
  lineHeight:"1.25"
};

const safetyReportRowStyle = {
  background:"#ffffff",
  border:"1px solid #e5e7eb",
  borderRadius:"14px",
  padding:"14px",
  marginBottom:"10px",
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  gap:"12px",
  fontSize:"14px",
  fontWeight:"800",
  color:"#0f172a"
};

const articleBackButtonStyle = {
  border:"none",
  background:"transparent",
  color:"#0f172a",
  fontSize:"26px",
  fontWeight:"900",
  cursor:"pointer"
};

const articleSearchStyle = {
  border:"2px solid #0f172a",
  borderRadius:"999px",
  padding:"8px 10px 8px 14px",
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  gap:"10px",
  color:"#94a3b8",
  fontSize:"13px",
  fontWeight:"700",
  marginBottom:"18px"
};

const articleSearchIconStyle = {
  width:"36px",
  height:"36px",
  borderRadius:"50%",
  background:"#000000",
  color:"#ffffff",
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  fontSize:"22px",
  fontWeight:"900",
  flexShrink:0,
  cursor:"pointer"
};

const articleMainTitleStyle = {
  fontSize:"24px",
  fontWeight:"900",
  color:"#0f172a",
  lineHeight:"1.2",
  margin:"0 0 14px"
};

const articleParagraphStyle = {
  fontSize:"14px",
  fontWeight:"600",
  color:"#111827",
  lineHeight:"1.55",
  margin:"0 0 12px"
};

const articleListStyle = {
  fontSize:"13px",
  fontWeight:"600",
  color:"#111827",
  lineHeight:"1.6",
  paddingLeft:"20px",
  margin:"0 0 14px"
};

const articleHeaderStyle = {
  display:"flex",
  alignItems:"center",
  gap:"10px",
  marginBottom:"14px"
};

const helpfulBoxStyle = {
  marginTop:"20px",
  borderTop:"1px solid #e5e7eb",
  paddingTop:"16px",
  textAlign:"center"
};

const helpfulTextStyle = {
  fontSize:"15px",
  fontWeight:"700",
  color:"#94a3b8",
  marginBottom:"12px"
};

const helpfulButtonsStyle = {
  display:"grid",
  gridTemplateColumns:"1fr 1fr",
  gap:"10px"
};

const helpfulButtonStyle = {
  border:"1px solid #e5e7eb",
  borderRadius:"999px",
  padding:"10px",
  background:"#ffffff",
  color:"#0f172a",
  fontSize:"14px",
  fontWeight:"900",
  cursor:"pointer"
};

const articleTitleBarStyle = {
  fontSize:"18px",
  fontWeight:"900",
  color:"#0f172a",
  whiteSpace:"nowrap",
  overflow:"hidden",
  textOverflow:"ellipsis"
};

const articleSearchInputStyle = {
  flex:1,
  border:"none",
  outline:"none",
  background:"transparent",
  color:"#0f172a",
  fontSize:"13px",
  fontWeight:"800",
  minWidth:0
};

const articleSearchResultStyle = {
  background:"#eff6ff",
  border:"1px solid #bfdbfe",
  color:"#0f172a",
  borderRadius:"14px",
  padding:"12px",
  marginBottom:"16px",
  fontSize:"13px",
  fontWeight:"800",
  lineHeight:"1.5"
};

const searchSuggestionsBoxStyle = {
  background:"#ffffff",
  border:"1px solid #e5e7eb",
  borderRadius:"14px",
  overflow:"hidden",
  marginBottom:"14px",
  boxShadow:"0 8px 18px rgba(15,23,42,0.06)"
};

const searchSuggestionItemStyle = {
  padding:"12px 14px",
  borderBottom:"1px solid #eef2f7",
  color:"#0f172a",
  fontSize:"13px",
  fontWeight:"800",
  cursor:"pointer"
};

const feedbackMessageStyle = {
  marginTop:"14px",
  background:"#dcfce7",
  color:"#166534",
  border:"1px solid #86efac",
  borderRadius:"999px",
  padding:"10px 14px",
  fontSize:"14px",
  fontWeight:"900",
  textAlign:"center"
};

const feedbackSuccessStyle = {
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  gap:"14px",
  padding:"24px 10px",
  color:"#8a8a8a",
  fontSize:"24px",
  fontWeight:"700"
};

const feedbackCheckStyle = {
  width:"46px",
  height:"46px",
  border:"3px solid #15803d",
  borderRadius:"50%",
  display:"inline-flex",
  alignItems:"center",
  justifyContent:"center",
  color:"#0f172a",
  fontSize:"30px",
  fontWeight:"900"
};

const accountSecurityHeroStyle = {
  display:"flex",
  alignItems:"center",
  gap:"18px",
  padding:"18px 0 22px",
  borderBottom:"1px solid #e5e7eb",
  marginBottom:"12px"
};

const accountSecurityIconStyle = {
  width:"64px",
  height:"64px",
  borderRadius:"50%",
  background:"#dcfce7",
  color:"#15803d",
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  fontSize:"32px",
  flexShrink:0
};

const accountSecurityTitleStyle = {
  fontSize:"22px",
  fontWeight:"900",
  color:"#15803d",
  marginBottom:"6px"
};

const accountSecurityTextStyle = {
  fontSize:"15px",
  fontWeight:"700",
  color:"#64748b",
  lineHeight:"1.5"
};

const securityRowStyle = {
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  gap:"14px",
  padding:"18px 0",
  borderBottom:"1px solid #e5e7eb"
};

const securityRowTitleStyle = {
  fontSize:"18px",
  fontWeight:"900",
  color:"#0f172a",
  marginBottom:"4px"
};

const securityRowValueStyle = {
  fontSize:"14px",
  fontWeight:"700",
  color:"#64748b",
  lineHeight:"1.4"
};

const securityActionButtonStyle = {
  minWidth:"88px",
  border:"none",
  borderRadius:"999px",
  padding:"10px 16px",
  background:"#f97316",
  color:"#ffffff",
  fontSize:"14px",
  fontWeight:"900",
  cursor:"pointer"
};

const securityGroupTitleStyle = {
  fontSize:"19px",
  fontWeight:"900",
  color:"#0f172a",
  margin:"24px 0 8px"
};

const securityPlainRowStyle = {
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  padding:"18px 0",
  borderBottom:"1px solid #e5e7eb",
  cursor:"pointer"
};

const securityPlainTextStyle = {
  fontSize:"17px",
  fontWeight:"800"
};

const securityPlainArrowStyle = {
  fontSize:"28px",
  color:"#94a3b8"
};

const securitySuccessMessageStyle = {
  marginTop:"16px",
  background:"#dcfce7",
  color:"#166534",
  border:"1px solid #86efac",
  borderRadius:"14px",
  padding:"12px",
  fontSize:"14px",
  fontWeight:"900",
  textAlign:"center"
};

const securityPanelStyle = {
  marginTop:"18px",
  background:"#ffffff",
  border:"1px solid #e5e7eb",
  borderRadius:"18px",
  padding:"16px",
  boxShadow:"0 8px 18px rgba(15,23,42,0.05)"
};

const securityPanelBackButtonStyle = {
  border:"none",
  background:"transparent",
  color:"#1d4ed8",
  fontSize:"14px",
  fontWeight:"900",
  cursor:"pointer",
  marginBottom:"12px"
};

const securityPanelTitleStyle = {
  fontSize:"20px",
  fontWeight:"900",
  color:"#0f172a",
  marginBottom:"12px"
};

const securityInputStyle = {
  width:"100%",
  padding:"13px",
  border:"1px solid #cbd5e1",
  borderRadius:"14px",
  outline:"none",
  fontSize:"14px",
  fontWeight:"800",
  marginBottom:"12px",
  boxSizing:"border-box"
};

const securitySaveButtonStyle = {
  width:"100%",
  border:"none",
  borderRadius:"14px",
  padding:"13px",
  background:"linear-gradient(135deg,#0f172a,#1d4ed8)",
  color:"#facc15",
  fontSize:"14px",
  fontWeight:"900",
  cursor:"pointer"
};

const securityPanelTextStyle = {
  fontSize:"14px",
  fontWeight:"700",
  color:"#334155",
  lineHeight:"1.6",
  margin:"0"
};

const securityInfoItemStyle = {
  background:"#f8fafc",
  border:"1px solid #e5e7eb",
  borderRadius:"14px",
  padding:"13px",
  marginBottom:"10px"
};

const securityInfoTitleStyle = {
  fontSize:"15px",
  fontWeight:"900",
  color:"#0f172a",
  marginBottom:"4px"
};

const securityInfoTextStyle = {
  fontSize:"13px",
  fontWeight:"700",
  color:"#64748b",
  lineHeight:"1.5"
};

const privacyTopRowStyle = {
  display:"flex",
  justifyContent:"space-between",
  alignItems:"flex-start",
  gap:"16px",
  padding:"18px 0",
  borderBottom:"1px solid #e5e7eb"
};

const privacyRowTitleStyle = {
  fontSize:"16px",
  fontWeight:"900",
  color:"#0f172a",
  marginBottom:"6px"
};

const privacySmallTextStyle = {
  fontSize:"12px",
  fontWeight:"700",
  color:"#94a3b8",
  lineHeight:"1.5"
};

const privacyAlwaysOnStyle = {
  fontSize:"16px",
  fontWeight:"800",
  color:"#64748b",
  whiteSpace:"nowrap"
};

const privacySectionStyle = {
  padding:"20px 0",
  borderBottom:"1px solid #e5e7eb"
};

const privacyTextStyle = {
  margin:"0 0 12px",
  fontSize:"12px",
  fontWeight:"700",
  color:"#94a3b8",
  lineHeight:"1.5"
};

const privacyToggleStyle = {
  width:"52px",
  height:"30px",
  border:"none",
  borderRadius:"999px",
  position:"relative",
  cursor:"pointer",
  transition:"0.25s ease"
};

const privacyToggleDotStyle = {
  width:"22px",
  height:"22px",
  borderRadius:"50%",
  background:"#ffffff",
  position:"absolute",
  top:"4px",
  transition:"0.25s ease",
  boxShadow:"0 2px 8px rgba(0,0,0,0.18)"
};

const privacySectionTitleStyle = {
  fontSize:"17px",
  fontWeight:"900",
  color:"#0f172a",
  margin:"20px 0 6px"
};

const privacyLinkRowStyle = {
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  padding:"18px 0",
  borderBottom:"1px solid #e5e7eb",
  cursor:"pointer"
};

const privacyLinkTextStyle = {
  fontSize:"17px",
  fontWeight:"800"
};

const privacyArrowStyle = {
  fontSize:"28px",
  color:"#94a3b8"
};

const privacyInfoBoxStyle = {
  marginTop:"16px",
  background:"#ffffff",
  border:"1px solid #e5e7eb",
  borderRadius:"16px",
  padding:"16px"
};

const privacyInfoTitleStyle = {
  fontSize:"18px",
  fontWeight:"900",
  color:"#0f172a",
  marginBottom:"8px"
};

const permissionHeroStyle = {
  textAlign:"center",
  padding:"18px 0 20px",
  borderBottom:"1px solid #e5e7eb",
  marginBottom:"18px"
};

const permissionHeroIconStyle = {
  width:"72px",
  height:"72px",
  borderRadius:"50%",
  background:"#ecfdf5",
  color:"#15803d",
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  margin:"0 auto 18px",
  fontSize:"34px"
};

const permissionHeroTextStyle = {
  fontSize:"14px",
  fontWeight:"900",
  color:"#15803d",
  lineHeight:"1.4"
};

const permissionAllowedTitleStyle = {
  fontSize:"15px",
  fontWeight:"900",
  color:"#0f172a"
};

const permissionAllowedTopStyle = {
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  gap:"12px",
  marginBottom:"8px"
};

const permissionAllowedBadgeStyle = {
  background:"#f97316",
  color:"#ffffff",
  borderRadius:"6px",
  padding:"3px 7px",
  fontSize:"11px",
  fontWeight:"900"
};

const permissionAllowedTextStyle = {
  fontSize:"12px",
  fontWeight:"700",
  color:"#737373",
  lineHeight:"1.6"
};

const permissionSettingsLinkStyle = {
  border:"none",
  background:"transparent",
  padding:"0",
  margin:"0",
  color:"#f97316",
  fontWeight:"900",
  fontSize:"12px",
  cursor:"pointer"
};

const permissionLockedSectionStyle = {
  textAlign:"center",
  padding:"28px 0 18px",
  marginTop:"10px"
};

const permissionLockIconStyle = {
  width:"72px",
  height:"72px",
  borderRadius:"50%",
  background:"#ecfdf5",
  color:"#15803d",
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  margin:"0 auto 16px",
  fontSize:"34px"
};

const permissionLockedTitleStyle = {
  fontSize:"14px",
  fontWeight:"900",
  color:"#15803d",
  lineHeight:"1.4"
};

const permissionBlockedItemStyle = {
  background:"#ffffff",
  border:"1px solid #e5e7eb",
  borderRadius:"8px",
  padding:"14px",
  marginBottom:"12px"
};

const permissionBlockedTopStyle = {
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  gap:"12px"
};

const permissionBlockedLeftStyle = {
  display:"flex",
  alignItems:"center",
  gap:"12px"
};

const permissionBlockedIconStyle = {
  fontSize:"24px",
  color:"#0f172a",
  width:"30px",
  display:"inline-flex",
  justifyContent:"center"
};

const permissionBlockedTitleStyle = {
  fontSize:"15px",
  fontWeight:"900",
  color:"#0f172a"
};

const permissionNoAccessStyle = {
  fontSize:"24px",
  color:"#ef4444",
  fontWeight:"900"
};

const permissionBlockedTextStyle = {
  marginTop:"8px",
  fontSize:"12px",
  fontWeight:"700",
  color:"#737373",
  lineHeight:"1.6"
};

const permissionFooterTextStyle = {
  fontSize:"12px",
  fontWeight:"700",
  color:"#737373",
  lineHeight:"1.6",
  marginTop:"16px"
};

const permissionAllowedItemStyle = {
  padding:"14px 0",
  borderBottom:"1px solid #e5e7eb"
};

const suspiciousFormBoxStyle = {
  background:"#ffffff",
  border:"1px solid #e5e7eb",
  borderRadius:"18px",
  padding:"18px",
  marginTop:"18px",
  boxShadow:"0 10px 24px rgba(15,23,42,0.06)"
};

const suspiciousFormTitleStyle = {
  fontSize:"18px",
  fontWeight:"900",
  color:"#0f172a",
  marginBottom:"16px"
};

const suspiciousLabelStyle = {
  display:"block",
  fontSize:"13px",
  fontWeight:"900",
  color:"#0f172a",
  margin:"12px 0 6px"
};

const suspiciousFieldRowStyle = {
  display:"grid",
  gridTemplateColumns:"1fr 82px",
  gap:"8px",
  alignItems:"center"
};

const suspiciousInputStyle = {
  width:"100%",
  height:"42px",
  border:"1px solid #cbd5e1",
  borderRadius:"12px",
  padding:"0 12px",
  fontSize:"13px",
  fontWeight:"800",
  color:"#0f172a",
  outline:"none",
  boxSizing:"border-box"
};

const suspiciousCancelButtonStyle = {
  height:"42px",
  border:"none",
  borderRadius:"12px",
  background:"#e5e7eb",
  color:"#0f172a",
  fontSize:"12px",
  fontWeight:"900",
  cursor:"pointer"
};

const suspiciousTextAreaStyle = {
  width:"100%",
  minHeight:"100px",
  border:"1px solid #cbd5e1",
  borderRadius:"12px",
  padding:"12px",
  fontSize:"13px",
  fontWeight:"800",
  color:"#0f172a",
  outline:"none",
  resize:"vertical",
  boxSizing:"border-box"
};

const suspiciousSubmitButtonStyle = {
  width:"100%",
  border:"none",
  borderRadius:"14px",
  padding:"14px",
  marginTop:"14px",
  color:"#ffffff",
  fontSize:"14px",
  fontWeight:"900",
  cursor:"pointer",
  transition:"0.25s ease"
};

const fakeCheckboxRowStyle = {
  display:"flex",
  alignItems:"flex-start",
  gap:"10px",
  fontSize:"13px",
  fontWeight:"800",
  color:"#0f172a",
  lineHeight:"1.5",
  margin:"10px 0"
};