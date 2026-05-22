import React,{useState,useEffect} from "react";
import styled,{createGlobalStyle} from "styled-components";

import API from "../api/api";
import socket from "../socket";

import {
  FiHome,
  FiPlusCircle,
  FiPackage,
  FiClock,
  FiTruck,
  FiBell,
  FiUser,
  FiLogOut,
  FiSettings,
  FiEye,
  FiEyeOff
} from "react-icons/fi";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import L from "leaflet";

const customerImage =
  "https://ui-avatars.com/api/?name=Customer&background=2563eb&color=ffffff&size=256";

const GlobalLeafletFix = createGlobalStyle`

  .leaflet-container{
    position:relative !important;
    z-index:0 !important;
  }

  .leaflet-pane,
  .leaflet-map-pane,
  .leaflet-tile-pane,
  .leaflet-overlay-pane,
  .leaflet-shadow-pane,
  .leaflet-marker-pane,
  .leaflet-tooltip-pane,
  .leaflet-popup-pane{
    z-index:0 !important;
  }

  .leaflet-top,
  .leaflet-bottom,
  .leaflet-control-container{
    z-index:1 !important;
  }

  @media(max-width:768px){

    .leaflet-container{
      pointer-events:${props =>
        props.sidebarOpen
        ? "none"
        : "auto"} !important;

      opacity:${props =>
        props.sidebarOpen
        ? "0"
        : "1"} !important;

      transition:opacity 0.2s ease;
    }
  }
`;

const Layout = styled.div`
  display:flex;
  min-height:100vh;
  background:#f5f7fb;
`;

const Sidebar = styled.div`
  width:220px;

  background:#ffffff;

  padding:20px 16px;

  border-right:1px solid #e5e7eb;

  display:flex;
  flex-direction:column;
  justify-content:space-between;

  position:fixed;
  left:0;
  top:0;

  height:100vh;
  overflow-y:auto;

  z-index:100;

  box-shadow:
    8px 0 24px rgba(15,23,42,0.06);

  transition:0.3s ease;

  @media(max-width:768px){
    width:260px;

    left:${props =>
      props.open ? "0" : "-100%"};
  }
`;

const Main = styled.div`
  flex:1;
  margin-left:220px;
  padding:32px;
  min-height:100vh;
  background:#f5f7fb;
  overflow-x:hidden;

  @media(max-width:768px){
    margin-left:0;
    padding:82px 14px 24px;
  }

  @media(max-width:480px){
    padding:78px 10px 20px;
  }
`;

const MobileMenuButton = styled.button`
  display:none;

  @media(max-width:768px){
    display:flex;
    align-items:center;
    justify-content:center;

    position:fixed;
    top:14px;
    left:14px;

    width:46px;
    height:46px;

    border:none;
    border-radius:16px;

    background:
      linear-gradient(
        135deg,
        #0f172a,
        #1d4ed8
      );

    color:#facc15;

    font-size:24px;

    cursor:pointer;

    z-index:100001;

    box-shadow:
      0 10px 24px rgba(15,23,42,0.24);
  }
`;

const CloseButton = styled.button`
  display:none;

  @media(max-width:768px){
    display:flex;
    align-items:center;
    justify-content:center;

    align-self:flex-end;

    width:34px;
    height:34px;

    border:none;
    border-radius:12px;

    background:rgba(239,68,68,0.16);
    color:#fecaca;

    font-size:20px;
    font-weight:900;

    cursor:pointer;

    margin-bottom:14px;

    transition:0.25s ease;

    &:hover{
      background:#dc2626;
      color:white;
    }
  }
`;

const ProfileCard = styled.div`
  text-align:center;

  margin-bottom:14px;
  padding:12px 10px;

  border-radius:18px;

  background:#f8fafc;

  border:1px solid #e5e7eb;

  box-shadow:
    0 6px 16px rgba(15,23,42,0.04);
`;

const ProfileImage = styled.img`
  width:100%;
  height:100%;

  border-radius:50%;
  object-fit:cover;

  border:3px solid #facc15;

  box-shadow:
    0 6px 16px rgba(250,204,21,0.20);
`;

const ProfileImageBox = styled.div`
  position:relative;

  width:86px;
  height:86px;

  margin:0 auto 8px;

  &::after{
    content:"";

    position:absolute;
    right:3px;
    bottom:4px;

    width:13px;
    height:13px;

    background:#22c55e;

    border:3px solid white;
    border-radius:50%;
  }
`;

const CustomerName = styled.h3`
  font-size:18px;
  font-weight:900;
  color:white;

  margin:12px 0 5px;

  line-height:1.25;
`;

const CustomerRole = styled.p`
  color:#e2e8f0;
  font-size:13px;
  font-weight:800;

  margin:0 0 10px;
`;

const OnlineBadge = styled.div`
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:7px;

  padding:7px 13px;

  border-radius:999px;

  background:rgba(34,197,94,0.14);
  border:1px solid rgba(34,197,94,0.35);

  color:#86efac;

  font-size:12px;
  font-weight:900;

  margin-bottom:10px;

  &::before{
    content:"";

    width:8px;
    height:8px;

    border-radius:50%;
    background:#22c55e;

    box-shadow:
      0 0 0 4px rgba(34,197,94,0.14),
      0 0 12px rgba(34,197,94,0.70);
  }
`;

const SidebarMenu = styled.div`
  display:flex;
  flex-direction:column;
  gap:8px;

  margin-top:14px;
`;

const MenuItem = styled.div`
  display:flex;
  align-items:center;
  gap:12px;

  padding:12px 14px;

  border-radius:14px;

  font-size:14px;
  font-weight:800;

  cursor:pointer;

  color:${props =>
    props.active
      ? "#0f172a"
      : "#475569"};

  background:${props =>
    props.active
      ? "#facc15"
      : "#ffffff"};

  border:${props =>
    props.active
      ? "1px solid #facc15"
      : "1px solid #e5e7eb"};

  box-shadow:${props =>
    props.active
      ? "0 8px 18px rgba(250,204,21,0.25)"
      : "0 4px 12px rgba(15,23,42,0.03)"};

  transition:0.25s ease;

  svg{
    font-size:18px;
    flex-shrink:0;
  }

  &:hover{
    background:${props =>
      props.active
        ? "#facc15"
        : "#eff6ff"};

    color:#0f172a;

    transform:translateX(3px);
  }
`;

const LogoutButton = styled.button`
  width:100%;

  border:none;
  border-radius:14px;

  padding:12px 14px;

  background:#fee2e2;

  color:#b91c1c;

  font-size:14px;
  font-weight:900;

  cursor:pointer;

  margin-top:12px;

  transition:0.25s ease;

  display:flex;
  align-items:center;
  justify-content:center;
  gap:9px;

  &:hover{
    background:#ef4444;
    color:white;
  }
`;

const Hero = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  flex-wrap:wrap;
  gap:20px;
  margin-bottom:30px;
`;

const HeroTitle = styled.h1`
  font-size:34px;
  font-weight:800;
  color:#0f172a;
  margin-bottom:6px;

  @media(max-width:768px){
    font-size:26px;
  }
`;

const HeroText = styled.p`
  color:#64748b;
  font-size:15px;
`;

const DateCard = styled.div`
  background:white;
  padding:16px 22px;
  border-radius:18px;
  border:1px solid #e5e7eb;
  font-weight:600;
  color:#475569;
`;

const StatsGrid = styled.div`
  display:grid;
  grid-template-columns:
    repeat(auto-fit,minmax(240px,1fr));
  gap:22px;
  margin-bottom:30px;
`;

const StatCard = styled.div`
  background:white;
  padding:28px;
  border-radius:24px;
  box-shadow:
    0 6px 20px rgba(0,0,0,0.05);
`;

const StatTitle = styled.div`
  color:#64748b;
  font-size:14px;
  margin-bottom:10px;
`;

const StatValue = styled.div`
  font-size:34px;
  font-weight:800;
  color:#0f172a;
`;

const SettingsHero = styled.div`
  position:relative;
  overflow:hidden;

  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:24px;

  background:
    radial-gradient(
      circle at top right,
      rgba(250,204,21,0.40),
      transparent 34%
    ),
    linear-gradient(
      135deg,
      #0f172a,
      #1d4ed8
    );

  color:white;

  border-radius:26px;
  padding:26px;
  margin-bottom:24px;

  border:1px solid rgba(250,204,21,0.30);

  box-shadow:
    0 16px 34px rgba(29,78,216,0.20);

  &::before{
    content:"";
    position:absolute;
    inset:0;
    pointer-events:none;

    background-image:
      radial-gradient(circle, rgba(255,255,255,0.75) 0 2px, transparent 3px),
      radial-gradient(circle, rgba(250,204,21,0.75) 0 2px, transparent 3px);

    background-size:
      110px 110px,
      150px 150px;

    opacity:0.35;
    animation:settingsSparkle 5s linear infinite;
  }

  @keyframes settingsSparkle{
    0%{
      background-position:
        20px 20px,
        80px 60px;
    }

    50%{
      background-position:
        40px 35px,
        100px 45px;
    }

    100%{
      background-position:
        20px 20px,
        80px 60px;
    }
  }

  @media(max-width:480px){
    padding:22px;
    border-radius:22px;
  }
`;

const SettingsHeroContent = styled.div`
  position:relative;
  z-index:2;
  max-width:650px;
`;

const SettingsBadge = styled.div`
  display:inline-flex;
  align-items:center;
  justify-content:center;

  padding:8px 14px;
  border-radius:999px;

  background:rgba(250,204,21,0.18);
  color:#facc15;

  border:1px solid rgba(250,204,21,0.35);

  font-size:13px;
  font-weight:900;

  margin-bottom:14px;
`;

const SettingsTitle = styled.h1`
  font-size:32px;
  font-weight:900;
  line-height:1.1;

  margin:0 0 10px;

  color:white;
  letter-spacing:-0.6px;

  @media(max-width:480px){
    font-size:25px;
  }
`;

const SettingsText = styled.p`
  max-width:620px;

  color:rgba(255,255,255,0.86);

  font-size:15px;
  font-weight:600;
  line-height:1.55;

  margin:0;

  @media(max-width:480px){
    font-size:14px;
  }
`;

const SettingsHeroIcon = styled.div`
  position:relative;
  z-index:2;

  width:86px;
  height:86px;

  border-radius:26px;

  display:flex;
  align-items:center;
  justify-content:center;

  background:rgba(255,255,255,0.14);
  border:1px solid rgba(255,255,255,0.24);

  font-size:42px;

  box-shadow:
    0 14px 30px rgba(15,23,42,0.22);

  animation:settingsSpinPause 4s ease-in-out infinite;

  @keyframes settingsSpinPause{
    0%{
      transform:rotate(0deg);
    }

    45%{
      transform:rotate(360deg);
    }

    70%{
      transform:rotate(360deg);
    }

    100%{
      transform:rotate(360deg);
    }
  }

  @media(max-width:768px){
    display:none;
  }
`;

const ProfileDetailRow = styled.div`
  display:grid;
  grid-template-columns:130px 1fr;
  align-items:center;
  column-gap:16px;

  background:#ffffff;

  border:1px solid rgba(29,78,216,0.10);
  border-radius:13px;

  padding:10px 14px;
  margin-bottom:9px;

  color:#334155;
  font-size:14px;
  font-weight:700;

  box-shadow:
    0 6px 14px rgba(15,23,42,0.035);

  strong{
    color:#1d4ed8;
    font-weight:900;
    white-space:nowrap;
  }

  span{
    color:#0f172a;
    font-weight:900;
    text-align:left;
    justify-self:start;
  }

  @media(max-width:480px){
    grid-template-columns:1fr;
    row-gap:6px;

    span{
      text-align:left;
    }
  }
`;


const ProfileHero = styled.div`
  position:relative;
  overflow:hidden;

  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:24px;

  background:
    radial-gradient(
      circle at top right,
      rgba(250,204,21,0.38),
      transparent 34%
    ),
    linear-gradient(
      135deg,
      #0f172a,
      #1d4ed8
    );

  color:white;

  border-radius:26px;
  padding:18px;
  margin-bottom:16px;

  border:1px solid rgba(250,204,21,0.28);

  box-shadow:
    0 16px 34px rgba(29,78,216,0.20);

  @media(max-width:480px){
    padding:22px;
    border-radius:22px;
  }
`;

const ProfileHeroContent = styled.div`
  position:relative;
  z-index:2;
  max-width:650px;
`;

const ProfileBadge = styled.div`
  display:inline-flex;
  align-items:center;
  justify-content:center;

  padding:8px 14px;
  border-radius:999px;

  background:rgba(250,204,21,0.18);
  color:#facc15;

  border:1px solid rgba(250,204,21,0.35);

  font-size:13px;
  font-weight:900;

  margin-bottom:14px;
`;

const ProfileHeroTitle = styled.h1`
  font-size:32px;
  font-weight:900;
  line-height:1.1;

  margin:0 0 10px;

  color:white;
  letter-spacing:-0.6px;

  @media(max-width:480px){
    font-size:25px;
  }
`;

const ProfileHeroText = styled.p`
  max-width:620px;

  color:rgba(255,255,255,0.86);

  font-size:15px;
  font-weight:600;
  line-height:1.55;

  margin:0;

  @media(max-width:480px){
    font-size:14px;
  }
`;

const ProfileHeroPhoto = styled.img`
  position:relative;
  z-index:2;

  width:68px;
  height:68px;

  border-radius:50%;
  object-fit:cover;

  border:4px solid #facc15;
  background:white;

  flex-shrink:0;

  box-shadow:
    0 14px 30px rgba(15,23,42,0.24);

  @media(max-width:768px){
    width:58px;
    height:58px;
    border:3px solid #facc15;
  }
`;

const NotificationsHero = styled.div`
  position:relative;
  overflow:hidden;

  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:24px;

  background:
    radial-gradient(
      circle at top right,
      rgba(250,204,21,0.40),
      transparent 34%
    ),
    linear-gradient(
      135deg,
      #0f172a,
      #1d4ed8
    );

  color:white;

  border-radius:26px;
  padding:26px;
  margin-bottom:24px;

  border:1px solid rgba(250,204,21,0.30);

  box-shadow:
    0 16px 34px rgba(29,78,216,0.20);

  &::before{
    content:"";
    position:absolute;
    inset:0;
    pointer-events:none;

    background-image:
      radial-gradient(circle, rgba(255,255,255,0.75) 0 2px, transparent 3px),
      radial-gradient(circle, rgba(250,204,21,0.75) 0 2px, transparent 3px);

    background-size:
      110px 110px,
      150px 150px;

    opacity:0.35;
    animation:notificationSparkle 5s linear infinite;
  }

  @keyframes notificationSparkle{
    0%{
      background-position:
        20px 20px,
        80px 60px;
    }

    50%{
      background-position:
        40px 35px,
        100px 45px;
    }

    100%{
      background-position:
        20px 20px,
        80px 60px;
    }
  }

  @media(max-width:480px){
    padding:22px;
    border-radius:22px;
  }
`;

const NotificationsHeroContent = styled.div`
  position:relative;
  z-index:2;
  max-width:650px;
`;

const NotificationsBadge = styled.div`
  display:inline-flex;
  align-items:center;
  justify-content:center;

  padding:8px 14px;
  border-radius:999px;

  background:rgba(250,204,21,0.18);
  color:#facc15;

  border:1px solid rgba(250,204,21,0.35);

  font-size:13px;
  font-weight:900;

  margin-bottom:14px;
`;

const NotificationsTitle = styled.h1`
  font-size:32px;
  font-weight:900;
  line-height:1.1;

  margin:0 0 10px;

  color:white;
  letter-spacing:-0.6px;

  @media(max-width:480px){
    font-size:25px;
  }
`;

const NotificationsText = styled.p`
  max-width:620px;

  color:rgba(255,255,255,0.86);

  font-size:15px;
  font-weight:600;
  line-height:1.55;

  margin:0;

  @media(max-width:480px){
    font-size:14px;
  }
`;

const NotificationsHeroIcon = styled.div`
  position:relative;
  z-index:2;

  width:86px;
  height:86px;

  border-radius:26px;

  display:flex;
  align-items:center;
  justify-content:center;

  background:rgba(255,255,255,0.14);
  border:1px solid rgba(255,255,255,0.24);

  font-size:42px;

  box-shadow:
    0 14px 30px rgba(15,23,42,0.22);

  animation:notificationBell 2.4s ease-in-out infinite;

  @keyframes notificationBell{
    0%{
      transform:rotate(0deg);
    }

    20%{
      transform:rotate(10deg);
    }

    40%{
      transform:rotate(-10deg);
    }

    60%{
      transform:rotate(6deg);
    }

    80%{
      transform:rotate(-6deg);
    }

    100%{
      transform:rotate(0deg);
    }
  }

  @media(max-width:768px){
    display:none;
  }
`;

const MessagesHero = styled.div`
  position:relative;
  overflow:hidden;

  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:24px;

  background:
    radial-gradient(
      circle at top right,
      rgba(250,204,21,0.38),
      transparent 34%
    ),
    linear-gradient(
      135deg,
      #0f172a,
      #1d4ed8
    );

  color:white;

  border-radius:26px;
  padding:26px;
  margin-bottom:24px;

  border:1px solid rgba(250,204,21,0.28);

  box-shadow:
    0 16px 34px rgba(29,78,216,0.20);

  &::before{
    content:"";
    position:absolute;
    inset:0;
    pointer-events:none;

    background-image:
      radial-gradient(circle, rgba(255,255,255,0.75) 0 2px, transparent 3px),
      radial-gradient(circle, rgba(250,204,21,0.75) 0 2px, transparent 3px);

    background-size:
      110px 110px,
      150px 150px;

    opacity:0.35;
    animation:messageSparkle 5s linear infinite;
  }

  @keyframes messageSparkle{
    0%{
      background-position:
        20px 20px,
        80px 60px;
    }

    50%{
      background-position:
        40px 35px,
        100px 45px;
    }

    100%{
      background-position:
        20px 20px,
        80px 60px;
    }
  }

  @media(max-width:480px){
    padding:22px;
    border-radius:22px;
  }
`;

const MessagesHeroContent = styled.div`
  position:relative;
  z-index:2;
  max-width:650px;
