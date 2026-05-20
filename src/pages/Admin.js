import React,{
  useEffect,
  useState
} from "react";

import styled,{
  createGlobalStyle
} from "styled-components";

import API from "../api/api";
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

  border:1px solid #e5e7eb;

  box-shadow:
    0 8px 22px rgba(15,23,42,0.045);

  position:relative;
  overflow:hidden;

  transition:0.25s ease;

  &::before{
    content:"";
    position:absolute;
    top:0;
    left:0;
    right:0;
    height:4px;
    background:#facc15;
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

  background:#eff6ff;
  color:#1d4ed8;

  font-size:20px;
  font-weight:900;

  margin-bottom:14px;

  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.8);
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
    props.light
    ? "white"
    : "linear-gradient(135deg,#111827,#1e293b)"};

  color:${props =>
    props.light
    ? "#0f172a"
    : "white"};

  border-radius:24px;
  padding:22px;

  border:${props =>
    props.light
    ? "1px solid #e5e7eb"
    : "1px solid rgba(250,204,21,0.18)"};

  box-shadow:
    0 10px 28px rgba(15,23,42,0.08);
`;

const AnalyticsLabel = styled.div`
  font-size:13px;
  color:${props =>
    props.light
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
    props.light
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
    props.light
    ? "#64748b"
    : "#e2e8f0"};

  font-weight:700;
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

const Grid = styled.div`
  display:grid;
  grid-template-columns:
    repeat(auto-fit,minmax(330px,1fr));
  gap:18px;

  @media(max-width:520px){
    grid-template-columns:1fr;
  }
`;

const Section = styled.div`
  background:white;

  border-radius:22px;

  padding:18px;

  margin-bottom:20px;

  border:1px solid #e5e7eb;

  box-shadow:
    0 8px 24px rgba(15,23,42,0.05);
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

const OrderCard = styled.div`
  background:#f8fafc;

  border-radius:16px;

  padding:14px;

  margin-bottom:14px;

  border:1px solid #e5e7eb;
  border-left:4px solid #facc15;
`;

const RiderCard = styled.div`
  background:#f8fafc;

  border-radius:16px;

  padding:14px;

  margin-bottom:14px;

  border:1px solid #e5e7eb;
  border-left:4px solid #2563eb;
`;

const Row = styled.div`
  margin-bottom:8px;
  color:#334155;
  font-size:14px;
  line-height:1.45;

  strong{
    color:#0f172a;
  }
`;

const Badge = styled.div`
  display:inline-flex;
  align-items:center;
  justify-content:center;

  padding:7px 12px;

  border-radius:999px;

  color:white;

  font-size:11px;

  font-weight:900;

  text-transform:uppercase;

  background:${props=>

    props.status === "delivered"
    ? "#16a34a"

    : props.status === "in_progress"
    ? "#2563eb"

    : props.status === "assigned"
    ? "#f59e0b"

    : props.status === "pending"
    ? "#dc2626"

    : props.status === "accepted"
    ? "#2563eb"

    : props.status === "picked"
    ? "#7c3aed"

    : props.status === "delivering"
    ? "#0ea5e9"

    : props.status === "cancelled" ||
      props.status === "canceled"
    ? "#dc2626"

    : "#64748b"
  };
`;

const Empty = styled.div`
  text-align:center;

  padding:28px;

  color:#64748b;

  font-size:14px;
  font-weight:700;
