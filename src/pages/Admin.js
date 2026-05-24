import React,{
  useEffect,
  useState
} from "react";

import styled,{
  createGlobalStyle
} from "styled-components";

import API from "../api/api";

import * as XLSX from "xlsx";

import socket from "../socket";

import logo from "../assets/logo.png";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

const GlobalLeafletFix = createGlobalStyle`
  .leaflet-container{
    position:relative !important;
    z-index:0 !important;
  }

  .leaflet-pane,
  .leaflet-map-pane,
  .leaflet-tile-pane,
  .leaflet-overlay-pane,
  .leaflet-marker-pane,
  .leaflet-tooltip-pane,
  .leaflet-popup-pane{
    z-index:0 !important;
  }

  .leaflet-control-container{
    position:relative !important;
    z-index:1 !important;
  }
`;

const riderIcon = new L.Icon({
  iconUrl:"https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize:[40,40]
});

const Page = styled.div`
  min-height:100vh;
  background:#f5f7fb;
`;

const Wrapper = styled.div`
  max-width:1200px;
  margin:auto;
  padding:18px 20px 30px;

  @media(max-width:768px){
    padding:14px 12px 24px;
  }
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

const DashboardHeroContent = styled.div`
  position:relative;
  z-index:2;

  display:grid;
  grid-template-columns:minmax(0,1fr) 330px;
  align-items:center;
  gap:18px;

  @media(max-width:900px){
    grid-template-columns:1fr;
    gap:16px;
  }
`;

const AdminHeroLeft = styled.div`
  display:flex;
  align-items:center;
  gap:16px;
  min-width:0;

  @media(max-width:768px){
    gap:12px;
    align-items:flex-start;
  }
`;

const HeroLogo = styled.img`
  width:72px;
  height:72px;
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

const HeroTextBlock = styled.div`
  min-width:0;
`;

const HeroBadge = styled.div`
  display:inline-flex;
  align-items:center;
  gap:8px;

  padding:8px 16px;
  border-radius:999px;

  background:rgba(255,255,255,0.14);
  border:1px solid rgba(255,255,255,0.22);

  color:white;
  font-size:13px;
  font-weight:900;

  margin-bottom:12px;
`;

const DashboardHeroTitle = styled.h1`
  font-size:28px;
  font-weight:900;
  margin:0 0 7px;
  letter-spacing:-0.4px;
  line-height:1.12;

  @media(max-width:768px){
    font-size:24px;
  }

  @media(max-width:480px){
    font-size:22px;
  }
`;

const DashboardHeroText = styled.p`
  max-width:600px;
  color:#dbeafe;
  font-size:13px;
  line-height:1.45;
  margin:0;
  font-weight:700;
`;

const HeroLogoutButton = styled.button`
  margin-top:12px;

  border:none;
  border-radius:14px;

  padding:10px 14px;

  background:#fee2e2;
  color:#b91c1c;

  font-size:13px;
  font-weight:900;

  cursor:pointer;

  transition:0.25s ease;

  &:hover{
    background:#ef4444;
    color:white;
    transform:translateY(-1px);
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
  display:inline-flex;
  align-items:center;
  justify-content:center;

  padding:7px 14px;
  border-radius:999px;

  background:#facc15;
  color:#0f172a;

  font-size:12px;
  font-weight:900;
  letter-spacing:0.8px;
  text-transform:uppercase;

  margin-bottom:12px;
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

const DashboardTime = styled.div`
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
`;

const HeroCardSmall = styled.div`
  font-size:12px;
  font-weight:800;
  color:rgba(255,255,255,0.88);
`;

const Stats = styled.div`
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
  gap:14px;
  margin-bottom:20px;
`;

const StatCard = styled.div`
  background:white;

  border-radius:20px;
  padding:18px;

  border:${props =>
    props.$active
    ? "1px solid #facc15"
    : "1px solid #e5e7eb"};

  box-shadow:${props =>
    props.$active
    ? "0 14px 30px rgba(250,204,21,0.18)"
    : "0 8px 22px rgba(15,23,42,0.045)"};

  position:relative;
  overflow:hidden;

  transition:0.25s ease;

  cursor:pointer;

  &::before{
    content:"";
    position:absolute;
    top:0;
    left:0;
    right:0;
    height:4px;
    background:${props =>
      props.active
      ? "#f59e0b"
      : "#facc15"};
  }

  &:hover{
    transform:translateY(-2px);
    box-shadow:
      0 12px 28px rgba(15,23,42,0.075);
  }
`;

const StatIcon = styled.div`
  width:42px;
  height:42px;

  border-radius:14px;

  display:flex;
  align-items:center;
  justify-content:center;

  background:${props =>
    props.$online === true
    ? "#dcfce7"
    : props.$online === false
    ? "#f1f5f9"
    : "#eff6ff"};

  color:${props =>
    props.$online === true
    ? "#16a34a"
    : props.$online === false
    ? "#94a3b8"
    : "#1d4ed8"};

  font-size:20px;
  font-weight:900;

  margin-bottom:14px;

  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.8);

  animation:${props =>
    props.$online === true
    ? "onlineBlink 1s ease-in-out infinite"
    : "none"};

  @keyframes onlineBlink{
    0%{
      transform:scale(1);
      box-shadow:
        0 0 0 0 rgba(34,197,94,0.45);
    }

    50%{
      transform:scale(1.08);
      box-shadow:
        0 0 0 8px rgba(34,197,94,0.12);
    }

    100%{
      transform:scale(1);
      box-shadow:
        0 0 0 0 rgba(34,197,94,0);
    }
  }
`;

const StatTitle = styled.div`
  font-size:12px;
  color:#64748b;

  font-weight:900;
  letter-spacing:0.5px;
  text-transform:uppercase;
`;

const StatValue = styled.div`
  font-size:32px;
  font-weight:900;
  margin-top:8px;

  color:#0f172a;
  letter-spacing:-0.5px;
`;

const StatSmall = styled.div`
  font-size:12px;
  margin-top:8px;

  color:#64748b;

  font-weight:700;
  line-height:1.4;
`;

const AnalyticsGrid = styled.div`
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
  gap:16px;
  margin-bottom:24px;
`;

const AnalyticsCard = styled.div`
  background:${props =>
    props.$light
    ? "white"
    : "linear-gradient(135deg,#111827,#1e293b)"};

  color:${props =>
    props.$light
    ? "#0f172a"
    : "white"};

  border-radius:24px;
  padding:22px;

  border:${props =>
    props.$light
    ? "1px solid #e5e7eb"
    : "1px solid rgba(250,204,21,0.18)"};

  box-shadow:
    0 10px 28px rgba(15,23,42,0.08);
`;

const AnalyticsLabel = styled.div`
  font-size:13px;
  color:${props =>
    props.$light
    ? "#64748b"
    : "#cbd5e1"};

  margin-bottom:10px;
  font-weight:800;
`;

const AnalyticsValue = styled.div`
  font-size:34px;
  font-weight:900;
  margin-bottom:16px;
`;

const ProgressTrack = styled.div`
  height:10px;
  width:100%;
  background:${props =>
    props.$light
    ? "#e5e7eb"
    : "rgba(255,255,255,0.18)"};

  border-radius:999px;
  overflow:hidden;
