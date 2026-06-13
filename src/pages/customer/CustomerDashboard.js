import React,{useState} from "react";

import API from "../../api/api";

import {
  FiTruck,
  FiPackage,
  FiBell,
  FiClock
} from "react-icons/fi";

import { FiMessageCircle } from "react-icons/fi";

export default function CustomerDashboard({
  user,
  currentTime,
  activeOrders,
  completedOrders,
  orders,
  notifications,
  setActiveSection
}) {

const [chatbotOpen,setChatbotOpen] =
  useState(false);

const [chatbotMessages,setChatbotMessages] =
  useState([
    {
      sender:"bot",
      text:"Hi 👋 I am MB Swift Assistant. How can I help you today?"
    }
  ]);

const [chatbotText,setChatbotText] =
  useState(""); 
  
  async function sendChatbotMessage(){

  if(!chatbotText.trim()){
    return;
  }

  const userMessage =
    chatbotText.trim();

  setChatbotMessages([
    ...chatbotMessages,
    {
      sender:"user",
      text:userMessage
    }
  ]);

  setChatbotText("");

  try{

    const res =
      await API.post(
        "/chatbot/ask",
        {
          message:userMessage
        }
      );

    setChatbotMessages((prev)=>[
      ...prev,
      {
        sender:"bot",
        text:res.data.reply
      }
    ]);

  }catch(err){

    setChatbotMessages((prev)=>[
      ...prev,
      {
        sender:"bot",
        text:
          err.response?.data?.message ||
          "Sorry, I could not respond right now."
      }
    ]);
  }
}

  const [customerPage,setCustomerPage] =
    useState("home");

  const isMobile =
    window.innerWidth <= 768;

  const pendingOrders =
    orders.filter((o)=>o.status === "pending");

  function getPageTitle(){

    if(customerPage === "activeOrders"){
      return "Active Orders";
    }

    if(customerPage === "completedOrders"){
      return "Completed Orders";
    }

    if(customerPage === "notifications"){
      return "Notifications";
    }

    if(customerPage === "pendingOrders"){
      return "Pending Orders";
    }

    return "";
  }

  function getPageOrders(){

    if(customerPage === "activeOrders"){
      return activeOrders;
    }

    if(customerPage === "completedOrders"){
      return completedOrders;
    }

    if(customerPage === "pendingOrders"){
      return pendingOrders;
    }

    return [];
  }

  return (
    <>
      <div
        style={{
          position:"relative",
          overflow:"hidden",
          background:
            "radial-gradient(circle at top right, rgba(250,204,21,0.28), transparent 30%), linear-gradient(135deg,#0f172a,#1d4ed8)",
          color:"white",
          borderRadius:isMobile ? "24px" : "28px",
          padding:isMobile ? "22px" : "26px",
          marginBottom:"18px",
          boxShadow:"0 12px 28px rgba(15,23,42,0.14)"
        }}
      >
        <div
          style={{
            display:"grid",
            gridTemplateColumns:isMobile ? "1fr" : "minmax(0,1fr) 320px",
            gap:isMobile ? "22px" : "18px",
            alignItems:"center"
          }}
        >
          <div
            style={{
              display:isMobile ? "block" : "flex",
              alignItems:"center",
              gap:"16px",
              minWidth:0,
              textAlign:isMobile ? "center" : "left"
            }}
          >
            <img
              src="/logo.png"
              alt="MB Swift Logo"
              style={{
                width:isMobile ? "84px" : "78px",
                height:isMobile ? "84px" : "78px",
                objectFit:"contain",
                background:"white",
                padding:"6px",
                borderRadius:"50%",
                boxShadow:"0 10px 22px rgba(15,23,42,0.22)",
                margin:isMobile ? "0 auto 16px" : "0",
                display:"block",
                flexShrink:0
              }}
            />

            <div style={{minWidth:0}}>
              <div
                style={{
                  display:"inline-flex",
                  alignItems:"center",
                  justifyContent:"center",
                  background:"rgba(255,255,255,0.15)",
                  border:"1px solid rgba(255,255,255,0.25)",
                  color:"white",
                  padding:"8px 12px",
                  borderRadius:"999px",
                  fontSize:"12px",
                  fontWeight:"900",
                  marginBottom:"14px",
                  maxWidth:"100%"
                }}
              >
                ⚡ MB Swift Customer Dashboard
              </div>

              <h1
                style={{
                  fontSize:isMobile ? "32px" : "34px",
                  fontWeight:"900",
                  margin:"0 0 12px",
                  lineHeight:"1.08",
                  color:"white"
                }}
              >
                Welcome/Akwaaba,
                <br />
                {user?.name || "Customer"} 👋
              </h1>

              <p
                style={{
                  maxWidth:isMobile ? "100%" : "460px",
                  color:"#dbeafe",
                  fontSize:"15px",
                  lineHeight:"1.55",
                  margin:isMobile ? "0 auto" : "0",
                  fontWeight:"600"
                }}
              >
                Book deliveries, track riders, monitor payments,
                and manage every package from one clean dashboard.
              </p>

              <div
                style={{
                  display:"flex",
                  gap:"12px",
                  flexWrap:"wrap",
                  marginTop:"22px",
                  justifyContent:isMobile ? "center" : "flex-start"
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveSection("createOrder")}
                  style={{
                    border:"none",
                    borderRadius:"16px",
                    padding:"14px 18px",
                    background:"#facc15",
                    color:"#111827",
                    fontSize:"15px",
                    fontWeight:"900",
                    cursor:"pointer",
                    minWidth:isMobile ? "170px" : "auto"
                  }}
                >
                  Create New Delivery
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection("orders")}
                  style={{
                    border:"1px solid rgba(255,255,255,0.24)",
                    borderRadius:"16px",
                    padding:"14px 18px",
                    background:"rgba(255,255,255,0.14)",
                    color:"white",
                    fontSize:"15px",
                    fontWeight:"900",
                    cursor:"pointer",
                    minWidth:isMobile ? "170px" : "auto"
                  }}
                >
                  Track My Orders
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              width:"100%",
              maxWidth:isMobile ? "100%" : "320px",
              background:
                "linear-gradient(135deg,rgba(255,255,255,0.24),rgba(255,255,255,0.08))",
              border:"1px solid rgba(255,255,255,0.34)",
              borderRadius:"22px",
              padding:"18px",
              color:"white",
              boxShadow:"0 14px 30px rgba(0,0,0,0.18)",
              justifySelf:isMobile ? "stretch" : "end",
              textAlign:isMobile ? "center" : "left"
            }}
          >
            <div
              style={{
                color:"#bfdbfe",
                fontSize:"13px",
                fontWeight:"900",
                marginBottom:"8px"
              }}
            >
              Today
            </div>

            <div
              style={{
                fontSize:isMobile ? "23px" : "22px",
                fontWeight:"900",
                lineHeight:"1.15",
                marginBottom:"12px"
              }}
            >
              {currentTime.toLocaleDateString("en-US", {
                weekday:"short",
                month:"long",
                day:"numeric",
                year:"numeric"
              })}
            </div>

            <div
              style={{
                display:"inline-flex",
                padding:"9px 14px",
                marginBottom:"10px",
                borderRadius:"999px",
                background:"linear-gradient(135deg,#facc15,#f59e0b)",
                color:"#0f172a",
                fontSize:isMobile ? "16px" : "15px",
                fontWeight:"900",
                letterSpacing:"1px"
              }}
            >
              {currentTime.toLocaleTimeString("en-US", {
                hour:"2-digit",
                minute:"2-digit",
                second:"2-digit"
              })}
            </div>

            <div
              style={{
                color:"#dbeafe",
                fontSize:"13px",
                marginTop:"8px",
                fontWeight:"700"
              }}
            >
              Ready to move your next package.
            </div>
          </div>
        </div>
      </div>

      {customerPage === "home" && (
        <div
          style={{
            display:"grid",
            gridTemplateColumns:isMobile
              ? "repeat(2,minmax(0,1fr))"
              : "repeat(auto-fit,minmax(190px,1fr))",
            gap:"12px",
            marginBottom:"20px"
          }}
        >
          <StatCard
            title="Active Orders"
            value={activeOrders.length}
            icon={<FiTruck />}
            onClick={() => setCustomerPage("activeOrders")}
          />

          <StatCard
            title="Completed Orders"
            value={completedOrders.length}
            icon={<FiPackage />}
            onClick={() => setCustomerPage("completedOrders")}
          />

          <StatCard
            title="Notifications"
            value={notifications.length}
            icon={<FiBell />}
            onClick={() => setCustomerPage("notifications")}
          />

          <StatCard
            title="Pending Orders"
            value={pendingOrders.length}
            icon={<FiClock />}
            onClick={() => setCustomerPage("pendingOrders")}
          />
        </div>
      )}

      {customerPage !== "home" && (
        <div
          style={{
            background:"#ffffff",
            borderRadius:"24px",
            padding:isMobile ? "18px" : "22px",
            border:"1px solid #e5e7eb",
            boxShadow:"0 10px 28px rgba(15,23,42,0.06)",
            marginBottom:"20px"
          }}
        >
          <button
            type="button"
            onClick={() => setCustomerPage("home")}
            style={{
              border:"none",
              borderRadius:"12px",
              padding:"10px 14px",
              background:"#f1f5f9",
              color:"#0f172a",
              fontWeight:"900",
              cursor:"pointer",
              marginBottom:"16px"
            }}
          >
            ← Back
          </button>

          <h2
            style={{
              marginTop:0,
              color:"#0f172a",
              fontWeight:"900"
            }}
          >
            {getPageTitle()}
          </h2>

          {customerPage === "notifications" ? (
            notifications.length === 0 ? (
              <EmptyBox text="No notifications found." />
            ) : (
              notifications.map((note,index)=>(
                <InfoCard key={note.id || index}>
                  <strong>
                    {note.title || "Notification"}
                  </strong>
                  <br />
                  {note.message || note.text || "No message"}
                </InfoCard>
              ))
            )
          ) : (
            getPageOrders().length === 0 ? (
              <EmptyBox text="No records found here." />
            ) : (
              getPageOrders().map((o)=>(
                <OrderListCard
                  key={o._id}
                  order={o}
                />
              ))
            )
          )}
        </div>
      )}

      {customerPage === "home" && (
        <div
          style={{
            display:"grid",
            gridTemplateColumns:isMobile ? "1fr" : "1.4fr 0.9fr",
            gap:"22px"
          }}
        >
          <div
            style={{
              background:"#ffffff",
              borderRadius:"24px",
              padding:isMobile ? "18px" : "24px",
              boxShadow:"0 10px 30px rgba(15,23,42,0.06)",
              border:"1px solid #eef2f7"
            }}
          >
            <h3
              style={{
                fontSize:isMobile ? "18px" : "20px",
                fontWeight:"900",
                color:"#0f172a",
                margin:"0 0 16px",
                display:"flex",
                alignItems:"center",
                gap:"10px"
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
                  flexShrink:0
                }}
              >
                <FiTruck />
              </span>
              Recent Delivery Activity
            </h3>

            {orders.length === 0 ? (
              <EmptyBox text="No recent delivery yet. Create your first order." />
            ) : (
              orders.slice(0,3).map((o)=>(
                <OrderListCard
                  key={o._id}
                  order={o}
                />
              ))
            )}

            <button
              type="button"
              onClick={() => setActiveSection("orders")}
              style={{
                marginTop:"8px",
                width:"100%",
                border:"none",
                borderRadius:"14px",
                padding:"12px 16px",
                background:"#2563eb",
                color:"white",
                fontWeight:"900",
                cursor:"pointer"
              }}
            >
              View All Orders
            </button>
          </div>

          <div
            style={{
              background:"linear-gradient(135deg,#0f172a,#1d4ed8)",
              color:"white",
              border:"1px solid rgba(250,204,21,0.22)",
              boxShadow:"0 10px 24px rgba(29,78,216,0.16)",
              padding:"18px",
              borderRadius:"20px",
              alignSelf:"start"
            }}
          >
            <h3
              style={{
                display:"flex",
                alignItems:"center",
                gap:"7px",
                color:"white",
                fontSize:"16px",
                margin:"0 0 12px",
                fontWeight:"900"
              }}
            >
              <span
                style={{
                  width:"28px",
                  height:"28px",
                  borderRadius:"9px",
                  display:"inline-flex",
                  alignItems:"center",
                  justifyContent:"center",
                  background:"#facc15",
                  color:"#0f172a",
                  fontSize:"14px",
                  flexShrink:0
                }}
              >
                <FiPackage />
              </span>
              Smart Delivery Summary
            </h3>

            <InfoRow title="Use This For Payment:" text="Mobile Money enabled" />
            <InfoRow title="MoMo Number:" text="0244095101" />
            <InfoRow title="Default Area:" text="Accra" />

            <div
              style={{
                background:"rgba(250,204,21,0.16)",
                border:"1px solid rgba(250,204,21,0.35)",
                color:"#fef3c7",
                borderRadius:"18px",
                padding:"16px",
                lineHeight:"1.6",
                fontWeight:"700",
                marginTop:"12px"
              }}
            >
              Tip: Use Mobile Money for faster checkout.
              Once Paystack confirms payment, your order
              is automatically marked as paid.
            </div>

            <button
              type="button"
              onClick={() => setActiveSection("createOrder")}
              style={{
                marginTop:"18px",
                width:"100%",
                border:"none",
                borderRadius:"14px",
                padding:"12px 16px",
                background:"#facc15",
                color:"#0f172a",
                fontWeight:"900",
                cursor:"pointer"
              }}
            >
              Send a Package Now
            </button>
          </div>
        </div>
      )}

