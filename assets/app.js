const BRAND_LABELS={GE:"GE 医疗",SIEMENS:"西门子",PHILIPS:"飞利浦",UIH:"联影",CANON:"佳能"};
const FIELD_LABELS={kv:"管电压 kV",ma:"管电流 mAs",rotation_time:"旋转时间 s",pitch:"螺距 Pitch",collimation:"准直器",slice_thickness:"重建层厚 mm",recon_interval:"重建间隔 mm",kernel:"重建核 Kernel",asir_v:"迭代重建/剂量"};
const ORDER=["kv","ma","rotation_time","pitch","collimation","slice_thickness","recon_interval","kernel","asir_v"];
let DATA=[],CUR=null,CAT="全部";
const q=(s)=>document.querySelector(s);

function esc(s){return String(s==null?"":s).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));}

fetch("data/scan_protocols_complete.json").then(r=>r.json()).then(d=>{
  DATA=d.protocols||[];
  renderCats();renderList();
  if(DATA[0])select(DATA[0].id);
  q("#search").addEventListener("input",renderList);
}).catch(e=>{q("#detail").innerHTML="<p class='muted'>数据加载失败："+esc(e)+"</p>";});

function renderCats(){
  const cats=["全部",...Array.from(new Set(DATA.map(p=>p.category)))];
  q("#cats").innerHTML=cats.map(c=>`<button class="cat${c===CAT?" on":""}" data-c="${esc(c)}">${esc(c)}</button>`).join("");
  q("#cats").querySelectorAll(".cat").forEach(b=>b.onclick=()=>{CAT=b.dataset.c;renderCats();renderList();});
}
function renderList(){
  const s=(q("#search").value||"").toLowerCase();
  const list=DATA.filter(p=>(CAT==="全部"||p.category===CAT)&&(!s||(p.name+p.name_en+p.category+(p.indications||[]).join("")).toLowerCase().includes(s)));
  q("#plist").innerHTML=list.map(p=>`<li data-id="${esc(p.id)}" class="${CUR&&CUR.id===p.id?"on":""}">${esc(p.name)}<span class="en">${esc(p.name_en||"")}</span></li>`).join("")||"<li class='muted' style='cursor:default'>无匹配</li>";
  q("#plist").querySelectorAll("li[data-id]").forEach(li=>li.onclick=()=>select(li.dataset.id));
}
function select(id){CUR=DATA.find(p=>p.id===id);if(!CUR)return;renderList();renderDetail();}
function renderDetail(){
  const p=CUR;if(!p)return;
  const brands=Object.keys(p.parameters||{});
  const tags=[`<span class="tag">${esc(p.category)}</span>`,`<span class="tag">${esc(p.modality||"CT")}</span>`,p.contrast?'<span class="tag c">增强</span>':'<span class="tag">平扫</span>'];
  let head="<tr><th>参数</th>"+brands.map(b=>`<th class="brandcol">${esc(BRAND_LABELS[b]||b)}</th>`).join("")+"</tr>";
  let rows=ORDER.map(f=>{
    const cells=brands.map(b=>{const v=(p.parameters[b]||{})[f];return `<td>${v==null||v===""?"—":esc(v)}</td>`;}).join("");
    return `<tr><td class="rowname">${esc(FIELD_LABELS[f]||f)}</td>${cells}</tr>`;
  }).join("");
  q("#detail").innerHTML=`
    <h2>${esc(p.name)}</h2>
    <div class="sub">${esc(p.name_en||"")}</div>
    <div class="meta">${tags.join("")}${(p.indications||[]).map(i=>`<span class="tag">${esc(i)}</span>`).join("")}</div>
    <div class="kv">
      <div><b>体位：</b>${esc(p.position||"—")}</div>
      <div><b>呼吸：</b>${esc(p.breathing||"—")}</div>
      <div><b>扫描范围：</b>${esc(p.range||"—")}</div>
    </div>
    <table><thead>${head}</thead><tbody>${rows}</tbody></table>
    <p class="muted">参数为参考值，实际请以设备厂商官方手册与本单位协议为准。</p>`;
}

document.addEventListener("click",(e)=>{
  const t=e.target;
  if(t&&t.id==="copywx"){
    const wx="Zhuxiao0324";
    const done=()=>{t.textContent="已复制 ✓  微信："+wx;};
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(wx).then(done).catch(done);}else{done();}
  }
});
