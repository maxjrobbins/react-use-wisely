import{r as d,R as e}from"./index-D4H_InIO.js";const m=()=>{const[l,r]=d.useState({}),t=d.useRef(null);return d.useEffect(()=>{if(!t.current)return;if(typeof ResizeObserver>"u"){console.warn("ResizeObserver is not supported in this browser");return}const i=t.current,s=new ResizeObserver(a=>{if(!a.length)return;const{contentRect:n}=a[0];r({width:n.width,height:n.height,top:n.top,left:n.left,right:n.right,bottom:n.bottom,x:n.x,y:n.y})});return s.observe(i),()=>{s.disconnect()}},[]),[t,l]},g={title:"Hooks/useResizeObserver",parameters:{componentSubtitle:"Hook that tracks element size changes",docs:{description:{component:"A React hook that observes and reports size changes of a DOM element using ResizeObserver API."}}}},o=()=>{const l=d.useRef(null),{width:r,height:t}=m(),[i,s]=d.useState(400);return e.createElement("div",{style:{padding:"20px",border:"1px solid #ddd",borderRadius:"4px"}},e.createElement("h3",null,"Resize Observer Demo"),e.createElement("p",{style:{marginBottom:"20px"}},"This hook detects when an element changes size. Drag the slider below to change the container's width and observe the measurements updating in real-time."),e.createElement("div",{style:{marginBottom:"20px"}},e.createElement("label",{htmlFor:"width-control",style:{display:"block",marginBottom:"8px"}},"Container Width: ",i,"px"),e.createElement("input",{id:"width-control",type:"range",min:"200",max:"600",value:i,onChange:a=>s(Number(a.target.value)),style:{width:"100%"}})),e.createElement("div",{style:{width:`${i}px`,border:"2px dashed #2196F3",padding:"20px",marginBottom:"20px",transition:"all 0.3s ease"}},e.createElement("div",{ref:l,style:{backgroundColor:"#e3f2fd",padding:"20px",borderRadius:"4px",border:"1px solid #bbdefb",height:"150px",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",textAlign:"center",position:"relative",overflow:"hidden"}},e.createElement("h4",{style:{margin:"0 0 10px 0"}},"Observed Element"),e.createElement("p",null,"My size is being tracked"),r&&t&&e.createElement("div",{style:{position:"absolute",bottom:0,right:0,backgroundColor:"rgba(33, 150, 243, 0.8)",color:"white",padding:"6px 10px",fontSize:"14px",borderTopLeftRadius:"4px"}},Math.round(r),"px × ",Math.round(t),"px"))),e.createElement("div",{style:{backgroundColor:"#f5f5f5",padding:"15px",borderRadius:"4px",marginBottom:"20px"}},e.createElement("h4",{style:{marginTop:"0"}},"Element Dimensions"),e.createElement("table",{style:{width:"100%",borderCollapse:"collapse"}},e.createElement("tbody",null,e.createElement("tr",null,e.createElement("td",{style:{padding:"8px",border:"1px solid #ddd",fontWeight:"bold"}},"Width"),e.createElement("td",{style:{padding:"8px",border:"1px solid #ddd"}},r?`${Math.round(r)}px`:"Not measured yet")),e.createElement("tr",null,e.createElement("td",{style:{padding:"8px",border:"1px solid #ddd",fontWeight:"bold"}},"Height"),e.createElement("td",{style:{padding:"8px",border:"1px solid #ddd"}},t?`${Math.round(t)}px`:"Not measured yet"))))),e.createElement("p",{style:{fontStyle:"italic",color:"#666"}},"The ResizeObserver API allows you to respond to changes in an element's size without causing layout thrashing or using polling. This is useful for responsive components that need to adapt their behavior based on their container's size rather than just the viewport."))};o.storyName="Basic Usage";o.__docgenInfo={description:"",methods:[],displayName:"Default"};var p,h,c;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`() => {
  const ref = useRef(null);
  const {
    width,
    height
  } = useResizeObserver(ref);
  const [containerWidth, setContainerWidth] = useState(400);
  return <div style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "4px"
  }}>
      <h3>Resize Observer Demo</h3>

      <p style={{
      marginBottom: "20px"
    }}>
        This hook detects when an element changes size. Drag the slider below to
        change the container's width and observe the measurements updating in
        real-time.
      </p>

      <div style={{
      marginBottom: "20px"
    }}>
        <label htmlFor="width-control" style={{
        display: "block",
        marginBottom: "8px"
      }}>
          Container Width: {containerWidth}px
        </label>
        <input id="width-control" type="range" min="200" max="600" value={containerWidth} onChange={e => setContainerWidth(Number(e.target.value))} style={{
        width: "100%"
      }} />
      </div>

      <div style={{
      width: \`\${containerWidth}px\`,
      border: "2px dashed #2196F3",
      padding: "20px",
      marginBottom: "20px",
      transition: "all 0.3s ease"
    }}>
        <div ref={ref} style={{
        backgroundColor: "#e3f2fd",
        padding: "20px",
        borderRadius: "4px",
        border: "1px solid #bbdefb",
        height: "150px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
          <h4 style={{
          margin: "0 0 10px 0"
        }}>Observed Element</h4>
          <p>My size is being tracked</p>

          {width && height && <div style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          backgroundColor: "rgba(33, 150, 243, 0.8)",
          color: "white",
          padding: "6px 10px",
          fontSize: "14px",
          borderTopLeftRadius: "4px"
        }}>
              {Math.round(width)}px × {Math.round(height)}px
            </div>}
        </div>
      </div>

      <div style={{
      backgroundColor: "#f5f5f5",
      padding: "15px",
      borderRadius: "4px",
      marginBottom: "20px"
    }}>
        <h4 style={{
        marginTop: "0"
      }}>Element Dimensions</h4>
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
                Width
              </td>
              <td style={{
              padding: "8px",
              border: "1px solid #ddd"
            }}>
                {width ? \`\${Math.round(width)}px\` : "Not measured yet"}
              </td>
            </tr>
            <tr>
              <td style={{
              padding: "8px",
              border: "1px solid #ddd",
              fontWeight: "bold"
            }}>
                Height
              </td>
              <td style={{
              padding: "8px",
              border: "1px solid #ddd"
            }}>
                {height ? \`\${Math.round(height)}px\` : "Not measured yet"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p style={{
      fontStyle: "italic",
      color: "#666"
    }}>
        The ResizeObserver API allows you to respond to changes in an element's
        size without causing layout thrashing or using polling. This is useful
        for responsive components that need to adapt their behavior based on
        their container's size rather than just the viewport.
      </p>
    </div>;
}`,...(c=(h=o.parameters)==null?void 0:h.docs)==null?void 0:c.source}}};const b=["Default"];export{o as Default,b as __namedExportsOrder,g as default};
