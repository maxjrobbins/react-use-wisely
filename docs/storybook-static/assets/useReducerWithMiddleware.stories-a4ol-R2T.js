import{r as n,R as e}from"./index-D4H_InIO.js";const b=(t,o,r)=>{const a=n.useCallback((l,c)=>t(l,c),[t]),[d,s]=n.useReducer(a,o),p=n.useRef(d);n.useEffect(()=>{p.current=d},[d]);const y=n.useCallback(l=>{if(r){const c=u=>{s(u)};r(p.current,l,c)}else s(l)},[r,s]);return[d,y]},C={title:"Hooks/useReducerWithMiddleware",parameters:{componentSubtitle:"A React hook that extends useReducer with middleware support",docs:{description:{component:"This hook adds middleware capabilities to React's useReducer, allowing you to intercept and transform actions or state before and after the reducer runs."}}}},h={count:0,history:[]},E=(t,o)=>{switch(o.type){case"INCREMENT":return{...t,count:t.count+1,history:[...t.history,{type:o.type,timestamp:Date.now()}]};case"DECREMENT":return{...t,count:t.count-1,history:[...t.history,{type:o.type,timestamp:Date.now()}]};case"RESET":return{...h,history:[...t.history,{type:o.type,timestamp:Date.now()}]};case"SET_STEP":return{...t,step:o.payload};case"INCREMENT_BY_STEP":return{...t,count:t.count+t.step};case"DECREMENT_BY_STEP":return{...t,count:t.count-t.step};default:return t}},f=({getState:t})=>o=>r=>{console.log("Action:",r),console.log("State before:",t());const a=o(r);return console.log("State after:",t()),a},R=()=>t=>o=>(o.type!=="INTERNAL_ACTION"&&console.log(`Analytics: User performed ${o.type} action`),t(o)),i=()=>{const[t,o,{getState:r}]=b(E,h,[f,R]);return e.createElement("div",{style:{padding:"20px",border:"1px solid #ddd",borderRadius:"4px"}},e.createElement("h3",null,"useReducerWithMiddleware Demo"),e.createElement("p",{style:{marginBottom:"20px"}},"This example demonstrates how to use the"," ",e.createElement("code",null,"useReducerWithMiddleware")," hook to add middleware support to React's useReducer."),e.createElement("div",{style:{display:"flex",gap:"10px",marginBottom:"20px"}},e.createElement("button",{onClick:()=>o({type:"INCREMENT"}),style:{padding:"8px 16px",backgroundColor:"#4CAF50",color:"white",border:"none",borderRadius:"4px",cursor:"pointer"}},"Increment"),e.createElement("button",{onClick:()=>o({type:"DECREMENT"}),style:{padding:"8px 16px",backgroundColor:"#2196F3",color:"white",border:"none",borderRadius:"4px",cursor:"pointer"}},"Decrement"),e.createElement("button",{onClick:()=>o({type:"RESET"}),style:{padding:"8px 16px",backgroundColor:"#f44336",color:"white",border:"none",borderRadius:"4px",cursor:"pointer"}},"Reset")),e.createElement("div",{style:{backgroundColor:"#f5f5f5",padding:"20px",borderRadius:"4px",marginBottom:"20px"}},e.createElement("h4",{style:{margin:"0 0 10px 0"}},"Current State:"),e.createElement("div",{style:{backgroundColor:"white",padding:"15px",borderRadius:"4px",border:"1px solid #ddd",fontSize:"16px"}},"Count: ",e.createElement("strong",null,t.count))),e.createElement("div",{style:{backgroundColor:"#f5f5f5",padding:"20px",borderRadius:"4px"}},e.createElement("h4",{style:{margin:"0 0 10px 0"}},"Action History:"),t.history.length>0?e.createElement("div",{style:{maxHeight:"200px",overflowY:"auto",backgroundColor:"white",padding:"10px",borderRadius:"4px",border:"1px solid #ddd"}},e.createElement("table",{style:{width:"100%",borderCollapse:"collapse"}},e.createElement("thead",null,e.createElement("tr",null,e.createElement("th",{style:{textAlign:"left",padding:"8px",borderBottom:"1px solid #ddd"}},"Action"),e.createElement("th",{style:{textAlign:"left",padding:"8px",borderBottom:"1px solid #ddd"}},"Time"))),e.createElement("tbody",null,[...t.history].reverse().map((a,d)=>e.createElement("tr",{key:d,style:{backgroundColor:d%2===0?"#f9f9f9":"white"}},e.createElement("td",{style:{padding:"8px",borderBottom:"1px solid #eee"}},e.createElement("code",null,a.type)),e.createElement("td",{style:{padding:"8px",borderBottom:"1px solid #eee"}},new Date(a.timestamp).toLocaleTimeString())))))):e.createElement("div",{style:{padding:"20px",backgroundColor:"white",borderRadius:"4px",textAlign:"center",color:"#666",fontStyle:"italic",border:"1px solid #ddd"}},"No actions dispatched yet")),e.createElement("div",{style:{marginTop:"20px",backgroundColor:"#e3f2fd",padding:"15px",borderRadius:"4px"}},e.createElement("h4",{style:{margin:"0 0 10px 0"}},"How It Works:"),e.createElement("p",{style:{margin:"0 0 10px 0"}},"This hook adds middleware support to React's ",e.createElement("code",null,"useReducer"),", similar to Redux middleware:"),e.createElement("ul",{style:{margin:"0",paddingLeft:"20px"}},e.createElement("li",null,"Middleware functions can intercept actions before they reach the reducer"),e.createElement("li",null,"Each middleware has access to ",e.createElement("code",null,"getState")," and"," ",e.createElement("code",null,"dispatch")),e.createElement("li",null,"Middleware can transform actions or dispatch additional actions"),e.createElement("li",null,"Open the console to see the logging middleware in action"))))};i.storyName="Basic Usage";i.__docgenInfo={description:"",methods:[],displayName:"Default"};var m,x,g;i.parameters={...i.parameters,docs:{...(m=i.parameters)==null?void 0:m.docs,source:{originalSource:`() => {
  const [state, dispatch, {
    getState
  }] = useReducerWithMiddleware(reducer, initialState, [loggingMiddleware, analyticsMiddleware]);
  return <div style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "4px"
  }}>
      <h3>useReducerWithMiddleware Demo</h3>

      <p style={{
      marginBottom: "20px"
    }}>
        This example demonstrates how to use the{" "}
        <code>useReducerWithMiddleware</code> hook to add middleware support to
        React's useReducer.
      </p>

      <div style={{
      display: "flex",
      gap: "10px",
      marginBottom: "20px"
    }}>
        <button onClick={() => dispatch({
        type: "INCREMENT"
      })} style={{
        padding: "8px 16px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer"
      }}>
          Increment
        </button>

        <button onClick={() => dispatch({
        type: "DECREMENT"
      })} style={{
        padding: "8px 16px",
        backgroundColor: "#2196F3",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer"
      }}>
          Decrement
        </button>

        <button onClick={() => dispatch({
        type: "RESET"
      })} style={{
        padding: "8px 16px",
        backgroundColor: "#f44336",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer"
      }}>
          Reset
        </button>
      </div>

      <div style={{
      backgroundColor: "#f5f5f5",
      padding: "20px",
      borderRadius: "4px",
      marginBottom: "20px"
    }}>
        <h4 style={{
        margin: "0 0 10px 0"
      }}>Current State:</h4>
        <div style={{
        backgroundColor: "white",
        padding: "15px",
        borderRadius: "4px",
        border: "1px solid #ddd",
        fontSize: "16px"
      }}>
          Count: <strong>{state.count}</strong>
        </div>
      </div>

      <div style={{
      backgroundColor: "#f5f5f5",
      padding: "20px",
      borderRadius: "4px"
    }}>
        <h4 style={{
        margin: "0 0 10px 0"
      }}>Action History:</h4>
        {state.history.length > 0 ? <div style={{
        maxHeight: "200px",
        overflowY: "auto",
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "4px",
        border: "1px solid #ddd"
      }}>
            <table style={{
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
                    Action
                  </th>
                  <th style={{
                textAlign: "left",
                padding: "8px",
                borderBottom: "1px solid #ddd"
              }}>
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...state.history].reverse().map((action, index) => <tr key={index} style={{
              backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white"
            }}>
                    <td style={{
                padding: "8px",
                borderBottom: "1px solid #eee"
              }}>
                      <code>{action.type}</code>
                    </td>
                    <td style={{
                padding: "8px",
                borderBottom: "1px solid #eee"
              }}>
                      {new Date(action.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div> : <div style={{
        padding: "20px",
        backgroundColor: "white",
        borderRadius: "4px",
        textAlign: "center",
        color: "#666",
        fontStyle: "italic",
        border: "1px solid #ddd"
      }}>
            No actions dispatched yet
          </div>}
      </div>

      <div style={{
      marginTop: "20px",
      backgroundColor: "#e3f2fd",
      padding: "15px",
      borderRadius: "4px"
    }}>
        <h4 style={{
        margin: "0 0 10px 0"
      }}>How It Works:</h4>
        <p style={{
        margin: "0 0 10px 0"
      }}>
          This hook adds middleware support to React's <code>useReducer</code>,
          similar to Redux middleware:
        </p>
        <ul style={{
        margin: "0",
        paddingLeft: "20px"
      }}>
          <li>
            Middleware functions can intercept actions before they reach the
            reducer
          </li>
          <li>
            Each middleware has access to <code>getState</code> and{" "}
            <code>dispatch</code>
          </li>
          <li>
            Middleware can transform actions or dispatch additional actions
          </li>
          <li>Open the console to see the logging middleware in action</li>
        </ul>
      </div>
    </div>;
}`,...(g=(x=i.parameters)==null?void 0:x.docs)==null?void 0:g.source}}};const k=["Default"];export{i as Default,k as __namedExportsOrder,C as default};