`;

const MessagesBadge = styled.div`
  display:inline-flex;
  align-items:center;
  justify-content:center;

  padding:8px 14px;
  border-radius:999px;

  background:rgba(250,204,21,0.18);
  color:#facc15;

  border:1px solid rgba(250,204,21,0.35);

  font-size:13px;
  font-weight:900;

  margin-bottom:14px;
`;

const MessagesTitle = styled.h1`
  font-size:32px;
  font-weight:900;
  line-height:1.1;

  margin:0 0 10px;

  color:white;
  letter-spacing:-0.6px;

  @media(max-width:480px){
    font-size:25px;
  }
`;

const MessagesText = styled.p`
  max-width:620px;

  color:rgba(255,255,255,0.86);

  font-size:15px;
  font-weight:600;
  line-height:1.55;

  margin:0;

  @media(max-width:480px){
    font-size:14px;
  }
`;

const MessagesHeroIcon = styled.div`
  position:relative;
  z-index:2;

  width:86px;
  height:86px;

  border-radius:26px;

  display:flex;
  align-items:center;
  justify-content:center;

  background:rgba(255,255,255,0.14);
  border:1px solid rgba(255,255,255,0.24);

  font-size:42px;

  box-shadow:
    0 14px 30px rgba(15,23,42,0.22);

  animation:messageFloat 3s ease-in-out infinite;

  @keyframes messageFloat{
    0%{
      transform:translateY(0);
    }

    50%{
      transform:translateY(-8px);
    }

    100%{
      transform:translateY(0);
    }
  }

  @media(max-width:768px){
    display:none;
  }
`;

const OrdersPageHero = styled.div`
  background:
    radial-gradient(
      circle at top right,
      rgba(250,204,21,0.35),
      transparent 34%
    ),
    linear-gradient(
      135deg,
      #0f172a,
      #1d4ed8
    );

  color:white;

  border-radius:26px;
  padding:24px;
  margin-bottom:24px;

  border:1px solid rgba(250,204,21,0.25);

  box-shadow:
    0 16px 34px rgba(29,78,216,0.18);

  @media(max-width:480px){
    padding:20px;
    border-radius:22px;
  }
`;

const OrdersPageBadge = styled.div`
  display:inline-flex;
  align-items:center;
  justify-content:center;

  padding:8px 14px;
  border-radius:999px;

  background:rgba(250,204,21,0.18);
  color:#facc15;

  border:1px solid rgba(250,204,21,0.35);

  font-size:13px;
  font-weight:900;

  margin-bottom:14px;
`;

const OrdersPageTitle = styled.h1`
  font-size:32px;
  font-weight:900;
  line-height:1.1;

  margin:0 0 10px;

  color:white;
  letter-spacing:-0.6px;

  @media(max-width:480px){
    font-size:25px;
  }
`;

const OrdersPageText = styled.p`
  max-width:680px;

  color:rgba(255,255,255,0.86);

  font-size:15px;
  font-weight:600;
  line-height:1.55;

  margin:0;

  @media(max-width:480px){
    font-size:14px;
  }
`;

const OrdersGrid = styled.div`
  display:grid;
  grid-template-columns:
    repeat(auto-fit,minmax(280px,1fr));
  gap:18px;
  width:100%;

  @media(max-width:480px){
    grid-template-columns:1fr;
    gap:14px;
  }
`;

const CreateOrderWrapper = styled.div`
  background:
    linear-gradient(
      135deg,
      #ffffff,
      #f8fafc
    );

  border-radius:28px;
  padding:26px;

  border:1px solid rgba(29,78,216,0.10);

  box-shadow:
    0 16px 38px rgba(15,23,42,0.08);

  position:relative;
  overflow:hidden;

  &::before{
    content:"";
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:6px;
    background:
      linear-gradient(
        90deg,
        #0f172a,
        #1d4ed8,
        #facc15
      );
  }

  @media(max-width:480px){
    padding:20px;
    border-radius:22px;
  }
`;

const CreateOrderTitle = styled.h2`
  font-size:32px;
  font-weight:900;
  color:#0f172a;
  margin-bottom:8px;
  letter-spacing:-0.5px;

  @media(max-width:480px){
    font-size:26px;
  }
`;

const CreateOrderSubtext = styled.p`
  color:#64748b;
  font-size:15px;
  font-weight:600;
  margin-bottom:24px;
  line-height:1.5;

  @media(max-width:480px){
    font-size:14px;
    margin-bottom:20px;
  }
`;

const CreateOrderAdvert = styled.div`
  background:
    radial-gradient(
      circle at top right,
      rgba(250,204,21,0.35),
      transparent 34%
    ),
    linear-gradient(
      135deg,
      #0f172a,
      #1d4ed8
    );

  border-radius:24px;
  padding:24px;
  margin-bottom:24px;

  color:white;

  border:1px solid rgba(250,204,21,0.28);

  box-shadow:
    0 16px 34px rgba(29,78,216,0.20);

  position:relative;
  overflow:hidden;

  @media(max-width:480px){
    padding:20px;
    border-radius:20px;
    margin-bottom:20px;
  }
`;

const AdvertBadge = styled.div`
  display:inline-flex;
  align-items:center;
  justify-content:center;

  padding:8px 14px;
  border-radius:999px;

  background:rgba(250,204,21,0.18);
  color:#facc15;

  border:1px solid rgba(250,204,21,0.35);

  font-size:13px;
  font-weight:900;

  margin-bottom:14px;
`;

const AdvertTitle = styled.h2`
  font-size:30px;
  font-weight:900;
  line-height:1.1;

  margin:0 0 10px;

  color:white;
  letter-spacing:-0.6px;

  @media(max-width:480px){
    font-size:24px;
  }
`;

const AdvertText = styled.p`
  max-width:620px;

  color:rgba(255,255,255,0.86);

  font-size:15px;
  font-weight:600;
  line-height:1.55;

  margin:0;

  @media(max-width:480px){
    font-size:14px;
  }
`;

const OrderSection = styled.div`
  background:
    linear-gradient(
      135deg,
      #ffffff,
      #f8fafc
    );

  border-radius:18px;
  padding:18px;
  margin-bottom:16px;

  border:1px solid rgba(29,78,216,0.10);

  box-shadow:
    0 8px 20px rgba(15,23,42,0.04);

  transition:0.25s ease;

  &:hover{
    border-color:rgba(250,204,21,0.45);
    box-shadow:
      0 12px 26px rgba(15,23,42,0.07);
  }

  @media(max-width:480px){
    padding:15px;
    border-radius:16px;
    margin-bottom:14px;
  }
`;

const SectionHeader = styled.div`
  display:flex;
  align-items:center;
  gap:14px;
  margin-bottom:18px;
`;

const StepCircle = styled.div`
  width:34px;
  height:34px;
  border-radius:12px;

  background:
    linear-gradient(
      135deg,
      #0f172a,
      #1d4ed8
    );

  color:#facc15;

  display:flex;
  align-items:center;
  justify-content:center;

  font-weight:900;
  font-size:15px;

  box-shadow:
    0 8px 18px rgba(29,78,216,0.20);
`;

const SectionTitle = styled.h3`
  font-size:19px;
  font-weight:900;
  color:#0f172a;
  margin:0;

  @media(max-width:480px){
    font-size:17px;
  }
`;

const BeautifulInput = styled.input`
  width:100%;
  padding:15px 16px;
  border-radius:15px;

  border:1px solid #dbe4ee;
  background:white;

  font-size:15px;
  font-weight:600;

  outline:none;
  transition:0.25s ease;
  margin-top:10px;

  color:#0f172a;

  &::placeholder{
    color:#94a3b8;
    font-weight:500;
  }

  &:focus{
    border-color:#facc15;
    box-shadow:
      0 0 0 4px rgba(250,204,21,0.18);
  }

  @media(max-width:480px){
    padding:14px;
    border-radius:14px;
    font-size:14px;
  }
`;

const FareBox = styled.div`
  background:
    linear-gradient(
      135deg,
      #0f172a,
      #1d4ed8
    );

  border:1px solid rgba(250,204,21,0.30);
  border-radius:20px;

  padding:18px;

  display:flex;
  justify-content:space-between;
  align-items:center;

  margin-top:18px;
  flex-wrap:wrap;
  gap:14px;

  box-shadow:
    0 12px 28px rgba(29,78,216,0.16);

  div{
    color:white;
  }

  @media(max-width:480px){
    padding:16px;
    border-radius:18px;
  }
`;

const FareAmount = styled.div`
  font-size:30px;
  font-weight:900;
  color:#facc15 !important;
  margin-top:4px;

  @media(max-width:480px){
    font-size:25px;
  }
`;

const ConfirmButton = styled.button`
  width:220px;

  border:none;
  border-radius:16px;

  padding:14px 18px;
  margin-top:24px;

  background:
    linear-gradient(
      135deg,
      #0f172a,
      #1d4ed8
    );

  color:#facc15;

  font-size:15px;
  font-weight:900;

  cursor:pointer;

  box-shadow:
    0 12px 26px rgba(29,78,216,0.22);

  border:1px solid rgba(250,204,21,0.35);

  transition:0.25s ease;

  &:hover{
    transform:translateY(-2px);
    background:
      linear-gradient(
        135deg,
        #facc15,
        #f59e0b
      );
    color:#0f172a;
    box-shadow:
      0 14px 30px rgba(250,204,21,0.30);
  }

  @media(max-width:480px){
    width:100%;
    padding:14px;
    font-size:14px;
    border-radius:15px;
  }
`;

const OrderCard = styled.div`
  background:
    linear-gradient(
      135deg,
      #ffffff,
      #f8fafc
    );

  border-radius:22px;
  padding:22px;

  box-shadow:
    0 12px 28px rgba(15,23,42,0.07);

  border:1px solid rgba(29,78,216,0.10);

  width:100%;
  max-width:100%;
  overflow:hidden;

  transition:0.25s ease;

  &:hover{
    transform:translateY(-3px);
    box-shadow:
      0 16px 34px rgba(15,23,42,0.10);
    border-color:rgba(250,204,21,0.38);
  }

  @media(max-width:480px){
    border-radius:18px;
    padding:16px;
  }
`;

const Row = styled.div`
  margin-bottom:10px;
  color:#374151;
  font-size:15px;
`;

const SearchingRiderBadge = styled.span`
  display:inline-flex;
  align-items:center;
  gap:8px;

  margin-left:6px;
  padding:7px 12px;

  border-radius:999px;

  background:
    linear-gradient(
      135deg,
      #0f172a,
      #1d4ed8
    );

  color:#facc15;

  font-size:13px;
  font-weight:900;

  border:1px solid rgba(250,204,21,0.35);

  box-shadow:
    0 8px 18px rgba(29,78,216,0.18);

  white-space:nowrap;

  @media(max-width:480px){
    margin-left:0;
    margin-top:8px;
    display:flex;
    width:fit-content;
    font-size:12px;
    padding:7px 10px;
  }
`;

const SearchingPulse = styled.span`
  width:9px;
  height:9px;

  border-radius:50%;

  background:#22c55e;

  box-shadow:
    0 0 0 rgba(34,197,94,0.7);

  animation:riderPulse 1.4s infinite;

  @keyframes riderPulse{
    0%{
      box-shadow:0 0 0 0 rgba(34,197,94,0.7);
    }

    70%{
      box-shadow:0 0 0 9px rgba(34,197,94,0);
    }

    100%{
      box-shadow:0 0 0 0 rgba(34,197,94,0);
    }
  }
`;

const SearchingDots = styled.span`
  display:inline-flex;
  align-items:center;
  gap:3px;

  i{
    width:4px;
    height:4px;
    border-radius:50%;
    background:#facc15;
    display:block;
    animation:searchingDots 1s infinite ease-in-out;
  }

  i:nth-child(2){
    animation-delay:0.15s;
  }

  i:nth-child(3){
    animation-delay:0.3s;
  }

  @keyframes searchingDots{
    0%, 80%, 100%{
      opacity:0.3;
      transform:translateY(0);
    }

    40%{
      opacity:1;
      transform:translateY(-3px);
    }
  }
`;

const StatusBadge = styled.div`
  display:inline-flex;
  align-items:center;
  justify-content:center;

  padding:9px 16px;
  border-radius:999px;

  font-size:12px;
  font-weight:900;
  text-transform:uppercase;
  letter-spacing:0.4px;

  margin-top:14px;

  border:1px solid transparent;

  background:${props => {

    if(props.status === "pending"){
      return "linear-gradient(135deg, #facc15, #f59e0b)";
    }

    if(props.status === "accepted"){
      return "linear-gradient(135deg, #dbeafe, #bfdbfe)";
    }

    if(props.status === "picked"){
      return "linear-gradient(135deg, #ede9fe, #ddd6fe)";
    }

    if(props.status === "delivering"){
      return "linear-gradient(135deg, #dcfce7, #bbf7d0)";
    }

    if(props.status === "delivered"){
      return "linear-gradient(135deg, #0f172a, #1d4ed8)";
    }

    return "#e5e7eb";
  }};

  color:${props => {

    if(props.status === "delivered"){
      return "#facc15";
    }

    return "#111827";
  }};

  border-color:${props => {

    if(props.status === "delivered"){
      return "rgba(250,204,21,0.35)";
    }

    return "rgba(15,23,42,0.08)";
  }};

  box-shadow:
    0 8px 18px rgba(15,23,42,0.08);
`;

const Timeline = styled.div`
  margin-top:20px;
  padding:18px;

  border-radius:18px;

  background:
    linear-gradient(
      135deg,
      #f8fafc,
      #ffffff
    );

  border:1px solid rgba(29,78,216,0.10);

  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.7);
`;

const TimelineItem = styled.div`
  position:relative;

  padding:0 0 18px 34px;

  border-left:3px solid #dbeafe;

  &:last-child{
    padding-bottom:0;
  }

  &:last-child{
    border-left-color:transparent;
  }
`;

const TimelineDot = styled.div`
  width:18px;
  height:18px;

  border-radius:50%;

  position:absolute;
  left:-10.5px;
  top:0;

  background:${props =>
    props.active
      ? "linear-gradient(135deg, #facc15, #f59e0b)"
      : "#cbd5e1"};

  border:3px solid #ffffff;

  box-shadow:${props =>
    props.active
      ? "0 0 0 5px rgba(250,204,21,0.22)"
      : "0 0 0 4px rgba(148,163,184,0.14)"};
`;

const TimelineText = styled.div`
  font-size:14px;
  font-weight:900;
  color:#0f172a;
  line-height:1.2;
`;

const TimelineTime = styled.div`
  font-size:12px;
  color:#64748b;
  margin-top:5px;
  font-weight:700;
`;

const ButtonRow = styled.div`
  display:flex;
  gap:10px;
  margin-top:18px;
  flex-wrap:wrap;

  @media(max-width:480px){
    flex-direction:column;
    gap:12px;
  }
`;

const Button = styled.button`
  border:none;
  border-radius:14px;
  padding:12px 16px;
  background:#2563eb;
  color:white;
  font-weight:700;
  cursor:pointer;
  flex:1;

  &:hover{
    background:#1d4ed8;
  }

  @media(max-width:480px){
    width:100%;
    padding:14px;
    font-size:15px;
  }
`;

const Empty = styled.div`
  background:white;
  padding:28px;
  border-radius:18px;
  text-align:center;
  color:#64748b;
`;

const DashboardHero = styled.div`
  position:relative;
  overflow:hidden;

  background:
    radial-gradient(
      circle at top right,
      rgba(250,204,21,0.38),
      transparent 28%
    ),
    linear-gradient(
      135deg,
      #0f172a,
      #1d4ed8
    );

  color:white;
  border-radius:24px;
  padding:18px 22px;
  margin-bottom:18px;

  box-shadow:
    0 12px 28px rgba(15,23,42,0.14);

  &::before{
    content:"";
    position:absolute;
    inset:0;
    pointer-events:none;
    z-index:1;

    background-image:
      radial-gradient(circle, rgba(255,255,255,0.55) 0 2px, transparent 3px),
      radial-gradient(circle, rgba(250,204,21,0.55) 0 2px, transparent 3px);

    background-size:
      120px 120px,
      170px 170px;

    opacity:0.30;
  }

  @media(max-width:768px){
    padding:18px 16px;
    border-radius:22px;
  }
`;

const HeroLogo = styled.img`
  width:85px;
  height:85px;
  object-fit:contain;

  background:white;
  padding:6px;
  border-radius:50%;

  box-shadow:
    0 10px 22px rgba(15,23,42,0.22);

  position:static;
  z-index:3;

  flex-shrink:0;

  animation:logoRotatePause 5s ease-in-out infinite;

  @keyframes logoRotatePause{
    0%{
      transform:rotate(0deg);
    }

    45%{
      transform:rotate(360deg);
    }

    70%{
      transform:rotate(360deg);
    }

    100%{
      transform:rotate(360deg);
    }
  }

  @media(max-width:768px){
    width:60px;
    height:60px;
    padding:5px;
  }

  @media(max-width:480px){
    width:52px;
    height:52px;
    padding:4px;
  }
`;

const DashboardHeroContent = styled.div`
  position:relative;
  z-index:2;

  display:grid;
  grid-template-columns:minmax(0, 1fr) 330px;
  align-items:center;
  gap:18px;

  @media(max-width:900px){
    grid-template-columns:1fr;
    gap:16px;
  }
`;

const HeroLeftBlock = styled.div`
  display:flex;
  align-items:center;
  gap:16px;
  min-width:0;

  @media(max-width:768px){
    gap:12px;
    align-items:flex-start;
  }
`;

const HeroTextBlock = styled.div`
  min-width:0;
`;

const DashboardHeroTitle = styled.h1`
  font-size:32px;
  font-weight:900;
  margin:0 0 8px;
  letter-spacing:-0.6px;
  line-height:1.15;

  @media(max-width:768px){
    font-size:28px;
  }

  @media(max-width:480px){
    font-size:25px;
    line-height:1.2;
  }
`;

const DashboardHeroText = styled.p`
  max-width:520px;
  color:#dbeafe;
  font-size:14px;
  line-height:1.55;
  margin:0;

  @media(max-width:768px){
    font-size:13px;
  }
`;

const HeroBadge = styled.div`
  display:inline-flex;
  align-items:center;
  gap:8px;
  background:rgba(255,255,255,0.15);
  border:1px solid rgba(255,255,255,0.25);
  color:white;
  padding:10px 14px;
  border-radius:999px;
  font-size:13px;
  font-weight:800;
  margin-bottom:16px;
  backdrop-filter:blur(10px);
