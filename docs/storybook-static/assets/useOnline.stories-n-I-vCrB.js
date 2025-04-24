import{r,R as e}from"./index-D4H_InIO.js";const c=()=>{const[n,i]=r.useState(typeof navigator<"u"?navigator.onLine:!0);return r.useEffect(()=>{const o=()=>i(!0),l=()=>i(!1);return window.addEventListener("online",o),window.addEventListener("offline",l),()=>{window.removeEventListener("online",o),window.removeEventListener("offline",l)}},[]),n},p={title:"Hooks/useOnline",parameters:{componentSubtitle:"Hook that tracks online status",docs:{description:{component:"A React hook that provides the current online status of the browser."}}}},t=()=>{const n=c();return e.createElement("div",{style:{padding:"20px",border:"1px solid #ddd",borderRadius:"4px"}},e.createElement("h3",null,"Online Status Demo"),e.createElement("div",{style:{marginTop:"20px",padding:"20px",borderRadius:"8px",textAlign:"center",backgroundColor:n?"#e8f5e9":"#ffebee",color:n?"#2e7d32":"#c62828",transition:"all 0.3s ease"}},e.createElement("div",{style:{fontSize:"48px",marginBottom:"10px"}},n?"🌐":"📴"),e.createElement("h2",{style:{margin:"0"}},n?"You are online":"You are offline")),e.createElement("div",{style:{marginTop:"30px"}},e.createElement("h4",null,"How to test:"),e.createElement("ul",{style:{paddingLeft:"20px"}},e.createElement("li",null,"Turn off your Wi-Fi or disconnect from the internet"),e.createElement("li",null,"The status above will automatically update"),e.createElement("li",null,"Reconnect to see it change back"))),e.createElement("p",{style:{marginTop:"20px",fontStyle:"italic",color:"#666"}},"This hook is useful for building offline-first applications or displaying network status to users."))};t.storyName="Basic Usage";t.__docgenInfo={description:"",methods:[],displayName:"Default"};var s,a,d;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`() => {
  const isOnline = useOnline();
  return <div style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "4px"
  }}>
      <h3>Online Status Demo</h3>

      <div style={{
      marginTop: "20px",
      padding: "20px",
      borderRadius: "8px",
      textAlign: "center",
      backgroundColor: isOnline ? "#e8f5e9" : "#ffebee",
      color: isOnline ? "#2e7d32" : "#c62828",
      transition: "all 0.3s ease"
    }}>
        <div style={{
        fontSize: "48px",
        marginBottom: "10px"
      }}>
          {isOnline ? "🌐" : "📴"}
        </div>
        <h2 style={{
        margin: "0"
      }}>
          {isOnline ? "You are online" : "You are offline"}
        </h2>
      </div>

      <div style={{
      marginTop: "30px"
    }}>
        <h4>How to test:</h4>
        <ul style={{
        paddingLeft: "20px"
      }}>
          <li>Turn off your Wi-Fi or disconnect from the internet</li>
          <li>The status above will automatically update</li>
          <li>Reconnect to see it change back</li>
        </ul>
      </div>

      <p style={{
      marginTop: "20px",
      fontStyle: "italic",
      color: "#666"
    }}>
        This hook is useful for building offline-first applications or
        displaying network status to users.
      </p>
    </div>;
}`,...(d=(a=t.parameters)==null?void 0:a.docs)==null?void 0:d.source}}};const f=["Default"];export{t as Default,f as __namedExportsOrder,p as default};
