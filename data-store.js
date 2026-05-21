// Pure JS JSON Database — no compilation needed
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });

const now  = () => new Date().toISOString().replace('T',' ').slice(0,19);
const today = () => new Date().toISOString().slice(0,10);

function load(name) {
  const f = path.join(DIR, name+'.json');
  try { return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f,'utf8')) : []; }
  catch(e) { return []; }
}

function save(name, rows) {
  fs.writeFileSync(path.join(DIR, name+'.json'), JSON.stringify(rows, null, 2));
}

function table(name) {
  return {
    all(filterFn) {
      let r = load(name);
      return filterFn ? r.filter(filterFn) : r;
    },
    one(filterFn) {
      return load(name).find(typeof filterFn === 'function'
        ? filterFn
        : r => Object.entries(filterFn).every(([k,v]) => String(r[k])===String(v))
      ) || null;
    },
    count() { return load(name).length; },
    add(row) {
      const rows = load(name);
      if (row.id === undefined) {
        const nums = rows.map(r => typeof r.id==='number'?r.id:0);
        row.id = nums.length ? Math.max(...nums)+1 : 1;
      }
      if (!row.created_at) row.created_at = now();
      rows.push(row);
      save(name, rows);
      return { id: row.id, lastInsertRowid: row.id };
    },
    addIfNew(uniqueFields, row) {
      const rows = load(name);
      const dup = rows.find(r => uniqueFields.every(k => String(r[k])===String(row[k])));
      if (dup) return { id: dup.id };
      return this.add(row);
    },
    update(filterFn, updates) {
      const rows = load(name);
      const fn = typeof filterFn==='function' ? filterFn
        : r => Object.entries(filterFn).every(([k,v])=>String(r[k])===String(v));
      const updated = rows.map(r => fn(r) ? {...r, ...updates} : r);
      save(name, updated);
    },
    delete(filterFn) {
      const rows = load(name);
      const fn = typeof filterFn==='function' ? filterFn
        : r => Object.entries(filterFn).every(([k,v])=>String(r[k])===String(v));
      save(name, rows.filter(r => !fn(r)));
    }
  };
}

module.exports = { table, today, now };
