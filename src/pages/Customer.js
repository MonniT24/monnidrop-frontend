import React,{useState,useEffect,useRef} from "react";
import styled,{createGlobalStyle} from "styled-components";

import API from "../api/api";
import socket from "../socket";

import CustomerDashboard from "./customer/CustomerDashboard";
import CustomerProfile from "./customer/CustomerProfile";
import CustomerOrders from "./customer/CustomerOrders";
import CustomerSettings from "./customer/CustomerSettings";
import CustomerMessages from "./customer/CustomerMessages";
import CustomerNotifications from "./customer/CustomerNotifications";
import CustomerCreateOrder from "./customer/CustomerCreateOrder";

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
  FiEyeOff,
  FiMessageCircle,
  FiLink,
  FiMoreHorizontal,
  FiArrowLeft
} from "react-icons/fi";

import {
  FaWhatsapp,
  FaFacebookF
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
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

const AddressGrid = styled.div`
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:14px;
`;

const AddressBox = styled.div`
  background:#ffffff;
  border:1px solid #dbeafe;
  border-radius:16px;
  padding:16px;
  box-shadow:0 8px 20px rgba(15,23,42,0.06);
`;

const AddressLabel = styled.div`
  color:#1d4ed8;
  font-size:14px;
  font-weight:900;
  margin-bottom:8px;
`;

const AddressValue = styled.div`
  color:#0f172a;
  font-size:16px;
  font-weight:800;
  line-height:1.4;
  word-break:break-word;
`;

const CustomerProfilePage = styled.div`
  display:grid;
  grid-template-columns:300px 1fr;
  gap:24px;

  @media(max-width:900px){
    grid-template-columns:1fr;
  }
`;

const CustomerProfileLeftCard = styled.div`
  background:linear-gradient(135deg,#0f172a,#1d4ed8);
  border-radius:24px;
  padding:18px 16px;
  min-height:unset;
  align-self:start;
  text-align:center;
  color:white;
  height:fit-content;
  box-shadow:0 14px 30px rgba(15,23,42,0.16);
`;

const CustomerVerifiedBadge = styled.div`
  background:#dcfce7;
  color:#166534;
  border-radius:18px;
  padding:10px 12px;
  font-size:12px;
  font-weight:900;
  margin-bottom:24px;

  span{
    display:inline-block;
    width:11px;
    height:11px;
    background:#22c55e;
    border-radius:50%;
    margin-right:8px;
  }
`;

const CustomerProfileMainImage = styled.img`
  width:118px;
  height:118px;
  border-radius:50%;
  object-fit:cover;
  border:5px solid #facc15;
  box-shadow:
  0 0 0 6px rgba(250,204,21,0.18),
  0 12px 24px rgba(15,23,42,0.20);
  background:white;
`;

const CustomerProfileName = styled.h2`
  margin:16px 0 4px;
  font-size:20px;
  font-weight:900;
`;

const CustomerProfileEmail = styled.p`
  margin:0;
  color:#dbeafe;
  font-size:14px;
  font-weight:800;
`;

const CustomerStatusPill = styled.div`
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:8px;

  margin-top:18px;
  margin-bottom:16px;

  padding:9px 18px;

  border-radius:999px;

  background:#dcfce7;
  color:#166534;

  font-size:14px;
  font-weight:900;
`;

const CustomerProfileRightCard = styled.div`
  background:white;
  border-radius:24px;
  padding:22px;
  border:1px solid #e5e7eb;
  box-shadow:0 12px 28px rgba(15,23,42,0.07);

  position:relative;
  overflow:hidden;

  &::before{
    content:"";
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:4px;

    background:linear-gradient(
      90deg,
      #0f172a,
      #1d4ed8,
      #facc15
    );
  }
`;

const CustomerProfileHeader = styled.div`
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:18px;
  margin-bottom:24px;

  @media(max-width:600px){
    flex-direction:column;
  }
`;

const CustomerProfileTitle = styled.h2`
  margin:0;
  color:#0f172a;
  font-size:${props => props.small ? "20px" : "26px"};
  font-weight:900;
`;

const CustomerProfileSubTitle = styled.p`
  margin:5px 0 0;
  color:#64748b;
  font-size:14px;
  font-weight:800;
`;

const CustomerEditButton = styled.button`
  min-width:110px;

  border:none;
  border-radius:12px;

  padding:10px 16px;

  background:linear-gradient(
    135deg,
    #0f172a,
    #1d4ed8
  );

  color:#facc15;

  font-size:13px;
  font-weight:800;

  cursor:pointer;

  transition:0.25s ease;

  &:hover{
    transform:translateY(-2px);
  }
`;

const CustomerOnlineStatus = styled.div`
  display:flex;
  align-items:center;
  gap:8px;
  color:#0f172a;
  font-size:16px;
  font-weight:900;
`;

const CustomerOnlineDot = styled.span`
  width:13px;
  height:13px;
  border-radius:50%;
  background:#22c55e;

  box-shadow:
    0 0 0 0 rgba(34,197,94,0.7);

  animation:customerOnlineBlink 1.3s infinite;

  @keyframes customerOnlineBlink{
    0%{
      box-shadow:0 0 0 0 rgba(34,197,94,0.7);
      opacity:1;
    }

    70%{
      box-shadow:0 0 0 9px rgba(34,197,94,0);
      opacity:0.55;
    }

    100%{
      box-shadow:0 0 0 0 rgba(34,197,94,0);
      opacity:1;
    }
  }
`;

const CustomerInfoBox = styled.div`
  background:${props => props.highlight ? "#fefce8" : "#f8fafc"};
  border:1px solid ${props => props.highlight ? "#fde68a" : "#e5e7eb"};
  border-radius:14px;
  padding:14px 16px;

  label{
    display:block;
    color:${props => props.highlight ? "#92400e" : "#64748b"};
    font-size:11px;
    letter-spacing:0.5px;
    font-weight:900;
    margin-bottom:6px;
  }

  strong{
  color:#0f172a;
  font-size:15px;
  font-weight:800;
  line-height:1.3;
  word-break:break-word;
}
`;

const CustomerSaveButton = styled.button`
  border:none;
  border-radius:15px;
  padding:13px 16px;
  background:linear-gradient(135deg,#facc15,#f59e0b);
  color:#0f172a;
  font-size:14px;
  font-weight:900;
  cursor:pointer;
`;

const CustomerInfoGrid = styled.div`
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:14px;

  @media(max-width:700px){
    grid-template-columns:1fr;
  }
`;

const CustomerDivider = styled.div`
  height:1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      #e5e7eb,
      transparent
    );

  margin:22px 0;
`;

const CustomerSectionHeader = styled.div`
  display:flex;
  align-items:center;
  gap:10px;

  margin-bottom:18px;

  color:#0f172a;

  font-size:18px;
  font-weight:900;

  span{
    font-size:20px;
  }
`;

const CustomerEditGrid = styled.div`
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:16px;

  @media(max-width:700px){
    grid-template-columns:1fr;
  }
`;

const ProfileDetailRow = styled.div`
  display:grid;
  grid-template-columns:210px 1fr;
  align-items:center;
  gap:12px;
  background:#ffffff;
  border:1px solid #e0ecff;
  border-radius:14px;
  padding:14px 18px;
  margin-bottom:12px;

  strong{
    color:#1d4ed8;
    font-size:15px;
    font-weight:900;
    white-space:nowrap;
  }

  span{
    color:#0f172a;
    font-size:15px;
    font-weight:800;
    word-break:break-word;
  }

  @media(max-width:600px){
    grid-template-columns:1fr;
    gap:6px;
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

const LocationHint = styled.div`
  display:inline-flex;
  align-items:center;
  gap:6px;

  margin-top:10px;
  padding:7px 10px;

  border-radius:999px;

  background:#eff6ff;
  border:1px solid #dbeafe;

  color:#1d4ed8;

  font-size:12px;
  font-weight:800;
`;

const SuggestionBox = styled.div`
  background:#ffffff;

  border:1px solid rgba(29,78,216,0.14);
  border-radius:18px;

  margin-top:10px;
  overflow:hidden;

  box-shadow:
    0 12px 26px rgba(15,23,42,0.08);
`;

const SuggestionItem = styled.button`
  width:100%;

  border:none;
  border-bottom:1px solid #eef2ff;

  background:#ffffff;
  color:#0f172a;

  padding:13px 15px;

  text-align:left;

  font-size:14px;
  font-weight:800;

  cursor:pointer;

  transition:0.2s ease;

  &:hover{
    background:#eff6ff;
    color:#1d4ed8;
  }

  &:last-child{
    border-bottom:none;
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
  border-radius:18px;
  padding:16px;
  box-shadow:0 8px 20px rgba(15,23,42,0.06);
  border:1px solid #eef2f7;
  position:relative;
  overflow:hidden;
  min-height:125px;

  transition:0.25s ease;

  &:hover{
    transform:translateY(-4px);
  }

  @media(max-width:480px){
    padding:14px;
    border-radius:16px;
    min-height:120px;
  }
`;

const PremiumStatIcon = styled.div`
  width:32px;
  height:32px;
  border-radius:12px;
  display:flex;
  align-items:center;
  justify-content:center;
  background:${props => props.bg || "#eff6ff"};
  color:${props => props.color || "#2563eb"};
  font-size:16px;
  margin-bottom:8px;
`;

const PremiumStatLabel = styled.div`
  color:#64748b;
  font-size:13px;
  font-weight:900;
  margin-bottom:6px;
`;

const PremiumStatValue = styled.div`
  font-size:24px;
  font-weight:900;
  color:#0f172a;
  line-height:1;
`;

const PremiumStatNote = styled.div`
  color:#94a3b8;
  font-size:10px;
  line-height:1.4;
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

    const [selectedSetting,setSelectedSetting] = useState("");

   const [country,setCountry] = useState(()=>{
  return localStorage.getItem("monnidropCountry") || "Ghana";
});

const [language,setLanguage] = useState(()=>{
  return localStorage.getItem("monnidropLanguage") || "English";
});

const [currency,setCurrency] = useState(()=>{
  return localStorage.getItem("monnidropCurrency") || "GHS";
});

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

  const [showCompleteProfile,
  setShowCompleteProfile] =
    useState(false);

const [savingCompleteProfile,
  setSavingCompleteProfile] =
    useState(false);

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

      const savedRatedOrders =
        JSON.parse(
          localStorage.getItem(
            "monnidropRatedRiderOrders"
          ) || "[]"
        );

      return Array.isArray(savedRatedOrders)
        ? savedRatedOrders.map((id)=>
            id.toString()
          )
        : [];

    }catch(err){

      return [];
    }
  });

  const [notifications,setNotifications] =
  useState(()=>{

    try{

      const savedNotifications =
        JSON.parse(
          localStorage.getItem("monnidropCustomerNotifications") || "[]"
        );

      return Array.isArray(savedNotifications)
        ? savedNotifications
        : [];

    }catch(err){

      return [];
    }
  });

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

  // ADENTA / MADINA / LEGON

  "Adenta Commandos":{
    lat:5.7089,
    lng:-0.1668
  },

  "Adenta Barrier":{
    lat:5.7045,
    lng:-0.1676
  },

  "Adenta SDA Junction":{
    lat:5.7068,
    lng:-0.1695
  },

  "Adenta Frafraha":{
    lat:5.7171,
    lng:-0.1707
  },

  "Adenta Housing Down":{
    lat:5.7009,
    lng:-0.1701
  },

  "Adenta New Legon":{
    lat:5.7201,
    lng:-0.1545
  },

  "Madina Zongo Junction":{
    lat:5.6825,
    lng:-0.1653
  },

  "Madina Firestone":{
    lat:5.6892,
    lng:-0.1707
  },

  "Madina Market":{
    lat:5.6819,
    lng:-0.1638
  },

  "Madina Ritz Junction":{
    lat:5.6762,
    lng:-0.1714
  },

  "Madina Social Welfare":{
    lat:5.6798,
    lng:-0.1702
  },

  "Legon Boundary":{
    lat:5.6504,
    lng:-0.1865
  },

  "University of Ghana Legon":{
    lat:5.6509,
    lng:-0.1869
  },

  "Okponglo":{
    lat:5.6375,
    lng:-0.1750
  },

  "Atomic Junction":{
    lat:5.6508,
    lng:-0.1880
  },

  "Haatso":{
    lat:5.6400,
    lng:-0.2360
  },

  "Agbogba":{
    lat:5.6687,
    lng:-0.2158
  },

  "Wisconsin University Agbogba Road":{
    lat:5.6665,
    lng:-0.2174
  },

  "Ashongman":{
    lat:5.7003,
    lng:-0.2456
  },

  "North Legon":{
    lat:5.6627,
    lng:-0.2002
  },

  "West Legon":{
    lat:5.6462,
    lng:-0.2154
  },

  // EAST LEGON / BOTWE / SPINTEX

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

  "American House East Legon":{
    lat:5.6379,
    lng:-0.1526
  },

  "Adjiringanor":{
    lat:5.6486,
    lng:-0.1380
  },

  "Ashaley Botwe":{
    lat:5.6602,
    lng:-0.1323
  },

  "Nmai Dzorn":{
    lat:5.6698,
    lng:-0.1257
  },

  "Oyarifa":{
    lat:5.7193,
    lng:-0.1482
  },

  "Pantang":{
    lat:5.7022,
    lng:-0.1686
  },

  "Abokobi":{
    lat:5.7005,
    lng:-0.1982
  },

  "Spintex":{
    lat:5.6258,
    lng:-0.1067
  },

  "Manet Spintex":{
    lat:5.6284,
    lng:-0.1144
  },

  "Baatsona":{
    lat:5.6357,
    lng:-0.0928
  },

  "Lashibi":{
    lat:5.6429,
    lng:-0.0755
  },

  "Sakumono":{
    lat:5.6250,
    lng:-0.0608
  },

  "Community 18 Junction":{
    lat:5.6351,
    lng:-0.0732
  },

  // TSE-ADDO / TESHIE / NUNGUA / LABADI

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

  "Teshie Camp 2":{
    lat:5.5844,
    lng:-0.1081
  },

  "Nungua Coldstore":{
    lat:5.6012,
    lng:-0.0778
  },

  "Nungua Barrier":{
    lat:5.6168,
    lng:-0.0749
  },

  "Nungua Junction":{
    lat:5.6006,
    lng:-0.0770
  },

  "Labadi":{
    lat:5.5612,
    lng:-0.1510
  },

  "La Trade Fair":{
    lat:5.5658,
    lng:-0.1452
  },

  "Labone":{
    lat:5.5689,
    lng:-0.1724
  },

  "Cantonments":{
    lat:5.5766,
    lng:-0.1675
  },

  "The Bank Hospital Cantonments":{
    lat:5.5795,
    lng:-0.1658
  },

  // OSU / AIRPORT / DZORWULU / RIDGE

  "Osu":{
    lat:5.5560,
    lng:-0.1820
  },

  "Oxford Street Osu":{
    lat:5.5554,
    lng:-0.1823
  },

  "Airport Residential":{
    lat:5.6050,
    lng:-0.1714
  },

  "Airport Junction":{
    lat:5.5996,
    lng:-0.1740
  },

  "Dzorwulu":{
    lat:5.6039,
    lng:-0.2231
  },

  "37 Military Hospital":{
    lat:5.5718,
    lng:-0.1907
  },

  "Ridge":{
    lat:5.5606,
    lng:-0.1969
  },

  "Roman Ridge":{
    lat:5.5918,
    lng:-0.1936
  },

  "North Ridge":{
    lat:5.5662,
    lng:-0.2021
  },

  "Kanda":{
    lat:5.5736,
    lng:-0.2066
  },

  "Asylum Down":{
    lat:5.5674,
    lng:-0.2115
  },

  // CIRCLE / KANESHIE / ACHIMOTA / LAPAZ

  "Circle Neoplan":{
    lat:5.5701,
    lng:-0.2157
  },

  "Kwame Nkrumah Circle":{
    lat:5.5697,
    lng:-0.2166
  },

  "Kaneshie":{
    lat:5.5560,
    lng:-0.2254
  },

  "Kaneshie Market":{
    lat:5.5518,
    lng:-0.2281
  },

  "Achimota Overhead":{
    lat:5.6031,
    lng:-0.2295
  },

  "Achimota Old Station":{
    lat:5.6171,
    lng:-0.2382
  },

  "Achimota Mall":{
    lat:5.6210,
    lng:-0.2388
  },

  "Lapaz":{
    lat:5.6037,
    lng:-0.2504
  },

  "Abeka Lapaz":{
    lat:5.5987,
    lng:-0.2515
  },

  "Tesano":{
    lat:5.5995,
    lng:-0.2252
  },

  "Abelemkpe":{
    lat:5.6084,
    lng:-0.2144
  },

  "Akweteyman":{
    lat:5.6114,
    lng:-0.2331
  },

  // ACCRA WEST / SOUTH

  "Dansoman":{
    lat:5.5603,
    lng:-0.2847
  },

  "Dansoman Roundabout":{
    lat:5.5539,
    lng:-0.2747
  },

  "Mataheko":{
    lat:5.5446,
    lng:-0.2371
  },

  "Korle Bu":{
    lat:5.5384,
    lng:-0.2269
  },

  "Mamprobi":{
    lat:5.5337,
    lng:-0.2441
  },

  "Chorkor":{
    lat:5.5263,
    lng:-0.2551
  },

  "James Town":{
    lat:5.5347,
    lng:-0.2134
  },

  "Makola Market":{
    lat:5.5481,
    lng:-0.2074
  },

  "Accra Central":{
    lat:5.5502,
    lng:-0.2174
  },

  "Tema Station":{
    lat:5.5566,
    lng:-0.1969
  },

  // TEMA / ASHAIMAN / PRAMPRAM

  "Tema Community 1":{
    lat:5.6480,
    lng:0.0105
  },

  "Tema Community 2":{
    lat:5.6508,
    lng:0.0018
  },

  "Tema Community 4":{
    lat:5.6626,
    lng:0.0107
  },

  "Tema Community 7":{
    lat:5.6698,
    lng:0.0141
  },

  "Tema Community 8":{
    lat:5.6752,
    lng:0.0089
  },

  "Tema Community 9":{
    lat:5.6832,
    lng:0.0064
  },

  "Tema Community 11":{
    lat:5.6875,
    lng:0.0151
  },

  "Tema Community 18":{
    lat:5.6351,
    lng:-0.0732
  },

  "Tema Community 22":{
    lat:5.7142,
    lng:-0.0084
  },

  "Tema Community 25":{
    lat:5.7265,
    lng:0.0031
  },

  "Tema Harbour":{
    lat:5.6372,
    lng:0.0129
  },

  "Ashaiman":{
    lat:5.6991,
    lng:-0.0297
  },

  "Ashaiman Main Station":{
    lat:5.6957,
    lng:-0.0336
  },

  "Michel Camp":{
    lat:5.7148,
    lng:-0.0187
  },

  "Dawhenya":{
    lat:5.7372,
    lng:0.0413
  },

  "Prampram":{
    lat:5.7096,
    lng:0.1081
  },

  // KASOA / WEIJA / MALLAM

  "Mallam Junction":{
    lat:5.5710,
    lng:-0.3002
  },

  "Odorkor":{
    lat:5.5794,
    lng:-0.2606
  },

  "Sakaman":{
    lat:5.5605,
    lng:-0.2733
  },

  "Awoshie":{
    lat:5.5984,
    lng:-0.2915
  },

  "Anyaa":{
    lat:5.6074,
    lng:-0.3141
  },

  "Pokuase":{
    lat:5.6908,
    lng:-0.2940
  },

  "Amasaman":{
    lat:5.7016,
    lng:-0.3284
  },

  "Weija":{
    lat:5.5622,
    lng:-0.3349
  },

  "Gbawe":{
    lat:5.5782,
    lng:-0.3107
  },

  "McCarthy Hill":{
    lat:5.5592,
    lng:-0.3079
  },

  "Kasoa New Market":{
    lat:5.5340,
    lng:-0.4168
  },

  "Kasoa Old Market":{
    lat:5.5337,
    lng:-0.4216
  },

  "Buduburam":{
    lat:5.5432,
    lng:-0.4620
  },

  // EASTERN / CENTRAL / OTHER MAJOR TOWNS

  "Aburi":{
    lat:5.8500,
    lng:-0.1833
  },

  "Nsawam":{
    lat:5.8089,
    lng:-0.3500
  },

  "Koforidua":{
    lat:6.0941,
    lng:-0.2591
  },

  "Akosombo":{
    lat:6.2969,
    lng:0.0598
  },

  "Cape Coast":{
    lat:5.1053,
    lng:-1.2466
  },

  "Winneba":{
    lat:5.3511,
    lng:-0.6231
  },

  "Swedru":{
    lat:5.5371,
    lng:-0.6998
  },

  "Takoradi":{
    lat:4.8845,
    lng:-1.7554
  },

  "Kumasi":{
    lat:6.6885,
    lng:-1.6244
  },

  "Ejisu":{
    lat:6.7293,
    lng:-1.4757
  },

  "Obuasi":{
    lat:6.2023,
    lng:-1.6679
  },

  "Sunyani":{
    lat:7.3399,
    lng:-2.3268
  },

  "Techiman":{
    lat:7.5842,
    lng:-1.9382
  },

  "Tamale":{
    lat:9.4075,
    lng:-0.8533
  },

  "Ho":{
    lat:6.6008,
    lng:0.4713
  },

  "Aflao":{
    lat:6.1198,
    lng:1.1901
  },

  "Wa":{
    lat:10.0607,
    lng:-2.5019
  },

  "Bolgatanga":{
    lat:10.7856,
    lng:-0.8514
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

  const [pickupCoords,setPickupCoords] = 
  useState(null);

const [dropoffCoords, setDropoffCoords] =
 useState(null);

  const [savedAccounts,setSavedAccounts] =
  useState([]);

const [showSupportChat,setShowSupportChat] =
  useState(false);

const [supportMessage,setSupportMessage] =
  useState("");

  const supportMessagesEndRef =
  useRef(null);

  const [supportImage,setSupportImage] =
  useState(null);

const [supportImagePreview,setSupportImagePreview] =
  useState("");

  const [supportMessages,setSupportMessages] =
  useState([]);

const [ phoneNumber, setPhoneNumber] = 
useState("");


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
  localStorage.getItem("monnidropCountry") ||
  savedSettings.country ||
  "Ghana"
);

