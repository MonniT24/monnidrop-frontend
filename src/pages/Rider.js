import React,{useState,useEffect} from "react";

import styled from "styled-components";

import API from "../api/api";
import socket from "../socket";
import riderImage from "../assets/rider.png";
import logo from "../assets/logo.png";
import GoogleLiveMap from "../components/GoogleLiveMap";

import {
  FiHome,
  FiTruck,
  FiPackage,
  FiMap,
  FiSettings,
  FiCheckCircle,
  FiDollarSign,
  FiBell,
  FiUser,
  FiLogOut
} from "react-icons/fi";


const Page = styled.div`
  min-height:100vh;
  background:#eef2ff;
`;

const Header = styled.div`
  background:linear-gradient(
    90deg,
    #111827,
    #facc15
  );

  padding:15px 20px;

  display:flex;
  align-items:center;

  color:white;
`;

const Logo = styled.img`
  width:55px;
  height:55px;
  object-fit:contain;
  background:white;
  border-radius:12px;
  padding:5px;
  margin-right:12px;
`;

const HeaderText = styled.div`
  display:flex;
  flex-direction:column;
`;

const Title = styled.h2`
  font-size:22px;
  font-weight:800;
`;

const Welcome = styled.div`
  font-size:13px;
  margin-top:2px;
`;
const RiderStatus = styled.span`
 display:inline-flex;
align-items:center;
justify-content:center;
margin-left:0;
margin-top:4px;
padding:7px 16px;
  border-radius:999px;
  font-size:11px;

  font-weight:700;

  color:white;

  animation:blink 1s infinite;

  background:${props=>{

    if(props.status === "busy"){
      return "#dc2626";
    }

    if(props.status === "offline"){
      return "#f59e0b";
    }

    return "#16a34a";
  }};

  @keyframes blink{

    0%{
      opacity:1;
    }

    50%{
      opacity:0.5;
    }

    100%{
      opacity:1;
    }
  }
`;

  const Hero = styled.div`
  display:flex;

  justify-content:space-between;

  align-items:flex-start;

  margin-bottom:28px;

  gap:20px;

  flex-wrap:wrap;
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

  @media(max-width:768px){
    padding:18px 16px;
    border-radius:22px;
  }

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
`;

const DashboardHeroContent = styled.div`
  position:relative;
  z-index:2;

  display:grid;
  grid-template-columns:minmax(0, 1fr) 350px;
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
  padding-left:2px;
`;

const HeroLogo = styled.img`
  width:85px;
  height:85px;
  object-fit:contain;

  background:white;
  padding:5px;
  border-radius:50%;

  box-shadow:
    0 8px 18px rgba(15,23,42,0.20);

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
    width:48px;
    height:48px;
    padding:4px;
  }

  @media(max-width:480px){
    width:42px;
    height:42px;
  }
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
  font-weight:800;

  margin-bottom:14px;
`;

const DashboardHeroTitle = styled.h1`
  font-size:26px;
  font-weight:900;
  margin:0 0 6px;
  letter-spacing:-0.4px;
  line-height:1.12;

  @media(max-width:768px){
    font-size:24px;
  }

  @media(max-width:480px){
    font-size:22px;
    line-height:1.18;
  }
`;

const DashboardHeroText = styled.p`
  max-width:560px;
  color:#dbeafe;
  font-size:13px;
  line-height:1.45;
  margin:0;

  @media(max-width:768px){
    font-size:12.5px;
  }
`;

const DashboardDateCard = styled.div`
  width:100%;
  max-width:350px;

  padding:14px 18px;
  border-radius:22px;

  background:
    linear-gradient(
      135deg,
      rgba(255,255,255,0.25),
      rgba(255,255,255,0.08)
    );

  border:1px solid rgba(255,255,255,0.34);

  color:white;

  box-shadow:
    0 14px 30px rgba(0,0,0,0.18),
    inset 0 1px 0 rgba(255,255,255,0.28);

  backdrop-filter:blur(14px);

  div{
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
  }

  strong{
    display:block;

    font-size:25px;
    font-weight:900;
    line-height:1.05;

    color:white;

    margin-bottom:10px;

    text-shadow:
      0 8px 20px rgba(0,0,0,0.24);
  }

  span{
    display:block;

    font-size:12px;
    font-weight:700;

    color:rgba(255,255,255,0.88);
  }

  @media(max-width:900px){
    max-width:100%;
  }

  @media(max-width:768px){
    padding:16px;
    border-radius:20px;

    strong{
      font-size:24px;
    }
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

  @media(max-width:768px){
    font-size:15px;
    padding:8px 12px;
  }
`;


const HeroText = styled.p`
  color:#64748b;

  font-size:15px;

  line-height:1.6;

  max-width:520px;
`;

const DateCard = styled.div`
  background:white;

  border:1px solid #e5e7eb;

  border-radius:18px;

  padding:16px 22px;

  display:flex;

  align-items:center;

  gap:12px;

  font-size:18px;

  color:#475569;

  min-width:180px;

  justify-content:center;

  box-shadow:
    0 4px 12px rgba(0,0,0,0.04);
`;

const StatsGrid = styled.div`
  display:grid;

  grid-template-columns:
    repeat(3,1fr);

  gap:12px;

  margin-bottom:20px;

  @media(max-width:760px){
    grid-template-columns:1fr;
  }
`;


const StatCard = styled.div`
  background:white;

  border-radius:28px;

  padding:28px;

  border:1px solid #eef2f7;

  display:flex;

  align-items:center;

  gap:20px;

  min-height:160px;

  box-shadow:
    0 8px 24px rgba(15,23,42,0.04);
`;

const StatIcon = styled.div`
  width:80px;

  height:80px;

  border-radius:50%;

  display:flex;

  align-items:center;

  justify-content:center;

  font-size:36px;

  background:${props =>
    props.bg || "#dbeafe"};

  color:${props =>
    props.color || "#2563eb"};
`;


const StatTitle = styled.div`
  color:#64748b;

  font-size:13px;

  font-weight:500;

  margin-bottom:8px;

  text-transform:uppercase;

  letter-spacing:0.5px;
`;

const StatValue = styled.div`
  font-size:40px;

  font-weight:800;

  color:#0f172a;

  margin-top:12px;
`;

const LogoutButton = styled.button`
  width:100%;

  border:none;
  border-radius:14px;

  padding:11px 13px;

  background:#fee2e2;

  color:#b91c1c;

  font-size:13px;
  font-weight:900;

  cursor:pointer;

  margin-top:10px;

  transition:0.25s ease;

  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;

  &:hover{
    background:#ef4444;
    color:white;
  }
`;


const Wrapper = styled.div`
  max-width:1280px;

  margin:auto;

  padding:20px;
`;

const Layout = styled.div`
  display:flex;

  min-height:100vh;

  background:#f5f7fb;
`;

const Sidebar = styled.div`
  width:210px;
  box-sizing:border-box;

  background:#ffffff;

  padding:18px 14px;

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

const MobileMenuButton = styled.button`
  display:none;

  @media(max-width:760px){

    display:flex;

    align-items:center;

    justify-content:center;

    position:fixed;

    top:17px;

    left:17px;

    width:50px;

    height:50px;

    border:none;

    border-radius:14px;

    background:#2563eb;

    color:white;

    font-size:26px;

    cursor:pointer;

    z-index:1001;

    box-shadow:
      0 6px 18px rgba(37,99,235,0.3);
  }
`;

const CloseButton = styled.button`
  display:none;

  border:none;

  background:#dc2626;

  color:white;

  width:30px;

  height:30px;

  border-radius:10px;

  font-size:20px;

  cursor:pointer;

  margin-bottom:30px;

  align-self:flex-end;

  transition:0.3s ease;

  &:hover{
    background:#b91c1c;

    transform:scale(1.05);
  }

  @media(max-width:768px){
    display:flex;

    align-items:center;

    justify-content:center;
  }
