import React,{useState,useEffect} from "react";
import styled from "styled-components";

import API from "../api/api";
import socket from "../socket";

import customerImage from "../assets/customer.png";
import logo from "../assets/logo.png";

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

const Layout = styled.div`
  display:flex;
  min-height:100vh;
  background:#f5f7fb;
`;

const Sidebar = styled.div`
  width:220px;
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
    left:${props => props.open ? "0" : "-100%"};
  }
`;

const Main = styled.div`
  flex:1;
  margin-left:220px;
  padding:32px;
  min-height:100vh;
  background:#f5f7fb;

  @media(max-width:768px){
    margin-left:0;
    padding:24px 18px;
  }
`;

const MobileMenuButton = styled.button`
  display:none;

  @media(max-width:768px){
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
  }
`;

const CloseButton = styled.button`
  display:none;

  @media(max-width:768px){
    display:flex;
    align-items:center;
    justify-content:center;
    align-self:flex-end;
    width:32px;
    height:32px;
    border:none;
    border-radius:10px;
    background:#dc2626;
    color:white;
    cursor:pointer;
    margin-bottom:20px;
  }
`;

const ProfileCard = styled.div`
  text-align:center;
  margin-bottom:24px;
  padding-bottom:20px;
  border-bottom:1px solid #e5e7eb;
`;

const ProfileImage = styled.img`
  width:90px;
  height:90px;
  border-radius:50%;
  object-fit:cover;
  margin:auto;
  margin-bottom:12px;
  border:5px solid #2563eb;
`;

const SidebarMenu = styled.div`
  display:flex;
  flex-direction:column;
`;

const MenuItem = styled.div`
  display:flex;
  align-items:center;
  gap:12px;
  padding:12px 16px;
  border-radius:16px;
  cursor:pointer;
  font-size:15px;
  font-weight:700;
  margin-bottom:4px;

  background:${props =>
    props.active
      ? "#2563eb"
      : "transparent"};

  color:${props =>
    props.active
      ? "#fff"
      : "#334155"};

  transition:0.25s ease;

  @media(max-width:768px){

  padding:10px 14px;
  gap:10px;
}

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

const LogoutButton = styled.button`
  width:100%;
  border:none;
  border-radius:16px;
  padding:14px;
  background:#ef4444;
  color:white;
  font-weight:700;
  cursor:pointer;
  margin-top:10px;
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

const OrdersGrid = styled.div`
  display:grid;
  grid-template-columns:
    repeat(auto-fit,minmax(320px,1fr));
  gap:18px;
`;

const CreateOrderWrapper = styled.div`
  background:white;
  border-radius:32px;
  padding:28px;
  box-shadow:
    0 8px 30px rgba(0,0,0,0.05);
`;

const CreateOrderTitle = styled.h2`
  font-size:34px;
  font-weight:800;
  color:#0f172a;
  margin-bottom:8px;
`;

const CreateOrderSubtext = styled.p`
  color:#64748b;
  font-size:15px;
  margin-bottom:28px;
`;

const OrderSection = styled.div`
  background:#f8fafc;
  border-radius:24px;
  padding:24px;
  margin-bottom:22px;
  border:1px solid #e5e7eb;
`;

const SectionHeader = styled.div`
  display:flex;
  align-items:center;
  gap:14px;
  margin-bottom:18px;
`;

const StepCircle = styled.div`
  width:42px;
  height:42px;
  border-radius:50%;
  background:#facc15;
  color:#111827;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:800;
  font-size:18px;
`;

const SectionTitle = styled.h3`
  font-size:24px;
  font-weight:700;
  color:#0f172a;
`;

const BeautifulInput = styled.input`
  width:100%;
  padding:18px 20px;
  border-radius:18px;
  border:1px solid #dbe4ee;
  background:white;
  font-size:16px;
  outline:none;
  transition:0.25s ease;
  margin-top:12px;

  &:focus{
    border-color:#facc15;
    box-shadow:
      0 0 0 4px rgba(250,204,21,0.2);
  }
`;