`;

const ProgressFill = styled.div`
  height:100%;
  width:${props=>props.width || "0%"};
  background:${props=>props.color || "#facc15"};
  border-radius:999px;
`;

const MiniText = styled.div`
  margin-top:10px;
  font-size:12px;
  color:${props =>
    props.$light
    ? "#64748b"
    : "#e2e8f0"};

  font-weight:700;
`;

const Empty = styled.div`
  text-align:center;

  padding:28px;

  color:#64748b;

  font-size:14px;
  font-weight:800;

  background:#f8fafc;

  border:1px dashed #cbd5e1;
  border-radius:16px;
`;

const OnlinePeopleGrid = styled.div`
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
  gap:16px;
  margin-bottom:24px;
`;

const OnlinePeopleCard = styled.div`
  background:white;

  border:1px solid #e5e7eb;
  border-radius:22px;

  padding:18px;

  box-shadow:
    0 8px 24px rgba(15,23,42,0.05);
`;

const OnlinePeopleHeader = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:12px;

  margin-bottom:14px;

  h3{
    margin:0;
    color:#0f172a;
    font-size:17px;
    font-weight:900;
  }
`;

const OnlineCount = styled.div`
  background:#dcfce7;
  color:#166534;

  padding:6px 11px;
  border-radius:999px;

  font-size:12px;
  font-weight:900;
`;

const OnlinePersonRow = styled.div`
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;

  padding:12px 0;

  border-bottom:1px solid #f1f5f9;

  &:last-child{
    border-bottom:none;
  }
`;

const OnlinePersonLeft = styled.div`
  display:flex;
  align-items:center;
  gap:10px;
`;

const OnlineDot = styled.div`
  width:10px;
  height:10px;

  border-radius:50%;

  background:#22c55e;

  box-shadow:
    0 0 0 4px rgba(34,197,94,0.14);
`;

const OnlinePersonName = styled.div`
  color:#0f172a;
  font-size:14px;
  font-weight:900;
`;

const OnlinePersonPhone = styled.div`
  color:#64748b;
  font-size:12px;
  font-weight:700;
  margin-top:2px;
`;

const OnlineRoleBadge = styled.div`
  background:#eff6ff;
  color:#1d4ed8;

  padding:6px 10px;
  border-radius:999px;

  font-size:11px;
  font-weight:900;
  text-transform:uppercase;
`;

const MapBox = styled.div`
  background:white;

  border-radius:24px;

  padding:18px;

  margin-bottom:24px;

  border:1px solid #e5e7eb;

  box-shadow:
    0 8px 24px rgba(15,23,42,0.06);
`;


const SectionTitle = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:12px;
  margin-bottom:15px;

  h3{
    margin:0;
    font-size:18px;
    font-weight:900;
    color:#0f172a;
  }

  @media(max-width:520px){
    align-items:flex-start;
    flex-direction:column;
  }
`;

const CountBadge = styled.div`
  background:#111827;
  color:white;

  padding:6px 12px;

  border-radius:999px;

  font-size:12px;
  font-weight:800;

  display:inline-flex;
  align-items:center;
  justify-content:center;

  white-space:nowrap;
`;

const ActionButton = styled.button`
  border:none;
  border-radius:12px;

  padding:10px 14px;

  background:${props =>
    props.$green
    ? "#16a34a"
    : "#dc2626"};

  color:white;

  font-weight:900;
  cursor:pointer;

  transition:0.25s ease;

  &:hover{
    transform:translateY(-1px);
    opacity:0.92;
  }
`;

const ModalOverlay = styled.div`
  position:fixed;
  inset:0;

  background:rgba(15,23,42,0.58);

  display:flex;
  align-items:center;
  justify-content:center;

  padding:18px;

  z-index:99999;
`;

const ModalCard = styled.div`
  width:100%;
  max-width:620px;

  background:white;

  border-radius:26px;

  padding:24px;

  box-shadow:
    0 28px 80px rgba(15,23,42,0.32);
`;

const ModalTitle = styled.h3`
  margin:0;

  color:#0f172a;

  font-size:24px;
  font-weight:900;
`;

const ModalText = styled.p`
  margin:8px 0 18px;

  color:#64748b;

  font-size:13px;
  font-weight:700;
  line-height:1.5;
`;

const StatusOptionGrid = styled.div`
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(230px,1fr));
  gap:12px;

  margin-bottom:16px;
`;

const StatusOption = styled.button`
  border:${props =>
  props.$active
  ? "2px solid #2563eb"
  : "1px solid #e5e7eb"};

background:${props =>
  props.$active
  ? "#eff6ff"
  : "white"};

  border-radius:18px;

  padding:14px;

  text-align:left;

  cursor:pointer;

  transition:0.2s ease;

  &:hover{
    border-color:#2563eb;
    background:#eff6ff;
    transform:translateY(-1px);
  }
`;

const StatusOptionIcon = styled.div`
  font-size:25px;
  margin-bottom:8px;
`;

const StatusOptionTitle = styled.div`
  color:#0f172a;

  font-size:14px;
  font-weight:900;
`;

const StatusOptionText = styled.div`
  color:#64748b;

  font-size:12px;
  font-weight:700;

  margin-top:5px;
  line-height:1.45;
`;

const ReasonBox = styled.textarea`
  width:100%;
  min-height:120px;

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
    border-color:#2563eb;

    box-shadow:
      0 0 0 4px rgba(37,99,235,0.08);
  }
`;

const ModalActions = styled.div`
  display:flex;
  justify-content:flex-end;
  gap:10px;

  margin-top:16px;
`;

const CancelButton = styled.button`
  border:none;
  border-radius:14px;

  padding:11px 15px;

  background:#f1f5f9;
  color:#0f172a;

  font-size:13px;
  font-weight:900;

  cursor:pointer;
`;

const SaveStatusButton = styled.button`
  border:none;
  border-radius:14px;

  padding:11px 15px;

  background:#2563eb;
  color:white;

  font-size:13px;
  font-weight:900;

  cursor:pointer;
`;

const DetailPanel = styled.div`
  background:white;

  border:1px solid #e5e7eb;
  border-radius:22px;

  padding:18px;

  margin-bottom:22px;

  box-shadow:
    0 10px 28px rgba(15,23,42,0.06);
`;

const DetailHeader = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:12px;

  margin-bottom:16px;

  h3{
    margin:0;
    color:#0f172a;
    font-size:18px;
    font-weight:900;
  }

  p{
    margin:4px 0 0;
    color:#64748b;
    font-size:13px;
    font-weight:700;
  }

  @media(max-width:520px){
    flex-direction:column;
    align-items:flex-start;
  }
`;

const ClosePanelButton = styled.button`
  border:none;
  border-radius:12px;

  padding:9px 13px;

  background:#f1f5f9;
  color:#0f172a;

  font-size:12px;
  font-weight:900;

  cursor:pointer;

  &:hover{
    background:#e2e8f0;
  }
`;

const RiderStatusFilterBar = styled.div`
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
  gap:10px;

  margin-bottom:16px;
  padding:14px;

  background:#f8fafc;

  border:1px solid #e5e7eb;
  border-radius:18px;
`;

