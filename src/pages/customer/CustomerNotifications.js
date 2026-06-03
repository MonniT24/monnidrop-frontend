import React from "react";

export default function CustomerNotifications({
  allNotifications,
  setActiveSection,
  setOpenChats
}) {
  return (
    <>
      <div
        style={{
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
        }}
      >
        <div
          style={{
            position:"relative",
            zIndex:2,
            maxWidth:"650px"
          }}
        >
          <div
            style={{
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
            }}
          >
            🔔 Delivery Alerts
          </div>

          <h1
            style={{
              fontSize:"32px",
              fontWeight:"900",
              lineHeight:"1.1",
              margin:"0 0 10px",
              color:"white",
              letterSpacing:"-0.6px"
            }}
          >
            Stay Updated Instantly
          </h1>

          <p
            style={{
              maxWidth:"620px",
              color:"rgba(255,255,255,0.86)",
              fontSize:"15px",
              fontWeight:"600",
              lineHeight:"1.55",
              margin:0
            }}
          >
            Track rider updates, order progress, messages,
            and important delivery alerts in one clean notification center.
          </p>
        </div>

        <div
          style={{
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
            fontSize:"42px",
            boxShadow:"0 14px 30px rgba(15,23,42,0.22)"
          }}
        >
          🔔
        </div>
      </div>

      {allNotifications.length === 0 ? (
        <div
          style={{
            background:"linear-gradient(135deg,#ffffff,#f8fafc)",
            border:"1px solid rgba(250,204,21,0.25)",
            boxShadow:"0 14px 30px rgba(15,23,42,0.08)",
            color:"#0f172a",
            fontWeight:"800",
            borderRadius:"22px",
            padding:"32px",
            textAlign:"center"
          }}
        >
          <div
            style={{
              fontSize:"42px",
              marginBottom:"12px"
            }}
          >
            🔔
          </div>

          <div
            style={{
              fontSize:"20px",
              fontWeight:"900",
              marginBottom:"8px"
            }}
          >
            No notifications yet
          </div>

          <div
            style={{
              fontSize:"14px",
              color:"#64748b",
              fontWeight:"700",
              lineHeight:"1.5"
            }}
          >
            Delivery alerts, rider updates, and order messages will appear here.
          </div>
        </div>
      ) : (
        <div
          style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",
            gap:"18px",
            width:"100%"
          }}
        >
          {allNotifications.map((note,index)=>(
            <div
              key={index}
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
                cursor:note.orderId ? "pointer" : "default",
                background:"linear-gradient(135deg,#ffffff,#f8fafc)",
                border:"1px solid rgba(250,204,21,0.25)",
                boxShadow:"0 14px 30px rgba(15,23,42,0.08)",
                borderRadius:"22px",
                padding:"22px"
              }}
            >
              <div
                style={{
                  display:"flex",
                  alignItems:"center",
                  gap:"10px",
                  marginBottom:"14px"
                }}
              >
                <span
                  style={{
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
                  }}
                >
                  🔔
                </span>

                <div>
                  <div
                    style={{
                      fontSize:"12px",
                      fontWeight:"900",
                      color:"#64748b",
                      textTransform:"uppercase",
                      letterSpacing:"0.5px"
                    }}
                  >
                    Alert From
                  </div>

                  <div
                    style={{
                      fontSize:"16px",
                      fontWeight:"900",
                      color:"#0f172a"
                    }}
                  >
                    {note.sender}
                  </div>
                </div>
              </div>

              <div
                style={{
                  background:"#fefce8",
                  border:"1px solid #fde68a",
                  borderRadius:"16px",
                  padding:"14px",
                  color:"#0f172a",
                  fontWeight:"800",
                  lineHeight:"1.5",
                  marginBottom:"14px"
                }}
              >
                {note.text}
              </div>

              <div
                style={{
                  display:"inline-flex",
                  padding:"9px 16px",
                  borderRadius:"999px",
                  background:"linear-gradient(135deg,#facc15,#f59e0b)",
                  color:"#0f172a",
                  border:"1px solid rgba(15,23,42,0.10)",
                  boxShadow:"0 8px 18px rgba(250,204,21,0.22)",
                  fontSize:"12px",
                  fontWeight:"900"
                }}
              >
                {note.time}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}