`;

const DashboardActions = styled.div`
  display:flex;
  gap:12px;
  flex-wrap:wrap;
  margin-top:24px;

  @media(max-width:480px){
    flex-direction:column;
    gap:12px;
  }
`;

const DashboardActionButton = styled.button`
  border:none;
  border-radius:14px;
  padding:13px 18px;

  background:${props =>
    props.primary
    ? "#facc15"
    : "rgba(255,255,255,0.14)"};

  color:${props =>
    props.primary
    ? "#111827"
    : "white"};

  font-weight:900;
  cursor:pointer;

  border:1px solid rgba(255,255,255,0.22);
  transition:0.25s ease;
  font-size:14px;

  &:hover{
    transform:translateY(-2px);
  }

  @media(max-width:480px){
    width:100%;
    padding:15px 18px;
  }
`;

const DashboardHeroCard = styled.div`
  width:100%;
  max-width:330px;

  background:
    linear-gradient(
      135deg,
      rgba(255,255,255,0.25),
      rgba(255,255,255,0.08)
    );

  border:1px solid rgba(255,255,255,0.34);
  border-radius:22px;

  padding:14px 18px;

  color:white;

  box-shadow:
    0 14px 30px rgba(0,0,0,0.18),
    inset 0 1px 0 rgba(255,255,255,0.28);

  backdrop-filter:blur(14px);

  @media(max-width:900px){
    max-width:100%;
  }
`;

const HeroCardLabel = styled.div`
  color:#bfdbfe;
  font-size:13px;
  font-weight:800;
  margin-bottom:8px;
`;

const HeroCardValue = styled.div`
  display:block;

  font-size:24px;
  font-weight:900;
  line-height:1.05;

  color:white;

  margin-bottom:10px;

  text-shadow:
    0 8px 20px rgba(0,0,0,0.24);

  @media(max-width:768px){
    font-size:23px;
  }
`;

const HeroCardTime = styled.div`
  display:inline-flex;
  align-items:center;
  justify-content:center;

  padding:8px 12px;
  margin-bottom:9px;

  border-radius:14px;

  background:
    linear-gradient(
      135deg,
      #facc15,
      #f59e0b
    );

  color:#0f172a;

  font-size:16px;
  font-weight:900;
  letter-spacing:1px;

  box-shadow:
    0 10px 20px rgba(250,204,21,0.28);

  border:1px solid rgba(255,255,255,0.35);

  @media(max-width:768px){
    font-size:15px;
    padding:8px 12px;
  }
`;

const HeroCardSmall = styled.div`
  color:#dbeafe;
  font-size:13px;
  margin-top:8px;
`;

const PremiumStatsGrid = styled.div`
  display:grid;
  grid-template-columns:
    repeat(auto-fit,minmax(190px,1fr));
  gap:12px;
  margin-bottom:20px;

  @media(max-width:480px){
    grid-template-columns:1fr;
  }
`;

const PremiumStatCard = styled.div`
  background:white;
  border-radius:20px;
  padding:14px;
  box-shadow:
    0 7px 18px rgba(15,23,42,0.05);
  border:1px solid #eef2f7;
  position:relative;
  overflow:hidden;
  min-height:150px;

  &:before{
    content:"";
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:3px;
    background:${props => props.line || "#2563eb"};
  }

  @media(max-width:480px){
    padding:14px;
    border-radius:18px;
    min-height:145px;
  }
`;

const PremiumStatIcon = styled.div`
  width:34px;
  height:34px;
  border-radius:12px;
  display:flex;
  align-items:center;
  justify-content:center;
  background:${props => props.bg || "#eff6ff"};
  color:${props => props.color || "#2563eb"};
  font-size:17px;
  margin-bottom:10px;
`;

const PremiumStatLabel = styled.div`
  color:#64748b;
  font-size:13px;
  font-weight:900;
  margin-bottom:6px;
`;

const PremiumStatValue = styled.div`
  font-size:26px;
  font-weight:900;
  color:#0f172a;
  line-height:1;
`;

const PremiumStatNote = styled.div`
  color:#94a3b8;
  font-size:11px;
  line-height:1.3;
  margin-top:8px;
`;

const DashboardGrid = styled.div`
  display:grid;
  grid-template-columns:1.4fr 0.9fr;
  gap:22px;

  @media(max-width:900px){
    grid-template-columns:1fr;
  }
`;

const DashboardPanel = styled.div`
  background:white;
  border-radius:28px;
  padding:24px;
  box-shadow:
    0 10px 30px rgba(15,23,42,0.06);
  border:1px solid #eef2f7;

  @media(max-width:480px){
    padding:18px;
    border-radius:22px;
  }
`;

const DashboardPanelTitle = styled.h3`
  font-size:20px;
  font-weight:900;
  color:#0f172a;
  margin:0 0 16px;
`;

const RecentOrderItem = styled.div`
  padding:16px;
  border-radius:18px;
  background:#f8fafc;
  border:1px solid #e5e7eb;
  margin-bottom:12px;
`;

const MiniStatus = styled.span`
  display:inline-flex;
  padding:7px 12px;
  border-radius:999px;
  background:${props =>
    props.paid
    ? "#dcfce7"
    : "#fef3c7"};
  color:${props =>
    props.paid
    ? "#166534"
    : "#92400e"};
  font-size:12px;
  font-weight:900;
`;

const DashboardTip = styled.div`
  background:#fefce8;
  border:1px solid #fde68a;
  border-radius:20px;
  padding:18px;
  color:#713f12;
  line-height:1.6;
  font-weight:700;
`;

const RatingOverlay = styled.div`
  position:fixed;
  inset:0;

  background:rgba(15,23,42,0.65);

  display:flex;
  align-items:center;
  justify-content:center;

  padding:18px;

  z-index:999999;
`;

const RatingCard = styled.div`
  width:100%;
  max-width:480px;

  background:white;

  border-radius:26px;
  padding:24px;

  box-shadow:
    0 28px 80px rgba(15,23,42,0.35);

  border:1px solid rgba(250,204,21,0.35);
`;

const RatingTitle = styled.h2`
  margin:0 0 8px;

  color:#0f172a;

  font-size:25px;
  font-weight:900;
`;

const RatingText = styled.p`
  margin:0 0 16px;

  color:#64748b;

  font-size:14px;
  font-weight:700;
  line-height:1.5;
`;

const StarRow = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  gap:10px;

  margin:20px 0;
`;

const StarButton = styled.button`
  border:none;
  background:transparent;

  font-size:38px;
  cursor:pointer;

  color:${props =>
    props.$selected
    ? "#facc15"
    : "#cbd5e1"};

  transform:${props =>
    props.$selected
    ? "scale(1.08)"
    : "scale(1)"};

  transition:0.2s ease;

  &:hover{
    transform:scale(1.15);
    color:#facc15;
  }
`;

const RatingTextArea = styled.textarea`
  width:100%;
  min-height:110px;

  border:1px solid #e5e7eb;
  border-radius:18px;

  padding:14px;

  resize:vertical;
  outline:none;

  font-size:14px;
  font-weight:700;

  color:#0f172a;

  box-sizing:border-box;

  &:focus{
    border-color:#facc15;

    box-shadow:
      0 0 0 4px rgba(250,204,21,0.18);
  }
`;

const RatingActionRow = styled.div`
  display:flex;
  justify-content:flex-end;
  gap:10px;

  margin-top:18px;

  @media(max-width:480px){
    flex-direction:column;
  }
`;

const RatingCancelButton = styled.button`
  border:none;
  border-radius:14px;

  padding:12px 16px;

  background:#f1f5f9;
  color:#0f172a;

  font-size:14px;
  font-weight:900;

  cursor:pointer;
`;

const RatingSubmitButton = styled.button`
  border:none;
  border-radius:14px;

  padding:12px 16px;

  background:
    linear-gradient(
      135deg,
      #0f172a,
      #1d4ed8
    );

  color:#facc15;

  font-size:14px;
  font-weight:900;

  cursor:pointer;

  opacity:${props =>
    props.disabled
    ? "0.65"
    : "1"};
`;

const riderIcon = new L.Icon({

  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/684/684908.png",

  iconSize:[40,40]
});

const customerIcon = new L.Icon({

  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",

  iconSize:[40,40]
});

