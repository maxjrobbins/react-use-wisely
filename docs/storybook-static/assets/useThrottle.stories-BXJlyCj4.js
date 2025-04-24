import{r as o,R as e}from"./index-D4H_InIO.js";function m(n,r=500){const[s,d]=o.useState(n),l=o.useRef(Date.now());return o.useEffect(()=>{const t=setTimeout(()=>{Date.now()-l.current>=r&&(d(n),l.current=Date.now())},r-(Date.now()-l.current));return()=>{clearTimeout(t)}},[n,r]),s}const y={title:"Hooks/useThrottle",parameters:{componentSubtitle:"Hook that throttles a value",docs:{description:{component:"A React hook that returns a throttled version of a value, limiting updates to a specified interval."}}}},i=()=>{const[n,r]=o.useState({x:0,y:0}),s=m(n,300),[d,l]=o.useState([]);return o.useEffect(()=>{const t=a=>{r({x:a.clientX,y:a.clientY})};return window.addEventListener("mousemove",t),()=>{window.removeEventListener("mousemove",t)}},[]),o.useEffect(()=>{l(t=>[...t,{...s,time:new Date().toLocaleTimeString([],{hour12:!1})}].slice(-5))},[s]),e.createElement("div",{style:{padding:"20px",border:"1px solid #ddd",borderRadius:"4px",height:"300px"}},e.createElement("h3",null,"Throttle Demo"),e.createElement("p",null,"Move your mouse around this container"),e.createElement("div",{style:{display:"flex",gap:"20px",marginBottom:"20px"}},e.createElement("div",null,e.createElement("h4",null,"Real-time Position:"),e.createElement("pre",{style:{padding:"10px",backgroundColor:"#f0f0f0",borderRadius:"4px"}},"X: ",n.x,", Y: ",n.y)),e.createElement("div",null,e.createElement("h4",null,"Throttled Position (300ms):"),e.createElement("pre",{style:{padding:"10px",backgroundColor:"#f0f0f0",borderRadius:"4px"}},"X: ",s.x,", Y: ",s.y))),e.createElement("div",null,e.createElement("h4",null,"Throttled Position Log:"),e.createElement("ul",{style:{listStyle:"none",padding:"0"}},d.map((t,a)=>e.createElement("li",{key:a,style:{marginBottom:"4px"}},"[",t.time,"] X: ",t.x,", Y: ",t.y)))),e.createElement("p",{style:{marginTop:"20px",fontStyle:"italic",color:"#666"}},"Notice how the throttled position updates at most once every 300ms, while the real-time position updates continuously."))};i.storyName="Basic Usage";i.__docgenInfo={description:"",methods:[],displayName:"Default"};var u,c,p;i.parameters={...i.parameters,docs:{...(u=i.parameters)==null?void 0:u.docs,source:{originalSource:`() => {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });
  const throttledPosition = useThrottle(mousePosition, 300); // 300ms throttle
  const [positionLog, setPositionLog] = useState([]);
  useEffect(() => {
    const handleMouseMove = e => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  useEffect(() => {
    // Log throttled position changes
    setPositionLog(prev => {
      const newLog = [...prev, {
        ...throttledPosition,
        time: new Date().toLocaleTimeString([], {
          hour12: false
        })
      }];
      return newLog.slice(-5); // Keep only last 5 entries
    });
  }, [throttledPosition]);
  return <div style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    height: "300px"
  }}>
      <h3>Throttle Demo</h3>
      <p>Move your mouse around this container</p>

      <div style={{
      display: "flex",
      gap: "20px",
      marginBottom: "20px"
    }}>
        <div>
          <h4>Real-time Position:</h4>
          <pre style={{
          padding: "10px",
          backgroundColor: "#f0f0f0",
          borderRadius: "4px"
        }}>
            X: {mousePosition.x}, Y: {mousePosition.y}
          </pre>
        </div>

        <div>
          <h4>Throttled Position (300ms):</h4>
          <pre style={{
          padding: "10px",
          backgroundColor: "#f0f0f0",
          borderRadius: "4px"
        }}>
            X: {throttledPosition.x}, Y: {throttledPosition.y}
          </pre>
        </div>
      </div>

      <div>
        <h4>Throttled Position Log:</h4>
        <ul style={{
        listStyle: "none",
        padding: "0"
      }}>
          {positionLog.map((entry, index) => <li key={index} style={{
          marginBottom: "4px"
        }}>
              [{entry.time}] X: {entry.x}, Y: {entry.y}
            </li>)}
        </ul>
      </div>

      <p style={{
      marginTop: "20px",
      fontStyle: "italic",
      color: "#666"
    }}>
        Notice how the throttled position updates at most once every 300ms,
        while the real-time position updates continuously.
      </p>
    </div>;
}`,...(p=(c=i.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};const g=["Default"];export{i as Default,g as __namedExportsOrder,y as default};
