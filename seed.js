// Seeds initial data — runs once automatically
const { table } = require('./data-store');
const bcrypt = require('bcryptjs');
const h = p => bcrypt.hashSync(p, 10);

if (table('users').count() > 0) {
  console.log('✅ Data already exists, skipping seed');
  return;
}

// USERS
table('users').add({id:1,name:'Aditya Kumar',email:'admin@thecomputergarage.in',password:h('admin123'),role:'admin',client_id:null});
table('users').add({id:2,name:'Meera Pandey',email:'meera@prayagfinance.com',password:h('client123'),role:'client',client_id:1});
table('users').add({id:3,name:'Sunil Gupta',email:'sunil@gangaresidency.in',password:h('hotel456'),role:'client',client_id:3});

// CLIENTS
table('clients').add({id:1,company:'Prayagraj Finance Corp',contact:'Meera Pandey',email:'meera@prayagfinance.com',phone:'+91 94500 78899',location:'Civil Lines, Prayagraj',systems:62,cctv:30,servers:4,printers:10,biometrics:6,smartlocks:3,amc_start:'2026-01-01',amc_expiry:'2026-12-31',monthly_rev:9833,technician:'Abhishek T.',status:'Active',paid:1,notes:''});
table('clients').add({id:2,company:'Rameshwari Exports',contact:'Harish Chandra',email:'harish@rameshwariex.com',phone:'+91 97194 56780',location:'Paharia, Varanasi',systems:28,cctv:14,servers:2,printers:5,biometrics:2,smartlocks:0,amc_start:'2025-08-01',amc_expiry:'2026-07-31',monthly_rev:5400,technician:'Sanjay P.',status:'Active',paid:0,notes:''});
table('clients').add({id:3,company:'Ganga Residency Hotels',contact:'Sunil Gupta',email:'sunil@gangaresidency.in',phone:'+91 96704 11223',location:'Godowlia, Varanasi',systems:25,cctv:40,servers:1,printers:4,biometrics:2,smartlocks:12,amc_start:'2025-04-01',amc_expiry:'2026-03-31',monthly_rev:14500,technician:'Abhishek T.',status:'Expiring',paid:1,notes:''});
table('clients').add({id:4,company:'Agastya Pharma Pvt Ltd',contact:'Dr. Ritu Singh',email:'ritu@agastyapharma.in',phone:'+91 99189 90012',location:'Nadesar, Varanasi',systems:30,cctv:12,servers:2,printers:4,biometrics:3,smartlocks:2,amc_start:'2025-06-01',amc_expiry:'2026-05-31',monthly_rev:4800,technician:'Rahul M.',status:'Active',paid:1,notes:''});

// LEADS
table('leads').add({id:1,company:'Kashi Merchants Pvt Ltd',contact:'Rakesh Agarwal',email:'rakesh@kashimerchants.com',phone:'+91 94150 33211',location:'Sigra, Varanasi',systems:42,cctv:18,servers:2,printers:8,biometrics:3,status:'Proposal Sent',value:84000,date:'2026-02-28',message:''});
table('leads').add({id:2,company:'BHU Technology Centre',contact:'Dr. Pradeep Mishra',email:'pradeep@bhutech.in',phone:'+91 94150 99876',location:'Lanka, Varanasi',systems:90,cctv:55,servers:6,printers:15,biometrics:8,status:'Negotiation',value:168000,date:'2026-02-24',message:''});
table('leads').add({id:3,company:'Varuna Hospital',contact:'Anjali Srivastava',email:'anjali@varunahosp.in',phone:'+91 98399 22310',location:'Cantt, Varanasi',systems:35,cctv:28,servers:3,printers:6,biometrics:5,status:'New Lead',value:72000,date:'2026-03-01',message:''});
table('leads').add({id:4,company:'Prayagraj Finance Corp',contact:'Meera Pandey',email:'meera@prayagfinance.com',phone:'+91 94500 78899',location:'Civil Lines, Prayagraj',systems:62,cctv:30,servers:4,printers:10,biometrics:6,status:'Won',value:118000,date:'2026-02-12',message:''});

// TICKETS
table('tickets').add({id:'TCG-001',client_id:1,company:'Prayagraj Finance Corp',subject:'Server not booting after power cut',priority:'Critical',status:'In Progress',technician:'Abhishek T.',notes:'UPS failure — replacement ordered',created:'2026-03-02',updated:'2026-03-03'});
table('tickets').add({id:'TCG-002',client_id:2,company:'Rameshwari Exports',subject:'Core switch port failure on floor 2',priority:'High',status:'Open',technician:null,notes:'',created:'2026-03-04',updated:'2026-03-04'});
table('tickets').add({id:'TCG-003',client_id:3,company:'Ganga Residency Hotels',subject:'CCTV NVR recording gap — lobby',priority:'Medium',status:'Resolved',technician:'Sanjay P.',notes:'NVR HDD replaced.',created:'2026-03-01',updated:'2026-03-02'});

// AMC PRICES
table('prices').add({id:1,service_key:'systems',   service_name:'Computers / Workstations',price_per_unit:475, unit:'per system/month'});
table('prices').add({id:2,service_key:'cctv',      service_name:'CCTV Cameras',            price_per_unit:325, unit:'per camera/month'});
table('prices').add({id:3,service_key:'servers',   service_name:'Servers',                 price_per_unit:3000,unit:'per server/month'});
table('prices').add({id:4,service_key:'printers',  service_name:'Printers',                price_per_unit:1000,unit:'per printer/month'});
table('prices').add({id:5,service_key:'biometrics',service_name:'Biometric Devices',       price_per_unit:800, unit:'per device/month'});
table('prices').add({id:6,service_key:'smartlocks',service_name:'Smart Door Locks',        price_per_unit:1200,unit:'per lock/month'});
table('prices').add({id:7,service_key:'intercom',  service_name:'Intercom Systems',        price_per_unit:1500,unit:'per unit/month'});
table('prices').add({id:8,service_key:'iot',       service_name:'IoT Devices',             price_per_unit:600, unit:'per device/month'});

