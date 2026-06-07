import React from "react";
import { FiBell } from "react-icons/fi";

export default function CustomerNotifications({
  allNotifications = [],
  setActiveSection,
  setOpenChats,
  clearAllNotifications,
  markAllNotificationsRead
}) {

  const getNotificationTitle = (note) => {
    return (
      note.title ||
      note.sender ||
      "MB Swift Alert"
    );
  };

  const getNotificationMessage = (note) => {
    return (
      note.message ||
      note.text ||
      "You have a new notification."
    );
  };

  const getNotificationTime = (note) => {
    if(note.createdAt){
      return new Date(note.createdAt).toLocaleString();
    }

    return note.time || "Just now";
  };

  const getNotificationIcon = (note) => {
  if(note.type === "success"){
    return "✅";
  }

  if(note.type === "danger"){
    return "⚠️";
  }

  if(note.type === "status"){
    return "📦";
  }

  return <FiBell />;
};

  return (
    <>
      <div style={heroStyle}>
        <div style={heroContentStyle}>
          <div style={heroBadgeStyle}>
  <FiBell style={{marginRight:"6px"}} />
  Delivery Alerts
</div>

          <h1 style={heroTitleStyle}>
            Stay Updated Instantly
          </h1>

          <p style={heroTextStyle}>
            Track rider updates, order progress, messages,
            and important delivery alerts in one clean notification center.
          </p>
        </div>

        <div style={heroIconStyle}>
       <FiBell />
     </div>
      </div>

      <div
  style={{
    display:"flex",
    gap:"12px",
    marginBottom:"20px",
    flexWrap:"wrap"
  }}
>
  <button
    type="button"
    onClick={markAllNotificationsRead}
    style={{
      padding:"12px 18px",
      border:"none",
      borderRadius:"14px",
      background:"linear-gradient(135deg,#0f172a,#1d4ed8)",
      color:"#ffffff",
      fontWeight:"900",
      cursor:"pointer"
    }}
  >
    Mark All Read
  </button>

  <button
    type="button"
    onClick={clearAllNotifications}
    style={{
      padding:"12px 18px",
      border:"none",
      borderRadius:"14px",
      background:"#dc2626",
      color:"#ffffff",
      fontWeight:"900",
      cursor:"pointer"
    }}
  >
    Clear Notifications
  </button>
</div>

      {allNotifications.length === 0 ? (
        <div style={emptyStyle}>
          <div style={emptyIconStyle}>
  <FiBell />
</div>

          <div style={emptyTitleStyle}>
            No notifications yet
          </div>

          <div style={emptyTextStyle}>
            Delivery alerts, rider updates, and order messages will appear here.
          </div>
        </div>
      ) : (
        <div style={gridStyle}>
          {allNotifications.map((note,index)=>(
            <div
              key={note.id || index}
              onClick={()=>{
                if(note.orderId){
                  setActiveSection("orders");

                  setOpenChats((prev)=>({
                    ...prev,
                    [note.orderId]:true
                  }));
                }
              }}
              style={{
                ...cardStyle,
                cursor:note.orderId ? "pointer" : "default"
              }}
            >
              <div style={cardHeaderStyle}>
                <span style={iconBoxStyle}>
                  {getNotificationIcon(note)}
                </span>

                <div>
                  <div style={smallLabelStyle}>
                    Notification
                  </div>

                  <div style={titleStyle}>
                    {getNotificationTitle(note)}
                  </div>
                </div>
              </div>

              <div style={messageBoxStyle}>
                {getNotificationMessage(note)}
              </div>

              <div style={bottomRowStyle}>
                <div style={timeBadgeStyle}>
                  {getNotificationTime(note)}
                </div>

                {note.read === false && (
                  <div style={unreadBadgeStyle}>
                    New
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

const heroStyle = {
  position:"relative",
  overflow:"hidden",
  display:"flex",
  alignItems:"center",
  justifyContent:"space-between",
  gap:"24px",
  background:
    "radial-gradient(circle at top right, rgba(250,204,21,0.40), transparent 34%), linear-gradient(135deg,#0f172a,#1d4ed8)",
  color:"white",
  borderRadius:"26px",
  padding:"26px",
  marginBottom:"24px",
  border:"1px solid rgba(250,204,21,0.30)",
  boxShadow:"0 16px 34px rgba(29,78,216,0.20)"
};

const heroContentStyle = {
  position:"relative",
  zIndex:2,
  maxWidth:"650px"
};

const heroBadgeStyle = {
  display:"inline-flex",
  alignItems:"center",
  justifyContent:"center",
  padding:"8px 14px",
  borderRadius:"999px",
  background:"rgba(250,204,21,0.18)",
  color:"#facc15",
  border:"1px solid rgba(250,204,21,0.35)",
  fontSize:"13px",
  fontWeight:"900",
  marginBottom:"14px"
};

const heroTitleStyle = {
  fontSize:"32px",
  fontWeight:"900",
  lineHeight:"1.1",
  margin:"0 0 10px",
  color:"white",
  letterSpacing:"-0.6px"
};

const heroTextStyle = {
  maxWidth:"620px",
  color:"rgba(255,255,255,0.86)",
  fontSize:"15px",
  fontWeight:"600",
  lineHeight:"1.55",
  margin:0
};

const heroIconStyle = {
  position:"relative",
  zIndex:2,
  width:"86px",
  height:"86px",
  borderRadius:"26px",
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  background:"rgba(255,255,255,0.14)",
  border:"1px solid rgba(255,255,255,0.24)",
  fontSize:"38px",
  boxShadow:"0 14px 30px rgba(15,23,42,0.22)"
};

const emptyStyle = {
  background:"linear-gradient(135deg,#ffffff,#f8fafc)",
  border:"1px solid rgba(250,204,21,0.25)",
  boxShadow:"0 14px 30px rgba(15,23,42,0.08)",
  color:"#0f172a",
  fontWeight:"800",
  borderRadius:"22px",
  padding:"32px",
  textAlign:"center"
};

const emptyIconStyle = {
  fontSize:"42px",
  marginBottom:"12px"
};

const emptyTitleStyle = {
  fontSize:"20px",
  fontWeight:"900",
  marginBottom:"8px"
};

const emptyTextStyle = {
  fontSize:"14px",
  color:"#64748b",
  fontWeight:"700",
  lineHeight:"1.5"
};

const gridStyle = {
  display:"grid",
  gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",
  gap:"18px",
  width:"100%"
};

const cardStyle = {
  background:"linear-gradient(135deg,#ffffff,#f8fafc)",
  border:"1px solid rgba(250,204,21,0.25)",
  boxShadow:"0 14px 30px rgba(15,23,42,0.08)",
  borderRadius:"22px",
  padding:"22px"
};

const cardHeaderStyle = {
  display:"flex",
  alignItems:"center",
  gap:"10px",
  marginBottom:"14px"
};

const iconBoxStyle = {
  width:"38px",
  height:"38px",
  borderRadius:"14px",
  display:"inline-flex",
  alignItems:"center",
  justifyContent:"center",
  background:"linear-gradient(135deg,#0f172a,#1d4ed8)",
  color:"#facc15",
  fontSize:"18px",
  boxShadow:"0 10px 22px rgba(29,78,216,0.18)"
};

const smallLabelStyle = {
  fontSize:"12px",
  fontWeight:"900",
  color:"#64748b",
  textTransform:"uppercase",
  letterSpacing:"0.5px"
};

const titleStyle = {
  fontSize:"16px",
  fontWeight:"900",
  color:"#0f172a"
};

const messageBoxStyle = {
  background:"#fefce8",
  border:"1px solid #fde68a",
  borderRadius:"16px",
  padding:"14px",
  color:"#0f172a",
  fontWeight:"800",
  lineHeight:"1.5",
  marginBottom:"14px"
};

const bottomRowStyle = {
  display:"flex",
  alignItems:"center",
  justifyContent:"space-between",
  gap:"10px",
  flexWrap:"wrap"
};

const timeBadgeStyle = {
  display:"inline-flex",
  padding:"9px 16px",
  borderRadius:"999px",
  background:"linear-gradient(135deg,#facc15,#f59e0b)",
  color:"#0f172a",
  border:"1px solid rgba(15,23,42,0.10)",
  boxShadow:"0 8px 18px rgba(250,204,21,0.22)",
  fontSize:"12px",
  fontWeight:"900"
};

const unreadBadgeStyle = {
  display:"inline-flex",
  padding:"8px 13px",
  borderRadius:"999px",
  background:"#dcfce7",
  color:"#166534",
  fontSize:"12px",
  fontWeight:"900"
};