import React,{useState} from "react";

import styled from "styled-components";

import {FiMail} from "react-icons/fi";

const Page = styled.div`
  min-height:100vh;

  display:flex;

  align-items:center;

  justify-content:center;

  background:#f8fafc;

  padding:20px;
`;

const Card = styled.div`
  width:100%;

  max-width:420px;

  background:white;

  padding:36px;

  border-radius:28px;

  box-shadow:
    0 10px 30px rgba(0,0,0,0.08);
`;

const Title = styled.h1`
  font-size:32px;

  font-weight:800;

  margin-bottom:10px;

  color:#0f172a;
`;

const Text = styled.p`
  color:#64748b;

  margin-bottom:24px;

  line-height:1.6;
`;

const InputWrap = styled.div`
  position:relative;

  margin-bottom:20px;
`;

const Icon = styled.div`
  position:absolute;

  top:50%;

  left:16px;

  transform:translateY(-50%);

  color:#94a3b8;
`;

const Input = styled.input`
  width:100%;

  padding:16px 16px 16px 48px;

  border:1px solid #dbe2ea;

  border-radius:16px;

  font-size:15px;

  outline:none;

  &:focus{

    border-color:#2563eb;
  }
`;

const Button = styled.button`
  width:100%;

  border:none;

  border-radius:16px;

  padding:16px;

  background:#2563eb;

  color:white;

  font-weight:700;

  font-size:15px;

  cursor:pointer;

  display:flex;

  align-items:center;

  justify-content:center;

  gap:10px;

  transition:0.25s ease;

  &:hover{

    background:#1d4ed8;
  }
`;

export default function ForgotPassword(){

  const [email,setEmail] =
    useState("");

  function submit(e){

    e.preventDefault();

    alert(
      `Password reset link sent to ${email}`
    );
  }

  return(

    <Page>

      <Card>

        <Title>
          Forgot Password
        </Title>

        <Text>
          Enter your email to receive reset instructions.
        </Text>

        <form onSubmit={submit}>

          <InputWrap>

            <Icon>
              <FiMail />
            </Icon>

            <Input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e)=>
                setEmail(e.target.value)
              }
            />

          </InputWrap>

          <Button type="submit">

            <FiMail />

            Send Reset Link

          </Button>

        </form>

      </Card>

    </Page>
  );
}