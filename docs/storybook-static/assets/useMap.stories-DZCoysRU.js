import{r as l,R as e}from"./index-D4H_InIO.js";const R=(p=[])=>{const[o,a]=l.useState(new Map(p)),s={set:l.useCallback((n,i)=>{a(r=>{const u=new Map(r);return u.set(n,i),u})},[]),delete:l.useCallback(n=>{a(i=>{const r=new Map(i);return r.delete(n),r})},[]),clear:l.useCallback(()=>{a(new Map)},[]),get:l.useCallback(n=>o.get(n),[o]),has:l.useCallback(n=>o.has(n),[o])};return[o,s]},M={title:"Hooks/useMap",parameters:{componentSubtitle:"A React hook for Map data structure management",docs:{description:{component:"A React hook that provides a convenient wrapper around the native JavaScript Map with state management."}}}},d=()=>{const[p,o]=l.useState(""),[a,s]=l.useState(""),[n,i]=l.useState(""),r=new Map([["name","John Doe"],["age","30"],["location","New York"]]),[u,{set:h,get:b,remove:k,clear:v,has:m}]=R(r),f=t=>{t.preventDefault(),p.trim()&&(h(p.trim(),a),o(""),s(""))},E=t=>{k(t)},c=Array.from(u.entries());return e.createElement("div",{style:{padding:"20px",border:"1px solid #ddd",borderRadius:"4px"}},e.createElement("h3",null,"useMap Demo"),e.createElement("p",{style:{marginBottom:"20px"}},"This example demonstrates how to use the ",e.createElement("code",null,"useMap")," hook to manage a Map of key-value pairs."),e.createElement("div",{style:{display:"flex",flexDirection:"column",gap:"20px",marginBottom:"20px"}},e.createElement("form",{onSubmit:f,style:{display:"flex",flexWrap:"wrap",gap:"10px",alignItems:"flex-end"}},e.createElement("div",{style:{display:"flex",flexDirection:"column",gap:"5px"}},e.createElement("label",{htmlFor:"key-input"},"Key:"),e.createElement("input",{id:"key-input",type:"text",value:p,onChange:t=>o(t.target.value),placeholder:"Enter key",style:{padding:"8px 12px",borderRadius:"4px",border:"1px solid #ccc",width:"150px"}})),e.createElement("div",{style:{display:"flex",flexDirection:"column",gap:"5px"}},e.createElement("label",{htmlFor:"value-input"},"Value:"),e.createElement("input",{id:"value-input",type:"text",value:a,onChange:t=>s(t.target.value),placeholder:"Enter value",style:{padding:"8px 12px",borderRadius:"4px",border:"1px solid #ccc",width:"200px"}})),e.createElement("div",{style:{display:"flex",gap:"10px"}},e.createElement("button",{type:"submit",style:{padding:"8px 16px",backgroundColor:"#4CAF50",color:"white",border:"none",borderRadius:"4px",cursor:"pointer",height:"40px"}},"Add Entry"),e.createElement("button",{type:"button",onClick:()=>v(),style:{padding:"8px 16px",backgroundColor:"#f44336",color:"white",border:"none",borderRadius:"4px",cursor:"pointer",height:"40px"}},"Clear All"))),e.createElement("div",{style:{marginTop:"20px"}},e.createElement("h4",null,"Lookup Value by Key:"),e.createElement("div",{style:{display:"flex",gap:"10px",alignItems:"center"}},e.createElement("input",{type:"text",value:n,onChange:t=>i(t.target.value),placeholder:"Enter key to lookup",style:{padding:"8px 12px",borderRadius:"4px",border:"1px solid #ccc",width:"200px"}}),e.createElement("div",{style:{padding:"8px 16px",backgroundColor:n.trim()?m(n.trim())?"#e8f5e9":"#ffebee":"#f5f5f5",border:"1px solid #ddd",borderRadius:"4px",minWidth:"150px"}},n.trim()?m(n.trim())?e.createElement(e.Fragment,null,"Value: ",e.createElement("strong",null,b(n.trim()))):"Key not found":"Enter key to lookup")))),e.createElement("div",null,e.createElement("h4",null,"Current Map (",c.length," entries):"),e.createElement("div",{style:{backgroundColor:"#f5f5f5",borderRadius:"4px",padding:"10px",minHeight:"100px"}},c.length>0?e.createElement("table",{style:{width:"100%",borderCollapse:"collapse"}},e.createElement("thead",null,e.createElement("tr",null,e.createElement("th",{style:{textAlign:"left",padding:"8px",borderBottom:"1px solid #ddd"}},"Key"),e.createElement("th",{style:{textAlign:"left",padding:"8px",borderBottom:"1px solid #ddd"}},"Value"),e.createElement("th",{style:{textAlign:"center",padding:"8px",borderBottom:"1px solid #ddd"}},"Actions"))),e.createElement("tbody",null,c.map(([t,C])=>e.createElement("tr",{key:t,style:{backgroundColor:"white"}},e.createElement("td",{style:{padding:"8px",borderBottom:"1px solid #eee"}},e.createElement("code",null,t)),e.createElement("td",{style:{padding:"8px",borderBottom:"1px solid #eee"}},C),e.createElement("td",{style:{padding:"8px",borderBottom:"1px solid #eee",textAlign:"center"}},e.createElement("button",{onClick:()=>E(t),style:{padding:"4px 8px",backgroundColor:"#f44336",color:"white",border:"none",borderRadius:"4px",cursor:"pointer",fontSize:"12px"}},"Remove")))))):e.createElement("div",{style:{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",color:"#999",fontStyle:"italic",padding:"20px 0"}},"Map is empty"))),e.createElement("div",{style:{marginTop:"20px",backgroundColor:"#e3f2fd",padding:"15px",borderRadius:"4px"}},e.createElement("h4",{style:{margin:"0 0 10px 0"}},"Hook API:"),e.createElement("ul",{style:{margin:"0",paddingLeft:"20px"}},e.createElement("li",null,e.createElement("code",null,"set(key, value)")," - Sets a key-value pair in the map"),e.createElement("li",null,e.createElement("code",null,"get(key)")," - Gets the value for a key"),e.createElement("li",null,e.createElement("code",null,"remove(key)")," - Removes a key-value pair by key"),e.createElement("li",null,e.createElement("code",null,"clear()")," - Removes all entries from the map"),e.createElement("li",null,e.createElement("code",null,"has(key)")," - Checks if a key exists in the map"))))};d.storyName="Basic Usage";d.__docgenInfo={description:"",methods:[],displayName:"Default"};var x,y,g;d.parameters={...d.parameters,docs:{...(x=d.parameters)==null?void 0:x.docs,source:{originalSource:`() => {
  const [keyInput, setKeyInput] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [lookupKey, setLookupKey] = useState("");
  const initialMap = new Map([["name", "John Doe"], ["age", "30"], ["location", "New York"]]);
  const [map, {
    set,
    get,
    remove,
    clear,
    has
  }] = useMap(initialMap);
  const handleAdd = e => {
    e.preventDefault();
    if (keyInput.trim()) {
      set(keyInput.trim(), valueInput);
      setKeyInput("");
      setValueInput("");
    }
  };
  const handleRemove = key => {
    remove(key);
  };
  const mapEntries = Array.from(map.entries());
  return <div style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "4px"
  }}>
      <h3>useMap Demo</h3>

      <p style={{
      marginBottom: "20px"
    }}>
        This example demonstrates how to use the <code>useMap</code> hook to
        manage a Map of key-value pairs.
      </p>

      <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      marginBottom: "20px"
    }}>
        <form onSubmit={handleAdd} style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        alignItems: "flex-end"
      }}>
          <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px"
        }}>
            <label htmlFor="key-input">Key:</label>
            <input id="key-input" type="text" value={keyInput} onChange={e => setKeyInput(e.target.value)} placeholder="Enter key" style={{
            padding: "8px 12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "150px"
          }} />
          </div>

          <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px"
        }}>
            <label htmlFor="value-input">Value:</label>
            <input id="value-input" type="text" value={valueInput} onChange={e => setValueInput(e.target.value)} placeholder="Enter value" style={{
            padding: "8px 12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "200px"
          }} />
          </div>

          <div style={{
          display: "flex",
          gap: "10px"
        }}>
            <button type="submit" style={{
            padding: "8px 16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            height: "40px"
          }}>
              Add Entry
            </button>

            <button type="button" onClick={() => clear()} style={{
            padding: "8px 16px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            height: "40px"
          }}>
              Clear All
            </button>
          </div>
        </form>

        <div style={{
        marginTop: "20px"
      }}>
          <h4>Lookup Value by Key:</h4>
          <div style={{
          display: "flex",
          gap: "10px",
          alignItems: "center"
        }}>
            <input type="text" value={lookupKey} onChange={e => setLookupKey(e.target.value)} placeholder="Enter key to lookup" style={{
            padding: "8px 12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "200px"
          }} />
            <div style={{
            padding: "8px 16px",
            backgroundColor: lookupKey.trim() ? has(lookupKey.trim()) ? "#e8f5e9" : "#ffebee" : "#f5f5f5",
            border: "1px solid #ddd",
            borderRadius: "4px",
            minWidth: "150px"
          }}>
              {lookupKey.trim() ? has(lookupKey.trim()) ? <>
                    Value: <strong>{get(lookupKey.trim())}</strong>
                  </> : "Key not found" : "Enter key to lookup"}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4>Current Map ({mapEntries.length} entries):</h4>
        <div style={{
        backgroundColor: "#f5f5f5",
        borderRadius: "4px",
        padding: "10px",
        minHeight: "100px"
      }}>
          {mapEntries.length > 0 ? <table style={{
          width: "100%",
          borderCollapse: "collapse"
        }}>
              <thead>
                <tr>
                  <th style={{
                textAlign: "left",
                padding: "8px",
                borderBottom: "1px solid #ddd"
              }}>
                    Key
                  </th>
                  <th style={{
                textAlign: "left",
                padding: "8px",
                borderBottom: "1px solid #ddd"
              }}>
                    Value
                  </th>
                  <th style={{
                textAlign: "center",
                padding: "8px",
                borderBottom: "1px solid #ddd"
              }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {mapEntries.map(([key, value]) => <tr key={key} style={{
              backgroundColor: "white"
            }}>
                    <td style={{
                padding: "8px",
                borderBottom: "1px solid #eee"
              }}>
                      <code>{key}</code>
                    </td>
                    <td style={{
                padding: "8px",
                borderBottom: "1px solid #eee"
              }}>
                      {value}
                    </td>
                    <td style={{
                padding: "8px",
                borderBottom: "1px solid #eee",
                textAlign: "center"
              }}>
                      <button onClick={() => handleRemove(key)} style={{
                  padding: "4px 8px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px"
                }}>
                        Remove
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table> : <div style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
          fontStyle: "italic",
          padding: "20px 0"
        }}>
              Map is empty
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
            <code>set(key, value)</code> - Sets a key-value pair in the map
          </li>
          <li>
            <code>get(key)</code> - Gets the value for a key
          </li>
          <li>
            <code>remove(key)</code> - Removes a key-value pair by key
          </li>
          <li>
            <code>clear()</code> - Removes all entries from the map
          </li>
          <li>
            <code>has(key)</code> - Checks if a key exists in the map
          </li>
        </ul>
      </div>
    </div>;
}`,...(g=(y=d.parameters)==null?void 0:y.docs)==null?void 0:g.source}}};const I=["Default"];export{d as Default,I as __namedExportsOrder,M as default};
