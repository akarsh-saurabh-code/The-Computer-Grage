import { useState, useEffect } from "react";

const API = "https://tcg-backend-fvnc.onrender.com/api";

// Default prices (fallback agar server na chale)
const DEFAULT_PRICES = {
  hd:{
    dvr:{4:{new:2800,refurb:1800},8:{new:3800,refurb:2400},16:{new:7000,refurb:4500},32:{new:13000,refurb:8000}},
    cam:{"2.4":{bullet:850,dome:900,ptz:3500},"5":{bullet:1500,dome:1600,ptz:5500},"8":{bullet:2800,dome:3000,ptz:9000}},
    hdd:{500:1900,1000:2900,2000:4800,3000:7000,4000:9200},
    wire:{"3plus1":950,coaxial:1100},
    acc:{dc:18,bnc:22,cambox:130,psupply_4:380,psupply_8:680,psupply_16:1200,psupply_32:2200}
  },
  ip:{
    nvr:{4:{poe:4200,nopoe:3200},8:{poe:6200,nopoe:4800},16:{poe:10500,nopoe:8000},32:{poe:18000,nopoe:14000}},
    cam:{"2":{bullet:1300,dome:1400,ptz:7000},"4":{bullet:1900,dome:2100,ptz:9000},"5":{bullet:2400,dome:2600,ptz:11000},"8":{bullet:3800,dome:4200,ptz:16000}},
    hdd:{500:1900,1000:2900,2000:4800,3000:7000,4000:9200},
    wire:{cat6:1300,cat5e:950},
    acc:{cambox:160,poe_sw_4:2000,poe_sw_8:3800,poe_sw_16:7000,adapter:280}
  }
};

const fmt = n => "₹" + Math.round(n).toLocaleString("en-IN");

const GS = () => <style>{`
  .cctv-wrap{max-width:860px;margin:0 auto;padding:72px 40px}
  .cctv-tabs{display:flex;gap:12px;margin-bottom:24px}
  .cctv-tab{flex:1;padding:16px;border-radius:14px;border:1px solid rgba(0,85,255,.2);background:var(--panel);cursor:pointer;font-family:var(--fh);font-size:15px;font-weight:600;color:var(--ink2);transition:all .18s;text-align:center}
  .cctv-tab:hover{border-color:rgba(0,184,255,.35);color:var(--ink)}
  .cctv-tab.on{background:rgba(0,85,255,.14);border-color:rgba(0,184,255,.35);color:var(--sky)}
  .cctv-sec{background:var(--panel);border:1px solid rgba(0,85,255,.12);border-radius:14px;padding:22px 24px;margin-bottom:12px}
  .cctv-stitle{font-size:11px;font-weight:600;color:var(--ink3);letter-spacing:.1em;text-transform:uppercase;font-family:var(--fm);margin-bottom:16px;display:flex;align-items:center;gap:8px}
  .cctv-stitle::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--sky);display:inline-block}
  .cctv-r2{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:end}
  .cctv-r3{display:grid;grid-template-columns:1fr 1fr 90px;gap:14px;align-items:end}
  .cctv-lbl{font-size:11px;color:var(--ink3);font-family:var(--fm);letter-spacing:.05em;text-transform:uppercase;margin-bottom:6px}
  .cctv-sel,.cctv-inp{width:100%;background:var(--bg3);border:1px solid rgba(0,85,255,.18);border-radius:8px;padding:11px 14px;color:var(--ink);font-family:var(--fb);font-size:14px;outline:none;transition:border-color .18s}
  .cctv-sel:focus,.cctv-inp:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(0,85,255,.1)}
  .cctv-sel option{background:var(--bg2)}
  .cctv-btn{width:100%;padding:15px;background:var(--blue);border:none;border-radius:12px;color:#fff;font-size:15px;font-weight:700;font-family:var(--fh);cursor:pointer;margin-top:8px;transition:all .18s}
  .cctv-btn:hover{background:#2270ff;transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,85,255,.3)}
  .cctv-res{background:var(--bg1);border:1px solid rgba(0,85,255,.18);border-radius:16px;padding:28px;margin-top:28px}
  .cctv-res-h{font-size:17px;font-weight:800;font-family:var(--fh);color:var(--ink);margin-bottom:6px}
  .cctv-chips{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 20px}
  .cctv-chip{font-size:11px;padding:4px 12px;border-radius:20px;background:rgba(0,85,255,.1);border:1px solid rgba(0,85,255,.2);color:var(--sky);font-family:var(--fm)}
  .cctv-row{display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid rgba(0,85,255,.08)}
  .cctv-row:last-of-type{border-bottom:none}
  .cctv-rname{font-size:14px;font-weight:600;color:var(--ink)}
  .cctv-rdetail{font-size:11px;color:var(--ink3);margin-top:2px}
  .cctv-rprice{font-size:14px;font-weight:700;color:var(--ink);text-align:right}
  .cctv-runit{font-size:11px;color:var(--ink3);margin-top:2px;text-align:right}
  .auto-pill{display:inline-flex;align-items:center;font-size:10px;background:rgba(0,214,143,.1);color:var(--ok);border:1px solid rgba(0,214,143,.2);padding:2px 8px;border-radius:20px;margin-left:7px;font-family:var(--fm);vertical-align:middle}
  .cctv-total{display:flex;justify-content:space-between;align-items:center;padding-top:16px;margin-top:12px;border-top:2px solid rgba(0,85,255,.18)}
  .cctv-total-lbl{font-size:16px;font-weight:700;font-family:var(--fh)}
  .cctv-total-val{font-size:28px;font-weight:900;font-family:var(--fh);color:var(--sky)}
  .cctv-note{font-size:11px;color:var(--ink3);margin-top:14px;line-height:1.7;padding:12px 14px;background:rgba(0,0,0,.12);border-radius:8px}
  @media(max-width:600px){.cctv-r2,.cctv-r3{grid-template-columns:1fr}}
`}</style>;

