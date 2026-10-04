const links={basic:"https://pay.hotmart.com/Y107863640L?off=zgb1dcnz",premium:"https://pay.hotmart.com/Y107863640L?off=hycslxm6"};
for(const key of ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","fbclid","gclid","src","sck"]){const value=new URLSearchParams(location.search).get(key);if(value)try{sessionStorage.setItem("ordem137_"+key,value)}catch{}}
const w={track(){}};
function p(i,t){
  const e=t.amounts?.[i];
  const data={content_name:i==="premium"?"Premium":"Basic",content_type:"product",content_ids:[i]};
  if(typeof e==="number"&&isFinite(e)){data.value=e;data.currency=t.currency;}
  const url=new URL(links[i]);
  let trk;
  try{trk=sessionStorage.getItem("krob_trk");if(!trk){trk=crypto.randomUUID();sessionStorage.setItem("krob_trk",trk);}}catch{trk=crypto.randomUUID();}
  url.searchParams.set("xcod",trk);
  const utms=["utm_source","utm_medium","utm_campaign","utm_content","utm_term"].map(key=>{try{return encodeURIComponent(sessionStorage.getItem("ordem137_"+key)||"")}catch{return""}});
  if(utms.some(value=>value!==""))url.searchParams.set("sck",utms.join("|"));
  url.searchParams.set("checkoutMode","10");
  const result=window.UmbralTracking.preserveUrl(url.href);
  window.UmbralTracking.initiateCheckout(data);
  setTimeout(()=>{window.location.href=result},80);
}
export{w as a,p as s};
