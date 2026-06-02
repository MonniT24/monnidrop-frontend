import React from "react";

import API from "../../api/api";

const customerImage =
  "https://ui-avatars.com/api/?name=Customer&background=2563eb&color=ffffff&size=256";

export default function CustomerProfile({
  user,
  setUser,

  profileEditing,
  setProfileEditing,

  profileImage,
  setProfileImage,

  profileName,
  setProfileName,

  profileEmail,
  setProfileEmail,

  profilePhone,
  setProfilePhone,

  profileAddress,
  setProfileAddress,

  profileDOB,
  setProfileDOB,

  profileGender,
  setProfileGender,

  profileEmergency,
  setProfileEmergency,

  saveProfile
}) {
  return (
    <div
      style={{
        display:"grid",
        gridTemplateColumns:"300px 1fr",
        gap:"24px"
      }}
    >
      <div
        style={{
          background:"linear-gradient(135deg,#0f172a,#1d4ed8)",
          borderRadius:"24px",
          padding:"18px 16px",
          alignSelf:"start",
          textAlign:"center",
          color:"white",
          height:"fit-content",
          boxShadow:"0 14px 30px rgba(15,23,42,0.16)"
        }}
      >
        <div
          style={{
            background:"#dcfce7",
            color:"#166534",
            borderRadius:"18px",
            padding:"10px 12px",
            fontSize:"12px",
            fontWeight:"900",
            marginBottom:"24px"
          }}
        >
          <span
            style={{
              display:"inline-block",
              width:"11px",
              height:"11px",
              background:"#22c55e",
              borderRadius:"50%",
              marginRight:"8px"
            }}
          />
          VERIFIED CUSTOMER PROFILE
        </div>

        <img
          src={
            profileImage ||
            user?.profileImage ||
            customerImage
          }
          alt="Customer"
          style={{
            width:"118px",
            height:"118px",
            borderRadius:"50%",
            objectFit:"cover",
            border:"5px solid #facc15",
            background:"white",
            boxShadow:
              "0 0 0 6px rgba(250,204,21,0.18), 0 12px 24px rgba(15,23,42,0.20)"
          }}
        />

        <h2
          style={{
            margin:"16px 0 4px",
            fontSize:"20px",
            fontWeight:"900"
          }}
        >
          {profileName || user?.name || "Customer"}
        </h2>

        <p
          style={{
            margin:0,
            color:"#dbeafe",
            fontSize:"14px",
            fontWeight:"800"
          }}
        >
          {profileEmail || user?.email || "No email"}
        </p>

        <div
          style={{
            display:"inline-flex",
            alignItems:"center",
            justifyContent:"center",
            gap:"8px",
            marginTop:"18px",
            marginBottom:"16px",
            padding:"9px 18px",
            borderRadius:"999px",
            background:"#dcfce7",
            color:"#166534",
            fontSize:"14px",
            fontWeight:"900"
          }}
        >
          <span
            style={{
              width:"13px",
              height:"13px",
              borderRadius:"50%",
              background:"#22c55e"
            }}
          />
          ACTIVE
        </div>

        <label
          htmlFor="profileUpload"
          style={{
            display:"inline-flex",
            justifyContent:"center",
            padding:"10px 16px",
            borderRadius:"14px",
            background:"#ffffff",
            color:"#0f172a",
            fontWeight:"900",
            cursor:"pointer",
            marginTop:"0",
            fontSize:"14px"
          }}
        >
          Choose File
        </label>

        <input
          id="profileUpload"
          type="file"
          accept="image/*"
          style={{
            display:"none"
          }}
          onChange={async(e)=>{

            const file =
              e.target.files[0];

            if(!file){
              return;
            }

            const formData =
              new FormData();

            formData.append(
              "profileImage",
              file
            );

            try{

              const res =
                await API.put(
                  "/customer/profile-image",
                  formData,
                  {
                    headers:{
                      "Content-Type":"multipart/form-data"
                    }
                  }
                );

              setUser(
                res.data.user
              );

              setProfileImage(
                res.data.user.profileImage || ""
              );

              alert(
                "Profile image updated successfully"
              );

              e.target.value = "";

            }catch(err){

              console.log(err);

              alert(
                err.response?.data?.message ||
                "Image upload failed"
              );
            }
          }}
        />
      </div>

      <div
        style={{
          background:"white",
          borderRadius:"24px",
          padding:"22px",
          border:"1px solid #e5e7eb",
          boxShadow:"0 12px 28px rgba(15,23,42,0.07)",
          position:"relative",
          overflow:"hidden"
        }}
      >
        <div
          style={{
            display:"flex",
            alignItems:"flex-start",
            justifyContent:"space-between",
            gap:"18px",
            marginBottom:"24px"
          }}
        >
          <div>
            <h2
              style={{
                margin:0,
                color:"#0f172a",
                fontSize:"26px",
                fontWeight:"900"
              }}
            >
              Personal Information
            </h2>

            <p
              style={{
                margin:"5px 0 0",
                color:"#64748b",
                fontSize:"14px",
                fontWeight:"800"
              }}
            >
              Manage your personal information and delivery preferences.
            </p>
          </div>

          <button
            type="button"
            onClick={()=>
              setProfileEditing(!profileEditing)
            }
            style={{
              minWidth:"110px",
              border:"none",
              borderRadius:"12px",
              padding:"10px 16px",
              background:"linear-gradient(135deg,#0f172a,#1d4ed8)",
              color:"#facc15",
              fontSize:"13px",
              fontWeight:"800",
              cursor:"pointer"
            }}
          >
            {profileEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        {
          profileEditing ? (

            <div
              style={{
                display:"grid",
                gridTemplateColumns:"repeat(2,1fr)",
                gap:"16px"
              }}
            >
              <ProfileInput
                placeholder="Full Name"
                value={profileName}
                onChange={(e)=>setProfileName(e.target.value)}
              />

              <ProfileInput
                placeholder="Email"
                value={profileEmail}
                onChange={(e)=>setProfileEmail(e.target.value)}
              />

              <ProfileInput
                placeholder="Phone"
                value={profilePhone}
                onChange={(e)=>setProfilePhone(e.target.value)}
              />

              <ProfileInput
                placeholder="Address"
                value={profileAddress}
                onChange={(e)=>setProfileAddress(e.target.value)}
              />

              <ProfileInput
                type="date"
                value={profileDOB}
                onChange={(e)=>setProfileDOB(e.target.value)}
              />

              <ProfileInput
                placeholder="Gender"
                value={profileGender}
                onChange={(e)=>setProfileGender(e.target.value)}
              />

              <ProfileInput
                placeholder="Emergency Contact"
                value={profileEmergency}
                onChange={(e)=>setProfileEmergency(e.target.value)}
              />

              <button
                type="button"
                onClick={saveProfile}
                style={{
                  border:"none",
                  borderRadius:"15px",
                  padding:"13px 16px",
                  background:"linear-gradient(135deg,#facc15,#f59e0b)",
                  color:"#0f172a",
                  fontSize:"14px",
                  fontWeight:"900",
                  cursor:"pointer"
                }}
              >
                Save Profile
              </button>
            </div>

          ) : (

            <>
              <InfoGrid>
                <InfoBox label="NAME" value={profileName || "Not added"} />
                <InfoBox label="EMAIL" value={profileEmail || "Not added"} />
                <InfoBox label="PHONE" value={profilePhone || "Not added"} />

                <div
                  style={{
                    display:"flex",
                    alignItems:"center",
                    gap:"8px",
                    color:"#0f172a",
                    fontSize:"16px",
                    fontWeight:"900"
                  }}
                >
                  <span
                    style={{
                      width:"13px",
                      height:"13px",
                      borderRadius:"50%",
                      background:"#22c55e"
                    }}
                  />
                  Online
                </div>
              </InfoGrid>

              <div
                style={{
                  height:"1px",
                  background:
                    "linear-gradient(90deg,transparent,#e5e7eb,transparent)",
                  margin:"22px 0"
                }}
              />

              <div
                style={{
                  display:"flex",
                  alignItems:"center",
                  gap:"10px",
                  marginBottom:"18px",
                  color:"#0f172a",
                  fontSize:"18px",
                  fontWeight:"900"
                }}
              >
                <span>📋</span>
                Customer Details
              </div>

              <InfoGrid>
                <InfoBox label="DATE OF BIRTH" value={profileDOB || "Not added"} />
                <InfoBox label="GENDER" value={profileGender || "Not added"} />
                <InfoBox label="EMERGENCY CONTACT" value={profileEmergency || "Not added"} />
                <InfoBox label="ADDRESS" value={profileAddress || "No address added"} />
              </InfoGrid>
            </>

          )
        }
      </div>
    </div>
  );
}

function ProfileInput(props){
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
        color:"#0f172a"
      }}
    />
  );
}

function InfoGrid({children}){
  return (
    <div
      style={{
        display:"grid",
        gridTemplateColumns:"repeat(2,1fr)",
        gap:"14px"
      }}
    >
      {children}
    </div>
  );
}

function InfoBox({label,value}){
  return (
    <div
      style={{
        background:"#f8fafc",
        border:"1px solid #e5e7eb",
        borderRadius:"14px",
        padding:"14px 16px"
      }}
    >
      <label
        style={{
          display:"block",
          color:"#64748b",
          fontSize:"11px",
          letterSpacing:"0.5px",
          fontWeight:"900",
          marginBottom:"6px"
        }}
      >
        {label}
      </label>

      <strong
        style={{
          color:"#0f172a",
          fontSize:"15px",
          fontWeight:"800",
          lineHeight:"1.3",
          wordBreak:"break-word"
        }}
      >
        {value}
      </strong>
    </div>
  );
}