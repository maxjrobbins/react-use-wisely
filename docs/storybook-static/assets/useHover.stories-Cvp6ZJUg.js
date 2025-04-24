import{r as s,R as e}from"./index-D4H_InIO.js";const m=()=>{const[t,r]=s.useState(!1),n=s.useRef(null),i=s.useCallback(()=>{r(!0)},[]),l=s.useCallback(()=>{r(!1)},[]);return s.useEffect(()=>{const a=n.current;if(!a){r(!1);return}return a.addEventListener("mouseenter",i),a.addEventListener("mouseleave",l),()=>{a.removeEventListener("mouseenter",i),a.removeEventListener("mouseleave",l),r(!1)}},[i,l]),[n,t]},g={title:"Hooks/useHover",parameters:{componentSubtitle:"Hook that tracks hover state",docs:{description:{component:"A React hook that detects when the mouse is hovering over a referenced element."}}}},o=()=>{const[t,r]=m();return e.createElement("div",{style:{padding:"20px"}},e.createElement("h3",null,"Hover Detection Demo"),e.createElement("div",{ref:t,style:{marginTop:"20px",padding:"40px",textAlign:"center",backgroundColor:r?"#e0f7fa":"#f5f5f5",border:"2px solid",borderColor:r?"#00bcd4":"#ddd",borderRadius:"8px",transition:"all 0.3s ease",transform:r?"scale(1.05)":"scale(1)",cursor:"pointer"}},e.createElement("h4",{style:{margin:"0",color:r?"#00838f":"#333"}},r?"You are hovering over me! 👋":"Hover over me")),e.createElement("div",{style:{marginTop:"30px",padding:"10px",backgroundColor:"#f0f0f0",borderRadius:"4px",textAlign:"center"}},e.createElement("p",null,e.createElement("strong",null,"Hover Status:")," ",r?"Hovering":"Not hovering")),e.createElement("p",{style:{marginTop:"20px",fontStyle:"italic",color:"#666"}},"The useHover hook provides a simple way to track hover state on any element."),e.createElement("div",{style:{marginTop:"30px"}},e.createElement("h4",null,"Additional Examples:"),e.createElement("div",{style:{display:"flex",gap:"20px",marginTop:"10px",flexWrap:"wrap"}},e.createElement(d,{color:"#4CAF50"}),e.createElement(d,{color:"#2196F3"}),e.createElement(d,{color:"#FFC107"}))))},d=({color:t})=>{const[r,n]=m();return e.createElement("div",{ref:r,style:{width:"120px",height:"120px",display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:n?t:"#f5f5f5",color:n?"white":"#333",borderRadius:"8px",boxShadow:n?"0 4px 8px rgba(0,0,0,0.2)":"0 1px 3px rgba(0,0,0,0.1)",transition:"all 0.3s ease"}},n?"😊":"😐")};o.storyName="Basic Usage";o.__docgenInfo={description:"",methods:[],displayName:"Default"};var c,p,v;o.parameters={...o.parameters,docs:{...(c=o.parameters)==null?void 0:c.docs,source:{originalSource:`() => {
  const [ref, isHovering] = useHover();
  return <div style={{
    padding: "20px"
  }}>
      <h3>Hover Detection Demo</h3>

      <div ref={ref} style={{
      marginTop: "20px",
      padding: "40px",
      textAlign: "center",
      backgroundColor: isHovering ? "#e0f7fa" : "#f5f5f5",
      border: "2px solid",
      borderColor: isHovering ? "#00bcd4" : "#ddd",
      borderRadius: "8px",
      transition: "all 0.3s ease",
      transform: isHovering ? "scale(1.05)" : "scale(1)",
      cursor: "pointer"
    }}>
        <h4 style={{
        margin: "0",
        color: isHovering ? "#00838f" : "#333"
      }}>
          {isHovering ? "You are hovering over me! 👋" : "Hover over me"}
        </h4>
      </div>

      <div style={{
      marginTop: "30px",
      padding: "10px",
      backgroundColor: "#f0f0f0",
      borderRadius: "4px",
      textAlign: "center"
    }}>
        <p>
          <strong>Hover Status:</strong>{" "}
          {isHovering ? "Hovering" : "Not hovering"}
        </p>
      </div>

      <p style={{
      marginTop: "20px",
      fontStyle: "italic",
      color: "#666"
    }}>
        The useHover hook provides a simple way to track hover state on any
        element.
      </p>

      <div style={{
      marginTop: "30px"
    }}>
        <h4>Additional Examples:</h4>
        <div style={{
        display: "flex",
        gap: "20px",
        marginTop: "10px",
        flexWrap: "wrap"
      }}>
          <HoverCard color="#4CAF50" />
          <HoverCard color="#2196F3" />
          <HoverCard color="#FFC107" />
        </div>
      </div>
    </div>;
}`,...(v=(p=o.parameters)==null?void 0:p.docs)==null?void 0:v.source}}};const f=["Default"];export{o as Default,f as __namedExportsOrder,g as default};