export default function Customer(){

  const [activeSection,setActiveSection] =
    useState("dashboard");

  const [sidebarOpen,setSidebarOpen] =
    useState(false);


    const [currentTime, setCurrentTime] =
  useState(new Date());

  const [user,setUser] =
    useState(null);

    const [profileEditing,setProfileEditing] =
  useState(false);

const [profileImage,setProfileImage] =
  useState("");

const [profileName,setProfileName] =
  useState("");

const [profileEmail,setProfileEmail] =
  useState("");

const [profilePhone,setProfilePhone] =
  useState("");

const [profileAddress,setProfileAddress] =
  useState("");

  const [profileDOB,setProfileDOB] =
  useState("");

const [profileGender,setProfileGender] =
  useState("");

const [profileEmergency,setProfileEmergency] =
  useState("");

  const [orders,setOrders] =
    useState([]);

    const [ratingModalOrder,setRatingModalOrder] =
  useState(null);

const [riderRating,setRiderRating] =
  useState(5);

const [riderRatingComment,setRiderRatingComment] =
  useState("");

const [submittingRiderRating,setSubmittingRiderRating] =
  useState(false);

const [postponedRatingOrderIds,setPostponedRatingOrderIds] =
  useState([]);

const [ratedOrderIds,setRatedOrderIds] =
  useState(()=>{

    try{

      return JSON.parse(
        localStorage.getItem(
          "monnidropRatedRiderOrders"
        ) || "[]"
      );

    }catch(err){

      return [];
    }
  });

  const [notifications,setNotifications] =
    useState([]);

    const [messageInbox,setMessageInbox] =
  useState([]);

    const [previousOrders,setPreviousOrders] =
  useState([]);

    const [riderLocation,setRiderLocation] =
  useState(null);

  const [
  customerLocation,
  setCustomerLocation
] = useState({

  lat:5.6037,
  lng:-0.1870
});

  const [chatText,setChatText] =
    useState({});

  const [openChats,setOpenChats] =
    useState({});

    const [pickupLocation,setPickupLocation] =
  useState("");

  const [itemNotes,setItemNotes] =
  useState("");

const [showConfirm,
  setShowConfirm] =
    useState(false);

    const [paymentMethod,
  setPaymentMethod] =
    useState("");

const [momoNumber,
  setMomoNumber] =
    useState("");

const [deliveryTime,
  setDeliveryTime] =
    useState("20 - 35 mins");

    const [pickupSuggestions,
  setPickupSuggestions] =
    useState([]);

const [dropoffSuggestions,
  setDropoffSuggestions] =
    useState([]);

const locationCoords = {

  "Adenta Commandos":{
    lat:5.7089,
    lng:-0.1668
  },

  "Adenta Barrier":{
    lat:5.7045,
    lng:-0.1676
  },

  "Adenta Housing Down":{
    lat:5.7009,
    lng:-0.1701
  },

  "Madina Zongo Junction":{
    lat:5.6825,
    lng:-0.1653
  },

  "Madina Firestone":{
    lat:5.6892,
    lng:-0.1707
  },

  "Legon Boundary":{
    lat:5.6504,
    lng:-0.1865
  },

  "East Legon":{
    lat:5.6406,
    lng:-0.1531
  },

  "East Legon Hills":{
    lat:5.6652,
    lng:-0.1187
  },

  "East Legon Mempaasem":{
    lat:5.6419,
    lng:-0.1515
  },

  "East Legon Police Station":{
    lat:5.6390,
    lng:-0.1492
  },

  "Circle Neoplan":{
    lat:5.5701,
    lng:-0.2157
  },

  "Kaneshie":{
    lat:5.5560,
    lng:-0.2254
  },

  "Achimota Overhead":{
    lat:5.6031,
    lng:-0.2295
  },

  "Lapaz":{
    lat:5.6037,
    lng:-0.2504
  },

  "Haatso":{
    lat:5.6400,
    lng:-0.2360
  },

  "Atomic Junction":{
    lat:5.6508,
    lng:-0.1880
  },

  "Ashaley Botwe":{
    lat:5.6602,
    lng:-0.1323
  },

  "Tse-Addo Fishing Panda":{
    lat:5.6038,
    lng:-0.1216
  },

  "Tse-Addo Container":{
    lat:5.6005,
    lng:-0.1255
  },

  "Tse-Addo Zion Hut":{
    lat:5.5988,
    lng:-0.1234
  },

  "Tse-Addo RoundAbout":{
    lat:5.6024,
    lng:-0.1270
  },

  "Teshie Mobil":{
    lat:5.5833,
    lng:-0.1036
  },

  "Teshie Bush Road":{
    lat:5.5790,
    lng:-0.0964
  },

  "Nungua Coldstore":{
    lat:5.6012,
    lng:-0.0778
  },

  "Spintex":{
    lat:5.6258,
    lng:-0.1067
  },

  "Tema Station":{
    lat:5.5566,
    lng:-0.1969
  },

  "Tema Community 1":{
  lat:5.6480,
  lng:0.0105
},

  "Tema Community 25":{
    lat:5.7265,
    lng:0.0031
  },

  "Ashaiman":{
    lat:5.6991,
    lng:-0.0297
  },

  "Kasoa New Market":{
    lat:5.5340,
    lng:-0.4168
  },

  "Dansoman":{
    lat:5.5603,
    lng:-0.2847
  },

  "Osu":{
    lat:5.5560,
    lng:-0.1820
  },

  "Labadi":{
    lat:5.5612,
    lng:-0.1510
  },

  "Airport Residential":{
    lat:5.6050,
    lng:-0.1714
  },

  "Dzorwulu":{
    lat:5.6039,
    lng:-0.2231
  },

  "37 Military Hospital":{
    lat:5.5718,
    lng:-0.1907
  },

  "Cantonments":{
    lat:5.5766,
    lng:-0.1675
  },

  "The Bank Hospital Cantonments":{
    lat:5.5795,
    lng:-0.1658
  },

  "Wisconsin University Agbogba Road":{
    lat:5.6665,
    lng:-0.2174
  }

};

const accraLocations =
  Object.keys(locationCoords);

    const [pickupFullAddress,
  setPickupFullAddress] =
    useState("");

const [dropoffFullAddress,
  setDropoffFullAddress] =
    useState("");

const [dropoffLocation,setDropoffLocation] =
  useState("");

const [distance,setDistance] =
  useState("");

const [amount,setAmount] =
  useState("");

  const [
  pickupCoords,
  setPickupCoords
] = useState(null);

const [
  dropoffCoords,
  setDropoffCoords
] = useState(null);

  const [
  selectedSetting,
  setSelectedSetting
] = useState(null);

const [
  phoneNumber,
  setPhoneNumber
] = useState("");


const [
  email,
  setEmail
] = useState("");

const [
  currentPassword,
  setCurrentPassword
] = useState("");

const [
  newPassword,
  setNewPassword
] = useState("");

const [
  confirmPassword,
  setConfirmPassword
] = useState("");

const [
  showPasswords,
  setShowPasswords
] = useState(false);

const [
  language,
  setLanguage
] = useState("English");

const [
  currency,
  setCurrency
] = useState("GHS");

const [
  country,
  setCountry
] = useState("Ghana");

const [
  twoFactorEnabled,
  setTwoFactorEnabled
] = useState(false);

const [
  googleConnected,
  setGoogleConnected
] = useState(false);

const [
  facebookConnected,
  setFacebookConnected
] = useState(false);

const [
  signInActivities
] = useState([

  {
    device:"Chrome on Windows",
    location:"Accra, Ghana",
    time:"Today • 10:42 AM"
  },

  {
    device:"iPhone 15 Pro",
    location:"Tema, Ghana",
    time:"Yesterday • 8:10 PM"
  }

]);

useEffect(()=>{

  async function loadCustomerSettings(){

    try{

      const res =
        await API.get(
          "/customer/settings"
        );

      const savedSettings =
        res.data.settings || {};

      setPhoneNumber(
        savedSettings.phoneNumber || ""
      );

      setEmail(
        savedSettings.email || ""
      );

      setCountry(
        savedSettings.country || "Ghana"
      );

      setLanguage(
        savedSettings.language || "English"
      );

      setCurrency(
        savedSettings.currency || "GHS"
      );

      setPaymentMethod(
        savedSettings.paymentMethod || ""
      );

      setTwoFactorEnabled(
        savedSettings.twoFactorEnabled || false
      );

      setGoogleConnected(
        savedSettings.googleConnected || false
      );

      setFacebookConnected(
        savedSettings.facebookConnected || false
      );

      localStorage.setItem(
        "monnidropCustomerSettings",
        JSON.stringify(savedSettings)
      );

    }catch(err){

      console.log(
        "LOAD SETTINGS ERROR:",
        err.response?.data || err
      );

      const localSettings =
        localStorage.getItem(
          "monnidropCustomerSettings"
        );

      if(localSettings){

        const savedSettings =
          JSON.parse(localSettings);

        setPhoneNumber(
          savedSettings.phoneNumber || ""
        );

        setEmail(
          savedSettings.email || ""
        );

        setCountry(
          savedSettings.country || "Ghana"
        );

        setLanguage(
          savedSettings.language || "English"
        );

        setCurrency(
          savedSettings.currency || "GHS"
        );

        setPaymentMethod(
          savedSettings.paymentMethod || ""
        );

        setTwoFactorEnabled(
          savedSettings.twoFactorEnabled || false
        );

        setGoogleConnected(
          savedSettings.googleConnected || false
        );

        setFacebookConnected(
          savedSettings.facebookConnected || false
        );
      }
    }
  }

  loadCustomerSettings();

},[]);

  useEffect(()=>{

  const timer =
    setInterval(()=>{

      setCurrentTime(
        new Date()
      );

    },1000);

  return ()=>clearInterval(
    timer
  );

},[]);

useEffect(()=>{

  fetchMe();

  fetchOrders();

  const interval =
    setInterval(()=>{

      fetchOrders();

    },3000);

  return ()=>clearInterval(
    interval
  );

},[]);

useEffect(()=>{

  if(
    !Array.isArray(orders) ||
    orders.length === 0
  ){
    return;
  }

  if(ratingModalOrder){
    return;
  }

  const deliveredOrderToRate =
    orders.find((order)=>{

      const orderId =
        order._id?.toString();

      return (
        orderId &&
        order.status === "delivered" &&
        order.rider &&
        !ratedOrderIds.includes(orderId) &&
        !postponedRatingOrderIds.includes(orderId)
      );
    });

  if(deliveredOrderToRate){

    setRatingModalOrder(
      deliveredOrderToRate
    );

    setRiderRating(5);

    setRiderRatingComment("");
  }

},[
  orders,
  ratedOrderIds,
  postponedRatingOrderIds,
  ratingModalOrder
]);

useEffect(()=>{

  const customerId =
    user?._id ||
    user?.id;

  if(!customerId){
    return;
  }

  socket.emit(
    "userOnline",
    {
      userId:customerId,
      name:user?.name || "Customer",
      phone:user?.phone || "N/A",
      role:"customer"
    }
  );

},[user]);


  useEffect(()=>{

  if(user){

    setProfileName(
      user.name || ""
    );

    setProfileEmail(
      user.email || ""
    );

    setProfilePhone(
      user.phone || ""
    );

    setProfileAddress(
      user.address || ""
    );

    setProfileDOB(
  user.dob || ""
);

setProfileGender(
  user.gender || ""
);

setProfileEmergency(
  user.emergencyContact || ""
);

setProfileImage(
  user.profileImage || ""
);
  }

},[user]);

  useEffect(()=>{

  socket.on(
    "newMessage",
    (data)=>{

      console.log(
        "Customer received message:",
        data
      );

      if(data.type === "message"){

        setMessageInbox((prev)=>[
          {
            orderId:data.orderId,
            sender:data.sender,
            text:data.message || data.text,
            time:new Date()
              .toLocaleTimeString()
          },
          ...prev
        ]);

        fetchOrders();

        return;
      }

      setNotifications((prev)=>[
        {
          type:"order",
          orderId:data.orderId,
          sender:data.sender || "MonniDrop",
          text:data.message || data.text,
          time:new Date()
            .toLocaleTimeString()
        },
        ...prev
      ]);

      fetchOrders();
    }
  );

  return ()=>{

    socket.off("newMessage");
  };

},[]);

  useEffect(()=>{

  socket.on(
    "riderLocationUpdate",
    (data)=>{

      console.log(
        "CUSTOMER RECEIVED RIDER LOCATION:",
        data
      );

      setRiderLocation({
        riderId:data.riderId,
        lat:data.lat,
        lng:data.lng
      });
    }
  );

  return ()=>{

    socket.off(
      "riderLocationUpdate"
    );
  };

},[]);

async function saveProfile(){

  try{

    const res =
      await API.put(
        "/customer/profile",
        {
          name:profileName,
          email:profileEmail,
          phone:profilePhone,
          address:profileAddress,
          dob:profileDOB,
          gender:profileGender,
          emergencyContact:profileEmergency
        }
      );

    setUser(
  res.data.user
);

setProfileName(
  res.data.user.name || ""
);

setProfileEmail(
  res.data.user.email || ""
);

setProfilePhone(
  res.data.user.phone || ""
);

setProfileAddress(
  res.data.user.address || ""
);

setProfileDOB(
  res.data.user.dob || ""
);

setProfileGender(
  res.data.user.gender || ""
);

setProfileEmergency(
  res.data.user.emergencyContact || ""
);

setProfileImage(
  res.data.user.profileImage || ""
);

alert(
  "Profile saved successfully"
);

    setProfileEditing(false);

  }catch(err){

    console.log(err);

    alert(
      err.response?.data?.message ||
      "Failed to save profile"
    );
  }
}

  async function fetchMe(){

  try{

    const res =
      await API.get(
        "/customer/me"
      );

    const loggedUser =
      res.data.user ||
      res.data;

    setUser(
      loggedUser
    );

    setProfileName(
      loggedUser.name || ""
    );

    setProfileEmail(
      loggedUser.email || ""
    );

    setProfilePhone(
      loggedUser.phone || ""
    );

    setProfileAddress(
      loggedUser.address || ""
    );

    setProfileDOB(
      loggedUser.dob || ""
    );

    setProfileGender(
      loggedUser.gender || ""
    );

    setProfileEmergency(
      loggedUser.emergencyContact || ""
    );

    setProfileImage(
      loggedUser.profileImage || ""
    );

    console.log(
      "LOADED CUSTOMER IMAGE:",
      loggedUser.profileImage
    );

  }catch(err){

    console.log(err);
  }
}

 async function fetchOrders(){

  try{

    const res =
      await API.get("/orders");

    const newOrders = res.data;

    setPreviousOrders((oldOrders)=>{

      newOrders.forEach((newOrder)=>{

        const oldOrder =
          oldOrders.find(
            (old)=>old._id === newOrder._id
          );

        if(
          oldOrder &&
          oldOrder.status !== newOrder.status &&
          newOrder.status === "accepted"
        ){

          setNotifications((prev)=>[
            {
              type:"status",
              orderId:newOrder._id,
              sender:"MonniDrop",
              text:`Your order from ${newOrder.pickupLocation} to ${newOrder.dropoffLocation} is now ${newOrder.status}`,
              time:new Date().toLocaleTimeString()
            },
            ...prev
          ]);
        }

      });

      return newOrders;
    });

    setOrders(newOrders);

    const inboxMessages =
      newOrders.flatMap((order)=>

        (order.messages || [])

          .filter((msg)=>
            msg.sender === "rider"
          )

          .map((msg)=>({

            orderId:order._id,

            sender:msg.sender,

            text:msg.text,

            time:
              msg.createdAt
              ? new Date(msg.createdAt).toLocaleTimeString()
              : "New message"
          }))
      );

    setMessageInbox(
      inboxMessages.reverse()
    );

  }catch(err){

    console.log(err);
  }
}

  async function cancelOrder(orderId){

    try{

      await API.put(
        `/orders/${orderId}`,
        {
          status:"cancelled"
        }
      );

      fetchOrders();

    }catch(err){

      console.log(err);

      alert("Cancel failed");
    }
  }

  function saveRatedOrderId(orderId){

  if(!orderId){
    return;
  }

  setRatedOrderIds((prev)=>{

    const updated =
      Array.from(
        new Set([
          ...prev,
          orderId.toString()
        ])
      );

    localStorage.setItem(
      "monnidropRatedRiderOrders",
      JSON.stringify(updated)
    );

    return updated;
  });
}

function closeRiderRatingModal(){

  if(ratingModalOrder?._id){

    setPostponedRatingOrderIds((prev)=>
      Array.from(
        new Set([
          ...prev,
          ratingModalOrder._id.toString()
        ])
      )
    );
  }

  setRatingModalOrder(null);

  setRiderRating(5);

  setRiderRatingComment("");
}

async function submitRiderRating(){

  try{

    if(!ratingModalOrder){

      alert(
        "No delivered order selected for rating."
      );

      return;
    }

    if(
      !riderRating ||
      Number(riderRating) < 1 ||
      Number(riderRating) > 5
    ){

      alert(
        "Please select a rating between 1 and 5 stars."
      );

      return;
    }

    setSubmittingRiderRating(true);

    await API.post(
      "/ratings/rider",
      {
        orderId:ratingModalOrder._id,
        rating:Number(riderRating),
        comment:riderRatingComment.trim()
      }
    );

    saveRatedOrderId(
      ratingModalOrder._id
    );

    alert(
      "Thank you for rating your rider."
    );

    setRatingModalOrder(null);

    setRiderRating(5);

    setRiderRatingComment("");

    fetchOrders();

  }catch(err){

    console.log(
      "RIDER RATING ERROR:",
      err.response?.data || err.message
    );

    const message =
      err.response?.data?.message ||
      "Failed to submit rider rating";

    if(
      message
      .toLowerCase()
      .includes("already rated")
    ){

      saveRatedOrderId(
        ratingModalOrder._id
      );

      setRatingModalOrder(null);

      setRiderRating(5);

      setRiderRatingComment("");
    }

    alert(message);

  }finally{

    setSubmittingRiderRating(false);
  }
}

  function searchLocations(
  text,
  type
){

  if(
    !text ||
    text.length < 1
  ){

    if(type === "pickup"){

      setPickupSuggestions([]);
    }

    else{

      setDropoffSuggestions([]);
    }

    return;
  }

  const filtered =
    accraLocations.filter(

      (location)=>

        location
        .toLowerCase()
        .includes(
          text.toLowerCase()
        )
    );

  if(type === "pickup"){

    setPickupSuggestions(
      filtered
    );
  }


  else{

    setDropoffSuggestions(
      filtered
    );
  }
}

function getDistanceKm(
  lat1,
  lon1,
  lat2,
  lon2
){

  const R = 6371;

  const dLat =
    (lat2 - lat1) * Math.PI / 180;

  const dLon =
    (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) *
    Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c =
    2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
}

async function calculateDistance(
  pickupValue = pickupLocation,
  dropoffValue = dropoffLocation
){

  try{

    if(
      !pickupValue ||
      !dropoffValue
    ){
      return;
    }

    const pickup =
      locationCoords[pickupValue];

    const dropoff =
      locationCoords[dropoffValue];

    if(!pickup){

      alert(
        "Pickup location not found"
      );

      return;
    }

    if(!dropoff){

      alert(
        "Dropoff location not found"
      );

      return;
    }

    setPickupCoords(pickup);

    setDropoffCoords(dropoff);

    const distanceInKm =
      getDistanceKm(
        pickup.lat,
        pickup.lng,
        dropoff.lat,
        dropoff.lng
      ).toFixed(1);

    setDistance(distanceInKm);

    const km =
      parseFloat(distanceInKm);

      let estimatedTime = "20 - 35 mins";

if(km <= 5){
  estimatedTime = "15 - 25 mins";
}
else if(km <= 10){
  estimatedTime = "25 - 40 mins";
}
else if(km <= 20){
  estimatedTime = "40 - 60 mins";
}
else{
  estimatedTime = "60 - 90 mins";
}

setDeliveryTime(estimatedTime);

    const baseFare = 10;

    let perKmRate = 3.5;

    if(km > 10){
      perKmRate = 4;
    }

    if(km > 20){
      perKmRate = 4.5;
    }

    const fare =
      baseFare + (km * perKmRate);

    setAmount(
      fare.toFixed(2)
    );

  }catch(err){

    console.log(err);

    alert(
      "Error calculating distance"
    );
  }
}

async function createOrder(){

  try{

    if(
      !pickupLocation ||
      !dropoffLocation ||
      !distance ||
      !amount
    ){

      alert(
        "Please select pickup and dropoff locations first"
      );

      return;
    }

    if(!paymentMethod){

      alert(
        "Please choose Cash on Delivery or Mobile Money"
      );

      return;
    }

    if(
      paymentMethod === "momo" &&
      !momoNumber
    ){

      alert(
        "Please enter your Mobile Money number"
      );

      return;
    }

    const orderRes =
      await API.post(
        "/orders",
        {
          pickupLocation,
          dropoffLocation,

          distance:distance,
          deliveryTime:deliveryTime,
          total:amount,
          paymentMethod,

          momoNumber:
            paymentMethod === "momo"
            ? momoNumber
            : "",

          items:[
            {
              name:itemNotes || "Delivery Item",
              quantity:1
            }
          ]
        }
      );

   const createdOrder =
  orderRes.data.order ||
  orderRes.data;

console.log(
  "CREATED ORDER RESPONSE:",
  createdOrder
);

    if(paymentMethod === "momo"){

      const momoRes =
        await API.post(
          "/payments/momo/charge",
          {
            email:user?.email || "customer@example.com",
            amount:Number(amount),
            phone:momoNumber,
            provider:"mtn",
            orderId:createdOrder._id
          }
        );

      console.log(
        "MOMO PAYMENT RESPONSE:",
        momoRes.data
      );

      const paymentData =
        momoRes.data.data;

      if(
        paymentData &&
        paymentData.status === "success"
      ){

        await API.put(
          `/orders/${createdOrder._id}/pay`,
          {
            reference:paymentData.reference,
            status:paymentData.status,
            channel:paymentData.channel,
            amount:paymentData.amount,
            currency:paymentData.currency
          }
        );

        alert(
        `MoMo payment successful. Order created and marked as paid. Your OTP Number is ${createdOrder.deliveryCode}`
       );

      }else{

        alert(
        `Order created, but MoMo payment was not successful. Your OTP Number is ${createdOrder.deliveryCode}`
       );
      }

    }else{

 alert(
  `Order created successfully. Your OTP Number is ${createdOrder.deliveryCode || "not generated"}`
);
}

    setPickupLocation("");
    setDropoffLocation("");
    setDistance("");
    setAmount("");
    setItemNotes("");
    setPaymentMethod("");
    setMomoNumber("");
    setShowConfirm(false);

    fetchOrders();

    setActiveSection("orders");

  }catch(err){

    console.log(
      "CREATE ORDER / PAYMENT ERROR:",
      err.response?.data || err
    );

    alert(
      err.response?.data?.message ||
      "Failed to create order or payment"
    );
  }
}

async function sendMessage(
  orderId,
  text
){

  try{

    if(!text || text.trim() === ""){
      return;
    }

    await API.post(
      `/orders/${orderId}/message`,
      {
        sender:"customer",
        text:text.trim()
      }
    );

    setChatText({
      ...chatText,
      [orderId]:""
    });

    fetchOrders();

  }catch(err){

    console.log(err);
  }
}

  function logout(){

    localStorage.clear();

    window.location.href =
      "/login";
  }

  const activeOrders =
  orders.filter(
    (o)=>
      o.status !== "delivered" &&
      o.status !== "cancelled"
  );

  const cancelledOrders =
  orders.filter(
    (o)=>o.status === "cancelled"
  );   

  const completedOrders =
    orders.filter(
      (o)=>o.status === "delivered"
    );

    const allNotifications = [
  ...notifications,

  ...orders
    .filter((o)=>o.status !== "pending")
    .map((o)=>({
      type:"status",
      orderId:o._id,
      sender:"MonniDrop",
      text:`Your order from ${o.pickupLocation} to ${o.dropoffLocation} is now ${o.status}`,
      time:"Order update"
    })),

  ...orders.flatMap((o)=>
    (o.messages || [])
      .filter((msg)=>msg.sender === "rider")
      .map((msg)=>({
        type:"message",
        orderId:o._id,
        sender:"Rider",
        text:msg.text,
        time:"New message"
      }))
  )
];

  return(

    <Layout
  onClick={()=>
    setSidebarOpen(false)
  }
>

  <GlobalLeafletFix
  sidebarOpen={sidebarOpen}
/>

      <Sidebar
  open={sidebarOpen}
  onClick={(e)=>
    e.stopPropagation()
  }
>

        <div>

          <CloseButton
            onClick={()=>
              setSidebarOpen(false)
            }
          >
            ✕
          </CloseButton>

          <ProfileCard>



<ProfileImageBox>

  <ProfileImage
    src={
      user?.profileImage
      ? `${user.profileImage}?t=${Date.now()}`
      : customerImage
    }
    alt="Customer"
  />

</ProfileImageBox>

<label
  htmlFor="profileUpload"
  style={{
  display:"inline-flex",
  alignItems:"center",
  justifyContent:"center",
  padding:"9px 16px",
  borderRadius:"14px",
  background:"#2563eb",
  color:"white",
  fontWeight:"900",
  cursor:"pointer",
  marginTop:"6px",
  marginBottom:"8px",
  fontSize:"13px",
  lineHeight:"1"
}}
>
  Change Picture
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
          formData
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

      e.target.value =
        "";

    }catch(err){

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Image upload failed"
      );
    }
  }}
/>

<p
  style={{
  color:"#475569",
  fontSize:"13px",
  fontWeight:"700",
  margin:"0 0 6px"
}}
>
 {
  user?.name || "Customer"
}
</p>

<div
  style={{
    display:"inline-flex",
    alignItems:"center",
    gap:"6px",
    background:"#dcfce7",
    color:"#166534",
    padding:"4px 10px",
    borderRadius:"999px",
    fontSize:"12px",
    fontWeight:"900",
    marginTop:"0px",
    marginBottom:"0px"
  }}
>
  <span
    style={{
      width:"8px",
      height:"8px",
      borderRadius:"50%",
      background:"#22c55e",
      display:"inline-block"
    }}
  ></span>
  Online
</div>

          </ProfileCard>

          <SidebarMenu>

            <MenuItem
              active={
                activeSection === "dashboard"
              }
              onClick={()=>
                setActiveSection("dashboard")
              }
            >
              <FiHome />
              Dashboard
            </MenuItem>

            <MenuItem
  active={
    activeSection === "createOrder"
  }
  onClick={()=>
    setActiveSection("createOrder")
  }
>
  <FiPlusCircle />
  Create Order
</MenuItem>

            <MenuItem
              active={
                activeSection === "orders"
              }
              onClick={()=>
                setActiveSection("orders")
              }
            >
              <FiTruck />
              My Orders
            </MenuItem>

            <MenuItem
  active={
    activeSection === "messages"
  }
  onClick={()=>
    setActiveSection("messages")
  }
>
  <FiBell />
  Messages
</MenuItem>
            

            <MenuItem
              active={
                activeSection === "notifications"
              }
              onClick={()=>
                setActiveSection("notifications")
              }
            >
              <FiBell />
              Notifications
            </MenuItem>

            <MenuItem
  active={
    activeSection === "My Profile"
  }
  onClick={()=>
    setActiveSection("My Profile")
  }
>
  <FiUser />
  My Profile
</MenuItem>

       <MenuItem
  active={
    activeSection === "Settings"
  }
  onClick={()=>
    setActiveSection("Settings")
  }
>
  <FiSettings />
  Settings
</MenuItem>

            <LogoutButton
              onClick={logout}
            >
              <FiLogOut
                style={{
                  marginRight:"6px"
                }}
              />
              Logout
            </LogoutButton>

          </SidebarMenu>

        </div>

        <div
          style={{
            textAlign:"center",
            fontSize:"12px",
            color:"#94a3b8"
          }}
        >
          MonniDrop v1.0.0
        </div>

      </Sidebar>

      <Main
  onClick={()=>
    setSidebarOpen(false)
  }
>

        <MobileMenuButton
  onClick={(e)=>{

    e.stopPropagation();

    setSidebarOpen(
      !sidebarOpen
    );

  }}