`;


const Main = styled.div`
  flex:1;

  margin-left:210px;

  padding:32px;

  min-height:100vh;

  background:#f5f7fb;

  overflow-x:hidden;

  @media(max-width:760px){

  margin-left:0;

  padding:82px 14px 20px;
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
  width:76px;
  height:76px;

  border-radius:50%;
  object-fit:cover;

  margin:auto;
  margin-bottom:8px;

  border:3px solid #facc15;

  box-shadow:
    0 6px 16px rgba(250,204,21,0.20);
`;

const SidebarMenu = styled.div`
  display:flex;
  flex-direction:column;
  gap:8px;

  margin-top:10px;

  @media(max-width:760px){
    flex-direction:column;
    flex-wrap:nowrap;
  }
`;

const MenuItem = styled.div`
  display:flex;
  align-items:center;
  gap:11px;

  padding:11px 13px;

  border-radius:14px;

  font-size:13px;
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
      ? "0 8px 18px rgba(250,204,21,0.22)"
      : "0 4px 12px rgba(15,23,42,0.03)"};

  transition:0.25s ease;

  svg{
    font-size:17px;
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


const StatusBox = styled.div`
  margin-bottom:15px;

  padding:12px 16px;

  border-radius:14px;

  color:white;

  font-weight:600;

  text-align:center;

  font-size:14px;

  background:${props=>

    props.busy
    ? "#dc2626"
    : "#16a34a"
  };

  box-shadow:
    0 4px 10px rgba(0,0,0,0.08);
`;

const OrderCard = styled.div`
  background:white;

  border-radius:30px;

  padding:28px;

  border:1px solid #eef2f7;

  box-shadow:
    0 8px 30px rgba(15,23,42,0.05);

  transition:0.25s ease;

  &:hover{

    transform:translateY(-4px);
  }
`;

const Row = styled.div`
  margin-bottom:8px;

  font-size:15px;

  color:#374151;

  line-height:1.5;
`;


const StatusBadge = styled.div`
  display:inline-flex;

  align-items:center;

  gap:8px;

  padding:12px 18px;

  border-radius:999px;

  font-size:16px;

  font-weight:700;

  margin-top:18px;

  background:#dcfce7;

  color:#16a34a;
`;

const ButtonRow = styled.div`
  display:flex;

  gap:10px;

  margin-top:10px;

  flex-wrap:wrap;
`;

 const Button = styled.button`
  width:100%;

  border:none;

  border-radius:12px;

  padding:10px 14px;

  background:#2563eb;

  color:white;

  font-size:12px;

  font-weight:500;

  cursor:pointer;

  transition:0.25s ease;

  display:flex;

  align-items:center;

  justify-content:center;

  gap:8px;

  &:hover{

    background:#1d4ed8;
  }
`;

const Empty = styled.div`
  background:white;

  padding:28px;

  border-radius:18px;

  text-align:center;

  color:#64748b;

  font-size:15px;

  box-shadow:
    0 4px 12px rgba(0,0,0,0.05);
`;


const OrdersGrid = styled.div`
  display:grid;

  grid-template-columns:
    repeat(auto-fit,minmax(300px,1fr));

  gap:18px;

  align-items:start;

  @media(max-width:520px){
    grid-template-columns:1fr;
    gap:12px;
  }
`;

const ResponsiveTwoColumn = styled.div`
  display:grid;
  grid-template-columns:1.3fr 0.8fr;
  gap:22px;
  align-items:start;
  margin-bottom:28px;

  @media(max-width:900px){
    grid-template-columns:1fr;
    gap:16px;
  }
`;

const ProfileResponsiveGrid = styled.div`
  display:grid;
  grid-template-columns:0.8fr 1.2fr;
  gap:22px;
  align-items:start;

  @media(max-width:900px){
    grid-template-columns:1fr;
    gap:16px;
  }
`;

const CompactInfoGrid = styled.div`
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(230px,1fr));
  gap:12px;

  @media(max-width:520px){
    grid-template-columns:1fr;
  }
`;

const MessageRow = styled.div`
  display:grid;
  grid-template-columns:44px 1fr auto;
  gap:12px;
  align-items:center;
  background:#f8fafc;
  border:1px solid #e5e7eb;
  border-radius:16px;
  padding:12px;

  @media(max-width:620px){
    grid-template-columns:40px 1fr;
  }
`;

const MessageTime = styled.div`
  text-align:right;
  color:#64748b;
  font-size:12px;
  font-weight:900;
  white-space:nowrap;

  @media(max-width:620px){
    grid-column:2;
    text-align:left;
  }
`;

const HistoryRow = styled.div`
  display:grid;
  grid-template-columns:1.2fr 1.2fr 0.6fr;
  gap:10px;
  align-items:center;
  background:#f8fafc;
  border:1px solid #e5e7eb;
  border-radius:16px;
  padding:12px;

  @media(max-width:720px){
    grid-template-columns:1fr;
  }
`;

const DetailList = styled.div`
  display:grid;
  gap:12px;

  ${Row}{
    background:#f8fafc;
    border:1px solid #e5e7eb;
    border-radius:14px;
    padding:14px;
    font-weight:700;
  }
`;

const MobileStackGrid = styled.div`
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:8px;
  margin-top:8px;

  @media(max-width:480px){
    grid-template-columns:1fr;
  }
`;

export default function Rider(){

  const [activeSection, setActiveSection] = useState("dashboard");

  const [activeRiderCard,setActiveRiderCard] =
  useState("");

const [messageText,setMessageText] =
  useState({});  

const [riderPage,setRiderPage] =
  useState("home");  

  const [
  selectedProfileImage,
  setSelectedProfileImage
] = useState("");

  const [profileImage, setProfileImage] =
  useState(riderImage);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [currentTime, setCurrentTime] =
  useState(new Date());


 const [user, setUser] =
  useState(null);

  const [riderDOB,setRiderDOB] =
  useState("");

const [riderEmergency,setRiderEmergency] =
  useState("");

const [motorNumber,setMotorNumber] =
  useState("");

  const [motorColor,setMotorColor] =
  useState("");

  const [motorName,setMotorName] =
  useState("");

const [riderIdType,setRiderIdType] =
  useState("");

const [riderIdNumber,setRiderIdNumber] =
  useState("");

const [riderProfileEditing,setRiderProfileEditing] =
  useState(false);

const [orders, setOrders] =
  useState([]);

  const riderProfileCompleted =
  Boolean(
    user?.dob &&
    user?.emergencyContact &&
    user?.motorNumber &&
    user?.idType &&
    user?.idNumber &&
    user?.profileImage
  );

const riderIsBlocked =
  user?.status === "suspended" ||
  user?.riderAccountStatus === "temporary_suspended" ||
  user?.riderAccountStatus === "permanent_suspended";

const riderBlockedTitle =
  user?.riderAccountStatus === "permanent_suspended"
  ? "⛔ Permanently Suspended"
  : "⏳ Temporarily Suspended";

const riderBlockedMessage =
  "You can login to your account, but you cannot view, accept, or manage delivery orders right now.";

const visibleOrders =
  riderIsBlocked
  ? []
  : orders.filter(

      (o)=>

        o.status === "pending"

        ||

        o.rider?._id ===
        user?._id

        ||

        o.rider ===
        user?._id
    );

  const pendingRequestOrders =
  visibleOrders.filter(
    (o)=>o.status === "pending"
  );

  const [
  riderAvailability,
  setRiderAvailability
] = useState("online");

const [activeOrders,
  setActiveOrders] =
    useState([]);

const [completedOrders,
  setCompletedOrders] =
    useState([]);

const [earnings,
  setEarnings] =
    useState(0);

const [chatText,
  setChatText] =
    useState({});

const [openChats,
  setOpenChats] =
    useState({});

    const [deliveryCodes,
  setDeliveryCodes] =
    useState({});

const [completingOrderId,
  setCompletingOrderId] =
    useState(null);

const [deliveryPhotos,
  setDeliveryPhotos] =
    useState({});    

    const [notifications,
  setNotifications] =
    useState([]);

    const [messageInbox,
  setMessageInbox] =
    useState([]);

const [previousOrders,
  setPreviousOrders] =
    useState([]);

const [previousMessages,
  setPreviousMessages] =
    useState({});

    const getGreeting = () => {

      const getRiderDisplayStatus = () => {

  if(riderIsBlocked){

    return "suspended";
  }

  if(
    activeOrders.length > 0
  ){

    return "busy";
  }

  return user?.status || "available";
};

function getRiderCardTitle(){

  if(activeRiderCard === "pending"){
    return "Pending Requests";
  }

  if(activeRiderCard === "active"){
    return "Active Jobs";
  }

  if(activeRiderCard === "completed"){
    return "Completed Tasks";
  }

  return "";
}

function getRiderCardOrders(){

  if(activeRiderCard === "pending"){
    return pendingRequestOrders;
  }

  if(activeRiderCard === "active"){
    return activeOrders;
  }

  if(activeRiderCard === "completed"){
    return completedOrders;
  }

  return [];
}

const riderCardOrders =
  getRiderCardOrders();

  const hour =
    new Date().getHours();

  if(hour < 12){

    return "Good morning";

  }

  if(hour < 18){

    return "Good afternoon";

  }

  return "Good evening";

};

const getRiderDisplayStatus = () => {

  if(
    activeOrders.length > 0
  ){

    return "busy";
  }

  return user?.status || "available";
};

useEffect(()=>{

  fetchMe();

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

  if(!user?._id){
    return;
  }

  fetchOrders();

  const interval =
    setInterval(()=>{

      fetchOrders();

    },3000);

  return ()=>clearInterval(
    interval
  );

},[user]);
 
  useEffect(() => {

  socket.on(
    "connect",
    () => {

      console.log(
        "Socket connected:",
        socket.id
      );
    }
  );

  return () => {

    socket.off(
      "connect"
    );
  };

}, []);

useEffect(() => {

  if(user?._id){

    console.log(
      "Joining rider room:",
      user._id
    );

    socket.emit(
      "joinUserRoom",
      user._id
    );
  }

}, [user]);

useEffect(()=>{

  const riderId =
    user?._id ||
    user?.id;

  if(!riderId){
    return;
  }

  socket.emit(
    "userOnline",
    {
      userId:riderId,
      name:user?.name || "Rider",
      phone:user?.phone || "N/A",
      role:"rider"
    }
  );

},[user]);

useEffect(() => {

  socket.on(
    "orderUpdated",
    () => {

      fetchOrders();
    }
  );

  return () => {

    socket.off(
      "orderUpdated"
    );
  };

}, []);

useEffect(() => {

  function handleNewOrderAlert(order){

    playNotification();

    alert(
      `🚨 NEW DELIVERY REQUEST

Pickup:
${order.pickupLocation}

Dropoff:
${order.dropoffLocation}

Amount:
₵${order.total}`
    );

    fetchOrders();
  }

  socket.on(
    "newOrderAlert",
    handleNewOrderAlert
  );

  return () => {

    socket.off(
      "newOrderAlert",
      handleNewOrderAlert
    );
  };

}, []);

useEffect(()=>{

  socket.on(
    "newNotification",
    (note)=>{

      setNotifications(
        (prev)=>[
          {
            text:
              note.message || "New notification",

            title:
              note.title || "MB Swift Notice",

            sender:
              "MB Swift Admin",

            time:
              note.createdAt
              ? new Date(note.createdAt)
                .toLocaleString()
              : new Date()
                .toLocaleString()
          },
          ...prev
        ]
      );

      setUser(
        (prev)=>{

          if(!prev){
            return prev;
          }

          return {
            ...prev,
            notifications:[
              note,
              ...(prev.notifications || [])
            ]
          };
        }
      );

      playNotification();

      fetchMe();

      fetchOrders();
    }
  );

  return ()=>{

    socket.off(
      "newNotification"
    );
  };

},[]);

useEffect(()=>{

  if(!user?._id){
    return;
  }

  if(!navigator.geolocation){

    console.log(
      "Geolocation is not supported"
    );

    return;
  }

  const watchId =
    navigator.geolocation.watchPosition(

      (position)=>{

        const locationData = {

          lat:
            position.coords.latitude,

          lng:
            position.coords.longitude,

          riderId:
            user._id
        };

        console.log(
          "SENDING RIDER LOCATION:",
          locationData
        );

        console.log(
  "EMITTING RIDER LOCATION:",
  locationData
);

        socket.emit(
          "riderLocation",
          locationData
        );
      },

      (error)=>{

        console.log(
          "RIDER LOCATION ERROR:",
          error.message
        );
      },

      {
        enableHighAccuracy:true,
        maximumAge:0,
        timeout:10000
      }
    );

  return ()=>{

    navigator.geolocation.clearWatch(
      watchId
    );
  };

},[user]);

useEffect(()=>{

  if(user){

    setRiderDOB(
      user.dob || ""
    );

    setRiderEmergency(
      user.emergencyContact || ""
    );

    setMotorNumber(
  user.motorNumber || ""
);

setMotorName(
  user.motorName || ""
);

setMotorColor(
  user.motorColor || ""
);

setRiderIdType(
  user.idType || ""
);

setRiderIdNumber(
  user.idNumber || ""
);
   }

},[user]);
  

  //SOUND

  function playNotification(){

    try{

      const audio =
        new Audio(
          "/notification.mp3"
        );

      audio.volume = 3;

      const playPromise =
        audio.play();

      if(playPromise){

        playPromise.catch(()=>{

          console.log(
            "Audio blocked until user interacts"
          );
        });
      }

    }catch(err){

      console.log(err);
    }
  }

  

  async function fetchMe(){

  try{

    const res =
      await API.get(
        "/rider/me"
      );

    const loggedUser =
      res.data.user ||
      res.data;

    setUser(
      loggedUser
    );

    setSelectedProfileImage(
      loggedUser.profileImage || ""
    );

    setProfileImage(
      loggedUser.profileImage || riderImage
    );

    console.log(
      "LOADED RIDER IMAGE:",
      loggedUser.profileImage
    );

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

      const data =
        res.data;

      

      if(
        previousOrders.length > 0
      ){

        const newOrders =
          data.filter(

            (o)=>

              o.status ===
              "pending"

              &&

              !previousOrders.some(

                (p)=>
                  p._id === o._id
              )
          );

        if(
          newOrders.length > 0
        ){

          playNotification();
        }
      }


      const counts = {};

      data.forEach((order)=>{

        counts[
          order._id
        ] =
          order.messages?.length || 0;
      });

      setPreviousMessages(
        counts
      );

      setPreviousOrders(
        data
      );

      setOrders(
        data
      );

      const inboxMessages =
  data.flatMap((order)=>

    (order.messages || [])
      .filter((msg)=>
        msg.sender === "customer"
      )
      .map((msg)=>({

        orderId:
          order._id,

        sender:
          msg.sender,

        text:
          msg.text,

        time:
          msg.createdAt
          ? new Date(msg.createdAt)
            .toLocaleTimeString()
          : "New message"
      }))
  );

setMessageInbox(
  inboxMessages.reverse()
);


const active =
  data.filter((o)=>{

    const riderId =
      o.rider?._id ||
      o.rider ||
      o.riderId;

    return (
      String(riderId) === String(user?._id)
      &&
      o.status !== "delivered"
      &&
      o.status !== "pending"
    );

  });

setActiveOrders(
  active
);

const delivered =
  data.filter((o)=>{

    const riderId =
      o.rider?._id ||
      o.rider ||
      o.riderId;

    return (
      String(riderId) === String(user?._id)
      &&
      o.status === "delivered"
    );

  });

setCompletedOrders(
  delivered
);


const totalEarned =
  delivered.reduce(

    (sum,o)=>

      sum + Number(o.total || 0),

    0
  );

setEarnings(
  totalEarned
);

    }catch(err){

      console.log(err);
    }
  }

  async function updateAvailability(status){

  try{

    if(riderIsBlocked){

      alert(
        riderBlockedMessage
      );

      return;
    }

    const res =
      await API.put(
        "/rider/status",
        {
          status
        }
      );

    setUser(
      res.data.user || {
        ...user,
        status
      }
    );

    alert(
      status === "offline"
      ? "You are now offline"
      : "You are now online"
    );

    fetchMe();

    fetchOrders();

  }catch(err){

    console.log(
      "UPDATE RIDER AVAILABILITY ERROR:",
      err.response?.data || err.message
    );

    alert(
      JSON.stringify(
        err.response?.data || err.message
      )
    );
  }

}

 // ACCEPT ORDER

async function acceptOrder(orderId){

  try{

    if(riderIsBlocked){

  alert(
    riderBlockedMessage
  );

  return;
}

    if(!user){

      alert("Rider not loaded");

      return;
    }

    if(activeOrders.length > 0){

      if(
  !user.dob ||
  !user.emergencyContact ||
  !user.motorNumber ||
  !user.idType ||
  !user.idNumber ||
  !user.profileImage
){

  alert(
    "Please complete your rider profile before accepting deliveries."
  );

  setActiveSection(
    "profile"
  );

  return;
}

      alert(
        "You already have an active delivery. Complete it before accepting another order."
      );

      return;
    }

    const alreadyBusy =
      orders.some((order)=>{

        const riderId =
          order.rider?._id ||
          order.rider ||
          order.riderId;

        return (
          String(riderId) === String(user._id)
          &&
          order.status !== "delivered"
          &&
          order.status !== "cancelled"
          &&
          order.status !== "pending"
        );
      });

    if(alreadyBusy){

      alert(
        "You already have an active delivery. Complete it before accepting another order."
      );

      return;
    }

   const acceptedOrder =
  orders.find(
    (order)=>order._id === orderId
  );

setOrders(
  orders.map((order)=>
    order._id === orderId
    ? {
        ...order,
        rider:user._id,
        riderId:user._id,
        status:"accepted"
      }
    : order
  )
);

if(acceptedOrder){

  setActiveOrders([
    ...activeOrders,
    {
      ...acceptedOrder,
      rider:user._id,
      riderId:user._id,
      status:"accepted"
    }
  ]);
}

setUser({
  ...user,
  status:"busy"
});

await API.put(
  `/orders/${orderId}`,
  {
    rider:user._id,
    riderId:user._id,
    status:"accepted"
  }
);

fetchOrders();

  }catch(err){

    console.log(err);

    alert("Accept failed");
  }
}

async function sendMessage(
  orderId
){

  try{

    const text =
      messageText[orderId];

    if(
      !text ||
      !text.trim()
    ){
      return;
    }

    await API.post(
      `/orders/${orderId}/message`,
      {
        text
      }
    );

    setMessageText({
      ...messageText,
      [orderId]:""
    });

    fetchOrders();

  }catch(error){

    console.log(
      "SEND MESSAGE ERROR:",
      error
    );
  }
}

  //REJECT

 async function rejectOrder(orderId){

  try{

    if(riderIsBlocked){

  alert(
    riderBlockedMessage
  );

  return;
}

    await API.put(

      `/orders/${orderId}`,

      {
        status:"cancelled"
      }
    );

    alert(
      "Order cancelled successfully"
    );

    setTimeout(()=>{

  fetchOrders();

},800);

  }catch(err){

    console.log(err);

   alert(
  JSON.stringify(
    err.response?.data || err.message
  )
);
  }
}

  //PICKUP

  async function pickupOrder(
    orderId
  ){

    try{

      if(riderIsBlocked){

  alert(
    riderBlockedMessage
  );

  return;
}

      await API.put(

        `/orders/${orderId}`,

        {
          status:"picked"
        }
      );

      setTimeout(()=>{

  fetchOrders();

},800);

    }catch(err){

      console.log(err);

      alert(
        "Pickup failed"
      );
    }
  }

  //START DELIVERY 

  async function startDelivery(
    orderId
  ){

    try{

      if(riderIsBlocked){

  alert(
    riderBlockedMessage
  );

  return;
}

      await API.put(

        `/orders/${orderId}`,

        {
          status:"delivering"
        }
      );

      setTimeout(()=>{

  fetchOrders();

},800);

    }catch(err){

      console.log(err);

      alert(
        "Start delivery failed"
      );
    }
  }

   // COMPLETE DELIVERY WITH CUSTOMER CODE

  async function completeDelivery(
    orderId
  ){

    try{

      if(riderIsBlocked){

  alert(
    riderBlockedMessage
  );

  return;
}

      const deliveryCode =
        deliveryCodes[orderId];

      if(
        !deliveryCode ||
        deliveryCode.length !== 4
      ){

        alert(
          "Please enter the 4-digit customer delivery code"
        );

        return;
      }

      setCompletingOrderId(
        orderId
      );

     const deliveryPhoto =
  deliveryPhotos[orderId];

if(!deliveryPhoto){

  alert(
    "Please take or upload a delivery proof photo"
  );

  setCompletingOrderId(null);

  return;
}

const position =
  await new Promise((resolve,reject)=>{

    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
      {
        enableHighAccuracy:true,
        timeout:15000,
        maximumAge:0
      }
    );
  });

const formData =
  new FormData();

formData.append(
  "deliveryCode",
  deliveryCode
);

formData.append(
  "deliveryLatitude",
  position.coords.latitude
);

formData.append(
  "deliveryLongitude",
  position.coords.longitude
);

formData.append(
  "deliveryPhoto",
  deliveryPhoto
);

const res =
  await API.put(
    `/orders/${orderId}/complete-delivery`,
    formData,
    {
      headers:{
        "Content-Type":"multipart/form-data"
      }
    }
  );

      alert(
        res.data.message ||
        "Delivery completed successfully"
      );

      setDeliveryCodes({
        ...deliveryCodes,
        [orderId]:""
      });

      fetchOrders();

    }catch(err){

      console.log(err);

      alert(
  JSON.stringify(
    err.response?.data || err.message
  )
);

    }finally{

      setCompletingOrderId(
        null
      );
    }
  }

  //LOGOUT 

  function logout(){

    localStorage.clear();

    window.location.href =
      "/login";
  }

  

  return(

    <Layout>

  <Sidebar open={sidebarOpen}>

    <CloseButton
  onClick={() =>
    setSidebarOpen(false)
  }
>
  ✕
</CloseButton>

    <ProfileCard>

     <ProfileImage
  src={
    user?.profileImage ||
    selectedProfileImage ||
    riderImage
  }
  alt="Rider"
/>

<label
  htmlFor="riderProfileUpload"
  style={{
  display:"inline-flex",
  alignItems:"center",
  justifyContent:"center",
  padding:"9px 16px",
  borderRadius:"14px",
  background:"#facc15",
  color:"#0f172a",
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
  id="riderProfileUpload"
  type="file"
  accept="image/*"
  style={{
    display:"none"
  }}
  onChange={async(e)=>{

    try{

      const file =
        e.target.files[0];

      if(!file){

        return;
      }

      if(file.size > 5 * 1024 * 1024){

        alert(
          "Image is too large. Please choose an image below 5MB."
        );

        return;
      }

      const formData =
        new FormData();

      formData.append(
        "profileImage",
        file
      );

      const res =
        await API.put(
          "/rider/profile-image",
          formData
        );

      setUser(
        res.data.user
      );

      setSelectedProfileImage(
        res.data.user.profileImage || ""
      );

      setProfileImage(
        res.data.user.profileImage || riderImage
      );

      alert(
        "Rider profile picture saved successfully"
      );

      e.target.value =
        "";

    }catch(err){

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Rider profile picture upload failed"
      );
    }
  }}
/>

 <div
  style={{
    marginTop:"8px",
    marginBottom:"16px"
  }}
></div>

<div
  style={{
    marginTop:"14px"
  }}
>

</div>

<h3
  style={{
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  gap:"8px",
  margin:"6px 0 6px",
  fontSize:"15px",
  fontWeight:"900",
  color:"#0f172a"
}}
>
  <FiUser />

  {
    user?.name ||
    "Rider"
  }
</h3>

      <RiderStatus
  status={getRiderDisplayStatus()}
>

       {
  getRiderDisplayStatus() === "busy"
  ? "BUSY"
  : getRiderDisplayStatus() === "offline"
  ? "OFF-DUTY"
  : getRiderDisplayStatus() === "suspended"
  ? "SUSPENDED"
  : "AVAILABLE"
}

      </RiderStatus>

    </ProfileCard>

    <SidebarMenu>

      <MenuItem
  active={activeSection === "dashboard"}
  onClick={() => setActiveSection("dashboard")}
>
  <FiHome />
  Dashboard
</MenuItem>

<MenuItem
  active={activeSection === "activeDeliveries"}
  onClick={() => setActiveSection("activeDeliveries")}
>
  <FiTruck />
  Active Deliveries
</MenuItem>

<MenuItem
  active={activeSection === "earnings"}
  onClick={() => setActiveSection("earnings")}
>
  <FiPackage />
  Earnings
</MenuItem>

<MenuItem
  active={activeSection === "messages"}
  onClick={() => setActiveSection("messages")}
>
  <FiBell />
  Messages
</MenuItem>

<MenuItem
  active={activeSection === "notifications"}
  onClick={() => setActiveSection("notifications")}
>
  <FiBell />
  Notifications
</MenuItem>

<MenuItem
  active={activeSection === "profile"}
  onClick={() => setActiveSection("profile")}
>
  <FiUser />
  Profile
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

<div
  style={{
    marginTop:"20px",
    textAlign:"center",
    fontSize:"12px",
    color:"#94a3b8"
  }}
>
  MB Swift v1.0.0
</div>


    </SidebarMenu>

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
{
  riderIsBlocked && (

    <OrderCard
      style={{
        border:"1px solid #fecaca",
        borderLeft:"6px solid #dc2626",
        background:
          "linear-gradient(135deg, #fff1f2, #ffffff)",
        marginBottom:"18px"
      }}
    >

      <h3
        style={{
          marginTop:0,
          marginBottom:"10px",
          color:"#991b1b",
          fontSize:"22px",
          fontWeight:"900"
        }}
      >
        {riderBlockedTitle}
      </h3>

      <Row>
        {riderBlockedMessage}
      </Row>

      <Row>
        <strong>Reason:</strong>{" "}
        {user?.riderStatusReason || "No reason provided by admin."}
      </Row>

      <StatusBadge
        style={{
          background:"#fee2e2",
          color:"#b91c1c"
        }}
      >
        Orders Hidden
      </StatusBadge>

    </OrderCard>
  )
}

    <DashboardHero>

<DashboardHeroContent>

  <HeroLeftBlock>

    <HeroLogo
      src={logo}
      alt="MB Swift Logo"
    />

    <HeroTextBlock>

        <HeroBadge>
          ⚡ MB Swift Rider Dashboard
        </HeroBadge>

        <DashboardHeroTitle>
          Welcome / Akwaaba,
          {" "}
          {
            user?.name || "Rider"
          }
          👋
        </DashboardHeroTitle>

                <DashboardHeroText>
          View assigned deliveries, update package status,
          track earnings, and manage your rider activity from one clean dashboard.
        </DashboardHeroText>

    </HeroTextBlock>

  </HeroLeftBlock>

      <DashboardDateCard>

  <div>
    Today
  </div>

  <strong>
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

  </strong>

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

  <span>
    Ready for your next delivery.
  </span>

</DashboardDateCard>

    </DashboardHeroContent>

  </DashboardHero>

 {riderPage === "home" && (

<StatsGrid style={{gap:"12px"}}>

  <div
    onClick={()=>setRiderPage("activeDeliveries")}
    style={{
      cursor:"pointer",
      background:"linear-gradient(135deg, #0f172a, #1d4ed8)",
      padding:"12px",
      borderRadius:"16px",
      color:"white",
      minHeight:"120px"
    }}
  >
    <div style={{fontSize:"22px",marginBottom:"8px"}}>🛵</div>
    <div style={{fontSize:"12px",fontWeight:"900"}}>ACTIVE DELIVERIES</div>
    <div style={{fontSize:"24px",fontWeight:"900",color:"#facc15"}}>{activeOrders.length}</div>
    <div style={{fontSize:"12px",fontWeight:"700"}}>Current handling.</div>
  </div>

  <div
    onClick={()=>setRiderPage("completedDeliveries")}
    style={{
      cursor:"pointer",
      background:"linear-gradient(135deg, #facc15, #f59e0b)",
      padding:"12px",
      borderRadius:"16px",
      color:"#0f172a",
      minHeight:"120px"
    }}
  >
    <div style={{fontSize:"22px",marginBottom:"8px"}}>✅</div>
    <div style={{fontSize:"12px",fontWeight:"900"}}>COMPLETED</div>
    <div style={{fontSize:"24px",fontWeight:"900"}}>{completedOrders.length}</div>
    <div style={{fontSize:"12px",fontWeight:"800"}}>Successful deliveries.</div>
  </div>

  <div
    onClick={()=>setRiderPage("earnings")}
    style={{
      cursor:"pointer",
      background:"linear-gradient(135deg, #0f172a, #111827)",
      padding:"12px",
      borderRadius:"16px",
      color:"white",
      minHeight:"120px"
    }}
  >
    <div style={{fontSize:"22px",marginBottom:"8px",color:"#facc15"}}>₵</div>
    <div style={{fontSize:"12px",fontWeight:"900",color:"#facc15"}}>EARNINGS</div>
    <div style={{fontSize:"24px",fontWeight:"900",color:"#facc15"}}>₵{earnings}</div>
    <div style={{fontSize:"12px",fontWeight:"700"}}>Delivered orders.</div>
  </div>

</StatsGrid>

)}

{riderPage !== "home" && (

  <OrderCard
    style={{
      marginBottom:"22px"
    }}
  >

    <button
      type="button"
      onClick={()=>
        setRiderPage("home")
      }
      style={{
        border:"none",
        borderRadius:"12px",
        padding:"10px 14px",
        background:"#f1f5f9",
        color:"#0f172a",
        fontWeight:"900",
        cursor:"pointer",
        marginBottom:"16px"
      }}
    >
      ← Back
    </button>

    <h2
      style={{
        marginTop:0,
        color:"#0f172a",
        fontWeight:"900"
      }}
    >
      {
        riderPage === "activeDeliveries"
        ? "Active Deliveries"
        : riderPage === "completedDeliveries"
        ? "Completed Deliveries"
        : "Total Earnings"
      }
    </h2>

    {
      riderPage === "activeDeliveries" && (
        activeOrders.length === 0
        ? (
          <Empty>
            No active deliveries found.
          </Empty>
        )
        : (
          <DetailList>
           {
  activeOrders.map((o)=>{

    const pickupCoords =
      o.pickupCoords ||
      (
        o.pickupLatitude &&
        o.pickupLongitude
        ? {
            lat:Number(o.pickupLatitude),
            lng:Number(o.pickupLongitude)
          }
        : null
      );

    const dropoffCoords =
      o.dropoffCoords ||
      (
        o.dropoffLatitude &&
        o.dropoffLongitude
        ? {
            lat:Number(o.dropoffLatitude),
            lng:Number(o.dropoffLongitude)
          }
        : null
      );

    return (

      <Row key={o._id}>

        <strong>Pickup:</strong> {o.pickupLocation}
        <br />

        <strong>Dropoff:</strong> {o.dropoffLocation}
        <br />

        <strong>Status:</strong> {o.status}
        <br />

        <strong>Amount:</strong> ₵{o.total || 0}

        <div
          style={{
            marginTop:"14px"
          }}
        >
          <GoogleLiveMap
            pickupCoords={pickupCoords}
            dropoffCoords={dropoffCoords}
            mode={
              o.status === "accepted"
              ? "pickup"
              : "dropoff"
            }
          />
        </div>

      </Row>
    );
  })
}
          </DetailList>
        )
      )
    }

    {
      riderPage === "completedDeliveries" && (
        completedOrders.length === 0
        ? (
          <Empty>
            No completed deliveries found.
          </Empty>
        )
        : (
          <DetailList>
            {
              completedOrders.map((o)=>(
                <Row key={o._id}>
                  <strong>Pickup:</strong> {o.pickupLocation}
                  <br />
                  <strong>Dropoff:</strong> {o.dropoffLocation}
                  <br />
                  <strong>Amount:</strong> ₵{o.total || 0}
                  <br />
                  <strong>Status:</strong> {o.status}
                </Row>
              ))
            }
          </DetailList>
        )
      )
    }

    {
      riderPage === "earnings" && (

        <div
          style={{
            background:"#0f172a",
            color:"#facc15",
            borderRadius:"20px",
            padding:"22px",
            fontSize:"34px",
            fontWeight:"900"
          }}
        >
          ₵{earnings}
        </div>
      )
    }

  </OrderCard>
)}

<ResponsiveTwoColumn>

  <OrderCard
    style={{
      background:
        "linear-gradient(135deg, #ffffff, #f8fafc)",
      border:"1px solid rgba(29,78,216,0.10)",
      boxShadow:
        "0 14px 32px rgba(15,23,42,0.06)"
    }}
  >

    <div
      style={{
        display:"flex",
        alignItems:"center",
        justifyContent:"space-between",
        gap:"12px",
        marginBottom:"18px",
        flexWrap:"wrap"
      }}
    >

      <div>

        <div
          style={{
            fontSize:"21px",
            fontWeight:"900",
            color:"#0f172a",
            marginBottom:"5px"
          }}
        >
          Rider Work Summary
        </div>

        <div
          style={{
            fontSize:"14px",
            color:"#64748b",
            fontWeight:"700"
          }}
        >
          Quick view of your delivery performance today.
        </div>

      </div>

      <div
        style={{
          padding:"8px 14px",
          borderRadius:"999px",
          background:
            getRiderDisplayStatus() === "busy"
            ? "#fee2e2"
            : "#dcfce7",
          color:
            getRiderDisplayStatus() === "busy"
            ? "#991b1b"
            : "#166534",
          fontSize:"12px",
          fontWeight:"900",
          textTransform:"uppercase"
        }}
      >
        {
          getRiderDisplayStatus() === "busy"
          ? "Busy on delivery"
          : "Available for orders"
        }
      </div>

    </div>

   <div
  style={{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",
    gap:"12px"
  }}
>

  <button
    type="button"
    onClick={()=>
      setActiveRiderCard(
        activeRiderCard === "pending"
        ? ""
        : "pending"
      )
    }
    style={{
      background:"#eff6ff",
      border:
        activeRiderCard === "pending"
        ? "2px solid #2563eb"
        : "1px solid #dbeafe",
      borderRadius:"18px",
      padding:"16px",
      cursor:"pointer",
      textAlign:"left"
    }}
  >

    <div
      style={{
        color:"#1d4ed8",
        fontWeight:"900",
        fontSize:"13px",
        marginBottom:"8px"
      }}
    >
      Pending Requests
    </div>

    <div
      style={{
        color:"#0f172a",
        fontWeight:"900",
        fontSize:"30px"
      }}
    >
      {pendingRequestOrders.length}
    </div>

  </button>

  <button
    type="button"
    onClick={()=>
      setActiveRiderCard(
        activeRiderCard === "active"
        ? ""
        : "active"
      )
    }
    style={{
      background:"#fefce8",
      border:
        activeRiderCard === "active"
        ? "2px solid #f59e0b"
        : "1px solid #fde68a",
      borderRadius:"18px",
      padding:"16px",
      cursor:"pointer",
      textAlign:"left"
    }}
  >

    <div
      style={{
        color:"#92400e",
        fontWeight:"900",
        fontSize:"13px",
        marginBottom:"8px"
      }}
    >
      Active Jobs
    </div>

    <div
      style={{
        color:"#0f172a",
        fontWeight:"900",
        fontSize:"30px"
      }}
    >
      {activeOrders.length}
    </div>

  </button>

  <button
    type="button"
    onClick={()=>
      setActiveRiderCard(
        activeRiderCard === "completed"
        ? ""
        : "completed"
      )
    }
    style={{
      background:"#f0fdf4",
      border:
        activeRiderCard === "completed"
        ? "2px solid #16a34a"
        : "1px solid #bbf7d0",
      borderRadius:"18px",
      padding:"16px",
      cursor:"pointer",
      textAlign:"left"
    }}
  >

    <div
      style={{
        color:"#166534",
        fontWeight:"900",
        fontSize:"13px",
        marginBottom:"8px"
      }}
    >
      Completed Tasks
    </div>

    <div
      style={{
        color:"#0f172a",
        fontWeight:"900",
        fontSize:"30px"
      }}
    >
      {completedOrders.length}
    </div>

  </button>

</div>

{
  activeRiderCard && (

    <div
      style={{
        marginTop:"18px",
        background:"#ffffff",
        border:"1px solid #e5e7eb",
        borderRadius:"20px",
        padding:"16px",
        boxShadow:"0 10px 24px rgba(15,23,42,0.05)"
      }}
    >

      <div
        style={{
          display:"flex",
          alignItems:"center",
          justifyContent:"space-between",
          gap:"12px",
          flexWrap:"wrap",
          marginBottom:"14px"
        }}
      >

        <div>

          <div
            style={{
              color:"#0f172a",
              fontSize:"18px",
              fontWeight:"900"
            }}
          >
            {
              activeRiderCard === "pending"
              ? "Pending Requests"
              : activeRiderCard === "active"
              ? "Active Jobs"
              : "Completed Tasks"
            }
          </div>

          <div
            style={{
              color:"#64748b",
              fontSize:"13px",
              fontWeight:"700",
              marginTop:"3px"
            }}
          >
          Click to view
          </div>

        </div>

        <button
          type="button"
          onClick={()=>
            setActiveRiderCard("")
          }
          style={{
            border:"none",
            borderRadius:"12px",
            padding:"9px 13px",
            background:"#f1f5f9",
            color:"#0f172a",
            fontSize:"12px",
            fontWeight:"900",
            cursor:"pointer"
          }}
        >
          Close
        </button>

      </div>

      {
        (
          activeRiderCard === "pending"
          ? pendingRequestOrders
          : activeRiderCard === "active"
          ? activeOrders
          : completedOrders
        ).length === 0
        ? (

          <Empty
            style={{
              background:"#f8fafc",
              border:"1px dashed #cbd5e1",
              boxShadow:"none",
              fontWeight:"800"
            }}
          >
            No records found here.
          </Empty>

        ) : (

          <div
            style={{
              display:"grid",
              gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",
              gap:"12px"
            }}
          >

            {
              (
                activeRiderCard === "pending"
                ? pendingRequestOrders
                : activeRiderCard === "active"
                ? activeOrders
                : completedOrders
              ).map((o)=>(

                <div
                  key={o._id}
                  style={{
                    background:"#f8fafc",
                    border:"1px solid #e5e7eb",
                    borderLeft:
                      activeRiderCard === "pending"
                      ? "4px solid #2563eb"
                      : activeRiderCard === "active"
                      ? "4px solid #f59e0b"
                      : "4px solid #16a34a",
                    borderRadius:"16px",
                    padding:"14px"
                  }}
                >

                  <div
                    style={{
                      color:"#0f172a",
                      fontWeight:"900",
                      fontSize:"14px",
                      marginBottom:"8px"
                    }}
                  >
                    Order ID: {String(o._id).slice(-6)}
                  </div>

                  <div
                    style={{
                      color:"#475569",
                      fontSize:"13px",
                      fontWeight:"700",
                      lineHeight:"1.6"
                    }}
                  >
                    <strong>Customer:</strong>{" "}
                    {o.customer?.name || "Customer"}
                    <br />

                  {o.customer?.phone && (

  <>
    <strong>Phone:</strong>{" "}
    <a
      href={`tel:${o.customer.phone}`}
      style={{
        color:"#15803d",
        fontWeight:"900",
        textDecoration:"none"
      }}
    >
      {o.customer.phone}
    </a>
    <br />
  </>
)} 

                    <strong>Pickup:</strong>{" "}
                    {o.pickupLocation || "N/A"}
                    <br />

                    <strong>Dropoff:</strong>{" "}
                    {o.dropoffLocation || "N/A"}
                    <br />

                    <strong>Amount:</strong>{" "}
                    ₵{o.total || 0}
                    <br />

                    <strong>Status:</strong>{" "}
                    {o.status || "N/A"}
                  </div>

                  {
                    activeRiderCard === "pending" && (

                      <div
                        style={{
                          display:"flex",
                          gap:"8px",
                          marginTop:"12px",
                          flexWrap:"wrap"
                        }}
                      >

                        <button
                          type="button"
                          onClick={()=>
                            acceptOrder(o._id)
                          }
                          style={{
                            border:"none",
                            borderRadius:"12px",
                            padding:"10px 12px",
                            background:"#16a34a",
                            color:"white",
                            fontWeight:"900",
                            cursor:"pointer"
                          }}
                        >
                          Accept
                        </button>

                        <button
                          type="button"
                          onClick={()=>
                            rejectOrder(o._id)
                          }
                          style={{
                            border:"none",
                            borderRadius:"12px",
                            padding:"10px 12px",
                            background:"#fee2e2",
                            color:"#b91c1c",
                            fontWeight:"900",
                            cursor:"pointer"
                          }}
                        >
                          Reject
                        </button>

                      </div>
                    )
                  }

                </div>
              ))
            }

          </div>
        )
      }

    </div>
  )
}
  </OrderCard>

  <OrderCard
  style={{
    background:
      "linear-gradient(135deg, #0f172a, #1d4ed8)",
    color:"white",
    border:"1px solid rgba(250,204,21,0.28)",
    boxShadow:
      "0 10px 24px rgba(29,78,216,0.14)",
    padding:"18px",
    borderRadius:"24px"
  }}
>

  <div
    style={{
      width:"42px",
      height:"42px",
      borderRadius:"15px",
      background:"#facc15",
      color:"#0f172a",
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      fontSize:"20px",
      marginBottom:"10px"
    }}
  >
    🛵
  </div>

  <div
    style={{
      fontSize:"18px",
      fontWeight:"900",
      marginBottom:"10px"
    }}
  >
    Rider Status
  </div>

  <Button
    type="button"
    onClick={()=>
      updateAvailability(
        getRiderDisplayStatus() === "offline"
        ? "available"
        : "offline"
      )
    }
    style={{
      marginTop:"0",
      marginBottom:"10px",
      padding:"10px 14px",
      borderRadius:"14px",
      background:
        getRiderDisplayStatus() === "offline"
        ? "linear-gradient(135deg, #16a34a, #22c55e)"
        : "linear-gradient(135deg, #dc2626, #ef4444)",
      color:"white",
      fontWeight:"900"
    }}
  >
    {
      getRiderDisplayStatus() === "offline"
      ? "Go Online"
      : "Go Offline"
    }
  </Button>

  <div
    style={{
      color:"rgba(255,255,255,0.80)",
      fontSize:"13px",
      fontWeight:"700",
      lineHeight:"1.4",
      marginBottom:"10px"
    }}
  >
    Stay online to receive delivery requests.
  </div>

  <div
    style={{
      background:"rgba(255,255,255,0.12)",
      border:"1px solid rgba(255,255,255,0.18)",
      borderRadius:"14px",
      padding:"11px",
      fontSize:"14px",
      fontWeight:"900",
      color:"#facc15"
    }}
  >
    Current Status:{" "}
    {
      getRiderDisplayStatus() === "busy"
      ? "BUSY"
      : getRiderDisplayStatus() === "offline"
      ? "OFF-DUTY"
      : getRiderDisplayStatus() === "suspended"
      ? "SUSPENDED"
      : "AVAILABLE"
    }
  </div>

</OrderCard>
</ResponsiveTwoColumn>

{

  pendingRequestOrders.length === 0

  ?

  (

    <Empty
      style={{
        background:
          "linear-gradient(135deg, #ffffff, #f8fafc)",
        border:"1px solid rgba(29,78,216,0.10)",
        boxShadow:
          "0 12px 28px rgba(15,23,42,0.06)",
        fontWeight:"800",
        color:"#0f172a"
      }}
    >

      No pending delivery requests right now.

    </Empty>

  )

  :

  (

    <>

      <div
        style={{
          display:"flex",
          alignItems:"center",
          justifyContent:"space-between",
          gap:"12px",
          flexWrap:"wrap",
          marginBottom:"16px"
        }}
      >

        <div>

          <div
            style={{
              fontSize:"24px",
              fontWeight:"900",
              color:"#0f172a"
            }}
          >
            Available Order Requests
          </div>

          <div
            style={{
              color:"#64748b",
              fontWeight:"700",
              fontSize:"14px",
              marginTop:"4px"
            }}
          >
            Accept pending customer deliveries and manage assigned jobs.
          </div>

        </div>

        <div
          style={{
            padding:"8px 14px",
            borderRadius:"999px",
            background:"#fef3c7",
            color:"#92400e",
            fontWeight:"900",
            fontSize:"12px"
          }}
        >
     {
      pendingRequestOrders.length
     }pending requests
        </div>

      </div>

      <OrdersGrid>

        {

          pendingRequestOrders.map((o)=>(

            <OrderCard
  key={o._id}
  style={{
    background:
      "linear-gradient(135deg, #ffffff, #f8fafc)",
    border:"1px solid rgba(29,78,216,0.10)",
    boxShadow:
      "0 8px 20px rgba(15,23,42,0.05)",
    padding:"18px",
    borderRadius:"22px"
  }}
>

              <div
  style={{
    display:"flex",
    alignItems:"center",
    justifyContent:"space-between",
    gap:"10px",
    marginBottom:"12px",
    flexWrap:"wrap"
  }}
>

                <div
                  style={{
                    display:"flex",
                    alignItems:"center",
                    gap:"12px"
                  }}
                >

                 <div
  style={{
    width:"36px",
    height:"36px",
    borderRadius:"13px",
    background:
      "linear-gradient(135deg, #0f172a, #1d4ed8)",
    color:"#facc15",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    fontSize:"17px",
    fontWeight:"900"
  }}
>
  📦
</div>

                  <div>

                    <div
  style={{
    fontWeight:"900",
    color:"#0f172a",
    fontSize:"15px"
  }}
>
  Delivery Request
</div>

                    <div
                      style={{
                        fontSize:"12px",
                        fontWeight:"800",
                        color:"#64748b"
                      }}
                    >
                      Order ID: {String(o._id).slice(-6)}
                    </div>

                  </div>

                </div>

                <StatusBadge
                  status={o.status}
                  style={{
                    marginTop:"0"
                  }}
                >
                  {o.status}
                </StatusBadge>

              </div>

              <Row
                style={{
                  background:"#eff6ff",
                  border:"1px solid #dbeafe",
                  borderRadius:"14px",
                  padding:"9px 10px",
                  fontWeight:"800"
                }}
              >
                <strong style={{color:"#1d4ed8"}}>
                  Customer:
                </strong>{" "}
                {
                  o.customer?.name ||
                  "Unknown Customer"
                }
              </Row>

              <Row
                style={{
                  background:"#f8fafc",
                  border:"1px solid #e5e7eb",
                  borderRadius:"14px",
                  padding:"9px 10px",
                }}
              >
                <strong>
                  Pickup:
                </strong>{" "}
                {o.pickupLocation}
              </Row>

              <Row
                style={{
                  background:"#f8fafc",
                  border:"1px solid #e5e7eb",
                  borderRadius:"14px",
                  padding:"12px"
                }}
              >
                <strong>
                  Dropoff:
                </strong>{" "}
                {o.dropoffLocation}
              </Row>

             {o.distance} km

              {
                o.customer && (

                  <>

                    <ButtonRow>

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
                          border:"1px solid rgba(250,204,21,0.35)"
                        }}
                      >

                        💬 Chat Customer

                      </Button>

                    </ButtonRow>

                    {

                      openChats[o._id] && (

                        <div
                          style={{
                            marginTop:"14px",
                            background:
                              "linear-gradient(135deg, #ffffff, #f8fafc)",
                            padding:"15px",
                            borderRadius:"16px",
                            border:"1px solid rgba(29,78,216,0.10)"
                          }}
                        >

                          {

                            o.messages &&
                            o.messages.length > 0 && (

                              <div
                                style={{
                                  marginBottom:"15px"
                                }}
                              >

                                {

                                  o.messages.map(
                                    (
                                      msg,
                                      index
                                    )=>(

                                      <div
                                        key={index}
                                        style={{
                                          background:
                                            msg.sender === "rider"
                                            ? "#dbeafe"
                                            : "#fef3c7",
                                          color:"#0f172a",
                                          padding:"10px",
                                          borderRadius:"12px",
                                          marginBottom:"8px",
                                          fontWeight:"700"
                                        }}
                                      >

                                        <strong>

                                          {
                                            msg.sender === "rider"
                                            ? "You"
                                            : "Customer"
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
    display:"flex",
    gap:"8px",
    marginTop:"10px",
    marginBottom:"15px"
  }}
>

  <input
    value={messageText[o._id] || ""}
    onChange={(e)=>
      setMessageText({
        ...messageText,
        [o._id]:e.target.value
      })
    }
    placeholder="Reply customer..."
    style={{
      flex:1,
      padding:"12px",
      borderRadius:"14px",
      border:"1px solid #cbd5e1",
      outline:"none",
      fontWeight:"700"
    }}
  />

  <button
    type="button"
    onClick={()=>
      sendMessage(o._id)
    }
    style={{
      border:"none",
      borderRadius:"14px",
      padding:"0 16px",
      background:"#1d4ed8",
      color:"white",
      fontWeight:"900",
      cursor:"pointer"
    }}
  >
    Send
  </button>

</div>

                          <div
                            style={{
                              display:"flex",
                              gap:"10px"
                            }}
                          >

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
                                padding:"13px",
                                borderRadius:"12px",
                                border:"1px solid #dbeafe",
                                outline:"none",
                                fontWeight:"700"
                              }}
                            />

                            <Button
                              onClick={()=>{

                                sendMessage(
                                  o._id,
                                  chatText[o._id]
                                );
                              }}
                              style={{
                                background:
                                  "linear-gradient(135deg, #facc15, #f59e0b)",
                                color:"#0f172a",
                                fontWeight:"900"
                              }}
                            >

                              Send

                            </Button>

                          </div>

                        </div>
                      )
                    }

                  </>
                )
              }

              {
o.status === "pending" &&
activeOrders.length === 0 &&
user?.status !== "busy" && (

                  <ButtonRow>

                    <Button
                      onClick={()=>

                        acceptOrder(
                          o._id
                        )
                      }
                      style={{
                        background:
                          "linear-gradient(135deg, #16a34a, #22c55e)",
                        color:"white",
                        fontWeight:"900"
                      }}
                    >

                      Accept Order

                    </Button>

                    <Button
                      onClick={()=>

                        rejectOrder(
                          o._id
                        )
                      }
                      style={{
                        background:"#dc2626",
                        color:"white",
                        fontWeight:"900"
                      }}
                    >

                      Reject

                    </Button>

                  </ButtonRow>
                )
              }

              {
  o.status === "pending" &&
  activeOrders.length > 0 && (

    <div
      style={{
        marginTop:"14px",
        background:"#fef2f2",
        border:"1px solid #fecaca",
        color:"#991b1b",
        borderRadius:"14px",
        padding:"12px",
        fontWeight:"900",
        fontSize:"13px",
        lineHeight:"1.4"
      }}
    >
      You already have an active delivery. Complete it before accepting another order.
    </div>
  )
}

              {
                o.status === "accepted" && (

                  <ButtonRow>

                    <Button
                      onClick={()=>

                        pickupOrder(
                          o._id
                        )
                      }
                      style={{
                        background:
                          "linear-gradient(135deg, #0f172a, #1d4ed8)",
                        color:"#facc15",
                        fontWeight:"900"
                      }}
                    >

                      Item Picked

                    </Button>

                  </ButtonRow>
                )
              }

              {
                o.status === "picked" && (

                  <ButtonRow>

                    <Button
                      onClick={()=>

                        startDelivery(
                          o._id
                        )
                      }
                      style={{
                        background:
                          "linear-gradient(135deg, #7c3aed, #6d28d9)",
                        color:"white",
                        fontWeight:"900"
                      }}
                    >

                      Start Delivery

                    </Button>

                  </ButtonRow>
                )
              }

             {
  o.status === "delivering" && (

    <div
      style={{
        marginTop:"14px",
        background:"#f0fdf4",
        border:"1px solid #bbf7d0",
        borderRadius:"16px",
        padding:"14px"
      }}
    >

      <div
        style={{
          color:"#166534",
          fontSize:"14px",
          fontWeight:"900",
          marginBottom:"8px"
        }}
      >
        Complete Delivery
      </div>

      <div
        style={{
          color:"#334155",
          fontSize:"13px",
          fontWeight:"700",
          marginBottom:"10px",
          lineHeight:"1.4"
        }}
      >
        Ask the customer for the 4-digit delivery code.
      </div>

      <input
        type="text"
        maxLength="4"
        placeholder="Enter OTP number"
        value={
          deliveryCodes[o._id] || ""
        }
        onChange={(e)=>
          setDeliveryCodes({
            ...deliveryCodes,
            [o._id]:
              e.target.value.replace(/\D/g,"")
          })
        }
        style={{
          width:"100%",
          padding:"13px",
          borderRadius:"14px",
          border:"1px solid #86efac",
          outline:"none",
          textAlign:"center",
          fontSize:"22px",
          fontWeight:"900",
          letterSpacing:"1px",
          marginBottom:"10px",
          color:"#0f172a"
        }}
      />

      <Button
        onClick={()=>

          completeDelivery(
            o._id
          )
        }
        disabled={
          completingOrderId === o._id ||
          !deliveryCodes[o._id] ||
          deliveryCodes[o._id].length !== 4
        }
        style={{
          background:
            completingOrderId === o._id ||
            !deliveryCodes[o._id] ||
            deliveryCodes[o._id].length !== 4
            ? "#94a3b8"
            : "linear-gradient(135deg, #16a34a, #22c55e)",
          color:"white",
          fontWeight:"900"
        }}
      >
        {
          completingOrderId === o._id
          ? "Verifying Code..."
          : "Complete Delivery"
        }
      </Button>

    </div>
  )
}

            </OrderCard>
          ))
        }

      </OrdersGrid>

    </>
  )
}

  </>
)}

  {activeSection === "activeDeliveries" && (
  <>

    <DashboardHero
      style={{
        padding:"20px 24px",
        borderRadius:"24px",
        marginBottom:"20px"
      }}
    >

      <DashboardHeroContent
        style={{
          minHeight:"140px"
        }}
      >

        <div>

          <HeroBadge
            style={{
              padding:"8px 16px",
              fontSize:"13px",
              marginBottom:"14px"
            }}
          >
            🚚 Active Rider Jobs
          </HeroBadge>

          <DashboardHeroTitle
            style={{
              fontSize:"30px",
              marginBottom:"10px"
            }}
          >
            Active Deliveries
          </DashboardHeroTitle>

          <DashboardHeroText
            style={{
              fontSize:"15px",
              maxWidth:"600px"
            }}
          >
            Track your assigned deliveries, pickup progress, dropoff route, and delivery status in one clean view.
          </DashboardHeroText>

        </div>

        <DashboardDateCard
          style={{
            minWidth:"240px",
            padding:"16px 18px",
            borderRadius:"20px"
          }}
        >

          <div>
            Active Jobs
          </div>

          <strong
            style={{
              fontSize:"34px"
            }}
          >
            {activeOrders.length}
          </strong>

          <span>
            Deliveries currently assigned to you.
          </span>

        </DashboardDateCard>

      </DashboardHeroContent>

    </DashboardHero>

    {activeOrders.length === 0 ? (

      <Empty
        style={{
          background:
            "linear-gradient(135deg, #ffffff, #f8fafc)",
          border:"1px solid rgba(29,78,216,0.10)",
          boxShadow:
            "0 10px 24px rgba(15,23,42,0.06)",
          fontWeight:"800",
          color:"#0f172a"
        }}
      >
        No active deliveries right now.
      </Empty>

    ) : (

      <OrdersGrid>

        {activeOrders.map((order) => (

          <OrderCard
            key={order._id}
            style={{
              background:
                "linear-gradient(135deg, #ffffff, #f8fafc)",
              border:"1px solid rgba(29,78,216,0.10)",
              boxShadow:
                "0 8px 20px rgba(15,23,42,0.05)",
              padding:"18px",
              borderRadius:"22px"
            }}
          >

            <div
              style={{
                display:"flex",
                alignItems:"center",
                justifyContent:"space-between",
                gap:"10px",
                marginBottom:"12px",
                flexWrap:"wrap"
              }}
            >

              <div
                style={{
                  display:"flex",
                  alignItems:"center",
                  gap:"10px"
                }}
              >

                <div
                  style={{
                    width:"36px",
                    height:"36px",
                    borderRadius:"13px",
                    background:
                      "linear-gradient(135deg, #0f172a, #1d4ed8)",
                    color:"#facc15",
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    fontSize:"17px",
                    fontWeight:"900"
                  }}
                >
                  🛵
                </div>

                <div>

                  <div
                    style={{
                      fontWeight:"900",
                      color:"#0f172a",
                      fontSize:"15px"
                    }}
                  >
                    Current Delivery
                  </div>

                  <div
                    style={{
                      fontSize:"12px",
                      fontWeight:"800",
                      color:"#64748b"
                    }}
                  >
                    Order ID: {String(order._id).slice(-6)}
                  </div>

                </div>

              </div>

              <StatusBadge
                status={order.status}
                style={{
                  marginTop:"0",
                  padding:"8px 12px",
                  fontSize:"12px"
                }}
              >
                {order.status}
              </StatusBadge>

            </div>

            <Row
              style={{
                background:"#eff6ff",
                border:"1px solid #dbeafe",
                borderRadius:"14px",
                padding:"9px 10px",
                fontWeight:"800"
              }}
            >
              <strong style={{color:"#1d4ed8"}}>
                Customer:
              </strong>
              {" "}
              {
                order.customer?.name ||
                "Unknown Customer"
              }
            </Row>

            <Row
              style={{
                background:"#f8fafc",
                border:"1px solid #e5e7eb",
                borderRadius:"14px",
                padding:"9px 10px"
              }}
            >
              <strong>
                Pickup:
              </strong>
              {" "}
              {order.pickupLocation}
            </Row>

            <Row
              style={{
                background:"#f8fafc",
                border:"1px solid #e5e7eb",
                borderRadius:"14px",
                padding:"9px 10px"
              }}
            >
              <strong>
                Dropoff:
              </strong>
              {" "}
              {order.dropoffLocation}
            </Row>

           <MobileStackGrid>

  <div
    style={{
      background:"#fefce8",
      border:"1px solid #fde68a",
      borderRadius:"14px",
      padding:"9px 10px"
    }}
  >

    <div
      style={{
        color:"#92400e",
        fontSize:"12px",
        fontWeight:"900",
        marginBottom:"5px"
      }}
    >
      Distance
    </div>

    <div
      style={{
        color:"#0f172a",
        fontSize:"15px",
        fontWeight:"900"
      }}
    >
      {order.distance} km
    </div>

  </div>

  <div
    style={{
      background:
        "linear-gradient(135deg, #0f172a, #1d4ed8)",
      border:"1px solid rgba(250,204,21,0.28)",
      borderRadius:"14px",
      padding:"9px 10px"
    }}
  >

    <div
      style={{
        color:"rgba(255,255,255,0.82)",
        fontSize:"12px",
        fontWeight:"900",
        marginBottom:"5px"
      }}
    >
      Amount
    </div>

    <div
      style={{
        color:"#facc15",
        fontSize:"15px",
        fontWeight:"900"
      }}
    >
      ₵{order.total}
    </div>

  </div>

</MobileStackGrid>

<pre>
  {JSON.stringify(order.pickupCoords,null,2)}
  {JSON.stringify(order.dropoffCoords,null,2)}
</pre>

<div
  style={{
    marginTop:"16px",
    borderRadius:"18px",
    overflow:"hidden"
  }}
>
  <GoogleLiveMap
  pickupCoords={
    order.pickupCoords ||
    (
      order.pickupLat &&
      order.pickupLng
      ? {
          lat:Number(order.pickupLat),
          lng:Number(order.pickupLng)
        }
      : null
    )
  }
  dropoffCoords={
    order.dropoffCoords ||
    (
      order.dropoffLat &&
      order.dropoffLng
      ? {
          lat:Number(order.dropoffLat),
          lng:Number(order.dropoffLng)
        }
      : null
    )
  }
  mode={
    order.status === "accepted"
    ? "pickup"
    : "dropoff"
  }
/>

<a
  href={`https://www.google.com/maps/dir/?api=1&destination=${
    order.dropoffCoords
      ? `${order.dropoffCoords.lat},${order.dropoffCoords.lng}`
      : `${order.dropoffLat},${order.dropoffLng}`
  }`}
  target="_blank"
  rel="noreferrer"
  style={{
    display:"block",
    marginTop:"10px",
    background:"#1d4ed8",
    color:"white",
    textAlign:"center",
    padding:"12px",
    borderRadius:"12px",
    fontWeight:"900",
    textDecoration:"none"
  }}
>
  Open Navigation
</a>

</div>

            {
              order.status === "accepted" && (

                <ButtonRow>

                  <Button
                    onClick={()=>

                      pickupOrder(
                        order._id
                      )
                    }
                    style={{
                      background:
                        "linear-gradient(135deg, #0f172a, #1d4ed8)",
                      color:"#facc15",
                      fontWeight:"900"
                    }}
                  >
                    Item Picked
                  </Button>

                </ButtonRow>
              )
            }

            {
              order.status === "picked" && (

                <ButtonRow>

                  <Button
                    onClick={()=>

                      startDelivery(
                        order._id
                      )
                    }
                    style={{
                      background:
                        "linear-gradient(135deg, #7c3aed, #6d28d9)",
                      color:"white",
                      fontWeight:"900"
                    }}
                  >
                    Start Delivery
                  </Button>

                </ButtonRow>
              )
            }

          {
  order.status === "delivering" && (

    <div
      style={{
        marginTop:"14px",
        background:"#f0fdf4",
        border:"1px solid #bbf7d0",
        borderRadius:"16px",
        padding:"14px"
      }}
    >

      <div
        style={{
          color:"#166534",
          fontSize:"14px",
          fontWeight:"900",
          marginBottom:"8px"
        }}
      >
        Complete Delivery
      </div>

      <div
        style={{
          color:"#334155",
          fontSize:"13px",
          fontWeight:"700",
          marginBottom:"10px",
          lineHeight:"1.4"
        }}
      >
       Ask the customer for the OTP number.
      </div>

      <input
        type="text"
        maxLength="4"
        placeholder="Enter 4-digit code"
        value={
          deliveryCodes[order._id] || ""
        }
        onChange={(e)=>
          setDeliveryCodes({
            ...deliveryCodes,
            [order._id]:
              e.target.value.replace(/\D/g,"")
          })
        }
        style={{
          width:"100%",
          padding:"13px",
          borderRadius:"14px",
          border:"1px solid #86efac",
          outline:"none",
          textAlign:"center",
          fontSize:"22px",
          fontWeight:"900",
          letterSpacing:"6px",
          marginBottom:"10px",
          color:"#0f172a"
        }}
      />

      <input
  type="file"
  accept="image/*"
  capture="environment"
  onChange={(e)=>{

    const file =
      e.target.files[0];

    if(file){

      setDeliveryPhotos({
        ...deliveryPhotos,
        [order._id]:file
      });
    }
  }}
  style={{
    marginTop:"10px",
    width:"100%"
  }}
/>

      <Button
        onClick={()=>

          completeDelivery(
            order._id
          )
        }
        disabled={
          completingOrderId === order._id ||
          !deliveryCodes[order._id] ||
          deliveryCodes[order._id].length !== 4
        }
        style={{
          background:
            completingOrderId === order._id ||
            !deliveryCodes[order._id] ||
            deliveryCodes[order._id].length !== 4
            ? "#94a3b8"
            : "linear-gradient(135deg, #16a34a, #22c55e)",
          color:"white",
          fontWeight:"900"
        }}
      >
        {
          completingOrderId === order._id
          ? "Verifying Code..."
          : "Complete Delivery"
        }
      </Button>

    </div>
  )
}

          </OrderCard>

        ))}

      </OrdersGrid>

    )}

  </>
)}

{activeSection === "earnings" && (
  <>

    <DashboardHero
      style={{
        padding:"20px 24px",
        borderRadius:"24px",
        marginBottom:"20px"
      }}
    >

      <DashboardHeroContent
        style={{
          minHeight:"140px"
        }}
      >

        <div>

          <HeroBadge
            style={{
              padding:"8px 16px",
              fontSize:"13px",
              marginBottom:"14px"
            }}
          >
            💰 Rider Earnings
          </HeroBadge>

          <DashboardHeroTitle
            style={{
              fontSize:"30px",
              marginBottom:"10px"
            }}
          >
            Earnings Overview
          </DashboardHeroTitle>

          <DashboardHeroText
            style={{
              fontSize:"15px",
              maxWidth:"600px"
            }}
          >
            Track your completed deliveries, total income, and estimated average earning per delivery.
          </DashboardHeroText>

        </div>

        <DashboardDateCard
          style={{
            minWidth:"240px",
            padding:"16px 18px",
            borderRadius:"20px"
          }}
        >

          <div>
            Total Earned
          </div>

          <strong
            style={{
              fontSize:"34px"
            }}
          >
            ₵{earnings}
          </strong>

          <span>
            From completed deliveries.
          </span>

        </DashboardDateCard>

      </DashboardHeroContent>

    </DashboardHero>

    <StatsGrid>

      <div
        style={{
          background:
            "linear-gradient(135deg, #0f172a, #1d4ed8)",
          padding:"18px",
          borderRadius:"22px",
          color:"white",
          border:"1px solid rgba(250,204,21,0.28)",
          boxShadow:
            "0 10px 24px rgba(29,78,216,0.16)"
        }}
      >

        <div
          style={{
            width:"38px",
            height:"38px",
            borderRadius:"14px",
            background:"#facc15",
            color:"#0f172a",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            fontSize:"18px",
            fontWeight:"900",
            marginBottom:"14px"
          }}
        >
          ₵
        </div>

        <div
          style={{
            fontSize:"13px",
            fontWeight:"900",
            color:"rgba(255,255,255,0.80)",
            textTransform:"uppercase",
            letterSpacing:"0.5px"
          }}
        >
          Total Earnings
        </div>

        <div
          style={{
            fontSize:"32px",
            fontWeight:"900",
            color:"#facc15",
            marginTop:"8px"
          }}
        >
          ₵{earnings}
        </div>

        <div
          style={{
            fontSize:"13px",
            color:"rgba(255,255,255,0.76)",
            fontWeight:"700",
            marginTop:"6px"
          }}
        >
          Money earned from delivered orders.
        </div>

      </div>

      <div
        style={{
          background:
            "linear-gradient(135deg, #facc15, #f59e0b)",
          padding:"18px",
          borderRadius:"22px",
          color:"#0f172a",
          border:"1px solid rgba(15,23,42,0.12)",
          boxShadow:
            "0 10px 24px rgba(250,204,21,0.22)"
        }}
      >

        <div
          style={{
            width:"38px",
            height:"38px",
            borderRadius:"14px",
            background:"#0f172a",
            color:"#facc15",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            fontSize:"18px",
            fontWeight:"900",
            marginBottom:"14px"
          }}
        >
          ✅
        </div>

        <div
          style={{
            fontSize:"13px",
            fontWeight:"900",
            color:"#0f172a",
            textTransform:"uppercase",
            letterSpacing:"0.5px"
          }}
        >
          Completed Orders
        </div>

        <div
          style={{
            fontSize:"32px",
            fontWeight:"900",
            color:"#0f172a",
            marginTop:"8px"
          }}
        >
          {completedOrders.length}
        </div>

        <div
          style={{
            fontSize:"13px",
            color:"#334155",
            fontWeight:"800",
            marginTop:"6px"
          }}
        >
          Total deliveries completed by you.
        </div>

      </div>

      <div
        style={{
          background:
            "linear-gradient(135deg, #ffffff, #f8fafc)",
          padding:"18px",
          borderRadius:"22px",
          color:"#0f172a",
          border:"1px solid rgba(29,78,216,0.10)",
          boxShadow:
            "0 10px 24px rgba(15,23,42,0.06)"
        }}
      >

        <div
          style={{
            width:"38px",
            height:"38px",
            borderRadius:"14px",
            background:
              "linear-gradient(135deg, #0f172a, #1d4ed8)",
            color:"#facc15",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            fontSize:"18px",
            fontWeight:"900",
            marginBottom:"14px"
          }}
        >
          📊
        </div>

        <div
          style={{
            fontSize:"13px",
            fontWeight:"900",
            color:"#64748b",
            textTransform:"uppercase",
            letterSpacing:"0.5px"
          }}
        >
          Average Per Delivery
        </div>

        <div
          style={{
            fontSize:"32px",
            fontWeight:"900",
            color:"#0f172a",
            marginTop:"8px"
          }}
        >
          ₵{
            completedOrders.length > 0
            ? Math.round(
                earnings / completedOrders.length
              )
            : 0
          }
        </div>

        <div
          style={{
            fontSize:"13px",
            color:"#64748b",
            fontWeight:"700",
            marginTop:"6px"
          }}
        >
          Estimated average income per completed order.
        </div>

      </div>

    </StatsGrid>

    <OrderCard
      style={{
        background:
          "linear-gradient(135deg, #ffffff, #f8fafc)",
        border:"1px solid rgba(29,78,216,0.10)",
        boxShadow:
          "0 10px 24px rgba(15,23,42,0.06)",
        padding:"20px",
        borderRadius:"24px"
      }}
    >

      <div
        style={{
          display:"flex",
          alignItems:"center",
          justifyContent:"space-between",
          gap:"12px",
          flexWrap:"wrap",
          marginBottom:"16px"
        }}
      >

        <div>

          <div
            style={{
              fontSize:"22px",
              fontWeight:"900",
              color:"#0f172a"
            }}
          >
            Completed Delivery History
          </div>

          <div
            style={{
              fontSize:"14px",
              color:"#64748b",
              fontWeight:"700",
              marginTop:"4px"
            }}
          >
            Your delivered orders and earnings breakdown.
          </div>

        </div>

        <div
          style={{
            padding:"8px 14px",
            borderRadius:"999px",
            background:"#fef3c7",
            color:"#92400e",
            fontWeight:"900",
            fontSize:"12px"
          }}
        >
          {completedOrders.length} completed
        </div>

      </div>

      {
        completedOrders.length === 0 ? (

          <Empty
            style={{
              boxShadow:"none",
              border:"1px dashed #cbd5e1",
              background:"#f8fafc",
              fontWeight:"800",
              color:"#64748b"
            }}
          >
            No completed deliveries yet.
          </Empty>

        ) : (

          <div
            style={{
              display:"grid",
              gap:"10px"
            }}
          >

            {
              completedOrders.map((order)=>(

                <div
                  key={order._id}
                  style={{
                    display:"grid",
                    gridTemplateColumns:"1.2fr 1.2fr 0.6fr",
                    gap:"10px",
                    alignItems:"center",
                    background:"#f8fafc",
                    border:"1px solid #e5e7eb",
                    borderRadius:"16px",
                    padding:"12px"
                  }}
                >

                  <div>

                    <div
                      style={{
                        fontSize:"12px",
                        color:"#64748b",
                        fontWeight:"900",
                        marginBottom:"4px"
                      }}
                    >
                      CUSTOMER
                    </div>

                    <div
                      style={{
                        color:"#0f172a",
                        fontWeight:"900",
                        fontSize:"14px"
                      }}
                    >
                      {
                        order.customer?.name ||
                        "Unknown Customer"
                      }
                    </div>

                  </div>

                  <div>

                    <div
                      style={{
                        fontSize:"12px",
                        color:"#64748b",
                        fontWeight:"900",
                        marginBottom:"4px"
                      }}
                    >
                      ROUTE
                    </div>

                    <div
                      style={{
                        color:"#0f172a",
                        fontWeight:"800",
                        fontSize:"13px",
                        lineHeight:"1.4"
                      }}
                    >
                      {order.pickupLocation} → {order.dropoffLocation}
                    </div>

                  </div>

                  <div
                    style={{
                      textAlign:"right"
                    }}
                  >

                    <div
                      style={{
                        fontSize:"12px",
                        color:"#64748b",
                        fontWeight:"900",
                        marginBottom:"4px"
                      }}
                    >
                      AMOUNT
                    </div>

                    <div
                      style={{
                        color:"#16a34a",
                        fontWeight:"900",
                        fontSize:"16px"
                      }}
                    >
                      ₵{order.total}
                    </div>

                  </div>

                </div>
              ))
            }

          </div>
        )
      }

    </OrderCard>

  </>
)}

{activeSection === "messages" && (
  <>

    <DashboardHero
      style={{
        padding:"20px 24px",
        borderRadius:"24px",
        marginBottom:"20px"
      }}
    >

      <DashboardHeroContent
        style={{
          minHeight:"140px"
        }}
      >

        <div>

          <HeroBadge
            style={{
              padding:"8px 16px",
              fontSize:"13px",
              marginBottom:"14px"
            }}
          >
            💬 Rider Messages
          </HeroBadge>

          <DashboardHeroTitle
            style={{
              fontSize:"30px",
              marginBottom:"10px"
            }}
          >
            Customer Messages
          </DashboardHeroTitle>

          <DashboardHeroText
            style={{
              fontSize:"15px",
              maxWidth:"600px"
            }}
          >
            View customer messages from delivery orders and respond quickly from your active delivery cards.
          </DashboardHeroText>

        </div>

        <DashboardDateCard
          style={{
            minWidth:"240px",
            padding:"16px 18px",
            borderRadius:"20px"
          }}
        >

          <div>
            Inbox
          </div>

          <strong
            style={{
              fontSize:"34px"
            }}
          >
            {messageInbox.length}
          </strong>

          <span>
            Customer messages received.
          </span>

        </DashboardDateCard>

      </DashboardHeroContent>

    </DashboardHero>

    <OrderCard
      style={{
        background:
          "linear-gradient(135deg, #ffffff, #f8fafc)",
        border:"1px solid rgba(29,78,216,0.10)",
        boxShadow:
          "0 10px 24px rgba(15,23,42,0.06)",
        padding:"20px",
        borderRadius:"24px"
      }}
    >

      <div
        style={{
          display:"flex",
          alignItems:"center",
          justifyContent:"space-between",
          gap:"12px",
          flexWrap:"wrap",
          marginBottom:"16px"
        }}
      >

        <div>

          <div
            style={{
              fontSize:"22px",
              fontWeight:"900",
              color:"#0f172a"
            }}
          >
            Message Inbox
          </div>

          <div
            style={{
              fontSize:"14px",
              color:"#64748b",
              fontWeight:"700",
              marginTop:"4px"
            }}
          >
            Latest customer messages connected to delivery orders.
          </div>

        </div>

        <div
          style={{
            padding:"8px 14px",
            borderRadius:"999px",
            background:"#eff6ff",
            color:"#1d4ed8",
            fontWeight:"900",
            fontSize:"12px"
          }}
        >
          {messageInbox.length} messages
        </div>

      </div>

      {messageInbox.length === 0 ? (

        <Empty
          style={{
            boxShadow:"none",
            border:"1px dashed #cbd5e1",
            background:"#f8fafc",
            fontWeight:"800",
            color:"#64748b"
          }}
        >
          No messages yet.
        </Empty>

      ) : (

        <div
          style={{
            display:"grid",
            gap:"10px"
          }}
        >

          {messageInbox.map(
            (msg,index) => (

              <div
                key={index}
                style={{
                  display:"grid",
                  gridTemplateColumns:"44px 1fr auto",
                  gap:"12px",
                  alignItems:"center",
                  background:"#f8fafc",
                  border:"1px solid #e5e7eb",
                  borderRadius:"16px",
                  padding:"12px"
                }}
              >

                <div
                  style={{
                    width:"44px",
                    height:"44px",
                    borderRadius:"16px",
                    background:
                      "linear-gradient(135deg, #0f172a, #1d4ed8)",
                    color:"#facc15",
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    fontSize:"18px",
                    fontWeight:"900"
                  }}
                >
                  💬
                </div>

                <div>

                  <div
                    style={{
                      display:"flex",
                      alignItems:"center",
                      gap:"8px",
                      flexWrap:"wrap",
                      marginBottom:"5px"
                    }}
                  >

                    <div
                      style={{
                        fontSize:"14px",
                        fontWeight:"900",
                        color:"#0f172a"
                      }}
                    >
                      {
                        msg.sender === "customer"
                        ? "Customer"
                        : msg.sender || "MB Swift"
                      }
                    </div>

                    <div
                      style={{
                        padding:"4px 8px",
                        borderRadius:"999px",
                        background:"#fef3c7",
                        color:"#92400e",
                        fontSize:"11px",
                        fontWeight:"900"
                      }}
                    >
                      Order {String(msg.orderId || "").slice(-6)}
                    </div>

                  </div>

                  <div
                    style={{
                      fontSize:"14px",
                      color:"#334155",
                      fontWeight:"700",
                      lineHeight:"1.45"
                    }}
                  >
                    {msg.text}
                  </div>

                </div>

                <div
                  style={{
                    textAlign:"right",
                    color:"#64748b",
                    fontSize:"12px",
                    fontWeight:"900",
                    whiteSpace:"nowrap"
                  }}
                >
                  {msg.time}
                </div>

              </div>
            )
          )}

        </div>
      )}

    </OrderCard>

  </>
)}

{activeSection === "notifications" && (
  <>

    <DashboardHero
      style={{
        padding:"20px 24px",
        borderRadius:"24px",
        marginBottom:"20px"
      }}
    >

      <DashboardHeroContent
        style={{
          minHeight:"140px"
        }}
      >

        <div>

          <HeroBadge
            style={{
              padding:"8px 16px",
              fontSize:"13px",
              marginBottom:"14px"
            }}
          >
            🔔 Rider Alerts
          </HeroBadge>

          <DashboardHeroTitle
            style={{
              fontSize:"30px",
              marginBottom:"10px"
            }}
          >
            Notifications
          </DashboardHeroTitle>

          <DashboardHeroText
            style={{
              fontSize:"15px",
              maxWidth:"600px"
            }}
          >
            Stay updated with delivery alerts, customer activity, order changes, and important rider updates.
          </DashboardHeroText>

        </div>

        <DashboardDateCard
          style={{
            minWidth:"240px",
            padding:"16px 18px",
            borderRadius:"20px"
          }}
        >

          <div>
            Alerts
          </div>

          <strong
            style={{
              fontSize:"34px"
            }}
          >
            {notifications.length}
          </strong>

          <span>
            New rider notifications.
          </span>

        </DashboardDateCard>

      </DashboardHeroContent>

    </DashboardHero>

    {
  user?.notifications?.length > 0 && (

    <OrderCard
      style={{
        marginBottom:"18px",
        background:
          "linear-gradient(135deg, #ffffff, #f8fafc)"
      }}
    >

      <h3
        style={{
          marginTop:0,
          color:"#0f172a",
          fontWeight:"900"
        }}
      >
        Admin Account Notices
      </h3>

      <OrdersGrid>

        {
          user.notifications.map((note,index)=>(

            <OrderCard
              key={index}
              style={{
                borderLeft:"5px solid #2563eb"
              }}
            >

              <Row>
                <strong>
                  {note.title || "MB Swift Notice"}
                </strong>
              </Row>

              <Row>
                {note.message || "No message provided"}
              </Row>

              <StatusBadge>
                {
                  note.createdAt
                  ? new Date(note.createdAt)
                    .toLocaleString()
                  : "System notice"
                }
              </StatusBadge>

            </OrderCard>
          ))
        }

      </OrdersGrid>

    </OrderCard>
  )
}

    <OrderCard
      style={{
        background:
          "linear-gradient(135deg, #ffffff, #f8fafc)",
        border:"1px solid rgba(29,78,216,0.10)",
        boxShadow:
          "0 10px 24px rgba(15,23,42,0.06)",
        padding:"20px",
        borderRadius:"24px"
      }}
    >

      <div
        style={{
          display:"flex",
          alignItems:"center",
          justifyContent:"space-between",
          gap:"12px",
          flexWrap:"wrap",
          marginBottom:"16px"
        }}
      >

        <div>

          <div
            style={{
              fontSize:"22px",
              fontWeight:"900",
              color:"#0f172a"
            }}
          >
            Notification Center
          </div>

          <div
            style={{
              fontSize:"14px",
              color:"#64748b",
              fontWeight:"700",
              marginTop:"4px"
            }}
          >
            Latest alerts and system messages for your rider account.
          </div>

        </div>

        <div
          style={{
            padding:"8px 14px",
            borderRadius:"999px",
            background:"#fef3c7",
            color:"#92400e",
            fontWeight:"900",
            fontSize:"12px"
          }}
        >
          {notifications.length} alerts
        </div>

      </div>

      {notifications.length === 0 ? (

        <Empty
          style={{
            boxShadow:"none",
            border:"1px dashed #cbd5e1",
            background:"#f8fafc",
            fontWeight:"800",
            color:"#64748b"
          }}
        >
          No new notifications yet.
        </Empty>

      ) : (

        <div
          style={{
            display:"grid",
            gap:"10px"
          }}
        >

          {notifications.map(
            (note,index) => (

              <div
                key={index}
                style={{
                  display:"grid",
                  gridTemplateColumns:"44px 1fr auto",
                  gap:"12px",
                  alignItems:"center",
                  background:"#f8fafc",
                  border:"1px solid #e5e7eb",
                  borderRadius:"16px",
                  padding:"12px"
                }}
              >

                <div
                  style={{
                    width:"44px",
                    height:"44px",
                    borderRadius:"16px",
                    background:
                      "linear-gradient(135deg, #facc15, #f59e0b)",
                    color:"#0f172a",
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    fontSize:"18px",
                    fontWeight:"900"
                  }}
                >
                  🔔
                </div>

                <div>

                  <div
                    style={{
                      display:"flex",
                      alignItems:"center",
                      gap:"8px",
                      flexWrap:"wrap",
                      marginBottom:"5px"
                    }}
                  >

                    <div
                      style={{
                        fontSize:"14px",
                        fontWeight:"900",
                        color:"#0f172a"
                      }}
                    >
                      {note.sender || "MB Swift"}
                    </div>

                    <div
                      style={{
                        padding:"4px 8px",
                        borderRadius:"999px",
                        background:"#eff6ff",
                        color:"#1d4ed8",
                        fontSize:"11px",
                        fontWeight:"900"
                      }}
                    >
                      Alert
                    </div>

                  </div>

                  <div
                    style={{
                      fontSize:"14px",
                      color:"#334155",
                      fontWeight:"700",
                      lineHeight:"1.45"
                    }}
                  >
                    {note.text}
                  </div>

                </div>

                <div
                  style={{
                    textAlign:"right",
                    color:"#64748b",
                    fontSize:"12px",
                    fontWeight:"900",
                    whiteSpace:"nowrap"
                  }}
                >
                  {note.time}
                </div>

              </div>
            )
          )}

        </div>
      )}

    </OrderCard>

  </>
)}

{activeSection === "profile" && (
  <>

    <DashboardHero
      style={{
        padding:"20px 24px",
        borderRadius:"24px",
        marginBottom:"20px"
      }}
    >

      <DashboardHeroContent
        style={{
          minHeight:"140px"
        }}
      >

        <div>

          <HeroBadge
            style={{
              padding:"8px 16px",
              fontSize:"13px",
              marginBottom:"14px"
            }}
          >
            👤 Rider Profile
          </HeroBadge>

          <DashboardHeroTitle
            style={{
              fontSize:"30px",
              marginBottom:"10px"
            }}
          >
            Manage Your Profile
          </DashboardHeroTitle>

          <DashboardHeroText
            style={{
              fontSize:"15px",
              maxWidth:"600px"
            }}
          >
            Keep your rider details updated, manage emergency contact information, and control your availability.
          </DashboardHeroText>

        </div>

        <DashboardDateCard
          style={{
            minWidth:"240px",
            padding:"16px 18px",
            borderRadius:"20px"
          }}
        >

          <div>
            Status
          </div>

          <strong
            style={{
              fontSize:"30px"
            }}
          >
            {
              getRiderDisplayStatus() === "busy"
              ? "Busy"
              : getRiderDisplayStatus() === "offline"
              ? "Off"
              : getRiderDisplayStatus() === "suspended"
              ? "Stop"
              : "Live"
            }
          </strong>

          <span>
            Current rider availability.
          </span>

        </DashboardDateCard>

      </DashboardHeroContent>

    </DashboardHero>

    <div
      style={{
        display:"grid",
        gridTemplateColumns:"0.8fr 1.2fr",
        gap:"22px",
        alignItems:"start"
      }}
    >

      <OrderCard
        style={{
          background:
            "linear-gradient(135deg, #0f172a, #1d4ed8)",
          color:"white",
          border:"1px solid rgba(250,204,21,0.28)",
          boxShadow:
            "0 10px 24px rgba(29,78,216,0.18)",
          padding:"22px",
          borderRadius:"24px",
          textAlign:"center"
        }}
      >

        <div
  style={{
    background:riderProfileCompleted
      ? "#dcfce7"
      : "#fef3c7",
    border:riderProfileCompleted
      ? "1px solid #86efac"
      : "1px solid #fde68a",
    color:riderProfileCompleted
      ? "#166534"
      : "#92400e",
    borderRadius:"18px",
    padding:"16px",
    marginBottom:"18px",
    fontWeight:"900"
  }}
>
  {
    riderProfileCompleted
    ? "🟢 VERIFIED RIDER PROFILE"
    : "🟡 INCOMPLETE RIDER PROFILE — Complete your profile before accepting deliveries."
  }
</div>

        <ProfileImage
          src={
            selectedProfileImage ||
            user?.profileImage ||
            riderImage
          }
          alt="Rider"
          style={{
            width:"120px",
            height:"120px",
            border:"6px solid #facc15",
            marginBottom:"16px"
          }}
        />

        <div
          style={{
            fontSize:"24px",
            fontWeight:"900",
            marginBottom:"6px"
          }}
        >
          {user?.name || "Rider"}
        </div>

        <div
          style={{
            color:"rgba(255,255,255,0.78)",
            fontSize:"14px",
            fontWeight:"700",
            marginBottom:"16px"
          }}
        >
          {user?.email || "No email added"}
        </div>

        <div
          style={{
            display:"inline-flex",
            padding:"8px 14px",
            borderRadius:"999px",
            background:
              getRiderDisplayStatus() === "busy"
              ? "#fee2e2"
              : getRiderDisplayStatus() === "suspended"
              ? "#fee2e2"
              : "#dcfce7",
            color:
              getRiderDisplayStatus() === "busy"
              ? "#991b1b"
              : getRiderDisplayStatus() === "suspended"
              ? "#991b1b"
              : "#166534",
            fontSize:"12px",
            fontWeight:"900",
            marginBottom:"18px",
            textTransform:"uppercase"
          }}
        >
          {
            getRiderDisplayStatus() === "busy"
            ? "Busy"
            : getRiderDisplayStatus() === "offline"
            ? "Off-duty"
            : getRiderDisplayStatus() === "suspended"
            ? "Suspended"
            : "Available"
          }
        </div>

        <input
  type="file"
  accept="image/*"
  onChange={async(e)=>{

    try{

      const file =
        e.target.files[0];

      if(!file){

        return;
      }

      if(file.size > 5 * 1024 * 1024){

        alert(
          "Image is too large. Please choose an image below 5MB."
        );

        return;
      }

      setSelectedProfileImage(
        URL.createObjectURL(file)
      );

      const formData =
        new FormData();

      formData.append(
        "profileImage",
        file
      );

      const res =
        await API.put(
          "/rider/profile-image",
          formData
        );

      console.log(
        "PROFILE IMAGE RESPONSE:",
        res.data
      );

      const updatedUser =
        res.data.user || res.data;

      setUser(
        updatedUser
      );

      setSelectedProfileImage(
        updatedUser.profileImage || ""
      );

      setProfileImage(
        updatedUser.profileImage || riderImage
      );

      fetchMe();

      alert(
        "Rider profile picture saved successfully"
      );

      e.target.value =
        "";

    }catch(err){

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Rider profile picture upload failed"
      );
    }
  }}
/>

        <Button
          style={{
            background:
              riderAvailability === "online"
              ? "#dc2626"
              : "#16a34a",
            color:"white",
            fontWeight:"900",
            borderRadius:"14px"
          }}
          onClick={()=>{

            setRiderAvailability(
              riderAvailability === "online"
              ? "offline"
              : "online"
            );
          }}
        >
          {
            riderAvailability === "online"
            ? "Go Offline"
            : "Go Online"
          }
        </Button>

      </OrderCard>

      <OrderCard
        style={{
          background:
            "linear-gradient(135deg, #ffffff, #f8fafc)",
          border:"1px solid rgba(29,78,216,0.10)",
          boxShadow:
            "0 10px 24px rgba(15,23,42,0.06)",
          padding:"22px",
          borderRadius:"24px"
        }}
      >

        <div
          style={{
            display:"flex",
            alignItems:"center",
            justifyContent:"space-between",
            gap:"12px",
            flexWrap:"wrap",
            marginBottom:"18px"
          }}
        >

          <div>

            <div
              style={{
                fontSize:"22px",
                fontWeight:"900",
                color:"#0f172a"
              }}
            >
              Personal Information
            </div>

            <div
              style={{
                fontSize:"14px",
                color:"#64748b",
                fontWeight:"700",
                marginTop:"4px"
              }}
            >
              Your rider account and emergency details.
            </div>

          </div>

          <Button
            style={{
              width:"130px",
              background:
                riderProfileEditing
                ? "linear-gradient(135deg, #16a34a, #22c55e)"
                : "linear-gradient(135deg, #0f172a, #1d4ed8)",
              color:
                riderProfileEditing
                ? "white"
                : "#facc15",
              fontWeight:"900"
            }}
            onClick={async()=>{

              if(riderProfileEditing){

                try{

                  const res =
  await API.put(
    "/rider/profile",
   {
  dob:riderDOB,
  emergencyContact:riderEmergency,
  motorNumber:motorNumber,
  motorName:motorName,
  motorColor:motorColor,
  idType:riderIdType,
  idNumber:riderIdNumber
}
  );

                  setUser(
                    res.data.user
                  );

                  alert(
                    "Profile saved successfully"
                  );

                  setRiderProfileEditing(false);

                }catch(err){

                  console.log(err);

                  alert(
                    err.response?.data?.message ||
                    "Failed to save profile"
                  );
                }

              }else{

                setRiderProfileEditing(true);
              }
            }}
          >
            {
              riderProfileEditing
              ? "Save"
              : "Edit"
            }
          </Button>

        </div>

        <div
          style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",
            gap:"12px"
          }}
        >

          <div
            style={{
              background:"#eff6ff",
              border:"1px solid #dbeafe",
              borderRadius:"16px",
              padding:"14px"
            }}
          >
            <div
              style={{
                color:"#1d4ed8",
                fontSize:"12px",
                fontWeight:"900",
                marginBottom:"6px"
              }}
            >
              NAME
            </div>

            <div
              style={{
                color:"#0f172a",
                fontSize:"15px",
                fontWeight:"900"
              }}
            >
              {user?.name || "Rider"}
            </div>
          </div>

          <div
            style={{
              background:"#f8fafc",
              border:"1px solid #e5e7eb",
              borderRadius:"16px",
              padding:"14px"
            }}
          >
            <div
              style={{
                color:"#64748b",
                fontSize:"12px",
                fontWeight:"900",
                marginBottom:"6px"
              }}
            >
              EMAIL
            </div>

            <div
              style={{
                color:"#0f172a",
                fontSize:"15px",
                fontWeight:"900",
                wordBreak:"break-word"
              }}
            >
              {user?.email || "No email"}
            </div>
          </div>

          <div
            style={{
              background:"#f8fafc",
              border:"1px solid #e5e7eb",
              borderRadius:"16px",
              padding:"14px"
            }}
          >
            <div
              style={{
                color:"#64748b",
                fontSize:"12px",
                fontWeight:"900",
                marginBottom:"6px"
              }}
            >
              PHONE
            </div>

            <div
              style={{
                color:"#0f172a",
                fontSize:"15px",
                fontWeight:"900"
              }}
            >
              {user?.phone || "No phone"}
            </div>
          </div>

          <div
            style={{
              background:"#fefce8",
              border:"1px solid #fde68a",
              borderRadius:"16px",
              padding:"14px"
            }}
          >
            <div
              style={{
                color:"#92400e",
                fontSize:"12px",
                fontWeight:"900",
                marginBottom:"6px"
              }}
            >
              ACCOUNT STATUS
            </div>

            <div
              style={{
                color:"#0f172a",
                fontSize:"15px",
                fontWeight:"900"
              }}
            >
              {
                riderAvailability === "online"
                ? "Online 🟢"
                : "Offline 🔴"
              }
            </div>
          </div>

        </div>

        <div
          style={{
            marginTop:"18px",
            paddingTop:"18px",
            borderTop:"1px solid #e5e7eb"
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
            Rider Details
          </div>

          {
            riderProfileEditing ? (

              <div
                style={{
                  display:"grid",
                  gap:"12px"
                }}
              >

                <input
                  type="date"
                  value={riderDOB}
                  onChange={(e)=>

                    setRiderDOB(
                      e.target.value
                    )
                  }
                  style={{
                    width:"100%",
                    padding:"13px",
                    borderRadius:"14px",
                    border:"1px solid #dbeafe",
                    fontSize:"15px",
                    fontWeight:"700",
                    outline:"none"
                  }}
                />

                <input
                  type="text"
                  placeholder="Emergency Contact"
                  value={riderEmergency}
                  onChange={(e)=>

                    setRiderEmergency(
                      e.target.value
                    )
                  }
                  style={{
                    width:"100%",
                    padding:"13px",
                    borderRadius:"14px",
                    border:"1px solid #dbeafe",
                    fontSize:"15px",
                    fontWeight:"700",
                    outline:"none"
                  }}
                />

   <input
  type="text"
  placeholder="Motor Name"
  value={motorName}
  onChange={(e)=>
    setMotorName(
      e.target.value
    )
  }
  disabled={!riderProfileEditing}
  style={{
    width:"100%",
    padding:"13px",
    borderRadius:"14px",
    border:"1px solid #cbd5e1",
    outline:"none",
    fontWeight:"800",
    marginBottom:"12px"
  }}
/>

<input
  type="text"
  placeholder="Motor Color"
  value={motorColor}
  onChange={(e)=>
    setMotorColor(
      e.target.value
    )
  }
  disabled={!riderProfileEditing}
  style={{
    width:"100%",
    padding:"13px",
    borderRadius:"14px",
    border:"1px solid #cbd5e1",
    outline:"none",
    fontWeight:"800",
    marginBottom:"12px"
  }}
/>

<input
  type="text"
  placeholder="Motor Number"
  value={motorNumber}
  onChange={(e)=>
    setMotorNumber(
      e.target.value
    )
  }
  disabled={!riderProfileEditing}
  style={{
    width:"100%",
    padding:"13px",
    borderRadius:"14px",
    border:"1px solid #cbd5e1",
    outline:"none",
    fontWeight:"800",
    marginBottom:"12px"
  }}
/>


                <input
                  type="text"
                  placeholder="Motor Number"
                  value={motorNumber}
                  onChange={(e)=>

                    setMotorNumber(
                      e.target.value
                    )
                  }
                  style={{
                    width:"100%",
                    padding:"13px",
                    borderRadius:"14px",
                    border:"1px solid #dbeafe",
                    fontSize:"15px",
                    fontWeight:"700",
                    outline:"none"
                  }}
                />

                <label>
  ID Type
</label>

<select
  value={riderIdType}
  onChange={(e)=>
    setRiderIdType(e.target.value)
  }
  disabled={!riderProfileEditing}
  style={{
    width:"100%",
    padding:"13px",
    borderRadius:"14px",
    border:"1px solid #cbd5e1",
    outline:"none",
    fontWeight:"800",
    marginBottom:"12px"
  }}
>
  <option value="">Select ID Type</option>
  <option value="Ghana Card">Ghana Card</option>
  <option value="Driver's License">Driver's License</option>
  <option value="Passport">Passport</option>
  <option value="Voter ID">Voter ID</option>
  <option value="Other">Other</option>
</select>

<label>
  ID Number
</label>

<input
  type="text"
  value={riderIdNumber}
  onChange={(e)=>
    setRiderIdNumber(e.target.value)
  }
  disabled={
    !riderProfileEditing ||
    !riderIdType
  }
  placeholder={
    riderIdType === "Ghana Card"
    ? "Example: GHA-123456789-1"
    : riderIdType === "Driver's License"
    ? "Example: DVLA-12345678"
    : riderIdType === "Passport"
    ? "Example: G1234567"
    : riderIdType === "Voter ID"
    ? "Example: 1234567890"
    : "Enter ID number"
  }
  style={{
    width:"100%",
    padding:"13px",
    borderRadius:"14px",
    border:"1px solid #cbd5e1",
    outline:"none",
    fontWeight:"800",
    marginBottom:"12px"
  }}
/>

              </div>

            ) : (

              <div
                style={{
                  display:"grid",
                  gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",
                  gap:"12px"
                }}
              >

                <div
                  style={{
                    background:"#f8fafc",
                    border:"1px solid #e5e7eb",
                    borderRadius:"16px",
                    padding:"14px"
                  }}
                >
                  <div
                    style={{
                      color:"#64748b",
                      fontSize:"12px",
                      fontWeight:"900",
                      marginBottom:"6px"
                    }}
                  >
                    DATE OF BIRTH
                  </div>

                  <div
                    style={{
                      color:"#0f172a",
                      fontSize:"15px",
                      fontWeight:"900"
                    }}
                  >
                    {riderDOB || "Not added"}
                  </div>
                </div>

                <div
                  style={{
                    background:"#f8fafc",
                    border:"1px solid #e5e7eb",
                    borderRadius:"16px",
                    padding:"14px"
                  }}
                >
                  <div
                    style={{
                      color:"#64748b",
                      fontSize:"12px",
                      fontWeight:"900",
                      marginBottom:"6px"
                    }}
                  >
                    EMERGENCY CONTACT
                  </div>

                  <div
                    style={{
                      color:"#0f172a",
                      fontSize:"15px",
                      fontWeight:"900"
                    }}
                  >
                    {riderEmergency || "Not added"}
                  </div>
                </div>

               <div
  style={{
    background:"#f8fafc",
    border:"1px solid #e5e7eb",
    borderRadius:"16px",
    padding:"14px"
  }}
>
  <div
    style={{
      color:"#64748b",
      fontSize:"12px",
      fontWeight:"900",
      marginBottom:"6px"
    }}
  >
    MOTOR NAME
  </div>

  <div
    style={{
      color:"#0f172a",
      fontSize:"15px",
      fontWeight:"900"
    }}
  >
    {motorName || "Not added"}
  </div>
</div>

<div
  style={{
    background:"#f8fafc",
    border:"1px solid #e5e7eb",
    borderRadius:"16px",
    padding:"14px"
  }}
>
  <div
    style={{
      color:"#64748b",
      fontSize:"12px",
      fontWeight:"900",
      marginBottom:"6px"
    }}
  >
    MOTOR COLOR
  </div>

  <div
    style={{
      color:"#0f172a",
      fontSize:"15px",
      fontWeight:"900"
    }}
  >
    {motorColor || "Not added"}
  </div>
</div>

<div
  style={{
    background:"#f8fafc",
    border:"1px solid #e5e7eb",
    borderRadius:"16px",
    padding:"14px"
  }}
>
  <div
    style={{
      color:"#64748b",
      fontSize:"12px",
      fontWeight:"900",
      marginBottom:"6px"
    }}
  >
    MOTOR NUMBER
  </div>

  <div
    style={{
      color:"#0f172a",
      fontSize:"15px",
      fontWeight:"900"
    }}
  >
    {motorNumber || "Not added"}
  </div>
</div>

<div
  style={{
    background:"#f8fafc",
    border:"1px solid #e5e7eb",
    borderRadius:"16px",
    padding:"14px"
  }}
>
  <div
    style={{
      color:"#64748b",
      fontSize:"12px",
      fontWeight:"900",
      marginBottom:"6px"
    }}
  >
    ID TYPE
  </div>

  <div
    style={{
      color:"#0f172a",
      fontSize:"15px",
      fontWeight:"900"
    }}
  >
    {riderIdType || "Not added"}
  </div>
</div>

<div
  style={{
    background:"#f8fafc",
    border:"1px solid #e5e7eb",
    borderRadius:"16px",
    padding:"14px"
  }}
>
  <div
    style={{
      color:"#64748b",
      fontSize:"12px",
      fontWeight:"900",
      marginBottom:"6px"
    }}
  >
    ID NUMBER
  </div>

  <div
    style={{
      color:"#0f172a",
      fontSize:"15px",
      fontWeight:"900"
    }}
  >
    {riderIdNumber || "Not added"}
  </div>
</div>

</div>
)
}
        </div>

      </OrderCard>

    </div>

  </>
)}

    </Main>

  </Layout>
);
}
  
