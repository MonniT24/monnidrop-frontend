import React,{
  useState
} from "react";

import styled from "styled-components";

import {
  FiMail,
  FiLock,
  FiLogIn
} from "react-icons/fi";

import {
  Eye,
  EyeOff
} from "lucide-react";

import API from "../api/api";

import logo from "../assets/logo.png";

const Page = styled.div`
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  background:linear-gradient(135deg,#eff6ff,#f8fafc);
  padding:20px;
`;

const Card = styled.div`
  width:100%;
  max-width:430px;
  background:white;
  border-radius:32px;
  padding:40px 34px;
  box-shadow:0 10px 40px rgba(15,23,42,0.08);
`;

const LogoWrap = styled.div`
  display:flex;
  justify-content:center;
  margin-bottom:26px;
`;

const Logo = styled.img`
  width:260px;
  max-width:100%;
  object-fit:contain;

  filter:
    drop-shadow(0 12px 24px rgba(0,0,0,0.15));

  transition:0.3s ease;
`;

const Title = styled.h1`
  font-size:30px;
  font-weight:800;
  text-align:center;
  color:#0f172a;
  margin-bottom:8px;
`;

const Subtitle = styled.p`
  text-align:center;
  color:#64748b;
  margin-bottom:28px;
  font-size:15px;
`;

const InputWrap = styled.div`
  position:relative;
  margin-bottom:18px;
`;

const Icon = styled.div`
  position:absolute;
  left:16px;
  top:50%;
  transform:translateY(-50%);
  color:#94a3b8;
  font-size:18px;
`;

const Input = styled.input`
  width:100%;
  padding:16px 16px 16px 48px;
  border:1px solid #e2e8f0;
  border-radius:16px;
  font-size:15px;
  outline:none;
  transition:0.25s ease;
  box-sizing:border-box;

  &:focus{
    border-color:#2563eb;
    box-shadow:0 0 0 4px rgba(37,99,235,0.1);
  }
`;

const Forgot = styled.div`
  text-align:right;
  margin-bottom:24px;

  button{
    color:#2563eb;
    font-size:14px;
    text-decoration:none;
    font-weight:700;
    background:none;
    border:none;
    cursor:pointer;
  }
`;

const Button = styled.button`
  width:100%;
  border:none;
  border-radius:18px;
  padding:16px;
  background:#ef4444;
  color:white;
  font-size:16px;
  font-weight:700;
  cursor:pointer;
  transition:0.25s ease;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:10px;
  margin-bottom:${props =>
    props.$space ? "12px" : "0"};

  &:hover{
    background:#dc2626;
  }

  &:disabled{
    opacity:0.65;
    cursor:not-allowed;
  }
`;

const SecondaryButton = styled.button`
  width:100%;
  border:none;
  border-radius:18px;
  padding:15px;
  background:#f1f5f9;
  color:#0f172a;
  font-size:15px;
  font-weight:800;
  cursor:pointer;
  transition:0.25s ease;

  &:hover{
    background:#e2e8f0;
  }
`;

const BottomText = styled.div`
  margin-top:24px;
  text-align:center;
  font-size:14px;
  color:#64748b;

  a{
    color:#2563eb;
    text-decoration:none;
    font-weight:700;
  }
`;

const SuccessText = styled.div`
  background:#dcfce7;
  color:#166534;
  padding:12px;
  border-radius:14px;
  font-size:14px;
  font-weight:800;
  text-align:center;
  margin-bottom:16px;
`;