const RiderStatusSearchInput = styled.input`
  width:100%;

  border:1px solid #e5e7eb;
  border-radius:12px;

  padding:11px 12px;

  font-size:13px;
  font-weight:800;

  outline:none;

  box-sizing:border-box;

  &:focus{
    border-color:#2563eb;

    box-shadow:
      0 0 0 4px rgba(37,99,235,0.08);
  }
`;

const RiderStatusSelect = styled.select`
  width:100%;

  border:1px solid #e5e7eb;
  border-radius:12px;

  padding:11px 12px;

  font-size:13px;
  font-weight:800;

  outline:none;
  background:white;

  box-sizing:border-box;

  &:focus{
    border-color:#2563eb;

    box-shadow:
      0 0 0 4px rgba(37,99,235,0.08);
  }
`;

const ClearFiltersButton = styled.button`
  border:none;
  border-radius:12px;

  padding:11px 12px;

  background:#111827;
  color:white;

  font-size:13px;
  font-weight:900;

  cursor:pointer;

  &:hover{
    background:#0f172a;
  }
`;

const FilterResultText = styled.div`
  color:#64748b;
  font-size:12px;
  font-weight:900;

  display:flex;
  align-items:center;
`;

const HeaderActions = styled.div`
  display:flex;
  align-items:center;
  gap:10px;
  flex-wrap:wrap;
`;

const ExportExcelButton = styled.button`
  border:none;
  border-radius:12px;

  padding:9px 13px;

  background:#16a34a;
  color:white;

  font-size:12px;
  font-weight:900;

  cursor:pointer;

  &:hover{
    background:#15803d;
  }
`;

const DetailGrid = styled.div`
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
  gap:12px;
`;

const DetailCard = styled.div`
  background:#f8fafc;

  border:1px solid #e5e7eb;
  border-radius:16px;

  padding:14px;

  border-left:4px solid ${props =>
    props.warning
    ? "#dc2626"
    : props.success
    ? "#16a34a"
    : "#facc15"};
`;

const DetailTitle = styled.div`
  color:#0f172a;
  font-size:14px;
  font-weight:900;

  margin-bottom:8px;
`;

const DetailMeta = styled.div`
  color:#475569;
  font-size:13px;
  line-height:1.55;

  strong{
    color:#0f172a;
  }
`;

const DetailAmount = styled.div`
  color:#0f172a;
  font-size:26px;
  font-weight:900;

  margin-top:8px;
`;

export default function Admin(){

  const [orders,setOrders] =
    useState([]);

  const [riders,setRiders] =
    useState([]);

    const [riderStatusHistories, setRiderStatusHistories] = 
    useState([]);

  const [user,setUser] =
    useState(null);

  const [currentTime,setCurrentTime] =
    useState(new Date());

  const [liveRiders,setLiveRiders] =
    useState({});

    const [activeAdminView,setActiveAdminView] =
  useState("");

  const [onlineUsers,setOnlineUsers] =
  useState([]);

  const [riderStatusModal,setRiderStatusModal] =
  useState(false);

const [selectedRider,setSelectedRider] =
  useState(null);

const [selectedRiderStatus,setSelectedRiderStatus] =
  useState("temporary_suspended");

const [riderStatusReason,setRiderStatusReason] =
  useState("");

const [riderStatusFiles,setRiderStatusFiles] =
  useState([]);

const [paymentRecords,setPaymentRecords] =
  useState([]);

const [paymentRecordsLoading,setPaymentRecordsLoading] =
  useState(false);

const [riderStatusFileLoading,setRiderStatusFileLoading] =
  useState(false);

 const [riderStatusSearch,setRiderStatusSearch] =
  useState("");

const [riderStatusAccountFilter,setRiderStatusAccountFilter] =
  useState("all");

const [riderStatusPerformanceFilter,setRiderStatusPerformanceFilter] =
  useState("all");

const [riderStatusSort,setRiderStatusSort] =
  useState("none");

  const fetchRiderStatusHistories = async () => {
  try {
    const res = await API.get("/rider-status-histories");

    console.log("Rider status histories:", res.data);

    setRiderStatusHistories(res.data);
  } catch (error) {
    console.error("Fetch rider status histories error:", error);
  }
};

  useEffect(()=>{

    fetchUser();

    fetchOrders();

    fetchRiders();

    fetchRiderStatusHistories();

    const interval =
      setInterval(()=>{

        fetchOrders();

        fetchRiders();

      },3000);

    return ()=>clearInterval(
      interval
    );

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

    socket.on(
      "riderLocationUpdate",
      (data)=>{

        console.log(
          "ADMIN RECEIVED RIDER LOCATION:",
          data
        );

        if(!data.riderId){
          return;
        }

        setLiveRiders((prev)=>({

          ...prev,

          [data.riderId]:{
            lat:data.lat,
            lng:data.lng,
            riderId:data.riderId
          }
        }));
      }
    );


    return ()=>{

      socket.off(
        "riderLocationUpdate"
      );
    };

  },[]);

  useEffect(()=>{

  socket.emit(
    "requestOnlineUsers"
  );

  socket.on(
    "onlineUsersUpdate",
    (users)=>{

      setOnlineUsers(
        Array.isArray(users)
        ? users
        : []
      );
    }
  );

  return ()=>{

    socket.off(
      "onlineUsersUpdate"
    );
  };

},[]);

  async function fetchUser(){

    try{

      const admin =
        JSON.parse(
          localStorage.getItem(
            "user"
          )
        );

      setUser(admin);

    }catch(err){

      console.log(err);
    }
  }

  async function fetchOrders(){

    try{

      const res =
        await API.get(
          "/orders"
        );

      setOrders(res.data);

    }catch(err){

      console.log(err);
    }
  }

  async function fetchRiders(){

  try{

    const res =
      await API.get(
        "/rider"
      );

    setRiders(
      res.data
    );

  }catch(err){

    console.log(
      "RIDER FETCH ERROR:",
      err
    );
  }
}

async function fetchRiderStatusFile(){

  try{

    setRiderStatusFileLoading(true);

    const res =
      await API.get(
        "/admin/rider-status-file"
      );

    setRiderStatusFiles(
      res.data?.riderFiles || []
    );

  }catch(err){

    console.log(
      "RIDER STATUS FILE FETCH ERROR:",
      err.response?.data || err.message
    );

    alert(
      err.response?.data?.message ||
      "Failed to load rider status file"
    );

  }finally{

    setRiderStatusFileLoading(false);
  }
}

async function fetchPaymentRecords(){

  try{

    setPaymentRecordsLoading(true);

    const res =
      await API.get(
        "/admin/payment-records"
      );

    setPaymentRecords(
      Array.isArray(res.data)
      ? res.data
      : []
    );

  }catch(err){

    console.log(
      "PAYMENT RECORDS ERROR:",
      err.response?.data || err.message
    );

    alert(
      err.response?.data?.message ||
      "Failed to load payment records"
    );

  }finally{

    setPaymentRecordsLoading(false);
  }
}

function formatExcelDate(value){

  if(!value){
    return "N/A";
  }

  try{

    return new Date(value).toLocaleString();

  }catch(err){

    return "N/A";
  }
}

function exportRiderStatusFileToExcel(){

  if(
    !Array.isArray(riderStatusFiles) ||
    riderStatusFiles.length === 0
  ){

    alert(
      "No rider status file records to export. Click Rider Status File first."
    );

    return;
  }

  const summaryRows =
    riderStatusFiles.map((file,index)=>{

      const rider =
        file.rider || {};

      return {
        "No":index + 1,
        "Rider Name":rider.name || "Unnamed Rider",
        "Phone":rider.phone || "N/A",
        "Email":rider.email || "N/A",
        "Current Account Status":file.currentAccountStatus || "active",
        "Current Work Status":file.currentWorkStatus || "available",
        "Performance":file.performanceCategory || "Not Rated Yet",
        "Average Rating":file.averageRating || 0,
        "Total Ratings":file.totalRatings || 0,
        "Suspension Count":file.suspensionCount || 0,
        "Reinstated Count":file.reinstatedCount || 0
      };
    });

  const statusHistoryRows =
    riderStatusFiles.flatMap((file)=>{

      const rider =
        file.rider || {};

      const historyList =
        Array.isArray(file.statusHistory)
        ? file.statusHistory
        : [];

      return historyList.map((history,index)=>({

        "Rider Name":rider.name || "Unnamed Rider",
        "Phone":rider.phone || "N/A",
        "Record No":index + 1,
        "Account Status":history.accountStatus || "N/A",
        "Previous Status":history.previousStatus || "N/A",
        "New Status":history.newStatus || "N/A",
        "Reason":history.reason || "No reason recorded",
        "Message":history.message || "N/A",
        "Date":formatExcelDate(history.createdAt)
      }));
    });

  const ratingRows =
    riderStatusFiles.flatMap((file)=>{

      const rider =
        file.rider || {};

      const ratingList =
        Array.isArray(file.ratings)
        ? file.ratings
        : [];

      return ratingList.map((rating,index)=>({

        "Rider Name":rider.name || "Unnamed Rider",
        "Phone":rider.phone || "N/A",
        "Rating No":index + 1,
        "Stars":rating.rating || 0,
        "Customer":rating.customer?.name || "Unknown Customer",
        "Comment":rating.comment || "No comment",
        "Date":formatExcelDate(rating.createdAt)
      }));
    });

  const workbook =
    XLSX.utils.book_new();

  const summarySheet =
    XLSX.utils.json_to_sheet(summaryRows);

  const statusHistorySheet =
    XLSX.utils.json_to_sheet(
      statusHistoryRows.length > 0
      ? statusHistoryRows
      : [
          {
            "Message":"No status history records found"
          }
        ]
    );

  const ratingsSheet =
    XLSX.utils.json_to_sheet(
      ratingRows.length > 0
      ? ratingRows
      : [
          {
            "Message":"No customer ratings found"
          }
        ]
    );

  XLSX.utils.book_append_sheet(
    workbook,
    summarySheet,
    "Rider Summary"
  );

  XLSX.utils.book_append_sheet(
    workbook,
    statusHistorySheet,
    "Status History"
  );

  XLSX.utils.book_append_sheet(
    workbook,
    ratingsSheet,
    "Customer Ratings"
  );

  const today =
    new Date()
      .toISOString()
      .slice(0,10);

  XLSX.writeFile(
    workbook,
    `MonniDrop_Rider_Status_File_${today}.xlsx`
  );
}

  async function suspendRider(riderId){

    try{

      const confirmSuspend =
        window.confirm(
          "Are you sure you want to suspend this rider?"
        );

      if(!confirmSuspend){
        return;
      }

      await API.put(
        `/admin/riders/${riderId}/suspend`
      );

      alert(
        "Rider suspended successfully"
      );

      fetchRiders();

    }catch(err){

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Failed to suspend rider"
      );
    }
  }

  async function unsuspendRider(riderId){

    try{

      await API.put(
        `/admin/riders/${riderId}/unsuspend`
      );

      alert(
        "Rider reactivated successfully"
      );

      fetchRiders();

    }catch(err){

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Failed to reactivate rider"
      );
    }
  }

  function openRiderStatusModal(rider){

  setSelectedRider(rider);

  setSelectedRiderStatus(
    rider.riderAccountStatus ||
    (
      rider.status === "suspended"
      ? "temporary_suspended"
      : "active"
    )
  );

  setRiderStatusReason("");

  setRiderStatusModal(true);
}