setLanguage(
  localStorage.getItem("monnidropLanguage") ||
  savedSettings.language ||
  "English"
);

      setCurrency(
  localStorage.getItem("monnidropCurrency") ||
  savedSettings.currency ||
  "GHS"
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
  localStorage.getItem("monnidropCurrency") ||
  savedSettings.currency ||
  "GHS"
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

  socket.on("supportMessageReplied",(updatedMessage)=>{

    setSupportMessages((oldMessages)=>
      oldMessages.map((msg)=>
        msg._id === updatedMessage._id
        ? updatedMessage
        : msg
      )
    );
  });

  return ()=>{
    socket.off("supportMessageReplied");
  };

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

      const ratedIds =
        Array.isArray(ratedOrderIds)
        ? ratedOrderIds.map((id)=>
            id.toString()
          )
        : [];

      const postponedIds =
        Array.isArray(postponedRatingOrderIds)
        ? postponedRatingOrderIds.map((id)=>
            id.toString()
          )
        : [];

      const alreadyRatedFromBackend =
        order.riderRated === true ||
        order.hasRatedRider === true ||
        order.riderRatingSubmitted === true ||
        order.ratingSubmitted === true;

      return (
        orderId &&
        order.status === "delivered" &&
        order.rider &&
        !ratedIds.includes(orderId) &&
        !postponedIds.includes(orderId) &&
        !alreadyRatedFromBackend
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

    localStorage.setItem(
      "user",
      JSON.stringify(
        res.data.user
      )
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
      res.data.user.dob
        ? res.data.user.dob.slice(0,10)
        : ""
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

    setProfileEditing(
      false
    );

  }catch(err){

    console.log(err);

    alert(
      err.response?.data?.message ||
      "Failed to save profile"
    );
  }
}


async function saveCompleteProfile(){

  try{

    if(!profileAddress){

      return alert(
        "Please enter your address"
      );
    }

    if(!profileEmergency){

      return alert(
        "Please enter your emergency contact"
      );
    }

    setSavingCompleteProfile(
      true
    );

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
          emergencyContact:profileEmergency,
          profileCompleted:true
        }
      );

    const updatedUser =
  {
    ...res.data.user,
    profileCompleted:true
  };

setUser(
  updatedUser
);

localStorage.setItem(
  "user",
  JSON.stringify(
    updatedUser
  )
);

    setShowCompleteProfile(
      false
    );

    alert(
      "Profile completed successfully"
    );

  }catch(err){

    console.log(err);

    alert(
      err.response?.data?.message ||
      "Failed to complete profile"
    );

  }finally{

    setSavingCompleteProfile(
      false
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
      loggedUser.dob
        ? loggedUser.dob.slice(0,10)
        : ""
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

    if(
      loggedUser.profileCompleted !== true
    ){

      setShowCompleteProfile(
        true
      );
    }

    console.log(
      "LOADED CUSTOMER IMAGE:",
      loggedUser.profileImage
    );

  }catch(err){

    console.log(err);
  }
}

