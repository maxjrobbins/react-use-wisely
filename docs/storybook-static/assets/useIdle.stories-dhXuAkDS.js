import{r as l,R as e}from"./index-D4H_InIO.js";const y=(n=6e4,r=["mousedown","mousemove","keypress","scroll","touchstart"])=>{const[d,c]=l.useState(n===0),o=l.useCallback(()=>{c(!1);const i=setTimeout(()=>{c(!0)},n);return()=>{clearTimeout(i)}},[n]);return l.useEffect(()=>{const i=n>0?o():()=>{};return r.forEach(a=>{document.addEventListener(a,o)}),()=>{i(),r.forEach(a=>{document.removeEventListener(a,o)})}},[r,o,n]),d},g={title:"Hooks/useIdle",parameters:{componentSubtitle:"Hook that detects when the user is idle",docs:{description:{component:"A React hook that tracks user activity and detects when the user has been idle for a specified duration."}}}},s=()=>{const[n,r]=l.useState(3e3),d=y(n),[c,o]=l.useState(new Date),[i,a]=l.useState([]);return e.useEffect(()=>{const t=()=>{o(new Date)};return window.addEventListener("mousemove",t),window.addEventListener("mousedown",t),window.addEventListener("keydown",t),window.addEventListener("touchstart",t),()=>{window.removeEventListener("mousemove",t),window.removeEventListener("mousedown",t),window.removeEventListener("keydown",t),window.removeEventListener("touchstart",t)}},[]),e.useEffect(()=>{a(t=>[{timestamp:new Date().toLocaleTimeString(),state:d?"Became Idle":"Became Active"},...t.slice(0,4)])},[d]),e.createElement("div",{style:{padding:"20px",border:"1px solid #ddd",borderRadius:"4px"}},e.createElement("h3",null,"User Idle Detection Demo"),e.createElement("div",{style:{marginBottom:"20px"}},e.createElement("label",{htmlFor:"idle-time",style:{display:"block",marginBottom:"8px"}},"Idle Timeout: ",n/1e3," seconds"),e.createElement("input",{id:"idle-time",type:"range",min:"1000",max:"10000",step:"1000",value:n,onChange:t=>r(Number(t.target.value)),style:{width:"100%"}})),e.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 20px",borderRadius:"8px",backgroundColor:d?"#ffebee":"#e8f5e9",color:d?"#c62828":"#2e7d32",marginBottom:"20px",transition:"all 0.5s ease"}},e.createElement("div",{style:{textAlign:"center"}},e.createElement("div",{style:{fontSize:"48px",marginBottom:"10px"}},d?"😴":"👋"),e.createElement("h2",{style:{margin:"0",fontSize:"24px"}},d?"User is idle":"User is active"),e.createElement("p",{style:{margin:"10px 0 0 0"}},d?"Move your mouse or press a key to become active":`Stay inactive for ${n/1e3} seconds to become idle`))),e.createElement("div",{style:{display:"flex",gap:"20px",flexWrap:"wrap"}},e.createElement("div",{style:{flex:"1",minWidth:"250px"}},e.createElement("h4",null,"User Activity Info"),e.createElement("table",{style:{width:"100%",borderCollapse:"collapse"}},e.createElement("tbody",null,e.createElement("tr",null,e.createElement("td",{style:{padding:"8px",border:"1px solid #ddd",fontWeight:"bold"}},"Current Status"),e.createElement("td",{style:{padding:"8px",border:"1px solid #ddd",backgroundColor:d?"#fff8e1":"#f1f8e9"}},d?"Idle":"Active")),e.createElement("tr",null,e.createElement("td",{style:{padding:"8px",border:"1px solid #ddd",fontWeight:"bold"}},"Idle Timeout"),e.createElement("td",{style:{padding:"8px",border:"1px solid #ddd"}},n/1e3," seconds")),e.createElement("tr",null,e.createElement("td",{style:{padding:"8px",border:"1px solid #ddd",fontWeight:"bold"}},"Last Activity"),e.createElement("td",{style:{padding:"8px",border:"1px solid #ddd"}},c.toLocaleTimeString()))))),e.createElement("div",{style:{flex:"1",minWidth:"250px"}},e.createElement("h4",null,"Idle State Change Log"),i.length>0?e.createElement("ul",{style:{listStyle:"none",padding:"0",margin:"0",backgroundColor:"#f5f5f5",border:"1px solid #ddd",borderRadius:"4px",overflow:"hidden"}},i.map((t,p)=>e.createElement("li",{key:p,style:{padding:"8px 12px",borderBottom:p<i.length-1?"1px solid #ddd":"none",backgroundColor:p===0?"#f5f5f5":"transparent"}},e.createElement("span",{style:{color:t.state==="Became Idle"?"#c62828":"#2e7d32",fontWeight:"bold",marginRight:"8px"}},t.state),e.createElement("span",{style:{color:"#666"}},"at ",t.timestamp)))):e.createElement("p",{style:{fontStyle:"italic",color:"#666"}},"No state changes recorded yet"))),e.createElement("p",{style:{marginTop:"20px",fontStyle:"italic",color:"#666"}},"This hook is useful for building auto-logout features, screensavers, or any feature that needs to respond when users are inactive."))};s.storyName="Basic Usage";s.__docgenInfo={description:"",methods:[],displayName:"Default"};var m,u,v;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`() => {
  const [idleTime, setIdleTime] = useState(3000);
  const isIdle = useIdle(idleTime);
  const [lastActivity, setLastActivity] = useState(new Date());
  const [idleEvents, setIdleEvents] = useState([]);
  React.useEffect(() => {
    const handleActivity = () => {
      setLastActivity(new Date());
    };

    // Add event listeners to track user activity
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("mousedown", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("touchstart", handleActivity);
    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("mousedown", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, []);

  // Log idle state changes
  React.useEffect(() => {
    setIdleEvents(prev => [{
      timestamp: new Date().toLocaleTimeString(),
      state: isIdle ? "Became Idle" : "Became Active"
    }, ...prev.slice(0, 4) // Keep only the 5 most recent events
    ]);
  }, [isIdle]);
  return <div style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "4px"
  }}>
      <h3>User Idle Detection Demo</h3>

      <div style={{
      marginBottom: "20px"
    }}>
        <label htmlFor="idle-time" style={{
        display: "block",
        marginBottom: "8px"
      }}>
          Idle Timeout: {idleTime / 1000} seconds
        </label>
        <input id="idle-time" type="range" min="1000" max="10000" step="1000" value={idleTime} onChange={e => setIdleTime(Number(e.target.value))} style={{
        width: "100%"
      }} />
      </div>

      <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      borderRadius: "8px",
      backgroundColor: isIdle ? "#ffebee" : "#e8f5e9",
      color: isIdle ? "#c62828" : "#2e7d32",
      marginBottom: "20px",
      transition: "all 0.5s ease"
    }}>
        <div style={{
        textAlign: "center"
      }}>
          <div style={{
          fontSize: "48px",
          marginBottom: "10px"
        }}>
            {isIdle ? "😴" : "👋"}
          </div>
          <h2 style={{
          margin: "0",
          fontSize: "24px"
        }}>
            {isIdle ? "User is idle" : "User is active"}
          </h2>
          <p style={{
          margin: "10px 0 0 0"
        }}>
            {isIdle ? \`Move your mouse or press a key to become active\` : \`Stay inactive for \${idleTime / 1000} seconds to become idle\`}
          </p>
        </div>
      </div>

      <div style={{
      display: "flex",
      gap: "20px",
      flexWrap: "wrap"
    }}>
        <div style={{
        flex: "1",
        minWidth: "250px"
      }}>
          <h4>User Activity Info</h4>
          <table style={{
          width: "100%",
          borderCollapse: "collapse"
        }}>
            <tbody>
              <tr>
                <td style={{
                padding: "8px",
                border: "1px solid #ddd",
                fontWeight: "bold"
              }}>
                  Current Status
                </td>
                <td style={{
                padding: "8px",
                border: "1px solid #ddd",
                backgroundColor: isIdle ? "#fff8e1" : "#f1f8e9"
              }}>
                  {isIdle ? "Idle" : "Active"}
                </td>
              </tr>
              <tr>
                <td style={{
                padding: "8px",
                border: "1px solid #ddd",
                fontWeight: "bold"
              }}>
                  Idle Timeout
                </td>
                <td style={{
                padding: "8px",
                border: "1px solid #ddd"
              }}>
                  {idleTime / 1000} seconds
                </td>
              </tr>
              <tr>
                <td style={{
                padding: "8px",
                border: "1px solid #ddd",
                fontWeight: "bold"
              }}>
                  Last Activity
                </td>
                <td style={{
                padding: "8px",
                border: "1px solid #ddd"
              }}>
                  {lastActivity.toLocaleTimeString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{
        flex: "1",
        minWidth: "250px"
      }}>
          <h4>Idle State Change Log</h4>
          {idleEvents.length > 0 ? <ul style={{
          listStyle: "none",
          padding: "0",
          margin: "0",
          backgroundColor: "#f5f5f5",
          border: "1px solid #ddd",
          borderRadius: "4px",
          overflow: "hidden"
        }}>
              {idleEvents.map((event, index) => <li key={index} style={{
            padding: "8px 12px",
            borderBottom: index < idleEvents.length - 1 ? "1px solid #ddd" : "none",
            backgroundColor: index === 0 ? "#f5f5f5" : "transparent"
          }}>
                  <span style={{
              color: event.state === "Became Idle" ? "#c62828" : "#2e7d32",
              fontWeight: "bold",
              marginRight: "8px"
            }}>
                    {event.state}
                  </span>
                  <span style={{
              color: "#666"
            }}>at {event.timestamp}</span>
                </li>)}
            </ul> : <p style={{
          fontStyle: "italic",
          color: "#666"
        }}>
              No state changes recorded yet
            </p>}
        </div>
      </div>

      <p style={{
      marginTop: "20px",
      fontStyle: "italic",
      color: "#666"
    }}>
        This hook is useful for building auto-logout features, screensavers, or
        any feature that needs to respond when users are inactive.
      </p>
    </div>;
}`,...(v=(u=s.parameters)==null?void 0:u.docs)==null?void 0:v.source}}};const x=["Default"];export{s as Default,x as __namedExportsOrder,g as default};
