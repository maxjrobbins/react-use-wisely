import{r as a,R as e}from"./index-D4H_InIO.js";const m=()=>{const[t,i]=a.useState(!1);return a.useEffect(()=>{if(typeof window>"u"||!window.matchMedia)return;const n=window.matchMedia("(prefers-reduced-motion: reduce)");i(n.matches);const o=r=>{i(r.matches)};return"addEventListener"in n?n.addEventListener("change",o):n.addListener(o),()=>{"removeEventListener"in n?n.removeEventListener("change",o):n.removeListener(o)}},[]),t},g={title:"Hooks/usePrefersReducedMotion",parameters:{componentSubtitle:"Hook for detecting user motion preferences",docs:{description:{component:"A React hook that detects if a user has requested reduced motion in their system preferences."}}}},s=()=>{const t=m(),[i,n]=a.useState(!1),o=()=>{n(p=>!p)},r=!t&&i;return e.createElement("div",{style:{padding:"20px",border:"1px solid #ddd",borderRadius:"4px"}},e.createElement("h3",null,"Reduced Motion Preference Demo"),e.createElement("div",{style:{padding:"15px",backgroundColor:t?"#fff3e0":"#f5f5f5",borderRadius:"8px",marginBottom:"20px",border:t?"1px solid #ffb74d":"1px solid #ddd"}},e.createElement("h4",{style:{margin:"0 0 10px 0"}},"User Preference Detected:"),e.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",padding:"10px",backgroundColor:t?"#ffe0b2":"#e8f5e9",borderRadius:"4px"}},e.createElement("span",{style:{fontWeight:"bold",fontSize:"16px",color:t?"#e65100":"#2e7d32"}},t?"🚫 User prefers reduced motion":"✅ User allows animations")),e.createElement("p",{style:{marginTop:"10px",color:"#666",fontStyle:"italic"}},t?"Animations will be minimized or disabled for better accessibility.":"Animations will be shown as intended.")),e.createElement("div",{style:{marginBottom:"30px"}},e.createElement("button",{onClick:o,style:{padding:"10px 20px",backgroundColor:i?"#673ab7":"#9e9e9e",color:"white",border:"none",borderRadius:"4px",cursor:"pointer",transition:"background-color 0.3s ease"}},i?"Stop Animation":"Start Animation")),e.createElement("div",{style:{marginBottom:"30px"}},e.createElement("h4",null,"Animation Example:"),e.createElement("div",{style:{padding:"20px",backgroundColor:"#f5f5f5",borderRadius:"8px",display:"flex",justifyContent:"center",alignItems:"center",height:"200px",position:"relative",overflow:"hidden"}},e.createElement("div",{style:{width:"80px",height:"80px",backgroundColor:"#673ab7",borderRadius:r?"4px":"50%",animation:r?"spin 3s linear infinite, move 5s ease-in-out infinite alternate":"none",...f(r),transition:"border-radius 0.5s ease",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:"bold"}},r?"🎬":"⏹️")),t&&i&&e.createElement("div",{style:{marginTop:"10px",padding:"10px",backgroundColor:"#fff3e0",borderRadius:"4px",textAlign:"center",color:"#e65100",fontWeight:"bold"}},"Animation suppressed due to reduced motion preference")),e.createElement("div",{style:{backgroundColor:"#e8f5e9",padding:"15px",borderRadius:"4px"}},e.createElement("h4",{style:{margin:"0 0 10px 0"}},"How to Test:"),e.createElement("ol",{style:{margin:"0",paddingLeft:"20px"}},e.createElement("li",null,e.createElement("strong",null,"On macOS:"),' System Preferences → Accessibility → Display → Check "Reduce motion"'),e.createElement("li",null,e.createElement("strong",null,"On Windows:"),' Settings → Ease of Access → Display → Turn on "Show animations in Windows"'),e.createElement("li",null,e.createElement("strong",null,"On iOS:"),' Settings → Accessibility → Motion → Enable "Reduce Motion"'),e.createElement("li",null,e.createElement("strong",null,"On Android:")," Settings → Accessibility → Remove animations"))),e.createElement("p",{style:{marginTop:"20px",fontStyle:"italic",color:"#666"}},"This hook allows you to respect user preferences for reduced motion, which is important for accessibility and to avoid triggering vestibular disorders or motion sickness."))};function f(t){return t?{position:"relative",transform:"translateX(0)","@keyframes spin":{"0%":{transform:"rotate(0deg)"},"100%":{transform:"rotate(360deg)"}},"@keyframes move":{"0%":{transform:"translateX(-50px)"},"100%":{transform:"translateX(50px)"}}}:{}}s.storyName="Basic Usage";s.__docgenInfo={description:"",methods:[],displayName:"Default"};var d,l,c;s.parameters={...s.parameters,docs:{...(d=s.parameters)==null?void 0:d.docs,source:{originalSource:`() => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isAnimating, setIsAnimating] = useState(false);

  // Function to toggle animation state
  const toggleAnimation = () => {
    setIsAnimating(prev => !prev);
  };

  // Respect user's motion preferences
  const shouldAnimate = !prefersReducedMotion && isAnimating;
  return <div style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "4px"
  }}>
      <h3>Reduced Motion Preference Demo</h3>

      <div style={{
      padding: "15px",
      backgroundColor: prefersReducedMotion ? "#fff3e0" : "#f5f5f5",
      borderRadius: "8px",
      marginBottom: "20px",
      border: prefersReducedMotion ? "1px solid #ffb74d" : "1px solid #ddd"
    }}>
        <h4 style={{
        margin: "0 0 10px 0"
      }}>User Preference Detected:</h4>
        <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px",
        backgroundColor: prefersReducedMotion ? "#ffe0b2" : "#e8f5e9",
        borderRadius: "4px"
      }}>
          <span style={{
          fontWeight: "bold",
          fontSize: "16px",
          color: prefersReducedMotion ? "#e65100" : "#2e7d32"
        }}>
            {prefersReducedMotion ? "🚫 User prefers reduced motion" : "✅ User allows animations"}
          </span>
        </div>
        <p style={{
        marginTop: "10px",
        color: "#666",
        fontStyle: "italic"
      }}>
          {prefersReducedMotion ? "Animations will be minimized or disabled for better accessibility." : "Animations will be shown as intended."}
        </p>
      </div>

      <div style={{
      marginBottom: "30px"
    }}>
        <button onClick={toggleAnimation} style={{
        padding: "10px 20px",
        backgroundColor: isAnimating ? "#673ab7" : "#9e9e9e",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        transition: "background-color 0.3s ease"
      }}>
          {isAnimating ? "Stop Animation" : "Start Animation"}
        </button>
      </div>

      <div style={{
      marginBottom: "30px"
    }}>
        <h4>Animation Example:</h4>
        <div style={{
        padding: "20px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
        position: "relative",
        overflow: "hidden"
      }}>
          <div style={{
          width: "80px",
          height: "80px",
          backgroundColor: "#673ab7",
          borderRadius: shouldAnimate ? "4px" : "50%",
          animation: shouldAnimate ? "spin 3s linear infinite, move 5s ease-in-out infinite alternate" : "none",
          // Use inline keyframes for the demo
          ...getAnimationStyle(shouldAnimate),
          transition: "border-radius 0.5s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold"
        }}>
            {shouldAnimate ? "🎬" : "⏹️"}
          </div>
        </div>

        {prefersReducedMotion && isAnimating && <div style={{
        marginTop: "10px",
        padding: "10px",
        backgroundColor: "#fff3e0",
        borderRadius: "4px",
        textAlign: "center",
        color: "#e65100",
        fontWeight: "bold"
      }}>
            Animation suppressed due to reduced motion preference
          </div>}
      </div>

      <div style={{
      backgroundColor: "#e8f5e9",
      padding: "15px",
      borderRadius: "4px"
    }}>
        <h4 style={{
        margin: "0 0 10px 0"
      }}>How to Test:</h4>
        <ol style={{
        margin: "0",
        paddingLeft: "20px"
      }}>
          <li>
            <strong>On macOS:</strong> System Preferences → Accessibility →
            Display → Check "Reduce motion"
          </li>
          <li>
            <strong>On Windows:</strong> Settings → Ease of Access → Display →
            Turn on "Show animations in Windows"
          </li>
          <li>
            <strong>On iOS:</strong> Settings → Accessibility → Motion → Enable
            "Reduce Motion"
          </li>
          <li>
            <strong>On Android:</strong> Settings → Accessibility → Remove
            animations
          </li>
        </ol>
      </div>

      <p style={{
      marginTop: "20px",
      fontStyle: "italic",
      color: "#666"
    }}>
        This hook allows you to respect user preferences for reduced motion,
        which is important for accessibility and to avoid triggering vestibular
        disorders or motion sickness.
      </p>
    </div>;
}`,...(c=(l=s.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};const b=["Default"];export{s as Default,b as __namedExportsOrder,g as default};