function getRiderAccountLabel(status){

  if(status === "temporary_suspended"){
    return "⏳ Temporary Suspension";
  }

  if(status === "permanent_suspension"){
    return "⛔ Permanent Suspension";
  }

  if(status === "reinstated"){
    return "🔄 Reinstated";
  }

  if(status === "active"){
    return "✅ Active Rider";
  }

  return "✅ Active Rider";
}

async function updateRiderAccountStatus(){

  try{

    if(!selectedRider){
      return;
    }

    if(
      !riderStatusReason ||
      riderStatusReason.trim() === ""
    ){

      alert(
        "Please enter the reason for this rider status."
      );

      return;
    }

    await API.put(
      `/admin/riders/${selectedRider._id}/account-status`,
      {
        accountStatus:selectedRiderStatus,
        reason:riderStatusReason.trim()
      }
    );

    alert(
      "Rider status updated and notification sent."
    );

    setRiderStatusModal(false);

    setSelectedRider(null);

    setSelectedRiderStatus(
      "temporary_suspended"
    );

    setRiderStatusReason("");

    fetchRiders();

    fetchRiderStatusHistories();

    if(activeAdminView === "riderStatusFile"){
      fetchRiderStatusFile();
    }

  }catch(err){

    console.log(err);

    alert(
      err.response?.data?.message ||
      "Failed to update rider status"
    );
  }
}

  function logout(){

    localStorage.clear();

    window.location.href =
      "/login";
  }

  const totalOrders =
    orders.length;

  const activeOrders =
    orders.filter((o)=>

      [
        "accepted",
        "picked",
        "delivering"
      ].includes(o.status)
    );

  const deliveredOrders =
    orders.filter(

      (o)=>
        o.status === "delivered"
    );

  const pendingOrders =
    orders.filter(

      (o)=>
        o.status === "pending"
    );

  const cancelledOrders =
    orders.filter((o)=>

      o.status === "cancelled" ||
      o.status === "canceled" ||
      o.status === "cancelled_by_customer" ||
      o.status === "cancelled_by_rider"
    );

  const fraudOrders =
    cancelledOrders.filter((o)=>

      Number(o.cancelCount || 0) >= 2 ||
      Number(o.customerCancelCount || 0) >= 2 ||
      Number(o.riderCancelCount || 0) >= 2 ||
      o.flagged === true
    );

  const totalRevenue =
    deliveredOrders.reduce(

      (total,o)=>
        total + Number(o.total || 0),

      0
    );

  const deliveredPercent =
    totalOrders > 0
    ? Math.round(
        (deliveredOrders.length / totalOrders) * 100
      )
    : 0;

  const pendingPercent =
    totalOrders > 0
    ? Math.round(
        (pendingOrders.length / totalOrders) * 100
      )
    : 0;

  const activePercent =
    totalOrders > 0
    ? Math.round(
        (activeOrders.length / totalOrders) * 100
      )
    : 0;

    const onlineRiders =
  onlineUsers.filter(
    (u)=>u.role === "rider"
  );

