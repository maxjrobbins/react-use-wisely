import{r,R as e}from"./index-D4H_InIO.js";const i=(n,a)=>{const[o,d]=r.useState(n);return r.useEffect(()=>{const l=setTimeout(()=>{d(n)},a);return()=>{clearTimeout(l)}},[n,a]),o},m={title:"Hooks/useDebounce",parameters:{componentSubtitle:"Hook that debounces a value",docs:{description:{component:"A React hook that returns a debounced version of a value, updating only after a specified delay has passed without changes."}}}},t=()=>{const[n,a]=r.useState(""),o=i(n,500),d=l=>{a(l.target.value)};return e.createElement("div",{style:{padding:"20px",border:"1px solid #ddd",borderRadius:"4px"}},e.createElement("h3",null,"Debounce Demo"),e.createElement("div",{style:{marginBottom:"20px"}},e.createElement("label",{htmlFor:"search",style:{display:"block",marginBottom:"8px"}},"Type something (debounced value updates after 500ms):"),e.createElement("input",{id:"search",type:"text",value:n,onChange:d,style:{padding:"8px",width:"100%",maxWidth:"300px"},placeholder:"Start typing..."})),e.createElement("div",{style:{display:"flex",gap:"20px"}},e.createElement("div",null,e.createElement("h4",null,"Immediate Value:"),e.createElement("pre",{style:{padding:"10px",backgroundColor:"#f0f0f0",borderRadius:"4px"}},n)),e.createElement("div",null,e.createElement("h4",null,"Debounced Value (500ms):"),e.createElement("pre",{style:{padding:"10px",backgroundColor:"#f0f0f0",borderRadius:"4px"}},o))),e.createElement("p",{style:{marginTop:"20px",fontStyle:"italic",color:"#666"}},"The debounced value will only update after you stop typing for 500ms."))};t.storyName="Basic Usage";t.__docgenInfo={description:"",methods:[],displayName:"Default"};var s,u,p;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`() => {
  const [inputValue, setInputValue] = useState("");
  const debouncedValue = useDebounce(inputValue, 500); // 500ms delay

  const handleChange = e => {
    setInputValue(e.target.value);
  };
  return <div style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "4px"
  }}>
      <h3>Debounce Demo</h3>

      <div style={{
      marginBottom: "20px"
    }}>
        <label htmlFor="search" style={{
        display: "block",
        marginBottom: "8px"
      }}>
          Type something (debounced value updates after 500ms):
        </label>
        <input id="search" type="text" value={inputValue} onChange={handleChange} style={{
        padding: "8px",
        width: "100%",
        maxWidth: "300px"
      }} placeholder="Start typing..." />
      </div>

      <div style={{
      display: "flex",
      gap: "20px"
    }}>
        <div>
          <h4>Immediate Value:</h4>
          <pre style={{
          padding: "10px",
          backgroundColor: "#f0f0f0",
          borderRadius: "4px"
        }}>
            {inputValue}
          </pre>
        </div>

        <div>
          <h4>Debounced Value (500ms):</h4>
          <pre style={{
          padding: "10px",
          backgroundColor: "#f0f0f0",
          borderRadius: "4px"
        }}>
            {debouncedValue}
          </pre>
        </div>
      </div>

      <p style={{
      marginTop: "20px",
      fontStyle: "italic",
      color: "#666"
    }}>
        The debounced value will only update after you stop typing for 500ms.
      </p>
    </div>;
}`,...(p=(u=t.parameters)==null?void 0:u.docs)==null?void 0:p.source}}};const h=["Default"];export{t as Default,h as __namedExportsOrder,m as default};
