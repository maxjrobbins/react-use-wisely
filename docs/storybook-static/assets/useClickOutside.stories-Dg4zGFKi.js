import{r as i,R as e}from"./index-D4H_InIO.js";const p=t=>{const n=i.useRef(null);return i.useEffect(()=>{const s=a=>{n.current&&!n.current.contains(a.target)&&t()};return document.addEventListener("mousedown",s),()=>{document.removeEventListener("mousedown",s)}},[t]),n},u={title:"Hooks/useClickOutside",parameters:{componentSubtitle:"Hook that detects clicks outside of a specified element",docs:{description:{component:"A React hook that triggers a callback when a user clicks outside of the referenced element."}}}},o=()=>{const[t,n]=i.useState(!1),s=p(()=>{t&&n(!1)});return e.createElement("div",{style:{padding:"20px"}},e.createElement("h3",null,"Click Outside Demo"),e.createElement("button",{onClick:()=>n(!0)},t?"Menu is Open":"Open Menu"),t&&e.createElement("div",{ref:s,style:{position:"absolute",top:"100px",left:"20px",width:"200px",padding:"10px",backgroundColor:"#f0f0f0",border:"1px solid #ccc",borderRadius:"4px",boxShadow:"0 2px 10px rgba(0,0,0,0.1)"}},e.createElement("p",null,e.createElement("strong",null,"This is a dropdown menu")),e.createElement("p",null,"Click outside to close it")),e.createElement("p",{style:{marginTop:"20px",fontStyle:"italic",color:"#666"}},t?"Click anywhere outside the gray box to close it":"Click the button to open a menu, then click outside to close it"))};o.storyName="Basic Usage";o.__docgenInfo={description:"",methods:[],displayName:"Default"};var r,c,l;o.parameters={...o.parameters,docs:{...(r=o.parameters)==null?void 0:r.docs,source:{originalSource:`() => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside(() => {
    if (isOpen) setIsOpen(false);
  });
  return <div style={{
    padding: "20px"
  }}>
      <h3>Click Outside Demo</h3>
      <button onClick={() => setIsOpen(true)}>
        {isOpen ? "Menu is Open" : "Open Menu"}
      </button>

      {isOpen && <div ref={ref} style={{
      position: "absolute",
      top: "100px",
      left: "20px",
      width: "200px",
      padding: "10px",
      backgroundColor: "#f0f0f0",
      border: "1px solid #ccc",
      borderRadius: "4px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
          <p>
            <strong>This is a dropdown menu</strong>
          </p>
          <p>Click outside to close it</p>
        </div>}

      <p style={{
      marginTop: "20px",
      fontStyle: "italic",
      color: "#666"
    }}>
        {isOpen ? "Click anywhere outside the gray box to close it" : "Click the button to open a menu, then click outside to close it"}
      </p>
    </div>;
}`,...(l=(c=o.parameters)==null?void 0:c.docs)==null?void 0:l.source}}};const m=["Default"];export{o as Default,m as __namedExportsOrder,u as default};
