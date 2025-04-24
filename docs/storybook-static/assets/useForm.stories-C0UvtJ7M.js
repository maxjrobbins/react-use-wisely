import{r as t,R as e}from"./index-D4H_InIO.js";const C=(c,u,f)=>{const[o,r]=t.useState(c),[s,l]=t.useState({}),[i,h]=t.useState({}),[d,n]=t.useState(!1),a=t.useCallback(()=>{r(c),l({}),h({}),n(!1)},[c]),x=t.useCallback(m=>{const{name:g,value:y}=m.target;r(E=>({...E,[g]:y}))},[]),S=t.useCallback(m=>{const{name:g}=m.target;h(y=>({...y,[g]:!0}))},[o,f]),P=t.useCallback(m=>{m&&m.preventDefault(),n(!0),u(o,a)},[o,u,f,a]);return{values:o,errors:s,touched:i,isSubmitting:d,handleChange:x,handleBlur:S,handleSubmit:P,resetForm:a}},B={title:"Hooks/useForm",parameters:{componentSubtitle:"Hook for managing form state and validation",docs:{description:{component:"A React hook that handles form state, validation, and submission with a simple API."}}}},p=()=>{const c={name:"",email:"",password:"",confirmPassword:""},u=n=>{const a={};return n.name||(a.name="Name is required"),n.email?/\S+@\S+\.\S+/.test(n.email)||(a.email="Email is invalid"):a.email="Email is required",n.password?n.password.length<6&&(a.password="Password must be at least 6 characters"):a.password="Password is required",n.password!==n.confirmPassword&&(a.confirmPassword="Passwords do not match"),a},f=n=>{alert(JSON.stringify(n,null,2))},{values:o,errors:r,touched:s,handleChange:l,handleBlur:i,handleSubmit:h}=C({initialValues:c,validate:u,onSubmit:f}),d=n=>({borderColor:s[n]&&r[n]?"#ff0000":"#ccc",padding:"8px",marginTop:"4px",width:"100%",borderRadius:"4px",border:"1px solid"});return e.createElement("div",{style:{padding:"20px",maxWidth:"400px"}},e.createElement("h3",null,"Form Management Demo"),e.createElement("form",{onSubmit:h,style:{marginTop:"20px"}},e.createElement("div",{style:{marginBottom:"15px"}},e.createElement("label",{htmlFor:"name",style:{display:"block"}},"Name"),e.createElement("input",{id:"name",name:"name",type:"text",value:o.name,onChange:l,onBlur:i,style:d("name")}),s.name&&r.name&&e.createElement("div",{style:{color:"#ff0000",fontSize:"14px",marginTop:"4px"}},r.name)),e.createElement("div",{style:{marginBottom:"15px"}},e.createElement("label",{htmlFor:"email",style:{display:"block"}},"Email"),e.createElement("input",{id:"email",name:"email",type:"email",value:o.email,onChange:l,onBlur:i,style:d("email")}),s.email&&r.email&&e.createElement("div",{style:{color:"#ff0000",fontSize:"14px",marginTop:"4px"}},r.email)),e.createElement("div",{style:{marginBottom:"15px"}},e.createElement("label",{htmlFor:"password",style:{display:"block"}},"Password"),e.createElement("input",{id:"password",name:"password",type:"password",value:o.password,onChange:l,onBlur:i,style:d("password")}),s.password&&r.password&&e.createElement("div",{style:{color:"#ff0000",fontSize:"14px",marginTop:"4px"}},r.password)),e.createElement("div",{style:{marginBottom:"20px"}},e.createElement("label",{htmlFor:"confirmPassword",style:{display:"block"}},"Confirm Password"),e.createElement("input",{id:"confirmPassword",name:"confirmPassword",type:"password",value:o.confirmPassword,onChange:l,onBlur:i,style:d("confirmPassword")}),s.confirmPassword&&r.confirmPassword&&e.createElement("div",{style:{color:"#ff0000",fontSize:"14px",marginTop:"4px"}},r.confirmPassword)),e.createElement("button",{type:"submit",style:{padding:"10px 15px",backgroundColor:"#4CAF50",color:"white",border:"none",borderRadius:"4px",cursor:"pointer"}},"Submit")),e.createElement("div",{style:{marginTop:"30px"}},e.createElement("h4",null,"Form State:"),e.createElement("pre",{style:{padding:"10px",backgroundColor:"#f0f0f0",borderRadius:"4px",overflow:"auto"}},JSON.stringify({values:o,errors:r,touched:s},null,2))))};p.storyName="Basic Usage";p.__docgenInfo={description:"",methods:[],displayName:"Default"};var w,b,v;p.parameters={...p.parameters,docs:{...(w=p.parameters)==null?void 0:w.docs,source:{originalSource:`() => {
  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  };
  const validate = values => {
    const errors = {};
    if (!values.name) {
      errors.name = "Name is required";
    }
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\\S+@\\S+\\.\\S+/.test(values.email)) {
      errors.email = "Email is invalid";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    return errors;
  };
  const onSubmit = values => {
    alert(JSON.stringify(values, null, 2));
  };
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit
  } = useForm({
    initialValues,
    validate,
    onSubmit
  });
  const getFieldStyle = fieldName => {
    return {
      borderColor: touched[fieldName] && errors[fieldName] ? "#ff0000" : "#ccc",
      padding: "8px",
      marginTop: "4px",
      width: "100%",
      borderRadius: "4px",
      border: "1px solid"
    };
  };
  return <div style={{
    padding: "20px",
    maxWidth: "400px"
  }}>
      <h3>Form Management Demo</h3>

      <form onSubmit={handleSubmit} style={{
      marginTop: "20px"
    }}>
        <div style={{
        marginBottom: "15px"
      }}>
          <label htmlFor="name" style={{
          display: "block"
        }}>
            Name
          </label>
          <input id="name" name="name" type="text" value={values.name} onChange={handleChange} onBlur={handleBlur} style={getFieldStyle("name")} />
          {touched.name && errors.name && <div style={{
          color: "#ff0000",
          fontSize: "14px",
          marginTop: "4px"
        }}>
              {errors.name}
            </div>}
        </div>

        <div style={{
        marginBottom: "15px"
      }}>
          <label htmlFor="email" style={{
          display: "block"
        }}>
            Email
          </label>
          <input id="email" name="email" type="email" value={values.email} onChange={handleChange} onBlur={handleBlur} style={getFieldStyle("email")} />
          {touched.email && errors.email && <div style={{
          color: "#ff0000",
          fontSize: "14px",
          marginTop: "4px"
        }}>
              {errors.email}
            </div>}
        </div>

        <div style={{
        marginBottom: "15px"
      }}>
          <label htmlFor="password" style={{
          display: "block"
        }}>
            Password
          </label>
          <input id="password" name="password" type="password" value={values.password} onChange={handleChange} onBlur={handleBlur} style={getFieldStyle("password")} />
          {touched.password && errors.password && <div style={{
          color: "#ff0000",
          fontSize: "14px",
          marginTop: "4px"
        }}>
              {errors.password}
            </div>}
        </div>

        <div style={{
        marginBottom: "20px"
      }}>
          <label htmlFor="confirmPassword" style={{
          display: "block"
        }}>
            Confirm Password
          </label>
          <input id="confirmPassword" name="confirmPassword" type="password" value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur} style={getFieldStyle("confirmPassword")} />
          {touched.confirmPassword && errors.confirmPassword && <div style={{
          color: "#ff0000",
          fontSize: "14px",
          marginTop: "4px"
        }}>
              {errors.confirmPassword}
            </div>}
        </div>

        <button type="submit" style={{
        padding: "10px 15px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer"
      }}>
          Submit
        </button>
      </form>

      <div style={{
      marginTop: "30px"
    }}>
        <h4>Form State:</h4>
        <pre style={{
        padding: "10px",
        backgroundColor: "#f0f0f0",
        borderRadius: "4px",
        overflow: "auto"
      }}>
          {JSON.stringify({
          values,
          errors,
          touched
        }, null, 2)}
        </pre>
      </div>
    </div>;
}`,...(v=(b=p.parameters)==null?void 0:b.docs)==null?void 0:v.source}}};const k=["Default"];export{p as Default,k as __namedExportsOrder,B as default};
