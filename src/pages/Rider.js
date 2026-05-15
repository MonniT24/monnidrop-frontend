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
    repeat(auto-fit,minmax(240px,1fr));

  gap:24px;

  margin-bottom:34px;
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


 const [user, setUser] =
  useState(null);

  const [riderDOB,setRiderDOB] =
  useState("");

const [riderEmergency,setRiderEmergency] =
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

const [previousOrders,
  setPreviousOrders] =
    useState([]);

const [previousMessages,
  setPreviousMessages] =
    useState({});

    const getGreeting = () => {

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

useEffect(()=>{

  fetchMe();

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

      setNotifications(
  (prev) => [
    {
      text:
        data.message || data.text,

      sender:
        data.sender,

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

  if(!user){
    return;
  }

  if(navigator.geolocation){

    navigator.geolocation.watchPosition(

      (position)=>{

       socket.emit(
  "riderLocation",
  {

    lat:
      position.coords.latitude,

    lng:
      position.coords.longitude,

    riderId:
      user._id
  }
);
      },

      (error)=>{

        console.log(error);

      },

      {
        enableHighAccuracy:true
      }
    );
  }

},[user]);

useEffect(()=>{

  if(user){

    setRiderDOB(
      user.dob || ""
    );

    setRiderEmergency(
      user.emergencyContact || ""
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
  src={riderImage}
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
        status={user?.status}
      >

        {

          user?.status ===
          "busy"

          ?

          "BUSY"

          :

          user?.status ===
          "offline"

          ?

          "OFF-DUTY"

          :

          "AVAILABLE"
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

  <div
  style={{
    width:"100%",
    marginBottom:"20px",
    borderRadius:"20px",
    overflow:"hidden",
    background:"white",
    padding:"8px 16px",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    boxShadow:
      "0 6px 18px rgba(0,0,0,0.08)"
  }}
>

  <img
    src={logo}
    alt="Logo Banner"
    style={{
      width:"250px",
      maxWidth:"100%",
      objectFit:"contain",
      display:"block"
    }}
  />

</div>

  <div
  style={{
    display:"flex",
    justifyContent:"center",
    marginBottom:"28px"
  }}
>



</div>

  <Hero>

  <div
    style={{
      display:"flex",
      alignItems:"center",
      gap:"18px"
    }}
  >

    <img
      src={logo}
      alt="Logo"
      style={{
        width:"70px",
        height:"70px",
        objectFit:"contain",
        borderRadius:"18px",
        background:"white",
        padding:"8px",
        boxShadow:
          "0 4px 12px rgba(0,0,0,0.08)"
      }}
    />

    <div>

     <HeroTitle>

  {getGreeting()},

  {" "}

  {
    user?.name || "Rider"
  }

  !

  👋

</HeroTitle>

      <HeroText>
        Here's your delivery overview
      </HeroText>

    </div>

  </div>

  <div
    style={{
      display:"flex",
      alignItems:"center",
      gap:"16px",
      flexWrap:"wrap"
    }}
  >

    <RiderStatus
      status={user?.status}
    >

      {

        user?.status ===
        "busy"

        ?

        "BUSY"

        :

        user?.status ===
        "offline"

        ?

        "OFF DUTY"

        :

        "AVAILABLE"
      }

    </RiderStatus>

    <DateCard>

      📅

      {
        new Date()
        .toLocaleDateString(
          "en-US",
          {
            month:"long",
            day:"numeric",
            year:"numeric"
          }
        )
      }

    </DateCard>

  </div>

</Hero>
  <StatsGrid>

  <div
    style={{
      background:"white",
      padding:"20px",
      borderRadius:"16px",
      textAlign:"center"
    }}
  >

    <div
      style={{
        fontSize:"14px",
        color:"#64748b"
      }}
    >
      Active Deliveries
      
      </div>
  

    <div
      style={{
        fontSize:"32px",
        fontWeight:"800",
        marginTop:"8px",
        color:"#2563eb"
      }}
    >
      {
        activeOrders.length
      }
    </div>

  </div>

  <div
    style={{
      background:"white",
      padding:"20px",
      borderRadius:"16px",
      textAlign:"center"
    }}
  >

    <div
      style={{
        fontSize:"14px",
        color:"#64748b"
      }}
    >
      Completed Deliveries
    </div>

    <div
      style={{
        fontSize:"32px",
        fontWeight:"800",
        marginTop:"8px"
      }}
    >
      {
        completedOrders.length
      }
    </div>

  </div>

  <div
    style={{
      background:"white",
      padding:"20px",
      borderRadius:"16px",
      textAlign:"center"
    }}
  >

    <div
      style={{
        fontSize:"14px",
        color:"#64748b"
      }}
    >
      Total Earnings
    </div>

    <div
      style={{
        fontSize:"32px",
        fontWeight:"800",
        marginTop:"8px",
        color:"#16a34a"
      }}
    >
     ₵{earnings}
    </div>

  </div>


</StatsGrid>

        {

          orders.length === 0

          ?

          (

            <Empty>

              No orders available

            </Empty>

          )

          :
          (

        <OrdersGrid>

        {

    visibleOrders.map((o)=>(

      <OrderCard
        key={o._id}
      >

        <Row>
          <strong>
            Customer:
          </strong>{" "}
          {
            o.customer?.name ||
            "Unknown Customer"
          }
        </Row>

        <Row>
          <strong>
            Rider:
          </strong>{" "}
          {
            o.rider?.name ||
            "No Rider Yet"
          }
        </Row>

        <Row>
          <strong>
            Pickup:
          </strong>{" "}
          {
            o.pickupLocation
          }
        </Row>

        <Row>
          <strong>
            Dropoff:
          </strong>{" "}
          {
            o.dropoffLocation
          }
        </Row>

        <Row>
          <strong>
            Distance:
          </strong>{" "}
          {
            o.distance
          } km
        </Row>

        <Row>
          <strong>
            Amount:
          </strong>{" "}
          ₵{o.total}
        </Row>

        <StatusBadge
          status={o.status}
        >
          {o.status}
        </StatusBadge>

        {/* ================= CHAT ================= */}

        {
          o.customer && (

            <>

              <ButtonRow>

                <Button

                  color="#2563eb"

                  onClick={()=>{

                    setOpenChats({

                      ...openChats,

                      [o._id]:
                        !openChats[o._id]
                    });
                  }}
                >

                  💬 Chat Customer

                </Button>

              </ButtonRow>

              {

                openChats[o._id] && (

                  <div
                    style={{
                      marginTop:"12px",
                      background:"#f8fafc",
                      padding:"15px",
                      borderRadius:"12px"
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

                                      msg.sender ===
                                      "rider"

                                      ?

                                      "#dbeafe"

                                      :

                                      "#dcfce7",

                                    padding:"10px",

                                    borderRadius:"10px",

                                    marginBottom:"8px"
                                  }}
                                >

                                  <strong>

                                    {

                                      msg.sender ===
                                      "rider"

                                      ?

                                      "You"

                                      :

                                      "Customer"
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
                          padding:"12px",
                          borderRadius:"10px",
                          border:"1px solid #d1d5db"
                        }}
                      />

                      <Button

                        color="#2563eb"

                        onClick={()=>{

                          sendMessage(

                            o._id,

                            chatText[o._id]
                          );
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

        {/* ================= PENDING ================= */}

        {
          o.status ===
          "pending"

          &&

          user?.status !==
          "busy"

          && (

            <ButtonRow>

              <Button

                color="#16a34a"

                onClick={()=>

                  acceptOrder(
                    o._id
                  )
                }
              >

                Accept Order

              </Button>

              <Button

  color="#dc2626"

  onClick={()=>

    rejectOrder(
      o._id
    )
  }
>

  Reject

</Button>

            </ButtonRow>
          )
        }

        {/* ================= ASSIGNED ================= */}

        {
          o.status ===
          "accepted"

          && (

            <ButtonRow>

              <Button

                color="#2563eb"

                onClick={()=>

                  pickupOrder(
                    o._id
                  )
                }
              >

                Item Picked

              </Button>

            </ButtonRow>
          )
        }

        {/* ================= PICKED ================= */}

        {
          o.status ===
          "picked"

          && (

            <ButtonRow>

              <Button

                color="#7c3aed"

                onClick={()=>

                  startDelivery(
                    o._id
                  )
                }
              >

                Start Delivery

              </Button>

            </ButtonRow>
          )
        }

        {/* DELIVERING  */}

        {
          o.status ===
          "delivering"

          && (

            <ButtonRow>

              <Button

                color="#16a34a"

                onClick={()=>

                  completeDelivery(
                    o._id
                  )
                }
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
              emergencyContact:riderEmergency
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
  
