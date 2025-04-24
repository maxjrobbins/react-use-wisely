import{r as o,R as e}from"./index-D4H_InIO.js";const w=()=>{const[n,a]=o.useState({width:void 0,height:void 0});return o.useEffect(()=>{function i(){a({width:window.innerWidth,height:window.innerHeight})}return window.addEventListener("resize",i),i(),()=>window.removeEventListener("resize",i)},[]),n},u={title:"Hooks/useWindowSize",parameters:{componentSubtitle:"Hook that returns the current window dimensions",docs:{description:{component:"A React hook that tracks browser window dimensions and updates when the window is resized."}}}},t=()=>{const n=w();return e.createElement("div",{style:{padding:"20px",border:"1px solid #ddd",borderRadius:"4px"}},e.createElement("h3",null,"Window Size Demo"),e.createElement("p",null,"Current window width: ",e.createElement("strong",null,n.width,"px")),e.createElement("p",null,"Current window height: ",e.createElement("strong",null,n.height,"px")),e.createElement("p",{style:{fontStyle:"italic",color:"#666"}},"Resize your browser window to see values update in real-time"))};t.storyName="Basic Usage";t.__docgenInfo={description:"",methods:[],displayName:"Default"};var r,s,d;t.parameters={...t.parameters,docs:{...(r=t.parameters)==null?void 0:r.docs,source:{originalSource:`() => {
  const size = useWindowSize();
  return <div style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "4px"
  }}>
      <h3>Window Size Demo</h3>
      <p>
        Current window width: <strong>{size.width}px</strong>
      </p>
      <p>
        Current window height: <strong>{size.height}px</strong>
      </p>
      <p style={{
      fontStyle: "italic",
      color: "#666"
    }}>
        Resize your browser window to see values update in real-time
      </p>
    </div>;
}`,...(d=(s=t.parameters)==null?void 0:s.docs)==null?void 0:d.source}}};const c=["Default"];export{t as Default,c as __namedExportsOrder,u as default};
