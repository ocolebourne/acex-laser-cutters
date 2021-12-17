(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{112:function(e,t,a){},254:function(e,t,a){},438:function(e,t,a){"use strict";a.r(t);var n=a(0),s=a.n(n),c=a(29),r=a.n(c),i=(a(112),a(7)),o=(a.p,a(254),a(239)),l=a(18),d=a(455),j=a(456),u=a(460),b=a(457),h=a(458),O=a(452),x=a(217),f=a(51),m=a.n(f),g=a(150),p=a(447),v=a(448),y=a(108),S=a(232),k=a(233),w=a(111),N=a(241),C=a(453),T=a(454),I=a(234),L=a.n(I),A=(a(256),a(1));function E(e){var t=s.a.useState(0),a=Object(i.a)(t,2),n=(a[0],a[1],s.a.useState({})),c=Object(i.a)(n,2),r=c[0],o=c[1],l=(s.a.useRef(null),s.a.useState([new Date((new Date).getTime()-864e5),new Date])),d=Object(i.a)(l,2),j=d[0],u=d[1],b=s.a.useState(!1),h=Object(i.a)(b,2),f=h[0],I=h[1],E=Object(i.a)(j,2),F=E[0],D=E[1],G=6048e5,P=s.a.useState(!0),B=Object(i.a)(P,2),H=B[0],R=B[1],M=s.a.useState(!0),U=Object(i.a)(M,2),J=U[0],K=U[1],V=s.a.useState(!0),X=Object(i.a)(V,2),z=X[0],_=X[1],W=s.a.useState(!1),Y=Object(i.a)(W,2),q=Y[0],Q=Y[1];function Z(){return(Z=Object(g.a)(m.a.mark((function e(){return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(I(!1),!(D.getTime()-F.getTime()>G)){e.next=6;break}return console.log("7 days max"),I(!0),e.next=6,u([F,new Date(F.getTime()+G)]);case 6:$();case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function $(){return ee.apply(this,arguments)}function ee(){return(ee=Object(g.a)(m.a.mark((function e(){var t;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t={method:"GET",headers:{"Content-Type":"application/json"}},fetch("/api/getchart1data?"+new URLSearchParams({start:F,end:D}),t).then((function(e){if(e.ok)return e.json();throw console.log("Error updating Chart1"),new Error(e.statusText)})).then((function(e){console.log(e),o(e)})).catch((function(e){console.log(e),o({gas:[{value:14,dt:1503617297689},{value:15,dt:1503616962277},{value:15,dt:1503616882654},{value:20,dt:1503613184594},{value:15,dt:1503611308914}],cutter0:[{status:1,dt:1503617247689},{status:0,dt:1503617248689},{status:0,dt:1503616965277},{status:1,dt:1503616966277},{status:1,dt:1503616882254},{status:0,dt:1503616883254},{status:0,dt:1503613133594},{status:1,dt:1503613134594},{status:1,dt:1503611304914},{status:0,dt:1503611305914}],cutter1:[{status:1,dt:1503617247389},{status:1,dt:1503616965477},{status:0,dt:1503616882454},{status:1,dt:1503613133594},{status:1,dt:1503611305414}]})}));case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return s.a.useEffect((function(){$()}),[]),Object(A.jsx)(x.a,{xs:12,children:Object(A.jsxs)("div",{className:"dash-card",children:[Object(A.jsx)("h3",{children:"Usage vs Gas: Long-term"}),Object(A.jsx)(p.a,{width:"95%",height:500,children:Object(A.jsxs)(v.a,{children:[Object(A.jsx)(y.a,{verticalAlign:"top",height:50}),Object(A.jsx)(S.a,{dataKey:"dt",domain:["auto","auto"],name:"Time",tickFormatter:function(e){return new Date(e).toLocaleString()},type:"number"}),Object(A.jsx)(k.a,{yAxisId:"left",dataKey:"value",name:"Gas",label:{value:"Gas",angle:-90,position:"insideLeft"},domain:q?["dataMin","dataMax"]:[0,350]}),Object(A.jsx)(k.a,{yAxisId:"right",dataKey:"status",name:"Usage",orientation:"right",tickFormatter:function(e){return e?"In use":"Available"},tickCount:2,label:{value:"Laser cutter usage",angle:-90,position:"center"}}),Object(A.jsx)(w.a,{formatter:function(e){return e>1e6?new Date(e).toLocaleString():1==e?"In use":0==e?"Available":e}}),z?Object(A.jsx)(N.a,{yAxisId:"left",data:r.gas,line:{stroke:"#8884d8"},fill:"#8884d8",lineJointType:"monotoneX",lineType:"joint",name:"Gas"}):Object(A.jsx)(A.Fragment,{}),H?Object(A.jsx)(N.a,{yAxisId:"right",data:r.cutter0,line:{stroke:"#82ca9d"},fill:"#82ca9d",lineJointType:"monotoneX",lineType:"joint",name:"VLS3.50"}):Object(A.jsx)(A.Fragment,{}),J?Object(A.jsx)(N.a,{yAxisId:"right",data:r.cutter1,line:{stroke:"#82b7ca"},fill:"#82b7ca",lineJointType:"monotoneX",lineType:"joint",name:"VLS4.60"}):Object(A.jsx)(A.Fragment,{})]})}),Object(A.jsxs)(O.a,{style:{width:"100%"},children:[Object(A.jsxs)(x.a,{className:"mt20",children:[Object(A.jsx)(L.a,{dateFormat:"dd/MM/yyy",selectsRange:!0,startDate:F,endDate:D,onChange:function(e){u(e)},withPortal:!0,onCalendarClose:function(){return function(){return Z.apply(this,arguments)}()}}),f?Object(A.jsx)("div",{className:"error-message",children:"Max. 7 days"}):Object(A.jsx)("div",{children:Object(A.jsx)("br",{})})]}),Object(A.jsx)(x.a,{className:"graph-tools",children:Object(A.jsxs)(C.a,{variant:"secondary",onClick:function(){return Q(!q)},children:["Auto Y: ",q?"on":"off"]})}),Object(A.jsx)(x.a,{className:"graph-tools",children:Object(A.jsxs)(T.a,{children:[Object(A.jsx)(C.a,{variant:H?"secondary":"outline-secondary",onClick:function(){return R(!H)},children:"VLS3.50"}),Object(A.jsx)(C.a,{variant:J?"secondary":"outline-secondary",onClick:function(){return K(!J)},children:"VLS4.60"}),Object(A.jsx)(C.a,{variant:z?"secondary":"outline-secondary",onClick:function(){return _(!z)},children:"Gas"})]})}),Object(A.jsx)(x.a,{className:"graph-tools",children:Object(A.jsx)(C.a,{variant:"secondary",onClick:function(){return $()},children:"Refresh data"})})]})]})})}function F(e){var t=s.a.useState({}),a=Object(i.a)(t,2),n=a[0],c=a[1],r=(new Date).setHours(0,0,0,0),o=s.a.useState(r),l=Object(i.a)(o,2),d=l[0],j=l[1],u=s.a.useState(!1),b=Object(i.a)(u,2),h=b[0],f=b[1],I=s.a.useState(!0),L=Object(i.a)(I,2),E=L[0],F=L[1],D=s.a.useState(!0),G=Object(i.a)(D,2),P=G[0],B=G[1],H=s.a.useState(!0),R=Object(i.a)(H,2),M=R[0],U=R[1];function J(e){var t=new Date(new Date(d).getTime()+864e5*e).toISOString();j(t),K(t)}function K(e){return V.apply(this,arguments)}function V(){return(V=Object(g.a)(m.a.mark((function e(t){var a,n;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a={method:"GET",headers:{"Content-Type":"application/json"}},n={date:new Date(t)},console.log(n),fetch("/api/getchart2data?"+new URLSearchParams(n),a).then((function(e){if(e.ok)return e.json();throw console.log("Error updating Chart2"),new Error(e.statusText)})).then((function(e){console.log(e),c(e)})).catch((function(e){console.log(e),c({gas:[{value:14,dt:1503617297689},{value:15,dt:1503616962277},{value:15,dt:1503616882654},{value:20,dt:1503613184594},{value:15,dt:1503611308914}],cutter0:[{status:1,dt:1503617247689},{status:0,dt:1503617248689},{status:0,dt:1503616965277},{status:1,dt:1503616966277},{status:1,dt:1503616882254},{status:0,dt:1503616883254},{status:0,dt:1503613133594},{status:1,dt:1503613134594},{status:1,dt:1503611304914},{status:0,dt:1503611305914}],cutter1:[{status:1,dt:1503617247389},{status:1,dt:1503616965477},{status:0,dt:1503616882454},{status:1,dt:1503613133594},{status:1,dt:1503611305414}]})}));case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return s.a.useEffect((function(){K(r)}),[]),Object(A.jsx)(x.a,{xs:12,children:Object(A.jsxs)("div",{className:"dash-card",children:[Object(A.jsx)("h3",{children:"Usage vs Gas: Daily"}),Object(A.jsx)(p.a,{width:"95%",height:500,children:Object(A.jsxs)(v.a,{children:[Object(A.jsx)(y.a,{verticalAlign:"top",height:50}),Object(A.jsx)(S.a,{dataKey:"dt",domain:["auto","auto"],name:"Time",tickFormatter:function(e){return new Date(e).toLocaleString()},type:"number"}),Object(A.jsx)(k.a,{yAxisId:"left",dataKey:"value",name:"Gas",label:{value:"Gas",angle:-90,position:"insideLeft"},domain:h?["dataMin","dataMax"]:[0,350]}),Object(A.jsx)(k.a,{yAxisId:"right",dataKey:"status",name:"Usage",orientation:"right",tickFormatter:function(e){return e?"In use":"Available"},tickCount:2,label:{value:"Laser cutter usage",angle:-90,position:"center"}}),Object(A.jsx)(w.a,{formatter:function(e){return e>1e6?new Date(e).toLocaleString():1==e?"In use":0==e?"Available":e}}),M?Object(A.jsx)(N.a,{yAxisId:"left",data:n.gas,line:{stroke:"#8884d8"},fill:"#8884d8",lineJointType:"monotoneX",lineType:"joint",name:"Gas"}):Object(A.jsx)(A.Fragment,{}),E?Object(A.jsx)(N.a,{yAxisId:"right",data:n.cutter0,line:{stroke:"#82ca9d"},fill:"#82ca9d",lineJointType:"monotoneX",lineType:"joint",name:"VLS3.50"}):Object(A.jsx)(A.Fragment,{}),P?Object(A.jsx)(N.a,{yAxisId:"right",data:n.cutter1,line:{stroke:"#82b7ca"},fill:"#82b7ca",lineJointType:"monotoneX",lineType:"joint",name:"VLS4.60"}):Object(A.jsx)(A.Fragment,{})]})}),Object(A.jsxs)(O.a,{style:{width:"100%"},children:[Object(A.jsxs)(x.a,{className:"graph-tools",children:[Object(A.jsx)(C.a,{variant:"secondary",onClick:function(){return J(-1)},children:"Prev."}),Object(A.jsx)("div",{className:"selected-day",children:new Date(d).toLocaleDateString()}),Object(A.jsx)(C.a,{variant:"secondary",onClick:function(){return J(1)},children:"Next"})]}),Object(A.jsx)(x.a,{className:"graph-tools",children:Object(A.jsxs)(C.a,{variant:"secondary",onClick:function(){return f(!h)},children:["Auto Y: ",h?"on":"off"]})}),Object(A.jsx)(x.a,{className:"graph-tools",children:Object(A.jsxs)(T.a,{children:[Object(A.jsx)(C.a,{variant:E?"secondary":"outline-secondary",onClick:function(){return F(!E)},children:"VLS3.50"}),Object(A.jsx)(C.a,{variant:P?"secondary":"outline-secondary",onClick:function(){return B(!P)},children:"VLS4.60"}),Object(A.jsx)(C.a,{variant:M?"secondary":"outline-secondary",onClick:function(){return U(!M)},children:"Gas"})]})}),Object(A.jsx)(x.a,{className:"graph-tools",children:Object(A.jsx)(C.a,{variant:"secondary",onClick:function(){return K(d)},children:"Refresh data"})})]})]})})}function D(e){return Object(A.jsx)(A.Fragment,{children:e.showSpinner?Object(A.jsxs)("div",{className:"loading-spinner",children:[Object(A.jsx)(d.a,{className:"loading-icon",fluid:!0,src:"./logo512.png",alt:" "}),Object(A.jsx)(j.a,{animation:"border"})]}):Object(A.jsx)(A.Fragment,{})})}var G=function(e){var t=s.a.useState([]),a=Object(i.a)(t,2),n=a[0],c=a[1],r=s.a.useState({}),o=Object(i.a)(r,2),l=o[0],j=o[1],f=s.a.useState(!0),m=Object(i.a)(f,2),g=m[0],p=m[1];function v(){fetch("/api/getworkshopstats",{method:"GET",headers:{"Content-Type":"application/json"}}).then((function(e){if(e.ok)return e.json();throw console.log("Error retrieving workshop stats"),new Error(e.statusText)})).then((function(e){console.log(e),j(e)})).catch((function(e){console.log(e.message)}))}function y(){fetch("/api/getdevicestatuses",{method:"GET",headers:{"Content-Type":"application/json"}}).then((function(e){if(e.ok)return e.json();throw console.log("Error retrieving devices"),new Error(e.statusText)})).then((function(e){console.log(e),c(e),setTimeout((function(){p(!1)}),2e3)})).catch((function(e){console.log(e.message)}))}return s.a.useEffect((function(){y(),v();var e=setInterval((function(){y(),v(),console.log("refreshing devices and stats")}),15e3);return function(){return clearInterval(e)}}),[]),Object(A.jsxs)("div",{id:"home",children:[Object(A.jsx)(D,{showSpinner:g}),Object(A.jsx)(u.a,{bg:"dark",variant:"dark",expand:"lg",fixed:"top",children:Object(A.jsxs)(b.a,{children:[Object(A.jsx)(u.a.Brand,{href:"",children:"AceX Workshop"}),Object(A.jsx)(u.a.Toggle,{"aria-controls":"basic-navbar-nav"}),Object(A.jsx)(u.a.Collapse,{id:"basic-navbar-nav",children:Object(A.jsxs)(h.a,{className:"me-auto",children:[Object(A.jsx)(h.a.Link,{href:"#home",children:"Status"}),Object(A.jsx)(h.a.Link,{href:"#data",children:"Data"})]})})]})}),Object(A.jsxs)(b.a,{children:[Object(A.jsx)("h1",{className:"mt75",children:"Status"}),Object(A.jsx)(O.a,{className:"justify-content-md-left mt30",children:n.map((function(e,t){return Object(A.jsx)(x.a,{xs:12,md:6,children:Object(A.jsxs)("div",{className:"dash-card",children:[Object(A.jsx)(d.a,{className:"laser-icon",fluid:!0,src:"./laser-cutter-icon.png",alt:" "}),Object(A.jsx)("h3",{children:e.name}),Object(A.jsxs)("h3",{children:["Status:"," ",e.status?Object(A.jsx)("b",{className:"in-use-text",children:"in use"}):Object(A.jsx)("b",{className:"available-text",children:"available"})]})]})})}))})]}),Object(A.jsxs)(b.a,{id:"data",children:[Object(A.jsx)("h1",{children:"Data"}),Object(A.jsxs)(O.a,{className:"justify-content-md-left mt30",children:[Object(A.jsx)(x.a,{xs:12,md:4,children:Object(A.jsxs)("div",{className:"stats-card",children:[Object(A.jsx)(d.a,{className:"stats-icon",fluid:!0,src:"./user-icon.png",alt:" "}),Object(A.jsxs)("h3",{children:["No. users today: ",l.usersToday]}),Object(A.jsxs)("h3",{children:["Hours in use today:"," ",(l.timeUsed/36e5).toFixed(0),"h",(l.timeUsed/6e4).toFixed(0),"m"]})]})}),Object(A.jsx)(x.a,{xs:12,md:4,children:Object(A.jsxs)("div",{className:"stats-card",children:[Object(A.jsx)(d.a,{className:"stats-icon",fluid:!0,src:"./gas-icon.png",alt:" "}),Object(A.jsxs)("h3",{children:["Last Reading (",new Date(l.lastGasReadingDt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),"): ",l.lastGasReadingValue]}),Object(A.jsxs)("h3",{children:["Last hour avg.: ",l.lastHourAverage]})]})}),Object(A.jsx)(x.a,{xs:12,md:4,children:Object(A.jsxs)("div",{className:"stats-card",children:[Object(A.jsx)(d.a,{className:"stats-icon",fluid:!0,src:"./warning-icon.png",alt:" "}),Object(A.jsxs)("h3",{children:["Today's baseline: ",l.morningThreshold]}),Object(A.jsxs)("h3",{children:["Relative gas level:"," ",l.isDangerous?Object(A.jsx)("b",{className:"error-message",children:"HIGH"}):Object(A.jsx)("b",{className:"success-message",children:l.isAboveMorning?"NORMAL":"LOW"})]})]})})]}),Object(A.jsx)(O.a,{className:"justify-content-md-left mt30",children:Object(A.jsx)(F,{})}),Object(A.jsx)(O.a,{className:"justify-content-md-left mt30",children:Object(A.jsx)(E,{})})]})]})},P=a(3),B=a(462),H=a(459);function R(e){var t=s.a.useState(!1),a=Object(i.a)(t,2),n=a[0],c=a[1],r=s.a.useState(""),o=Object(i.a)(r,2),l=o[0],d=o[1],j=s.a.useState(!1),u=Object(i.a)(j,2),b=u[0],h=u[1],f=s.a.useState(!1),m=Object(i.a)(f,2),g=m[0],p=m[1],v=s.a.useState(!1),y=Object(i.a)(v,2),S=y[0],k=y[1],w=s.a.useState(!1),N=Object(i.a)(w,2),T=N[0],I=N[1],L=s.a.useState(!1),E=Object(i.a)(L,2),F=E[0],D=E[1],G=s.a.useState(!1),R=Object(i.a)(G,2),M=R[0],U=R[1],K=s.a.useState(""),V=Object(i.a)(K,2),X=V[0],z=V[1],_=s.a.useRef(),W=s.a.useRef(),Y=function(e){if(q(),"Enter"===e.key)if(b){if(e.preventDefault(),console.log(_.current.value),10===_.current.value.length){console.log("here");var t=_.current.value;d(t)}}else Q(),n(!0)};function q(){k(!1),I(!1),D(!1),U(!1),c(!1)}function Q(){var t=W.current.value,a=_.current.value;if(t||a){c(!0);var n={method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(sessionStorage.getItem("token"))}};a?n.body=JSON.stringify({card_id:a}):t&&(n.body=JSON.stringify({short_code:t})),fetch("/api/delUser",n).then((function(n){if(n.ok)p(!1),k(!0),setTimeout((function(){e.onHide(),q(),d("")}),2e3);else{if(403===n.status)throw console.log("Auth token bad"),q(),d(""),e.kick(),new Error(n.statusText);if(404===n.status)throw console.log("User not found"),z("User not found, try again"),d(""),a?U(!0):t&&D(!0),new Error(n.statusText)}})).catch((function(e){console.log(e),c(!1),p(!1),I(!0)}))}else z("Please enter valid user details"),D(!0),U(!0)}return s.a.useEffect((function(){b&&(_.current.value="",_.current.focus(),k(!1),I(!1),D(!1),U(!1),d(""))}),[b]),Object(A.jsxs)(B.a,Object(P.a)(Object(P.a)({},e),{},{size:"lg","aria-labelledby":"contained-modal-title-vcenter",centered:!0,children:[Object(A.jsx)("input",{className:"scanner-input",ref:_,onKeyPress:Y,onBlur:function(){return h(!1)}}),Object(A.jsx)(B.a.Header,{closeButton:!0,children:Object(A.jsx)(B.a.Title,{id:"contained-modal-title-vcenter",children:"Delete User"})}),Object(A.jsxs)(B.a.Body,{children:[Object(A.jsxs)(H.a.Group,{className:"mb-3",children:[Object(A.jsx)(H.a.Label,{children:"Short code"}),Object(A.jsx)(H.a.Control,{type:"text",placeholder:"e.g. ab1234",readOnly:!!n,onKeyPress:Y,ref:W,isInvalid:F}),Object(A.jsx)(H.a.Control.Feedback,{type:"invalid",children:X})]}),Object(A.jsx)("h5",{className:"mb20",children:"OR"}),Object(A.jsxs)(H.a.Group,{className:"mb-3",children:[Object(A.jsx)(H.a.Label,{children:"Card ID"}),Object(A.jsxs)(O.a,{children:[Object(A.jsx)(x.a,{xs:"auto",children:Object(A.jsx)(C.a,{className:"scanner-button",onClick:function(){return h(!0)},variant:"primary",disabled:!(!b&&!n),children:b?"Scan card":"Enable Scanner"})}),Object(A.jsxs)(x.a,{children:[Object(A.jsx)(H.a.Control,{type:"password",placeholder:"",value:l,readOnly:!0,isInvalid:M}),Object(A.jsx)(H.a.Control.Feedback,{type:"invalid",children:X})]})]})]})]}),Object(A.jsx)(J,{loadingSpinner:g,showErrorMessage:T,showSuccessMessage:S,readOnly:n,onSubmit:Q,onHide:e.onHide,cancel:"Cancel",actionButton:"Delete User",actionButtonRed:!0})]}))}function M(e){var t=s.a.useState(!1),a=Object(i.a)(t,2),n=a[0],c=a[1],r=s.a.useState(!1),o=Object(i.a)(r,2),l=o[0],d=o[1],j=s.a.useState(!1),u=Object(i.a)(j,2),b=u[0],h=u[1],O=s.a.useState(!1),x=Object(i.a)(O,2),f=x[0],m=x[1],g=s.a.useState(!1),p=Object(i.a)(g,2),v=p[0],y=p[1],S=s.a.useRef(),k=s.a.useRef(),w=function(e){m(!1),y(!1),h(!1),"Enter"===e.key&&N()};function N(){c(!0);var t=S.current.value,a=k.current.value,n={method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(sessionStorage.getItem("token"))},body:JSON.stringify({old_password:t,new_password:a})};fetch("/api/changepass",n).then((function(t){if(t.ok)d(!1),m(!0),setTimeout((function(){e.onHide(),c(!1),m(!1)}),2e3);else{if(401===t.status)throw console.log("Incorrect old password"),h(!0),new Error(t.statusText);if(403===t.status)throw console.log("Auth token bad"),e.kick(),new Error(t.statusText)}})).catch((function(e){console.log(e),c(!1),d(!1),y(!0)}))}return Object(A.jsxs)(B.a,Object(P.a)(Object(P.a)({},e),{},{size:"lg","aria-labelledby":"contained-modal-title-vcenter",centered:!0,children:[Object(A.jsx)(B.a.Header,{closeButton:!0,children:Object(A.jsx)(B.a.Title,{id:"contained-modal-title-vcenter",children:"Change Admin Password"})}),Object(A.jsx)(B.a.Body,{children:Object(A.jsxs)(H.a,{children:[Object(A.jsxs)(H.a.Group,{className:"mb-3",children:[Object(A.jsx)(H.a.Label,{children:"Old password"}),Object(A.jsx)(H.a.Control,{type:"password",placeholder:"",readOnly:!!n,ref:S,isInvalid:b,isValid:f,onKeyPress:w}),Object(A.jsx)(H.a.Control.Feedback,{type:"invalid",children:"Incorrect old password, try again"})]}),Object(A.jsxs)(H.a.Group,{className:"mb-3",children:[Object(A.jsx)(H.a.Label,{children:"New password"}),Object(A.jsx)(H.a.Control,{type:"password",placeholder:"",readOnly:!!n,ref:k,onKeyPress:w,isValid:f})]})]})}),Object(A.jsx)(J,{loadingSpinner:l,showErrorMessage:v,showSuccessMessage:f,readOnly:n,onSubmit:N,onHide:e.onHide,cancel:"Cancel",actionButton:"Change Password"})]}))}function U(e){var t=s.a.useState(!1),a=Object(i.a)(t,2),n=a[0],c=a[1],r=s.a.useState(""),o=Object(i.a)(r,2),l=o[0],d=o[1],j=s.a.useState(!1),u=Object(i.a)(j,2),b=u[0],h=u[1],f=s.a.useState(!1),m=Object(i.a)(f,2),g=m[0],p=m[1],v=s.a.useState(!1),y=Object(i.a)(v,2),S=y[0],k=y[1],w=s.a.useState(!1),N=Object(i.a)(w,2),T=N[0],I=N[1],L=s.a.useState(!1),E=Object(i.a)(L,2),F=E[0],D=E[1],G=s.a.useState(!1),R=Object(i.a)(G,2),M=R[0],U=R[1],K=s.a.useRef(),V=s.a.useRef(),X=function(e){if(z(),"Enter"===e.key)if(b){if(e.preventDefault(),console.log(K.current.value),10===K.current.value.length){console.log("here");var t=K.current.value;d(t)}}else _(),n(!0)};function z(){k(!1),I(!1),D(!1),U(!1),c(!1)}function _(){var t=V.current.value,a=K.current.value;if(t)if(a){c(!0);var n={method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(sessionStorage.getItem("token"))},body:JSON.stringify({short_code:t,card_id:a})};fetch("/api/addUser",n).then((function(t){if(t.ok)p(!1),k(!0),setTimeout((function(){e.onHide(),d(""),z()}),2e3);else if(403===t.status)throw console.log("Auth token bad"),e.kick(),new Error(t.statusText)})).catch((function(e){console.log(e),c(!1),p(!1),I(!0)}))}else U(!0);else D(!0)}return s.a.useEffect((function(){b&&(K.current.value="",K.current.focus(),z(),d(""))}),[b]),Object(A.jsxs)(B.a,Object(P.a)(Object(P.a)({},e),{},{size:"lg","aria-labelledby":"contained-modal-title-vcenter",centered:!0,children:[Object(A.jsx)("input",{className:"scanner-input",ref:K,onKeyPress:X,onBlur:function(){return h(!1)}}),Object(A.jsx)(B.a.Header,{closeButton:!0,children:Object(A.jsx)(B.a.Title,{id:"contained-modal-title-vcenter",children:"Add User"})}),Object(A.jsxs)(B.a.Body,{children:[Object(A.jsxs)(H.a.Group,{className:"mb-3",children:[Object(A.jsx)(H.a.Label,{children:"Short code"}),Object(A.jsx)(H.a.Control,{type:"text",placeholder:"e.g. ab1234",readOnly:!!n,onKeyPress:X,ref:V,isInvalid:F}),Object(A.jsx)(H.a.Control.Feedback,{type:"invalid",children:"Please enter a short code."})]}),Object(A.jsxs)(H.a.Group,{className:"mb-3",children:[Object(A.jsx)(H.a.Label,{children:"Card ID"}),Object(A.jsxs)(O.a,{children:[Object(A.jsx)(x.a,{xs:"auto",children:Object(A.jsx)(C.a,{className:"scanner-button",onClick:function(){return h(!0)},variant:"primary",disabled:!(!b&&!n),children:b?"Scan card":"Enable Scanner"})}),Object(A.jsxs)(x.a,{children:[Object(A.jsx)(H.a.Control,{type:"password",placeholder:"",value:l,readOnly:!0,isInvalid:M}),Object(A.jsx)(H.a.Control.Feedback,{type:"invalid",children:"Please add a card ID."})]})]})]})]}),Object(A.jsx)(J,{loadingSpinner:g,showErrorMessage:T,showSuccessMessage:S,readOnly:n,onSubmit:_,onHide:e.onHide,cancel:"Cancel",actionButton:"Add User"})]}))}function J(e){return Object(A.jsxs)(B.a.Footer,{children:[e.loadingSpinner?Object(A.jsx)(x.a,{xs:"auto",children:Object(A.jsx)(j.a,{className:"mra",animation:"border"})}):Object(A.jsx)(A.Fragment,{}),e.showSuccessMessage?Object(A.jsx)(x.a,{xs:"auto",children:Object(A.jsx)("div",{className:"mra success-message",children:"Success"})}):Object(A.jsx)(A.Fragment,{}),e.showErrorMessage?Object(A.jsx)(x.a,{xs:"auto",children:Object(A.jsx)("div",{className:"mra error-message",children:"Error"})}):Object(A.jsx)(A.Fragment,{}),Object(A.jsx)(C.a,{variant:"secondary",onClick:e.onHide,className:"mla",children:e.cancel}),Object(A.jsx)(C.a,{variant:e.actionButtonRed?"danger":"primary",type:"submit",onClick:function(){return e.onSubmit()},disabled:!!e.readOnly,children:e.actionButton})]})}var K=function(e){var t=s.a.useState(!1),a=Object(i.a)(t,2),n=a[0],c=a[1],r=s.a.useState(!1),o=Object(i.a)(r,2),l=o[0],d=o[1],f=s.a.useState(!1),m=Object(i.a)(f,2),g=m[0],p=m[1],v=s.a.useState(!1),y=Object(i.a)(v,2),S=y[0],k=y[1],w=s.a.useState(!1),N=Object(i.a)(w,2),T=N[0],I=N[1],L=s.a.useState(!1),E=Object(i.a)(L,2),F=E[0],D=E[1],G=s.a.useState(""),P=Object(i.a)(G,2),B=P[0],J=P[1],K=s.a.useState(!1),V=Object(i.a)(K,2),X=V[0],z=V[1],_=s.a.useState(!1),W=Object(i.a)(_,2),Y=W[0],q=W[1],Q=s.a.useRef();function Z(){var e=Q.current.value;z(!0),I(!0);var t={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:e})};fetch("/api/login",t).then((function(e){return e.json()})).then((function(e){z(!1),sessionStorage.setItem("token",e.token),I(!1),k(!0)})).catch((function(e){console.log(e),z(!1),I(!1),D(!0),J("Incorrect password, try again")}))}function $(){sessionStorage.removeItem("token"),k(!1),q(!0)}return s.a.useEffect((function(){sessionStorage.getItem("token")&&k(!0)}),[]),Object(A.jsxs)("div",{children:[Object(A.jsx)(u.a,{bg:"light",children:Object(A.jsxs)(b.a,{children:[Object(A.jsx)(u.a.Brand,{href:"",children:"AceX Admin"}),S?Object(A.jsx)(h.a.Link,{onClick:function(){return sessionStorage.removeItem("token"),void k(!1)},children:"Logout"}):Object(A.jsx)(A.Fragment,{})]})}),S?Object(A.jsxs)(b.a,{children:[Object(A.jsx)("h1",{children:"Welcome"}),Object(A.jsxs)(O.a,{className:"justify-content-md-left mt50",children:[Object(A.jsx)(x.a,{xs:6,md:4,xl:3,children:Object(A.jsx)("div",{onClick:function(){return c(!0)},className:"admin-card",children:Object(A.jsx)("h2",{className:"mta",children:"Add user"})})}),Object(A.jsx)(x.a,{xs:6,md:4,xl:3,children:Object(A.jsx)("div",{onClick:function(){return d(!0)},className:"admin-card",children:Object(A.jsx)("h2",{className:"mta",children:"Delete user"})})}),Object(A.jsx)(x.a,{xs:6,md:4,xl:3,children:Object(A.jsx)("div",{onClick:function(){return p(!0)},className:"admin-card",children:Object(A.jsx)("h2",{className:"mta",children:"Change password"})})})]}),Object(A.jsx)(U,{show:n,onHide:function(){return c(!1)},kick:function(){return $()}}),Object(A.jsx)(R,{show:l,onHide:function(){return d(!1)},kick:function(){return $()}}),Object(A.jsx)(M,{show:g,onHide:function(){return p(!1)},kick:function(){return $()}})]}):Object(A.jsxs)(b.a,{children:[Object(A.jsx)("h1",{children:"Please enter the admin password"}),Object(A.jsxs)(H.a.Group,{className:"mt50 mb-3",children:[Y?Object(A.jsx)("div",{className:"mb10 error-message",children:"Session expired, please log in again"}):Object(A.jsx)(A.Fragment,{children:" "}),Object(A.jsxs)(O.a,{children:[Object(A.jsxs)(x.a,{xs:"9",md:"4",children:[Object(A.jsx)(H.a.Control,{type:"password",placeholder:"",readOnly:!!T,ref:Q,onKeyPress:function(e){D(!1),"Enter"===e.key&&Z()},isInvalid:F}),Object(A.jsx)(H.a.Control.Feedback,{type:"invalid",children:B})]}),Object(A.jsx)(x.a,{xs:"auto",children:Object(A.jsx)(C.a,{onClick:function(){return Z()},type:"submit",disabled:!!T,children:"Login"})}),X?Object(A.jsx)(x.a,{xs:"auto",children:Object(A.jsx)(j.a,{animation:"border"})}):Object(A.jsx)(A.Fragment,{})]})]})]})]})};var V=function(){var e=s.a.useState(null),t=Object(i.a)(e,2);return t[0],t[1],Object(A.jsx)(o.a,{className:"App",children:Object(A.jsxs)(l.c,{children:[Object(A.jsx)(l.a,{path:"/admin",element:Object(A.jsx)(K,{})}),Object(A.jsx)(l.a,{path:"/",element:Object(A.jsx)(G,{})})]})})},X=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,463)).then((function(t){var a=t.getCLS,n=t.getFID,s=t.getFCP,c=t.getLCP,r=t.getTTFB;a(e),n(e),s(e),c(e),r(e)}))};r.a.render(Object(A.jsx)(s.a.StrictMode,{children:Object(A.jsx)(V,{})}),document.getElementById("root")),X()}},[[438,1,2]]]);
//# sourceMappingURL=main.995dab6e.chunk.js.map