>
          ☰
        </MobileMenuButton>

        {activeSection === "dashboard" && (

  <>

   <DashboardHero>

  <DashboardHeroContent>

    <HeroLeftBlock>

      <HeroLogo
        src="/logo.png"
        alt="MonniDrop Logo"
      />

      <HeroTextBlock>

          <HeroBadge>
            ⚡ MonniDrop Customer Dashboard
          </HeroBadge>

          <DashboardHeroTitle>
            Welcome/Akwaaba,
            {" "}
            {
              user?.name || "Customer"
            }
            👋
          </DashboardHeroTitle>

          <DashboardHeroText>
            Book deliveries, track riders, monitor payments,
            and manage every package from one clean dashboard.
          </DashboardHeroText>

          <DashboardActions>

            <DashboardActionButton
              primary
              onClick={()=>
                setActiveSection("createOrder")
              }
            >
              Create New Delivery
            </DashboardActionButton>

            <DashboardActionButton
              onClick={()=>
                setActiveSection("orders")
              }
            >
              Track My Orders
            </DashboardActionButton>

                  </DashboardActions>

      </HeroTextBlock>

    </HeroLeftBlock>

      <DashboardHeroCard>

  <HeroCardLabel>
    Today
  </HeroCardLabel>

  <HeroCardValue>
    {
      currentTime
      .toLocaleDateString(
        "en-US",
        {
          weekday:"short",
          month:"long",
          day:"numeric",
          year:"numeric"
        }
      )
    }
  </HeroCardValue>

  <HeroCardTime>
    {
      currentTime
      .toLocaleTimeString(
        "en-US",
        {
          hour:"2-digit",
          minute:"2-digit",
          second:"2-digit"
        }
      )
    }
  </HeroCardTime>

  <HeroCardSmall>
    Ready to move your next package.
  </HeroCardSmall>

</DashboardHeroCard>

      </DashboardHeroContent>

    </DashboardHero>

    <PremiumStatsGrid>

  <PremiumStatCard
    style={{
      background:
        "linear-gradient(135deg, #0f172a, #1d4ed8)",
      color:"white",
      border:"1px solid rgba(255,255,255,0.16)",
      boxShadow:
        "0 18px 38px rgba(29,78,216,0.26)"
    }}
  >

    <PremiumStatIcon
      style={{
        background:"rgba(250,204,21,0.18)",
        color:"#facc15",
        border:"1px solid rgba(250,204,21,0.35)"
      }}
    >
      <FiTruck />
    </PremiumStatIcon>

    <PremiumStatLabel
      style={{
        color:"rgba(255,255,255,0.86)"
      }}
    >
      Active Orders
    </PremiumStatLabel>

    <PremiumStatValue
      style={{
        color:"#facc15"
      }}
    >
      {activeOrders.length}
    </PremiumStatValue>

    <PremiumStatNote
      style={{
        color:"rgba(255,255,255,0.72)"
      }}
    >
      Orders currently moving or waiting for a rider.
    </PremiumStatNote>

  </PremiumStatCard>

  <PremiumStatCard
    style={{
      background:
        "linear-gradient(135deg, #facc15, #f59e0b)",
      color:"#0f172a",
      border:"1px solid rgba(15,23,42,0.12)",
      boxShadow:
        "0 18px 38px rgba(250,204,21,0.30)"
    }}
  >

    <PremiumStatIcon
      style={{
        background:"rgba(15,23,42,0.12)",
        color:"#0f172a",
        border:"1px solid rgba(15,23,42,0.18)"
      }}
    >
      <FiPackage />
    </PremiumStatIcon>

    <PremiumStatLabel
      style={{
        color:"#0f172a"
      }}
    >
      Completed Orders
    </PremiumStatLabel>

    <PremiumStatValue
      style={{
        color:"#132d68"
      }}
    >
      {completedOrders.length}
    </PremiumStatValue>

    <PremiumStatNote
      style={{
        color:"rgba(15,23,42,0.72)"
      }}
    >
      Successful deliveries completed on MonniDrop.
    </PremiumStatNote>

  </PremiumStatCard>

  <PremiumStatCard
    style={{
      background:
        "linear-gradient(135deg, #1d4ed8, #2563eb)",
      color:"white",
      border:"1px solid rgba(255,255,255,0.16)",
      boxShadow:
        "0 18px 38px rgba(37,99,235,0.26)"
    }}
  >

    <PremiumStatIcon
      style={{
        background:"rgba(255,255,255,0.16)",
        color:"#ffffff",
        border:"1px solid rgba(255,255,255,0.28)"
      }}
    >
      <FiBell />
    </PremiumStatIcon>

    <PremiumStatLabel
      style={{
        color:"rgba(255,255,255,0.86)"
      }}
    >
      Notifications
    </PremiumStatLabel>

    <PremiumStatValue
      style={{
        color:"#ffffff"
      }}
    >
      {notifications.length}
    </PremiumStatValue>

    <PremiumStatNote
      style={{
        color:"rgba(255,255,255,0.72)"
      }}
    >
      Rider updates, messages, and delivery alerts.
    </PremiumStatNote>

  </PremiumStatCard>

  <PremiumStatCard
    style={{
      background:
        "linear-gradient(135deg, #0f172a, #111827)",
      color:"white",
      border:"1px solid rgba(250,204,21,0.35)",
      boxShadow:
        "0 18px 38px rgba(15,23,42,0.30)"
    }}
  >

    <PremiumStatIcon
      style={{
        background:"rgba(250,204,21,0.16)",
        color:"#facc15",
        border:"1px solid rgba(250,204,21,0.35)"
      }}
    >
      <FiClock />
    </PremiumStatIcon>

    <PremiumStatLabel
      style={{
        color:"#facc15"
      }}
    >
      Pending Orders
    </PremiumStatLabel>

    <PremiumStatValue
      style={{
        color:"#facc15"
      }}
    >
      {
        orders.filter(
          (o)=>o.status === "pending"
        ).length
      }
    </PremiumStatValue>

    <PremiumStatNote
      style={{
        color:"rgba(255,255,255,0.72)"
      }}
    >
      Orders waiting for rider acceptance.
    </PremiumStatNote>

  </PremiumStatCard>

</PremiumStatsGrid>

    <DashboardGrid>

      <DashboardPanel>

       <DashboardPanelTitle
  style={{
    display:"flex",
    alignItems:"center",
    gap:"10px",
    color:"#0f172a"
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
      background:
        "linear-gradient(135deg, #0f172a, #1d4ed8)",
      color:"#facc15",
      boxShadow:
        "0 10px 22px rgba(29,78,216,0.22)"
    }}
  >
    <FiTruck />
  </span>

  Recent Delivery Activity

</DashboardPanelTitle>

        {
          orders.length === 0

          ?

          (

            <Empty>
              No recent delivery yet. Create your first order.
            </Empty>
          )

          :

          (

            orders.slice(0,3).map((o)=>(

              <RecentOrderItem
  key={o._id}
  style={{
    background:
      "linear-gradient(135deg, #ffffff, #f8fafc)",
    border:"1px solid rgba(29,78,216,0.12)",
    boxShadow:
      "0 12px 28px rgba(15,23,42,0.07)"
  }}
>

                <Row
  style={{
    background:"#eff6ff",
    border:"1px solid #dbeafe",
    borderRadius:"14px",
    padding:"12px",
    color:"#0f172a",
    fontWeight:"700"
  }}
>
  <strong
    style={{
      color:"#1d4ed8"
    }}
  >
    Route:
  </strong>
  {" "}
  {o.pickupLocation}
  {" "}
  →
  {" "}
  {o.dropoffLocation}
</Row>

                <Row
  style={{
    color:"#0f172a",
    fontWeight:"700"
  }}
>
  <strong
    style={{
      color:"#ca8a04"
    }}
  >
    Amount:
  </strong>
  {" "}

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
</Row>

               <Row>
  <strong>
    Rider:
  </strong>
  {" "}
  {
    o.rider?.name ||
    "Searching for Rider"
  }
</Row>

                <div
                  style={{
                    display:"flex",
                    gap:"10px",
                    flexWrap:"wrap",
                    marginTop:"12px"
                  }}
                >

                  <StatusBadge
                    status={o.status}
                    style={{
                      marginTop:0
                    }}
                  >
                    {o.status}
                  </StatusBadge>

                  <MiniStatus
                    paid={o.isPaid}
                  >
                    {
                      o.isPaid
                      ? "Paid"
                      : "Not Paid"
                    }
                  </MiniStatus>

                </div>

              </RecentOrderItem>

            ))
          )
        }

        <Button
          onClick={()=>
            setActiveSection("orders")
          }
          style={{
            marginTop:"8px"
          }}
        >
          View All Orders
        </Button>

      </DashboardPanel>

     <DashboardPanel
  style={{
    background:
      "linear-gradient(135deg, #0f172a, #1d4ed8)",
    color:"white",
    border:"1px solid rgba(250,204,21,0.22)",
    boxShadow:
      "0 10px 24px rgba(29,78,216,0.16)",
    padding:"14px",
    borderRadius:"18px",
    alignSelf:"start"
  }}
>


       <DashboardPanelTitle
  style={{
    display:"flex",
    alignItems:"center",
    gap:"7px",
    color:"white",
    fontSize:"15px",
    marginBottom:"10px"
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
      fontSize:"14px",
      boxShadow:
        "0 6px 14px rgba(250,204,21,0.18)"
    }}
  >
    <FiPackage />
  </span>

  Smart Delivery Summary
</DashboardPanelTitle>

      <Row
  style={{
    background:"rgba(255,255,255,0.10)",
    border:"1px solid rgba(255,255,255,0.16)",
    borderRadius:"10px",
    padding:"6px 8px",
    color:"rgba(255,255,255,0.90)",
    fontWeight:"700",
    fontSize:"12px",
    marginBottom:"6px",
    lineHeight:"1.25"
  }}
>
  <strong
    style={{
      color:"#facc15"
    }}
  >
    Payment Ready:
  </strong>
  {" "}
  Mobile Money enabled
</Row>

<Row
  style={{
    background:"rgba(255,255,255,0.12)",
    border:"1px solid rgba(255,255,255,0.18)",
    borderRadius:"16px",
    padding:"14px",
    color:"rgba(255,255,255,0.92)",
    fontWeight:"700"
  }}
>
  <strong
    style={{
      color:"#facc15"
    }}
  >
    Test MoMo:
  </strong>
  {" "}
  0551234987
</Row>

<Row
  style={{
    background:"rgba(255,255,255,0.12)",
    border:"1px solid rgba(255,255,255,0.18)",
    borderRadius:"16px",
    padding:"14px",
    color:"rgba(255,255,255,0.92)",
    fontWeight:"700"
  }}
>
  <strong
    style={{
      color:"#facc15"
    }}
  >
    Default Area:
  </strong>
  {" "}
  Accra
</Row>

        <DashboardTip
  style={{
    background:"rgba(250,204,21,0.16)",
    border:"1px solid rgba(250,204,21,0.35)",
    color:"#fef3c7",
    boxShadow:
      "0 10px 24px rgba(15,23,42,0.18)"
  }}
>
  Tip: Use Mobile Money for faster checkout.
  Once Paystack confirms payment, your order
  is automatically marked as paid.
</DashboardTip>

        <Button
  onClick={()=>
    setActiveSection("createOrder")
  }
  style={{
    marginTop:"18px",
    background:"#facc15",
    color:"#0f172a",
    fontWeight:"900",
    boxShadow:
      "0 12px 24px rgba(250,204,21,0.26)"
  }}
>
  Send a Package Now
</Button>

      </DashboardPanel>

    </DashboardGrid>

  </>

)}

        {activeSection === "orders" && (

          <>

           <OrdersPageHero>

  <div>

    <OrdersPageBadge>
      📦 Customer Orders
    </OrdersPageBadge>

    <OrdersPageTitle>
      Track Every Package
    </OrdersPageTitle>

    <OrdersPageText>
      View your deliveries, payment status, rider details,
      live route tracking, and order progress in one clean place.
    </OrdersPageText>

  </div>

</OrdersPageHero>

            {

              orders.length === 0

              ?

              (

                <Empty>
                  No orders found.
                </Empty>

              )

              :

              (

                <OrdersGrid>

                  {

                    orders.map((o)=>(

                      <OrderCard
                        key={o._id}
                      >

                        <Row
  style={{
    background:"#eff6ff",
    border:"1px solid #dbeafe",
    borderRadius:"14px",
    padding:"12px",
    color:"#0f172a",
    fontWeight:"800"
  }}
>
  <strong
    style={{
      color:"#1d4ed8"
    }}
  >
    Delivery Rider:
  </strong>
  {" "}

 {
  o.rider?.name

  ?

  o.rider.name

  :

  o.status === "pending"

  ?

  <SearchingRiderBadge>
    <SearchingPulse />

    <span>
      Searching for a rider 
    </span>

    <SearchingDots>
      <i></i>
      <i></i>
      <i></i>
    </SearchingDots>
  </SearchingRiderBadge>

  :

  "No rider assigned"
}

</Row>

                        <Row>
                          <strong>
                            Pickup:
                          </strong>
                          {" "}
                          {o.pickupLocation}
                        </Row>

                        <Row>
                          <strong>
                            Dropoff:
                          </strong>
                          {" "}
                          {o.dropoffLocation}
                        </Row>

                        <Row>
                          <strong>
                            Distance:
                          </strong>
                          {" "}
                          {o.distance} km
                        </Row>

                        <Row>
  <strong>
    Estimated Delivery Time:
  </strong>
  {" "}
 {
  o.status === "delivered"
  ? "Delivered"
  : o.deliveryTime || "Not available"
}
</Row>

<Row>
 <strong>
 Amount:
 </strong>
  {" "}
 ₵{o.total}
 </Row>

 <Row>
  <strong>
    Payment:
  </strong>
  {" "}
  {
    o.isPaid
    ? "Paid"
    : "Not Paid"
  }
</Row>

<StatusBadge
 status={o.status}
 >
 {o.status}
</StatusBadge>

{
  o.status === "delivered" &&
  o.rider &&
  !ratedOrderIds.includes(
    o._id?.toString()
  ) && (

    <Button
      onClick={()=>{
        setRatingModalOrder(o);
        setRiderRating(5);
        setRiderRatingComment("");
      }}
      style={{
        marginTop:"14px",
        background:
          "linear-gradient(135deg, #facc15, #f59e0b)",
        color:"#0f172a",
        fontWeight:"900"
      }}
    >
      ⭐ Rate Rider
    </Button>
  )
}

{
  o.status === "delivered" &&
  ratedOrderIds.includes(
    o._id?.toString()
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
  )
}

{
  o.deliveryCode &&
  o.status !== "delivered" &&
  o.status !== "cancelled" && (

    <div
      style={{
        marginTop:"18px",
        padding:"18px",
        borderRadius:"20px",
        background:
          "linear-gradient(135deg, #facc15, #f59e0b)",
        border:"2px solid #0f172a",
        boxShadow:
          "0 14px 30px rgba(250,204,21,0.30)",
        textAlign:"center"
      }}
    >

      <div
        style={{
          fontSize:"13px",
          fontWeight:"900",
          color:"#0f172a",
          textTransform:"uppercase",
          letterSpacing:"0.7px",
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
          marginBottom:"12px",
          lineHeight:"1.4"
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
  )
}

<Timeline>

  <TimelineItem>

    <TimelineDot
      active={true}
    />

    <TimelineText>
      Order Created
    </TimelineText>

    <TimelineTime>
      Waiting for rider
    </TimelineTime>

  </TimelineItem>

  <TimelineItem>

    <TimelineDot
      active={
        [
          "accepted",
          "picked",
          "delivering",
          "delivered"
        ].includes(o.status)
      }
    />

    <TimelineText>
      Rider Accepted
    </TimelineText>

    <TimelineTime>
      Rider confirmed order
    </TimelineTime>

  </TimelineItem>

  <TimelineItem>

    <TimelineDot
      active={
        [
          "picked",
          "delivering",
          "delivered"
        ].includes(o.status)
      }
    />

    <TimelineText>
      Reached Pickup Location
    </TimelineText>

    <TimelineTime>
      Rider arrived at pickup
    </TimelineTime>

  </TimelineItem>

  <TimelineItem>

    <TimelineDot
      active={
        [
          "delivering",
          "delivered"
        ].includes(o.status)
      }
    />

    <TimelineText>
      Package Picked Up
    </TimelineText>

    <TimelineTime>
      Delivery in progress
    </TimelineTime>

  </TimelineItem>

  <TimelineItem>

    <TimelineDot
      active={
        o.status === "delivered"
      }
    />

    <TimelineText>
      Delivered
    </TimelineText>

    <TimelineTime>
      Order completed successfully
    </TimelineTime>

  </TimelineItem>

</Timeline>

  { 

  !sidebarOpen &&
  locationCoords[o.pickupLocation] &&
  locationCoords[o.dropoffLocation] && (

    <div
  style={{
    marginTop:"20px",
    borderRadius:"22px",
    overflow:"hidden",
    border:"1px solid rgba(29,78,216,0.16)",
    background:"#ffffff",
    boxShadow:
      "0 14px 30px rgba(15,23,42,0.08)"
  }}
>

  <div
  style={{
    display:"flex",
    alignItems:"center",
    justifyContent:"space-between",
    gap:"12px",
    padding:"12px 14px",
    background:
      "linear-gradient(135deg, #0f172a, #1d4ed8)",
    color:"white"
  }}
>
  <div
    style={{
      fontWeight:"900",
      fontSize:"14px"
    }}
  >
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

      <MapContainer
        center={[
          locationCoords[o.pickupLocation].lat,
          locationCoords[o.pickupLocation].lng
        ]}
        zoom={12}
       style={{
  height:
    window.innerWidth <= 480
    ? "220px"
    : "300px",
  width:"100%"
}}
      >

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* PICKUP MARKER */}

        <Marker
          position={[
            locationCoords[o.pickupLocation].lat,
            locationCoords[o.pickupLocation].lng
          ]}
          icon={customerIcon}
        >

          <Popup>
            Pickup Location
          </Popup>

        </Marker>

        {/* DROPOFF MARKER */}

        <Marker
          position={[
            locationCoords[o.dropoffLocation].lat,
            locationCoords[o.dropoffLocation].lng
          ]}
          icon={customerIcon}
        >

          <Popup>
            Dropoff Location
          </Popup>

        </Marker>

        {/* RIDER MARKER */}

     {
  riderLocation &&
  o.rider?._id &&
  String(riderLocation.riderId) ===
  String(o.rider._id) && (

    <Marker
      position={[
        riderLocation.lat,
        riderLocation.lng
      ]}
      icon={riderIcon}
    >

      <Popup>
        Rider Current Location
      </Popup>

    </Marker>
  )
}

{
  riderLocation &&
  o.rider?._id &&
  String(riderLocation.riderId) ===
  String(o.rider._id) &&
  locationCoords[o.dropoffLocation] && (

    <Polyline
      positions={[

        [
          riderLocation.lat,
          riderLocation.lng
        ],

        [
          locationCoords[o.dropoffLocation].lat,
          locationCoords[o.dropoffLocation].lng
        ]

      ]}
    />
  )
}
        {/* ROUTE LINE */}

        <Polyline
          positions={[

            [
              locationCoords[o.pickupLocation].lat,
              locationCoords[o.pickupLocation].lng
            ],

            [
              locationCoords[o.dropoffLocation].lat,
              locationCoords[o.dropoffLocation].lng
            ]

          ]}
        />

      </MapContainer>

    </div>
  )
}    

<ButtonRow
  style={{
    marginTop:"18px",
    gap:"10px"
  }}
>

<Button
  onClick={()=>{

    setOpenChats({

      ...openChats,

      [o._id]:
      !openChats[o._id]
    });

  }}
  style={{
    background:
      "linear-gradient(135deg, #0f172a, #1d4ed8)",
    color:"#facc15",
    fontWeight:"900",
    border:"1px solid rgba(250,204,21,0.35)",
    boxShadow:
      "0 10px 22px rgba(29,78,216,0.18)"
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

    window.location.href =
      `tel:${o.rider.phone}`;

  }}
  style={{
    background:
      "linear-gradient(135deg, #facc15, #f59e0b)",
    color:"#0f172a",
    fontWeight:"900",
    border:"1px solid rgba(15,23,42,0.12)",
    boxShadow:
      "0 10px 22px rgba(250,204,21,0.22)"
  }}
>
  📞 Call Rider
</Button>

 {

 o.status === "pending" && (

<Button
  onClick={()=>
    cancelOrder(o._id)
  }
  style={{
    background:"#dc2626",
    color:"white",
    fontWeight:"900",
    border:"1px solid rgba(220,38,38,0.25)",
    boxShadow:
      "0 10px 22px rgba(220,38,38,0.16)"
  }}
>
  Cancel Order
</Button>

                            )
                          }

                        </ButtonRow>

                        {

                          openChats[o._id] && (

                            <div
                            style={{
                                marginTop:"15px",
                                background:"#f8fafc",
                                padding:"15px",
                                borderRadius:"14px"
                              }}
                            >

                              {

                                o.messages &&
                                o.messages.length > 0 && (

                                  <div
                                    style={{
                                      marginBottom:"14px"
                                    }}
                                  >

                                    {

                                      o.messages.map(

                                        (msg,index)=>(

                                          <div
                                            key={index}
                                           style={{

  background:
    msg.sender === "customer"
    ? "linear-gradient(135deg, #0f172a, #1d4ed8)"
    : "linear-gradient(135deg, #facc15, #f59e0b)",

  color:
    msg.sender === "customer"
    ? "#ffffff"
    : "#0f172a",

  padding:"11px 13px",
  borderRadius:"14px",
  marginBottom:"9px",
  fontSize:"14px",
  fontWeight:"700",
  boxShadow:
    "0 8px 18px rgba(15,23,42,0.08)"
}}
                                          >

                                            <strong>

                                              {

                                                msg.sender ===
                                                "customer"

                                                ?

                                                "You"

                                                :

                                                "Rider"
                                              }

                                              :

                                            </strong>

                                            {" "}

                                            {msg.text}

                                          </div>

                                        )
                                      )
                                    }

                                  </div>

                                )
                              }

<div
  style={{
    marginTop:"16px",
    background:
      "linear-gradient(135deg, #ffffff, #f8fafc)",
    padding:"16px",
    borderRadius:"18px",
    border:"1px solid rgba(29,78,216,0.12)",
    boxShadow:
      "0 12px 28px rgba(15,23,42,0.07)"
  }}
>

  <div
  style={{
    display:"flex",
    alignItems:"center",
    justifyContent:"space-between",
    gap:"10px",
    marginBottom:"14px"
  }}
>
  <div
    style={{
      fontSize:"14px",
      fontWeight:"900",
      color:"#0f172a"
    }}
  >
    💬 Rider Chat
  </div>

  <div
    style={{
      fontSize:"12px",
      fontWeight:"900",
      color:"#1d4ed8",
      background:"#eff6ff",
      border:"1px solid #dbeafe",
      padding:"6px 10px",
      borderRadius:"999px"
    }}
  >
    Live conversation
  </div>
</div>

                                <input
                                  type="text"
                                  placeholder="Type message..."
                                  value={
                                    chatText[o._id] || ""
                                  }
                                  onChange={(e)=>

                                    setChatText({

                                      ...chatText,

                                      [o._id]:
                                        e.target.value
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
  fontWeight:"700",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.7)"
}}
                                />

                                <Button
  onClick={()=>

    sendMessage(
      o._id,
      chatText[o._id]
    )
  }
  style={{
    background:
      "linear-gradient(135deg, #facc15, #f59e0b)",
    color:"#0f172a",
    fontWeight:"900",
    boxShadow:
      "0 10px 22px rgba(250,204,21,0.22)"
  }}
>
  Send
</Button>

                              </div>

                            </div>

                          )
                        }

                      </OrderCard>

                    ))
                  }

                </OrdersGrid>

              )
            }

          </>

        )}

        {activeSection === "createOrder" && (

  <>

  <CreateOrderWrapper>

  <CreateOrderAdvert>

  <AdvertBadge>
    🚀 Fast Delivery Across Accra
  </AdvertBadge>

  <AdvertTitle>
    Send Packages Faster,
    Safer & Smarter 📦
  </AdvertTitle>

  <AdvertText>
    Book a rider, track your delivery, and pay with ease —
    all from your MonniDrop dashboard.
  </AdvertText>

</CreateOrderAdvert>

  <OrderSection>

  <SectionHeader>

    <StepCircle>
      1
    </StepCircle>

    <SectionTitle>
      Pickup Location
    </SectionTitle>

  </SectionHeader>

  <BeautifulInput
    type="text"
    placeholder="Enter pickup location"
    value={pickupLocation}
    onChange={(e)=>{

  setPickupLocation(
    e.target.value
  );

  searchLocations(
    e.target.value,
    "pickup"
  );
}}
  />

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

{
  pickupSuggestions.length > 0 && (

    <div
     style={{
  background:"#ffffff",
  border:"1px solid rgba(29,78,216,0.14)",
  borderRadius:"18px",
  marginTop:"10px",
  overflow:"hidden",
  boxShadow:
    "0 12px 26px rgba(15,23,42,0.08)"
}}
    >

      {

        pickupSuggestions.map(
          (place,index)=>(

            <div

              key={index}

      onClick={()=>{

  setPickupLocation(place);
setPickupSuggestions([]);

calculateDistance(
  place,
  dropoffLocation
);
}}

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

  {place}

            </div>
          )
        )
      }

    </div>
  )
}

</OrderSection>

<OrderSection>

  <SectionHeader>

    <StepCircle>
      2
    </StepCircle>

    <SectionTitle>
      Dropoff Location
    </SectionTitle>

  </SectionHeader>

  <BeautifulInput
    type="text"
    placeholder="Enter dropoff location"
    value={dropoffLocation}
   onChange={(e)=>{

  setDropoffLocation(
    e.target.value
  );

  searchLocations(
    e.target.value,
    "dropoff"
  );
}}
  />

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

{
  dropoffSuggestions.length > 0 && (

    <div
      style={{
  background:"#ffffff",
  border:"1px solid rgba(29,78,216,0.14)",
  borderRadius:"18px",
  marginTop:"10px",
  overflow:"hidden",
  boxShadow:
    "0 12px 26px rgba(15,23,42,0.08)"
}}
    >

      {

        dropoffSuggestions.map(
          (place,index)=>(

            <div

              key={index}

     onClick={()=>{

 setDropoffLocation(place);
setDropoffSuggestions([]);

calculateDistance(
  pickupLocation,
  place
);

}}

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

  {place}

            </div>
          )
        )
      }

    </div>
  )
}

</OrderSection>

<OrderSection>

  <SectionHeader>

    <StepCircle>
      3
    </StepCircle>

    <SectionTitle>
      Item Notes
    </SectionTitle>

  </SectionHeader>

  <BeautifulInput
    type="text"
    placeholder="Describe the item/package (optional)"
    value={itemNotes}
    onChange={(e)=>
      setItemNotes(
        e.target.value
      )
    }
  />

</OrderSection>

<FareBox>

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
  Estimated Distance
</div>

    <FareAmount>
      {distance || 0} KM
    </FareAmount>

  </div>

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
  Delivery Fee
</div>

    <FareAmount>
      ₵{amount || 0}
    </FareAmount>

  </div>

</FareBox>

<OrderSection>

  <SectionHeader>

    <StepCircle>
      4
    </StepCircle>

    <SectionTitle>
      Payment Option
    </SectionTitle>

  </SectionHeader>

  <div
    style={{
      display:"flex",
      gap:"12px",
      flexWrap:"wrap",
      marginTop:"12px"
    }}
  >

    <Button
  type="button"
  onClick={()=>
    setPaymentMethod("cash")
  }
  style={{
    background:
      paymentMethod === "cash"
      ? "linear-gradient(135deg, #facc15, #f59e0b)"
      : "linear-gradient(135deg, #0f172a, #1d4ed8)",
    color:
      paymentMethod === "cash"
      ? "#0f172a"
      : "white",
    border:
      paymentMethod === "cash"
      ? "2px solid #0f172a"
      : "1px solid rgba(29,78,216,0.25)",
    boxShadow:
      paymentMethod === "cash"
      ? "0 12px 24px rgba(250,204,21,0.28)"
      : "0 10px 22px rgba(29,78,216,0.18)",
    fontWeight:"900"
  }}
>
  Cash on Delivery
</Button>

    <Button
  type="button"
  onClick={()=>
    setPaymentMethod("momo")
  }
  style={{
    background:
      paymentMethod === "momo"
      ? "linear-gradient(135deg, #facc15, #f59e0b)"
      : "linear-gradient(135deg, #0f172a, #1d4ed8)",
    color:
      paymentMethod === "momo"
      ? "#0f172a"
      : "white",
    border:
      paymentMethod === "momo"
      ? "2px solid #0f172a"
      : "1px solid rgba(29,78,216,0.25)",
    boxShadow:
      paymentMethod === "momo"
      ? "0 12px 24px rgba(250,204,21,0.28)"
      : "0 10px 22px rgba(29,78,216,0.18)",
    fontWeight:"900"
  }}
>
  Mobile Money
</Button>

  </div>

  {
    paymentMethod === "momo" && (

     <div
  style={{
    marginTop:"14px",
    padding:"14px",
    borderRadius:"18px",
    background:"#eff6ff",
    border:"1px solid #dbeafe",
    boxShadow:
      "0 8px 18px rgba(29,78,216,0.08)"
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

  <BeautifulInput
    type="tel"
    placeholder="Enter MoMo number"
    value={momoNumber}
    onChange={(e)=>
      setMomoNumber(
        e.target.value
      )
    }
    style={{
      marginTop:"0"
    }}
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

    )
  }

</OrderSection>

<ConfirmButton
  onClick={()=>
    setShowConfirm(true)
  }
>
  Create Order
</ConfirmButton>

</CreateOrderWrapper>

{
  showConfirm && (

    <OrderCard
      style={{
        marginTop:"24px",
        border:
          "2px solid #facc15"
      }}
    >

     <HeroTitle
  style={{
    fontSize:"24px",
    marginBottom:"16px",
    color:"#0f172a",
    display:"flex",
    alignItems:"center",
    gap:"10px"
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
      background:
        "linear-gradient(135deg, #0f172a, #1d4ed8)",
      color:"#facc15",
      fontSize:"18px"
    }}
  >
    <FiPackage />
  </span>

  Confirm Your Order
</HeroTitle>

      <Row
  style={{
    background:"#f8fafc",
    border:"1px solid #e5e7eb",
    borderRadius:"13px",
    padding:"10px 12px",
    color:"#334155",
    fontWeight:"700"
  }}
>
  <strong>
    Pickup:
  </strong>
  {" "}
  {pickupLocation}
</Row>

      <Row
  style={{
    background:"#f8fafc",
    border:"1px solid #e5e7eb",
    borderRadius:"13px",
    padding:"10px 12px",
    color:"#334155",
    fontWeight:"700"
  }}
>
  <strong>
    Dropoff:
  </strong>
  {" "}
  {dropoffLocation}
</Row>

      <Row
  style={{
    background:"#f8fafc",
    border:"1px solid #e5e7eb",
    borderRadius:"13px",
    padding:"10px 12px",
    color:"#334155",
    fontWeight:"700"
  }}
>
  <strong>
    Item Notes:
  </strong>
  {" "}
  {itemNotes || "None"}
</Row>

    <Row
  style={{
    background:"#f8fafc",
    border:"1px solid #e5e7eb",
    borderRadius:"13px",
    padding:"10px 12px",
    color:"#334155",
    fontWeight:"700"
  }}
>
  <strong>
    Distance:
  </strong>
  {" "}
  {distance} KM
</Row>

     <Row
  style={{
    background:"#f8fafc",
    border:"1px solid #e5e7eb",
    borderRadius:"13px",
    padding:"10px 12px",
    color:"#334155",
    fontWeight:"700"
  }}
>
  <strong>
    Estimated Delivery Time:
  </strong>
  {" "}
  {deliveryTime}
</Row>

      <Row
  style={{
    background:"#f8fafc",
    border:"1px solid #e5e7eb",
    borderRadius:"13px",
    padding:"10px 12px",
    color:"#334155",
    fontWeight:"700"
  }}
>
  <strong>
    Delivery Fee:
  </strong>
  {" "}
  ₵{amount}
</Row>

     <Row
  style={{
    background:"#f8fafc",
    border:"1px solid #e5e7eb",
    borderRadius:"13px",
    padding:"10px 12px",
    color:"#334155",
    fontWeight:"700"
  }}
>
  <strong>
    Payment Method:
  </strong>
  {" "}
  {
    paymentMethod === "cash"
    ? "Cash on Delivery"
    : paymentMethod === "momo"
    ? "Mobile Money"
    : "Not selected"
  }
</Row>

{
  paymentMethod === "momo" && (

   <Row
  style={{
    background:"#f8fafc",
    border:"1px solid #e5e7eb",
    borderRadius:"13px",
    padding:"10px 12px",
    color:"#334155",
    fontWeight:"700"
  }}
>
  <strong>
    MoMo Number:
  </strong>
  {" "}
  {momoNumber}
</Row>
  )
}

      <ButtonRow>

        <Button
          onClick={createOrder}
        >
          Confirm Order
        </Button>

        <Button
          style={{
            background:"#dc2626"
          }}
          onClick={()=>
            setShowConfirm(false)
          }
        >
          Cancel
        </Button>

      </ButtonRow>

    </OrderCard>
  )
}

  </>

)}

{activeSection === "messages" && (

  <>

    <MessagesHero>

  <MessagesHeroContent>

    <MessagesBadge>
      💬 Rider Communication
    </MessagesBadge>

    <MessagesTitle>
      Stay Connected With Your Rider
    </MessagesTitle>

    <MessagesText>
      View rider updates, delivery conversations, and important
      package messages in one clean inbox.
    </MessagesText>

  </MessagesHeroContent>

  <MessagesHeroIcon>
    💬
  </MessagesHeroIcon>

</MessagesHero>

    {

      messageInbox.length === 0

      ?

      (

       <Empty
  style={{
    background:
      "linear-gradient(135deg, #ffffff, #f8fafc)",
    border:"1px solid rgba(29,78,216,0.12)",
    boxShadow:
      "0 12px 28px rgba(15,23,42,0.07)",
    color:"#0f172a",
    fontWeight:"800"
  }}
>
  💬 No messages yet. Chat with your rider when an order is active.
</Empty>

      )

      :

      (

        <OrdersGrid>

          {

            messageInbox.map((msg,index)=>(

             <OrderCard
  key={index}
  style={{
    background:
      "linear-gradient(135deg, #ffffff, #f8fafc)",
    border:"1px solid rgba(29,78,216,0.12)",
    boxShadow:
      "0 14px 30px rgba(15,23,42,0.08)",
    borderRadius:"22px"
  }}
>

  <Row
    style={{
      display:"flex",
      alignItems:"center",
      gap:"10px",
      marginBottom:"14px"
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
        background:
          "linear-gradient(135deg, #0f172a, #1d4ed8)",
        color:"#facc15",
        fontSize:"18px",
        boxShadow:
          "0 10px 22px rgba(29,78,216,0.18)"
      }}
    >
      💬
    </span>

    <div>
      <div
        style={{
          fontSize:"12px",
          fontWeight:"900",
          color:"#64748b",
          textTransform:"uppercase",
          letterSpacing:"0.5px"
        }}
      >
        Message From
      </div>

      <div
        style={{
          fontSize:"16px",
          fontWeight:"900",
          color:"#0f172a"
        }}
      >
        {
          msg.sender === "rider"
          ? "Rider"
          : msg.sender
        }
      </div>
    </div>
  </Row>

  <Row
    style={{
      background:"#eff6ff",
      border:"1px solid #dbeafe",
      borderRadius:"16px",
      padding:"14px",
      color:"#0f172a",
      fontWeight:"700",
      lineHeight:"1.5",
      marginBottom:"14px"
    }}
  >
    {msg.text}
  </Row>

  <StatusBadge
    style={{
      background:
        "linear-gradient(135deg, #facc15, #f59e0b)",
      color:"#0f172a",
      border:"1px solid rgba(15,23,42,0.10)",
      boxShadow:
        "0 8px 18px rgba(250,204,21,0.22)"
    }}
  >
    {msg.time}
  </StatusBadge>

</OrderCard>

            ))
          }

        </OrdersGrid>

      )
    }

  </>

)}

        {activeSection === "notifications" && (

          <>

            <NotificationsHero>

  <NotificationsHeroContent>

    <NotificationsBadge>
      🔔 Delivery Alerts
    </NotificationsBadge>

    <NotificationsTitle>
      Stay Updated Instantly
    </NotificationsTitle>

    <NotificationsText>
      Track rider updates, order progress, messages,
      and important delivery alerts in one clean notification center.
    </NotificationsText>

  </NotificationsHeroContent>

  <NotificationsHeroIcon>
    🔔
  </NotificationsHeroIcon>

</NotificationsHero>

            {

              allNotifications.length === 0

              ?

              (
<Empty
  style={{
    background:
      "linear-gradient(135deg, #ffffff, #f8fafc)",
    border:"1px solid rgba(250,204,21,0.25)",
    boxShadow:
      "0 14px 30px rgba(15,23,42,0.08)",
    color:"#0f172a",
    fontWeight:"800",
    borderRadius:"22px",
    padding:"32px"
  }}
>
  <div
    style={{
      fontSize:"42px",
      marginBottom:"12px"
    }}
  >
    🔔
  </div>

  <div
    style={{
      fontSize:"20px",
      fontWeight:"900",
      marginBottom:"8px"
    }}
  >
    No notifications yet
  </div>

  <div
    style={{
      fontSize:"14px",
      color:"#64748b",
      fontWeight:"700",
      lineHeight:"1.5"
    }}
  >
    Delivery alerts, rider updates, and order messages will appear here.
  </div>
</Empty>

              )

              :

              (

                <OrdersGrid>

                  {

                    allNotifications.map(

                      (note,index)=>(

                        <OrderCard
  key={index}
  onClick={()=>{

    if(note.orderId){

      setActiveSection("orders");

      setOpenChats((prev)=>({
        ...prev,
        [note.orderId]:true
      }));
    }

  }}
  style={{
    cursor:"pointer"
  }}
>

                         <OrderCard
  key={index}
  style={{
    background:
      "linear-gradient(135deg, #ffffff, #f8fafc)",
    border:"1px solid rgba(250,204,21,0.25)",
    boxShadow:
      "0 14px 30px rgba(15,23,42,0.08)",
    borderRadius:"22px"
  }}
>

  <Row
    style={{
      display:"flex",
      alignItems:"center",
      gap:"10px",
      marginBottom:"14px"
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
        background:
          "linear-gradient(135deg, #0f172a, #1d4ed8)",
        color:"#facc15",
        fontSize:"18px",
        boxShadow:
          "0 10px 22px rgba(29,78,216,0.18)"
      }}
    >
      🔔
    </span>

    <div>
      <div
        style={{
          fontSize:"12px",
          fontWeight:"900",
          color:"#64748b",
          textTransform:"uppercase",
          letterSpacing:"0.5px"
        }}
      >
        Alert From
      </div>

      <div
        style={{
          fontSize:"16px",
          fontWeight:"900",
          color:"#0f172a"
        }}
      >
        {note.sender}
      </div>
    </div>
  </Row>

  <Row
    style={{
      background:"#fefce8",
      border:"1px solid #fde68a",
      borderRadius:"16px",
      padding:"14px",
      color:"#0f172a",
      fontWeight:"800",
      lineHeight:"1.5",
      marginBottom:"14px"
    }}
  >
    {note.text}
  </Row>

  <StatusBadge
    style={{
      background:
        "linear-gradient(135deg, #facc15, #f59e0b)",
      color:"#0f172a",
      border:"1px solid rgba(15,23,42,0.10)",
      boxShadow:
        "0 8px 18px rgba(250,204,21,0.22)"
    }}
  >
    {note.time}
  </StatusBadge>

</OrderCard>

                        </OrderCard>

                      )
                    )
                  }

                </OrdersGrid>

              )
            }

          </>

        )}

        {activeSection === "My Profile" && (

 <OrderCard
  style={{
    maxWidth:"640px",
    margin:"0 auto",
    padding:"18px",
    borderRadius:"22px",
    background:
      "linear-gradient(135deg, #ffffff, #f8fafc)",
    border:"1px solid rgba(29,78,216,0.12)",
    boxShadow:
      "0 12px 28px rgba(15,23,42,0.07)"
  }}
>

    

<div
  style={{
  display:"flex",
  flexDirection:"column",
  alignItems:"flex-start",
  justifyContent:"flex-start",
  margin:"0",
  width:"100%"
}}
>


 <ProfileHero>

  <ProfileHeroPhoto
  src={
    profileImage ||
    user?.profileImage ||
    customerImage
  }
  alt="Customer Profile"
/>

  <ProfileHeroContent>

    <ProfileBadge>
      👤 Customer Profile
    </ProfileBadge>

    <ProfileHeroTitle>
      Manage Your Account
    </ProfileHeroTitle>

    <ProfileHeroText>
      Keep your personal details, contact information,
      and emergency contact updated for smooth deliveries.
    </ProfileHeroText>

  </ProfileHeroContent>

</ProfileHero>

</div>
    
<HeroText
  style={{
    marginTop:"8px",
    marginBottom:"18px",
    textAlign:"center",
    fontSize:"14px",
    fontWeight:"700",
    color:"#64748b"
  }}
>
  Manage your customer profile information.
</HeroText>

   
   <div
  style={{
    display:"block",
    width:"100%",
    maxWidth:"540px",
    margin:"0 auto"
  }}
>

      <div
  style={{
    width:"100%",
    background:"#f8fafc",
    padding:"18px",
    borderRadius:"18px",
    border:"1px solid rgba(29,78,216,0.10)"
  }}
>

     <ProfileDetailRow>
  <strong>
    Name:
  </strong>

  <span>
    {
      profileName || user?.name || "Not added"
    }
  </span>
</ProfileDetailRow>

        {
  profileEditing

  ?

  <>

    <BeautifulInput
      type="text"
      placeholder="Full Name"
      value={profileName}
      onChange={(e)=>
        setProfileName(
          e.target.value
        )
      }
    />

    <BeautifulInput
      type="email"
      placeholder="Email"
      value={profileEmail}
      onChange={(e)=>
        setProfileEmail(
          e.target.value
        )
      }
    />

    <BeautifulInput
      type="text"
      placeholder="Phone"
      value={profilePhone}
      onChange={(e)=>
        setProfilePhone(
          e.target.value
        )
      }
    />

    <BeautifulInput
      type="text"
      placeholder="Address"
      value={profileAddress}
      onChange={(e)=>
        setProfileAddress(
          e.target.value
        )
      }
    />

    <BeautifulInput
  type="date"
  value={profileDOB}
  onChange={(e)=>
    setProfileDOB(
      e.target.value
    )
  }
/>

<select
  value={profileGender}
  onChange={(e)=>
    setProfileGender(
      e.target.value
    )
  }
  style={{
    width:"100%",
    padding:"18px 20px",
    borderRadius:"18px",
    border:"1px solid #dbe4ee",
    background:"white",
    fontSize:"16px",
    outline:"none",
    marginTop:"12px"
  }}
>
  <option value="">
    Select Gender
  </option>

  <option value="Female">
    Female
  </option>

  <option value="Male">
    Male
  </option>

  <option value="Prefer not to say">
    Prefer not to say
  </option>
</select>

<BeautifulInput
  type="text"
  placeholder="Emergency Contact"
  value={profileEmergency}
  onChange={(e)=>
    setProfileEmergency(
      e.target.value
    )
  }
/>

  </>

  :

  <>

   <ProfileDetailRow>
  <strong>
    Email:
  </strong>

  <span>
    {
      profileEmail || "Not added"
    }
  </span>
</ProfileDetailRow>

<ProfileDetailRow>
  <strong>
    Phone:
  </strong>

  <span>
    {
      profilePhone || "Not added"
    }
  </span>
</ProfileDetailRow>

<ProfileDetailRow>
  <strong>
    Address:
  </strong>

  <span>
    {
      profileAddress || "Not added"
    }
  </span>
</ProfileDetailRow>

<ProfileDetailRow>
  <strong>
    Date of Birth:
  </strong>

  <span>
    {
      profileDOB || "Not added"
    }
  </span>
</ProfileDetailRow>

<ProfileDetailRow>
  <strong>
    Gender:
  </strong>

  <span>
    {
      profileGender || "Not added"
    }
  </span>
</ProfileDetailRow>

<ProfileDetailRow>
  <strong>
    Emergency Contact:
  </strong>

  <span>
    {
      profileEmergency || "Not added"
    }
  </span>
</ProfileDetailRow>

  </>
}
      </div>

    </div>

    <ButtonRow
  style={{
    marginTop:"18px",
    justifyContent:"center"
  }}
>

  <Button
    onClick={()=>{

      if(profileEditing){

        saveProfile();

      }else{

        setProfileEditing(true);
      }

    }}
    style={{
      maxWidth:"180px",
      background:
        profileEditing
        ? "linear-gradient(135deg, #facc15, #f59e0b)"
        : "linear-gradient(135deg, #0f172a, #1d4ed8)",
      color:
        profileEditing
        ? "#0f172a"
        : "#facc15",
      fontWeight:"900",
      border:
        profileEditing
        ? "1px solid rgba(15,23,42,0.15)"
        : "1px solid rgba(250,204,21,0.35)",
      boxShadow:
        profileEditing
        ? "0 10px 22px rgba(250,204,21,0.24)"
        : "0 10px 22px rgba(29,78,216,0.20)"
    }}
  >
    {
      profileEditing
      ? "Save Profile"
      : "Edit Profile"
    }
  </Button>

  {
    profileEditing && (

      <Button
        onClick={()=>{

          setProfileEditing(false);

          setProfileName(
            user?.name || ""
          );

          setProfileEmail(
            user?.email || ""
          );

          setProfilePhone(
            user?.phone || ""
          );

          setProfileAddress(
            user?.address || ""
          );

          setProfileDOB(
            user?.dob || ""
          );

          setProfileGender(
            user?.gender || ""
          );

          setProfileEmergency(
            user?.emergencyContact || ""
          );

        }}
        style={{
          maxWidth:"140px",
          background:"#dc2626",
          color:"white",
          fontWeight:"900",
          border:"1px solid rgba(220,38,38,0.25)",
          boxShadow:
            "0 10px 22px rgba(220,38,38,0.16)"
        }}
      >
        Cancel
      </Button>
    )
  }

</ButtonRow>

<OrderSection
  style={{
    marginTop:"18px",
    background:
      "linear-gradient(135deg, #ffffff, #f8fafc)",
    border:"1px solid rgba(29,78,216,0.10)",
    borderRadius:"18px",
    padding:"16px"
  }}
>

  <SectionTitle
    style={{
      marginBottom:"14px",
      fontSize:"18px"
    }}
  >
    Saved Addresses 📍
  </SectionTitle>

  <ProfileDetailRow>
    <strong>
      Home:
    </strong>

    <span>
      {
        profileAddress || "No address added"
      }
    </span>
  </ProfileDetailRow>

  <ProfileDetailRow>
    <strong>
      Work:
    </strong>

    <span>
      Not added
    </span>
  </ProfileDetailRow>

  <ProfileDetailRow>
    <strong>
      Recent Delivery Area:
    </strong>

    <span>
      Accra
    </span>
  </ProfileDetailRow>

</OrderSection>

  </OrderCard>

)}


{activeSection === "Settings" && (

  <>

    <SettingsHero>

  <SettingsHeroContent>

    <SettingsBadge>
      ⚙️ Account Control Center
    </SettingsBadge>

    <SettingsTitle>
      Manage Your MonniDrop Settings
    </SettingsTitle>

    <SettingsText>
      Control account security, privacy, permissions,
      payment protection, and app preferences from one clean place.
    </SettingsText>

  </SettingsHeroContent>

  <SettingsHeroIcon>
    ⚙️
  </SettingsHeroIcon>

</SettingsHero>

    <div
      style={{
        display:"flex",
        flexDirection:"column",
        gap:"20px"
      }}
    >

      {/* ACCOUNT SECURITY */}

     <OrderCard
  style={{
    background:
      "linear-gradient(135deg, #ffffff, #f8fafc)",
    border:"1px solid rgba(29,78,216,0.12)",
    borderRadius:"24px",
    padding:"22px",
    boxShadow:
      "0 14px 32px rgba(15,23,42,0.08)"
  }}
>

  <SectionTitle
  style={{
    marginBottom:"18px",
    display:"flex",
    alignItems:"center",
    gap:"10px",
    color:"#0f172a"
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
      background:
        "linear-gradient(135deg, #0f172a, #1d4ed8)",
      color:"#facc15",
      fontSize:"17px"
    }}
  >
    🔐
  </span>

  Account Security
</SectionTitle>

  <div
    onClick={()=>
      setSelectedSetting(
        "Mobile Phone Number"
      )
    }
   style={{
  padding:"14px 16px",
  border:"1px solid rgba(29,78,216,0.10)",
  borderRadius:"16px",
  cursor:"pointer",
  marginBottom:"10px",
  background:"#ffffff",
  boxShadow:
    "0 8px 18px rgba(15,23,42,0.04)"
}}
  >

    <div
      style={{
        fontWeight:"700",
        color:"#0f172a"
      }}
    >
      Mobile Phone Number
    </div>

    <div
      style={{
        fontSize:"14px",
        color:"#64748b",
        marginTop:"4px"
      }}
    >
      {
        phoneNumber ||
        "Add phone number"
      }
    </div>

    

  </div>

  <div
  onClick={()=>
    setSelectedSetting(
      "Email"
    )
  }
 style={{
  padding:"14px 16px",
  border:"1px solid rgba(29,78,216,0.10)",
  borderRadius:"16px",
  cursor:"pointer",
  marginBottom:"10px",
  background:"#ffffff",
  boxShadow:
    "0 8px 18px rgba(15,23,42,0.04)"
}}
>

  <div
    style={{
      fontWeight:"700",
      color:"#0f172a"
    }}
  >
    Email
  </div>

  <div
    style={{
      fontSize:"14px",
      color:"#64748b",
      marginTop:"4px"
    }}
  >
    {
      email ||
      "Add email address"
    }
  </div>

  <div
  onClick={()=>
    setSelectedSetting(
      "Two-Factor Authentication"
    )
  }
 style={{
  padding:"14px 16px",
  border:"1px solid rgba(29,78,216,0.10)",
  borderRadius:"16px",
  cursor:"pointer",
  marginBottom:"10px",
  background:"#ffffff",
  boxShadow:
    "0 8px 18px rgba(15,23,42,0.04)"
}}
>

  <div
    style={{
      fontWeight:"700",
      color:"#0f172a"
    }}
  >
    Two-Factor Authentication
  </div>

  <div
    style={{
      fontSize:"14px",
      color:
        twoFactorEnabled
        ? "#16a34a"
        : "#64748b",
      marginTop:"4px"
    }}
  >
    {
      twoFactorEnabled
      ? "Enabled"
      : "Disabled"
    }
  </div>
  <div
  onClick={()=>
  setSelectedSetting(
    "Google"
    )
  }
  style={{
  padding:"14px 16px",
  border:"1px solid rgba(29,78,216,0.10)",
  borderRadius:"16px",
  cursor:"pointer",
  marginBottom:"10px",
  background:"#ffffff",
  boxShadow:
    "0 8px 18px rgba(15,23,42,0.04)"
}}
>

  <div
    style={{
      fontWeight:"700",
      color:"#0f172a"
    }}
  >
  Google
  </div>

  <div
    style={{
      fontSize:"14px",
      color:
        googleConnected
        ? "#16a34a"
        : "#64748b",
      marginTop:"4px"
    }}
  >
    {
      googleConnected
      ? "Connected"
      : "Not Connected"
    }
  </div>

</div>
<div
  onClick={()=>
    setSelectedSetting(
      "Facebook"
    )
  }
  style={{
  padding:"14px 16px",
  border:"1px solid rgba(29,78,216,0.10)",
  borderRadius:"16px",
  cursor:"pointer",
  marginBottom:"10px",
  background:"#ffffff",
  boxShadow:
    "0 8px 18px rgba(15,23,42,0.04)"
}}
>

  <div
    style={{
      fontWeight:"700",
      color:"#0f172a"
    }}
  >
    Facebook
  </div>

  <div
    style={{
      fontSize:"14px",
      color:
        facebookConnected
        ? "#16a34a"
        : "#64748b",
      marginTop:"4px"
    }}
  >
    {
      facebookConnected
      ? "Connected"
      : "Not Connected"
    }
  </div>

</div>

<div
  onClick={()=>
    setSelectedSetting(
      "Sign In Activity"
    )
  }
  style={{
  padding:"14px 16px",
  border:"1px solid rgba(29,78,216,0.10)",
  borderRadius:"16px",
  cursor:"pointer",
  marginBottom:"10px",
  background:"#ffffff",
  boxShadow:
    "0 8px 18px rgba(15,23,42,0.04)"
}}
>

  <div
    style={{
      fontWeight:"700",
      color:"#0f172a"
    }}
  >
    Sign In Activity
  </div>

  <div
    style={{
      fontSize:"14px",
      color:"#64748b",
      marginTop:"4px"
    }}
  >
    View recent account logins
  </div>

</div>

</div>

</div>

  {
    [
      "Password",
      "Third-Party Account",
      "Delete Your MonniDrop Account"
    ].map((item,index)=>(

      <div
        key={index}
        onClick={()=>
          setSelectedSetting(item)
        }
        style={{
  padding:"14px 16px",
  border:"1px solid rgba(29,78,216,0.10)",
  borderRadius:"16px",
  cursor:"pointer",
  marginBottom:"10px",
  background:"#ffffff",
  boxShadow:
    "0 8px 18px rgba(15,23,42,0.04)"
}}
      >
        {item}
      </div>

    ))
  }

</OrderCard>

      {/* PRIVACY */}

      <OrderCard
  style={{
    background:
      "linear-gradient(135deg, #ffffff, #f8fafc)",
    border:"1px solid rgba(29,78,216,0.12)",
    borderRadius:"24px",
    padding:"22px",
    boxShadow:
      "0 14px 32px rgba(15,23,42,0.08)",
    marginTop:"22px"
  }}
>

        <SectionTitle
  style={{
    marginBottom:"18px",
    display:"flex",
    alignItems:"center",
    gap:"10px",
    color:"#0f172a"
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
      background:
        "linear-gradient(135deg, #0f172a, #1d4ed8)",
      color:"#facc15",
      fontSize:"17px"
    }}
  >
    🛡️
  </span>

  Privacy
</SectionTitle>

        {
          [
            "Required Cookies & Technologies",
            "Personalized Advertised Listing",
            "Additional Privacy Option"
          ].map((item,index)=>(

            <div
              key={index}
              onClick={()=>
                setSelectedSetting(item)
              }
             style={{
  padding:"14px 16px",
  border:"1px solid rgba(29,78,216,0.10)",
  borderRadius:"16px",
  cursor:"pointer",
  marginBottom:"10px",
  background:"#ffffff",
  fontWeight:"800",
  boxShadow:
    "0 8px 18px rgba(15,23,42,0.04)"
}}
            >
              {item}
            </div>

          ))
        }

      </OrderCard>

      {/* PERMISSIONS */}

      <OrderCard>

        <SectionTitle
  style={{
    marginBottom:"12px",
    display:"flex",
    alignItems:"center",
    gap:"10px",
    color:"#0f172a"
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
      background:
        "linear-gradient(135deg, #0f172a, #1d4ed8)",
      color:"#facc15",
      fontSize:"17px"
    }}
  >
    🔑
  </span>

  Permissions
</SectionTitle>

        <HeroText
  style={{
    marginBottom:"18px",
    color:"#64748b",
    fontSize:"14px",
    fontWeight:"700"
  }}
>
  Access certain device features with your permission.
</HeroText>

        {
          [
            "Camera",
            "Notifications",
            "Live Activities"
          ].map((item,index)=>(

            <div
              key={index}
              onClick={()=>
                setSelectedSetting(item)
              }
              style={{
  padding:"14px 16px",
  border:"1px solid rgba(29,78,216,0.10)",
  borderRadius:"16px",
  cursor:"pointer",
  marginBottom:"10px",
  background:"#ffffff",
  fontWeight:"800",
  boxShadow:
    "0 8px 18px rgba(15,23,42,0.04)"
}}
            >
              {item}
            </div>

          ))
        }

      </OrderCard>

      {/* SAFETY CENTER */}

      <OrderCard>

        <SectionTitle
  style={{
    marginBottom:"18px",
    display:"flex",
    alignItems:"center",
    gap:"10px",
    color:"#0f172a"
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
      background:
        "linear-gradient(135deg, #0f172a, #1d4ed8)",
      color:"#facc15",
      fontSize:"17px"
    }}
  >
    🔒
  </span>

  Safety Center
</SectionTitle>

        {
          [
            "How Your Data Is Protected",
            "Account Protection",
            "Payment Protection"
          ].map((item,index)=>(

            <div
              key={index}
              onClick={()=>
                setSelectedSetting(item)
              }
              style={{
  padding:"14px 16px",
  border:"1px solid rgba(29,78,216,0.10)",
  borderRadius:"16px",
  cursor:"pointer",
  marginBottom:"10px",
  background:"#ffffff",
  fontWeight:"800",
  boxShadow:
    "0 8px 18px rgba(15,23,42,0.04)"
}}
            >
              {item}
            </div>

          ))
        }

      </OrderCard>

      {/* GENERAL SETTINGS */}

      <OrderCard
  style={{
    background:
      "linear-gradient(135deg, #ffffff, #f8fafc)",
    border:"1px solid rgba(29,78,216,0.12)",
    borderRadius:"24px",
    padding:"22px",
    boxShadow:
      "0 14px 32px rgba(15,23,42,0.08)",
    marginTop:"22px"
  }}
>

        <SectionTitle
  style={{
    marginBottom:"18px",
    display:"flex",
    alignItems:"center",
    gap:"10px",
    color:"#0f172a"
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
      background:
        "linear-gradient(135deg, #0f172a, #1d4ed8)",
      color:"#facc15",
      fontSize:"17px"
    }}
  >
    🎛️
  </span>

  General
</SectionTitle>

        <div
  onClick={()=>
    setSelectedSetting(
      "Country & Region"
    )
  }
  style={{
  padding:"14px 16px",
  border:"1px solid rgba(29,78,216,0.10)",
  borderRadius:"16px",
  cursor:"pointer",
  marginBottom:"10px",
  background:"#ffffff",
  boxShadow:
    "0 8px 18px rgba(15,23,42,0.04)"
}}
>

  <div
    style={{
      fontWeight:"700",
      color:"#0f172a"
    }}
  >
    Country & Region
  </div>

  <div
    style={{
      fontSize:"14px",
      color:"#64748b",
      marginTop:"4px"
    }}
  >
    {country}
  </div>

</div>

<div
  onClick={()=>
    setSelectedSetting(
      "Language"
    )
  }
  style={{
  padding:"14px 16px",
  border:"1px solid rgba(29,78,216,0.10)",
  borderRadius:"16px",
  cursor:"pointer",
  marginBottom:"10px",
  background:"#ffffff",
  boxShadow:
    "0 8px 18px rgba(15,23,42,0.04)"
}}
>

  <div
    style={{
      fontWeight:"700",
      color:"#0f172a"
    }}
  >
    Language
  </div>

  <div
    style={{
      fontSize:"14px",
      color:"#64748b",
      marginTop:"4px"
    }}
  >
    {language}
  </div>

</div>

<div
  onClick={()=>
    setSelectedSetting(
      "Currency"
    )
  }
  style={{
  padding:"14px 16px",
  border:"1px solid rgba(29,78,216,0.10)",
  borderRadius:"16px",
  cursor:"pointer",
  marginBottom:"10px",
  background:"#ffffff",
  boxShadow:
    "0 8px 18px rgba(15,23,42,0.04)"
}}
>

  <div
    style={{
      fontWeight:"700",
      color:"#0f172a"
    }}
  >
    Currency
  </div>

  <div
    style={{
      fontSize:"14px",
      color:"#64748b",
      marginTop:"4px"
    }}
  >
    {currency}
  </div>

</div>

        {
          [
            "Your Payment Method",
            "Notifications",
            "About This App",
            "Legal Terms & Policies",
            "Share This App",
            "Switch Account",
            "Sign Out"
          ].map((item,index)=>(

            <div
              key={index}
              onClick={()=>
                setSelectedSetting(item)
              }
             style={{
  padding:"14px 16px",
  border:"1px solid rgba(29,78,216,0.10)",
  borderRadius:"16px",
  cursor:"pointer",
  marginBottom:"10px",
  background:"#ffffff",
  boxShadow:
    "0 8px 18px rgba(15,23,42,0.04)"
}}
            >
              {item}
            </div>

          ))
        }

      </OrderCard>

    </div>

{
  selectedSetting && (

    <div
      style={{
        position:"fixed",
        top:0,
        left:0,
        width:"100%",
        height:"100%",
        background:"rgba(0,0,0,0.5)",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        zIndex:2000
      }}
    >

      <div
        style={{
          width:"90%",
          maxWidth:"420px",
          background:"white",
          borderRadius:"24px",
          padding:"28px"
        }}
      >

        <div
          style={{
            display:"flex",
            alignItems:"center",
            gap:"10px",
            marginBottom:"18px"
          }}
        >
          <span
            style={{
              width:"36px",
              height:"36px",
              borderRadius:"13px",
              display:"inline-flex",
              alignItems:"center",
              justifyContent:"center",
              background:
                "linear-gradient(135deg, #0f172a, #1d4ed8)",
              color:"#facc15",
              fontWeight:"900"
            }}
          >
            {
              selectedSetting === "Sign Out"
              ? "🚪"
              : "⚙️"
            }
          </span>

          <div
            style={{
              fontSize:"20px",
              fontWeight:"900",
              color:"#0f172a"
            }}
          >
            {selectedSetting}
          </div>
        </div>

        {
          selectedSetting === "Sign Out" && (

            <div
              style={{
                background:"#fef2f2",
                border:"1px solid #fecaca",
                borderRadius:"16px",
                padding:"16px",
                color:"#7f1d1d",
                fontWeight:"800",
                lineHeight:"1.6",
                marginBottom:"16px"
              }}
            >
              Are you sure you want to sign out of your MonniDrop account?
              You will need to log in again to access your dashboard.
            </div>
          )
        }

        {
          selectedSetting === "Mobile Phone Number" && (

            <BeautifulInput
              type="tel"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e)=>
                setPhoneNumber(
                  e.target.value
                )
              }
            />
          )
        }

        {
          selectedSetting === "Email" && (

            <BeautifulInput
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e)=>
                setEmail(
                  e.target.value
                )
              }
            />
          )
        }

        {
          selectedSetting === "Password" && (

            <>

              <BeautifulInput
                type={
                  showPasswords
                  ? "text"
                  : "password"
                }
                placeholder="Current password"
                value={currentPassword}
                onChange={(e)=>
                  setCurrentPassword(
                    e.target.value
                  )
                }
              />

              <BeautifulInput
                type={
                  showPasswords
                  ? "text"
                  : "password"
                }
                placeholder="New password"
                value={newPassword}
                onChange={(e)=>
                  setNewPassword(
                    e.target.value
                  )
                }
              />

              <BeautifulInput
                type={
                  showPasswords
                  ? "text"
                  : "password"
                }
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e)=>
                  setConfirmPassword(
                    e.target.value
                  )
                }
              />

              <Button
                type="button"
                onClick={()=>
                  setShowPasswords(
                    !showPasswords
                  )
                }
                style={{
                  marginTop:"12px",
                  background:"#eff6ff",
                  color:"#1d4ed8",
                  fontWeight:"900"
                }}
              >
                {
                  showPasswords
                  ? "Hide Passwords"
                  : "Show Passwords"
                }
              </Button>

            </>
          )
        }

        {
          selectedSetting === "Country & Region" && (

            <select
              value={country}
              onChange={(e)=>
                setCountry(
                  e.target.value
                )
              }
              style={{
                width:"100%",
                padding:"14px",
                borderRadius:"14px",
                border:"1px solid rgba(29,78,216,0.18)",
                fontWeight:"800",
                color:"#0f172a",
                outline:"none"
              }}
            >
              <option value="Ghana">
                Ghana
              </option>

              <option value="Nigeria">
                Nigeria
              </option>

              <option value="Kenya">
                Kenya
              </option>

              <option value="South Africa">
                South Africa
              </option>
            </select>
          )
        }

        {
          selectedSetting === "Language" && (

            <select
              value={language}
              onChange={(e)=>
                setLanguage(
                  e.target.value
                )
              }
              style={{
                width:"100%",
                padding:"14px",
                borderRadius:"14px",
                border:"1px solid rgba(29,78,216,0.18)",
                fontWeight:"800",
                color:"#0f172a",
                outline:"none"
              }}
            >
              <option value="English">
                English
              </option>

              <option value="Twi">
                Twi
              </option>

              <option value="French">
                French
              </option>
            </select>
          )
        }

        {
          selectedSetting === "Currency" && (

            <select
              value={currency}
              onChange={(e)=>
                setCurrency(
                  e.target.value
                )
              }
              style={{
                width:"100%",
                padding:"14px",
                borderRadius:"14px",
                border:"1px solid rgba(29,78,216,0.18)",
                fontWeight:"800",
                color:"#0f172a",
                outline:"none"
              }}
            >
              <option value="GHS">
                GHS
              </option>

              <option value="USD">
                USD
              </option>

              <option value="NGN">
                NGN
              </option>
            </select>
          )
        }

        {
          selectedSetting === "Your Payment Method" && (

            <select
              value={paymentMethod}
              onChange={(e)=>
                setPaymentMethod(
                  e.target.value
                )
              }
              style={{
                width:"100%",
                padding:"14px",
                borderRadius:"14px",
                border:"1px solid rgba(29,78,216,0.18)",
                fontWeight:"800",
                color:"#0f172a",
                outline:"none"
              }}
            >
              <option value="">
                Select payment method
              </option>

              <option value="cash">
                Cash on Delivery
              </option>

              <option value="momo">
                Mobile Money
              </option>
            </select>
          )
        }

        {
          selectedSetting === "Two-Factor Authentication" && (

            <div
              style={{
                background:"#eff6ff",
                border:"1px solid #dbeafe",
                borderRadius:"16px",
                padding:"16px"
              }}
            >
              <label
                style={{
                  display:"flex",
                  alignItems:"center",
                  justifyContent:"space-between",
                  gap:"12px",
                  fontWeight:"900",
                  color:"#0f172a"
                }}
              >
                Enable two-factor authentication

                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e)=>
                    setTwoFactorEnabled(
                      e.target.checked
                    )
                  }
                />
              </label>
            </div>
          )
        }

        {
          selectedSetting === "Google" && (

            <div
              style={{
                background:"#eff6ff",
                border:"1px solid #dbeafe",
                borderRadius:"16px",
                padding:"16px"
              }}
            >
              <label
                style={{
                  display:"flex",
                  alignItems:"center",
                  justifyContent:"space-between",
                  gap:"12px",
                  fontWeight:"900",
                  color:"#0f172a"
                }}
              >
                Connect Google account

                <input
                  type="checkbox"
                  checked={googleConnected}
                  onChange={(e)=>
                    setGoogleConnected(
                      e.target.checked
                    )
                  }
                />
              </label>
            </div>
          )
        }

        {
          selectedSetting === "Facebook" && (

            <div
              style={{
                background:"#eff6ff",
                border:"1px solid #dbeafe",
                borderRadius:"16px",
                padding:"16px"
              }}
            >
              <label
                style={{
                  display:"flex",
                  alignItems:"center",
                  justifyContent:"space-between",
                  gap:"12px",
                  fontWeight:"900",
                  color:"#0f172a"
                }}
              >
                Connect Facebook account

                <input
                  type="checkbox"
                  checked={facebookConnected}
                  onChange={(e)=>
                    setFacebookConnected(
                      e.target.checked
                    )
                  }
                />
              </label>
            </div>
          )
        }

        {
          selectedSetting === "Notifications" && (

            <div
              style={{
                background:"#eff6ff",
                border:"1px solid #dbeafe",
                borderRadius:"16px",
                padding:"16px",
                color:"#0f172a",
                fontWeight:"800"
              }}
            >
              Notifications are enabled for order updates,
              rider messages, and delivery alerts.
            </div>
          )
        }

        {
          ![
            "Mobile Phone Number",
            "Email",
            "Password",
            "Country & Region",
            "Language",
            "Currency",
            "Your Payment Method",
            "Two-Factor Authentication",
            "Google",
            "Facebook",
            "Notifications",
            "Sign Out"
          ].includes(selectedSetting) && (

            <textarea
              defaultValue={selectedSetting}
              style={{
                width:"100%",
                minHeight:"120px",
                padding:"14px",
                borderRadius:"14px",
                border:"1px solid rgba(29,78,216,0.18)",
                fontWeight:"800",
                color:"#0f172a",
                outline:"none",
                resize:"vertical"
              }}
            />
          )
        }

        <ButtonRow
          style={{
            marginTop:"18px"
          }}
        >

          {
            selectedSetting === "Sign Out"

            ?

            <>

              <Button
                onClick={logout}
                style={{
                  background:"#dc2626",
                  color:"white",
                  fontWeight:"900",
                  border:"1px solid rgba(220,38,38,0.25)",
                  boxShadow:
                    "0 10px 22px rgba(220,38,38,0.18)"
                }}
              >
                Yes, Sign Out
              </Button>

              <Button
                onClick={()=>
                  setSelectedSetting(null)
                }
                style={{
                  background:
                    "linear-gradient(135deg, #0f172a, #1d4ed8)",
                  color:"#facc15",
                  fontWeight:"900",
                  border:"1px solid rgba(250,204,21,0.35)"
                }}
              >
                Cancel
              </Button>

            </>

            :

            <>

              <Button
  onClick={async()=>{

    try{

      const settingsData = {
        phoneNumber,
        email,
        country,
        language,
        currency,
        paymentMethod,
        twoFactorEnabled,
        googleConnected,
        facebookConnected
      };

      const res =
        await API.put(
          "/customer/settings",
          settingsData
        );

      localStorage.setItem(
        "monnidropCustomerSettings",
        JSON.stringify(
          res.data.settings || settingsData
        )
      );

      alert(
        `${selectedSetting} saved successfully`
      );

      setSelectedSetting(null);

    }catch(err){

      console.log(
        "SAVE SETTINGS ERROR:",
        err.response?.data || err
      );

      alert(
        err.response?.data?.message ||
        "Failed to save settings"
      );
    }

  }}
  style={{
    background:
      "linear-gradient(135deg, #facc15, #f59e0b)",
    color:"#0f172a",
    fontWeight:"900",
    border:"1px solid rgba(15,23,42,0.12)",
    boxShadow:
      "0 10px 22px rgba(250,204,21,0.22)"
  }}
>
  Save
</Button>

              <Button
                onClick={()=>
                  setSelectedSetting(null)
                }
                style={{
                  background:
                    "linear-gradient(135deg, #0f172a, #1d4ed8)",
                  color:"#facc15",
                  fontWeight:"900",
                  border:"1px solid rgba(250,204,21,0.35)"
                }}
              >
                Cancel
              </Button>

            </>
          }

               </ButtonRow>

      </div>

    </div>

  )
}

  </>

)}

