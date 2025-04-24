import{r as n,R as e}from"./index-D4H_InIO.js";const f=(r,l=!1)=>{const[a,s]=n.useState("idle"),[u,t]=n.useState(null),[p,c]=n.useState(null),o=n.useCallback(async(...y)=>{s("pending"),t(null),c(null);try{const d=await r(...y);return t(d),s("success"),d}catch(d){throw c(d),s("error"),d}},[r]);return n.useEffect(()=>{l&&o()},[o,l]),{execute:o,status:a,value:u,error:p,isLoading:a==="pending"}},E={title:"Hooks/useAsync",parameters:{componentSubtitle:"Hook for handling async operations",docs:{description:{component:"A React hook that manages loading, error, and data states for asynchronous operations."}}}},x=(r,l=!1)=>new Promise((a,s)=>{setTimeout(()=>{l?s(new Error("Failed to fetch user data")):a({id:r,name:"John Doe",email:"john.doe@example.com",createdAt:new Date().toISOString()})},1500)}),i=()=>{const[r,l]=n.useState("1234"),[a,s]=n.useState(!1),{execute:u,status:t,value:p,error:c}=f(()=>x(r,a),!1);return e.createElement("div",{style:{padding:"20px",border:"1px solid #ddd",borderRadius:"4px"}},e.createElement("h3",null,"Async Operation Demo"),e.createElement("div",{style:{marginBottom:"20px"}},e.createElement("div",{style:{marginBottom:"10px"}},e.createElement("label",{htmlFor:"userId",style:{display:"block",marginBottom:"4px"}},"User ID:"),e.createElement("input",{id:"userId",type:"text",value:r,onChange:o=>l(o.target.value),style:{padding:"8px",width:"200px"}})),e.createElement("div",{style:{marginBottom:"15px"}},e.createElement("label",{style:{display:"flex",alignItems:"center"}},e.createElement("input",{type:"checkbox",checked:a,onChange:o=>s(o.target.checked),style:{marginRight:"8px"}}),"Simulate API failure")),e.createElement("button",{onClick:u,disabled:t==="pending",style:{padding:"8px 12px",backgroundColor:t==="pending"?"#cccccc":"#4CAF50",color:"white",border:"none",borderRadius:"4px",cursor:t==="pending"?"not-allowed":"pointer"}},t==="pending"?"Loading...":"Fetch User Data")),e.createElement("div",null,e.createElement("h4",null,"Status:"," ",e.createElement("span",{style:{color:b(t)}},t)),t==="success"&&e.createElement("div",null,e.createElement("h4",null,"User Data:"),e.createElement("pre",{style:{padding:"10px",backgroundColor:"#f0f0f0",borderRadius:"4px",overflow:"auto"}},JSON.stringify(p,null,2))),t==="error"&&e.createElement("div",null,e.createElement("h4",null,"Error:"),e.createElement("div",{style:{color:"#ff0000",padding:"10px",backgroundColor:"#fff0f0",borderRadius:"4px"}},c.message))),e.createElement("p",{style:{marginTop:"20px",fontStyle:"italic",color:"#666"}},"This hook simplifies managing async operations by tracking loading state, success data, and errors."))};function b(r){switch(r){case"idle":return"#888888";case"pending":return"#FFA500";case"success":return"#4CAF50";case"error":return"#FF0000";default:return"#000000"}}i.storyName="Basic Usage";i.__docgenInfo={description:"",methods:[],displayName:"Default"};var g,m,h;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`() => {
  const [userId, setUserId] = useState("1234");
  const [shouldFail, setShouldFail] = useState(false);
  const {
    execute,
    status,
    value,
    error
  } = useAsync(() => fetchUserData(userId, shouldFail), false // don't run immediately
  );
  return <div style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "4px"
  }}>
      <h3>Async Operation Demo</h3>

      <div style={{
      marginBottom: "20px"
    }}>
        <div style={{
        marginBottom: "10px"
      }}>
          <label htmlFor="userId" style={{
          display: "block",
          marginBottom: "4px"
        }}>
            User ID:
          </label>
          <input id="userId" type="text" value={userId} onChange={e => setUserId(e.target.value)} style={{
          padding: "8px",
          width: "200px"
        }} />
        </div>

        <div style={{
        marginBottom: "15px"
      }}>
          <label style={{
          display: "flex",
          alignItems: "center"
        }}>
            <input type="checkbox" checked={shouldFail} onChange={e => setShouldFail(e.target.checked)} style={{
            marginRight: "8px"
          }} />
            Simulate API failure
          </label>
        </div>

        <button onClick={execute} disabled={status === "pending"} style={{
        padding: "8px 12px",
        backgroundColor: status === "pending" ? "#cccccc" : "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: status === "pending" ? "not-allowed" : "pointer"
      }}>
          {status === "pending" ? "Loading..." : "Fetch User Data"}
        </button>
      </div>

      <div>
        <h4>
          Status:{" "}
          <span style={{
          color: getStatusColor(status)
        }}>{status}</span>
        </h4>

        {status === "success" && <div>
            <h4>User Data:</h4>
            <pre style={{
          padding: "10px",
          backgroundColor: "#f0f0f0",
          borderRadius: "4px",
          overflow: "auto"
        }}>
              {JSON.stringify(value, null, 2)}
            </pre>
          </div>}

        {status === "error" && <div>
            <h4>Error:</h4>
            <div style={{
          color: "#ff0000",
          padding: "10px",
          backgroundColor: "#fff0f0",
          borderRadius: "4px"
        }}>
              {error.message}
            </div>
          </div>}
      </div>

      <p style={{
      marginTop: "20px",
      fontStyle: "italic",
      color: "#666"
    }}>
        This hook simplifies managing async operations by tracking loading
        state, success data, and errors.
      </p>
    </div>;
}`,...(h=(m=i.parameters)==null?void 0:m.docs)==null?void 0:h.source}}};const S=["Default"];export{i as Default,S as __namedExportsOrder,E as default};