export default function CCTVCalculator({ nav }) {
  const [mode, setMode] = useState("hd");
  const [P, setP] = useState(DEFAULT_PRICES);
  const [loading, setLoading] = useState(true);

  // HD state
  const [hdDvrCh, setHdDvrCh] = useState("8");
  const [hdDvrCond, setHdDvrCond] = useState("new");
  const [hdCamMp, setHdCamMp] = useState("2.4");
  const [hdCamType, setHdCamType] = useState("bullet");
  const [hdCamQty, setHdCamQty] = useState(4);
  const [hdHddSize, setHdHddSize] = useState("1000");
  const [hdHddQty, setHdHddQty] = useState(1);
  const [hdWireType, setHdWireType] = useState("3plus1");
  const [hdWireQty, setHdWireQty] = useState(1);

  // IP state
  const [ipNvrCh, setIpNvrCh] = useState("8");
  const [ipNvrType, setIpNvrType] = useState("poe");
  const [ipCamMp, setIpCamMp] = useState("5");
  const [ipCamType, setIpCamType] = useState("bullet");
  const [ipCamQty, setIpCamQty] = useState(4);
  const [ipHddSize, setIpHddSize] = useState("1000");
  const [ipHddQty, setIpHddQty] = useState(1);
  const [ipWireType, setIpWireType] = useState("cat6");
  const [ipWireQty, setIpWireQty] = useState(1);

  // Load prices from API
  useEffect(() => {
    fetch(API + "/cctv-prices")
      .then(r => r.json())
      .then(data => {
        if (data.structured) setP(data.structured);
      })
      .catch(() => {}) // fallback to default
      .finally(() => setLoading(false));
  }, []);

  const getP = (system, sub, ...keys) => {
    try {
      let v = P[system][sub];
      for (const k of keys) v = v[k];
      return typeof v === "number" ? v : 0;
    } catch { return 0; }
  };

  const calcRows = () => {
    const rows = [];
    const add = (name, qty, unitPrice, detail, auto) =>
      rows.push({ name, qty, unitPrice: unitPrice||0, total: qty*(unitPrice||0), detail: detail||"", auto: !!auto });

    if (mode === "hd") {
      const ch = parseInt(hdDvrCh), camQty = Math.max(1, hdCamQty);
      add(`${ch} Channel DVR`, 1, getP("hd","dvr",hdDvrCh,hdDvrCond), hdDvrCond==="new"?"New unit":"Refurbished unit");
      add(`${hdCamMp}MP ${hdCamType.charAt(0).toUpperCase()+hdCamType.slice(1)} Camera`, camQty, getP("hd","cam",hdCamMp,hdCamType), `${hdCamMp}MP HD`);
      const hddLbl = parseInt(hdHddSize)>=1000?`${parseInt(hdHddSize)/1000}TB HDD`:"500GB HDD";
      add(hddLbl+" (Surveillance)", Math.max(1,hdHddQty), getP("hd","hdd",parseInt(hdHddSize)), "Video recording storage");
      if(hdWireQty>0) add(hdWireType==="3plus1"?"3+1 CCTV Cable (100m roll)":"RG59 Coaxial Cable (100m roll)", hdWireQty, getP("hd","wire",hdWireType), "100 metres per roll");
      add("DC Power Connector",        camQty,        getP("hd","acc","dc"),           "1 per camera",         true);
      add("BNC Connector",             camQty*2,      getP("hd","acc","bnc"),          "2 per camera (in+out)",true);
      add("Camera Junction Box",       camQty,        getP("hd","acc","cambox"),       "1 per camera mount",   true);
      const psQty = Math.ceil(camQty/4);
      const psKey = `psupply_${Math.min(ch,32)}`;
      add("5A CCTV Power Supply Board",psQty, getP("hd","acc",psKey), `Auto: 1 per 4 cameras`, true);
    } else {
      const ch = parseInt(ipNvrCh), camQty = Math.max(1, ipCamQty);
      add(`${ch}CH NVR (${ipNvrType==="poe"?"with PoE":"without PoE"})`, 1, getP("ip","nvr",ipNvrCh,ipNvrType), ipNvrType==="poe"?"Built-in PoE":"External switch needed");
      add(`${ipCamMp}MP IP ${ipCamType.charAt(0).toUpperCase()+ipCamType.slice(1)} Camera`, camQty, getP("ip","cam",ipCamMp,ipCamType), `${ipCamMp}MP · PoE powered`);
      const hddLbl = parseInt(ipHddSize)>=1000?`${parseInt(ipHddSize)/1000}TB HDD`:"500GB HDD";
      add(hddLbl+" (Surveillance)", Math.max(1,ipHddQty), getP("ip","hdd",parseInt(ipHddSize)), "Video recording storage");
      if(ipWireQty>0) add(ipWireType==="cat6"?"CAT6 Cable (100m roll)":"CAT5e Cable (100m roll)", ipWireQty, getP("ip","wire",ipWireType), "100 metres per roll");
      add("Camera Wall/Ceiling Mount Box", camQty, getP("ip","acc","cambox"), "1 per camera", true);
      if(ipNvrType==="nopoe") {
        const swP = camQty<=4?4:camQty<=8?8:16;
        const swQty = Math.ceil(camQty/swP);
        add(`${swP}-Port PoE Network Switch`, swQty, getP("ip","acc",`poe_sw_${swP}`), `Auto: needed for non-PoE NVR`, true);
      } else if(camQty>ch) {
        const extra=camQty-ch, swP=extra<=4?4:8;
        add(`${swP}-Port PoE Switch (extra)`, 1, getP("ip","acc",`poe_sw_${swP}`), `${extra} cameras beyond NVR ports`, true);
      }
    }
    return rows;
  };

  const rows = calcRows();
  const grand = rows.reduce((s,r)=>s+r.total,0);
  const chips = mode==="hd"
    ? [`${hdDvrCh}CH DVR`,`${hdCamQty} Cameras (${hdCamMp}MP)`,parseInt(hdHddSize)>=1000?`${parseInt(hdHddSize)/1000}TB HDD`:"500GB HDD",`${hdWireQty} Wire Roll(s)`]
    : [`${ipNvrCh}CH NVR`,`${ipCamQty} IP Cameras (${ipCamMp}MP)`,parseInt(ipHddSize)>=1000?`${parseInt(ipHddSize)/1000}TB HDD`:"500GB HDD",`${ipWireQty} Cable Roll(s)`];

  const Sel = ({label,value,onChange,children,span}) => (
    <div style={span?{gridColumn:"1/"+span}:{}}>
      <div className="cctv-lbl">{label}</div>
      <select className="cctv-sel" value={value} onChange={e=>onChange(e.target.value)}>{children}</select>
    </div>
  );
  const Num = ({label,value,onChange,min=0,max=128}) => (
    <div>
      <div className="cctv-lbl">{label}</div>
      <input className="cctv-inp" type="number" value={value} min={min} max={max} onChange={e=>onChange(Math.max(min,parseInt(e.target.value)||min))}/>
    </div>
  );

  return (
    <div>
      <GS/>
      <nav style={{position:"sticky",top:0,zIndex:100,background:"rgba(2,11,24,.93)",backdropFilter:"blur(18px)",borderBottom:"1px solid rgba(0,85,255,.1)",padding:"0 40px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div onClick={()=>nav("home")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
          <img src="/logo.jpeg" alt="TCG" style={{width:34,height:34,objectFit:"contain",borderRadius:7,background:"#fff",padding:3}}/>
          <span style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:15,color:"var(--ink)",lineHeight:1.15}}>The Computer<br/><span style={{color:"var(--red)"}}>Garage</span></span>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>nav("services")} style={{background:"transparent",border:"1px solid rgba(0,184,255,.3)",color:"var(--sky)",padding:"8px 18px",borderRadius:9,cursor:"pointer",fontFamily:"var(--fb)",fontWeight:600,fontSize:13}}>Services</button>
          <button onClick={()=>nav("quote")} style={{background:"var(--blue)",border:"none",color:"#fff",padding:"8px 18px",borderRadius:9,cursor:"pointer",fontFamily:"var(--fb)",fontWeight:600,fontSize:13}}>Get AMC Quote</button>
        </div>
      </nav>

      <div className="cctv-wrap">
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--sky)",letterSpacing:".14em",textTransform:"uppercase",marginBottom:12}}>CCTV Price Calculator</div>
          <h1 style={{fontFamily:"var(--fh)",fontSize:"clamp(24px,4vw,44px)",fontWeight:900,marginBottom:12,lineHeight:1.1}}>Calculate Your CCTV System Cost</h1>
          <p style={{color:"var(--ink2)",fontSize:15,maxWidth:520,margin:"0 auto",lineHeight:1.75}}>Choose HD or IP — accessories auto-calculated. Get free on-site survey for final quote.</p>
          {loading&&<div style={{marginTop:12,fontSize:12,color:"var(--ink3)",fontFamily:"var(--fm)"}}>Loading latest prices…</div>}
        </div>

        <div className="cctv-tabs">
          <div className={`cctv-tab ${mode==="hd"?"on":""}`} onClick={()=>setMode("hd")}>
            HD Camera System<br/><span style={{fontSize:12,fontWeight:400,opacity:.7}}>DVR Based · Coaxial Cable</span>
          </div>
          <div className={`cctv-tab ${mode==="ip"?"on":""}`} onClick={()=>setMode("ip")}>
            IP Camera System<br/><span style={{fontSize:12,fontWeight:400,opacity:.7}}>NVR Based · Network Cable</span>
          </div>
        </div>

        {mode==="hd"&&<>
          <div className="cctv-sec">
            <div className="cctv-stitle">DVR Unit</div>
            <div className="cctv-r2">
              <Sel label="DVR Channels" value={hdDvrCh} onChange={setHdDvrCh}>
                <option value="4">4 Channel DVR</option>
                <option value="8">8 Channel DVR</option>
                <option value="16">16 Channel DVR</option>
                <option value="32">32 Channel DVR</option>
              </Sel>
              <Sel label="Condition" value={hdDvrCond} onChange={setHdDvrCond}>
                <option value="new">New</option>
                <option value="refurb">Refurbished</option>
              </Sel>
            </div>
          </div>

          <div className="cctv-sec">
            <div className="cctv-stitle">Camera</div>
            <div className="cctv-r3">
              <Sel label="Resolution" value={hdCamMp} onChange={setHdCamMp}>
                <option value="2.4">2.4 MP (1080P)</option>
                <option value="5">5 MP</option>
                <option value="8">8 MP (4K)</option>
              </Sel>
              <Sel label="Camera Type" value={hdCamType} onChange={setHdCamType}>
                <option value="bullet">Bullet Camera</option>
                <option value="dome">Dome Camera</option>
                <option value="ptz">PTZ Camera</option>
              </Sel>
              <Num label="Qty" value={hdCamQty} onChange={setHdCamQty} min={1}/>
            </div>
          </div>

          <div className="cctv-sec">
            <div className="cctv-stitle">Hard Disk</div>
            <div className="cctv-r3">
              <Sel label="HDD Size" value={hdHddSize} onChange={setHdHddSize} span={3}>
                <option value="500">500 GB</option>
                <option value="1000">1 TB</option>
                <option value="2000">2 TB</option>
                <option value="3000">3 TB</option>
                <option value="4000">4 TB</option>
              </Sel>
              <Num label="Qty" value={hdHddQty} onChange={setHdHddQty} min={1} max={8}/>
            </div>
          </div>

          <div className="cctv-sec">
            <div className="cctv-stitle">Cable Wire</div>
            <div className="cctv-r3">
              <Sel label="Wire Type (100 mtr roll)" value={hdWireType} onChange={setHdWireType} span={3}>
                <option value="3plus1">3+1 CCTV Cable — 100 mtr</option>
                <option value="coaxial">RG59 Coaxial Cable — 100 mtr</option>
              </Sel>
              <Num label="Rolls" value={hdWireQty} onChange={setHdWireQty} min={0} max={20}/>
            </div>
          </div>
        </>}

        {mode==="ip"&&<>
          <div className="cctv-sec">
            <div className="cctv-stitle">NVR Unit</div>
            <div className="cctv-r2">
              <Sel label="NVR Channels" value={ipNvrCh} onChange={setIpNvrCh}>
                <option value="4">4 Channel NVR</option>
                <option value="8">8 Channel NVR</option>
                <option value="16">16 Channel NVR</option>
                <option value="32">32 Channel NVR</option>
              </Sel>
              <Sel label="NVR Type" value={ipNvrType} onChange={setIpNvrType}>
                <option value="poe">With PoE (Built-in Switch)</option>
                <option value="nopoe">Without PoE</option>
              </Sel>
            </div>
          </div>

          <div className="cctv-sec">
            <div className="cctv-stitle">IP Camera</div>
            <div className="cctv-r3">
              <Sel label="Resolution" value={ipCamMp} onChange={setIpCamMp}>
                <option value="2">2 MP (1080P)</option>
                <option value="4">4 MP</option>
                <option value="5">5 MP</option>
                <option value="8">8 MP (4K)</option>
              </Sel>
              <Sel label="Camera Type" value={ipCamType} onChange={setIpCamType}>
                <option value="bullet">Bullet Camera</option>
                <option value="dome">Dome Camera</option>
                <option value="ptz">PTZ Camera</option>
              </Sel>
              <Num label="Qty" value={ipCamQty} onChange={setIpCamQty} min={1}/>
            </div>
          </div>

          <div className="cctv-sec">
            <div className="cctv-stitle">Hard Disk</div>
            <div className="cctv-r3">
              <Sel label="HDD Size" value={ipHddSize} onChange={setIpHddSize} span={3}>
                <option value="500">500 GB</option>
                <option value="1000">1 TB</option>
                <option value="2000">2 TB</option>
                <option value="3000">3 TB</option>
                <option value="4000">4 TB</option>
              </Sel>
              <Num label="Qty" value={ipHddQty} onChange={setIpHddQty} min={1} max={8}/>
            </div>
          </div>

          <div className="cctv-sec">
            <div className="cctv-stitle">Network Cable</div>
            <div className="cctv-r3">
              <Sel label="Cable Type (100 mtr roll)" value={ipWireType} onChange={setIpWireType} span={3}>
                <option value="cat6">CAT6 Network Cable — 100 mtr</option>
                <option value="cat5e">CAT5e Network Cable — 100 mtr</option>
              </Sel>
              <Num label="Rolls" value={ipWireQty} onChange={setIpWireQty} min={0} max={20}/>
            </div>
          </div>
        </>}

        {/* Results */}
        <div className="cctv-res">
          <div className="cctv-res-h">{mode==="hd"?"Cost Estimate — HD Camera System (DVR)":"Cost Estimate — IP Camera System (NVR)"}</div>
          <div className="cctv-chips">{chips.map((c,i)=><span key={i} className="cctv-chip">{c}</span>)}</div>
          {rows.map((r,i)=>(
            <div key={i} className="cctv-row">
              <div>
                <div className="cctv-rname">{r.name}{r.auto&&<span className="auto-pill">Auto</span>}</div>
                <div className="cctv-rdetail">{r.detail}</div>
              </div>
              <div>
                <div className="cctv-rprice">{fmt(r.total)}</div>
                <div className="cctv-runit">{r.qty} × {fmt(r.unitPrice)}</div>
              </div>
            </div>
          ))}
          <div className="cctv-total">
            <div className="cctv-total-lbl">Estimated Total</div>
            <div className="cctv-total-val">{fmt(grand)}</div>
          </div>
          <div className="cctv-note">* Indicative market rates. Final quote varies by brand, site & installation. Labour charges extra. GST applicable.</div>
        </div>

        <div style={{marginTop:24,background:"linear-gradient(135deg,rgba(0,85,255,.09),rgba(0,184,255,.04))",border:"1px solid rgba(0,85,255,.18)",borderRadius:16,padding:"22px 28px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:14}}>
          <div>
            <div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:16,marginBottom:4}}>Want an exact quote with installation?</div>
            <div style={{fontSize:13,color:"var(--ink2)"}}>Free on-site survey for Varanasi clients · +91 8400281723</div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>nav("quote")} style={{background:"var(--blue)",border:"none",color:"#fff",padding:"11px 22px",borderRadius:10,cursor:"pointer",fontFamily:"var(--fb)",fontWeight:600,fontSize:14}}>Get Full Quote</button>
            <button onClick={()=>nav("contact")} style={{background:"transparent",border:"1px solid rgba(0,184,255,.3)",color:"var(--sky)",padding:"11px 22px",borderRadius:10,cursor:"pointer",fontFamily:"var(--fb)",fontWeight:600,fontSize:14}}>Contact Us</button>
          </div>
        </div>
      </div>

      <footer style={{background:"var(--bg1)",borderTop:"1px solid rgba(0,85,255,.1)",padding:"22px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <span style={{fontSize:12,color:"var(--ink3)"}}>© 2026 The Computer Garage | Saurabh Singh, Varanasi.</span>
        <span style={{fontSize:12,color:"var(--ink3)",fontFamily:"var(--fm)"}}>Varanasi · Prayagraj · Lucknow · Gorakhpur</span>
      </footer>
    </div>
  );
}
