import{r as c,R as n}from"./index-D4H_InIO.js";function S(o,a){const[s,l]=c.useState(()=>{if(typeof window>"u")return a;try{const e=window.localStorage.getItem(o);return e?JSON.parse(e):a}catch(e){return console.error(e),a}}),i=e=>{try{const t=e instanceof Function?e(s):e;l(t),typeof window<"u"&&window.localStorage.setItem(o,JSON.stringify(t))}catch(t){console.error(t)}};return c.useEffect(()=>{if(typeof window>"u")return;const e=t=>{if(t.key===o&&t.newValue!==null)try{l(JSON.parse(t.newValue))}catch(u){console.error(u)}};return window.addEventListener("storage",e),()=>{window.removeEventListener("storage",e)}},[o]),[s,i]}const h={title:"Hooks/useLocalStorage",parameters:{componentSubtitle:"Hook for persistent local storage state",docs:{description:{component:"A React hook that syncs and persists state with localStorage, maintaining values between page refreshes."}}}},r=()=>{const o=`demoKey-${Date.now().toString().slice(-5)}`,[a,s]=S(o,"Hello world!"),[l,i]=c.useState(a),e=u=>{i(u.target.value)},t=()=>{s(l)};return n.createElement("div",{style:{padding:"20px",border:"1px solid #ddd",borderRadius:"4px"}},n.createElement("h3",null,"Local Storage Demo"),n.createElement("p",null,"Current value in localStorage[",o,"]:"," ",n.createElement("strong",null,a)),n.createElement("div",{style:{marginTop:"20px"}},n.createElement("input",{type:"text",value:l,onChange:e,style:{padding:"8px",marginRight:"10px"}}),n.createElement("button",{onClick:t},"Save to localStorage")),n.createElement("p",{style:{marginTop:"20px",fontStyle:"italic",color:"#666"}},'Try updating the value and clicking "Save". The value will persist in localStorage even if you refresh the page.'))};r.storyName="Basic Usage";r.__docgenInfo={description:"",methods:[],displayName:"Default"};var d,p,g;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`() => {
  // Use a unique key with timestamp to avoid conflicts between story renders
  const uniqueKey = \`demoKey-\${Date.now().toString().slice(-5)}\`;
  const [storedValue, setStoredValue] = useLocalStorage(uniqueKey, "Hello world!");
  const [inputValue, setInputValue] = useState(storedValue);
  const handleChange = e => {
    setInputValue(e.target.value);
  };
  const handleSave = () => {
    setStoredValue(inputValue);
  };
  return <div style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "4px"
  }}>
      <h3>Local Storage Demo</h3>
      <p>
        Current value in localStorage[{uniqueKey}]:{" "}
        <strong>{storedValue}</strong>
      </p>

      <div style={{
      marginTop: "20px"
    }}>
        <input type="text" value={inputValue} onChange={handleChange} style={{
        padding: "8px",
        marginRight: "10px"
      }} />
        <button onClick={handleSave}>Save to localStorage</button>
      </div>

      <p style={{
      marginTop: "20px",
      fontStyle: "italic",
      color: "#666"
    }}>
        Try updating the value and clicking "Save". The value will persist in
        localStorage even if you refresh the page.
      </p>
    </div>;
}`,...(g=(p=r.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};const y=["Default"];export{r as Default,y as __namedExportsOrder,h as default};
