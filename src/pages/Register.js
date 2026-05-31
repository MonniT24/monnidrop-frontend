import React,{
  useState
} from "react";

import {
  useNavigate,
  Link
} from "react-router-dom";

import styled from "styled-components";

import {
  Eye,
  EyeOff
} from "lucide-react";

import API from "../api/api";

import logo from "../assets/logo.png";

// STYLES

const Page = styled.div`
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  background:linear-gradient(135deg,#eff6ff,#f8fafc);
`;

const Card = styled.div`
  width:390px;
  background:white;
  padding:32px;
  border-radius:24px;
  box-shadow:0 12px 30px rgba(0,0,0,0.18);
`;

const Logo = styled.img`
  width:140px;
  height:140px;
  object-fit:contain;
  display:block;
  margin:0 auto 15px;
`;

const Title = styled.h2`
  text-align:center;
  margin-bottom:22px;
  color:#111827;
  font-size:28px;
  font-weight:800;
`;

const Text = styled.p`
  text-align:center;
  color:#4b5563;
  font-size:15px;
  line-height:1.6;
  margin-bottom:20px;
`;

const Input = styled.input`
  width:100%;
  padding:13px;
  border:1px solid #d1d5db;
  border-radius:12px;
  margin-bottom:14px;
  font-size:14px;
  box-sizing:border-box;
  outline:none;

  &:focus{
    border-color:#facc15;
    box-shadow:0 0 0 3px rgba(250,204,21,0.18);
  }
`;

const Select = styled.select`
  width:100%;
  padding:13px;
  border:1px solid #d1d5db;
  border-radius:12px;
  margin-bottom:14px;
  font-size:14px;
  background:white;
  outline:none;

  &:focus{
    border-color:#facc15;
    box-shadow:0 0 0 3px rgba(250,204,21,0.18);
  }
`;

const PasswordWrap = styled.div`
  position:relative;
  margin-bottom:14px;
`;

const PasswordInput = styled.input`
  width:100%;
  padding:13px 45px 13px 13px;
  border:1px solid #d1d5db;
  border-radius:12px;
  font-size:14px;
  box-sizing:border-box;
  outline:none;

  &:focus{
    border-color:#facc15;
    box-shadow:0 0 0 3px rgba(250,204,21,0.18);
  }
`;

const EyeButton = styled.button`
  position:absolute;
  right:12px;
  top:50%;
  transform:translateY(-50%);
  background:none;
  border:none;
  cursor:pointer;
  color:#6b7280;
`;

const PhoneWrap = styled.div`
  display:flex;
  margin-bottom:14px;
`;

const CountryBox = styled.div`
  width:115px;
  padding:12px;
  border:1px solid #d1d5db;
  border-right:none;
  border-radius:12px 0 0 12px;
  background:#f9fafb;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  font-weight:700;
  color:#111827;
`;

const Flag = styled.img`
  width:24px;
  height:18px;
  object-fit:cover;
  border-radius:3px;
  box-shadow:0 1px 3px rgba(0,0,0,0.2);
`;

const PhoneInput = styled.input`
  flex:1;
  padding:13px;
  border:1px solid #d1d5db;
  border-radius:0 12px 12px 0;
  font-size:14px;
  outline:none;

  &:focus{
    border-color:#facc15;
    box-shadow:0 0 0 3px rgba(250,204,21,0.18);
  }
`;

const Button = styled.button`
  width:100%;
  background:#ef4444;
  color:white;
  border:none;
  padding:14px;
  border-radius:16px;
  font-size:15px;
  font-weight:800;
  cursor:pointer;
  transition:0.25s ease;
  margin-bottom:${props=>props.$space ? "14px" : "0"};

  &:hover{
    opacity:0.92;
  }

  &:disabled{
    opacity:0.6;
    cursor:not-allowed;
  }
`;

const Bottom = styled.div`
  margin-top:20px;
  text-align:center;
  font-size:14px;
  color:#4b5563;
`;

const StyledLink = styled(Link)`
  color:#111827;
  font-weight:700;
  text-decoration:none;
`;

