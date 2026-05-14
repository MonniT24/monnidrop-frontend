import React, {
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

  background:
    linear-gradient(
      135deg,
      #eff6ff,
      #f8fafc
    );
`;

const Card = styled.div`
  width:390px;

  background:white;

  padding:32px;

  border-radius:24px;

  box-shadow:
    0 12px 30px
    rgba(0,0,0,0.18);
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

const Input = styled.input`
  width:100%;

  padding:13px;

  border:1px solid #d1d5db;

  border-radius:12px;

  margin-bottom:14px;

  font-size:14px;

  box-sizing:border-box;

  outline:none;

  transition:0.2s;

  &:focus{
    border-color:#facc15;
    box-shadow:
      0 0 0 3px
      rgba(250,204,21,0.18);
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
    box-shadow:
      0 0 0 3px
      rgba(250,204,21,0.18);
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

  transition:0.2s;

  &:focus{
    border-color:#facc15;
    box-shadow:
      0 0 0 3px
      rgba(250,204,21,0.18);
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

  box-shadow:
    0 1px 3px
    rgba(0,0,0,0.2);
`;

const PhoneInput = styled.input`
  flex:1;

  padding:13px;

  border:1px solid #d1d5db;

  border-radius:0 12px 12px 0;

  font-size:14px;

  outline:none;

  transition:0.2s;

  &:focus{
    border-color:#facc15;
    box-shadow:
      0 0 0 3px
      rgba(250,204,21,0.18);
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

  &:hover{
    background:#dc2626;
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

// COMPONENT

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

  const [showPassword,
    setShowPassword] =
      useState(false);

  const [phone,setPhone] =
    useState("");

  const [loading,setLoading] =
    useState(false);

  // REGISTER

  const submitHandler =
    async(e)=>{

      e.preventDefault();

      try{

        if(!phone){

          return alert(
            "Phone number required"
          );
        }

        if(phone.length < 9){

          return alert(
            "Invalid phone number"
          );
        }

        setLoading(true);

        const fullPhone =
          `+233${phone}`;

        const res =
          await API.post(
            "/auth/register",
            {
              name,
              email,
              password,
              phone:fullPhone,
              role
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

        alert(
          "Registration successful"
        );

        if(role === "rider"){

          navigate("/rider");

        }else{

          navigate("/customer");
        }

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

        <form
          onSubmit={submitHandler}
        >

          <Input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e)=>
              setName(
                e.target.value
              )
            }
            required
          />

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>
              setEmail(
                e.target.value
              )
            }
            required
          />

          <Select

            value={role}

            onChange={(e)=>
              setRole(
                e.target.value
              )
            }
          >

            <option value="customer">
              Customer
            </option>

            <option value="rider">
              Rider
            </option>

          </Select>

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
                setPassword(
                  e.target.value
                )
              }

              required
            />

            <EyeButton
              type="button"

              onClick={()=>
                setShowPassword(
                  !showPassword
                )
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
              onChange={(e)=>
                setPhone(
                  e.target.value
                )
              }
              required
            />

          </PhoneWrap>

          <Button type="submit">

            {
              loading
              ? "Creating..."
              : "Register"
            }

          </Button>

        </form>

        <Bottom>

          Already have an account?
          {" "}

          <StyledLink to="/login">
            Login
          </StyledLink>

        </Bottom>

      </Card>

    </Page>
  );
}