{/* CUSTOMER CHATBOT */}
<button
  type="button"
  onClick={()=>setChatbotOpen(!chatbotOpen)}
  style={{
    position:"fixed",
    right:"22px",
    bottom:"22px",
    width:"58px",
    height:"58px",
    borderRadius:"50%",
    border:"none",
    background:"#1d4ed8",
    color:"white",
    fontSize:"26px",
    fontWeight:"900",
    cursor:"pointer",
    zIndex:9999,
    boxShadow:"0 12px 30px rgba(29,78,216,0.35)"
  }}
>
  <FiMessageCircle />
</button>

{chatbotOpen && (
  <div
    style={{
      position:"fixed",
      right:"22px",
      bottom:"90px",
      width:"320px",
      maxWidth:"calc(100vw - 32px)",
      background:"#ffffff",
      borderRadius:"22px",
      boxShadow:"0 20px 60px rgba(15,23,42,0.25)",
      border:"1px solid #e5e7eb",
      overflow:"hidden",
      zIndex:9999
    }}
  >
    <div
      style={{
        background:"linear-gradient(135deg,#0f172a,#1d4ed8)",
        color:"#facc15",
        padding:"14px",
        fontWeight:"900"
      }}
    >
      MB Swift Assistant
    </div>

    <div
      style={{
        padding:"14px",
        height:"260px",
        overflowY:"auto",
        background:"#f8fafc"
      }}
    >
      {chatbotMessages.map((msg,index)=>(
        <div
          key={index}
          style={{
            display:"flex",
            justifyContent:
              msg.sender === "user"
              ? "flex-end"
              : "flex-start",
            marginBottom:"10px"
          }}
        >
          <div
            style={{
              maxWidth:"80%",
              padding:"10px 12px",
              borderRadius:"14px",
              background:
                msg.sender === "user"
                ? "#1d4ed8"
                : "#facc15",
              color:
                msg.sender === "user"
                ? "white"
                : "#0f172a",
              fontSize:"13px",
              fontWeight:"800",
              lineHeight:"1.4"
            }}
          >
            {msg.text}
          </div>
        </div>
      ))}
    </div>

    <div
      style={{
        display:"flex",
        gap:"8px",
        padding:"12px",
        borderTop:"1px solid #e5e7eb"
      }}
    >
      <input
        value={chatbotText}
        onChange={(e)=>setChatbotText(e.target.value)}
        onKeyDown={(e)=>{
          if(e.key === "Enter"){
            sendChatbotMessage();
          }
        }}
        placeholder="Ask something..."
        style={{
          flex:1,
          border:"1px solid #cbd5e1",
          borderRadius:"14px",
          padding:"11px",
          outline:"none",
          fontWeight:"700"
        }}
      />

      <button
        type="button"
        onClick={sendChatbotMessage}
        style={{
          border:"none",
          borderRadius:"14px",
          padding:"0 14px",
          background:"#facc15",
          color:"#0f172a",
          fontWeight:"900",
          cursor:"pointer"
        }}
      >
        Send
      </button>
    </div>
  </div>
)}

    </>
  );
}

