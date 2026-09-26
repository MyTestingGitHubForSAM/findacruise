(()=>{
const enter=document.getElementById('expand-prototype'),modal=document.getElementById('prototype-fullscreen');if(!enter||!modal)return;
const demo=document.getElementById('prototype-demo'),reset=document.getElementById('reset-prototype'),exit=document.getElementById('exit-prototype-fullscreen');let demoAnchor,resetAnchor,scroll=0,closing=false,native=false;
function restore(){if(!modal.open||closing)return;closing=true;demoAnchor.replaceWith(demo);resetAnchor.replaceWith(reset);modal.close();document.body.classList.remove('prototype-expanded');window.scrollTo(0,scroll);enter.focus({preventScroll:true});native=false;closing=false;window.dispatchEvent(new Event('resize'));}
async function close(){if(document.fullscreenElement===modal){try{await document.exitFullscreen()}catch{}}restore();}
enter.addEventListener('click',()=>{scroll=window.scrollY;demoAnchor=document.createComment('prototype-position');resetAnchor=document.createComment('reset-position');demo.replaceWith(demoAnchor);reset.replaceWith(resetAnchor);modal.append(demo);modal.querySelector('.fullscreen-controls').prepend(reset);document.body.classList.add('prototype-expanded');modal.showModal();modal.scrollTop=0;exit.focus();window.dispatchEvent(new Event('resize'));if(modal.requestFullscreen){modal.requestFullscreen().then(()=>{native=true;if(!modal.open&&document.fullscreenElement===modal)document.exitFullscreen().catch(()=>{});window.dispatchEvent(new Event('resize'));}).catch(()=>{});}});
exit.addEventListener('click',close);
modal.addEventListener('cancel',e=>{e.preventDefault();close()});
modal.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close()}},true);
document.addEventListener('fullscreenchange',()=>{if(document.fullscreenElement===modal)native=true;else if(native)restore()});
})();
