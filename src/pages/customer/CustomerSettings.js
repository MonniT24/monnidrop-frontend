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

  const [editingNotification,setEditingNotification] =
    React.useState("");

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

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

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

                <div style={lastUpdatedStyle}>
                  Version 1.0.0
                </div>

                <p style={smallTextStyle}>
                  MonniDrop is a modern delivery platform designed to connect
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
                  MonniDrop is built with a focus on convenience, transparency,
                  security and operational efficiency to help customers receive
                  their items quickly and reliably.
                </p>
              </InfoBox>
            )

            : selectedSetting === "Contact us" ? (
              <InfoBox>
                <div style={smallHeadingStyle}>
                  Contact MonniDrop
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
                      Speak directly with MonniDrop support.
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
                        "mailto:support@monnidrop.com?subject=MonniDrop Support Request";
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
                      Chat with MonniDrop support on WhatsApp.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={()=>{
                      window.open(
                        "https://wa.me/233244095101?text=Hello%20MonniDrop%20Support",
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
                        Hello 👋 Welcome to MonniDrop Customer support. How can we help you?
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
                  MonniDrop reserves the right to suspend or permanently disable accounts
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
                  The MonniDrop name, logo, branding, app design, platform features,
                  software and written content are protected intellectual property.
                </p>

                <p style={smallTextStyle}>
                  Users may not copy, reproduce, modify, distribute or commercially use
                  MonniDrop materials without permission.
                </p>

                <p style={smallTextStyle}>
                  Unauthorized use of MonniDrop branding, screenshots, code or business
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
                  Sign out of MonniDrop?
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