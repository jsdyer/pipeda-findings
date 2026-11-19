import test from 'node:test';
import assert from 'node:assert/strict';
import {search,citation} from '../web/model.mjs';
test('an outcome belongs to its reviewed issue and a missing annotation stays searchable',()=>{
 const rows=[{title:'Access to records',id:'2026-001',kind:'Finding',published:'2026-01-04',url:'https://www.priv.gc.ca/'},{title:'Unannotated entry',id:'',kind:'Letter',published:'2026-01-06',url:'https://www.priv.gc.ca/'}];
 const a={'2026-001':{org:'Respondent',issues:[['Timing','Resolved','Timing issue']]}};
 assert.equal(search(rows,a,{outcome:'Resolved'}).length,1);assert.equal(search(rows,a,{q:'unannotated'}).length,1);assert(citation(rows[0]).includes('2026-001'));
});
