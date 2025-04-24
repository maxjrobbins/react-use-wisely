import{r as a,R as e}from"./index-D4H_InIO.js";const y={title:"Hooks/useWhyDidYouUpdate",parameters:{componentSubtitle:"Hook for debugging component updates",docs:{description:{component:"A React hook that logs which props or state caused a component to re-render, useful for debugging performance issues."}}}},p=({label:n,count:l,color:r,obj:s})=>e.createElement("div",{style:{padding:"20px",backgroundColor:r,borderRadius:"4px",marginBottom:"20px"}},e.createElement("h4",null,n),e.createElement("p",null,"Count: ",l),e.createElement("p",null,"Object value: ",s.value)),t=()=>{const[n,l]=a.useState(0),[r,s]=a.useState("Debug Component"),[d,g]=a.useState("#f5f5f5"),[c,m]=a.useState(0),h={value:c},f=e.useMemo(()=>({value:c}),[c]);return e.createElement("div",{style:{padding:"20px",border:"1px solid #ddd",borderRadius:"4px"}},e.createElement("h3",null,"Why Did You Update Demo"),e.createElement("p",{style:{marginBottom:"20px"}},"This hook logs when props or state change, causing re-renders. Open your browser's console to see these logs."),e.createElement("div",{style:{display:"flex",gap:"10px",marginBottom:"30px",flexWrap:"wrap"}},e.createElement("button",{onClick:()=>l(o=>o+1),style:{padding:"8px 16px",backgroundColor:"#4CAF50",color:"white",border:"none",borderRadius:"4px"}},"Increment Count"),e.createElement("button",{onClick:()=>s(o=>o==="Debug Component"?"Updated Label":"Debug Component"),style:{padding:"8px 16px",backgroundColor:"#2196F3",color:"white",border:"none",borderRadius:"4px"}},"Toggle Label"),e.createElement("button",{onClick:()=>g(o=>o==="#f5f5f5"?"#e0f7fa":"#f5f5f5"),style:{padding:"8px 16px",backgroundColor:"#9C27B0",color:"white",border:"none",borderRadius:"4px"}},"Toggle Color"),e.createElement("button",{onClick:()=>m(o=>o+1),style:{padding:"8px 16px",backgroundColor:"#FF5722",color:"white",border:"none",borderRadius:"4px"}},"Update Object Value")),e.createElement("div",{style:{padding:"15px",backgroundColor:"#fffde7",borderRadius:"4px",marginBottom:"30px",border:"1px solid #fbc02d"}},e.createElement("p",null,e.createElement("strong",null,"Note:")," Look at your browser's console to see the debug output from the hook."),e.createElement("p",null,"You'll see that when only the count changes, only the count prop is logged as changed."),e.createElement("p",null,"However, ",e.createElement("code",null,"obj")," will always appear as changed because it's recreated every render."),e.createElement("p",null,e.createElement("code",null,"stableObj")," only changes when the objValue changes due to useMemo.")),e.createElement("div",null,e.createElement("h4",null,"Example 1: Unstable Object Reference"),e.createElement("p",null,"This component receives a new object reference on every render, even if the value inside hasn't changed."),e.createElement(p,{label:r,count:n,color:d,obj:h}),e.createElement("h4",null,"Example 2: With useMemo"),e.createElement("p",null,"This component only gets a new object reference when the actual value changes."),e.createElement(p,{label:r,count:n,color:d,obj:f})),e.createElement("p",{style:{marginTop:"20px",fontStyle:"italic",color:"#666"}},"This hook is useful for finding unnecessary rerenders and optimizing performance."))};t.storyName="Basic Usage";t.__docgenInfo={description:"",methods:[],displayName:"Default"};var u,i,b;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`() => {
  const [count, setCount] = useState(0);
  const [label, setLabel] = useState("Debug Component");
  const [color, setColor] = useState("#f5f5f5");
  const [objValue, setObjValue] = useState(0);

  // This object will be recreated on every render
  const obj = {
    value: objValue
  };

  // Create a stable object reference that won't change unless objValue changes
  const stableObj = React.useMemo(() => ({
    value: objValue
  }), [objValue]);
  return <div style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "4px"
  }}>
      <h3>Why Did You Update Demo</h3>

      <p style={{
      marginBottom: "20px"
    }}>
        This hook logs when props or state change, causing re-renders. Open your
        browser's console to see these logs.
      </p>

      <div style={{
      display: "flex",
      gap: "10px",
      marginBottom: "30px",
      flexWrap: "wrap"
    }}>
        <button onClick={() => setCount(c => c + 1)} style={{
        padding: "8px 16px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "4px"
      }}>
          Increment Count
        </button>

        <button onClick={() => setLabel(prev => prev === "Debug Component" ? "Updated Label" : "Debug Component")} style={{
        padding: "8px 16px",
        backgroundColor: "#2196F3",
        color: "white",
        border: "none",
        borderRadius: "4px"
      }}>
          Toggle Label
        </button>

        <button onClick={() => setColor(prev => prev === "#f5f5f5" ? "#e0f7fa" : "#f5f5f5")} style={{
        padding: "8px 16px",
        backgroundColor: "#9C27B0",
        color: "white",
        border: "none",
        borderRadius: "4px"
      }}>
          Toggle Color
        </button>

        <button onClick={() => setObjValue(v => v + 1)} style={{
        padding: "8px 16px",
        backgroundColor: "#FF5722",
        color: "white",
        border: "none",
        borderRadius: "4px"
      }}>
          Update Object Value
        </button>
      </div>

      <div style={{
      padding: "15px",
      backgroundColor: "#fffde7",
      borderRadius: "4px",
      marginBottom: "30px",
      border: "1px solid #fbc02d"
    }}>
        <p>
          <strong>Note:</strong> Look at your browser's console to see the debug
          output from the hook.
        </p>
        <p>
          You'll see that when only the count changes, only the count prop is
          logged as changed.
        </p>
        <p>
          However, <code>obj</code> will always appear as changed because it's
          recreated every render.
        </p>
        <p>
          <code>stableObj</code> only changes when the objValue changes due to
          useMemo.
        </p>
      </div>

      <div>
        <h4>Example 1: Unstable Object Reference</h4>
        <p>
          This component receives a new object reference on every render, even
          if the value inside hasn't changed.
        </p>
        <DebugComponent label={label} count={count} color={color} obj={obj} />

        <h4>Example 2: With useMemo</h4>
        <p>
          This component only gets a new object reference when the actual value
          changes.
        </p>
        <DebugComponent label={label} count={count} color={color} obj={stableObj} />
      </div>

      <p style={{
      marginTop: "20px",
      fontStyle: "italic",
      color: "#666"
    }}>
        This hook is useful for finding unnecessary rerenders and optimizing
        performance.
      </p>
    </div>;
}`,...(b=(i=t.parameters)==null?void 0:i.docs)==null?void 0:b.source}}};const C=["Default"];export{t as Default,C as __namedExportsOrder,y as default};
