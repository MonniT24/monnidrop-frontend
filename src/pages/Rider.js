import React,{useState,useEffect} from "react";

import styled from "styled-components";

import API from "../api/api";
import socket from "../socket";
import riderImage from "../assets/rider.png";
import logo from "../assets/logo.png";

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
  margin-left:10px;

  padding:6px 14px;

  border-radius:999px;

  font-size:12px;

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
      rgba(250,204,21,0.55),
      transparent 32%
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
    0 18px 45px rgba(15,23,42,0.18);

    @media(max-width:768px){
    padding:24px 20px;
    border-radius:24px;
  }

  &::before{
    content:"";
    position:absolute;
    inset:0;
    pointer-events:none;
    z-index:1;

    background-image:
      radial-gradient(circle, rgba(255,255,255,0.9) 0 2px, transparent 3px),
      radial-gradient(circle, rgba(250,204,21,0.9) 0 2px, transparent 3px),
      radial-gradient(circle, rgba(255,255,255,0.7) 0 1.5px, transparent 3px);

    background-size:
      120px 120px,
      170px 170px,
      90px 90px;

    background-position:
      20px 30px,
      80px 70px,
      140px 20px;

    opacity:0.55;
    animation:sparkleMove 5s linear infinite;
  }

  @keyframes sparkleMove{
    0%{
      background-position:
        20px 30px,
        80px 70px,
        140px 20px;
      opacity:0.35;
    }

    50%{
      background-position:
        40px 45px,
        100px 55px,
        160px 35px;
      opacity:0.85;
    }

    100%{
      background-position:
        20px 30px,
        80px 70px,
        140px 20px;
      opacity:0.35;
    }
  }
`;

const DashboardHeroContent = styled.div`
  position:relative;
  z-index:2;

  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:18px;

  min-height:165px;

  @media(max-width:768px){
    flex-direction:column;
    align-items:flex-start;
    min-height:auto;
  }
`;

const HeroLogo = styled.img`
  position:absolute;
  top:-4px;
  left:43%;

  width:70px;
  height:70px;
  object-fit:contain;

  background:transparent;
  padding:0;
  border:none;
  border-radius:50%;
  box-shadow:none;

  z-index:10;

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
    top:8px;
    left:60%;

    width:62px;
    height:62px;
    object-fit:contain;

    background:transparent;
    padding:0;
    border:none;
    border-radius:50%;
    box-shadow:none;
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
  font-size:30px;
  font-weight:900;
  color:white;
  margin:0 0 10px;
  line-height:1.08;
  letter-spacing:-1px;

  @media(max-width:768px){
    font-size:28px;
    padding-top:40px;
  }
`;

const DashboardHeroText = styled.p`
  max-width:650px;
  color:rgba(255,255,255,0.88);
  font-size:15px;
  line-height:1.55;
  margin:0;
`;

const DashboardDateCard = styled.div`
  min-width:260px;

  padding:18px 22px;
  border-radius:30px;

  background:
    linear-gradient(
      135deg,
      rgba(255,255,255,0.25),
      rgba(255,255,255,0.08)
    );

  border:1px solid rgba(255,255,255,0.34);

  color:white;

  box-shadow:
    0 20px 45px rgba(0,0,0,0.22),
    inset 0 1px 0 rgba(255,255,255,0.28);

  backdrop-filter:blur(14px);

  div{
    display:inline-flex;
    align-items:center;
    justify-content:center;

    padding:8px 16px;
    border-radius:999px;

    background:#facc15;
    color:#0f172a;

    font-size:14px;
    font-weight:900;
    letter-spacing:0.8px;
    text-transform:uppercase;

    margin-bottom:16px;
  }

  strong{
    display:block;

    font-size:30px;
    font-weight:900;
    line-height:1;

    color:white;

    margin-bottom:12px;

    text-shadow:
      0 8px 22px rgba(0,0,0,0.28);
  }

  span{
    display:block;

    font-size:13px;
    font-weight:700;

    color:rgba(255,255,255,0.88);
  }

  @media(max-width:768px){
    min-width:100%;
    padding:24px;
    border-radius:24px;

    strong{
      font-size:36px;
    }
  }
