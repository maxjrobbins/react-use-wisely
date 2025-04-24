import{r as c,R as e}from"./index-D4H_InIO.js";const E=(t={})=>{const[a,n]=c.useState({loading:!0,accuracy:null,altitude:null,altitudeAccuracy:null,heading:null,latitude:null,longitude:null,speed:null,timestamp:null,error:null});return c.useEffect(()=>{if(!navigator.geolocation){n(o=>({...o,loading:!1,error:new Error("Geolocation is not supported by your browser")}));return}const d=o=>{const{coords:{accuracy:s,altitude:m,altitudeAccuracy:b,heading:x,latitude:y,longitude:h,speed:f},timestamp:w}=o;n({loading:!1,accuracy:s,altitude:m,altitudeAccuracy:b,heading:x,latitude:y,longitude:h,speed:f,timestamp:w,error:null})},l=o=>{n(s=>({...s,loading:!1,error:o}))},i=navigator.geolocation.watchPosition(d,l,t);return()=>{navigator.geolocation.clearWatch(i)}},[t]),a},v={title:"Hooks/useGeolocation",parameters:{componentSubtitle:"Hook that provides browser geolocation data",docs:{description:{component:"A React hook that provides access to the browser Geolocation API with status tracking."}}}},r=()=>{const{isLoading:t,error:a,data:{latitude:n,longitude:d,accuracy:l,timestamp:i},getCurrentPosition:o}=E();return e.createElement("div",{style:{padding:"20px",border:"1px solid #ddd",borderRadius:"4px"}},e.createElement("h3",null,"Geolocation Demo"),e.createElement("div",{style:{marginBottom:"20px"}},e.createElement("button",{onClick:o,disabled:t,style:{padding:"8px 12px",backgroundColor:t?"#cccccc":"#4CAF50",color:"white",border:"none",borderRadius:"4px",cursor:t?"not-allowed":"pointer"}},t?"Getting location...":"Get Current Location")),a&&e.createElement("div",{style:{padding:"10px",backgroundColor:"#fff0f0",color:"#ff0000",borderRadius:"4px",marginBottom:"20px"}},e.createElement("strong",null,"Error:")," ",a.message||"Unknown error occurred"),n&&d?e.createElement("div",null,e.createElement("h4",null,"Location Data:"),e.createElement("table",{style:{borderCollapse:"collapse",width:"100%"}},e.createElement("tbody",null,e.createElement("tr",null,e.createElement("td",{style:{padding:"8px",border:"1px solid #ddd",fontWeight:"bold"}},"Latitude"),e.createElement("td",{style:{padding:"8px",border:"1px solid #ddd"}},n,"°")),e.createElement("tr",null,e.createElement("td",{style:{padding:"8px",border:"1px solid #ddd",fontWeight:"bold"}},"Longitude"),e.createElement("td",{style:{padding:"8px",border:"1px solid #ddd"}},d,"°")),e.createElement("tr",null,e.createElement("td",{style:{padding:"8px",border:"1px solid #ddd",fontWeight:"bold"}},"Accuracy"),e.createElement("td",{style:{padding:"8px",border:"1px solid #ddd"}},l?`${Math.round(l)} meters`:"N/A")),e.createElement("tr",null,e.createElement("td",{style:{padding:"8px",border:"1px solid #ddd",fontWeight:"bold"}},"Timestamp"),e.createElement("td",{style:{padding:"8px",border:"1px solid #ddd"}},i?new Date(i).toLocaleString():"N/A")))),e.createElement("div",{style:{marginTop:"20px"}},e.createElement("a",{href:`https://www.google.com/maps?q=${n},${d}`,target:"_blank",rel:"noopener noreferrer",style:{display:"inline-block",padding:"8px 12px",backgroundColor:"#1a73e8",color:"white",textDecoration:"none",borderRadius:"4px"}},"View on Google Maps"))):e.createElement("p",null,"No location data available. Click the button to get your current location."),e.createElement("p",{style:{marginTop:"20px",fontStyle:"italic",color:"#666"}},"Note: You will need to grant location permissions to your browser for this demo to work."))};r.storyName="Basic Usage";r.__docgenInfo={description:"",methods:[],displayName:"Default"};var p,u,g;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`() => {
  const {
    isLoading,
    error,
    data: {
      latitude,
      longitude,
      accuracy,
      timestamp
    },
    getCurrentPosition
  } = useGeolocation();
  return <div style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "4px"
  }}>
      <h3>Geolocation Demo</h3>

      <div style={{
      marginBottom: "20px"
    }}>
        <button onClick={getCurrentPosition} disabled={isLoading} style={{
        padding: "8px 12px",
        backgroundColor: isLoading ? "#cccccc" : "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: isLoading ? "not-allowed" : "pointer"
      }}>
          {isLoading ? "Getting location..." : "Get Current Location"}
        </button>
      </div>

      {error && <div style={{
      padding: "10px",
      backgroundColor: "#fff0f0",
      color: "#ff0000",
      borderRadius: "4px",
      marginBottom: "20px"
    }}>
          <strong>Error:</strong> {error.message || "Unknown error occurred"}
        </div>}

      {latitude && longitude ? <div>
          <h4>Location Data:</h4>
          <table style={{
        borderCollapse: "collapse",
        width: "100%"
      }}>
            <tbody>
              <tr>
                <td style={{
              padding: "8px",
              border: "1px solid #ddd",
              fontWeight: "bold"
            }}>
                  Latitude
                </td>
                <td style={{
              padding: "8px",
              border: "1px solid #ddd"
            }}>
                  {latitude}°
                </td>
              </tr>
              <tr>
                <td style={{
              padding: "8px",
              border: "1px solid #ddd",
              fontWeight: "bold"
            }}>
                  Longitude
                </td>
                <td style={{
              padding: "8px",
              border: "1px solid #ddd"
            }}>
                  {longitude}°
                </td>
              </tr>
              <tr>
                <td style={{
              padding: "8px",
              border: "1px solid #ddd",
              fontWeight: "bold"
            }}>
                  Accuracy
                </td>
                <td style={{
              padding: "8px",
              border: "1px solid #ddd"
            }}>
                  {accuracy ? \`\${Math.round(accuracy)} meters\` : "N/A"}
                </td>
              </tr>
              <tr>
                <td style={{
              padding: "8px",
              border: "1px solid #ddd",
              fontWeight: "bold"
            }}>
                  Timestamp
                </td>
                <td style={{
              padding: "8px",
              border: "1px solid #ddd"
            }}>
                  {timestamp ? new Date(timestamp).toLocaleString() : "N/A"}
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{
        marginTop: "20px"
      }}>
            <a href={\`https://www.google.com/maps?q=\${latitude},\${longitude}\`} target="_blank" rel="noopener noreferrer" style={{
          display: "inline-block",
          padding: "8px 12px",
          backgroundColor: "#1a73e8",
          color: "white",
          textDecoration: "none",
          borderRadius: "4px"
        }}>
              View on Google Maps
            </a>
          </div>
        </div> : <p>
          No location data available. Click the button to get your current
          location.
        </p>}

      <p style={{
      marginTop: "20px",
      fontStyle: "italic",
      color: "#666"
    }}>
        Note: You will need to grant location permissions to your browser for
        this demo to work.
      </p>
    </div>;
}`,...(g=(u=r.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};const C=["Default"];export{r as Default,C as __namedExportsOrder,v as default};
