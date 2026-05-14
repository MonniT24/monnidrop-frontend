import React,{
  useEffect,
  useState
} from "react";

import styled from "styled-components";

import API from "../api/api";

import {
  FiHome,
  FiGrid,
  FiBarChart,
  FiBarChart2,
  FiPackage,
  FiClock,
  FiTruck,
  FiUser,
  FiLogOut,
  FiSettings
} from "react-icons/fi";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from "react-leaflet";


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

const Logout = styled.button`
  margin-left:auto;

  background:#dc2626;

  color:white;

  border:none;

  padding:10px 16px;

  border-radius:10px;

  cursor:pointer;

  font-weight:700;
`;

const Wrapper = styled.div`
  max-width:1200px;
  margin:auto;
  padding:20px;
`;

const Stats = styled.div`
  display:grid;

  grid-template-columns:repeat(
    auto-fit,
    minmax(220px,1fr)
  );

  gap:15px;

  margin-bottom:20px;
`;

const StatCard = styled.div`
  background:white;

  border-radius:16px;

  padding:18px;

  box-shadow:
    0 4px 14px
    rgba(0,0,0,0.06);
`;

const StatTitle = styled.div`
  font-size:13px;
  color:#64748b;
`;

const StatValue = styled.div`
  font-size:28px;
  font-weight:800;
  margin-top:5px;
`;

const Section = styled.div`
  background:white;

  border-radius:18px;

  padding:18px;

  margin-bottom:20px;

  box-shadow:
    0 4px 14px
    rgba(0,0,0,0.06);
`;

const OrderCard = styled.div`
  background:#f8fafc;

  border-radius:14px;

  padding:14px;

  margin-bottom:14px;

  border-left:4px solid #facc15;
`;

const Row = styled.div`
  margin-bottom:8px;
`;

const Badge = styled.div`
  display:inline-block;

  padding:6px 12px;

  border-radius:30px;

  color:white;

  font-size:11px;

  font-weight:700;

  background:${props=>

    props.status === "delivered"
    ? "#16a34a"

    : props.status === "in_progress"
    ? "#2563eb"

    : props.status === "assigned"
    ? "#f59e0b"

    : props.status === "pending"
    ? "#dc2626"

    : "#64748b"
  };
`;

const RiderCard = styled.div`
  background:#f8fafc;

  border-radius:14px;

  padding:14px;

  margin-bottom:14px;

  border-left:4px solid #2563eb;
`;

const Empty = styled.div`
  text-align:center;

  padding:30px;

  color:#64748b;
`;

const TopBar = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:20px;
  flex-wrap:wrap;
  gap:15px;
`;

const LiveBadge = styled.div`
  background:#16a34a;
  color:white;
  padding:8px 14px;
  border-radius:999px;
  font-size:12px;
  font-weight:800;
  animation:blink 1s infinite;

  @keyframes blink{

    0%{
      opacity:1;
    }

    50%{
      opacity:0.4;
    }

    100%{
      opacity:1;
    }
  }
`;

const Grid = styled.div`
  display:grid;
  grid-template-columns:
    repeat(auto-fit,minmax(350px,1fr));
  gap:20px;
`;

const SectionTitle = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:15px;
`;

const CountBadge = styled.div`
  background:#111827;
  color:white;
  padding:6px 12px;
  border-radius:999px;
  font-size:12px;
  font-weight:700;
`;


export default function Admin(){

  const [orders,setOrders] =
    useState([]);

  const [riders,setRiders] =
    useState([]);

  const [user,setUser] =
    useState(null);

  

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

    console.log(
      "RIDERS:",
      res.data
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



  function logout(){

    localStorage.clear();

    window.location.href =
      "/login";
  }

  

  const totalOrders =
    orders.length;

  const activeOrders =
    orders.filter(

      (o)=>

        o.status ===
        "assigned"

        ||

        o.status ===
        "in_progress"
    );

  const deliveredOrders =
    orders.filter(

      (o)=>

        o.status ===
        "delivered"
    );

  const pendingOrders =
    orders.filter(

      (o)=>

        o.status ===
        "pending"
    );

  const totalRevenue =
    deliveredOrders.reduce(

      (total,o)=>

        total +
        Number(o.total || 0),

      0
    );



  return(

    <Page>

      <Header>

        <Logo
          src="/mylogo.png"
          alt="logo"
        />

        <HeaderText>

          <Title>
            Admin Dashboard
          </Title>

          <Welcome>

            Welcome,
            {" "}
            {
              user?.name ||
              "Admin"
            }

          </Welcome>

        </HeaderText>

        <Logout
          onClick={logout}
        >
          Logout
        </Logout>

      </Header>

      <Wrapper>

        <TopBar>

  <div>

    <h2
      style={{
        marginBottom:"5px"
      }}
    >
      MonniDrop Control Center
    </h2>

    <div
      style={{
        color:"#64748b",
        fontSize:"14px"
      }}
    >
      Live delivery monitoring dashboard
    </div>

  </div>

  <LiveBadge>

    ● SYSTEM LIVE

  </LiveBadge>

</TopBar>

        <Stats>

          <StatCard>

            <StatTitle>
              Total Orders
            </StatTitle>

            <StatValue>
              {totalOrders}
            </StatValue>

          </StatCard>

          <StatCard>

            <StatTitle>
              Active Orders
            </StatTitle>

            <StatValue>
              {
                activeOrders.length
              }
            </StatValue>

          </StatCard>

          <StatCard>

            <StatTitle>
              Delivered Orders
            </StatTitle>

            <StatValue>
              {
                deliveredOrders.length
              }
            </StatValue>

          </StatCard>

          <StatCard>

            <StatTitle>
              Pending Orders
            </StatTitle>

            <StatValue>
              {
                pendingOrders.length
              }
            </StatValue>

          </StatCard>

          <StatCard>

            <StatTitle>
              Revenue
            </StatTitle>

            <StatValue>
              ₵{
                totalRevenue
              }
            </StatValue>

          </StatCard>

        </Stats>


        <Grid>

  {/* ================= RIDERS ================= */}

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
                r.status ===
                "available"

                ? "delivered"

                : r.status ===
                "busy"

                ? "assigned"

                : "pending"
              }
            >
              {r.status}
            </Badge>

          </RiderCard>
        ))
      )
    }

  </Section>

       {/* ================= ORDERS ================= */}

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
              o.customer?.name
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