function StatCard({title,value,icon,onClick}) {

  const isMobile =
    window.innerWidth <= 768;

  return (
    <div
      onClick={onClick}
      style={{
        background:"white",
        borderRadius:"18px",
        padding:isMobile ? "16px" : "18px",
        boxShadow:"0 8px 20px rgba(15,23,42,0.06)",
        border:"1px solid #eef2f7",
        minHeight:isMobile ? "120px" : "130px",
        cursor:"pointer",
        transition:"0.25s ease"
      }}
      onMouseEnter={(e)=>{
        e.currentTarget.style.transform =
          "translateY(-3px)";
      }}
      onMouseLeave={(e)=>{
        e.currentTarget.style.transform =
          "translateY(0)";
      }}
    >
      <div
        style={{
          width:"38px",
          height:"38px",
          borderRadius:"14px",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          background:"#eff6ff",
          color:"#2563eb",
          fontSize:"18px",
          marginBottom:"12px"
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color:"#64748b",
          fontSize:isMobile ? "13px" : "14px",
          fontWeight:"900",
          marginBottom:"8px"
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize:isMobile ? "26px" : "28px",
          fontWeight:"900",
          color:"#0f172a"
        }}
      >
        {value}
      </div>
    </div>
  );
}

function OrderListCard({order}) {
  return (
    <div
      style={{
        padding:"16px",
        borderRadius:"18px",
        background:"#f8fafc",
        border:"1px solid #e5e7eb",
        marginBottom:"12px"
      }}
    >
      <div
        style={{
          background:"#eff6ff",
          border:"1px solid #dbeafe",
          borderRadius:"14px",
          padding:"12px",
          color:"#0f172a",
          fontWeight:"800",
          marginBottom:"10px",
          overflowWrap:"anywhere"
        }}
      >
        <strong style={{color:"#1d4ed8"}}>Route:</strong>{" "}
        {order.pickupLocation} → {order.dropoffLocation}
      </div>

      <div
        style={{
          color:"#0f172a",
          fontWeight:"800",
          marginBottom:"10px"
        }}
      >
        <strong style={{color:"#ca8a04"}}>Amount:</strong>{" "}
        ₵{order.total}
      </div>

      <div
        style={{
          color:"#475569",
          fontWeight:"800",
          fontSize:"13px",
          lineHeight:"1.7"
        }}
      >
        <strong>Status:</strong> {order.status || "N/A"}
        <br />
        <strong>Rider:</strong> {order.rider?.name || "Searching for rider"}
        <br />
        <strong>Motor Name:</strong> {order.rider?.motorName || "Not added"}
        <br />
        <strong>Motor Color:</strong> {order.rider?.motorColor || "Not added"}
        <br />
        <strong>Motor Number:</strong> {order.rider?.motorNumber || "Not added"}
      </div>
    </div>
  );
}

function EmptyBox({text}) {
  return (
    <div
      style={{
        background:"#f8fafc",
        padding:"24px",
        borderRadius:"18px",
        textAlign:"center",
        color:"#64748b",
        fontWeight:"800"
      }}
    >
      {text}
    </div>
  );
}

function InfoCard({children}) {
  return (
    <div
      style={{
        background:"#f8fafc",
        border:"1px solid #e5e7eb",
        borderRadius:"16px",
        padding:"14px",
        marginBottom:"10px",
        color:"#0f172a",
        fontWeight:"700"
      }}
    >
      {children}
    </div>
  );
}

function InfoRow({title,text}) {
  return (
    <div
      style={{
        background:"rgba(255,255,255,0.12)",
        border:"1px solid rgba(255,255,255,0.18)",
        borderRadius:"16px",
        padding:"14px",
        color:"rgba(255,255,255,0.92)",
        fontWeight:"700",
        marginBottom:"8px"
      }}
    >
      <strong style={{color:"#facc15"}}>
        {title}
      </strong>{" "}
      {text}
    </div>
  );
}