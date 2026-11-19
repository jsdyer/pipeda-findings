export function search(records,annotations,{q='',kind='',year='',outcome=''}){
 const needle=q.toLocaleLowerCase().trim();
 return records.filter(r=>{
  const a=annotations[r.id];
  return (!kind||r.kind===kind)&&(!year||r.published.startsWith(year))&&(!outcome||a?.issues.some(i=>i[1]===outcome))&&(!needle||[r.title,r.id,r.kind,a?.org,...(a?.issues.flat()||[])].filter(Boolean).some(s=>s.toLocaleLowerCase().includes(needle)));
 });
}
export function citation(r){return [r.title,r.kind+(r.id?' #'+r.id:''),'Published '+r.published,r.findingDate?'Findings dated '+r.findingDate:'',r.url].filter(Boolean).join('\n');}