const onlineCustomers =
  onlineUsers.filter(
    (u)=>u.role === "customer"
  );

    const riderRevenueList =
  Object.values(
    deliveredOrders.reduce(
      (summary,o)=>{

        const riderId =
          o.rider?._id ||
          o.rider ||
          "unassigned";

        const riderName =
          o.rider?.name ||
          "Unassigned Rider";

        const riderPhone =
          o.rider?.phone ||
          "N/A";

        if(!summary[riderId]){

          summary[riderId] = {
            riderId,
            riderName,
            riderPhone,
            totalRevenue:0,
            deliveredCount:0
          };
        }

        summary[riderId].totalRevenue +=
          Number(o.total || 0);

        summary[riderId].deliveredCount +=
          1;

        return summary;
      },
      {}
    )
  ).sort(
    (a,b)=>
      b.totalRevenue - a.totalRevenue
  );

function getSelectedOrders(){

  if(activeAdminView === "total"){
    return orders;
  }

  if(activeAdminView === "active"){
    return activeOrders;
  }

  if(activeAdminView === "delivered"){
    return deliveredOrders;
  }

  if(activeAdminView === "pending"){
    return pendingOrders;
  }

  if(activeAdminView === "fraud"){
    return fraudOrders;
  }

  return [];
}

const selectedOrders =
  getSelectedOrders();

const selectedTitle =
  activeAdminView === "revenue"
  ? "Total Revenue By Riders"
  : activeAdminView === "total"
  ? "All Orders"
  : activeAdminView === "active"
  ? "Active Orders"
  : activeAdminView === "delivered"
  ? "Delivered Orders"
  : activeAdminView === "pending"
  ? "Pending Orders"
  : activeAdminView === "fraud"
  ? "Fraud / Cancel Alerts"
 : activeAdminView === "riders"
  ? "Riders Activities"
  : activeAdminView === "riderStatusFile"
  ? "Rider Status File"
    : activeAdminView === "paymentRecords"
  ? "Payment Records"
  : activeAdminView === "onlineRiders"
  ? "Online Riders"
  : activeAdminView === "onlineCustomers"
  ? "Logged-in Customers"
  : "";

  const filteredRiderStatusFiles =
  [...riderStatusFiles]
    .filter((file)=>{

      const rider =
        file.rider || {};

      const search =
        riderStatusSearch
          .toLowerCase()
          .trim();

      const riderName =
        String(rider.name || "")
          .toLowerCase();

      const riderPhone =
        String(rider.phone || "")
          .toLowerCase();

      const riderEmail =
        String(rider.email || "")
          .toLowerCase();

      const accountStatus =
        String(file.currentAccountStatus || "active");

      const performance =
        String(file.performanceCategory || "Not Rated Yet")
          .toLowerCase();

      const matchesSearch =
        search === "" ||
        riderName.includes(search) ||
        riderPhone.includes(search) ||
        riderEmail.includes(search);

      const matchesAccount =
        riderStatusAccountFilter === "all" ||
        accountStatus === riderStatusAccountFilter;

      const matchesPerformance =
        riderStatusPerformanceFilter === "all" ||
        performance === riderStatusPerformanceFilter;

      return (
        matchesSearch &&
        matchesAccount &&
        matchesPerformance
      );
    })
    .sort((a,b)=>{

      if(riderStatusSort === "highestRating"){

        return Number(b.averageRating || 0) -
          Number(a.averageRating || 0);
      }

      if(riderStatusSort === "lowestRating"){

        return Number(a.averageRating || 0) -
          Number(b.averageRating || 0);
      }

      if(riderStatusSort === "mostSuspensions"){

        return Number(b.suspensionCount || 0) -
          Number(a.suspensionCount || 0);
      }

      if(riderStatusSort === "mostRatings"){

        return Number(b.totalRatings || 0) -
          Number(a.totalRatings || 0);
      }

      return 0;
    });

