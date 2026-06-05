import React from "react";

import {
  FiTruck,
  FiPackage,
  FiBell,
  FiClock
} from "react-icons/fi";

export default function CustomerDashboard({
  user,
  currentTime,
  activeOrders,
  completedOrders,
  orders,
  notifications,
  setActiveSection
}) {
  return (
    <>
      <div
        style={{
          position:"relative",
          overflow:"hidden",
          background:
            "radial-gradient(circle at top right, rgba(250,204,21,0.30), transparent 28%), linear-gradient(135deg,#0f172a,#1d4ed8)",
          color:"white",
          borderRadius:"24px",
          padding:"18px",
          marginBottom:"18px",
          boxShadow:"0 12px 28px rgba(15,23,42,0.14)"
        }}
      >
        <div
          style={{
            display:"grid",
            gridTemplateColumns:"minmax(0,1fr) 300px",
            alignItems:"center",
            gap:"14px"
          }}
        >
          <div
            style={{
              display:"flex",
              alignItems:"center",
              gap:"12px",
              minWidth:0
            }}
          >
            <img
              src="/logo.png"
              alt="MonniDrop Logo"
              style={{
                width:"68px",
                height:"68px",
                objectFit:"contain",
                background:"white",
                padding:"5px",
                borderRadius:"50%",
                boxShadow:"0 10px 22px rgba(15,23,42,0.22)",
                flexShrink:0
              }}
            />

            <div style={{minWidth:0}}>
              <div
                style={{
                  display:"inline-flex",
                  background:"rgba(255,255,255,0.15)",
                  border:"1px solid rgba(255,255,255,0.25)",
                  color:"white",
                  padding:"8px 12px",
                  borderRadius:"999px",
                  fontSize:"12px",
                  fontWeight:"800",
                  marginBottom:"12px"
                }}
              >
                ⚡ MonniDrop Customer Dashboard
              </div>

              <h1
                style={{
                  fontSize:"26px",
                  fontWeight:"900",
                  margin:"0 0 8px",
                  lineHeight:"1.12",
                  maxWidth:"430px"
                }}
              >
                Welcome/Akwaaba, {user?.name || "Customer"} 👋
              </h1>

              <p
                style={{
                  maxWidth:"440px",
                  color:"#dbeafe",
                  fontSize:"13px",
                  lineHeight:"1.5",
                  margin:0
                }}
              >
                Book deliveries, track riders, monitor payments,
                and manage every package from one clean dashboard.
              </p>

              <div
                style={{
                  display:"flex",
                  gap:"10px",
                  flexWrap:"wrap",
                  marginTop:"18px"
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveSection("createOrder")}
                  style={{
                    border:"none",
                    borderRadius:"14px",
                    padding:"11px 16px",
                    background:"#facc15",
                    color:"#111827",
                    fontSize:"13px",
                    fontWeight:"900",
                    cursor:"pointer"
                  }}
                >
                  Create New Delivery
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection("orders")}
                  style={{
                    border:"1px solid rgba(255,255,255,0.22)",
                    borderRadius:"14px",
                    padding:"11px 16px",
                    background:"rgba(255,255,255,0.14)",
                    color:"white",
                    fontSize:"13px",
                    fontWeight:"900",
                    cursor:"pointer"
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
              maxWidth:"300px",
              background:
                "linear-gradient(135deg,rgba(255,255,255,0.25),rgba(255,255,255,0.08))",
              border:"1px solid rgba(255,255,255,0.34)",
              borderRadius:"20px",
              padding:"13px 16px",
              color:"white",
              boxShadow:"0 14px 30px rgba(0,0,0,0.18)",
              justifySelf:"end"
            }}
          >
            <div
              style={{
                color:"#bfdbfe",
                fontSize:"12px",
                fontWeight:"800",
                marginBottom:"7px"
              }}
            >
              Today
            </div>

            <div
              style={{
                fontSize:"20px",
                fontWeight:"900",
                lineHeight:"1.1",
                marginBottom:"9px"
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
                padding:"7px 11px",
                marginBottom:"8px",
                borderRadius:"13px",
                background:"linear-gradient(135deg,#facc15,#f59e0b)",
                color:"#0f172a",
                fontSize:"14px",
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
                fontSize:"12px",
                marginTop:"7px"
              }}
            >
              Ready to move your next package.
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",
          gap:"12px",
          marginBottom:"20px"
        }}
      >
        <StatCard title="Active Orders" value={activeOrders.length} icon={<FiTruck />} />
        <StatCard title="Completed Orders" value={completedOrders.length} icon={<FiPackage />} />
        <StatCard title="Notifications" value={notifications.length} icon={<FiBell />} />
        <StatCard
          title="Pending Orders"
          value={orders.filter((o) => o.status === "pending").length}
          icon={<FiClock />}
        />
      </div>

      <div
        style={{
          display:"grid",
          gridTemplateColumns:"1.4fr 0.9fr",
          gap:"22px"
        }}
      >
        <div
          style={{
            background:"#ffffff",
            borderRadius:"28px",
            padding:"24px",
            boxShadow:"0 10px 30px rgba(15,23,42,0.06)",
            border:"1px solid #eef2f7"
          }}
        >
          <h3
            style={{
              fontSize:"20px",
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
                color:"#facc15"
              }}
            >
              <FiTruck />
            </span>
            Recent Delivery Activity
          </h3>

          {orders.length === 0 ? (
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
              No recent delivery yet. Create your first order.
            </div>
          ) : (
            orders.slice(0,3).map((o)=>(
              <div
                key={o._id}
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
                    marginBottom:"10px"
                  }}
                >
                  <strong style={{color:"#1d4ed8"}}>Route:</strong>{" "}
                  {o.pickupLocation} → {o.dropoffLocation}
                </div>

                <div
                  style={{
                    color:"#0f172a",
                    fontWeight:"800",
                    marginBottom:"10px"
                  }}
                >
                  <strong style={{color:"#ca8a04"}}>Amount:</strong>{" "}
                  <span
                    style={{
                      background:"#fef3c7",
                      color:"#0f172a",
                      padding:"6px 12px",
                      borderRadius:"999px",
                      fontWeight:"900"
                    }}
                  >
                    ₵{o.total}
                  </span>
                </div>

                <div
                  style={{
                    display:"grid",
                    gridTemplateColumns:"1fr auto auto",
                    alignItems:"center",
                    gap:"14px",
                    width:"100%",
                    marginTop:"12px"
                  }}
                >
                  <div
                    style={{
                      display:"flex",
                      alignItems:"center",
                      gap:"12px"
                    }}
                  >
                    <img
                      src={
                        o.rider?.profileImage ||
                        "https://ui-avatars.com/api/?name=Rider&background=facc15&color=0f172a&size=128"
                      }
                      alt="Rider"
                      style={{
                        width:"52px",
                        height:"52px",
                        borderRadius:"50%",
                        objectFit:"cover",
                        border:"3px solid #facc15",
                        background:"white"
                      }}
                    />

                    <div>
                      <div
                        style={{
                          fontSize:"11px",
                          fontWeight:"900",
                          color:"#64748b"
                        }}
                      >
                        ASSIGNED RIDER NAME
                      </div>

                      <div
                        style={{
                          fontSize:"15px",
                          fontWeight:"900",
                          color:"#0f172a"
                        }}
                      >
                        {o.rider?.name || "Searching for rider"}
                      </div>

                      <div
                        style={{
                          fontSize:"12px",
                          fontWeight:"800",
                          color:"#475569",
                          marginTop:"3px"
                        }}
                      >
                        Motor Name: {o.rider?.motorName || "Not added"}
                      </div>

                      <div
                        style={{
                          fontSize:"12px",
                          fontWeight:"800",
                          color:"#475569",
                          marginTop:"2px"
                        }}
                      >
                        Motor: {o.rider?.motorNumber || "Not added"}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      padding:"9px 16px",
                      borderRadius:"999px",
                      fontSize:"12px",
                      fontWeight:"900",
                      textTransform:"uppercase",
                      background:"#dbeafe",
                      color:"#0f172a",
                      whiteSpace:"nowrap"
                    }}
                  >
                    {o.status}
                  </span>

                  <span
                    style={{
                      display:"inline-flex",
                      padding:"7px 12px",
                      borderRadius:"999px",
                      background:o.isPaid ? "#dcfce7" : "#fef3c7",
                      color:o.isPaid ? "#166534" : "#92400e",
                      fontSize:"12px",
                      fontWeight:"900",
                      whiteSpace:"nowrap"
                    }}
                  >
                    {o.isPaid ? "Paid" : "Not Paid"}
                  </span>
                </div>
              </div>
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
            padding:"14px",
            borderRadius:"18px",
            alignSelf:"start"
          }}
        >
          <h3
            style={{
              display:"flex",
              alignItems:"center",
              gap:"7px",
              color:"white",
              fontSize:"15px",
              margin:"0 0 10px",
              fontWeight:"900"
            }}
          >
            <span
              style={{
                width:"26px",
                height:"26px",
                borderRadius:"9px",
                display:"inline-flex",
                alignItems:"center",
                justifyContent:"center",
                background:"#facc15",
                color:"#0f172a",
                fontSize:"14px"
              }}
            >
              <FiPackage />
            </span>
            Smart Delivery Summary
          </h3>

          <InfoRow title="Payment Ready:" text="Mobile Money enabled" />
          <InfoRow title="Test MoMo:" text="0551234987" />
          <InfoRow title="Default Area:" text="Accra" />

          <div
            style={{
              background:"rgba(250,204,21,0.16)",
              border:"1px solid rgba(250,204,21,0.35)",
              color:"#fef3c7",
              borderRadius:"20px",
              padding:"18px",
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
    </>
  );
}

function StatCard({title,value,icon}) {
  return (
    <div
      style={{
        background:"white",
        borderRadius:"18px",
        padding:"16px",
        boxShadow:"0 8px 20px rgba(15,23,42,0.06)",
        border:"1px solid #eef2f7",
        minHeight:"125px"
      }}
    >
      <div
        style={{
          width:"32px",
          height:"32px",
          borderRadius:"12px",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          background:"#eff6ff",
          color:"#2563eb",
          fontSize:"16px",
          marginBottom:"8px"
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color:"#64748b",
          fontSize:"13px",
          fontWeight:"900",
          marginBottom:"6px"
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize:"24px",
          fontWeight:"900",
          color:"#0f172a"
        }}
      >
        {value}
      </div>
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