// OFFERS
table('offers').add({id:1,title:'Summer Bundle Offer',description:'10% off on Computer + CCTV combo AMC',discount_percent:10,code:'SUMMER10',valid_from:'2026-04-01',valid_to:'2026-06-30',active:1});
table('offers').add({id:2,title:'New Year 2027 Special',description:'15% discount on first 3 months AMC',discount_percent:15,code:'NY2027',valid_from:'2026-12-25',valid_to:'2027-01-15',active:1});

// CCTV PRICES
const cp = (cat,key,lbl,price) => table('cctv_prices').addIfNew(['category','item_key'],{category:cat,item_key:key,label:lbl,price});
// HD DVR
cp('hd_dvr','4_new',   '4 Channel DVR — New',2800);cp('hd_dvr','4_refurb','4 Channel DVR — Refurb',1800);
cp('hd_dvr','8_new',   '8 Channel DVR — New',3800);cp('hd_dvr','8_refurb','8 Channel DVR — Refurb',2400);
cp('hd_dvr','16_new',  '16 Channel DVR — New',7000);cp('hd_dvr','16_refurb','16 Channel DVR — Refurb',4500);
cp('hd_dvr','32_new',  '32 Channel DVR — New',13000);cp('hd_dvr','32_refurb','32 Channel DVR — Refurb',8000);
// HD Cameras
cp('hd_cam','2.4_bullet','2.4MP Bullet Camera',850);cp('hd_cam','2.4_dome','2.4MP Dome Camera',900);cp('hd_cam','2.4_ptz','2.4MP PTZ Camera',3500);
cp('hd_cam','5_bullet','5MP Bullet Camera',1500);cp('hd_cam','5_dome','5MP Dome Camera',1600);cp('hd_cam','5_ptz','5MP PTZ Camera',5500);
cp('hd_cam','8_bullet','8MP Bullet Camera',2800);cp('hd_cam','8_dome','8MP Dome Camera',3000);cp('hd_cam','8_ptz','8MP PTZ Camera',9000);
// HD HDD
cp('hd_hdd','500','500 GB HDD',1900);cp('hd_hdd','1000','1 TB HDD',2900);cp('hd_hdd','2000','2 TB HDD',4800);cp('hd_hdd','3000','3 TB HDD',7000);cp('hd_hdd','4000','4 TB HDD',9200);
// HD Wire & Accessories
cp('hd_wire','3plus1','3+1 CCTV Cable 100m',950);cp('hd_wire','coaxial','RG59 Coaxial 100m',1100);
cp('hd_acc','dc','DC Power Connector',18);cp('hd_acc','bnc','BNC Connector',22);cp('hd_acc','cambox','Camera Junction Box',130);
cp('hd_acc','psupply_4','Power Supply 4-cam',380);cp('hd_acc','psupply_8','Power Supply 8-cam',680);cp('hd_acc','psupply_16','Power Supply 16-cam',1200);cp('hd_acc','psupply_32','Power Supply 32-cam',2200);
// IP NVR
cp('ip_nvr','4_poe','4CH NVR with PoE',4200);cp('ip_nvr','4_nopoe','4CH NVR no PoE',3200);
cp('ip_nvr','8_poe','8CH NVR with PoE',6200);cp('ip_nvr','8_nopoe','8CH NVR no PoE',4800);
cp('ip_nvr','16_poe','16CH NVR with PoE',10500);cp('ip_nvr','16_nopoe','16CH NVR no PoE',8000);
cp('ip_nvr','32_poe','32CH NVR with PoE',18000);cp('ip_nvr','32_nopoe','32CH NVR no PoE',14000);
// IP Cameras
cp('ip_cam','2_bullet','2MP Bullet Camera',1300);cp('ip_cam','2_dome','2MP Dome Camera',1400);cp('ip_cam','2_ptz','2MP PTZ Camera',7000);
cp('ip_cam','4_bullet','4MP Bullet Camera',1900);cp('ip_cam','4_dome','4MP Dome Camera',2100);cp('ip_cam','4_ptz','4MP PTZ Camera',9000);
cp('ip_cam','5_bullet','5MP Bullet Camera',2400);cp('ip_cam','5_dome','5MP Dome Camera',2600);cp('ip_cam','5_ptz','5MP PTZ Camera',11000);
cp('ip_cam','8_bullet','8MP Bullet Camera',3800);cp('ip_cam','8_dome','8MP Dome Camera',4200);cp('ip_cam','8_ptz','8MP PTZ Camera',16000);
// IP HDD, Wire & Accessories
cp('ip_hdd','500','500 GB HDD',1900);cp('ip_hdd','1000','1 TB HDD',2900);cp('ip_hdd','2000','2 TB HDD',4800);cp('ip_hdd','3000','3 TB HDD',7000);cp('ip_hdd','4000','4 TB HDD',9200);
cp('ip_wire','cat6','CAT6 Cable 100m',1300);cp('ip_wire','cat5e','CAT5e Cable 100m',950);
cp('ip_acc','cambox','Camera Mount Box',160);cp('ip_acc','poe_sw_4','PoE Switch 4-Port',2000);cp('ip_acc','poe_sw_8','PoE Switch 8-Port',3800);cp('ip_acc','poe_sw_16','PoE Switch 16-Port',7000);

console.log('✅ Database seeded successfully!');
