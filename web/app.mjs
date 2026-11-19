import {$,el,select,link,data,download} from './ui.mjs';
import {search,citation} from './model.mjs';
let records,issues,found=[],pins=[],limit=20;
const uniq=xs=>[...new Set(xs.filter(Boolean))].sort();
function recordCard(r,pinned){
 const card=el('article',undefined,'record');card.append(el('span',r.kind+(r.id?' #'+r.id:''),'pill'),el('h3',r.title),el('p','Published '+r.published+(r.findingDate?' · Findings dated '+r.findingDate:''),'small'));
 const a=issues[r.id];if(a){for(const [topic,outcome,details] of a.issues){const d=el('details'),h=el('summary',topic+' · '+outcome);d.append(h,el('p',details));card.append(d);}}
 const controls=el('div',undefined,'head');const b=el('button',pinned?'Remove from reading list':pins.includes(r)?'In reading list':'Add to reading list');b.disabled=!pinned&&pins.includes(r);
 b.onclick=()=>{pins=pinned?pins.filter(x=>x!==r):[...pins,r];render();};
 controls.append(link('Open original document ↗',r.url),b);card.append(controls);return card;
}
function render(){
 found=search(records,issues,{q:$('query').value,kind:$('kind').value,year:$('period').value,outcome:$('outcome').value});
 $('rows').replaceChildren(...found.slice(0,limit).map(r=>recordCard(r,false)));
 $('count').textContent=found.length+' matching published records. '+(found.length?'Open a document or save it to your reading list.':'Try a broader title, another year or all outcomes.');
 $('more').hidden=limit>=found.length;$('compare').hidden=!pins.length;
 $('pins').replaceChildren(...pins.map(r=>recordCard(r,true)));
}
async function start(){
 const [index,notes]=await Promise.all([data('./data/index.json'),data('./data/issues.json')]);records=index.records;issues=notes;
 $('edition').textContent=index.count+' published records · '+index.earliest+' to '+index.latest+' · Retrieved '+index.retrieved;
 select('kind',[['','All documents'],...uniq(records.map(r=>r.kind)).map(v=>[v,v])]);
 select('period',[['','All years'],...uniq(records.map(r=>r.published.slice(0,4))).reverse().map(v=>[v,v])]);
 select('outcome',[['','All records'],...uniq(Object.values(issues).flatMap(a=>a.issues.map(i=>i[1]))).map(v=>[v,v])]);
 $('query').value=new URLSearchParams(location.search).get('q')||'';
 for(const id of ['query','kind','period','outcome'])$(id).addEventListener('input',()=>{limit=20;render();});
 $('more').onclick=()=>{limit+=20;render();};$('export').onclick=()=>download('privacy-citations.txt',pins.map(citation).join('\n\n'),'text/plain;charset=utf-8');render();
}
start().catch(()=>{$('edition').textContent='Could not read this edition. Reload or open the OPC source below.';});
