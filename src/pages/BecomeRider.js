import React,{useState} from "react";
import API from "../api/api";
import {useNavigate} from "react-router-dom";
import logo from "../assets/logo.png";

function BecomeRider(){

  const navigate = useNavigate();

  const [form,setForm] = useState({
    name:"",
    phone:"",
    email:"",
    ghanaCardNumber:"",
    ghanaCardImage:null,
    motorName:"",
    motorNumber:"",
    motorColor:"",
    emergencyContactName:"",
    emergencyContactPhone:"",
    password:"",
    confirmPassword:""
  });

  const [loading,setLoading] = useState(false);
  const [message,setMessage] = useState("");
  const [otp,setOtp] = useState("");
  const [otpSent,setOtpSent] = useState(false);
  const [phoneVerified,setPhoneVerified] = useState(false);

  const formatPhone = ()=>{

    const cleanedPhone =
      form.phone.replace(/\D/g,"");

    if(cleanedPhone.startsWith("0")){
      return `+233${cleanedPhone.slice(1)}`;
    }

    return `+233${cleanedPhone}`;
  };

  const sendOtp = async()=>{

    try{

      if(!form.phone){
        setMessage("Enter your phone number first");
        return;
      }

      const cleanedPhone =
        form.phone.replace(/\D/g,"");

      if(cleanedPhone.length < 9){
        setMessage("Invalid phone number");
        return;
      }

      const fullPhone =
        formatPhone();

      await API.post(
        "/auth/send-registration-otp",
        {
          phone:fullPhone
        }
      );

      setOtpSent(true);

      setMessage(
        "OTP sent to your phone"
      );

    }catch(error){

      setMessage(
        error.response?.data?.message ||
        "Failed to send OTP"
      );
    }
  };

  const verifyOtp = async()=>{

    try{

      if(!otp){
        setMessage("Enter OTP code");
        return;
      }

      const fullPhone =
        formatPhone();

      await API.post(
        "/auth/verify-registration-otp",
        {
          phone:fullPhone,
          otp
        }
      );

      setPhoneVerified(true);

      setMessage(
        "Phone number verified successfully"
      );

    }catch(error){

      setMessage(
        error.response?.data?.message ||
        "OTP verification failed"
      );
    }
  };

  const handleChange = (e)=>{

    if(e.target.name === "phone"){
      setPhoneVerified(false);
      setOtpSent(false);
      setOtp("");
    }

    setForm({
      ...form,
      [e.target.name]:e.target.value
    });
  };

  const submitRiderApplication = async(e)=>{

    e.preventDefault();

    if(!phoneVerified){
      setMessage(
        "Please verify your phone number before submitting"
      );
      return;
    }

    if(form.password !== form.confirmPassword){
      setMessage("Passwords do not match");
      return;
    }

    try{

      setLoading(true);
      setMessage("");

      const formData =
        new FormData();

      Object.keys(form).forEach((key)=>{

        if(key !== "confirmPassword"){
          formData.append(
            key,
            form[key]
          );
        }
      });

      formData.set(
        "phone",
        formatPhone()
      );

      await API.post(
        "/auth/register-rider",
        formData,
        {
          headers:{
            "Content-Type":"multipart/form-data"
          }
        }
      );

     setMessage(
      "Application submitted successfully. Status: Pending Admin Approval."
    );

    setLoading(false);

    }catch(error){

      setMessage(
        error.response?.data?.message ||
        "Failed to submit rider application"
      );

    }finally{

      setLoading(false);
    }
  };

  const inputStyle = {
    width:"100%",
    padding:"14px",
    borderRadius:"12px",
    border:"1px solid #d1d5db",
    marginBottom:"12px",
    fontSize:"15px",
    outline:"none",
    boxSizing:"border-box"
  };

  const labelStyle = {
    fontWeight:"800",
    marginBottom:"6px",
    display:"block",
    color:"#0f172a"
  };

  const sectionTitle = {
    fontSize:"20px",
    fontWeight:"900",
    color:"#1d4ed8",
    margin:"22px 0 14px"
  };

  const otpButtonStyle = {
    border:"none",
    borderRadius:"12px",
    padding:"12px 16px",
    background:"#1d4ed8",
    color:"#ffffff",
    fontWeight:"900",
    cursor:"pointer",
    transition:"all 0.25s ease"
  };

  const verifyButtonStyle = {
    border:"none",
    borderRadius:"12px",
    padding:"12px 16px",
    background:"#0f172a",
    color:"#facc15",
    fontWeight:"900",
    cursor:"pointer",
    marginBottom:"12px",
    transition:"all 0.25s ease"
  };

  return (

    <div
      style={{
        minHeight:"100vh",
        background:"#f8fafc",
        padding:"20px"
      }}
    >

      <div
        style={{
          maxWidth:"720px",
          margin:"0 auto",
          background:"#ffffff",
          borderRadius:"24px",
          padding:"24px",
          boxShadow:"0 12px 30px rgba(15,23,42,0.08)"
        }}
      >

        <img
          src={logo}
          alt="MB Swift Logo"
          style={{
            width:"clamp(190px,55vw,260px)",
            height:"auto",
            objectFit:"contain",
            display:"block",
            margin:"0 auto 6px"
          }}
        />

        <button
          type="button"
          onClick={()=>navigate("/")}
          style={{
            border:"none",
            background:"transparent",
            fontSize:"18px",
            fontWeight:"900",
            cursor:"pointer",
            marginBottom:"8px",
            color:"#0f172a"
          }}
        >
          ← Back
        </button>

        <h1
          style={{
            margin:"0 0 8px",
            color:"#0f172a",
            fontSize:"30px",
            fontWeight:"900",
            textAlign:"center"
          }}
        >
          Become a Rider
        </h1>

        {message && (

          <div
            style={{
              background:"#eff6ff",
              color:"#1d4ed8",
              padding:"13px",
              borderRadius:"12px",
              fontWeight:"800",
              marginBottom:"16px"
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={submitRiderApplication}>

          <div style={sectionTitle}>
            1. Personal Details
          </div>

          <label style={labelStyle}>
            Full Name *
          </label>

          <input
            style={inputStyle}
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label style={labelStyle}>
            Phone Number *
          </label>

          <input
            style={inputStyle}
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <label style={labelStyle}>
            Email Optional
          </label>

          <input
            style={inputStyle}
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
          />

          <div style={sectionTitle}>
            2. Identity Verification
          </div>

          <label style={labelStyle}>
            Ghana Card Number *
          </label>

          <input
            style={inputStyle}
            name="ghanaCardNumber"
            value={form.ghanaCardNumber}
            onChange={handleChange}
            required
            placeholder="GHA-XXXXXXXXX-X"
          />

          <label style={labelStyle}>
            Upload Ghana Card *
          </label>

          <input
            style={inputStyle}
            type="file"
            accept="image/*,.pdf"
            onChange={(e)=>{
              setForm({
                ...form,
                ghanaCardImage:e.target.files[0]
              });
            }}
            required
          />

          <div style={sectionTitle}>
            3. Motor Details
          </div>

          <label style={labelStyle}>
            Motor Name *
          </label>

          <input
            style={inputStyle}
            name="motorName"
            value={form.motorName}
            onChange={handleChange}
            required
          />

          <label style={labelStyle}>
            Registration Number *
          </label>

          <input
            style={inputStyle}
            name="motorNumber"
            value={form.motorNumber}
            onChange={handleChange}
            required
          />

          <label style={labelStyle}>
            Motor Color *
          </label>

          <input
            style={inputStyle}
            name="motorColor"
            value={form.motorColor}
            onChange={handleChange}
            required
          />

          <div style={sectionTitle}>
            4. Emergency Contact
          </div>

          <label style={labelStyle}>
            Emergency Contact Name *
          </label>

          <input
            style={inputStyle}
            name="emergencyContactName"
            value={form.emergencyContactName}
            onChange={handleChange}
            required
          />

          <label style={labelStyle}>
            Emergency Contact Phone *
          </label>

          <input
            style={inputStyle}
            name="emergencyContactPhone"
            value={form.emergencyContactPhone}
            onChange={handleChange}
            required
          />

          <div style={sectionTitle}>
            5. Account Setup
          </div>

          <label style={labelStyle}>
            Password *
          </label>

          <input
            style={inputStyle}
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            required
          />

          <label style={labelStyle}>
            Confirm Password *
          </label>

          <input
            style={inputStyle}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            type="password"
            required
          />

          <div style={sectionTitle}>
            6. Phone Verification
          </div>

          <div
            style={{
              display:"flex",
              gap:"10px",
              marginBottom:"12px",
              flexWrap:"wrap",
              alignItems:"center"
            }}
          >

            <button
              type="button"
              onClick={sendOtp}
              disabled={phoneVerified}
              onMouseEnter={(e)=>{
                if(!phoneVerified){
                  e.currentTarget.style.background =
                    "#0f172a";

                  e.currentTarget.style.color =
                    "#facc15";

                  e.currentTarget.style.transform =
                    "translateY(-2px)";
                }
              }}
              onMouseLeave={(e)=>{
                if(!phoneVerified){
                  e.currentTarget.style.background =
                    "#1d4ed8";

                  e.currentTarget.style.color =
                    "#ffffff";

                  e.currentTarget.style.transform =
                    "translateY(0)";
                }
              }}
              style={{
                ...otpButtonStyle,
                background:phoneVerified
                  ? "#16a34a"
                  : "#1d4ed8",
                cursor:phoneVerified
                  ? "not-allowed"
                  : "pointer"
              }}
            >
              {
                phoneVerified
                ? "Phone Verified"
                : otpSent
                ? "Resend OTP"
                : "Send OTP"
              }
            </button>

            {phoneVerified && (

              <div
                style={{
                  color:"#16a34a",
                  fontWeight:"900"
                }}
              >
                ✓ Verified
              </div>
            )}

          </div>

          {otpSent && !phoneVerified && (

            <>

              <input
                style={inputStyle}
                placeholder="Enter OTP"
                value={otp}
                onChange={(e)=>setOtp(e.target.value)}
              />

              <button
                type="button"
                onClick={verifyOtp}
                onMouseEnter={(e)=>{
                  e.currentTarget.style.background =
                    "#1d4ed8";

                  e.currentTarget.style.color =
                    "#ffffff";

                  e.currentTarget.style.transform =
                    "translateY(-2px)";
                }}
                onMouseLeave={(e)=>{
                  e.currentTarget.style.background =
                    "#0f172a";

                  e.currentTarget.style.color =
                    "#facc15";

                  e.currentTarget.style.transform =
                    "translateY(0)";
                }}
                style={verifyButtonStyle}
              >
                Verify OTP
              </button>

            </>

          )}

          <button
            type="submit"
            disabled={loading}
            onMouseEnter={(e)=>{
              if(!loading){
                e.currentTarget.style.background =
                  "#0f172a";

                e.currentTarget.style.color =
                  "#facc15";

                e.currentTarget.style.transform =
                  "translateY(-2px)";

                e.currentTarget.style.boxShadow =
                  "0 10px 24px rgba(15,23,42,0.35)";
              }
            }}
            onMouseLeave={(e)=>{
              e.currentTarget.style.background =
                "#1d4ed8";

              e.currentTarget.style.color =
                "#ffffff";

              e.currentTarget.style.transform =
                "translateY(0)";

              e.currentTarget.style.boxShadow =
                "0 10px 24px rgba(29,78,216,0.25)";
            }}
            style={{
              width:"100%",
              padding:"15px",
              borderRadius:"14px",
              border:"none",
              background:"#1d4ed8",
              color:"#ffffff",
              fontWeight:"900",
              fontSize:"17px",
              cursor:loading
                ? "not-allowed"
                : "pointer",
              marginTop:"12px",
              transition:"all 0.25s ease",
              boxShadow:"0 10px 24px rgba(29,78,216,0.25)"
            }}
          >
            {
              loading
              ? "Submitting..."
              : "Submit Rider Application"
            }
          </button>

        </form>

      </div>

    </div>
  );
}

export default BecomeRider;