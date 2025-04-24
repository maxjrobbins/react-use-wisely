import{r as a,R as e}from"./index-D4H_InIO.js";const k=(s=[])=>{const[i,t]=a.useState(new Set(s)),p=a.useRef(i);p.current=i;const c={add:a.useCallback(l=>{t(r=>{const n=new Set(r);return n.add(l),n})},[]),remove:a.useCallback(l=>{t(r=>{const n=new Set(r);return n.delete(l),n})},[]),clear:a.useCallback(()=>{t(new Set)},[]),has:a.useCallback(l=>p.current.has(l),[]),toggle:a.useCallback(l=>{t(r=>{const n=new Set(r);return n.has(l)?n.delete(l):n.add(l),n})},[])};return[i,c]},C={title:"Hooks/useSet",parameters:{componentSubtitle:"A React hook for Set data structure with convenient methods",docs:{description:{component:"This hook provides a stateful Set with additional utility methods for adding, deleting, and checking elements."}}}},d=()=>{const[s,i]=a.useState(""),[t,p]=a.useState(""),[c,l]=a.useState(null),{add:r,remove:n,has:u,clear:f,values:b,size:m}=k(["apple","banana","orange"]),y=o=>{o.preventDefault(),s.trim()&&(r(s.trim()),i(""))};return e.createElement("div",{style:{padding:"20px",border:"1px solid #ddd",borderRadius:"4px"}},e.createElement("h3",null,"useSet Demo"),e.createElement("p",{style:{marginBottom:"20px"}},"This example demonstrates how to use the ",e.createElement("code",null,"useSet")," hook to manage a Set of values."),e.createElement("div",{style:{display:"flex",marginBottom:"20px"}},e.createElement("form",{onSubmit:y,style:{display:"flex",gap:"10px",marginBottom:"20px"}},e.createElement("input",{type:"text",value:s,onChange:o=>i(o.target.value),placeholder:"Enter item",style:{padding:"8px 12px",borderRadius:"4px",border:"1px solid #ccc",flexGrow:1,minWidth:"200px"}}),e.createElement("button",{type:"submit",style:{padding:"8px 16px",backgroundColor:"#4CAF50",color:"white",border:"none",borderRadius:"4px",cursor:"pointer"}},"Add Item"),e.createElement("button",{type:"button",onClick:()=>f(),style:{padding:"8px 16px",backgroundColor:"#f44336",color:"white",border:"none",borderRadius:"4px",cursor:"pointer"}},"Clear All"))),e.createElement("div",{style:{marginBottom:"20px"}},e.createElement("h4",null,"Check if item exists in set:"),e.createElement("div",{style:{display:"flex",gap:"10px",alignItems:"center",marginBottom:"10px"}},e.createElement("input",{type:"text",value:t,onChange:o=>p(o.target.value),placeholder:"Check item",style:{padding:"8px 12px",borderRadius:"4px",border:"1px solid #ccc",flexGrow:1}}),e.createElement("div",{style:{padding:"8px 16px",backgroundColor:t.trim()?u(t.trim())?"#e8f5e9":"#ffebee":"#f5f5f5",border:"1px solid #ddd",borderRadius:"4px",minWidth:"100px",textAlign:"center"}},t.trim()?u(t.trim())?"Exists":"Not found":"Enter item to check"))),e.createElement("div",null,e.createElement("h4",null,"Current Set (",m," items):"),e.createElement("div",{style:{backgroundColor:"#f5f5f5",borderRadius:"4px",padding:"10px",minHeight:"100px"}},m>0?e.createElement("ul",{style:{listStyle:"none",padding:0,margin:0,display:"flex",flexWrap:"wrap",gap:"10px"}},[...b].map(o=>e.createElement("li",{key:o,style:{backgroundColor:"white",padding:"8px 12px",borderRadius:"30px",border:"1px solid #ddd",display:"flex",alignItems:"center",gap:"8px"}},e.createElement("span",null,o),e.createElement("button",{onClick:()=>n(o),style:{backgroundColor:"#f44336",color:"white",border:"none",borderRadius:"50%",width:"20px",height:"20px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:"12px",padding:0,lineHeight:1}},"×")))):e.createElement("div",{style:{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",color:"#999",fontStyle:"italic"}},"Set is empty"))),e.createElement("div",{style:{marginTop:"20px",backgroundColor:"#e3f2fd",padding:"15px",borderRadius:"4px"}},e.createElement("h4",{style:{margin:"0 0 10px 0"}},"Hook API:"),e.createElement("ul",{style:{margin:"0",paddingLeft:"20px"}},e.createElement("li",null,e.createElement("code",null,"add(item)")," - Adds an item to the set"),e.createElement("li",null,e.createElement("code",null,"remove(item)")," - Removes an item from the set"),e.createElement("li",null,e.createElement("code",null,"clear()")," - Removes all items from the set"),e.createElement("li",null,e.createElement("code",null,"has(item)")," - Checks if an item exists in the set"))))};d.storyName="Basic Usage";d.__docgenInfo={description:"",methods:[],displayName:"Default"};var x,h,g;d.parameters={...d.parameters,docs:{...(x=d.parameters)==null?void 0:x.docs,source:{originalSource:`() => {
  const [inputValue, setInputValue] = useState("");
  const [checkValue, setCheckValue] = useState("");
  const [checkResult, setCheckResult] = useState(null);

  // Initialize with some default values
  const {
    add,
    remove,
    has,
    clear,
    toggle,
    reset,
    values,
    size
  } = useSet(["apple", "banana", "orange"]);
  const handleAddItem = e => {
    e.preventDefault();
    if (inputValue.trim()) {
      add(inputValue.trim());
      setInputValue("");
    }
  };
  const handleCheck = e => {
    e.preventDefault();
    if (checkValue.trim()) {
      setCheckResult(has(checkValue.trim()));
    }
  };
  const handleToggle = item => {
    toggle(item);
  };
  return <div style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "4px"
  }}>
      <h3>useSet Demo</h3>

      <p style={{
      marginBottom: "20px"
    }}>
        This example demonstrates how to use the <code>useSet</code> hook to
        manage a Set of values.
      </p>

      <div style={{
      display: "flex",
      marginBottom: "20px"
    }}>
        <form onSubmit={handleAddItem} style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px"
      }}>
          <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Enter item" style={{
          padding: "8px 12px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          flexGrow: 1,
          minWidth: "200px"
        }} />
          <button type="submit" style={{
          padding: "8px 16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}>
            Add Item
          </button>
          <button type="button" onClick={() => clear()} style={{
          padding: "8px 16px",
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}>
            Clear All
          </button>
        </form>
      </div>

      <div style={{
      marginBottom: "20px"
    }}>
        <h4>Check if item exists in set:</h4>
        <div style={{
        display: "flex",
        gap: "10px",
        alignItems: "center",
        marginBottom: "10px"
      }}>
          <input type="text" value={checkValue} onChange={e => setCheckValue(e.target.value)} placeholder="Check item" style={{
          padding: "8px 12px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          flexGrow: 1
        }} />
          <div style={{
          padding: "8px 16px",
          backgroundColor: checkValue.trim() ? has(checkValue.trim()) ? "#e8f5e9" : "#ffebee" : "#f5f5f5",
          border: "1px solid #ddd",
          borderRadius: "4px",
          minWidth: "100px",
          textAlign: "center"
        }}>
            {checkValue.trim() ? has(checkValue.trim()) ? "Exists" : "Not found" : "Enter item to check"}
          </div>
        </div>
      </div>

      <div>
        <h4>Current Set ({size} items):</h4>
        <div style={{
        backgroundColor: "#f5f5f5",
        borderRadius: "4px",
        padding: "10px",
        minHeight: "100px"
      }}>
          {size > 0 ? <ul style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexWrap: "wrap",
          gap: "10px"
        }}>
              {[...values].map(item => <li key={item} style={{
            backgroundColor: "white",
            padding: "8px 12px",
            borderRadius: "30px",
            border: "1px solid #ddd",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
                  <span>{item}</span>
                  <button onClick={() => remove(item)} style={{
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "12px",
              padding: 0,
              lineHeight: 1
            }}>
                    ×
                  </button>
                </li>)}
            </ul> : <div style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
          fontStyle: "italic"
        }}>
              Set is empty
            </div>}
        </div>
      </div>

      <div style={{
      marginTop: "20px",
      backgroundColor: "#e3f2fd",
      padding: "15px",
      borderRadius: "4px"
    }}>
        <h4 style={{
        margin: "0 0 10px 0"
      }}>Hook API:</h4>
        <ul style={{
        margin: "0",
        paddingLeft: "20px"
      }}>
          <li>
            <code>add(item)</code> - Adds an item to the set
          </li>
          <li>
            <code>remove(item)</code> - Removes an item from the set
          </li>
          <li>
            <code>clear()</code> - Removes all items from the set
          </li>
          <li>
            <code>has(item)</code> - Checks if an item exists in the set
          </li>
        </ul>
      </div>
    </div>;
}`,...(g=(h=d.parameters)==null?void 0:h.docs)==null?void 0:g.source}}};const E=["Default"];export{d as Default,E as __namedExportsOrder,C as default};