export default function Login(){

  const [email,setEmail] =
    useState("");

  const [password,setPassword] =
    useState("");

  const [showPassword,setShowPassword] =
    useState(false);

  const [forgotMode,setForgotMode] =
    useState(false);

  const [forgotStep,setForgotStep] =
    useState("email");

  const [forgotEmail,setForgotEmail] =
    useState("");

  const [otp,setOtp] =
    useState("");

  const [resetToken,setResetToken] =
    useState("");

  const [newPassword,setNewPassword] =
    useState("");

  const [showNewPassword,setShowNewPassword] =
    useState(false);

  const [loading,setLoading] =
    useState(false);

  const [adminOtpMode,setAdminOtpMode] =
    useState(false);

  const [adminLoginToken,setAdminLoginToken] =
    useState("");

  const [adminOtp,setAdminOtp] =
    useState("");

  async function login(e){

    e.preventDefault();

    try{

      setLoading(true);

      const res =
        await API.post(
          "/auth/login",
          {
            email,
            password
          }
        );

      if(res.data.requiresAdminOtp){

        setAdminLoginToken(
          res.data.adminLoginToken
        );

        setAdminOtpMode(true);

        alert(
          "Admin OTP sent to your phone"
        );

        return;
      }

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

      localStorage.setItem(
        "role",
        res.data.user.role
      );

      const role =
        res.data.user.role;

      if(role === "admin"){

        window.location.href =
          "/admin";
      }

      else if(role === "rider"){

        window.location.href =
          "/rider";
      }

      else{

        window.location.href =
          "/customer";
      }

    }catch(err){

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Login failed"
      );

    }finally{

      setLoading(false);
    }
  }

  async function verifyAdminOtp(){

    try{

      if(!adminOtp){

        return alert(
          "Enter admin OTP"
        );
      }

      setLoading(true);

      const res =
        await API.post(
          "/auth/verify-admin-login-otp",
          {
            adminLoginToken,
            otp:adminOtp
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

      localStorage.setItem(
        "role",
        res.data.user.role
      );

      window.location.href =
        "/admin";

    }catch(err){

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Admin OTP verification failed"
      );

    }finally{

      setLoading(false);
    }
  }

  async function sendForgotOtp(){

    try{

      if(!forgotEmail){

        return alert(
          "Enter your account email"
        );
      }

      setLoading(true);

      await API.post(
        "/auth/forgot-password-send-otp",
        {
          email:forgotEmail
        }
      );

      setForgotStep("otp");

      alert(
        "OTP sent to your registered phone number"
      );

    }catch(err){

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Failed to send OTP"
      );

    }finally{

      setLoading(false);
    }
  }

  async function verifyForgotOtp(){

    try{

      if(!otp){

        return alert(
          "Enter OTP"
        );
      }

      setLoading(true);

      const res =
        await API.post(
          "/auth/forgot-password-verify-otp",
          {
            email:forgotEmail,
            otp
          }
        );

      setResetToken(
        res.data.resetToken
      );

      setForgotStep("password");

      alert(
        "OTP verified successfully"
      );

    }catch(err){

      console.log(err);

      alert(
        err.response?.data?.message ||
        "OTP verification failed"
      );

    }finally{

      setLoading(false);
    }
  }

  async function resetPassword(){

    try{

      if(!newPassword){

        return alert(
          "Enter new password"
        );
      }

      if(newPassword.length < 6){

        return alert(
          "Password must be at least 6 characters"
        );
      }

      setLoading(true);

      await API.post(
        "/auth/reset-password",
        {
          resetToken,
          newPassword
        }
      );

      alert(
        "Password reset successfully. Please login."
      );

      setForgotMode(false);
      setForgotStep("email");
      setForgotEmail("");
      setOtp("");
      setResetToken("");
      setNewPassword("");
      setPassword("");

    }catch(err){

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Password reset failed"
      );

    }finally{

      setLoading(false);
    }
  }

  if(adminOtpMode){

    return(

      <Page>

        <Card>

          <LogoWrap>
            <Logo
              src={logo}
              alt="MB Swift Logo"
            />
          </LogoWrap>

          <Title>
            Admin Verification
          </Title>

          <Subtitle>
            Enter the OTP sent to your admin phone number.
          </Subtitle>

          <SuccessText>
            Admin password verified. OTP is required to continue.
          </SuccessText>

          <InputWrap>

            <Icon>
              <FiLock />
            </Icon>

            <Input
              type="text"
              placeholder="Enter admin OTP"
              value={adminOtp}
              onChange={(e)=>
                setAdminOtp(
                  e.target.value.replace(/\D/g,"")
                )
              }
            />

          </InputWrap>

          <Button
            type="button"
            onClick={verifyAdminOtp}
            disabled={loading}
            $space
          >
            {
              loading
              ? "Verifying..."
              : "Verify Admin OTP"
            }
          </Button>

          <SecondaryButton
            type="button"
            onClick={()=>{
              setAdminOtpMode(false);
              setAdminLoginToken("");
              setAdminOtp("");
              setPassword("");
            }}
          >
            Back to Login
          </SecondaryButton>

        </Card>

      </Page>
    );
  }

  if(forgotMode){

    return(

      <Page>

        <Card>

          <LogoWrap>
            <Logo
              src={logo}
              alt="MB Swift Logo"
            />
          </LogoWrap>

          <Title>
            Reset Password
          </Title>

          <Subtitle>
            We will send an OTP to the phone number linked to your account.
          </Subtitle>

          {
            forgotStep === "email" && (
              <>

                <InputWrap>

                  <Icon>
                    <FiMail />
                  </Icon>

                  <Input
                    type="email"
                    placeholder="Enter your account email"
                    value={forgotEmail}
                    onChange={(e)=>
                      setForgotEmail(e.target.value)
                    }
                  />

                </InputWrap>

                <Button
                  type="button"
                  onClick={sendForgotOtp}
                  disabled={loading}
                  $space
                >
                  {
                    loading
                    ? "Sending..."
                    : "Send OTP"
                  }
                </Button>

              </>
            )
          }

          {
            forgotStep === "otp" && (
              <>

                <SuccessText>
                  OTP sent. Enter the code from your phone.
                </SuccessText>

                <InputWrap>

                  <Icon>
                    <FiLock />
                  </Icon>

                  <Input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e)=>
                      setOtp(
                        e.target.value.replace(/\D/g,"")
                      )
                    }
                  />

                </InputWrap>

                <Button
                  type="button"
                  onClick={verifyForgotOtp}
                  disabled={loading}
                  $space
                >
                  {
                    loading
                    ? "Verifying..."
                    : "Verify OTP"
                  }
                </Button>

                <SecondaryButton
                  type="button"
                  onClick={sendForgotOtp}
                  disabled={loading}
                >
                  Resend OTP
                </SecondaryButton>

              </>
            )
          }

          {
            forgotStep === "password" && (
              <>

                <SuccessText>
                  OTP verified. Create your new password.
                </SuccessText>

                <InputWrap>

                  <Icon>
                    <FiLock />
                  </Icon>

                  <Input
                    type={
                      showNewPassword
                      ? "text"
                      : "password"
                    }
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e)=>
                      setNewPassword(e.target.value)
                    }
                    style={{
                      paddingRight:"52px"
                    }}
                  />

                  <button
                    type="button"
                    onClick={()=>
                      setShowNewPassword(
                        !showNewPassword
                      )
                    }
                    style={{
                      position:"absolute",
                      right:"16px",
                      top:"50%",
                      transform:"translateY(-50%)",
                      border:"none",
                      background:"none",
                      cursor:"pointer",
                      color:"#64748b"
                    }}
                  >
                    {
                      showNewPassword
                      ? <EyeOff size={20} />
                      : <Eye size={20} />
                    }
                  </button>

                </InputWrap>

                <Button
                  type="button"
                  onClick={resetPassword}
                  disabled={loading}
                  $space
                >
                  {
                    loading
                    ? "Resetting..."
                    : "Reset Password"
                  }
                </Button>

              </>
            )
          }

          <SecondaryButton
            type="button"
            onClick={()=>{
              setForgotMode(false);
              setForgotStep("email");
              setOtp("");
              setResetToken("");
              setNewPassword("");
            }}
          >
            Back to Login
          </SecondaryButton>

        </Card>

      </Page>
    );
  }

  return(

    <Page>

      <Card>

        <LogoWrap>
          <Logo
            src={logo}
            alt="MB Swift Logo"
          />
        </LogoWrap>

        <Title>
          Welcome Back
        </Title>

        <Subtitle>
          Login to continue.
        </Subtitle>

        <form onSubmit={login}>

          <InputWrap>

            <Icon>
              <FiMail />
            </Icon>

            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e)=>
                setEmail(e.target.value)
              }
              required
            />

          </InputWrap>

          <InputWrap>

            <Icon>
              <FiLock />
            </Icon>

            <Input
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
              style={{
                paddingRight:"52px"
              }}
            />

            <button
              type="button"
              onClick={()=>
                setShowPassword(
                  !showPassword
                )
              }
              style={{
                position:"absolute",
                right:"16px",
                top:"50%",
                transform:"translateY(-50%)",
                border:"none",
                background:"none",
                cursor:"pointer",
                color:"#64748b"
              }}
            >
              {
                showPassword
                ? <EyeOff size={20} />
                : <Eye size={20} />
              }
            </button>

          </InputWrap>

          <Forgot>
            <button
              type="button"
              onClick={()=>{
                setForgotEmail(email);
                setForgotMode(true);
              }}
            >
              Forgot Password?
            </button>
          </Forgot>

          <Button
            type="submit"
            disabled={loading}
          >
            <FiLogIn />

            {
              loading
              ? "Logging in..."
              : "Login"
            }
          </Button>

        </form>

        <BottomText>
          Don't have an account?{" "}
          <a href="/register">
            Create Account
          </a>
        </BottomText>

      </Card>

    </Page>
  );
}