const fs=require('fs'),path=require('path');const root=__dirname;
const pages=['index.html','overview.html','product.html','stories/index.html',...Array.from({length:5},(_,i)=>`stories/us${i+1}.html`),'prototype.html','delivery.html','qa.html'];
const svg=body=>`<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
const icons=[svg('<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>'),svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>')];
const transform=s=>s.replace(/Q&amp;As/g,'Q&amp;A').replace(/Q&As/g,'Q&A').replace(/<span class="badge decision-status[^>]*>[\s\S]*?<\/span>/g,'').replace('Home Page context','Illustrative Reference');
for(const file of pages){let s=transform(fs.readFileSync(path.join(root,file),'utf8'));const prefix=file.startsWith('stories/')?'../':'';s=s.replace('</head>',`<link rel="stylesheet" href="${prefix}dark.css"></head>`);if(file==='index.html')s=s.replace(/<p class="cover-credit">[\s\S]*?<\/p>/,'');else s=s.replace('<body ','<body class="dark-ui" ');if(file==='product.html'){let i=0;s=s.replace(/<span class="tile-symbol" aria-hidden="true">[^<]*<\/span>/g,m=>i<2?`<span class="tile-symbol" aria-hidden="true">${icons[i++]}</span>`:m)}fs.writeFileSync(path.join(root,file),s)}
const story=path.join(root,'story-data.js');
// Story data is serialized JSON; remove status badges from the decoded HTML too.
const raw=fs.readFileSync(story,'utf8');const data=JSON.parse(raw.slice(raw.indexOf('=')+1).replace(/;\s*$/,''));for(const id in data)data[id]=transform(data[id]);fs.writeFileSync(story,'window.storyContent='+JSON.stringify(data)+';');
console.log('Applied v6 dark design and requested presentation edits');