const FareBox = styled.div`
  background:#fefce8;
  border:1px solid #fde68a;
  border-radius:22px;
  padding:22px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-top:20px;
  flex-wrap:wrap;
  gap:12px;
`;

const FareAmount = styled.div`
  font-size:34px;
  font-weight:800;
  color:#111827;
`;

const ConfirmButton = styled.button`
  width:220px;
  border:none;
  border-radius:18px;
  padding:16px;
  margin-top:28px;
  background:linear-gradient(
    90deg,
    #111827,
    #facc15
  );
  color:white;
  font-size:16px;
  font-weight:800;
  cursor:pointer;
  transition:0.3s ease;

  &:hover{
    transform:translateY(-2px);
  }
`;

const OrderCard = styled.div`
  background:white;
  border-radius:24px;
  padding:24px;
  box-shadow:
    0 6px 20px rgba(0,0,0,0.05);
`;

const Row = styled.div`
  margin-bottom:10px;
  color:#374151;
  font-size:15px;
`;

const StatusBadge = styled.div`
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:10px 18px;
  border-radius:999px;
  font-size:13px;
  font-weight:700;
  margin-top:15px;

  background:${props => {

    if(props.status === "pending"){
      return "#fef3c7";
    }

    if(props.status === "accepted"){
      return "#dbeafe";
    }

    if(props.status === "picked"){
      return "#ede9fe";
    }

    if(props.status === "delivering"){
      return "#dcfce7";
    }

    if(props.status === "delivered"){
      return "#bbf7d0";
    }

    return "#e5e7eb";
  }};

  color:#111827;
`;

const Timeline = styled.div`
  margin-top:20px;
  border-left:3px solid #facc15;
  padding-left:18px;
`;

const TimelineItem = styled.div`
  position:relative;
  margin-bottom:22px;
`;

const TimelineDot = styled.div`
  width:16px;
  height:16px;
  border-radius:50%;
  background:${props =>
    props.active
      ? "#22c55e"
      : "#d1d5db"};
  position:absolute;
  left:-27px;
  top:2px;
`;

const TimelineText = styled.div`
  font-size:14px;
  font-weight:600;
  color:#0f172a;
`;

const TimelineTime = styled.div`
  font-size:12px;
  color:#64748b;
  margin-top:4px;
`;

const ButtonRow = styled.div`
  display:flex;
  gap:10px;
  margin-top:18px;
  flex-wrap:wrap;
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
`;