function clearRiderStatusFilters(){

  setRiderStatusSearch("");

  setRiderStatusAccountFilter("all");

  setRiderStatusPerformanceFilter("all");

  setRiderStatusSort("none");
}

  return(

    <Page>

      <GlobalLeafletFix />

      <Wrapper>

        <DashboardHero>

          <DashboardHeroContent>

            <AdminHeroLeft>

              <HeroLogo
                src={logo}
                alt="MonniDrop Logo"
              />

              <HeroTextBlock>

                <HeroBadge>
                  ⚡ MonniDrop Admin Control
                </HeroBadge>

                <DashboardHeroTitle>
                  Welcome / Akwaaba,
                  {" "}
                  {
                    user?.name || "Admin"
                  }
                  {" "}👋
                </DashboardHeroTitle>

                <DashboardHeroText>
                  Monitor All Activities
                </DashboardHeroText>

                <HeroLogoutButton
                  onClick={logout}
                >
                  Logout
                </HeroLogoutButton>

              </HeroTextBlock>

            </AdminHeroLeft>

            <DashboardHeroCard>

              <HeroCardLabel>
                System Live
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

              <DashboardTime>
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
              </DashboardTime>

              <HeroCardSmall>
                {Object.keys(liveRiders).length}
                {" "}live riders connected
              </HeroCardSmall>

            </DashboardHeroCard>

          </DashboardHeroContent>

        </DashboardHero>

        <Stats>

  <StatCard
  
  $active={activeAdminView === "revenue"}
  onClick={()=>
    setActiveAdminView("revenue")
  }
>

    <StatIcon>
      ₵
    </StatIcon>

    <StatTitle>
      Total Revenue
    </StatTitle>

    <StatValue>
      ₵{totalRevenue}
    </StatValue>

    <StatSmall>
      Click to view rider revenue.
    </StatSmall>

  </StatCard>
  <StatCard
    $active={activeAdminView === "total"}
    onClick={()=>
      setActiveAdminView("total")
    }
  >

    <StatIcon>
      📦
    </StatIcon>

    <StatTitle>
      Total Orders
    </StatTitle>

    <StatValue>
      {totalOrders}
    </StatValue>

    <StatSmall>
      Click to view all orders.
    </StatSmall>

  </StatCard>

  <StatCard
    $active={activeAdminView === "active"}
    onClick={()=>
      setActiveAdminView("active")
    }
  >

    <StatIcon>
      🛵
    </StatIcon>

    <StatTitle>
      Active Orders
    </StatTitle>

    <StatValue>
      {activeOrders.length}
    </StatValue>

    <StatSmall>
      Click to view active orders.
    </StatSmall>

  </StatCard>

  <StatCard
    $active={activeAdminView === "delivered"}
    onClick={()=>
      setActiveAdminView("delivered")
    }
  >

    <StatIcon>
      ✅
    </StatIcon>

    <StatTitle>
      Delivered
    </StatTitle>

    <StatValue>
      {deliveredOrders.length}
    </StatValue>

    <StatSmall>
      Click to view delivered orders.
    </StatSmall>

  </StatCard>

  <StatCard
    $active={activeAdminView === "pending"}
    onClick={()=>
      setActiveAdminView("pending")
    }
  >

    <StatIcon>
      ⏳
    </StatIcon>

    <StatTitle>
      Pending Orders
    </StatTitle>

    <StatValue>
      {pendingOrders.length}
    </StatValue>

    <StatSmall>
      Click to view pending orders.
    </StatSmall>

  </StatCard>

  <StatCard
    $active={activeAdminView === "fraud"}
    onClick={()=>
      setActiveAdminView("fraud")
    }
  >

    <StatIcon>
      ⚠️
    </StatIcon>

    <StatTitle>
      Fraud Alerts
    </StatTitle>

    <StatValue>
      {fraudOrders.length}
    </StatValue>

    <StatSmall>
      Click to view cancel alerts.
    </StatSmall>

  </StatCard>

  <StatCard

  $active={activeAdminView === "riders"}
  onClick={()=>
    setActiveAdminView("riders")
  }
>

  <StatIcon>
  🏍️
</StatIcon>

  <StatTitle>
    Riders Activities
  </StatTitle>

  <StatValue>
    {riders.length}
  </StatValue>

  <StatSmall>
    Click to view all riders.
  </StatSmall>

</StatCard>

<StatCard
  $active={activeAdminView === "riderStatusFile"}
  onClick={()=>{
    setActiveAdminView("riderStatusFile");
    fetchRiderStatusFile();
  }}
>

  <StatIcon>
    📁
  </StatIcon>

  <StatTitle>
    Rider Status File
  </StatTitle>

  <StatValue>
    {riders.length}
  </StatValue>

  <StatSmall>
    View suspensions, reasons, ratings, and performance.
  </StatSmall>

</StatCard>

<StatCard
  $active={activeAdminView === "onlineRiders"}
  onClick={()=>
    setActiveAdminView("onlineRiders")
  }
>

  <StatIcon
  $online={onlineRiders.length > 0}
>
  ●
</StatIcon>

  <StatTitle>
    Online Riders
  </StatTitle>

  <StatValue>
    {onlineRiders.length}
  </StatValue>

  <StatSmall>
    Click to view online riders.
  </StatSmall>

</StatCard>

<StatCard
  $active={activeAdminView === "paymentRecords"}
  onClick={()=>{
    setActiveAdminView("paymentRecords");
    fetchPaymentRecords();
  }}
>

  <StatIcon>
    💰
  </StatIcon>

  <StatTitle>
    Payment Records
  </StatTitle>

  <StatValue>
    {deliveredOrders.length}
  </StatValue>

  <StatSmall>
    View paid, unpaid, cash collected, and delivery payment records.
  </StatSmall>

</StatCard>

<StatCard
  $active={activeAdminView === "onlineCustomers"}
  onClick={()=>
    setActiveAdminView("onlineCustomers")
  }
>

  <StatIcon
  $online={onlineCustomers.length > 0}
>
  ●
</StatIcon>

  <StatTitle>
    Logged-in Customers
  </StatTitle>

  <StatValue>
    {onlineCustomers.length}
  </StatValue>

  <StatSmall>
    Click to view logged-in customers.
  </StatSmall>

</StatCard>

</Stats>

{
  activeAdminView && (

    <DetailPanel>

      <DetailHeader>

        <div>

          <h3>
            {selectedTitle}
          </h3>

        </div>

        <HeaderActions>

  {
    activeAdminView === "riderStatusFile" && (

      <ExportExcelButton
        type="button"
        onClick={exportRiderStatusFileToExcel}
      >
        Export Excel
      </ExportExcelButton>
    )
  }

  <ClosePanelButton
    onClick={()=>
      setActiveAdminView("")
    }
  >
    Close
  </ClosePanelButton>

</HeaderActions>

      </DetailHeader>

      {
  activeAdminView === "revenue"
  ? (

    riderRevenueList.length === 0
    ? (

      <Empty>
        No delivered rider revenue found yet.
      </Empty>

    ) : (

      <DetailGrid>

        {
          riderRevenueList.map((rider)=>(

            <DetailCard
              key={rider.riderId}
              success
            >

              <DetailTitle>
                {rider.riderName}
              </DetailTitle>

              <DetailMeta>
                <strong>Phone:</strong>{" "}
                {rider.riderPhone}
                <br />

                <strong>Delivered Orders:</strong>{" "}
                {rider.deliveredCount}
              </DetailMeta>

              <DetailAmount>
                ₵{rider.totalRevenue}
              </DetailAmount>

            </DetailCard>
          ))
        }

      </DetailGrid>
    )

  ) : activeAdminView === "riders"
  ? (

    riders.length === 0
    ? (

      <Empty>
        No riders found.
      </Empty>

    ) : (

      <DetailGrid>

        {
          riders.map((r)=>{

            const riderIsBusy =
              orders.some(
                (o)=>
                  o.rider?._id === r._id &&
                  [
                    "accepted",
                    "picked",
                    "delivering"
                  ].includes(o.status)
              );

            return(

              <DetailCard
                key={r._id}
                success={
                  r.status !== "suspended" &&
                  !riderIsBusy
                }
                warning={
                  r.status === "suspended"
                }
              >

                <DetailTitle>
                  {r.name || "Unnamed Rider"}
                </DetailTitle>

                <DetailMeta>
  <strong>Phone:</strong>{" "}
  {r.phone || "N/A"}
  <br />

  <strong>Live Status:</strong>{" "}
  {r.status || "N/A"}
  <br />

  <strong>Account Status:</strong>{" "}
  {getRiderAccountLabel(
    r.riderAccountStatus
  )}
  <br />

  <strong>Reason:</strong>{" "}
  {r.riderStatusReason || "No reason recorded"}
</DetailMeta>

                <div
                  style={{
                    marginTop:"12px"
                  }}
                >

                <ActionButton
  $green
  onClick={()=>
    openRiderStatusModal(r)
  }
>
  Manage Rider Status
</ActionButton>

                </div>

              </DetailCard>
            );
          })
        }

      </DetailGrid>
    )

    ) : activeAdminView === "riderStatusFile"
? (

  riderStatusFileLoading
  ? (

    <Empty>
      Loading rider status file...
    </Empty>

  ) : riderStatusFiles.length === 0
? (

  <Empty>
    No rider status file records found yet.
  </Empty>

) : (

  <>

    <RiderStatusFilterBar>

      <RiderStatusSearchInput
        type="text"
        placeholder="Search rider name, phone, or email..."
        value={riderStatusSearch}
        onChange={(e)=>
          setRiderStatusSearch(e.target.value)
        }
      />

      <RiderStatusSelect
        value={riderStatusAccountFilter}
        onChange={(e)=>
          setRiderStatusAccountFilter(e.target.value)
        }
      >
        <option value="all">
          All Account Status
        </option>

        <option value="active">
          Active
        </option>

        <option value="temporary_suspended">
          Temporary Suspended
        </option>

        <option value="permanent_suspension">
          Permanent Suspension
        </option>

        <option value="reinstated">
          Reinstated
        </option>
      </RiderStatusSelect>

      <RiderStatusSelect
        value={riderStatusPerformanceFilter}
        onChange={(e)=>
          setRiderStatusPerformanceFilter(e.target.value)
        }
      >
        <option value="all">
          All Performance
        </option>

        <option value="hardworking">
          Hardworking
        </option>

        <option value="average">
          Average
        </option>

        <option value="lazy">
          Lazy
        </option>

        <option value="not rated yet">
          Not Rated Yet
        </option>
      </RiderStatusSelect>

      <RiderStatusSelect
        value={riderStatusSort}
        onChange={(e)=>
          setRiderStatusSort(e.target.value)
        }
      >
        <option value="none">
          Default Sort
        </option>

        <option value="highestRating">
          Highest Rating
        </option>

        <option value="lowestRating">
          Lowest Rating
        </option>

        <option value="mostSuspensions">
          Most Suspensions
        </option>

        <option value="mostRatings">
          Most Ratings
        </option>
      </RiderStatusSelect>

      <ClearFiltersButton
        type="button"
        onClick={clearRiderStatusFilters}
      >
        Clear Filters
      </ClearFiltersButton>

      <FilterResultText>
        Showing {filteredRiderStatusFiles.length} of {riderStatusFiles.length} riders
      </FilterResultText>

    </RiderStatusFilterBar>

    {
      filteredRiderStatusFiles.length === 0
      ? (

        <Empty>
          No rider matches your search or filter.
        </Empty>

      ) : (

        <DetailGrid>

          {
            filteredRiderStatusFiles.map((file)=>{

          const rider =
            file.rider || {};

          const recentHistory =
            Array.isArray(file.statusHistory)
            ? file.statusHistory.slice(0,3)
            : [];

          const recentRatings =
            Array.isArray(file.ratings)
            ? file.ratings.slice(0,3)
            : [];

          return(

            <DetailCard
              key={rider._id}
            >

              <DetailTitle>
                {rider.name || "Unnamed Rider"}
              </DetailTitle>

              <DetailMeta>

                <strong>Phone:</strong>{" "}
                {rider.phone || "N/A"}
                <br />

                <strong>Current Account Status:</strong>{" "}
                {file.currentAccountStatus || "active"}
                <br />

                <strong>Current Work Status:</strong>{" "}
                {file.currentWorkStatus || "available"}
                <br />

                <strong>Performance:</strong>{" "}
                {file.performanceCategory || "Not Rated Yet"}
                <br />

                <strong>Average Rating:</strong>{" "}
                {
                  file.averageRating > 0
                  ? `${file.averageRating} ⭐`
                  : "No rating yet"
                }
                <br />

                <strong>Total Ratings:</strong>{" "}
                {file.totalRatings || 0}
                <br />

                <strong>Suspensions:</strong>{" "}
                {file.suspensionCount || 0}
                <br />

                <strong>Reinstated:</strong>{" "}
                {file.reinstatedCount || 0}

              </DetailMeta>

              <div
                style={{
                  marginTop:"14px",
                  paddingTop:"12px",
                  borderTop:"1px solid #e5e7eb"
                }}
              >

                <DetailTitle>
                  Recent Status Records
                </DetailTitle>

                {
                  recentHistory.length === 0
                  ? (

                    <DetailMeta>
                      No suspension or status history yet.
                    </DetailMeta>

                  ) : (

                    recentHistory.map((history)=>(

                      <DetailMeta
                        key={history._id}
                        style={{
                          marginBottom:"10px"
                        }}
                      >

                        <strong>Status:</strong>{" "}
                        {history.accountStatus}
                        <br />

                        <strong>Reason:</strong>{" "}
                        {history.reason || "No reason recorded"}
                        <br />

                        <strong>Date:</strong>{" "}
                        {
                          history.createdAt
                          ? new Date(history.createdAt)
                            .toLocaleString()
                          : "N/A"
                        }

                      </DetailMeta>
                    ))
                  )
                }

              </div>

              <div
                style={{
                  marginTop:"14px",
                  paddingTop:"12px",
                  borderTop:"1px solid #e5e7eb"
                }}
              >

                <DetailTitle>
                  Recent Customer Ratings
                </DetailTitle>

                {
                  recentRatings.length === 0
                  ? (

                    <DetailMeta>
                      No customer ratings yet.
                    </DetailMeta>

                  ) : (

                    recentRatings.map((rating)=>(

                      <DetailMeta
                        key={rating._id}
                        style={{
                          marginBottom:"10px"
                        }}
                      >

                        <strong>Stars:</strong>{" "}
                        {rating.rating} ⭐
                        <br />

                        <strong>Customer:</strong>{" "}
                        {rating.customer?.name || "Unknown Customer"}
                        <br />

                        <strong>Comment:</strong>{" "}
                        {rating.comment || "No comment"}
                        <br />

                        <strong>Date:</strong>{" "}
                        {
                          rating.createdAt
                          ? new Date(rating.createdAt)
                            .toLocaleString()
                          : "N/A"
                        }

                      </DetailMeta>
                    ))
                  )
                }

              </div>

            </DetailCard>
          );
               })
        }

        </DetailGrid>
      )
    }

  </>
)

) : activeAdminView === "paymentRecords"
? (

  paymentRecordsLoading
  ? (

    <Empty>
      Loading payment records...
    </Empty>

  ) : paymentRecords.length === 0
  ? (

    <Empty>
      No payment records found yet.
    </Empty>

  ) : (

    <DetailGrid>

      {
        paymentRecords.map((record)=>(

          <DetailCard
            key={record.orderId}
            success={record.isPaid}
            warning={!record.isPaid}
          >

            <DetailTitle>
              Order #{String(record.orderId).slice(-6)}
            </DetailTitle>

            <DetailMeta>

              <strong>Customer:</strong>{" "}
              {record.customer?.name || "Unknown Customer"}
              <br />

              <strong>Customer Phone:</strong>{" "}
              {record.customer?.phone || "N/A"}
              <br />

              <strong>Rider:</strong>{" "}
              {record.rider?.name || "Unassigned Rider"}
              <br />

              <strong>Rider Phone:</strong>{" "}
              {record.rider?.phone || "N/A"}
              <br />

              <strong>Route:</strong>{" "}
              {record.pickupLocation || "N/A"}
              {" → "}
              {record.dropoffLocation || "N/A"}
              <br />

              <strong>Payment Method:</strong>{" "}
              {record.paymentMethod || "N/A"}
              <br />

              <strong>Payment Status:</strong>{" "}
              {
                record.isPaid
                ? "Paid"
                : "Unpaid"
              }
              <br />

              <strong>Cash Collected:</strong>{" "}
              {
                record.cashCollectedByRider
                ? "Yes"
                : "No"
              }
              <br />

              <strong>Delivered At:</strong>{" "}
              {
                record.deliveredAt
                ? new Date(record.deliveredAt).toLocaleString()
                : "N/A"
              }

            </DetailMeta>

            <DetailAmount>
              ₵{record.amount || 0}
            </DetailAmount>

          </DetailCard>
        ))
      }

    </DetailGrid>
  )

   ) : activeAdminView === "onlineRiders"
  ? (

    onlineRiders.length === 0
    ? (

      <Empty>
        No rider is online right now.
      </Empty>

    ) : (

      <DetailGrid>

        {
          onlineRiders.map((rider)=>(

            <DetailCard
              key={rider.socketId}
              success
            >

              <DetailTitle>
                {rider.name || "Unknown Rider"}
              </DetailTitle>

            </DetailCard>
          ))
        }

      </DetailGrid>
    )

  ) : activeAdminView === "onlineCustomers"
  ? (

    onlineCustomers.length === 0
    ? (

      <Empty>
        No customer is logged in right now.
      </Empty>

    ) : (

      <DetailGrid>

        {
          onlineCustomers.map((customer)=>(

            <DetailCard
              key={customer.socketId}
              success
            >

              <DetailTitle>
                {customer.name || "Unknown Customer"}
              </DetailTitle>

              <DetailMeta>
                <strong>Phone:</strong>{" "}
                {customer.phone || "N/A"}
                <br />

                <strong>Status:</strong>{" "}
                Logged in
              </DetailMeta>

            </DetailCard>
          ))
        }

      </DetailGrid>
    )

  ) : (

    selectedOrders.length === 0
    ? (

      <Empty>
        No records found for this view.
      </Empty>

    ) : (

      <DetailGrid>

        {
          selectedOrders.map((o)=>(

            <DetailCard
              key={o._id}
              warning={activeAdminView === "fraud"}
              success={activeAdminView === "delivered"}
            >

              <DetailTitle>
                {o.customer?.name || "Unknown Customer"}
              </DetailTitle>

              <DetailMeta>
                <strong>Pickup:</strong>{" "}
                {o.pickupLocation || "N/A"}
                <br />

                <strong>Dropoff:</strong>{" "}
                {o.dropoffLocation || "N/A"}
                <br />

                <strong>Rider:</strong>{" "}
                {
                  o.rider?.name ||
                  "Waiting..."
                }
                <br />

                <strong>Status:</strong>{" "}
                {o.status || "N/A"}
                <br />

                <strong>Amount:</strong>{" "}
                ₵{o.total || 0}

                {
                  activeAdminView === "fraud" && (
                    <>
                      <br />
                      <strong>Cancel Reason:</strong>{" "}
                      {o.cancelReason || "No reason provided"}
                    </>
                  )
                }
              </DetailMeta>

            </DetailCard>
          ))
        }

      </DetailGrid>
    )
  )
}

    </DetailPanel>
  )
}

        <AnalyticsGrid>

         <AnalyticsCard $light>

  <AnalyticsLabel $light>
    Delivered Orders
  </AnalyticsLabel>

  <AnalyticsValue>
    {deliveredPercent}%
  </AnalyticsValue>

  <ProgressTrack $light>

    <ProgressFill
      width={`${deliveredPercent}%`}
      color="#22c55e"
    />

  </ProgressTrack>

  <MiniText $light>

    {deliveredOrders.length}
    {" "}of{" "}
    {totalOrders}
    {" "}orders delivered

  </MiniText>

</AnalyticsCard>

          <AnalyticsCard $light>

            <AnalyticsLabel $light>
              Active Deliveries
            </AnalyticsLabel>

            <AnalyticsValue>
              {activePercent}%
            </AnalyticsValue>

            <ProgressTrack $light>

              <ProgressFill
                width={`${activePercent}%`}
                color="#2563eb"
              />

            </ProgressTrack>

            <MiniText $light>

              {activeOrders.length}
              {" "}orders currently moving

            </MiniText>

          </AnalyticsCard>

          <AnalyticsCard $light>

            <AnalyticsLabel $light>
              Pending Orders
            </AnalyticsLabel>

            <AnalyticsValue>
              {pendingPercent}%
            </AnalyticsValue>

            <ProgressTrack $light>

              <ProgressFill
                width={`${pendingPercent}%`}
                color="#f59e0b"
              />

            </ProgressTrack>

            <MiniText $light>

              {pendingOrders.length}
              {" "}orders waiting for riders

            </MiniText>

          </AnalyticsCard>

        </AnalyticsGrid>

        <MapBox>

          <SectionTitle>

            <h3>
              Live Orders Map
            </h3>

            <CountBadge>
              {Object.keys(liveRiders).length} Live Riders
            </CountBadge>

          </SectionTitle>

          <div
            style={{
              borderRadius:"18px",
              overflow:"hidden",
              border:"1px solid #e5e7eb"
            }}
          >

            <MapContainer
  center={[
    7.9465,
    -1.0232
  ]}
  zoom={7}
  minZoom={6}
  style={{
    height:"420px",
    width:"100%"
  }}
>

              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {
                Object.values(liveRiders).map((rider)=>(

                  <Marker
                    key={rider.riderId}
                    position={[
                      rider.lat,
                      rider.lng
                    ]}
                    icon={riderIcon}
                  >

                    <Popup>
                      Live Rider Location
                    </Popup>

                  </Marker>
                ))
              }

            </MapContainer>

          </div>

        </MapBox>

        {
  riderStatusModal && selectedRider && (

    <ModalOverlay>

      <ModalCard>

        <ModalTitle>
          Manage Rider Status
        </ModalTitle>

        <ModalText>
          Update account status for{" "}
          <strong>
            {selectedRider.name}
          </strong>
          . The reason will be sent automatically to the rider notification inbox.
        </ModalText>

        <StatusOptionGrid>

          <StatusOption
            type="button"
           $active={selectedRiderStatus === "active"}
            onClick={()=>
              setSelectedRiderStatus("active")
            }
          >

            <StatusOptionIcon>
              ✅
            </StatusOptionIcon>

            <StatusOptionTitle>
              Active Rider
            </StatusOptionTitle>

            <StatusOptionText>
              Rider can receive and manage delivery orders.
            </StatusOptionText>

          </StatusOption>

          <StatusOption
            type="button"
           $active={selectedRiderStatus === "temporary_suspended"}
            onClick={()=>
              setSelectedRiderStatus("temporary_suspended")
            }
          >

            <StatusOptionIcon>
              ⏳
            </StatusOptionIcon>

            <StatusOptionTitle>
              Temporary Suspension
            </StatusOptionTitle>

            <StatusOptionText>
              Rider can login but cannot see or accept orders.
            </StatusOptionText>

          </StatusOption>

          <StatusOption
            type="button"
            $active={selectedRiderStatus === "permanent_suspension"}
            onClick={()=>
              setSelectedRiderStatus("permanent_suspension")
            }
          >

            <StatusOptionIcon>
              ⛔
            </StatusOptionIcon>

            <StatusOptionTitle>
              Permanent Suspension
            </StatusOptionTitle>

            <StatusOptionText>
              Rider can login but is blocked from delivery orders.
            </StatusOptionText>

          </StatusOption>

          <StatusOption
            type="button"
           $active={selectedRiderStatus === "reinstated"}
            onClick={()=>
              setSelectedRiderStatus("reinstated")
            }
          >

            <StatusOptionIcon>
              🔄
            </StatusOptionIcon>

            <StatusOptionTitle>
              Reinstated
            </StatusOptionTitle>

            <StatusOptionText>
              Rider is restored after suspension.
            </StatusOptionText>

          </StatusOption>

        </StatusOptionGrid>

        <ReasonBox
          placeholder="Write the reason. Example: Temporary suspension for repeated cancelled deliveries without valid explanation."
          value={riderStatusReason}
          onChange={(e)=>
            setRiderStatusReason(
              e.target.value
            )
          }
        />

        <ModalActions>

          <CancelButton
  type="button"
  onClick={()=>{
    setRiderStatusModal(false);
    setSelectedRider(null);
    setSelectedRiderStatus("temporary_suspended");
    setRiderStatusReason("");
  }}
>
  Cancel
</CancelButton>

          <SaveStatusButton
            type="button"
            onClick={updateRiderAccountStatus}
          >
            Send Notification
          </SaveStatusButton>

        </ModalActions>

      </ModalCard>

    </ModalOverlay>
  )
}

      </Wrapper>

    </Page>
  );
}