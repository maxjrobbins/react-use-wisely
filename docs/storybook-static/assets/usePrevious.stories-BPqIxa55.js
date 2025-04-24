import{r,R as e}from"./index-D4H_InIO.js";const u=n=>{const o=r.useRef(void 0);return r.useEffect(()=>{o.current=n},[n]),o.current},p={title:"Hooks/usePrevious",parameters:{componentSubtitle:"Hook that returns the previous value of a variable",docs:{description:{component:"A React hook that stores and returns the previous value of a variable from the last render."}}}},t=()=>{const[n,o]=r.useState(0),s=u(n);return e.createElement("div",{style:{padding:"20px",border:"1px solid #ddd",borderRadius:"4px"}},e.createElement("h3",null,"Previous Value Demo"),e.createElement("div",{style:{display:"flex",gap:"20px",alignItems:"center",marginBottom:"20px"}},e.createElement("button",{onClick:()=>o(n-1),style:{padding:"8px 12px"}},"-"),e.createElement("button",{onClick:()=>o(n+1),style:{padding:"8px 12px"}},"+")),e.createElement("div",{style:{display:"flex",gap:"20px"}},e.createElement("div",null,e.createElement("h4",null,"Current Value:"),e.createElement("pre",{style:{padding:"10px",backgroundColor:"#f0f0f0",borderRadius:"4px"}},n)),e.createElement("div",null,e.createElement("h4",null,"Previous Value:"),e.createElement("pre",{style:{padding:"10px",backgroundColor:"#f0f0f0",borderRadius:"4px"}},s===void 0?"undefined":s))),e.createElement("p",{style:{marginTop:"20px",fontStyle:"italic",color:"#666"}},"Click the buttons to change the count. The previous value will always be one step behind."))};t.storyName="Basic Usage";t.__docgenInfo={description:"",methods:[],displayName:"Default"};var a,l,i;t.parameters={...t.parameters,docs:{...(a=t.parameters)==null?void 0:a.docs,source:{originalSource:`() => {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);
  return <div style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "4px"
  }}>
      <h3>Previous Value Demo</h3>

      <div style={{
      display: "flex",
      gap: "20px",
      alignItems: "center",
      marginBottom: "20px"
    }}>
        <button onClick={() => setCount(count - 1)} style={{
        padding: "8px 12px"
      }}>
          -
        </button>

        <button onClick={() => setCount(count + 1)} style={{
        padding: "8px 12px"
      }}>
          +
        </button>
      </div>

      <div style={{
      display: "flex",
      gap: "20px"
    }}>
        <div>
          <h4>Current Value:</h4>
          <pre style={{
          padding: "10px",
          backgroundColor: "#f0f0f0",
          borderRadius: "4px"
        }}>
            {count}
          </pre>
        </div>

        <div>
          <h4>Previous Value:</h4>
          <pre style={{
          padding: "10px",
          backgroundColor: "#f0f0f0",
          borderRadius: "4px"
        }}>
            {previousCount === undefined ? "undefined" : previousCount}
          </pre>
        </div>
      </div>

      <p style={{
      marginTop: "20px",
      fontStyle: "italic",
      color: "#666"
    }}>
        Click the buttons to change the count. The previous value will always be
        one step behind.
      </p>
    </div>;
}`,...(i=(l=t.parameters)==null?void 0:l.docs)==null?void 0:i.source}}};const c=["Default"];export{t as Default,c as __namedExportsOrder,p as default};