export default function Register(){

  const navigate =
    useNavigate();

  const [name,setName] =
    useState("");

  const [email,setEmail] =
    useState("");

  const [password,setPassword] =
    useState("");

  const [role,setRole] =
    useState("customer");

  const [showPassword,setShowPassword] =
    useState(false);

  const [phone,setPhone] =
    useState("");

  const [gender,setGender] =
    useState("");

  const [dob,setDob] =
    useState("");

  const [loading,setLoading] =
    useState(false);

  const [otp,setOtp] =
    useState("");

  const [otpSent,setOtpSent] =
    useState(false);

  const [phoneVerified,setPhoneVerified] =
    useState(false);

  const [phoneVerificationToken,setPhoneVerificationToken] =
    useState("");

  const [showWelcome,setShowWelcome] =
    useState(false);

  const formatPhone = ()=>{

    const cleanedPhone =
      phone.replace(/\D/g,"");

    if(cleanedPhone.startsWith("0")){

      return `+233${cleanedPhone.slice(1)}`;
    }

    return `+233${cleanedPhone}`;
  };

  const sendOtp =
    async()=>{

      try{

        if(!phone){

          return alert(
            "Enter your phone number first"
          );
        }

        const cleanedPhone =
          phone.replace(/\D/g,"");

        if(cleanedPhone.length < 9){

          return alert(
            "Invalid phone number"
          );
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

        alert(
          "OTP sent to your phone"
        );

      }catch(err){

        console.log(err);

        alert(
          err.response?.data?.message ||
          "Failed to send OTP"
        );
      }
    };

  const verifyOtp =
    async()=>{

      try{

        if(!otp){

          return alert(
            "Enter OTP number"
          );
        }

        const fullPhone =
          formatPhone();

        const res =
          await API.post(
            "/auth/verify-registration-otp",
            {
              phone:fullPhone,
              otp
            }
          );

        setPhoneVerified(true);

        setPhoneVerificationToken(
          res.data.phoneVerificationToken
        );

        alert(
          "Phone number verified successfully"
        );

      }catch(err){

        console.log(err);

        alert(
          err.response?.data?.message ||
          "OTP verification failed"
        );
      }
    };

  const submitHandler =
    async(e)=>{

      e.preventDefault();

      try{

        if(!phone){

          return alert(
            "Phone number required"
          );
        }

        const cleanedPhone =
          phone.replace(/\D/g,"");

        if(cleanedPhone.length < 9){

          return alert(
            "Invalid phone number"
          );
        }

        if(!phoneVerified){

          return alert(
            "Please verify your phone number first"
          );
        }

        if(!gender){

          return alert(
            "Please select your gender"
          );
        }

        if(!dob){

          return alert(
            "Please select your date of birth"
          );
        }

        setLoading(true);

        const fullPhone =
          formatPhone();

        const res =
          await API.post(
            "/auth/register",
            {
              name,
              email,
              password,
              phone:fullPhone,
              gender,
              dob,
              role,
              phoneVerificationToken
            }
          );

        localStorage.setItem(
          "token",
          res.data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            res.data.user
          )
        );

        setShowWelcome(true);

        setTimeout(()=>{

          navigate("/customer");

        },2500);

      }catch(err){

        console.log(err);

        alert(
          err.response?.data?.message ||
          "Registration failed"
        );

      }finally{

        setLoading(false);
      }
    };

  if(showWelcome){

    return(

      <Page>

        <Card>

          <Logo
            src={logo}
            alt="MonniDrop Logo"
          />

          <Title>
            Welcome to MonniDrop 🎉
          </Title>

          <Text>
            Your account has been created successfully.
            You are being signed in automatically.
          </Text>

          <Button
            type="button"
            onClick={()=>
              navigate("/customer")
            }
          >
            Continue to Dashboard
          </Button>

        </Card>

      </Page>
    );
  }

  return(

    <Page>

      <Card>

        <Logo
          src={logo}
          alt="MonniDrop Logo"
        />

        <Title>
          Create Account
        </Title>

        <form onSubmit={submitHandler}>

          <Input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e)=>
              setName(e.target.value)
            }
            required
          />

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>
              setEmail(e.target.value)
            }
            required
          />

          <Select
            value={role}
            onChange={(e)=>
              setRole(e.target.value)
            }
          >
            <option value="customer">
              Customer
            </option>
          </Select>

          <Select
            value={gender}
            onChange={(e)=>
              setGender(e.target.value)
            }
            required
          >
            <option value="">
              Select Gender
            </option>

            <option value="Male">
              Male
            </option>

            <option value="Female">
              Female
            </option>

            <option value="Other">
              Other
            </option>
          </Select>

          <Input
            type="date"
            value={dob}
            onChange={(e)=>
              setDob(e.target.value)
            }
            required
          />

          <PasswordWrap>

            <PasswordInput
              type={
                showPassword
                ? "text"
                : "password"
              }
              placeholder="Password"
              value={password}
              onChange={(e)=>
                setPassword(e.target.value)
              }
              required
            />

            <EyeButton
              type="button"
              onClick={()=>
                setShowPassword(!showPassword)
              }
            >
              {
                showPassword
                ? <EyeOff size={20}/>
                : <Eye size={20}/>
              }
            </EyeButton>

          </PasswordWrap>

          <PhoneWrap>

            <CountryBox>

              <Flag
                src="https://flagcdn.com/w40/gh.png"
                alt="Ghana Flag"
              />

              +233

            </CountryBox>

            <PhoneInput
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e)=>{

                setPhone(e.target.value);
                setPhoneVerified(false);
                setOtpSent(false);
                setOtp("");
                setPhoneVerificationToken("");

              }}
              required
            />

          </PhoneWrap>

          {!phoneVerified && (
            <Button
              type="button"
              onClick={sendOtp}
              $space
              style={{
                background:"#2563eb"
              }}
            >
              {
                otpSent
                ? "Resend OTP"
                : "Send OTP"
              }
            </Button>
          )}

          {otpSent && !phoneVerified && (
            <>
              <Input
                type="text"
                placeholder="Enter OTP number"
                value={otp}
                onChange={(e)=>
                  setOtp(e.target.value)
                }
              />

              <Button
                type="button"
                onClick={verifyOtp}
                $space
                style={{
                  background:"#16a34a"
                }}
              >
                Verify OTP
              </Button>
            </>
          )}

          {phoneVerified && (
            <p
              style={{
                color:"#16a34a",
                fontWeight:"800",
                textAlign:"center",
                marginBottom:"14px"
              }}
            >
              Phone number verified
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
          >
            {
              loading
              ? "Creating..."
              : "Register"
            }
          </Button>

        </form>

        <Bottom>
          Already have an account?{" "}

          <StyledLink to="/login">
            Login
          </StyledLink>
        </Bottom>

      </Card>

    </Page>
  );
}