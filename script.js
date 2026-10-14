const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2200)};
const side=$('#side'),scrim=$('#scrim');
const setMenu=o=>{side.classList.toggle('open',o);scrim.classList.toggle('show',o)};
$('#menu').onclick=()=>setMenu(true);scrim.onclick=()=>setMenu(false);
const PAGES={'Dashboard':'My Courses','All Courses':'All Courses'};

function show(name){
  $$('.nav a').forEach(a=>a.classList.toggle('active',a.dataset.t===name));
  const exists=name in PAGES;
  $('#title').textContent=exists?PAGES[name]:'404 Not Found';
  $('#view-courses').hidden=!exists;
  $('#view-404').hidden=exists;
  $('#search').hidden=!exists;
  if(!exists){$('#nf-name').textContent=name;sb.classList.remove('open');$('#q').value='';apply()}
}
$$('.nav a').forEach(a=>a.onclick=e=>{e.preventDefault();show(a.dataset.t);setMenu(false)});
$('#nf-back').onclick=()=>show('Dashboard');

const sb=$('#search');
$('#sbtn').onclick=()=>{sb.classList.toggle('open');if(sb.classList.contains('open'))$('#q').focus();else{$('#q').value='';apply()}};
$('#bell').onclick=()=>{$('#dot').style.display='none';toast('You have no new notifications')};

function apply(){
  const q=$('#q').value.trim().toLowerCase(),f={};
  $$('[data-f]').forEach(s=>f[s.dataset.f]=s.value);
  let n=0;
  $$('.card').forEach(c=>{
    const ok=c.querySelector('h3').textContent.toLowerCase().includes(q)&&Object.keys(f).every(k=>!f[k]||c.dataset[k]===f[k]);
    c.hidden=!ok;n+=ok;
  });
  $('#empty').hidden=n>0;
}
$('#q').oninput=apply;$$('[data-f]').forEach(s=>s.onchange=apply);
$$('.go').forEach(b=>b.onclick=()=>toast('Opening '+b.closest('.card').querySelector('h3').textContent+'…'));

const M=['January','February','March','April','May','June','July','August','September','October','November','December'];
let cur=new Date(2025,11,1),start=new Date(2025,11,11),end=new Date(2025,11,14),picking=false;
const key=(y,m,d)=>new Date(y,m,d).getTime();
function cal(){
  const y=cur.getFullYear(),m=cur.getMonth(),today=new Date();
  $('#mon').textContent=M[m]+' '+y;
  let h=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=>`<div class="dn">${d}</div>`).join('');
  const off=(new Date(y,m,1).getDay()+6)%7,len=new Date(y,m+1,0).getDate();
  h+='<div></div>'.repeat(off);
  for(let d=1;d<=len;d++){
    const k=key(y,m,d),s=k===start.getTime(),e=end&&k===end.getTime();
    const inr=end&&k>=start.getTime()&&k<=end.getTime();
    const cls=[inr?'in':'',s||e||(!end&&s)?'pick':'',inr&&(s||(off+d-1)%7===0)?'s':'',inr&&(e||(off+d-1)%7===6||d===len)?'e':'',
      today.getFullYear()===y&&today.getMonth()===m&&today.getDate()===d?'today':''].join(' ');
    h+=`<button class="${cls}" data-d="${d}" aria-label="${d} ${M[m]} ${y}"><span>${d}</span></button>`;
  }
  $('#days').innerHTML=h;
}
$('#days').onclick=e=>{const b=e.target.closest('button');if(!b)return;
  const k=new Date(cur.getFullYear(),cur.getMonth(),+b.dataset.d);
  if(!picking){start=k;end=null;picking=true}else{if(k<start){end=start;start=k}else end=k;picking=false;
    toast(`Selected ${start.toDateString().slice(4,10)} – ${end.toDateString().slice(4,10)}`)}
  cal()};
$('#prev').onclick=()=>{cur.setMonth(cur.getMonth()-1);cal()};
$('#next').onclick=()=>{cur.setMonth(cur.getMonth()+1);cal()};
cal();

const U=[['Sophia Chen','1094882001','#8d5a4a','sophia'],['James Miller','1094672000','#4a5568','james'],['Isabella Garcia','1094342003','#b0705a','isabella'],['William Brown','1094662002','#6b7c5e','william'],['Olivia Martin','1094552004','#9a6b8a','olivia'],['Noah Davis','1094442005','#5a7d9a','noah']];
// Photos live in images/avatars/. To use a real photo, drop it in that folder and change the extension/name below.
const avatar=u=>`<span class="av" style="background:${u[2]}" aria-label="${u[0]}"><img src="Avatar/isa${u[3]}.jpg" alt="" onerror="this.remove()">${u[0].split(' ').map(x=>x[0]).join('')}</span>`;
let all=false;
function users(){
  $('#ou').innerHTML=(all?U:U.slice(0,4)).map(u=>`<li>${avatar(u)}<div class="nm">${u[0]}<small>${u[1]}</small></div><i title="Online"></i></li>`).join('');
  $('#all').textContent=all?'Show less':'See all';
}
$('#all').onclick=()=>{all=!all;users()};users();