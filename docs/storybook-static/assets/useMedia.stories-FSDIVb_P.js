import{r as c,R as e}from"./index-D4H_InIO.js";const a=(n,t=!1)=>{const[o,p]=c.useState(()=>{try{return window.matchMedia?window.matchMedia(n).matches:t}catch{return t}});return c.useEffect(()=>{if(!window.matchMedia)return;let d=!0;const r=window.matchMedia(n),s=()=>{d&&p(r.matches)};return"addEventListener"in r?(r.addEventListener("change",s),()=>{d=!1,r.removeEventListener("change",s)}):"addListener"in r?(r.addListener(s),()=>{d=!1,r.removeListener(s)}):()=>{d=!1}},[n]),o},b={title:"Hooks/useMedia",parameters:{componentSubtitle:"Hook that responds to media queries",docs:{description:{component:"A React hook that evaluates CSS media queries and returns whether they match the current viewport."}}}},i=()=>{const n=a("(max-width: 480px)"),t=a("(min-width: 481px) and (max-width: 1024px)"),o=a("(min-width: 1025px)"),p=a("(prefers-color-scheme: dark)"),d=a("(prefers-reduced-motion: reduce)");return e.createElement("div",{style:{padding:"20px",border:"1px solid #ddd",borderRadius:"4px"}},e.createElement("h3",null,"Media Query Detection Demo"),e.createElement("p",{style:{marginBottom:"20px"}},"This demo uses the ",e.createElement("code",null,"useMedia")," hook to respond to different viewport sizes and user preferences. Resize your browser window to see the values change."),e.createElement("div",{style:{marginBottom:"30px",padding:"15px",backgroundColor:n?"#fff9c4":t?"#e1f5fe":"#e8f5e9",borderRadius:"8px",transition:"background-color 0.3s ease"}},e.createElement("h4",{style:{marginTop:"0"}},"Current Device Type:"),e.createElement("div",{style:{fontSize:"24px",fontWeight:"bold",textAlign:"center",padding:"10px",color:n?"#f57c00":t?"#0277bd":"#2e7d32"}},n?"📱 Mobile":t?"📱 Tablet":"💻 Desktop")),e.createElement("table",{style:{width:"100%",borderCollapse:"collapse",marginBottom:"20px"}},e.createElement("thead",null,e.createElement("tr",null,e.createElement("th",{style:{padding:"10px",textAlign:"left",borderBottom:"2px solid #ddd"}},"Media Query"),e.createElement("th",{style:{padding:"10px",textAlign:"center",borderBottom:"2px solid #ddd"}},"Status"))),e.createElement("tbody",null,e.createElement(l,{label:"Mobile",query:"(max-width: 480px)",isMatching:n}),e.createElement(l,{label:"Tablet",query:"(min-width: 481px) and (max-width: 1024px)",isMatching:t}),e.createElement(l,{label:"Desktop",query:"(min-width: 1025px)",isMatching:o}),e.createElement(l,{label:"Dark Mode",query:"(prefers-color-scheme: dark)",isMatching:p}),e.createElement(l,{label:"Reduced Motion",query:"(prefers-reduced-motion: reduce)",isMatching:d}))),e.createElement("div",{style:{padding:"15px",backgroundColor:"#f5f5f5",borderRadius:"8px"}},e.createElement("h4",{style:{marginTop:"0"}},"Content Adaptation Example:"),e.createElement("div",{style:{marginTop:"15px"}},n?e.createElement("div",{style:{padding:"10px",backgroundColor:"#fff",borderRadius:"4px"}},e.createElement("h5",null,"Mobile Layout"),e.createElement("p",null,"Simplified content for small screens"),e.createElement("div",{style:{height:"50px",backgroundColor:"#f57c00",borderRadius:"4px",marginBottom:"10px"}}),e.createElement("div",{style:{height:"50px",backgroundColor:"#f57c00",borderRadius:"4px",opacity:.7}})):t?e.createElement("div",{style:{padding:"10px",backgroundColor:"#fff",borderRadius:"4px"}},e.createElement("h5",null,"Tablet Layout"),e.createElement("p",null,"Balanced content for medium screens"),e.createElement("div",{style:{display:"flex",gap:"10px"}},e.createElement("div",{style:{flex:1,height:"80px",backgroundColor:"#0277bd",borderRadius:"4px"}}),e.createElement("div",{style:{flex:1,height:"80px",backgroundColor:"#0277bd",borderRadius:"4px",opacity:.7}}))):e.createElement("div",{style:{padding:"10px",backgroundColor:"#fff",borderRadius:"4px"}},e.createElement("h5",null,"Desktop Layout"),e.createElement("p",null,"Full content for large screens"),e.createElement("div",{style:{display:"flex",gap:"10px"}},e.createElement("div",{style:{flex:1,height:"120px",backgroundColor:"#2e7d32",borderRadius:"4px"}}),e.createElement("div",{style:{flex:2,height:"120px",backgroundColor:"#2e7d32",borderRadius:"4px",opacity:.8}}),e.createElement("div",{style:{flex:1,height:"120px",backgroundColor:"#2e7d32",borderRadius:"4px",opacity:.6}}))))),e.createElement("p",{style:{marginTop:"20px",fontStyle:"italic",color:"#666"}},"Resize your browser window to see the responsive changes. Note that dark mode and reduced motion preferences depend on your system settings."))},l=({label:n,query:t,isMatching:o})=>e.createElement("tr",null,e.createElement("td",{style:{padding:"10px",borderBottom:"1px solid #ddd"}},e.createElement("div",null,e.createElement("strong",null,n)),e.createElement("div",{style:{fontSize:"14px",color:"#666",fontFamily:"monospace"}},t)),e.createElement("td",{style:{padding:"10px",textAlign:"center",borderBottom:"1px solid #ddd"}},e.createElement("span",{style:{display:"inline-block",padding:"4px 10px",borderRadius:"20px",backgroundColor:o?"#e8f5e9":"#ffebee",color:o?"#2e7d32":"#c62828",fontWeight:"bold"}},o?"Matching":"Not Matching")));i.storyName="Basic Usage";i.__docgenInfo={description:"",methods:[],displayName:"Default"};var u,m,x;i.parameters={...i.parameters,docs:{...(u=i.parameters)==null?void 0:u.docs,source:{originalSource:`() => {
  const isMobile = useMedia("(max-width: 480px)");
  const isTablet = useMedia("(min-width: 481px) and (max-width: 1024px)");
  const isDesktop = useMedia("(min-width: 1025px)");
  const isDarkMode = useMedia("(prefers-color-scheme: dark)");
  const prefersReducedMotion = useMedia("(prefers-reduced-motion: reduce)");
  return <div style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "4px"
  }}>
      <h3>Media Query Detection Demo</h3>

      <p style={{
      marginBottom: "20px"
    }}>
        This demo uses the <code>useMedia</code> hook to respond to different
        viewport sizes and user preferences. Resize your browser window to see
        the values change.
      </p>

      <div style={{
      marginBottom: "30px",
      padding: "15px",
      backgroundColor: isMobile ? "#fff9c4" : isTablet ? "#e1f5fe" : "#e8f5e9",
      borderRadius: "8px",
      transition: "background-color 0.3s ease"
    }}>
        <h4 style={{
        marginTop: "0"
      }}>Current Device Type:</h4>
        <div style={{
        fontSize: "24px",
        fontWeight: "bold",
        textAlign: "center",
        padding: "10px",
        color: isMobile ? "#f57c00" : isTablet ? "#0277bd" : "#2e7d32"
      }}>
          {isMobile ? "📱 Mobile" : isTablet ? "📱 Tablet" : "💻 Desktop"}
        </div>
      </div>

      <table style={{
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px"
    }}>
        <thead>
          <tr>
            <th style={{
            padding: "10px",
            textAlign: "left",
            borderBottom: "2px solid #ddd"
          }}>
              Media Query
            </th>
            <th style={{
            padding: "10px",
            textAlign: "center",
            borderBottom: "2px solid #ddd"
          }}>
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          <MediaQueryRow label="Mobile" query="(max-width: 480px)" isMatching={isMobile} />
          <MediaQueryRow label="Tablet" query="(min-width: 481px) and (max-width: 1024px)" isMatching={isTablet} />
          <MediaQueryRow label="Desktop" query="(min-width: 1025px)" isMatching={isDesktop} />
          <MediaQueryRow label="Dark Mode" query="(prefers-color-scheme: dark)" isMatching={isDarkMode} />
          <MediaQueryRow label="Reduced Motion" query="(prefers-reduced-motion: reduce)" isMatching={prefersReducedMotion} />
        </tbody>
      </table>

      <div style={{
      padding: "15px",
      backgroundColor: "#f5f5f5",
      borderRadius: "8px"
    }}>
        <h4 style={{
        marginTop: "0"
      }}>Content Adaptation Example:</h4>
        <div style={{
        marginTop: "15px"
      }}>
          {isMobile ? <div style={{
          padding: "10px",
          backgroundColor: "#fff",
          borderRadius: "4px"
        }}>
              <h5>Mobile Layout</h5>
              <p>Simplified content for small screens</p>
              <div style={{
            height: "50px",
            backgroundColor: "#f57c00",
            borderRadius: "4px",
            marginBottom: "10px"
          }}></div>
              <div style={{
            height: "50px",
            backgroundColor: "#f57c00",
            borderRadius: "4px",
            opacity: 0.7
          }}></div>
            </div> : isTablet ? <div style={{
          padding: "10px",
          backgroundColor: "#fff",
          borderRadius: "4px"
        }}>
              <h5>Tablet Layout</h5>
              <p>Balanced content for medium screens</p>
              <div style={{
            display: "flex",
            gap: "10px"
          }}>
                <div style={{
              flex: 1,
              height: "80px",
              backgroundColor: "#0277bd",
              borderRadius: "4px"
            }}></div>
                <div style={{
              flex: 1,
              height: "80px",
              backgroundColor: "#0277bd",
              borderRadius: "4px",
              opacity: 0.7
            }}></div>
              </div>
            </div> : <div style={{
          padding: "10px",
          backgroundColor: "#fff",
          borderRadius: "4px"
        }}>
              <h5>Desktop Layout</h5>
              <p>Full content for large screens</p>
              <div style={{
            display: "flex",
            gap: "10px"
          }}>
                <div style={{
              flex: 1,
              height: "120px",
              backgroundColor: "#2e7d32",
              borderRadius: "4px"
            }}></div>
                <div style={{
              flex: 2,
              height: "120px",
              backgroundColor: "#2e7d32",
              borderRadius: "4px",
              opacity: 0.8
            }}></div>
                <div style={{
              flex: 1,
              height: "120px",
              backgroundColor: "#2e7d32",
              borderRadius: "4px",
              opacity: 0.6
            }}></div>
              </div>
            </div>}
        </div>
      </div>

      <p style={{
      marginTop: "20px",
      fontStyle: "italic",
      color: "#666"
    }}>
        Resize your browser window to see the responsive changes. Note that dark
        mode and reduced motion preferences depend on your system settings.
      </p>
    </div>;
}`,...(x=(m=i.parameters)==null?void 0:m.docs)==null?void 0:x.source}}};const g=["Default"];export{i as Default,g as __namedExportsOrder,b as default};