`;

const ActionButton = styled.button`
  border:none;
  border-radius:12px;

  padding:10px 14px;

  background:${props =>
    props.green
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

export default function Admin(){

  const [orders,setOrders] =
    useState([]);

  const [riders,setRiders] =
    useState([]);

  const [user,setUser] =
    useState(null);

  const [currentTime,setCurrentTime] =
    useState(new Date());

  const [liveRiders,setLiveRiders] =
    useState({});

  useEffect(()=>{

    fetchUser();

    fetchOrders();

    fetchRiders();

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
                  Monitor orders, riders, revenue, fraud alerts,
                  and live delivery movement from one clean admin dashboard.
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

          <StatCard>

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
    Revenue from completed deliveries.
  </StatSmall>

</StatCard>

          <StatCard>

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
              All orders created on MonniDrop.
            </StatSmall>

          </StatCard>

          <StatCard>

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
              Accepted, picked, or delivering.
            </StatSmall>

          </StatCard>

          <StatCard>

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
              Orders successfully completed.
            </StatSmall>

          </StatCard>

          <StatCard>

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
              Orders waiting for riders.
            </StatSmall>

          </StatCard>

          <StatCard>

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
              Suspicious cancellation activity.
            </StatSmall>

          </StatCard>

        </Stats>

        <AnalyticsGrid>

         <AnalyticsCard light>

  <AnalyticsLabel light>
    Delivered Orders
  </AnalyticsLabel>

  <AnalyticsValue>
    {deliveredPercent}%
  </AnalyticsValue>

  <ProgressTrack light>

    <ProgressFill
      width={`${deliveredPercent}%`}
      color="#22c55e"
    />

  </ProgressTrack>

  <MiniText light>

    {deliveredOrders.length}
    {" "}of{" "}
    {totalOrders}
    {" "}orders delivered

  </MiniText>

</AnalyticsCard>

          <AnalyticsCard light>

            <AnalyticsLabel light>
              Active Deliveries
            </AnalyticsLabel>

            <AnalyticsValue>
              {activePercent}%
            </AnalyticsValue>

            <ProgressTrack light>

              <ProgressFill
                width={`${activePercent}%`}
                color="#2563eb"
              />

            </ProgressTrack>

            <MiniText light>

              {activeOrders.length}
              {" "}orders currently moving

            </MiniText>

          </AnalyticsCard>

          <AnalyticsCard light>

            <AnalyticsLabel light>
              Pending Orders
            </AnalyticsLabel>

            <AnalyticsValue>
              {pendingPercent}%
            </AnalyticsValue>

            <ProgressTrack light>

              <ProgressFill
                width={`${pendingPercent}%`}
                color="#f59e0b"
              />

            </ProgressTrack>

            <MiniText light>

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
                5.6037,
                -0.1870
              ]}
              zoom={11}
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

        <Grid>

          <Section>

            <SectionTitle>

              <h3>
                Fraud / Cancel Monitoring
              </h3>

              <CountBadge>
                {fraudOrders.length} Alerts
              </CountBadge>

            </SectionTitle>

            {
              fraudOrders.length === 0
              ? (

                <Empty>
                  No suspicious cancellations found
                </Empty>

              ) : (

                fraudOrders.map((o)=>(

                  <OrderCard key={o._id}>

                    <Row>
                      <strong>Customer:</strong>{" "}
                      {o.customer?.name || "Unknown"}
                    </Row>

                    <Row>
                      <strong>Phone:</strong>{" "}
                      {o.customer?.phone || "N/A"}
                    </Row>

                    <Row>
                      <strong>Pickup:</strong>{" "}
                      {o.pickupLocation}
                    </Row>

                    <Row>
                      <strong>Dropoff:</strong>{" "}
                      {o.dropoffLocation}
                    </Row>

                    <Row>
                      <strong>Cancel Count:</strong>{" "}
                      {
                        o.cancelCount ||
                        o.customerCancelCount ||
                        o.riderCancelCount ||
                        1
                      }
                    </Row>

                    <Row>
                      <strong>Reason:</strong>{" "}
                      {o.cancelReason || "No reason provided"}
                    </Row>

                    <Badge status="pending">
                      Suspicious Cancel
                    </Badge>

                  </OrderCard>
                ))
              )
            }

          </Section>

          <Section>

            <SectionTitle>

              <h3>
                Riders Activity
              </h3>

              <CountBadge>
                {riders.length} Riders
              </CountBadge>

            </SectionTitle>

            {
              riders.length === 0
              ? (

                <Empty>
                  No riders found
                </Empty>

              ) : (

                riders.map((r)=>(

                  <RiderCard
                    key={r._id}
                  >

                    <Row>
                      <strong>
                        Rider:
                      </strong>{" "}
                      {r.name}
                    </Row>

                    <Row>
                      <strong>
                        Phone:
                      </strong>{" "}
                      {r.phone}
                    </Row>

                    <Row>
                      <strong>
                        Current Order:
                      </strong>{" "}

                      {
                        r.currentOrder
                        ? "Busy on delivery"
                        : "No active order"
                      }

                    </Row>

                    <Badge
                      status={
                        orders.some(
                          (o)=>
                            o.rider?._id === r._id &&
                            [
                              "accepted",
                              "picked",
                              "delivering"
                            ].includes(o.status)
                        )
                        ? "assigned"
                        : r.status === "suspended"
                        ? "pending"
                        : "delivered"
                      }
                    >
                      {
                        orders.some(
                          (o)=>
                            o.rider?._id === r._id &&
                            [
                              "accepted",
                              "picked",
                              "delivering"
                            ].includes(o.status)
                        )
                        ? "busy"
                        : r.status
                      }
                    </Badge>

                    <div
                      style={{
                        marginTop:"14px",
                        display:"flex",
                        gap:"10px",
                        flexWrap:"wrap"
                      }}
                    >

                      {
                        r.status === "suspended"

                        ?

                        <ActionButton
                          green
                          onClick={()=>
                            unsuspendRider(
                              r._id
                            )
                          }
                        >
                          Reactivate Rider
                        </ActionButton>

                        :

                        <ActionButton
                          onClick={()=>
                            suspendRider(
                              r._id
                            )
                          }
                        >
                          Suspend Rider
                        </ActionButton>
                      }

                    </div>

                  </RiderCard>
                ))
              )
            }

          </Section>

          <Section>

            <SectionTitle>

              <h3>
                Orders Monitoring
              </h3>

              <CountBadge>
                {orders.length} Orders
              </CountBadge>

            </SectionTitle>

            {
              orders.length === 0
              ? (

                <Empty>
                  No orders yet
                </Empty>

              ) : (

                orders.map((o)=>(

                  <OrderCard
                    key={o._id}
                  >

                    <Row>
                      <strong>
                        Customer:
                      </strong>{" "}
                      {
                        o.customer?.name || "Unknown"
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
                      ₵{
                        o.total
                      }
                    </Row>

                    <Row>
                      <strong>
                        Rider:
                      </strong>{" "}

                      {
                        o.rider
                        ? o.rider.name
                        : "Waiting..."
                      }

                    </Row>

                    <Badge
                      status={o.status}
                    >
                      {o.status}
                    </Badge>

                  </OrderCard>
                ))
              )
            }

          </Section>

        </Grid>

      </Wrapper>

    </Page>
  );
}