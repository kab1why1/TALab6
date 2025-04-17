const m = 12;
const A = (Math.sqrt(5)-1)/2;
const R = 7;

let students = [];
let divisionTable = Array(m).fill(null);
let multiplicationTable = Array(m).fill(null);

function getKey(dob)
{ 
    const [y,mo,da]=dob.split('-').map(Number); 
    return y*10000+mo*100+da; 
}

function h1(key)
{ 
    const mo=Math.floor((key%10000)/100); 
    return mo % m; 
}

function h2(key)
{ 
    return R - (key % R); 
}

function insertLinear(student)
{ 
    const key=student.key; 
    let idx = h1(key);
    for(let i=0; i < m; i++ )
    { 
        const pos=(idx+i) % m;
        if(!divisionTable[pos])
        { 
            divisionTable[pos]=student; 
            return; 
        } 
    }
  }

function insertDouble(student)
{ 
    const key=student.key;
    const start=h1(key); 
    const step=h2(key);
    for(let i = 0; i < m; i++)
    { 
        const pos=(start + i * step) % m; 
        if(!multiplicationTable[pos])
        { 
            multiplicationTable[pos]=student; 
            return; 
        } 
    }
  }

function buildTables()
{ 
    divisionTable.fill(null); 
    multiplicationTable.fill(null);
    students.forEach(s=>{ insertLinear(s); insertDouble(s); }); 
}

function renderTable(tbl,id)
{ 
    const body=document.getElementById(id); body.innerHTML='';
    tbl.forEach((student, i) => 
    {
      const tr=document.createElement('tr');
      const tdBucket=document.createElement('td'); tdBucket.textContent = i+1;
      const tdStudent=document.createElement('td');
      const tdHash1=document.createElement('td');
      const tdHash2 = document.createElement('td');
      if(student)
        {
            tdStudent.textContent = `${student.name} (${student.dob})`;
            tdHash1.textContent = h1(student.key);
            if(id === 'multiplicationBody') tdHash2.textContent = h2(student.key);
        } else 
        {
            tdStudent.textContent = '-'; tdHash1.textContent = '-'; tdHash2.textContent = '-';
        }
        tr.append(tdBucket, tdStudent, tdHash1);
        if(id==='multiplicationBody') tr.appendChild(tdHash2);
        body.append(tr);
    });
  }

  function updateUI(){ buildTables();
    renderTable(divisionTable,'divisionBody'); renderTable(multiplicationTable,'multiplicationBody'); }

  function searchByName(){ const q=document.getElementById('searchInput').value.trim().toLowerCase();
    const ul=document.getElementById('searchResults'); ul.innerHTML=''; if(!q) return;
    const res=students.filter(s=>s.name.toLowerCase().includes(q));
    if(!res.length) ul.innerHTML='<li>Нічого не знайдено</li>';
    else res.forEach(s=>{ const li=document.createElement('li'); li.textContent=`${s.name} — ${s.dob}`; ul.append(li); }); }

  function filterByMonth(){ const mo=Number(document.getElementById('monthSelect').value);
    const ul=document.getElementById('monthResults'); ul.innerHTML=''; if(!mo) return;
    const res=students.filter(s=> (new Date(s.dob).getMonth()+1)===mo);
    if(!res.length) ul.innerHTML='<li>Немає студентів</li>';
    else res.forEach(s=>{ const li=document.createElement('li'); li.textContent=`${s.name} — ${s.dob}`; ul.append(li); }); }

  document.getElementById('addButton').addEventListener('click',()=>{
    const name=document.getElementById('nameInput').value.trim(); const dob=document.getElementById('dobInput').value;
    if(!name||!dob){ alert('Заповніть усі поля'); return; }
    students.push({name,dob,key:getKey(dob)});
    updateUI();
    document.getElementById('nameInput').value=''; document.getElementById('dobInput').value='';
  });
  document.getElementById('searchButton').addEventListener('click',searchByName);
  document.getElementById('filterButton').addEventListener('click',filterByMonth);

  updateUI();