function addCustomerNotification(title,message,type="info"){

  const newNotification = {
    id:Date.now(),
    title,
    message,
    type,
    read:false,
    createdAt:new Date().toISOString()
  };

  setNotifications((oldNotifications)=>{

    const updatedNotifications = [
      newNotification,
      ...oldNotifications
    ].slice(0,50);

    localStorage.setItem(
      "monnidropCustomerNotifications",
      JSON.stringify(updatedNotifications)
    );

    return updatedNotifications;
  });
}

function clearAllNotifications(){

  setNotifications([]);

  localStorage.setItem(
    "monnidropCustomerNotifications",
    JSON.stringify([])
  );
}

function markAllNotificationsRead(){

  const updatedNotifications =
    notifications.map((note)=>({
      ...note,
      read:true
    }));

  setNotifications(
    updatedNotifications
  );

  localStorage.setItem(
    "monnidropCustomerNotifications",
    JSON.stringify(updatedNotifications)
  );
}

useEffect(()=>{

  function openSupportChatFromSettings(){

    setSelectedSetting("");
    setActiveSection("Settings");
    setShowSupportChat(true);

    setTimeout(()=>{

      const supportBox =
        document.getElementById("customer-support-chat-box");

      if(supportBox){
        supportBox.scrollIntoView({
          behavior:"smooth",
          block:"start"
        });
      }

    },300);
  }

  window.addEventListener(
    "openCustomerSupportChat",
    openSupportChatFromSettings
  );

  return ()=>{
    window.removeEventListener(
      "openCustomerSupportChat",
      openSupportChatFromSettings
    );
  };

},[]);

