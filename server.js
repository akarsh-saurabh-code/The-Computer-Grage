require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { table, today, now } = require('./data-store');

// Seed on first run
require('./seed');

const app  = express();
const PORT = process.env.PORT || 3001;
const SECRET = process.env.JWT_SECRET || 'tcg_secret_2026';

app.use(cors({ origin: '*' }));
app.use(express.json());

// ── AUTH ─────────────────────────────────────────────────────
function auth(req,res,next){
  const t = req.headers.authorization?.split(' ')[1];
  if(!t) return res.status(401).json({error:'No token'});
  try { req.user = jwt.verify(t, SECRET); next(); }
  catch { res.status(401).json({error:'Invalid token'}); }
}
const admin = (req,res,next) => req.user?.role==='admin' ? next() : res.status(403).json({error:'Admin only'});

// ── LOGIN ────────────────────────────────────────────────────
app.post('/api/login',(req,res)=>{
  const {email,password} = req.body;
  const user = table('users').one({email});
  if(!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({error:'Wrong email or password'});
  const token = jwt.sign({id:user.id,name:user.name,email:user.email,role:user.role,clientId:user.client_id}, SECRET, {expiresIn:'7d'});
  res.json({token, user:{id:user.id,name:user.name,email:user.email,role:user.role,clientId:user.client_id}});
});

app.post('/api/change-password',auth,(req,res)=>{
  const {currentPassword,newPassword} = req.body;
  const user = table('users').one({id:req.user.id});
  if(!bcrypt.compareSync(currentPassword, user.password))
    return res.status(400).json({error:'Current password wrong'});
  if(!newPassword || newPassword.length<6)
    return res.status(400).json({error:'Min 6 characters'});
  table('users').update({id:req.user.id},{password:bcrypt.hashSync(newPassword,10)});
  res.json({success:true});
});

// ── DASHBOARD ────────────────────────────────────────────────
app.get('/api/dashboard',auth,admin,(req,res)=>{
  const clients = table('clients').all();
  const leads   = table('leads').all();
  const tickets = table('tickets').all(t=>t.status!=='Resolved'&&t.status!=='Closed');
  const exp = clients.filter(c=>{
    if(!c.amc_expiry) return false;
    const d = Math.ceil((new Date(c.amc_expiry)-new Date())/864e5);
    return d>0 && d<=60;
  });
  res.json({
    totalClients: clients.filter(c=>c.status!=='Expired').length,
    monthlyRevenue: clients.reduce((a,c)=>a+(c.monthly_rev||0),0),
    openTickets: tickets.length,
    expiringCount: exp.length,
    expiringClients: exp,
    recentLeads: leads.slice(-5).reverse(),
    openTicketsList: tickets.slice(0,5),
  });
});

// ── CLIENTS ──────────────────────────────────────────────────
app.get('/api/clients',auth,admin,(req,res)=>{
  res.json(table('clients').all().reverse());
});

app.get('/api/clients/:id',auth,(req,res)=>{
  const id = req.user.role==='client' ? req.user.clientId : parseInt(req.params.id);
  res.json(table('clients').one(r=>r.id===id));
});

app.post('/api/clients',auth,admin,(req,res)=>{
  const d = req.body;
  const r = table('clients').add({
    company:d.company,contact:d.contact,email:d.email,phone:d.phone,location:d.location,
    systems:+d.systems||0,cctv:+d.cctv||0,servers:+d.servers||0,
    printers:+d.printers||0,biometrics:+d.biometrics||0,smartlocks:+d.smartlocks||0,
    amc_start:d.amc_start,amc_expiry:d.amc_expiry,monthly_rev:+d.monthly_rev||0,
    technician:d.technician,notes:d.notes||'',status:d.status||'Active',paid:1
  });
  if(d.email && d.password) {
    if(!table('users').one({email:d.email}))
      table('users').add({name:d.contact||d.company,email:d.email,password:bcrypt.hashSync(d.password,10),role:'client',client_id:r.id});
  }
  res.json({success:true,id:r.id});
});

app.put('/api/clients/:id',auth,admin,(req,res)=>{
  const d = req.body, id = parseInt(req.params.id);
  table('clients').update({id},{
    company:d.company,contact:d.contact,email:d.email,phone:d.phone,location:d.location,
    systems:+d.systems||0,cctv:+d.cctv||0,servers:+d.servers||0,
    printers:+d.printers||0,biometrics:+d.biometrics||0,smartlocks:+d.smartlocks||0,
    amc_start:d.amc_start,amc_expiry:d.amc_expiry,monthly_rev:+d.monthly_rev||0,
    technician:d.technician,status:d.status,paid:d.paid?1:0,notes:d.notes||''
  });
  res.json({success:true});
});

app.delete('/api/clients/:id',auth,admin,(req,res)=>{
  const id=parseInt(req.params.id);
  table('clients').delete({id});
  table('users').delete(r=>r.client_id===id);
  res.json({success:true});
});

// ── LEADS ────────────────────────────────────────────────────
app.get('/api/leads',auth,admin,(req,res)=>{
  res.json(table('leads').all().reverse());
});

app.post('/api/leads',(req,res)=>{
  const d = req.body;
  const prices = table('prices').all();
  const gp = k => prices.find(p=>p.service_key===k)?.price_per_unit||0;
  const value = ((+d.systems||0)*gp('systems')+(+d.cctv||0)*gp('cctv')+(+d.servers||0)*gp('servers')+
    (+d.printers||0)*gp('printers')+(+d.biometrics||0)*gp('biometrics')+(+d.smartlocks||0)*gp('smartlocks'))*12;
  const r = table('leads').add({
    company:d.company,contact:d.contact,email:d.email,phone:d.phone,location:d.location,
    systems:+d.systems||0,cctv:+d.cctv||0,servers:+d.servers||0,
    printers:+d.printers||0,biometrics:+d.biometrics||0,smartlocks:+d.smartlocks||0,
    message:d.message||'',value,date:today(),status:'New Lead'
  });
  res.json({success:true,id:r.id});
});

app.put('/api/leads/:id',auth,admin,(req,res)=>{
  table('leads').update(r=>r.id===parseInt(req.params.id),{status:req.body.status});
  res.json({success:true});
});

// ── TICKETS ──────────────────────────────────────────────────
app.get('/api/tickets',auth,(req,res)=>{
  if(req.user.role==='client')
    return res.json(table('tickets').all(t=>String(t.client_id)===String(req.user.clientId)).reverse());
  res.json(table('tickets').all().reverse());
});

app.post('/api/tickets',auth,(req,res)=>{
  const {subject,priority,notes,client_id,company} = req.body;
  const all = table('tickets').all();
  const maxN = all.reduce((m,t)=>Math.max(m,parseInt((t.id||'0').replace('TCG-',''))||0),0);
  const id = `TCG-${String(maxN+1).padStart(3,'0')}`;
  const cId = req.user.role==='client' ? req.user.clientId : client_id;
  const comp = req.user.role==='client' ? table('clients').one(r=>r.id===cId)?.company : company;
  table('tickets').add({id,client_id:cId,company:comp,subject,priority:priority||'Medium',
    status:'Open',technician:null,notes:notes||'',created:today(),updated:today()});
  res.json({success:true,id});
});

app.put('/api/tickets/:id',auth,admin,(req,res)=>{
  table('tickets').update({id:req.params.id},{status:req.body.status,technician:req.body.technician,notes:req.body.notes,updated:today()});
  res.json({success:true});
});

// ── PRICES (AMC) ─────────────────────────────────────────────
app.get('/api/prices',(req,res)=>{
  res.json(table('prices').all());
});

app.put('/api/prices/:key',auth,admin,(req,res)=>{
  table('prices').update({service_key:req.params.key},{price_per_unit:parseInt(req.body.price_per_unit)});
  res.json({success:true});
});

// ── CCTV PRICES ──────────────────────────────────────────────
app.get('/api/cctv-prices',(req,res)=>{
  const rows = table('cctv_prices').all();
  const S = {};
  rows.forEach(r=>{
    const [sys,sub] = r.category.split('_');
    if(!S[sys]) S[sys]={};
    if(!S[sys][sub]) S[sys][sub]={};
    const pts = r.item_key.split('_');
    if(pts.length===1){
      S[sys][sub][r.item_key]=r.price;
    } else {
      const k1=pts[0], k2=pts.slice(1).join('_');
      if(typeof S[sys][sub][k1]!=='object') S[sys][sub][k1]={};
      S[sys][sub][k1][k2]=r.price;
    }
  });
  res.json({structured:S,flat:rows});
});

app.put('/api/cctv-prices/:id',auth,admin,(req,res)=>{
  table('cctv_prices').update(r=>r.id===parseInt(req.params.id),{price:parseInt(req.body.price)});
  res.json({success:true});
});

app.post('/api/cctv-prices/bulk',auth,admin,(req,res)=>{
  req.body.updates.forEach(u=>table('cctv_prices').update(r=>r.id===parseInt(u.id),{price:parseInt(u.price)}));
  res.json({success:true});
});

// ── OFFERS ───────────────────────────────────────────────────
app.get('/api/offers',(req,res)=>{
  const t=today();
  res.json(table('offers').all(o=>o.active==1&&(!o.valid_to||o.valid_to>=t)));
});

app.get('/api/offers/all',auth,admin,(req,res)=>{
  res.json(table('offers').all().reverse());
});

app.post('/api/offers',auth,admin,(req,res)=>{
  const d=req.body;
  const r=table('offers').add({title:d.title,description:d.description,discount_percent:d.discount_percent,
    code:d.code?.toUpperCase(),valid_from:d.valid_from,valid_to:d.valid_to,active:d.active?1:0});
  res.json({success:true,id:r.id});
});

app.put('/api/offers/:id',auth,admin,(req,res)=>{
  const d=req.body, id=parseInt(req.params.id);
  table('offers').update({id},{title:d.title,description:d.description,discount_percent:d.discount_percent,
    code:d.code?.toUpperCase(),valid_from:d.valid_from,valid_to:d.valid_to,active:d.active?1:0});
  res.json({success:true});
});

app.delete('/api/offers/:id',auth,admin,(req,res)=>{
  table('offers').delete({id:parseInt(req.params.id)});
  res.json({success:true});
});

app.post('/api/offers/validate',(req,res)=>{
  const t=today(), code=req.body.code?.toUpperCase();
  const offer=table('offers').one(o=>o.code===code&&o.active==1&&(!o.valid_to||o.valid_to>=t));
  if(!offer) return res.status(404).json({error:'Invalid or expired code'});
  res.json(offer);
});

// ── PAYMENTS ─────────────────────────────────────────────────
app.post('/api/payments/create-order',auth,(req,res)=>{
  const {amount,description} = req.body;
  const client = table('clients').one(r=>r.id===req.user.clientId);
  const mockId = 'order_mock_'+Date.now();
  table('payments').add({client_id:req.user.clientId,company:client?.company,amount,status:'pending',order_id:mockId,description});
  res.json({orderId:mockId,amount,currency:'INR',key:'rzp_test_demo',mock:true});
});

app.post('/api/payments/verify',auth,(req,res)=>{
  table('payments').update({order_id:req.body.orderId},{status:'paid',payment_id:req.body.paymentId||'mock'});
  table('clients').update(r=>r.id===req.user.clientId,{paid:1});
  res.json({success:true});
});

app.get('/api/payments',auth,(req,res)=>{
  if(req.user.role==='client')
    return res.json(table('payments').all(p=>String(p.client_id)===String(req.user.clientId)).reverse());
  res.json(table('payments').all().reverse());
});

// ── NOTIFICATIONS ────────────────────────────────────────────
app.get('/api/notifications',auth,admin,(req,res)=>{
  res.json(table('notifications').all().reverse().slice(0,50));
});

app.post('/api/notifications/send-reminder/:id',auth,admin,(req,res)=>{
  const client = table('clients').one(r=>r.id===parseInt(req.params.id));
  if(!client) return res.status(404).json({error:'Client not found'});
  const days = Math.ceil((new Date(client.amc_expiry)-new Date())/864e5);
  table('notifications').add({type:'reminder',recipient:client.email,company:client.company,
    message:`AMC expires in ${days} days`,status:'logged',sent_at:now()});
  console.log(`📧 [Reminder logged] → ${client.email} — ${days} days left`);
  res.json({success:true,message:`Reminder logged for ${client.company}`});
});

// ── START ────────────────────────────────────────────────────
app.listen(PORT, ()=>{
  console.log('');
  console.log('╔══════════════════════════════════════╗');
  console.log('║   The Computer Garage — Server       ║');
  console.log(`║   Running on http://localhost:${PORT}  ║`);
  console.log('║   Data saved in /data/ folder        ║');
  console.log('╚══════════════════════════════════════╝');
  console.log('');
});
