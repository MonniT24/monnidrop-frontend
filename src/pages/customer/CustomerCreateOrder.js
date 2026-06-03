import React from "react";

import { FiPackage } from "react-icons/fi";

export default function CustomerCreateOrder({
  pickupLocation,
  setPickupLocation,

  dropoffLocation,
  setDropoffLocation,

  itemNotes,
  setItemNotes,

  pickupSuggestions,
  setPickupSuggestions,

  dropoffSuggestions,
  setDropoffSuggestions,

  searchLocations,
  calculateDistance,

  distance,
  amount,
  deliveryTime,

  paymentMethod,
  setPaymentMethod,

  momoNumber,
  setMomoNumber,

  showConfirm,
  setShowConfirm,

  createOrder
}) {
  return (
    <>
      <div
        style={{
          background:"linear-gradient(135deg,#ffffff,#f8fafc)",
          borderRadius:"28px",
          padding:"26px",
          border:"1px solid rgba(29,78,216,0.10)",
          boxShadow:"0 16px 38px rgba(15,23,42,0.08)",
          position:"relative",
          overflow:"hidden"
        }}
      >
        <div
          style={{
            background:
              "radial-gradient(circle at top right, rgba(250,204,21,0.35), transparent 34%), linear-gradient(135deg,#0f172a,#1d4ed8)",
            borderRadius:"24px",
            padding:"24px",
            marginBottom:"24px",
            color:"white",
            border:"1px solid rgba(250,204,21,0.28)",
            boxShadow:"0 16px 34px rgba(29,78,216,0.20)"
          }}
        >
          <div
            style={{
              display:"inline-flex",
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
            🚀 Fast Delivery Across Accra
          </div>

          <h2
            style={{
              fontSize:"30px",
              fontWeight:"900",
              lineHeight:"1.1",
              margin:"0 0 10px",
              color:"white"
            }}
          >
            Send Packages Faster, Safer & Smarter 📦
          </h2>

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
            Book a rider, track your delivery, and pay with ease —
            all from your MonniDrop dashboard.
          </p>
        </div>

        <OrderSection
          step="1"
          title="Pickup Location"
        >
          <Input
            type="text"
            placeholder="Enter pickup location"
            value={pickupLocation}
            onChange={(e)=>{
              setPickupLocation(e.target.value);
              searchLocations(e.target.value,"pickup");
            }}
          />

          <LocationHint />

          {pickupSuggestions.length > 0 && (
            <SuggestionBox>
              {pickupSuggestions.map((place,index)=>(
                <SuggestionItem
                  key={index}
                  onClick={()=>{
                    setPickupLocation(place);
                    setPickupSuggestions([]);
                    calculateDistance(place,dropoffLocation);
                  }}
                >
                  {place}
                </SuggestionItem>
              ))}
            </SuggestionBox>
          )}
        </OrderSection>

        <OrderSection
          step="2"
          title="Dropoff Location"
        >
          <Input
            type="text"
            placeholder="Enter dropoff location"
            value={dropoffLocation}
            onChange={(e)=>{
              setDropoffLocation(e.target.value);
              searchLocations(e.target.value,"dropoff");
            }}
          />

          <LocationHint />

          {dropoffSuggestions.length > 0 && (
            <SuggestionBox>
              {dropoffSuggestions.map((place,index)=>(
                <SuggestionItem
                  key={index}
                  onClick={()=>{
                    setDropoffLocation(place);
                    setDropoffSuggestions([]);
                    calculateDistance(pickupLocation,place);
                  }}
                >
                  {place}
                </SuggestionItem>
              ))}
            </SuggestionBox>
          )}
        </OrderSection>

        <OrderSection
          step="3"
          title="Item Notes"
        >
          <Input
            type="text"
            placeholder="Describe the item/package (optional)"
            value={itemNotes}
            onChange={(e)=>setItemNotes(e.target.value)}
          />
        </OrderSection>

        <div
          style={{
            background:"linear-gradient(135deg,#0f172a,#1d4ed8)",
            border:"1px solid rgba(250,204,21,0.30)",
            borderRadius:"20px",
            padding:"18px",
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center",
            marginTop:"18px",
            flexWrap:"wrap",
            gap:"14px",
            boxShadow:"0 12px 28px rgba(29,78,216,0.16)"
          }}
        >
          <FareItem
            label="Estimated Distance"
            value={`${distance || 0} KM`}
          />

          <FareItem
            label="Delivery Fee"
            value={`₵${amount || 0}`}
          />
        </div>

        <OrderSection
          step="4"
          title="Payment Option"
        >
          <div
            style={{
              display:"flex",
              gap:"12px",
              flexWrap:"wrap",
              marginTop:"12px"
            }}
          >
            <PayButton
              active={paymentMethod === "cash"}
              onClick={()=>setPaymentMethod("cash")}
            >
              Cash on Delivery
            </PayButton>

            <PayButton
              active={paymentMethod === "momo"}
              onClick={()=>setPaymentMethod("momo")}
            >
              Mobile Money
            </PayButton>
          </div>

          {paymentMethod === "momo" && (
            <div
              style={{
                marginTop:"14px",
                padding:"14px",
                borderRadius:"18px",
                background:"#eff6ff",
                border:"1px solid #dbeafe",
                boxShadow:"0 8px 18px rgba(29,78,216,0.08)"
              }}
            >
              <div
                style={{
                  fontSize:"13px",
                  fontWeight:"900",
                  color:"#1d4ed8",
                  marginBottom:"8px"
                }}
              >
                Mobile Money Number
              </div>

              <Input
                type="tel"
                placeholder="Enter MoMo number"
                value={momoNumber}
                onChange={(e)=>setMomoNumber(e.target.value)}
                style={{marginTop:"0"}}
              />

              <div
                style={{
                  marginTop:"8px",
                  fontSize:"12px",
                  fontWeight:"700",
                  color:"#64748b"
                }}
              >
                Use your active MTN MoMo number for payment confirmation.
              </div>
            </div>
          )}
        </OrderSection>

        <button
          type="button"
          onClick={()=>setShowConfirm(true)}
          style={{
            width:"220px",
            border:"none",
            borderRadius:"16px",
            padding:"14px 18px",
            marginTop:"24px",
            background:"linear-gradient(135deg,#0f172a,#1d4ed8)",
            color:"#facc15",
            fontSize:"15px",
            fontWeight:"900",
            cursor:"pointer",
            boxShadow:"0 12px 26px rgba(29,78,216,0.22)"
          }}
        >
          Create Order
        </button>
      </div>

      {showConfirm && (
        <div
          style={{
            background:"linear-gradient(135deg,#ffffff,#f8fafc)",
            borderRadius:"22px",
            padding:"22px",
            boxShadow:"0 12px 28px rgba(15,23,42,0.07)",
            border:"2px solid #facc15",
            marginTop:"24px"
          }}
        >
          <h2
            style={{
              fontSize:"24px",
              marginBottom:"16px",
              color:"#0f172a",
              display:"flex",
              alignItems:"center",
              gap:"10px",
              fontWeight:"900"
            }}
          >
            <span
              style={{
                width:"34px",
                height:"34px",
                borderRadius:"12px",
                display:"inline-flex",
                alignItems:"center",
                justifyContent:"center",
                background:"linear-gradient(135deg,#0f172a,#1d4ed8)",
                color:"#facc15",
                fontSize:"18px"
              }}
            >
              <FiPackage />
            </span>

            Confirm Your Order
          </h2>

          <ConfirmRow label="Pickup" value={pickupLocation} />
          <ConfirmRow label="Dropoff" value={dropoffLocation} />
          <ConfirmRow label="Item Notes" value={itemNotes || "None"} />
          <ConfirmRow label="Distance" value={`${distance} KM`} />
          <ConfirmRow label="Estimated Delivery Time" value={deliveryTime} />
          <ConfirmRow label="Delivery Fee" value={`₵${amount}`} />
          <ConfirmRow
            label="Payment Method"
            value={
              paymentMethod === "cash"
                ? "Cash on Delivery"
                : paymentMethod === "momo"
                ? "Mobile Money"
                : "Not selected"
            }
          />

          {paymentMethod === "momo" && (
            <ConfirmRow
              label="MoMo Number"
              value={momoNumber}
            />
          )}

          <div
            style={{
              display:"flex",
              gap:"10px",
              marginTop:"18px",
              flexWrap:"wrap"
            }}
          >
            <button
              type="button"
              onClick={createOrder}
              style={{
                border:"none",
                borderRadius:"14px",
                padding:"12px 16px",
                background:"#2563eb",
                color:"white",
                fontWeight:"900",
                cursor:"pointer",
                flex:1
              }}
            >
              Confirm Order
            </button>

            <button
              type="button"
              onClick={()=>setShowConfirm(false)}
              style={{
                border:"none",
                borderRadius:"14px",
                padding:"12px 16px",
                background:"#dc2626",
                color:"white",
                fontWeight:"900",
                cursor:"pointer",
                flex:1
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function OrderSection({step,title,children}) {
  return (
    <div
      style={{
        background:"linear-gradient(135deg,#ffffff,#f8fafc)",
        borderRadius:"18px",
        padding:"18px",
        marginBottom:"16px",
        border:"1px solid rgba(29,78,216,0.10)",
        boxShadow:"0 8px 20px rgba(15,23,42,0.04)"
      }}
    >
      <div
        style={{
          display:"flex",
          alignItems:"center",
          gap:"14px",
          marginBottom:"18px"
        }}
      >
        <div
          style={{
            width:"34px",
            height:"34px",
            borderRadius:"12px",
            background:"linear-gradient(135deg,#0f172a,#1d4ed8)",
            color:"#facc15",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            fontWeight:"900",
            fontSize:"15px"
          }}
        >
          {step}
        </div>

        <h3
          style={{
            fontSize:"19px",
            fontWeight:"900",
            color:"#0f172a",
            margin:0
          }}
        >
          {title}
        </h3>
      </div>

      {children}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      style={{
        width:"100%",
        padding:"15px 16px",
        borderRadius:"15px",
        border:"1px solid #dbe4ee",
        background:"white",
        fontSize:"15px",
        fontWeight:"600",
        outline:"none",
        color:"#0f172a",
        marginTop:"10px",
        boxSizing:"border-box",
        ...(props.style || {})
      }}
    />
  );
}

function LocationHint() {
  return (
    <div
      style={{
        display:"inline-flex",
        alignItems:"center",
        gap:"6px",
        marginTop:"10px",
        padding:"7px 10px",
        borderRadius:"999px",
        background:"#eff6ff",
        border:"1px solid #dbeafe",
        color:"#1d4ed8",
        fontSize:"12px",
        fontWeight:"800"
      }}
    >
      📍 House / Building, Street, Area, City
    </div>
  );
}

function SuggestionBox({children}) {
  return (
    <div
      style={{
        background:"#ffffff",
        border:"1px solid rgba(29,78,216,0.14)",
        borderRadius:"18px",
        marginTop:"10px",
        overflow:"hidden",
        boxShadow:"0 12px 26px rgba(15,23,42,0.08)"
      }}
    >
      {children}
    </div>
  );
}

function SuggestionItem({children,onClick}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding:"13px 15px",
        cursor:"pointer",
        borderBottom:"1px solid #eef2ff",
        fontSize:"14px",
        fontWeight:"700",
        color:"#0f172a",
        background:"#ffffff"
      }}
    >
      {children}
    </div>
  );
}

function FareItem({label,value}) {
  return (
    <div>
      <div
        style={{
          color:"rgba(255,255,255,0.92)",
          fontSize:"14px",
          fontWeight:"900",
          letterSpacing:"0.4px",
          textTransform:"uppercase",
          marginBottom:"6px"
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize:"30px",
          fontWeight:"900",
          color:"#facc15",
          marginTop:"4px"
        }}
      >
        {value}
      </div>
    </div>
  );
}

function PayButton({children,active,onClick}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        borderRadius:"14px",
        padding:"12px 16px",
        border:active
          ? "2px solid #0f172a"
          : "1px solid rgba(29,78,216,0.25)",
        background:active
          ? "linear-gradient(135deg,#facc15,#f59e0b)"
          : "linear-gradient(135deg,#0f172a,#1d4ed8)",
        color:active ? "#0f172a" : "white",
        fontWeight:"900",
        cursor:"pointer",
        flex:1
      }}
    >
      {children}
    </button>
  );
}

function ConfirmRow({label,value}) {
  return (
    <div
      style={{
        background:"#f8fafc",
        border:"1px solid #e5e7eb",
        borderRadius:"13px",
        padding:"10px 12px",
        color:"#334155",
        fontWeight:"700",
        marginBottom:"10px"
      }}
    >
      <strong>{label}:</strong>{" "}
      {value}
    </div>
  );
}