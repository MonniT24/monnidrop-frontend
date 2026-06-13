import React from "react";

import {
  GoogleMap,
  Marker,
  useJsApiLoader
} from "@react-google-maps/api";

export default function CustomerOrders({
  orders,
  sidebarOpen,
  locationCoords,
  customerIcon,
  riderIcon,
  riderLocation,
  ratedOrderIds,
  setRatingModalOrder,
  setRiderRating,
  setRiderRatingComment,
  openChats,
  setOpenChats,
  chatText,
  setChatText,
  sendMessage,
  cancelOrder
}) {

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:
      process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries:["places"]
  });

 function getPickupPosition(order){
  return {
    lat:Number(order.pickupLat || 5.6037),
    lng:Number(order.pickupLng || -0.1870)
  };
}

function getDropoffPosition(order){
  return {
    lat:Number(order.dropoffLat || 5.6500),
    lng:Number(order.dropoffLng || -0.1962)
  };
}

  return (
    <>
      <div
        style={{
          background:
            "radial-gradient(circle at top right, rgba(250,204,21,0.35), transparent 34%), linear-gradient(135deg,#0f172a,#1d4ed8)",
          color:"white",
          borderRadius:"26px",
          padding:"24px",
          marginBottom:"24px"
        }}
      >
        <div
          style={{
            display:"inline-flex",
            padding:"8px 14px",
            borderRadius:"999px",
            background:"rgba(250,204,21,0.18)",
            color:"#facc15",
            fontSize:"13px",
            fontWeight:"900",
            marginBottom:"14px"
          }}
        >
          📦 Customer Orders
        </div>

        <h1
          style={{
            fontSize:"32px",
            fontWeight:"900",
            margin:"0 0 10px"
          }}
        >
          Track Every Package
        </h1>

        <p
          style={{
            maxWidth:"680px",
            color:"rgba(255,255,255,0.86)",
            fontSize:"15px",
            fontWeight:"600",
            lineHeight:"1.55",
            margin:0
          }}
        >
          View your deliveries, payment status, rider details,
          live route tracking, and order progress in one clean place.
        </p>
      </div>

      {orders.length === 0 ? (
        <div
          style={{
            background:"white",
            padding:"28px",
            borderRadius:"18px",
            textAlign:"center",
            color:"#64748b",
            fontWeight:"800"
          }}
        >
          No orders found.
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
          {orders.map((o)=>(
            <div
              key={o._id}
              style={{
                background:"linear-gradient(135deg,#ffffff,#f8fafc)",
                borderRadius:"22px",
                padding:"22px",
                boxShadow:"0 12px 28px rgba(15,23,42,0.07)",
                border:"1px solid rgba(29,78,216,0.10)",
                overflow:"hidden"
              }}
            >
              <Row blue>
  <strong>Delivery Rider:</strong>{" "}

  {o.rider?.name ? (

    <div
      style={{
        display:"flex",
        alignItems:"center",
        gap:"10px",
        marginTop:"10px"
      }}
    >

      <img
        src={
          o.rider?.profileImage ||
          "/rider.png"
        }
        alt="Rider"
        style={{
          width:"48px",
          height:"48px",
          borderRadius:"50%",
          objectFit:"cover",
          border:"3px solid #facc15"
        }}
      />

      <div>
        <div
          style={{
            fontWeight:"900",
            color:"#0f172a"
          }}
        >
          {o.rider.name}
        </div>

        <div
          style={{
            fontSize:"12px",
            fontWeight:"800",
            color:"#64748b"
          }}
        >
          Assigned rider
        </div>
      </div>

    </div>

  ) : o.status === "pending" ? (

    <span
      style={{
        display:"inline-flex",
        alignItems:"center",
        gap:"8px",
        padding:"7px 12px",
        borderRadius:"999px",
        background:"linear-gradient(135deg,#0f172a,#1d4ed8)",
        color:"#facc15",
        fontSize:"13px",
        fontWeight:"900"
      }}
    >
      Searching for a rider...
    </span>

  ) : (
    "No rider assigned"
  )}
</Row>

              <Row><strong>Pickup:</strong> {o.pickupLocation}</Row>
              <Row><strong>Dropoff:</strong> {o.dropoffLocation}</Row>
              <Row><strong>Distance:</strong> {o.distance} km</Row>

              <Row>
                <strong>Estimated Delivery Time:</strong>{" "}
                {o.status === "delivered"
                  ? "Delivered"
                  : o.deliveryTime || "Not available"}
              </Row>

              <Row><strong>Amount:</strong> ₵{o.total}</Row>
              <Row><strong>Payment:</strong> {o.isPaid ? "Paid" : "Not Paid"}</Row>

              <StatusBadge status={o.status}>
                {o.status}
              </StatusBadge>

              {o.status === "delivered" &&
                o.rider &&
                !o.riderRated &&
                !o.hasRatedRider &&
                !o.riderRatingSubmitted &&
                !ratedOrderIds.includes(o._id?.toString()) && (
                  <Button
                    onClick={()=>{
                      setRatingModalOrder(o);
                      setRiderRating(5);
                      setRiderRatingComment("");
                    }}
                    style={{
                      marginTop:"14px",
                      background:"linear-gradient(135deg,#facc15,#f59e0b)",
                      color:"#0f172a"
                    }}
                  >
                    ⭐ Rate Rider
                  </Button>
              )}

              {o.status === "delivered" &&
                (
                  o.riderRated ||
                  o.hasRatedRider ||
                  o.riderRatingSubmitted ||
                  ratedOrderIds.includes(o._id?.toString())
                ) && (
                  <div
                    style={{
                      marginTop:"14px",
                      padding:"12px",
                      borderRadius:"14px",
                      background:"#dcfce7",
                      color:"#166534",
                      fontWeight:"900",
                      textAlign:"center"
                    }}
                  >
                    ✅ Rider Rated
                  </div>
              )}

              {o.deliveryCode &&
                o.status !== "delivered" &&
                o.status !== "cancelled" && (
                  <div
                    style={{
                      marginTop:"18px",
                      padding:"18px",
                      borderRadius:"20px",
                      background:"linear-gradient(135deg,#facc15,#f59e0b)",
                      border:"2px solid #0f172a",
                      textAlign:"center"
                    }}
                  >
                    <div
                      style={{
                        fontSize:"13px",
                        fontWeight:"900",
                        color:"#0f172a",
                        textTransform:"uppercase",
                        marginBottom:"8px"
                      }}
                    >
                      Delivery Verification Code
                    </div>

                    <div
                      style={{
                        fontSize:"13px",
                        fontWeight:"800",
                        color:"#334155",
                        marginBottom:"12px"
                      }}
                    >
                      Give this OTP number to the rider when your package arrives.
                    </div>

                    <div
                      style={{
                        background:"#0f172a",
                        color:"#facc15",
                        borderRadius:"16px",
                        padding:"16px",
                        fontSize:"34px",
                        fontWeight:"900",
                        letterSpacing:"10px"
                      }}
                    >
                      {o.deliveryCode}
                    </div>
                  </div>
              )}

              <Timeline status={o.status} />

              {!sidebarOpen && (
                <div
                  style={{
                    marginTop:"20px",
                    borderRadius:"22px",
                    overflow:"hidden",
                    border:"1px solid rgba(29,78,216,0.16)",
                    background:"#ffffff"
                  }}
                >
                  <div
                    style={{
                      display:"flex",
                      alignItems:"center",
                      justifyContent:"space-between",
                      gap:"12px",
                      padding:"12px 14px",
                      background:"linear-gradient(135deg,#0f172a,#1d4ed8)",
                      color:"white"
                    }}
                  >
                    <div style={{fontWeight:"900",fontSize:"14px"}}>
                      Live Delivery Map
                    </div>

                    <div
                      style={{
                        background:"#facc15",
                        color:"#0f172a",
                        padding:"6px 10px",
                        borderRadius:"999px",
                        fontSize:"12px",
                        fontWeight:"900"
                      }}
                    >
                      Tracking Active
                    </div>
                  </div>

                  {isLoaded ? (
                    <GoogleMap
                      mapContainerStyle={{
                        height:window.innerWidth <= 480 ? "220px" : "300px",
                        width:"100%"
                      }}
                      center={getPickupPosition(o)}
                      zoom={12}
                    >
                      <Marker
                        position={getPickupPosition(o)}
                        label="P"
                      />

                      <Marker
                        position={getDropoffPosition(o)}
                        label="D"
                      />

  {riderLocation &&
   riderLocation.lat &&
   riderLocation.lng && (
    <Marker
      position={{
        lat:Number(riderLocation.lat),
        lng:Number(riderLocation.lng)
      }}
      label="R"
    />
)}
                    </GoogleMap>
                  ) : (
                    <div
                      style={{
                        height:window.innerWidth <= 480 ? "220px" : "300px",
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center",
                        fontWeight:"900",
                        color:"#0f172a"
                      }}
                    >
                      Loading Google Map...
                    </div>
                  )}
                </div>
              )}

              <div
                style={{
                  display:"flex",
                  gap:"10px",
                  marginTop:"18px",
                  flexWrap:"wrap"
                }}
              >
                <Button
                  onClick={()=>{
                    setOpenChats({
                      ...openChats,
                      [o._id]:!openChats[o._id]
                    });
                  }}
                >
                  💬 Chat Rider
                </Button>

                <Button
                  onClick={()=>{
                    if(!o.rider?.phone){
                      alert("Rider phone number not available");
                      return;
                    }

                    window.location.href = `tel:${o.rider.phone}`;
                  }}
                  yellow
                >
                  📞 Call Rider
                </Button>

                {o.status === "pending" && (
                  <Button
                    danger
                    onClick={()=>cancelOrder(o._id)}
                  >
                    Cancel Order
                  </Button>
                )}
              </div>

              {openChats[o._id] && (
                <ChatBox
                  order={o}
                  chatText={chatText}
                  setChatText={setChatText}
                  sendMessage={sendMessage}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Row({children,blue}) {
  return (
    <div
      style={{
        marginBottom:"10px",
        color:"#0f172a",
        fontSize:"15px",
        fontWeight:"700",
        background:blue ? "#eff6ff" : "transparent",
        border:blue ? "1px solid #dbeafe" : "none",
        borderRadius:blue ? "14px" : "0",
        padding:blue ? "12px" : "0"
      }}
    >
      {children}
    </div>
  );
}

function Button({children,onClick,yellow,danger,style}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border:"none",
        borderRadius:"14px",
        padding:"12px 16px",
        background:danger
          ? "#dc2626"
          : yellow
          ? "linear-gradient(135deg,#facc15,#f59e0b)"
          : "linear-gradient(135deg,#0f172a,#1d4ed8)",
        color:yellow ? "#0f172a" : "white",
        fontWeight:"900",
        cursor:"pointer",
        flex:1,
        ...style
      }}
    >
      {children}
    </button>
  );
}

function StatusBadge({status,children}) {
  return (
    <div
      style={{
        display:"inline-flex",
        padding:"9px 16px",
        borderRadius:"999px",
        fontSize:"12px",
        fontWeight:"900",
        textTransform:"uppercase",
        marginTop:"14px",
        background:
          status === "delivered"
          ? "linear-gradient(135deg,#0f172a,#1d4ed8)"
          : status === "pending"
          ? "linear-gradient(135deg,#facc15,#f59e0b)"
          : "#dbeafe",
        color:
          status === "delivered"
          ? "#facc15"
          : "#111827"
      }}
    >
      {children}
    </div>
  );
}

function Timeline({status}) {
  const steps = [
    ["Order Created", "Waiting for rider", true],
    ["Rider Accepted", "Rider confirmed order", ["accepted","picked","delivering","delivered"].includes(status)],
    ["Reached Pickup Location", "Rider arrived at pickup", ["picked","delivering","delivered"].includes(status)],
    ["Package Picked Up", "Delivery in progress", ["delivering","delivered"].includes(status)],
    ["Delivered", "Order completed successfully", status === "delivered"]
  ];

  return (
    <div
      style={{
        marginTop:"20px",
        padding:"18px",
        borderRadius:"18px",
        background:"linear-gradient(135deg,#f8fafc,#ffffff)",
        border:"1px solid rgba(29,78,216,0.10)"
      }}
    >
      {steps.map((step,index)=>(
        <div
          key={index}
          style={{
            display:"flex",
            gap:"12px",
            marginBottom:index === steps.length - 1 ? "0" : "16px"
          }}
        >
          <div
            style={{
              width:"18px",
              height:"18px",
              borderRadius:"50%",
              background:step[2]
                ? "linear-gradient(135deg,#facc15,#f59e0b)"
                : "#cbd5e1",
              flexShrink:0,
              marginTop:"2px"
            }}
          />

          <div>
            <div
              style={{
                fontSize:"14px",
                fontWeight:"900",
                color:"#0f172a"
              }}
            >
              {step[0]}
            </div>

            <div
              style={{
                fontSize:"12px",
                color:"#64748b",
                marginTop:"5px",
                fontWeight:"700"
              }}
            >
              {step[1]}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChatBox({
  order,
  chatText,
  setChatText,
  sendMessage
}) {
  return (
    <div
      style={{
        marginTop:"15px",
        background:"#f8fafc",
        padding:"15px",
        borderRadius:"14px"
      }}
    >
      {order.messages && order.messages.length > 0 && (
        <div style={{marginBottom:"14px"}}>
          {order.messages.map((msg,index)=>(
            <div
              key={index}
              style={{
                background:msg.sender === "customer"
                  ? "linear-gradient(135deg,#0f172a,#1d4ed8)"
                  : "linear-gradient(135deg,#facc15,#f59e0b)",
                color:msg.sender === "customer" ? "#ffffff" : "#0f172a",
                padding:"11px 13px",
                borderRadius:"14px",
                marginBottom:"9px",
                fontSize:"14px",
                fontWeight:"700"
              }}
            >
              <strong>
                {msg.sender === "customer" ? "You" : "Rider"}:
              </strong>{" "}
              {msg.text}
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          display:"flex",
          gap:"10px",
          marginTop:"16px"
        }}
      >
        <input
          type="text"
          placeholder="Type message..."
          value={chatText[order._id] || ""}
          onChange={(e)=>
            setChatText({
              ...chatText,
              [order._id]:e.target.value
            })
          }
          style={{
            flex:1,
            padding:"13px 14px",
            borderRadius:"14px",
            border:"1px solid rgba(29,78,216,0.18)",
            outline:"none",
            background:"#ffffff",
            color:"#0f172a",
            fontWeight:"700"
          }}
        />

        <Button
          yellow
          onClick={()=>sendMessage(order._id,chatText[order._id])}
        >
          Send
        </Button>
      </div>
    </div>
  );
}