{
  ratingModalOrder && (

    <RatingOverlay>

      <RatingCard>

        <RatingTitle>
          Rate Your Rider
        </RatingTitle>

        <RatingText>
          Your delivery from{" "}
          <strong>
            {ratingModalOrder.pickupLocation}
          </strong>
          {" "}to{" "}
          <strong>
            {ratingModalOrder.dropoffLocation}
          </strong>
          {" "}has been delivered.
          Please rate{" "}
          <strong>
            {
              ratingModalOrder.rider?.name ||
              "your rider"
            }
          </strong>
          .
        </RatingText>

        <StarRow>

          {
            [1,2,3,4,5].map((star)=>(

              <StarButton
                key={star}
                type="button"
                $selected={star <= riderRating}
                onClick={()=>
                  setRiderRating(star)
                }
              >
                ★
              </StarButton>
            ))
          }

        </StarRow>

        <RatingTextArea
          placeholder="Optional comment. Example: Rider was fast, polite, and handled the item carefully."
          value={riderRatingComment}
          onChange={(e)=>
            setRiderRatingComment(
              e.target.value
            )
          }
        />

        <RatingActionRow>

          <RatingCancelButton
            type="button"
            onClick={closeRiderRatingModal}
          >
            Later
          </RatingCancelButton>

          <RatingSubmitButton
            type="button"
            disabled={submittingRiderRating}
            onClick={submitRiderRating}
          >
            {
              submittingRiderRating
              ? "Submitting..."
              : "Submit Rating"
            }
          </RatingSubmitButton>

        </RatingActionRow>

      </RatingCard>

    </RatingOverlay>
  )
}

</Main>

</Layout>

  );

}


   