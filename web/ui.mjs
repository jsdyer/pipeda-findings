export const $=id=>document.getElementById(id);
export function el(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;}
export function select(id,options){ const s=$(id),old=s.value;s.replaceChildren(...options.map(([v,t])=>new Option(t,v))); if(options.some(([v])=>v===old))s.value=old;}
export function link(text,href){const a=el('a',text);a.href=href;return a;}
export function stats(items){$('metrics').replaceChildren(...items.map(([label,value])=>{const c=el('div');c.append(el('strong',value,'metric'),el('span',label));return c;}));}
export function bars(target,items,fmt){const max=Math.max(0,...items.map(i=>Math.abs(i[1])));$(target).replaceChildren(...items.map(([label,value])=>{const row=el('div',undefined,'row'),track=el('div',undefined,'track'),fill=el('i',undefined,'fill');fill.style.width=(max?100*Math.abs(value)/max:0)+'%';track.append(fill);row.append(el('span',label),track,el('span',fmt(value),'number'));return row;}));}
export async function data(path){const response=await fetch(path);if(!response.ok)throw Error('Could not open source edition');return response.json();}
export function download(name,content,type='text/csv;charset=utf-8'){const url=URL.createObjectURL(new Blob([content],{type}));const a=link(name,url);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export function toCsv(rows){return rows.map(row=>row.map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(',')).join('\r\n')+'\r\n';}
export const number=n=>n.toLocaleString('en-CA');