const Empty = styled.div`
  background:white;
  padding:28px;
  border-radius:18px;
  text-align:center;
  color:#64748b;
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

  const [notifications,setNotifications] =
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

    const [cashOnDelivery,
  setCashOnDelivery] =
    useState(false);

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

    fetchMe();

    fetchOrders();

    const interval =
      setInterval(()=>{

        fetchOrders();

      },3000);

    return ()=>clearInterval(interval);

  },[]);

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

        setNotifications((prev)=>[
  {
    type:"message",
    orderId:data.orderId,
    sender:data.sender || "Rider",
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
        "LIVE RIDER LOCATION:",
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
        await API.get("/customer/me");

        console.log(
  "CUSTOMER ME DATA:",
  res.data
);

setUser(
  res.data.user || res.data
);

      setUser(
        res.data.user || res.data
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

    await API.post(
      "/orders",
      {
        pickupLocation,
dropoffLocation,

distance:distance,
deliveryTime:deliveryTime,
total:amount,
        items:[
          {
            name:itemNotes || "Delivery Item",
            quantity:1
          }
        ]
      }
    );

    alert("Order created successfully");

    setPickupLocation("");
    setDropoffLocation("");
    setDistance("");
    setAmount("");
    setItemNotes("");
    setShowConfirm(false);

    fetchOrders();

    setActiveSection("orders");

  }catch(err){

    console.log(
      "CREATE ORDER ERROR:",
      err.response?.data || err
    );

    alert(
      err.response?.data?.message ||
      "Failed to create order"
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
      (o)=>o.status !== "delivered"
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

            <ProfileImage
              src={customerImage}
              alt="Customer"
            />

            <h3
              style={{
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                gap:"8px"
              }}
            >
              <FiUser />

              {
                user?.name || "Customer"
              }
            </h3>

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

            <div
              style={{
                background:"white",
                padding:"10px",
                borderRadius:"20px",
                marginBottom:"25px",
                display:"flex",
                justifyContent:"center"
              }}
            >

              <img
                src={logo}
                alt="Logo"
                style={{
                  width:"230px",
                  objectFit:"contain"
                }}
              />

            </div>

            <Hero>

              <div>

                <HeroTitle>
                  Welcome back,
                  {" "}
                  {
                    user?.name || "Customer"
                  }
                  👋
                </HeroTitle>

                <HeroText>
                  Track your orders,
                  rider updates,
                  and delivery progress.
                </HeroText>

              </div>

              <DateCard>

                📅
                {" "}

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

            </Hero>

            <StatsGrid>

              <StatCard>

                <StatTitle>
                  Active Orders
                </StatTitle>

                <StatValue>
                  {activeOrders.length}
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

              <StatCard>

                <StatTitle>
                  Notifications
                </StatTitle>

                <StatValue>
                  {notifications.length}
                </StatValue>

              </StatCard>

            </StatsGrid>

          </>

        )}

        {activeSection === "orders" && (

          <>

            <Hero>

              <div>

                <HeroTitle>
                  My Orders 📦
                </HeroTitle>

                <HeroText>
                  View and track all your orders.
                </HeroText>

              </div>

            </Hero>

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

                        <Row>
                          <strong>
                            Delivery Rider:
                          </strong>
                          {" "}
                          {
                            o.rider?.name ||
                            "Searching for Rider"
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

                        <StatusBadge
                          status={o.status}
                        >
                          {o.status}
                        </StatusBadge>

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

  locationCoords[o.pickupLocation] &&
  locationCoords[o.dropoffLocation] && (

    <div
      style={{
        marginTop:"20px",
        borderRadius:"18px",
        overflow:"hidden",
        border:"1px solid #e5e7eb"
      }}
    >

      <MapContainer
        center={[
          locationCoords[o.pickupLocation].lat,
          locationCoords[o.pickupLocation].lng
        ]}
        zoom={12}
        style={{
          height:"300px",
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

<ButtonRow>

<Button
onClick={()=>{
 setOpenChats({

   ...openChats,

  [o._id]:
  !openChats[o._id]
  });

   }}
    >
     Chat Rider
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
>
  Call Rider
</Button>

                          {

                            o.status === "pending"

                            &&

                            (

                              <Button
                                onClick={()=>
                                  cancelOrder(o._id)
                                }
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
                                                msg.sender ===
                                                "customer"

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
                                  onClick={()=>

                                    sendMessage(
                                      o._id,
                                      chatText[o._id]
                                    )
                                  }
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

  <CreateOrderTitle>
    Send Package 📦
  </CreateOrderTitle>

  <CreateOrderSubtext>
    Fast, safe and reliable delivery across Accra.
  </CreateOrderSubtext>

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
    marginTop:"8px",
    fontSize:"13px",
    color:"#64748b"
  }}
>
  House / Building, Street, Area, City
</div>

{
  pickupSuggestions.length > 0 && (

    <div
      style={{
        background:"white",
        border:"1px solid #e5e7eb",
        borderRadius:"16px",
        marginTop:"10px",
        overflow:"hidden",
        boxShadow:
          "0 4px 12px rgba(0,0,0,0.08)"
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
  padding:"14px",
   cursor:"pointer",
    borderBottom:
  "1px solid #f1f5f9",
 fontSize:"14px"
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
    marginTop:"8px",
    fontSize:"13px",
    color:"#64748b"
  }}
>
  House / Building, Street, Area, City
</div>

{
  dropoffSuggestions.length > 0 && (

    <div
      style={{
        background:"white",
        border:"1px solid #e5e7eb",
        borderRadius:"16px",
        marginTop:"10px",
        overflow:"hidden",
        boxShadow:
          "0 4px 12px rgba(0,0,0,0.08)"
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
    padding:"14px",
    cursor:"pointer",
    borderBottom:
    "1px solid #f1f5f9",
    fontSize:"14px"
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
        color:"#64748b",
        fontSize:"14px",
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
        color:"#64748b",
        fontSize:"14px",
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
      alignItems:"center",
      gap:"12px",
      marginTop:"10px"
    }}
  >

    <input
      type="checkbox"
      checked={cashOnDelivery}
      onChange={(e)=>
        setCashOnDelivery(
          e.target.checked
        )
      }
      style={{
        width:"20px",
        height:"20px",
        cursor:"pointer"
      }}
    />

    <span
      style={{
        fontSize:"16px",
        fontWeight:"600",
        color:"#0f172a"
      }}
    >
      Cash on Delivery
    </span>

  </div>

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
          fontSize:"28px",
          marginBottom:"18px"
        }}
      >
        Confirm Your Order
      </HeroTitle>

      <Row>
        <strong>
          Pickup:
        </strong>
        {" "}
        {pickupLocation}
      </Row>

      <Row>
        <strong>
          Dropoff:
        </strong>
        {" "}
        {dropoffLocation}
      </Row>

      <Row>
        <strong>
          Item Notes:
        </strong>
        {" "}
        {itemNotes || "None"}
      </Row>

      <Row>
        <strong>
          Distance:
        </strong>
        {" "}
        {distance} KM
      </Row>

      <Row>
  <strong>
    Estimated Delivery Time:
  </strong>
  {" "}
  {deliveryTime}
</Row>

      <Row>
        <strong>
          Delivery Fee:
        </strong>
        {" "}
        ₵{amount}
      </Row>

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

        {activeSection === "notifications" && (

          <>

            <Hero>

              <div>

                <HeroTitle>
                  Notifications 🔔
                </HeroTitle>

                <HeroText>
                  Rider updates and order alerts.
                </HeroText>

              </div>

            </Hero>

            {

              allNotifications.length === 0

              ?

              (

                <Empty>
                  No notifications yet.
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

                          <Row>
                            <strong>
                              {note.sender}
                            </strong>
                          </Row>

                          <Row>
                            {note.text}
                          </Row>

                          <StatusBadge>
                            {note.time}
                          </StatusBadge>

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
      maxWidth:"900px",
      margin:"0 auto",
      padding:"30px"
    }}
  >

   <HeroTitle
  style={{
    marginTop:"190px"
  }}
>
  My Profile 👤
</HeroTitle>
    

    <div
  style={{
    position:"absolute",
    top:"20px",
    left:"20px",
    display:"flex",
    flexDirection:"column",
    alignItems:"center"
  }}
>

  <ProfileImage
   src={
  profileImage ||
  user?.profileImage ||
  customerImage
}
    alt="Customer"
    style={{
      width:"140px",
      height:"140px"
    }}
  />

  <div
    style={{
      marginTop:"12px"
    }}
  >

   <input
  type="file"
  accept="image/*"
  onChange={async(e)=>{

    const file =
      e.target.files[0];

    if(!file){
      return;
    }

    setProfileImage(
      URL.createObjectURL(file)
    );

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
        res.data.user.profileImage
      );

      alert(
        "Profile image uploaded successfully"
      );

    }catch(err){

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Image upload failed"
      );
    }
  }}
/>

  </div>

</div>

    <HeroText
      style={{
        marginBottom:"30px"
      }}
    >
      Manage your customer profile information.
    </HeroText>

    <div
  style={{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"flex-start",
    flexWrap:"wrap",
    gap:"30px"
  }}
>

      <div
        style={{
          flex:1
        }}
      >

        <Row>
          <strong>Name:</strong>
          {" "}
          {profileName}
        </Row>

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

<BeautifulInput
  type="text"
  placeholder="Gender"
  value={profileGender}
  onChange={(e)=>
    setProfileGender(
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

  </>

  :

  <>

    <Row>
      <strong>Email:</strong>
      {" "}
      {profileEmail}
    </Row>

    <Row>
      <strong>Phone:</strong>
      {" "}
      {profilePhone}
    </Row>

    <Row>
      <strong>Address:</strong>
      {" "}
      {profileAddress || "Not added"}
    </Row>

    <Row>
  <strong>Date of Birth:</strong>
  {" "}
  {profileDOB || "Not added"}
</Row>

<Row>
  <strong>Gender:</strong>
  {" "}
  {profileGender || "Not added"}
</Row>

<Row>
  <strong>Emergency Contact:</strong>
  {" "}
  {profileEmergency || "Not added"}
</Row>

  </>
}
      </div>

    </div>

    <ButtonRow>

 <Button
  onClick={()=>{

    if(profileEditing){

      saveProfile();

    }else{

      setProfileEditing(true);
    }

  }}
>
   {
  profileEditing
  ? "Save Profile"
  : "Edit Profile"
}
  </Button>

</ButtonRow>

<OrderSection>

  <SectionTitle
    style={{
      marginBottom:"18px"
    }}
  >
    Saved Addresses 📍
  </SectionTitle>

  <Row>
    <strong>Home:</strong>
    {" "}
    {profileAddress || "No address added"}
  </Row>

  <Row>
    <strong>Work:</strong>
    {" "}
    Not added
  </Row>

  <Row>
    <strong>Recent Delivery Area:</strong>
    {" "}
    Accra
  </Row>

</OrderSection>

  </OrderCard>

)}


{activeSection === "Settings" && (

  <>

    <Hero>

      <div>

        <HeroTitle>
          Settings ⚙️
        </HeroTitle>

        <HeroText>
          Manage your MonniDrop account settings.
        </HeroText>

      </div>

    </Hero>

    <div
      style={{
        display:"flex",
        flexDirection:"column",
        gap:"20px"
      }}
    >

      {/* ACCOUNT SECURITY */}

      <OrderCard>

  <SectionTitle
    style={{
      marginBottom:"22px"
    }}
  >
    Account Security
  </SectionTitle>

  <div
    onClick={()=>
      setSelectedSetting(
        "Mobile Phone Number"
      )
    }
    style={{
      padding:"16px",
      borderBottom:"1px solid #e5e7eb",
      cursor:"pointer"
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
    padding:"16px",
    borderBottom:"1px solid #e5e7eb",
    cursor:"pointer"
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
    padding:"16px",
    borderBottom:"1px solid #e5e7eb",
    cursor:"pointer"
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
    padding:"16px",
    borderBottom:"1px solid #e5e7eb",
    cursor:"pointer"
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
    padding:"16px",
    borderBottom:"1px solid #e5e7eb",
    cursor:"pointer"
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
    padding:"16px",
    borderBottom:"1px solid #e5e7eb",
    cursor:"pointer"
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
          padding:"16px",
          borderBottom:"1px solid #e5e7eb",
          cursor:"pointer",
          fontWeight:"600",
          color:
            item.includes("Delete")
            ? "#dc2626"
            : "#0f172a"
        }}
      >
        {item}
      </div>

    ))
  }

</OrderCard>

      {/* PRIVACY */}

      <OrderCard>

        <SectionTitle
          style={{
            marginBottom:"22px"
          }}
        >
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
                padding:"16px",
                borderBottom:"1px solid #e5e7eb",
                cursor:"pointer",
                fontWeight:"600"
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
            marginBottom:"10px"
          }}
        >
          Permissions
        </SectionTitle>

        <HeroText
          style={{
            marginBottom:"20px"
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
                padding:"16px",
                borderBottom:"1px solid #e5e7eb",
                cursor:"pointer",
                fontWeight:"600"
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
            marginBottom:"20px"
          }}
        >
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
                padding:"16px",
                borderBottom:"1px solid #e5e7eb",
                cursor:"pointer",
                fontWeight:"600"
              }}
            >
              {item}
            </div>

          ))
        }

      </OrderCard>

      {/* GENERAL SETTINGS */}

      <OrderCard>

        <SectionTitle
          style={{
            marginBottom:"20px"
          }}
        >
          General
        </SectionTitle>

        <div
  onClick={()=>
    setSelectedSetting(
      "Country & Region"
    )
  }
  style={{
    padding:"16px",
    borderBottom:"1px solid #e5e7eb",
    cursor:"pointer"
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
    padding:"16px",
    borderBottom:"1px solid #e5e7eb",
    cursor:"pointer"
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
    padding:"16px",
    borderBottom:"1px solid #e5e7eb",
    cursor:"pointer"
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
                padding:"16px",
                borderBottom:"1px solid #e5e7eb",
                cursor:"pointer",
                fontWeight:"600"
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

       {

  selectedSetting ===
  "Mobile Phone Number"

  &&

  (

    <BeautifulInput
      type="text"
      placeholder="+233 55 000 0000"
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

  selectedSetting ===
  "Email"

  &&

  (

    <BeautifulInput
      type="email"
      placeholder="example@gmail.com"
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

  

  selectedSetting ===
  "Password"

  &&

  (

    <>

      <div
  style={{
    position:"relative"
  }}
>

  <BeautifulInput
    type={
      showPasswords
      ? "text"
      : "password"
    }
    placeholder="Current Password"
    value={currentPassword}
    onChange={(e)=>
      setCurrentPassword(
        e.target.value
      )
    }
  />

  {

  selectedSetting ===
  "Country & Region"

  &&

  (

    <>

      <BeautifulInput
        type="text"
        placeholder="Enter Country"
        value={country}
        onChange={(e)=>
          setCountry(
            e.target.value
          )
        }
      />

      <Button
        style={{
          marginTop:"18px"
        }}
        onClick={()=>
          setSelectedSetting(null)
        }
      >
        Save Country
      </Button>

      {

  selectedSetting ===
  "Language"

  &&

  (

    <>

      <BeautifulInput
        type="text"
        placeholder="Enter Language"
        value={language}
        onChange={(e)=>
          setLanguage(
            e.target.value
          )
        }
      />

      <Button
        style={{
          marginTop:"18px"
        }}
        onClick={()=>
          setSelectedSetting(null)
        }
      >
        Save Language
      </Button>

      {

  selectedSetting ===
  "Currency"

  &&

  (

    <>

      <BeautifulInput
        type="text"
        placeholder="Enter Currency"
        value={currency}
        onChange={(e)=>
          setCurrency(
            e.target.value
          )
        }
      />

      {

  selectedSetting ===
  "Two-Factor Authentication"

  &&

  (

    <>

      <div
        style={{
          marginTop:"10px",
          color:"#64748b",
          lineHeight:"1.7"
        }}
      >
        Protect your MonniDrop account with
        extra login security verification.
      </div>

      <Button
        style={{
          marginTop:"20px"
        }}
        onClick={()=>{

          setTwoFactorEnabled(
            !twoFactorEnabled
          );

          setSelectedSetting(null);

        }}
      >
        {
          twoFactorEnabled
          ? "Disable 2FA"
          : "Enable 2FA"
        }
      </Button>

    </>

  )
}

{

  selectedSetting ===
  "Two-Factor Authentication"

  &&

  (

    <>

      <div
        style={{
          marginTop:"10px",
          color:"#64748b",
          lineHeight:"1.7"
        }}
      >
        Protect your MonniDrop account with
        extra login security verification.
      </div>

      <Button
        style={{
          marginTop:"20px"
        }}
        onClick={()=>{

          setTwoFactorEnabled(
            !twoFactorEnabled
          );

          setSelectedSetting(null);

        }}
      >
        {
          twoFactorEnabled
          ? "Disable 2FA"
          : "Enable 2FA"
        }
      </Button>

    </>

  )
}

{

  selectedSetting ===
  "Google"

  &&

  (

    <>

      <div
        style={{
          marginTop:"10px",
          color:"#64748b",
          lineHeight:"1.7"
        }}
      >
        Connect your Google account for
        faster and secure sign in.
      </div>

      <Button
        style={{
          marginTop:"20px"
        }}
        onClick={()=>{

          setGoogleConnected(
            !googleConnected
          );

          setSelectedSetting(null);

        }}
      >
        {
          googleConnected
          ? "Disconnect Google"
          : "Connect Google"
        }
      </Button>

    </>

  )
}

{

  selectedSetting ===
  "Facebook"

  &&

  (

    <>

      <div
        style={{
          marginTop:"10px",
          color:"#64748b",
          lineHeight:"1.7"
        }}
      >
        Connect your Facebook account for
        quick login and account recovery.
      </div>

      <Button
        style={{
          marginTop:"20px"
        }}
        onClick={()=>{

          setFacebookConnected(
            !facebookConnected
          );

          setSelectedSetting(null);

        }}
      >
        {
          facebookConnected
          ? "Disconnect Facebook"
          : "Connect Facebook"
        }
      </Button>

    </>

  )
}
      <Button
        style={{
          marginTop:"18px"
        }}
        onClick={()=>
          setSelectedSetting(null)
        }
      >
        Save Currency
      </Button>

    </>

  )
}

    </>

  )
}

    </>

  )
}

  <div
    onClick={()=>
      setShowPasswords(
        !showPasswords
      )
    }
    style={{
      position:"absolute",
      right:"18px",
      top:"50%",
      transform:"translateY(-50%)",
      cursor:"pointer",
      color:"#64748b"
    }}
  >

    {
      showPasswords
      ? <FiEyeOff />
      : <FiEye />
    }

  </div>

</div>
      

      <div
  style={{
    position:"relative"
  }}
>

  <BeautifulInput
    type={
      showPasswords
      ? "text"
      : "password"
    }
    placeholder="New Password"
    value={newPassword}
    onChange={(e)=>
      setNewPassword(
        e.target.value
      )
    }
  />

  <div
    onClick={()=>
      setShowPasswords(
        !showPasswords
      )
    }
    style={{
      position:"absolute",
      right:"18px",
      top:"50%",
      transform:"translateY(-50%)",
      cursor:"pointer",
      color:"#64748b"
    }}
  >

    {
      showPasswords
      ? <FiEyeOff />
      : <FiEye />
    }

  </div>

</div>
      

      <div
  style={{
    position:"relative"
  }}
>

  <BeautifulInput
    type={
      showPasswords
      ? "text"
      : "password"
    }
    placeholder="Confirm Password"
    value={confirmPassword}
    onChange={(e)=>
      setConfirmPassword(
        e.target.value
      )
    }
  />

  <div
    onClick={()=>
      setShowPasswords(
        !showPasswords
      )
    }
    style={{
      position:"absolute",
      right:"18px",
      top:"50%",
      transform:"translateY(-50%)",
      cursor:"pointer",
      color:"#64748b"
    }}
  >

    {
      showPasswords
      ? <FiEyeOff />
      : <FiEye />
    }

  </div>

</div>

      <Button
  style={{
    marginTop:"18px"
  }}
  onClick={()=>{

    if(
      newPassword !==
      confirmPassword
    ){

      alert(
        "Passwords do not match"
      );

      return;
    }

    alert(
      "Password updated successfully"
    );

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setSelectedSetting(null);

  }}
>
  Save Password
</Button>

    </>

  )
}

<Button
  style={{
    marginTop:"24px"
  }}
  onClick={()=>
    setSelectedSetting(null)
  }
>
  Close
</Button>

      </div>

    </div>
  )
}

  </>

)}

</Main>

</Layout>

  );

}


   