async function sendSupportMessage(){

  const typedMessage =
    supportMessage.trim() ||
    document.getElementById("supportMessageInput")?.value?.trim() ||
    "";

  if(!typedMessage && !supportImage){
    alert("Please type a message or attach an image first");
    return;
  }

  try{

    const formData =
      new FormData();

    formData.append(
      "message",
      typedMessage
    );

    if(supportImage){
      formData.append(
        "image",
        supportImage
      );
    }

    await API.post(
      "/support",
      formData
    );

    addCustomerNotification(
      "Support Message Sent",
      "Your message has been sent to MonniDrop support.",
      "success"
    );

    setSupportMessage("");
    setSupportImage(null);
    setSupportImagePreview("");

    const input =
      document.getElementById("supportMessageInput");

    if(input){
      input.value = "";
    }

    fetchSupportMessages();

  }catch(error){

    console.log(
      "SUPPORT MESSAGE ERROR:",
      error.response?.status,
      error.response?.data,
      error.message
    );

    alert(
      error.response?.data?.message ||
      "Failed to send support message"
    );
  }
}

 async function fetchOrders(){

  try{

    const res =
      await API.get("/orders");

    const newOrders = res.data;

    console.log(
  "CUSTOMER ORDERS:",
  newOrders
);

    setPreviousOrders((oldOrders)=>{


      newOrders.forEach((newOrder)=>{

        const oldOrder =
          oldOrders.find(
            (old)=>old._id === newOrder._id
          );

        if(oldOrder && oldOrder.status !== newOrder.status){

  if(newOrder.status === "accepted"){
    addCustomerNotification(
      "Order Accepted",
      "A rider has accepted your delivery request.",
      "success"
    );
  }

  if(newOrder.status === "picked"){
    addCustomerNotification(
      "Package Picked Up",
      "Your package has been picked up by the rider.",
      "info"
    );
  }

  if(newOrder.status === "delivered"){
    addCustomerNotification(
      "Delivery Completed",
      "Your order has been delivered successfully.",
      "success"
    );
  }

  if(newOrder.status === "cancelled"){
    addCustomerNotification(
      "Order Cancelled",
      "Your delivery order was cancelled.",
      "danger"
    );
  }
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

async function fetchSupportMessages(){

  try{

    const res =
      await API.get("/support");

    setSupportMessages((oldMessages)=>{

      const oldReplies =
        oldMessages
          .filter((msg)=>msg.reply)
          .map((msg)=>msg._id);

      const newReply =
        res.data.find((msg)=>
          msg.reply &&
          !oldReplies.includes(msg._id)
        );

      if(newReply){

        addCustomerNotification(
          "Support Reply Received",
          "MonniDrop support has replied to your message.",
          "info"
        );
      }

      return res.data;
    });

  }catch(error){

    console.log(
      "FETCH CUSTOMER SUPPORT ERROR:",
      error.response?.data ||
      error.message
    );
  }
}

async function fetchSupportMessages(){

  try{

    const res =
      await API.get("/support");

    setSupportMessages(res.data);

  }catch(error){

    console.log(
      "FETCH CUSTOMER SUPPORT ERROR:",
      error.response?.data ||
      error.message
    );
  }
}

useEffect(()=>{

  supportMessagesEndRef.current?.
    scrollIntoView({
      behavior:"smooth"
    });

},[supportMessages]);

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

  const cleanOrderId =
    orderId.toString();

  setRatedOrderIds((prev)=>{

    const oldList =
      Array.isArray(prev)
      ? prev.map((id)=>id.toString())
      : [];

    const updated =
      Array.from(
        new Set([
          ...oldList,
          cleanOrderId
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

   const ratedOrderId =
  ratingModalOrder._id?.toString();

saveRatedOrderId(
  ratedOrderId
);

setOrders((prevOrders)=>
  prevOrders.map((order)=>{

    if(order._id?.toString() === ratedOrderId){

      return {
        ...order,
        riderRated:true,
        hasRatedRider:true,
        riderRatingSubmitted:true
      };
    }

    return order;
  })
);

alert(
  "Thank you for rating your rider."
);

setRatingModalOrder(null);

setRiderRating(5);

setRiderRatingComment("");

setPostponedRatingOrderIds((prev)=>{

  const oldList =
    Array.isArray(prev)
    ? prev.map((id)=>id.toString())
    : [];

  return oldList.filter((id)=>
    id !== ratedOrderId
  );
});

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

  const ratedOrderId =
    ratingModalOrder?._id?.toString();

  saveRatedOrderId(
    ratedOrderId
  );

  setOrders((prevOrders)=>
    prevOrders.map((order)=>{

      if(order._id?.toString() === ratedOrderId){

        return {
          ...order,
          riderRated:true,
          hasRatedRider:true,
          riderRatingSubmitted:true
        };
      }

      return order;
    })
  );

  setRatingModalOrder(null);

  setRiderRating(5);

  setRiderRatingComment("");

  return;
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

  const searchText =
    text
      .toLowerCase()
      .trim();

  if(
    !searchText ||
    searchText.length < 1
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
    accraLocations
      .filter((location)=>

        location
          .toLowerCase()
          .includes(searchText)
      )
      .sort((a,b)=>
        a.localeCompare(b)
      )
      .slice(0,8);

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
        "Pickup location not found. Please choose from the suggestions."
      );

      return;
    }

    if(!dropoff){

      alert(
        "Dropoff location not found. Please choose from the suggestions."
      );

      return;
    }

    setPickupCoords(
      pickup
    );

    setDropoffCoords(
      dropoff
    );

    const straightDistance =
      getDistanceKm(
        pickup.lat,
        pickup.lng,
        dropoff.lat,
        dropoff.lng
      );

    const roadDistance =
      straightDistance * 1.3;

    const km =
      Number(
        roadDistance.toFixed(1)
      );

    setDistance(
      km.toFixed(1)
    );

    let deliveryEstimate =
      "20 - 35 mins";

    if(km <= 5){

      deliveryEstimate =
        "15 - 25 mins";
    }

    else if(km <= 10){

      deliveryEstimate =
        "25 - 40 mins";
    }

    else if(km <= 20){

      deliveryEstimate =
        "40 - 60 mins";
    }

    else if(km <= 40){

      deliveryEstimate =
        "1 hr - 1 hr 40 mins";
    }

    else{

      deliveryEstimate =
        "2 hrs+";
    }

    setDeliveryTime(
      deliveryEstimate
    );

    const baseFare =
      7;

    let perKmRate =
      2.6;

    if(km > 10){

      perKmRate =
        3.8;
    }

    if(km > 20){

      perKmRate =
        4.5;
    }

    if(km > 40){

      perKmRate =
        5.5;
    }

    const serviceFee =
      1;

    let longDistanceFee =
      0;

    if(km > 20){

      longDistanceFee =
        10;
    }

    if(km > 40){

      longDistanceFee =
        25;
    }

    const deliveryFee =
      baseFare +
      (km * perKmRate) +
      serviceFee +
      longDistanceFee;

    const finalFee =
      Math.ceil(
        deliveryFee
      );

    setAmount(
      finalFee.toFixed(2)
    );

  }catch(err){

    console.log(
      "DELIVERY FEE ERROR:",
      err
    );

    alert(
      "Error calculating delivery fee"
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

  <>

    {showCompleteProfile && (

      <RatingOverlay>

        <RatingCard>

          <RatingTitle>
            Complete Your Profile
          </RatingTitle>

          <RatingText>
            Add your address and emergency contact so we can serve you better.
          </RatingText>

          <BeautifulInput
            type="text"
            placeholder="Residential Address"
            value={profileAddress}
            onChange={(e)=>
              setProfileAddress(
                e.target.value
              )
            }
          />

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

          <RatingActionRow>

            <RatingSubmitButton
              type="button"
              onClick={saveCompleteProfile}
              disabled={savingCompleteProfile}
            >
              {
                savingCompleteProfile
                ? "Saving..."
                : "Save Profile"
              }
            </RatingSubmitButton>

          </RatingActionRow>

        </RatingCard>

      </RatingOverlay>
    )}

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
  justifyContent:"center",
  alignItems:"center",
  padding:"8px 14px",
  borderRadius:"12px",
  background:"#ffffff",
  color:"#0f172a",
  fontWeight:"800",
  cursor:"pointer",
  transition:"0.25s ease",
  marginTop:"0",
  fontSize:"12px",
  border:"1px solid #e5e7eb"
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
  active={activeSection === "notifications"}
  onClick={()=>{
    setActiveSection("notifications");
    setSidebarOpen(false);
  }}
>
  <FiBell />

  <span>
    Notifications
  </span>

 {notifications.some((note)=>note.read === false) && (
    <span
      style={{
        marginLeft:"auto",
        minWidth:"22px",
        height:"22px",
        padding:"0 7px",
        borderRadius:"999px",
        background:"#dc2626",
        color:"#ffffff",
        fontSize:"12px",
        fontWeight:"900",
        display:"inline-flex",
        alignItems:"center",
        justifyContent:"center"
      }}
    >
      {
  notifications.filter(
    (note)=>note.read === false
  ).length
}
    </span>
  )}
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
  <CustomerDashboard
    user={user}
    currentTime={currentTime}
    activeOrders={activeOrders}
    completedOrders={completedOrders}
    orders={orders}
    notifications={notifications}
    setActiveSection={setActiveSection}
  />
)}

{activeSection === "orders" && (
  <CustomerOrders
    orders={orders}
    sidebarOpen={sidebarOpen}
    locationCoords={locationCoords}
    customerIcon={customerIcon}
    riderIcon={riderIcon}
    riderLocation={riderLocation}
    ratedOrderIds={ratedOrderIds}
    setRatingModalOrder={setRatingModalOrder}
    setRiderRating={setRiderRating}
    setRiderRatingComment={setRiderRatingComment}
    openChats={openChats}
    setOpenChats={setOpenChats}
    chatText={chatText}
    setChatText={setChatText}
    sendMessage={sendMessage}
    cancelOrder={cancelOrder}
  />
)}

{activeSection === "createOrder" && (
  <CustomerCreateOrder
    pickupLocation={pickupLocation}
    setPickupLocation={setPickupLocation}

    dropoffLocation={dropoffLocation}
    setDropoffLocation={setDropoffLocation}

    itemNotes={itemNotes}
    setItemNotes={setItemNotes}

    pickupSuggestions={pickupSuggestions}
    setPickupSuggestions={setPickupSuggestions}

    dropoffSuggestions={dropoffSuggestions}
    setDropoffSuggestions={setDropoffSuggestions}

    searchLocations={searchLocations}
    calculateDistance={calculateDistance}

    distance={distance}
    amount={amount}
    deliveryTime={deliveryTime}

    paymentMethod={paymentMethod}
    setPaymentMethod={setPaymentMethod}

    momoNumber={momoNumber}
    setMomoNumber={setMomoNumber}

    showConfirm={showConfirm}
    setShowConfirm={setShowConfirm}

    createOrder={createOrder}
  />
)}       

{activeSection === "messages" && (
  <CustomerMessages
    messageInbox={messageInbox}
  />
)}

  {activeSection === "notifications" && (
  <CustomerNotifications
  allNotifications={notifications}
  setActiveSection={setActiveSection}
  setOpenChats={setOpenChats}
  clearAllNotifications={clearAllNotifications}
  markAllNotificationsRead={markAllNotificationsRead}
/>
)}     

        {activeSection === "My Profile" && (
  <CustomerProfile
    user={user}
    setUser={setUser}
    profileEditing={profileEditing}
    setProfileEditing={setProfileEditing}
    profileImage={profileImage}
    setProfileImage={setProfileImage}
    profileName={profileName}
    setProfileName={setProfileName}
    profileEmail={profileEmail}
    setProfileEmail={setProfileEmail}
    profilePhone={profilePhone}
    setProfilePhone={setProfilePhone}
    profileAddress={profileAddress}
    setProfileAddress={setProfileAddress}
    profileDOB={profileDOB}
    setProfileDOB={setProfileDOB}
    profileGender={profileGender}
    setProfileGender={setProfileGender}
    profileEmergency={profileEmergency}
    setProfileEmergency={setProfileEmergency}
    saveProfile={saveProfile}
  />
)}

        {false && activeSection === "My Profile" && (

  <CustomerProfilePage>

    <CustomerProfileLeftCard>

      <CustomerVerifiedBadge>
        <span></span>
        VERIFIED CUSTOMER PROFILE
      </CustomerVerifiedBadge>

      <CustomerProfileMainImage
        src={
          profileImage ||
          user?.profileImage ||
          customerImage
        }
        alt="Customer"
      />

      <CustomerProfileName>
        {profileName || user?.name || "Customer"}
      </CustomerProfileName>

      <CustomerProfileEmail>
        {profileEmail || user?.email || "No email"}
      </CustomerProfileEmail>

      <CustomerStatusPill>
     <CustomerOnlineDot />
        ACTIVE
     </CustomerStatusPill>

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
          transition:"0.25s ease",
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

    </CustomerProfileLeftCard>

    <CustomerProfileRightCard>

      <CustomerProfileHeader>
        <div>
          <CustomerProfileTitle>
            Personal Information
          </CustomerProfileTitle>

          <CustomerProfileSubTitle>
  Manage your personal information and delivery preferences.
</CustomerProfileSubTitle>
        </div>

        <CustomerEditButton
          onClick={()=>
            setProfileEditing(!profileEditing)
          }
        >
          {profileEditing ? "Cancel" : "Edit"}
        </CustomerEditButton>
      </CustomerProfileHeader>

      {
        profileEditing ? (

          <CustomerEditGrid>

            <BeautifulInput
              placeholder="Full Name"
              value={profileName}
              onChange={(e)=>
                setProfileName(e.target.value)
              }
            />

            <BeautifulInput
              placeholder="Email"
              value={profileEmail}
              onChange={(e)=>
                setProfileEmail(e.target.value)
              }
            />

            <BeautifulInput
              placeholder="Phone"
              value={profilePhone}
              onChange={(e)=>
                setProfilePhone(e.target.value)
              }
            />

            <BeautifulInput
              placeholder="Address"
              value={profileAddress}
              onChange={(e)=>
                setProfileAddress(e.target.value)
              }
            />

            <BeautifulInput
              type="date"
              value={profileDOB}
              onChange={(e)=>
                setProfileDOB(e.target.value)
              }
            />

            <BeautifulInput
              placeholder="Gender"
              value={profileGender}
              onChange={(e)=>
                setProfileGender(e.target.value)
              }
            />

            <BeautifulInput
              placeholder="Emergency Contact"
              value={profileEmergency}
              onChange={(e)=>
                setProfileEmergency(e.target.value)
              }
            />

            <CustomerSaveButton
              onClick={saveProfile}
            >
              Save Profile
            </CustomerSaveButton>

          </CustomerEditGrid>

        ) : (

          <>

            <CustomerInfoGrid>

              <CustomerInfoBox>
                <label>NAME</label>
                <strong>{profileName || "Not added"}</strong>
              </CustomerInfoBox>

              <CustomerInfoBox>
                <label>EMAIL</label>
                <strong>{profileEmail || "Not added"}</strong>
              </CustomerInfoBox>

              <CustomerInfoBox>
                <label>PHONE</label>
                <strong>{profilePhone || "Not added"}</strong>
              </CustomerInfoBox>

              <CustomerOnlineStatus>
               <CustomerOnlineDot />
                 Online
               </CustomerOnlineStatus>

            </CustomerInfoGrid>

            <CustomerDivider />

            <CustomerSectionHeader>
             <span>📋</span>
               Customer Details
             </CustomerSectionHeader>

            <CustomerInfoGrid>

              <CustomerInfoBox>
                <label>DATE OF BIRTH</label>
                <strong>{profileDOB || "Not added"}</strong>
              </CustomerInfoBox>

              <CustomerInfoBox>
                <label>GENDER</label>
                <strong>{profileGender || "Not added"}</strong>
              </CustomerInfoBox>

              <CustomerInfoBox>
                <label>EMERGENCY CONTACT</label>
                <strong>{profileEmergency || "Not added"}</strong>
              </CustomerInfoBox>

              <CustomerInfoBox>
                <label>ADDRESS</label>
                <strong>{profileAddress || "No address added"}</strong>
              </CustomerInfoBox>

            </CustomerInfoGrid>

          </>

        )
      }

    </CustomerProfileRightCard>

  </CustomerProfilePage>

)}

{activeSection === "Settings" && (
  <>

    <CustomerSettings
  selectedSetting={selectedSetting}
  setSelectedSetting={setSelectedSetting}
  country={country}
  setCountry={setCountry}
  language={language}
  setLanguage={setLanguage}
  currency={currency}
  setCurrency={setCurrency}
  showSupportChat={showSupportChat}
  setShowSupportChat={setShowSupportChat}
  supportMessages={supportMessages}
  supportMessage={supportMessage}
  setSupportMessage={setSupportMessage}
  sendSupportMessage={sendSupportMessage}
  supportImage={supportImage}
  setSupportImage={setSupportImage}
  supportImagePreview={supportImagePreview}
  setSupportImagePreview={setSupportImagePreview}
/>

    {showSupportChat && (

      <div
  id="customer-support-chat-box"
  style={{
    marginTop:"18px",
    padding:"16px",
    borderRadius:"18px",
    background:"#ffffff",
    border:"1px solid #dbeafe"
  }}
>
       <div
  style={{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:"12px"
  }}
>

  <div
    style={{
      fontSize:"18px",
      fontWeight:"900",
      color:"#0f172a"
    }}
  >
    Customer Support Chat
  </div>

  <div
    style={{
      display:"flex",
      alignItems:"center",
      gap:"6px",
      background:"#dcfce7",
      color:"#166534",
      padding:"6px 10px",
      borderRadius:"999px",
      fontSize:"12px",
      fontWeight:"900"
    }}
  >
    <span>🟢</span>
    Support Online
  </div>

</div>

<div
  style={{
    fontSize:"12px",
    color:"#64748b",
    fontWeight:"700",
    marginBottom:"12px"
  }}
>
  Average response time: Under 5 minutes
</div>

        <div
          style={{
            minHeight:"120px",
            maxHeight:"180px",
            overflowY:"auto",
            background:"#f8fafc",
            border:"1px solid #e5e7eb",
            borderRadius:"16px",
            padding:"12px",
            marginBottom:"12px"
          }}
        >
          <div
            style={{
              background:"#dcfce7",
              color:"#0f172a",
              padding:"10px 11px",
              borderRadius:"12px",
              marginBottom:"8px",
              fontSize:"12px",
              fontWeight:"700"
            }}
          >
            Hello 👋 Welcome to MonniDrop Customer support. How can we help you?
          </div>

          {
            supportMessages.map((msg)=>(

              <div key={msg._id}>

                <div
                  style={{
                    background:"#dbeafe",
                    color:"#0f172a",
                    padding:"10px 12px",
                    borderRadius:"14px",
                    marginBottom:"8px",
                    fontSize:"14px",
                    fontWeight:"700"
                  }}
                >
                  You: {msg.message}
                </div>

              {
  msg.reply && (

    <div
      style={{
        background:"#dcfce7",
        color:"#0f172a",
        padding:"10px 12px",
        borderRadius:"14px",
        marginBottom:"8px",
        fontSize:"14px",
        fontWeight:"700",
        border:"1px solid #86efac"
      }}
    >

      <div
        style={{
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center",
          marginBottom:"6px"
        }}
      >
        <span>
          Support
        </span>

       {msg.reply && (
  new Date(msg.repliedAt || msg.updatedAt || msg.createdAt) >
  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
) && (
  <span
    style={{
      background:"#16a34a",
      color:"#ffffff",
      padding:"3px 8px",
      borderRadius:"999px",
      fontSize:"11px",
      fontWeight:"900"
    }}
  >
    New Reply
  </span>
)}
      </div>

      {msg.reply}

    </div>
  )
}

              </div>
            ))
          }

                    <div
            ref={supportMessagesEndRef}
          />

        </div>

      </div>

    )}

  </>
)}



{false && activeSection === "Settings" && (

  <>

    <div
      style={{
        background:"#ffffff",
        borderRadius:"28px",
        padding:"26px",
        marginBottom:"18px",
        border:"1px solid #e5e7eb",
        boxShadow:
          "0 14px 34px rgba(15,23,42,0.06)"
      }}
    >

      <h1
        style={{
          margin:"0 0 18px",
          fontSize:"34px",
          fontWeight:"900",
          color:"#0f172a"
        }}
      >
        Settings
      </h1>

      <h2
        style={{
          margin:"0 0 8px",
          fontSize:"30px",
          fontWeight:"900",
          color:"#15803d"
        }}
      >
        Your account is protected
      </h2>

      <p
        style={{
          margin:"0",
          fontSize:"18px",
          fontWeight:"700",
          color:"#64748b",
          lineHeight:"1.5"
        }}
      >
        MonniDrop protects your personal information and keeps it private,
        safe and secure.
      </p>

    </div>

    <div
  style={{
    display:"grid",
    gridTemplateColumns:"1fr 1fr",
    gap:"16px",
    marginBottom:"24px"
  }}
>
  {
    [
      "Account Security",
      "Privacy",
      "Permissions",
      "Safety Center"
    ].map((item)=>(

      <div
        key={item}
        onClick={()=>
          setSelectedSetting(item)
        }
        style={{
          background:"#ffffff",
          border:"1px solid rgba(29,78,216,0.12)",
          borderRadius:"22px",
          padding:"22px",
          cursor:"pointer",
          display:"flex",
          alignItems:"center",
          justifyContent:"space-between",
          boxShadow:
            "0 8px 20px rgba(15,23,42,0.05)"
        }}
      >

        <div
          style={{
            display:"flex",
            alignItems:"center",
            gap:"14px"
          }}
        >

          <div
            style={{
              width:"48px",
              height:"48px",
              borderRadius:"16px",
              background:
                "linear-gradient(135deg,#0f172a,#1d4ed8)",
              color:"#facc15",
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              fontSize:"22px"
            }}
          >
            🛡️
          </div>

          <div
            style={{
              fontWeight:"900",
              fontSize:"20px",
              color:"#0f172a"
            }}
          >
            {item}
          </div>

        </div>

        <div
          style={{
            fontSize:"30px",
            color:"#1d4ed8",
            fontWeight:"900"
          }}
        >
          ›
        </div>

      </div>
    ))
  }
</div>

<div
style={{

background:"#ffffff",

borderRadius:"24px",

padding:"22px",

border:
"1px solid rgba(29,78,216,0.12)",

boxShadow:
"0 10px 26px rgba(15,23,42,0.05)",

marginBottom:"24px"

}}
>

<div
style={{

fontSize:"26px",

fontWeight:"900",

color:"#0f172a",

marginBottom:"18px"

}}
>

Preferences

</div>

{[
  "Country & region",
  "Language",
  "Currency",
  "Notifications",
  "About this app",
  "Legal terms & policies",
  "Share this app",
  "Switch account",
  "Sign out"
].map((item)=>(

<div

key={item}

onClick={()=>
setSelectedSetting(
item
)
}

style={{

display:"flex",

justifyContent:
"space-between",

alignItems:"center",

padding:"18px 0",

borderBottom:
"1px solid #eef2f7",

cursor:"pointer"

}}

>

<div
style={{

fontSize:"18px",

fontWeight:"800",

color:"#0f172a"

}}
>

{item}

</div>

<div
style={{

color:"#1d4ed8",

fontSize:"26px"

}}
>

›

</div>

</div>

))}

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
        background:"rgba(15,23,42,0.72)",
        backdropFilter:"blur(8px)",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        zIndex:2000
      }}
    >

      <div
       style={{
width:"92%",
maxWidth:
  selectedSetting === "Share This App" ||
  selectedSetting === "Share this app"
  ? "780px"
  : "520px",
background:
"linear-gradient(180deg,#ffffff,#f8fafc)",
border:
"1px solid rgba(29,78,216,0.12)",
borderRadius:"30px",
padding:"32px",
boxShadow:
"0 30px 80px rgba(15,23,42,0.18)",
backdropFilter:
"blur(20px)",
maxHeight:"85vh",
overflowY:"auto"
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
  onClick={() => {
  if(
    selectedSetting === "Privacy policy" ||
    selectedSetting === "Terms of use" ||
    selectedSetting === "Community guidelines" ||
    selectedSetting === "Intellectual property policy"
  ){
    setSelectedSetting("Legal terms & policies");
  }else{
    setSelectedSetting("");
  }
}}
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
    fontWeight:"900",
    cursor:"pointer",
    fontSize:"20px"
  }}
>
  <FiArrowLeft />
</span>

          <div
  style={{
    fontSize:"28px",
    fontWeight:"900",
    background:
      "linear-gradient(135deg,#0f172a,#1d4ed8)",
    WebkitBackgroundClip:"text",
    WebkitTextFillColor:"transparent"
  }}
>
  {selectedSetting}
</div>

{
  (selectedSetting === "Switch Account" ||
   selectedSetting === "Switch account") && (

    <div style={{ marginTop:"10px" }}>

      <div
        style={{
          border:"1px solid #e5e7eb",
          borderRadius:"18px",
          padding:"16px",
          display:"flex",
          alignItems:"center",
          gap:"14px",
          marginBottom:"14px",
          background:"#ffffff"
        }}
      >
        <img
          src={user?.profileImage || "/logo.png"}
          alt="Current account"
          style={{
            width:"58px",
            height:"58px",
            borderRadius:"50%",
            objectFit:"cover"
          }}
        />

        <div style={{ flex:1 }}>
          <div
            style={{
              fontSize:"20px",
              fontWeight:"900",
              color:"#000"
            }}
          >
            {user?.name || "Current User"}
          </div>

          <div
            style={{
              fontSize:"15px",
              color:"#777",
              fontWeight:"700"
            }}
          >
            {user?.email || "No email"}
          </div>
        </div>

        <div
          style={{
            color:"#f97316",
            fontSize:"34px",
            fontWeight:"900"
          }}
        >
          ✓
        </div>
      </div>

      <div
        onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");

        window.location.href = "/";
        }}
        style={{
          border:"1px solid #e5e7eb",
          borderRadius:"18px",
          padding:"16px",
          display:"flex",
          alignItems:"center",
          gap:"14px",
          background:"#ffffff",
          cursor:"pointer"
        }}
      >
        <div
          style={{
            width:"58px",
            height:"58px",
            borderRadius:"50%",
            background:"#f3f4f6",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            fontSize:"34px",
            color:"#555"
          }}
        >
          +
        </div>

        <div
          style={{
            fontSize:"20px",
            fontWeight:"900",
            color:"#000"
          }}
        >
          Add account
        </div>
      </div>

    </div>
  )
}
        </div>

        {
          selectedSetting === "Sign out" && (

           <div>
  <div
    style={{
      display:"flex",
      alignItems:"center",
      justifyContent:"space-between",
      marginBottom:"24px"
    }}
  >
    <div
      style={{
        flex:1,
        textAlign:"center",
        fontSize:"28px",
        fontWeight:"900",
        color:"#000"
      }}
    >
      Sign Out or Switch Account?
    </div>

    <button
      onClick={() => setSelectedSetting(null)}
      style={{
        border:"none",
        background:"transparent",
        fontSize:"42px",
        cursor:"pointer",
        color:"#000",
        lineHeight:"1"
      }}
    >
      ×
    </button>
  </div>

  <div
    style={{
      fontSize:"22px",
      lineHeight:"1.45",
      color:"#000",
      marginBottom:"32px"
    }}
  >
    Do you want to sign out of the account{" "}
    <span style={{ color:"#f97316", fontWeight:"800" }}>
      {user?.name || "MonniDrop User"}
    </span>{" "}
    or switch to a different one?
  </div>

  <button
   type="button"
onClick={() => {
  setSelectedSetting("Switch account");
}}
    style={{
      width:"100%",
      border:"2px solid #000",
      borderRadius:"999px",
      padding:"18px",
      background:"#ffffff",
      color:"#000",
      fontSize:"24px",
      fontWeight:"800",
      cursor:"pointer",
      marginBottom:"18px"
    }}
  >
    Switch accounts
  </button>

  <button
    type="button"
    onClick={logout}
    style={{
      width:"100%",
      border:"2px solid #000",
      borderRadius:"999px",
      padding:"14px",
      background:"#ffffff",
      color:"#000",
      fontSize:"20px",
      fontWeight:"600",
      cursor:"pointer"
    }}
  >
    Sign out
  </button>
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
    "About this app",
    "About MonniDrop",
    "Contact us",
    "Switch Account",
    "Switch account",
    "Sign Out",
    "Sign out"
  ].includes(selectedSetting) && (


           <div
  style={{
    width:"100%",
    minHeight:"170px",
    padding:"18px",
    borderRadius:"20px",
    border:"1px solid rgba(29,78,216,0.15)",
    background:"#f8fafc",
    color:"#0f172a",
    fontWeight:"700",
    lineHeight:"1.6",
    boxSizing:"border-box"
  }}
>
  {
    selectedSetting === "Privacy policy"
? (
  <div
    style={{
      background:"#ffffff",
      borderRadius:"22px",
      padding:"22px",
      marginTop:"18px",
      border:"1px solid #e5e7eb"
    }}
  >
    <h2
      style={{
        margin:"0 0 12px",
        fontSize:"22px",
        fontWeight:"900",
        color:"#0f172a"
      }}
    >
      Privacy policy
    </h2>

    <p style={{fontSize:"15px",fontWeight:"700",lineHeight:"1.7",color:"#475569"}}>
      MonniDrop collects basic account information such as your name, phone number,
      email address, delivery locations, payment method, and profile details to help
      process deliveries, secure your account, and improve customer support.
    </p>

    <p style={{fontSize:"15px",fontWeight:"700",lineHeight:"1.7",color:"#475569"}}>
      Your information is used only for delivery operations, account access,
      payment confirmation, rider assignment, support communication, safety checks,
      and service improvement.
    </p>

    <p style={{fontSize:"15px",fontWeight:"700",lineHeight:"1.7",color:"#475569"}}>
      MonniDrop does not sell your personal information. Access to your data is
      controlled and used only by authorized platform users such as admins, support
      staff, and assigned riders where necessary.
    </p>
  </div>
)

: selectedSetting === "Terms of use"
? (
  <div
    style={{
      background:"#ffffff",
      borderRadius:"22px",
      padding:"22px",
      marginTop:"18px",
      border:"1px solid #e5e7eb"
    }}
  >
    <h2 style={{margin:"0 0 12px",fontSize:"22px",fontWeight:"900",color:"#0f172a"}}>
      Terms of use
    </h2>

    <p style={{fontSize:"15px",fontWeight:"700",lineHeight:"1.7",color:"#475569"}}>
      By using MonniDrop, customers agree to provide accurate delivery details,
      correct contact information, and lawful delivery requests.
    </p>

    <p style={{fontSize:"15px",fontWeight:"700",lineHeight:"1.7",color:"#475569"}}>
      Users must not misuse the platform, create false orders, harass riders,
      attempt payment fraud, or use MonniDrop for restricted or illegal items.
    </p>

    <p style={{fontSize:"15px",fontWeight:"700",lineHeight:"1.7",color:"#475569"}}>
      MonniDrop may suspend or restrict accounts that violate platform rules,
      abuse riders, create fake orders, or attempt unsafe delivery activity.
    </p>
  </div>
)

: selectedSetting === "Community guidelines"
? (
  <div
    style={{
      background:"#ffffff",
      borderRadius:"22px",
      padding:"22px",
      marginTop:"18px",
      border:"1px solid #e5e7eb"
    }}
  >
    <h2 style={{margin:"0 0 12px",fontSize:"22px",fontWeight:"900",color:"#0f172a"}}>
      Community guidelines
    </h2>

    <p style={{fontSize:"15px",fontWeight:"700",lineHeight:"1.7",color:"#475569"}}>
      MonniDrop expects customers, riders, and admins to communicate respectfully,
      act honestly, and support safe delivery experiences.
    </p>

    <p style={{fontSize:"15px",fontWeight:"700",lineHeight:"1.7",color:"#475569"}}>
      Harassment, threats, insults, fraud, unsafe behavior, and false reports are
      not allowed on the platform.
    </p>

    <p style={{fontSize:"15px",fontWeight:"700",lineHeight:"1.7",color:"#475569"}}>
      Riders and customers should use ratings, support chat, and order messages
      responsibly to improve service quality.
    </p>
  </div>
)

: selectedSetting === "Intellectual property policy"
? (
  <div
    style={{
      background:"#ffffff",
      borderRadius:"22px",
      padding:"22px",
      marginTop:"18px",
      border:"1px solid #e5e7eb"
    }}
  >
    <h2 style={{margin:"0 0 12px",fontSize:"22px",fontWeight:"900",color:"#0f172a"}}>
      Intellectual property policy
    </h2>

    <p style={{fontSize:"15px",fontWeight:"700",lineHeight:"1.7",color:"#475569"}}>
      MonniDrop name, logo, interface design, platform content, delivery workflow,
      and system features belong to MonniDrop unless otherwise stated.
    </p>

    <p style={{fontSize:"15px",fontWeight:"700",lineHeight:"1.7",color:"#475569"}}>
      Users may not copy, reproduce, misuse, sell, or present MonniDrop branding,
      design, code, or content as their own.
    </p>

    <p style={{fontSize:"15px",fontWeight:"700",lineHeight:"1.7",color:"#475569"}}>
      Any reports of intellectual property misuse can be sent through MonniDrop
      support for review.
    </p>
  </div>
)

:
    selectedSetting === "How Your Data Is Protected"
    ? "MonniDrop protects your data with secure login sessions, encrypted communication, and controlled access. Your personal details are only used to support deliveries, account access, and customer service."

    : selectedSetting === "Account Protection"
    ? "Your account is protected with password-based authentication, phone verification, secure login tokens, and account monitoring to help prevent unauthorized access."

    : selectedSetting === "Payment Protection"
    ? "MonniDrop protects payment activity by tracking payment status, separating cash and mobile money records, and allowing admins to verify settlement before closing payment records."

    : selectedSetting === "Camera"
    ? "Camera permission allows you to upload or update your profile photo. MonniDrop will only use your camera when you choose to take or upload an image."

    : selectedSetting === "Notifications"
    ? "Notification permission allows MonniDrop to send delivery updates, rider messages, payment alerts, and important account notifications."

    : selectedSetting === "Live Activities"
    ? "Live Activities help you follow active deliveries in real time, including rider movement, delivery progress, and important order updates."

    : selectedSetting === "Required Cookies & Technologies"
    ? "Required cookies and technologies help MonniDrop keep you signed in, protect your account, remember important settings, and support secure delivery activity."

    : selectedSetting === "Personalized Advertised Listing"
    ? "Personalized listings help MonniDrop show relevant delivery offers, service updates, and useful app information based on your activity and preferences."

    : selectedSetting === "Additional Privacy Option"
    ? "Additional privacy options allow you to manage how your information is used for account support, delivery improvement, communication, and app personalization."

    : selectedSetting === "About this app"
? (
  <div>
    <div
      style={{
        padding: "28px 20px",
        background: "#ffffff",
        textAlign: "center",
        borderBottom: "8px solid #f1f1f1",
        position: "relative"
      }}
    >
      <div
        onClick={() => {
  if(
    selectedSetting === "Privacy policy" ||
    selectedSetting === "Terms of use" ||
    selectedSetting === "Community guidelines" ||
    selectedSetting === "Intellectual property policy"
  ){
    setSelectedSetting("Legal terms & policies");
  }else{
    setSelectedSetting("");
  }
}}
style={{
position: "absolute",
top: "18px",
left: "18px",
width: "44px",
height: "44px",
borderRadius: "14px",
background: "linear-gradient(135deg,#0f172a,#1d4ed8)",
display: "flex",
alignItems: "center",
justifyContent: "center",
color: "#facc15",
fontSize: "22px",
cursor: "pointer"
 }}
 >
<FiArrowLeft />

</div>

<img
 src="/logo.png"
 alt="MonniDrop"
 style={{
width: "58px",
height: "58px",
objectFit: "contain",
borderRadius: "16px",
marginBottom: "10px"
}}
 />

      <div
        style={{
          fontSize: "22px",
          fontWeight: "900",
          color: "#000",
          marginBottom: "5px"
        }}
      >
        MonniDrop
      </div>

      <div
        style={{
          fontSize: "15px",
          color: "#777"
        }}
      >
        App version 1.0.0
      </div>
    </div>

    {["About MonniDrop", "Contact us"].map((item) => (
      <div
        key={item}
        onClick={() => setSelectedSetting(item)}
        style={{
          background: "#ffffff",
          padding: "26px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e5e5e5",
          fontSize: "26px",
          fontWeight: "700",
          color: "#000",
          cursor: "pointer"
        }}
      >
        <span>{item}</span>

        <span
          style={{
            fontSize: "42px",
            color: "#8a8a8a",
            fontWeight: "300",
            lineHeight: "1"
          }}
        >
          ›
        </span>
      </div>
    ))}
  </div>
)

: selectedSetting === "About MonniDrop"
? (
  <div
    style={{
      background:"#ffffff",
      borderRadius:"24px",
      padding:"22px",
      border:"1px solid #e5e7eb"
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
       onClick={() => {
     setShowSupportChat(false);
     setSelectedSetting("About this app");
     }}
        style={{
          width:"48px",
          height:"48px",
          borderRadius:"16px",
          background:"linear-gradient(135deg,#0f172a,#1d4ed8)",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          color:"#facc15",
          fontSize:"24px",
          cursor:"pointer"
        }}
      >
        <FiArrowLeft />
      </div>

      <div
        style={{
          fontSize:"24px",
          fontWeight:"900",
          color:"#0f172a"
        }}
      >
        About MonniDrop
      </div>
    </div>

    <p
      style={{
        fontSize:"16px",
        lineHeight:"1.7",
        color:"#475569",
        fontWeight:"600"
      }}
    >
      MonniDrop is a delivery platform that connects customers with riders for fast, reliable, and secure deliveries.
    </p>
 </div>
)
    : selectedSetting === "Contact us"
    ? (
      <div
        style={{
          background:"#ffffff",
          borderRadius:"24px",
          padding:"22px",
          border:"1px solid #e5e7eb"
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
            onClick={() => setSelectedSetting("About this app")}
            style={{
              width:"48px",
              height:"48px",
              background:"linear-gradient(135deg,#0f172a,#1d4ed8)",
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              color:"#facc15",
              fontSize:"24px",
              cursor:"pointer"
            }}
          >
            <FiArrowLeft />
          </div>

          <div
            style={{
              fontSize:"24px",
              fontWeight:"900",
              color:"#0f172a"
            }}
          >
            Contact us
          </div>
        </div>

      <div
  style={{
    fontSize:"16px",
    lineHeight:"1.7",
    color:"#475569",
    fontWeight:"600"
  }}
>
  <p style={{ marginTop:0 }}>
    For support, delivery issues, payment questions, or account help, contact the MonniDrop support team.
  </p>

  <div
    style={{
      marginTop:"16px",
      padding:"14px 16px",
      borderRadius:"16px",
      background:"#f8fafc",
      border:"1px solid #e5e7eb"
    }}
  >
    <strong style={{ color:"#0f172a" }}>Address:</strong>
    <br />
    Accra, Ghana
  </div>

   <button
    type="button"
   onClick={() => setShowSupportChat(!showSupportChat)}
    style={{
      marginTop:"18px",
      width:"100%",
      border:"none",
      borderRadius:"16px",
      padding:"14px 16px",
      background:"#22c55e",
      color:"#ffffff",
      fontSize:"16px",
      fontWeight:"900",
      cursor:"pointer"
    }}
  >
    Contact us
  </button>

  {
    showSupportChat && (

      <div
        style={{
          marginTop:"18px",
          padding:"16px",
          borderRadius:"18px",
          background:"#ffffff",
          border:"1px solid #dbeafe"
        }}
      >
        <div
          style={{
            fontSize:"18px",
            fontWeight:"900",
            color:"#0f172a",
            marginBottom:"12px"
          }}
        >
          Customer Support Chat
        </div>

        <div
  style={{
    minHeight:"120px",
    maxHeight:"180px",
    overflowY:"auto",
    background:"#f8fafc",
    border:"1px solid #e5e7eb",
    borderRadius:"16px",
    padding:"12px",
    marginBottom:"12px"
  }}
>
  <div
    style={{
      background:"#dcfce7",
      color:"#0f172a",
      padding:"10px 11px",
      borderRadius:"12px",
      marginBottom:"8px",
      fontSize:"12px",
      fontWeight:"700"
    }}
  >
    Hello 👋 Welcome to MonniDrop Customer support. How can we help you?
  </div>

  {
    supportMessages.map((msg)=>(

      <div key={msg._id}>

        <div
          style={{
            background:"#dbeafe",
            color:"#0f172a",
            padding:"10px 12px",
            borderRadius:"14px",
            marginBottom:"8px",
            fontSize:"14px",
            fontWeight:"700"
          }}
        >
          You: {msg.message}
        </div>

        {
          msg.reply && (

            <div
              style={{
                background:"#dcfce7",
                color:"#0f172a",
                padding:"10px 12px",
                borderRadius:"14px",
                marginBottom:"8px",
                fontSize:"14px",
                fontWeight:"700"
              }}
            >
              Support: {msg.reply}
            </div>
          )
        }

      </div>
    ))
  }
</div>

        <div
          style={{
            display:"flex",
            gap:"8px"
          }}
        >

          <input
  id="supportPhotoUpload"
  type="file"
  accept="image/*"
  style={{ display:"none" }}
  onChange={(e)=>{

    const file =
      e.target.files[0];

    if(file){
      setSupportImage(file);
      setSupportImagePreview(
        URL.createObjectURL(file)
      );
    }
  }}
/>

<input
  id="supportPhotoUpload"
  type="file"
  accept="image/*"
  style={{ display:"none" }}
  onChange={(e)=>{

    const file =
      e.target.files[0];

    if(file){
      setSupportImage(file);

      setSupportImagePreview(
        URL.createObjectURL(file)
      );
    }
  }}
/>

<input
  id="supportCameraUpload"
  type="file"
  accept="image/*"
  capture="environment"
  style={{ display:"none" }}
  onChange={(e)=>{

    const file =
      e.target.files[0];

    if(file){
      setSupportImage(file);

      setSupportImagePreview(
        URL.createObjectURL(file)
      );
    }
  }}
/>

{supportImagePreview && (
  <div
    style={{
      marginBottom:"10px",
      position:"relative",
      width:"120px"
    }}
  >
    <img
      src={supportImagePreview}
      alt="Support preview"
      style={{
        width:"120px",
        height:"90px",
        objectFit:"cover",
        borderRadius:"14px",
        border:"1px solid #dbeafe"
      }}
    />

    <button
      type="button"
      onClick={()=>{
        setSupportImage(null);
        setSupportImagePreview("");
      }}
      style={{
        position:"absolute",
        top:"-8px",
        right:"-8px",
        width:"26px",
        height:"26px",
        borderRadius:"50%",
        border:"none",
        background:"#991b1b",
        color:"#ffffff",
        fontWeight:"900",
        cursor:"pointer"
      }}
    >
      ×
    </button>
  </div>
)}

<div
  style={{
    display:"grid",
    gridTemplateColumns:"38px 38px 1fr 72px",
    alignItems:"center",
    gap:"7px",
    width:"100%"
  }}
>
  <button
    type="button"
    onClick={()=>
      document
        .getElementById("supportPhotoUpload")
        .click()
    }
    style={{
      width:"38px",
      height:"38px",
      border:"none",
      borderRadius:"14px",
      padding:"0",
      background:"#f1f5f9",
      color:"#0f172a",
      fontSize:"16px",
      fontWeight:"900",
      cursor:"pointer",
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      flexShrink:0
    }}
  >
    📎
  </button>

  <button
    type="button"
    onClick={()=>
      document
        .getElementById("supportCameraUpload")
        .click()
    }
    style={{
      width:"42px",
      height:"42px",
      border:"none",
      borderRadius:"14px",
      padding:"0",
      background:"#f1f5f9",
      color:"#0f172a",
      fontSize:"18px",
      fontWeight:"900",
      cursor:"pointer",
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      flexShrink:0
    }}
  >
    📷
  </button>

  <input
    type="text"
    placeholder="Type your message..."
    value={supportMessage}
    onChange={(e)=>setSupportMessage(e.target.value)}
    style={{
      flex:1,
      minWidth:0,
      height:"38px",
      padding:"0 14px",
      borderRadius:"14px",
      border:"1px solid #dbeafe",
      outline:"none",
      fontSize:"14px",
      fontWeight:"700"
    }}
  />

  <button
    type="button"
    onClick={sendSupportMessage}
    style={{
      width:"72px",
      height:"38px",
      border:"none",
      borderRadius:"14px",
      padding:"0",
      background:"linear-gradient(135deg,#0f172a,#1d4ed8)",
      color:"#facc15",
      fontSize:"14px",
      fontWeight:"900",
      cursor:"pointer",
      flexShrink:0
    }}
  >
    Send
  </button>
</div>
        </div>
      </div>
    )
  }
</div>
      </div>
    )

 : selectedSetting === "Legal Terms & Policies" ||
  selectedSetting === "Legal terms & policies"
? (
  <div
    style={{
      width:"100%",
      marginTop:"18px",
      background:"#ffffff",
      borderRadius:"22px",
      border:"1px solid #e5e7eb",
      overflow:"hidden"
    }}
  >
    {[
      "Privacy policy",
      "Terms of use",
      "Community guidelines",
      "Intellectual property policy"
    ].map((item)=>(
      <div
        key={item}
        onClick={() => setSelectedSetting(item)}
        style={{
          padding:"18px 22px",
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center",
          borderBottom:"1px solid #e5e7eb",
          cursor:"pointer"
        }}
      >
        <span
          style={{
            fontSize:"18px",
            fontWeight:"900",
            color:"#0f172a"
          }}
        >
          {item}
        </span>

        <span
          style={{
            fontSize:"30px",
            color:"#94a3b8",
            fontWeight:"300",
            lineHeight:"1"
          }}
        >
          ›
        </span>
      </div>
    ))}
  </div>
)

 : selectedSetting === "Share This App" ||
  selectedSetting === "Share this app"
? (
  <div
    style={{
      background:"#ffffff",
      borderRadius:"34px",
      padding:"32px 24px",
      marginTop:"22px"
    }}
  >
    <div
      style={{
        display:"grid",
        gridTemplateColumns:"repeat(4,minmax(70px,1fr))",
        justifyItems:"center",
        gap:"26px 20px",
        textAlign:"center"
      }}
    >
      {[
        {
          label:"Message",
          color:"#22c55e",
          icon:<FiMessageCircle size={38} />,
          action:() => {
            const shareText =
              "Download MonniDrop and enjoy fast, reliable deliveries across Ghana. " +
              window.location.origin;

            window.location.href =
              `sms:?body=${encodeURIComponent(shareText)}`;
          }
        },
        {
          label:"Facebook",
          color:"#1877f2",
          icon:<FaFacebookF size={38} />,
          action:() => {
            window.open(
              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                window.location.origin
              )}`,
              "_blank"
            );
          }
        },
        {
          label:"WhatsApp",
          color:"#25d366",
          icon:<FaWhatsapp size={38} />,
          action:() => {
            const shareText =
              "Download MonniDrop and enjoy fast, reliable deliveries across Ghana. " +
              window.location.origin;

            window.open(
              `https://wa.me/?text=${encodeURIComponent(shareText)}`,
              "_blank"
            );
          }
        },
        {
          label:"X",
          color:"#000000",
          icon:<FaXTwitter size={36} />,
          action:() => {
            const shareText =
              "Download MonniDrop and enjoy fast, reliable deliveries across Ghana. " +
              window.location.origin;

            window.open(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                shareText
              )}`,
              "_blank"
            );
          }
        },
        {
          label:"Copy Link",
          color:"#f3f4f6",
          dark:true,
          icon:<FiLink size={38} />,
          action:() => {
            navigator.clipboard.writeText(
              window.location.origin
            );

            alert("Link copied");
          }
        },
        {
          label:"More",
          color:"#f3f4f6",
          dark:true,
          icon:<FiMoreHorizontal size={38} />,
          action:() => {
            if(navigator.share){
              navigator.share({
                title:"MonniDrop",
                text:
                  "Download MonniDrop and enjoy fast, reliable deliveries across Ghana.",
                url:window.location.origin
              });
            }
          }
        }
      ].map((item)=>(
        <div
          key={item.label}
          onClick={item.action}
          onMouseEnter={(e)=>{
            e.currentTarget.style.transform =
              "translateY(-4px)";
          }}
          onMouseLeave={(e)=>{
            e.currentTarget.style.transform =
              "translateY(0)";
          }}
          style={{
            cursor:"pointer",
            transition:"0.2s ease"
          }}
        >
          <div
            style={{
              width:"72px",
              height:"72px",
              borderRadius:"50%",
              background:item.color,
              margin:"0 auto 14px",
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              color:item.dark ? "#0f172a" : "#ffffff",
              fontWeight:"900",
              boxShadow:item.dark
                ? "none"
                : "0 10px 24px rgba(15,23,42,0.14)"
            }}
          >
            {item.icon}
          </div>

          <div
            style={{
              fontSize:"14px",
              fontWeight:"900",
              color:"#0f172a"
            }}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  </div>
)
    : selectedSetting === "Switch Account" ||
  selectedSetting === "Switch account"
? (
  <div>
    <div
      style={{
        fontSize:"26px",
        fontWeight:"900",
        color:"#0f172a",
        marginBottom:"22px",
        textAlign:"center"
      }}
    >
      Switch accounts
    </div>

    <div
      style={{
        border:"1px solid #e5e7eb",
        borderRadius:"18px",
        padding:"16px",
        display:"flex",
        alignItems:"center",
        gap:"14px",
        marginBottom:"14px",
        background:"#ffffff"
      }}
    >
      <img
        src={user?.profileImage || "/logo.png"}
        alt="Current account"
        style={{
          width:"58px",
          height:"58px",
          borderRadius:"50%",
          objectFit:"cover"
        }}
      />

      <div style={{ flex:1 }}>
        <div
          style={{
            fontSize:"20px",
            fontWeight:"900",
            color:"#000"
          }}
        >
          {user?.name || "Current User"}
        </div>

        <div
          style={{
            fontSize:"15px",
            color:"#777",
            fontWeight:"700"
          }}
        >
          {user?.email || "No email"}
        </div>
      </div>

      <div
        style={{
          color:"#f97316",
          fontSize:"34px",
          fontWeight:"900"
        }}
      >
        ✓
      </div>
    </div>

    <div
      onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login";
      }}
      style={{
        border:"1px solid #e5e7eb",
        borderRadius:"18px",
        padding:"16px",
        display:"flex",
        alignItems:"center",
        gap:"14px",
        background:"#ffffff",
        cursor:"pointer"
      }}
    >
      <div
        style={{
          width:"58px",
          height:"58px",
          borderRadius:"50%",
          background:"#f3f4f6",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          fontSize:"34px",
          color:"#555"
        }}
      >
        +
      </div>

      <div
        style={{
          fontSize:"20px",
          fontWeight:"900",
          color:"#000"
        }}
      >
        Add account
      </div>
    </div>
  </div>
)

    : selectedSetting
  }
</div>
          )
        }

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

  </>
);
}


   