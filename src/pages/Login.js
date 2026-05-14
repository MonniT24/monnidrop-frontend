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

// ================= STYLES =================

const Page = styled.div`
  min-height:100vh;

  display:flex;

  align-items:center;

  justify-content:center;

  background:
    linear-gradient(
      135deg,
      #eff6ff,
      #f8fafc
    );

  padding:20px;
`;

const Card = styled.div`
  width:100%;

  max-width:430px;

  background:white;

  border-radius:32px;

  padding:40px 34px;

  box-shadow:
    0 10px 40px rgba(15,23,42,0.08);
`;

const LogoWrap = styled.div`
  display:flex;

  justify-content:center;

  margin-bottom:20px;
`;

const Logo = styled.img`
  width:115px;

  object-fit:contain;
`;

const Title = styled.h1`
  font-size:32px;

  font-weight:800;

  text-align:center;

  color:#0f172a;

  margin-bottom:8px;
`;

const Subtitle = styled.p`
  text-align:center;

  color:#64748b;

  margin-bottom:34px;

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

  &:focus{

    border-color:#2563eb;

    box-shadow:
      0 0 0 4px rgba(37,99,235,0.1);
  }
`;

const Forgot = styled.div`
  text-align:right;

  margin-bottom:24px;

  a{

    color:#2563eb;

    font-size:14px;

    text-decoration:none;

    font-weight:600;
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

//COMPONENT
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

  &:hover{

    background:#dc2626;
  }
`;

export default function Login(){

  const [email,setEmail] =
    useState("");

  const [password,setPassword] =
    useState("");

  const [showPassword,
    setShowPassword] =
      useState(false);

  // ================= LOGIN =================

  async function login(e){

    e.preventDefault();

    try{

      const res =
        await API.post(
          "/auth/login",
          {
            email,
            password
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
    }
  }

  // ================= UI =================

  return(

    <Page>

      <Card>

        <LogoWrap>

          <Logo
            src={logo}
            alt="Logo"
          />

        </LogoWrap>

        <Title>
          Welcome Back
        </Title>

        <Subtitle>
          Login to continue delivering smarter.
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
                setEmail(
                  e.target.value
                )
              }
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
                setPassword(
                  e.target.value
                )
              }
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
                transform:
                  "translateY(-50%)",
                border:"none",
                background:"none",
                cursor:"pointer",
                color:"#64748b"
              }}
            >

              {

                showPassword

                ?

                <EyeOff size={20} />

                :

                <Eye size={20} />
              }

            </button>

          </InputWrap>

          <Forgot>

            <a href="/forgot-password">
              Forgot Password?
            </a>

          </Forgot>

          <Button type="submit">

            <FiLogIn />

            Login

          </Button>

        </form>

        <BottomText>

          Don't have an account?
          {" "}

          <a href="/register">
            Create Account
          </a>

        </BottomText>

      </Card>

    </Page>
  );
}

