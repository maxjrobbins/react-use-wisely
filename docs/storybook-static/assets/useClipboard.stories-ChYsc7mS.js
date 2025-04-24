import{r as l,R as e}from"./index-D4H_InIO.js";const m=(t=2e3)=>{const[i,n]=l.useState(!1),d=l.useCallback(a=>{if(!navigator.clipboard){const o=document.createElement("textarea");o.value=a,o.style.position="fixed",o.style.left="-999999px",o.style.top="-999999px",document.body.appendChild(o),o.focus(),o.select();try{document.execCommand("copy"),n(!0),setTimeout(()=>{n(!1)},t)}catch(p){console.error("Failed to copy text: ",p)}document.body.removeChild(o);return}navigator.clipboard.writeText(a).then(()=>{n(!0),setTimeout(()=>{n(!1)},t)}).catch(o=>{console.error("Failed to copy text: ",o)})},[t]);return[i,d]},u={title:"Hooks/useClipboard",parameters:{componentSubtitle:"Hook for clipboard interactions",docs:{description:{component:"A React hook that provides utilities for copying text to and reading text from the clipboard."}}}},r=()=>{const[t,i]=l.useState("Hello, clipboard!"),{copied:n,copyToClipboard:d,clipboardContents:a,getClipboardContents:o}=m();return e.createElement("div",{style:{padding:"20px",border:"1px solid #ddd",borderRadius:"4px"}},e.createElement("h3",null,"Clipboard Interaction Demo"),e.createElement("div",{style:{marginBottom:"30px"}},e.createElement("h4",null,"Copy to Clipboard"),e.createElement("div",{style:{display:"flex",marginBottom:"10px"}},e.createElement("input",{type:"text",value:t,onChange:p=>i(p.target.value),style:{padding:"8px",marginRight:"10px",flexGrow:1,borderRadius:"4px",border:"1px solid #ccc"},placeholder:"Enter text to copy..."}),e.createElement("button",{onClick:()=>d(t),style:{padding:"8px 16px",backgroundColor:"#4CAF50",color:"white",border:"none",borderRadius:"4px",cursor:"pointer"}},"Copy Text")),n&&e.createElement("div",{style:{padding:"8px",backgroundColor:"#e8f5e9",color:"#2e7d32",borderRadius:"4px",marginTop:"10px",display:"flex",alignItems:"center",justifyContent:"center"}},e.createElement("span",{role:"img","aria-label":"success",style:{marginRight:"8px"}},"✅"),"Text copied to clipboard!")),e.createElement("div",null,e.createElement("h4",null,"Read from Clipboard"),e.createElement("div",{style:{marginBottom:"10px"}},e.createElement("button",{onClick:o,style:{padding:"8px 16px",backgroundColor:"#2196F3",color:"white",border:"none",borderRadius:"4px",cursor:"pointer"}},"Read Clipboard")),a&&e.createElement("div",{style:{marginTop:"10px"}},e.createElement("p",null,e.createElement("strong",null,"Clipboard contents:")),e.createElement("pre",{style:{padding:"10px",backgroundColor:"#f5f5f5",borderRadius:"4px",maxHeight:"100px",overflow:"auto",wordBreak:"break-word"}},a))),e.createElement("p",{style:{marginTop:"30px",fontStyle:"italic",color:"#666"}},'Note: Reading from clipboard may require user permission in some browsers. Try copying some text first, then click "Read Clipboard".'))};r.storyName="Basic Usage";r.__docgenInfo={description:"",methods:[],displayName:"Default"};var s,c,x;r.parameters={...r.parameters,docs:{...(s=r.parameters)==null?void 0:s.docs,source:{originalSource:`() => {
  const [textToCopy, setTextToCopy] = useState("Hello, clipboard!");
  const {
    copied,
    copyToClipboard,
    clipboardContents,
    getClipboardContents
  } = useClipboard();
  return <div style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "4px"
  }}>
      <h3>Clipboard Interaction Demo</h3>

      <div style={{
      marginBottom: "30px"
    }}>
        <h4>Copy to Clipboard</h4>
        <div style={{
        display: "flex",
        marginBottom: "10px"
      }}>
          <input type="text" value={textToCopy} onChange={e => setTextToCopy(e.target.value)} style={{
          padding: "8px",
          marginRight: "10px",
          flexGrow: 1,
          borderRadius: "4px",
          border: "1px solid #ccc"
        }} placeholder="Enter text to copy..." />
          <button onClick={() => copyToClipboard(textToCopy)} style={{
          padding: "8px 16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}>
            Copy Text
          </button>
        </div>

        {copied && <div style={{
        padding: "8px",
        backgroundColor: "#e8f5e9",
        color: "#2e7d32",
        borderRadius: "4px",
        marginTop: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
            <span role="img" aria-label="success" style={{
          marginRight: "8px"
        }}>
              ✅
            </span>
            Text copied to clipboard!
          </div>}
      </div>

      <div>
        <h4>Read from Clipboard</h4>
        <div style={{
        marginBottom: "10px"
      }}>
          <button onClick={getClipboardContents} style={{
          padding: "8px 16px",
          backgroundColor: "#2196F3",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}>
            Read Clipboard
          </button>
        </div>

        {clipboardContents && <div style={{
        marginTop: "10px"
      }}>
            <p>
              <strong>Clipboard contents:</strong>
            </p>
            <pre style={{
          padding: "10px",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
          maxHeight: "100px",
          overflow: "auto",
          wordBreak: "break-word"
        }}>
              {clipboardContents}
            </pre>
          </div>}
      </div>

      <p style={{
      marginTop: "30px",
      fontStyle: "italic",
      color: "#666"
    }}>
        Note: Reading from clipboard may require user permission in some
        browsers. Try copying some text first, then click "Read Clipboard".
      </p>
    </div>;
}`,...(x=(c=r.parameters)==null?void 0:c.docs)==null?void 0:x.source}}};const y=["Default"];export{r as Default,y as __namedExportsOrder,u as default};