`;

const DashboardTime = styled.div`
  display:inline-flex;
  align-items:center;
  justify-content:center;

  padding:12px 14px;
  margin-bottom:10px;

  border-radius:18px;

  background:
    linear-gradient(
      135deg,
      #facc15,
      #f59e0b
    );

  color:#0f172a;

  font-size:20px;
  font-weight:900;
  letter-spacing:1px;

  box-shadow:
    0 12px 26px rgba(250,204,21,0.35);

  border:1px solid rgba(255,255,255,0.35);

  @media(max-width:768px){
    font-size:23px;
    padding:10px 16px;
  }
`;

const HeroTitle = styled.h1`
  font-size:34px;

  font-weight:800;

  color:#0f172a;

  margin-bottom:6px;

  line-height:1.2;

  @media(max-width:768px){

    font-size:26px;
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
  repeat(auto-fit,minmax(210px,1fr));

gap:14px;

margin-bottom:20px;
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

  border-radius:18px;

  padding:16px;

  background:#ef4444;

  color:white;

  font-size:15px;

  font-weight:700;

  cursor:pointer;

  transition:0.25s ease;

  display:flex;

  align-items:center;

  justify-content:center;

  gap:10px;

  &:hover{

  background:${props =>
    props.active
      ? "#2563eb"
      : "#eff6ff"};

  color:${props =>
    props.active
      ? "#fff"
      : "#2563eb"};
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

  background:white;

  padding:24px 18px;

  border-right:1px solid #eef2f7;

  display:flex;

  flex-direction:column;

  justify-content:space-between;

  position:fixed;

  left:0;

  top:0;

  height:100vh;

  overflow-y:auto;

  z-index:100;

  transition:0.3s ease;

  @media(max-width:768px){

    width:200px;

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

  margin-left:220px;

  padding:32px;

  min-height:100vh;

  background:#f5f7fb;

  overflow-x:hidden;

  @media(max-width:760px){

    margin-left:0;

    padding:24px 18px 20px;
  }
`;

const ProfileCard = styled.div`
  text-align:center;

  margin-bottom:24px;

  padding-bottom:20px;

  border-bottom:1px solid #e5e7eb;
`;

const ProfileImage = styled.img`
  width:85px;

  height:85px;

  border-radius:50%;

  object-fit:cover;

  margin:auto;

  margin-bottom:12px;

  border:5px solid #facc15;

  box-shadow:
    0 4px 12px rgba(0,0,0,0.08);
`;

const SidebarMenu = styled.div`
  display:flex;

  flex-direction:column;

  gap:2px;

  margin-top:6px;

  @media(max-width:760px){

    flex-direction:column;

    flex-wrap:nowrap;
  }
`;

const MenuItem = styled.div`
  display:flex;

  align-items:center;

  gap:14px;

  padding:12px 16px;

  border-radius:18px;

  font-size:12px;

  font-weight:700;

  cursor:pointer;

  transition:0.25s ease;

  color:${props =>
    props.active
      ? "#fff"
      : "#334155"};

  background:${props =>
    props.active
      ? "#2563eb"
      : "transparent"};

  margin-bottom:2px;

  &:hover{

    background:${props =>
      props.active
        ? "#2563eb"
        : "#eff6ff"};

    color:${props =>
      props.active
        ? "#fff"
        : "#2563eb"};
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

  margin-top:14px;

  flex-wrap:wrap;
`;

 const Button = styled.button`
  width:100%;

  border:none;

  border-radius:14px;

  padding:12px 16px;

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
`;



export default function Rider(){

  const [activeSection, setActiveSection] = useState("dashboard");

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

  const [riderProfileEditing,setRiderProfileEditing] =
  useState(false);

const [orders, setOrders] =
  useState([]);

  const visibleOrders =
  orders.filter(

    (o)=>

      o.status === "pending"

      ||

      o.rider?._id ===
      user?._id

      ||

      o.rider ===
      user?._id
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

  if(
    activeOrders.length > 0
  ){

    return "busy";
  }

  return user?.status || "available";
};

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

  socket.on(
    "newMessage",
    (data) => {

      console.log(
        "New message received:",
        data
      );

      if(data.type === "message"){

        setMessageInbox(
          (prev) => [
            {
              orderId:data.orderId,
              text:data.message || data.text,
              sender:data.sender,
              time:new Date()
                .toLocaleTimeString()
            },
            ...prev
          ]
        );

        playNotification();

        fetchOrders();

        return;
      }

      setNotifications(
        (prev) => [
          {
            text:
              data.message || data.text,

            sender:
              data.sender || "MonniDrop",

            time:
              new Date()
                .toLocaleTimeString()
          },

          ...prev
        ]
      );

      playNotification();

      fetchOrders();
    }
  );

  return () => {

    socket.off(
      "newMessage"
    );
  };

}, []);

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

      setUser(
        res.data.user ||
        res.data
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

 // ACCEPT ORDER

async function acceptOrder(orderId){

  try{

    if(!user){

      alert("Rider not loaded");

      return;
    }

    if(activeOrders.length > 0){

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

    await API.put(
      `/orders/${orderId}`,
      {
        rider:user._id,
        riderId:user._id,
        status:"accepted"
      }
    );

    setUser({
      ...user,
      status:"busy"
    });

    fetchOrders();

  }catch(err){

    console.log(err);

    alert("Accept failed");
  }
}

  //REJECT

 async function rejectOrder(orderId){

  try{

    await API.put(

      `/orders/${orderId}`,

      {
        status:"cancelled"
      }
    );

    alert(
      "Order cancelled successfully"
    );

    fetchOrders();

  }catch(err){

    console.log(err);

    alert(
      err.response?.data?.message ||
      "Failed to cancel order"
    );
  }
}

  //PICKUP

  async function pickupOrder(
    orderId
  ){

    try{

      await API.put(

        `/orders/${orderId}`,

        {
          status:"picked"
        }
      );

      fetchOrders();

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

      await API.put(

        `/orders/${orderId}`,

        {
          status:"delivering"
        }
      );

      fetchOrders();

    }catch(err){

      console.log(err);

      alert(
        "Start delivery failed"
      );
    }
  }

  //COMPLETE DELIVERY 

  async function completeDelivery(
    orderId
  ){

    try{

      await API.put(

        `/orders/${orderId}`,

        {
          status:"delivered"
        }
      );

      fetchOrders();

    }catch(err){

      console.log(err);

      alert(
        "Delivery failed"
      );
    }
  }

  //SEND MESSAGE 

  async function sendMessage(
    orderId,
    text
  ){

    try{

      if(!orderId){

        alert(
          "Order ID missing"
        );

        return;
      }

      if(
        !text ||
        text.trim() === ""
      ){

        return;
      }

      await API.post(

        `/orders/${orderId}/message`,

        {

          sender:"rider",

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

      alert(

        err.response?.data?.message ||

        "Failed to send message"
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

 <div
  style={{
    marginTop:"14px",
    marginBottom:"40px"
  }}
></div>

<div
  style={{
    marginTop:"10px"
  }}
>

  <input
    type="file"
  />

</div>

<div
  style={{
    marginTop:"14px"
  }}
>

</div>

<h3
  style={{
    display:"flex",
   alignItems:"flex-start",
    justifyContent:"center",
    gap:"8px",
    marginTop:"0px"
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
  MonniDrop v1.0.0
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

    <DashboardHero>

    <HeroLogo
      src={logo}
      alt="MonniDrop Logo"
    />

    <DashboardHeroContent>

      <div>

        <HeroBadge>
          ⚡ MonniDrop Rider Dashboard
        </HeroBadge>

        <DashboardHeroTitle>
          Welcome back,
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

      </div>

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

 <StatsGrid>

  <div
    style={{
      background:
        "linear-gradient(135deg, #0f172a, #1d4ed8)",
      padding:"16px",
      borderRadius:"18px",
      color:"white",
      border:"1px solid rgba(250,204,21,0.28)",
      boxShadow:
        "0 14px 32px rgba(29,78,216,0.20)",
      position:"relative",
      overflow:"hidden"
    }}
  >

    <div
      style={{
        width:"46px",
        height:"46px",
        borderRadius:"16px",
        background:"#facc15",
        color:"#0f172a",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        fontSize:"23px",
        marginBottom:"16px",
        fontWeight:"900"
      }}
    >
      🚚
    </div>

    <div
      style={{
        fontSize:"13px",
        color:"rgba(255,255,255,0.82)",
        fontWeight:"900",
        letterSpacing:"0.5px",
        textTransform:"uppercase"
      }}
    >
      Active Deliveries
    </div>

    <div
      style={{
        fontSize:"30px",
        fontWeight:"900",
        marginTop:"8px",
        color:"#facc15"
      }}
    >
      {activeOrders.length}
    </div>

    <div
      style={{
        fontSize:"13px",
        color:"rgba(255,255,255,0.78)",
        marginTop:"8px",
        fontWeight:"700",
        lineHeight:"1.4"
      }}
    >
      Orders you are currently handling.
    </div>

  </div>

  <div
    style={{
      background:
        "linear-gradient(135deg, #facc15, #f59e0b)",
      padding:"22px",
      borderRadius:"24px",
      color:"#0f172a",
      border:"1px solid rgba(15,23,42,0.12)",
      boxShadow:
        "0 14px 32px rgba(250,204,21,0.24)",
      position:"relative",
      overflow:"hidden"
    }}
  >

    <div
      style={{
        width:"36px",
        height:"36px",
        borderRadius:"16px",
        background:"#0f172a",
        color:"#facc15",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        fontSize:"17px",
        marginBottom:"16px",
        fontWeight:"900"
      }}
    >
      ✅
    </div>

    <div
      style={{
        fontSize:"13px",
        color:"#0f172a",
        fontWeight:"900",
        letterSpacing:"0.5px",
        textTransform:"uppercase"
      }}
    >
      Completed Deliveries
    </div>

    <div
      style={{
        fontSize:"42px",
        fontWeight:"900",
        marginTop:"8px",
        color:"#0f172a"
      }}
    >
      {completedOrders.length}
    </div>

    <div
      style={{
        fontSize:"13px",
        color:"#334155",
        marginTop:"8px",
        fontWeight:"800",
        lineHeight:"1.4"
      }}
    >
      Successful deliveries completed by you.
    </div>

  </div>

  <div
    style={{
      background:
        "linear-gradient(135deg, #0f172a, #111827)",
      padding:"22px",
      borderRadius:"24px",
      color:"white",
      border:"1px solid rgba(250,204,21,0.35)",
      boxShadow:
        "0 14px 32px rgba(15,23,42,0.24)",
      position:"relative",
      overflow:"hidden"
    }}
  >

    <div
      style={{
        width:"46px",
        height:"46px",
        borderRadius:"16px",
        background:"#facc15",
        color:"#0f172a",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        fontSize:"23px",
        marginBottom:"16px",
        fontWeight:"900"
      }}
    >
      ₵
    </div>

    <div
      style={{
        fontSize:"13px",
        color:"#facc15",
        fontWeight:"900",
        letterSpacing:"0.5px",
        textTransform:"uppercase"
      }}
    >
      Total Earnings
    </div>

    <div
      style={{
        fontSize:"42px",
        fontWeight:"900",
        marginTop:"8px",
        color:"#facc15"
      }}
    >
      ₵{earnings}
    </div>

    <div
      style={{
        fontSize:"13px",
        color:"rgba(255,255,255,0.76)",
        marginTop:"8px",
        fontWeight:"700",
        lineHeight:"1.4"
      }}
    >
      Total money earned from delivered orders.
    </div>

  </div>

</StatsGrid>

<div
  style={{
    display:"grid",
    gridTemplateColumns:"1.3fr 0.8fr",
    gap:"22px",
    alignItems:"start",
    marginBottom:"28px"
  }}
>

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

      <div
        style={{
          background:"#eff6ff",
          border:"1px solid #dbeafe",
          borderRadius:"18px",
          padding:"16px"
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
          {
            visibleOrders.filter(
              (o)=>o.status === "pending"
            ).length
          }
        </div>
      </div>

      <div
        style={{
          background:"#fefce8",
          border:"1px solid #fde68a",
          borderRadius:"18px",
          padding:"16px"
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
      </div>

      <div
        style={{
          background:"#f0fdf4",
          border:"1px solid #bbf7d0",
          borderRadius:"18px",
          padding:"16px"
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
          Completed
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
      </div>

    </div>

  </OrderCard>

  <OrderCard
    style={{
      background:
        "linear-gradient(135deg, #0f172a, #1d4ed8)",
      color:"white",
      border:"1px solid rgba(250,204,21,0.28)",
      boxShadow:
        "0 14px 32px rgba(29,78,216,0.18)"
    }}
  >

    <div
      style={{
        width:"50px",
        height:"50px",
        borderRadius:"18px",
        background:"#facc15",
        color:"#0f172a",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        fontSize:"24px",
        marginBottom:"16px"
      }}
    >
      🛵
    </div>

    <div
      style={{
        fontSize:"20px",
        fontWeight:"900",
        marginBottom:"8px"
      }}
    >
      Rider Status
    </div>

    <div
      style={{
        color:"rgba(255,255,255,0.80)",
        fontSize:"14px",
        fontWeight:"700",
        lineHeight:"1.5",
        marginBottom:"18px"
      }}
    >
      Stay online to receive delivery requests from customers.
    </div>

    <div
      style={{
        background:"rgba(255,255,255,0.12)",
        border:"1px solid rgba(255,255,255,0.18)",
        borderRadius:"16px",
        padding:"14px",
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

</div>

{

  orders.length === 0

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

      No orders available right now.

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
            visibleOrders.length
          } orders visible
        </div>

      </div>

      <OrdersGrid>

        {

          visibleOrders.map((o)=>(

            <OrderCard
              key={o._id}
              style={{
                background:
                  "linear-gradient(135deg, #ffffff, #f8fafc)",
                border:"1px solid rgba(29,78,216,0.10)",
                boxShadow:
                  "0 12px 28px rgba(15,23,42,0.06)"
              }}
            >

              <div
                style={{
                  display:"flex",
                  alignItems:"center",
                  justifyContent:"space-between",
                  gap:"12px",
                  marginBottom:"16px",
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
                      width:"44px",
                      height:"44px",
                      borderRadius:"16px",
                      background:
                        "linear-gradient(135deg, #0f172a, #1d4ed8)",
                      color:"#facc15",
                      display:"flex",
                      alignItems:"center",
                      justifyContent:"center",
                      fontSize:"21px",
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
                        fontSize:"17px"
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
                  padding:"12px",
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
                  padding:"12px"
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

              <div
                style={{
                  display:"grid",
                  gridTemplateColumns:"1fr 1fr",
                  gap:"10px",
                  marginTop:"12px"
                }}
              >

                <div
                  style={{
                    background:"#fefce8",
                    border:"1px solid #fde68a",
                    borderRadius:"14px",
                    padding:"12px"
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
                      fontSize:"18px",
                      fontWeight:"900"
                    }}
                  >
                    {o.distance} km
                  </div>
                </div>

                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #0f172a, #1d4ed8)",
                    border:"1px solid rgba(250,204,21,0.28)",
                    borderRadius:"14px",
                    padding:"12px"
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
                      fontSize:"18px",
                      fontWeight:"900"
                    }}
                  >
                    ₵{o.total}
                  </div>
                </div>

              </div>

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

                  <ButtonRow>

                    <Button
                      onClick={()=>

                        completeDelivery(
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

                      Delivered

                    </Button>

                  </ButtonRow>
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

    <Hero>
      <div>

        <HeroTitle>
          Active Deliveries 📦
        </HeroTitle>

        <HeroText>
          Your Current Assigned Deliveries.
        </HeroText>

      </div>
    </Hero>

    {activeOrders.length === 0 ? (

      <Empty>
        No active deliveries right now.
      </Empty>

    ) : (

      <OrdersGrid>

        {activeOrders.map((order) => (

          <OrderCard key={order._id}>

            <Row>
  <strong>Customer:</strong>
  {" "}
  {
    order.customer?.name ||
    "Unknown Customer"
  }
</Row>

<Row>
  <strong>Pickup:</strong>
  {" "}
  {
    order.pickupLocation
  }
</Row>

<Row>
  <strong>Dropoff:</strong>
  {" "}
  {
    order.dropoffLocation
  }
</Row>

<Row>
  <strong>Distance:</strong>
  {" "}
  {
    order.distance
  } km
</Row>

<Row>
  <strong>Amount:</strong>
  {" "}
  ₵{order.total}
</Row>
            <StatusBadge
              status={order.status}
            >
              {order.status}
            </StatusBadge>

          </OrderCard>

        ))}

      </OrdersGrid>

    )}

  </>
)}

{activeSection === "earnings" && (
  <>

    <Hero>
      <div>

        <HeroTitle>
          Earnings 💰
        </HeroTitle>

        <HeroText>
          Track your delivery income and completed jobs.
        </HeroText>

      </div>
    </Hero>

    <StatsGrid>

      <StatCard>
        <StatTitle>
          Total Earnings
        </StatTitle>

        <StatValue>
          ₵{earnings}
        </StatValue>
      </StatCard>

      <StatCard>
        <StatTitle>
          Completed Orders
        </StatTitle>

        <StatValue>
          {completedOrders.length}
        </StatValue>
      </StatCard>

    </StatsGrid>

  </>
)}

{activeSection === "messages" && (
  <>

    <Hero>
      <div>

        <HeroTitle>
          Messages 💬
        </HeroTitle>

        <HeroText>
          Customer messages from your deliveries.
        </HeroText>

      </div>
    </Hero>

    {messageInbox.length === 0 ? (

      <Empty>
        No messages yet.
      </Empty>

    ) : (

      <OrdersGrid>

        {messageInbox.map(
          (msg,index) => (

            <OrderCard key={index}>

              <Row>
                <strong>
                  From:
                </strong>
                {" "}
                {
                  msg.sender === "customer"
                  ? "Customer"
                  : msg.sender
                }
              </Row>

              <Row>
                {msg.text}
              </Row>

              <StatusBadge>
                {msg.time}
              </StatusBadge>

            </OrderCard>
          )
        )}

      </OrdersGrid>

    )}

  </>
)}

{activeSection === "notifications" && (
  <>

    <Hero>
      <div>

        <HeroTitle>
          Notifications 🔔
        </HeroTitle>

        <HeroText>
          Stay updated with delivery alerts and messages.
        </HeroText>

      </div>
    </Hero>

    {notifications.length === 0 ? (

      <Empty>
        No new notifications yet.
      </Empty>

    ) : (

      <OrdersGrid>

        {notifications.map(
          (note, index) => (

            <OrderCard key={index}>

              <Row>
                <strong>
                  {note.sender}
                </strong>
              </Row>

              <Row>
                {note.text}
              </Row>

              <StatusBadge
                status="delivered"
              >
                {note.time}
              </StatusBadge>

            </OrderCard>
          )
        )}

      </OrdersGrid>

    )}

  </>
)}

{activeSection === "profile" && (

  <OrderCard
    style={{
      maxWidth:"1000px",
      margin:"0 auto",
      padding:"44px 42px",
      borderRadius:"30px",
      minHeight:"620px"
    }}
  >

    <ProfileImage
      src={
        selectedProfileImage ||
        riderImage
      }

      
      alt="Rider"
      style={{
        width:"150px",
        height:"150px",
        border:"8px solid #facc15",
        marginBottom:"28px"
      }}
      
    />
     <input
     type="file"
    accept="image/*"
    onChange={(e)=>{
      const file = e.target.files[0];

       if(file){
         setSelectedProfileImage(
      URL.createObjectURL(file)
     );
    }
    }}
    />

    <HeroTitle
  style={{
    fontSize:"42px",
    marginBottom:"10px"
  }}
>
  Rider Profile
</HeroTitle>

<Button
  style={{
    width:"140px",
    padding:"10px",
    fontSize:"14px",
    borderRadius:"12px",
    marginBottom:"20px",
    background:"#2563eb"
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
        motorNumber:motorNumber
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
    ? "Save Profile"
    : "Edit Profile"
  }
</Button>


    <HeroText
      style={{
        fontSize:"20px",
        marginBottom:"50px"
      }}
    >
      View and manage your rider information.
    </HeroText>

    <div
      style={{
        display:"grid",
        gridTemplateColumns:"1fr 1fr",
        gap:"40px",
        width:"100%"
      }}
    >

      <div>

        <Row style={{fontSize:"20px",marginBottom:"24px"}}>

          <strong>Name:</strong>
           {user?.name || "Rider"}
        </Row>

        <Row style={{fontSize:"20px",marginBottom:"24px"}}>

          <strong>Email:</strong> 
          {user?.email || "No email"}
        </Row>

        <Row style={{fontSize:"20px",marginBottom:"24px"}}>
          <strong>Phone:</strong> {user?.phone || "No phone"}
        </Row>

        <Row style={{fontSize:"20px",marginBottom:"40px"}}>
          <strong>Status:</strong>{" "}
          {
            riderAvailability === "online"
            ? "Online 🟢"
            : "Offline 🔴"
          }
        </Row>

        {
  riderProfileEditing

  ?

  <>

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
        padding:"14px",
        borderRadius:"12px",
        border:"1px solid #d1d5db",
        marginBottom:"20px",
        fontSize:"16px"
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
        padding:"14px",
        borderRadius:"12px",
        border:"1px solid #d1d5db",
        marginBottom:"20px",
        fontSize:"16px"
      }}
    />

  </>

  :

  <>

    <Row style={{fontSize:"20px",marginBottom:"24px"}}>
      <strong>Date of Birth:</strong>{" "}
      {riderDOB || "Not added"}
    </Row>

    <Row style={{fontSize:"20px",marginBottom:"24px"}}>
      <strong>Emergency Contact:</strong>{" "}
      {riderEmergency || "Not added"}
    </Row>

    <Row style={{fontSize:"20px",marginBottom:"24px"}}>
  <strong>Motor Number:</strong>{" "}
  {motorNumber || "Not added"}
</Row>

  </>
}

        <Button
          style={{
            width:"190px",
            padding:"16px",
            fontSize:"20px",
            borderRadius:"16px",
            background:
              riderAvailability === "online"
              ? "#dc2626"
              : "#16a34a"
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
        

      </div>

      </div>

  </OrderCard>

)}

    </Main>

  </Layout>
);
}
  
