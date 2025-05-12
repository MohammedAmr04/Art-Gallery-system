// // LiveBids.js
// import { useEffect, useState } from "react";
// import * as signalR from "@microsoft/signalr";
// import { useAuth } from "../context/AuthContext";

// const Test = ({ artworkId }) => {
//   const [bids, setBids] = useState([]);
//   const { user } = useAuth();

//   useEffect(() => {
//     const connection = new signalR.HubConnectionBuilder()
//       .withUrl("http://localhost:5206/hubs/auction", {
//         accessTokenFactory: () => user.token,
//       })
//       .withAutomaticReconnect()
//       .build();

//     connection.on("BidPlaced", (bid) => {
//       console.log("مزايدة جديدة:", bid);
//       setBids((prevBids) => [bid, ...prevBids]);
//     });

//     connection
//       .start()
//       .then(() => {
//         console.log("تم الاتصال بالـ Hub");
//         connection
//           .invoke("JoinArtworkGroup", artworkId)
//           .then(() => console.log("انضممت للجروب"))
//           .catch((err) => console.error("خطأ في الانضمام للجروب:", err));
//       })
//       .catch((err) => console.error("فشل الاتصال:", err));

//     // تنظيف الاتصال عند الخروج من الصفحة
//     return () => {
//       connection.stop();
//     };
//   }, [artworkId, user.token]);

//   return (
//     <div>
//       <h3>المزايدات المباشرة للعمل الفني رقم {artworkId}</h3>
//       <ul>
//         {bids.map((bid, index) => (
//           <li key={index}>
//             🧑 المشتري #{bid.buyerId} زايد بـ {bid.amount}$
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Test;

export default function Test() {
  return <div>Test</div>;
}
