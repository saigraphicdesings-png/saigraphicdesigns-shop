import './style.css'

const ASSET_ROOT='https://raw.githubusercontent.com/saigraphicdesings-png/saigraphicdesigns/main/'
const WHATSAPP='916381128781'
const CART_KEY='saiGraphicShopCart'
const products=[
 {id:'card-01',name:'Premium Business Card 01',price:99,group:'business',format:'CDR',image:'Images/Shop/business-card-01/3.jpg'},
 {id:'card-02',name:'Premium Business Card 02',price:99,group:'business',format:'CDR',image:'Images/Shop/business-card-02/1.jpg'},
 {id:'card-03',name:'Premium Business Card 03',price:99,group:'business',format:'CDR',image:'Images/Shop/business-card-03/1.jpg'},
 {id:'card-04',name:'Premium Business Card 04',price:99,group:'business',format:'CDR',image:'Images/Shop/business-card-04/1.jpg'},
 {id:'card-05',name:'Premium Business Card 05',price:99,group:'business',format:'CDR',image:'Images/Shop/business-card-05/1.jpg'},
 {id:'bundle-01',name:'4 Business Card Bundle 01',price:0,group:'business',format:'CDR',image:'Images/Shop/business-card-Bundel-01/1.jpg',download:'https://drive.google.com/file/d/1OR4JnPjFzQgT0BNh1MFFVV21HdG8ybNT/view?usp=sharing'},
 {id:'bundle-02',name:'4 Business Card Bundle 02',price:0,group:'business',format:'CDR',image:'Images/Shop/business-card-Bundel-02/1.jpg'},
 {id:'letter-01',name:'Professional Letterhead 01',price:0,group:'letterhead',format:'CDR',image:'Images/Shop/Letter-head-01/1.jpg'},
 {id:'letter-02',name:'Professional Letterhead 02',price:0,group:'letterhead',format:'CDR',image:'Images/Shop/Letter-head-02/1.jpg'},
 {id:'letter-03',name:'Professional Letterhead 03',price:0,group:'letterhead',format:'CDR',image:'Images/Shop/Letter-head-03/1.jpg'}
].map(p=>({...p,image:ASSET_ROOT+p.image}))
let cart=[];try{const saved=JSON.parse(localStorage.getItem(CART_KEY)||'[]');cart=Array.isArray(saved)?saved:[]}catch(e){cart=[]}
const $=s=>document.querySelector(s),grid=$('#productGrid'),featured=$('#featuredGrid'),cartPanel=$('#cartPanel'),backdrop=$('#panelBackdrop'),cartList=$('#cartList'),cartCount=$('#cartCount'),cartTotal=$('#cartTotal')
function productCard(p){return `<article class="product-card ${p.price===0?'free':''}"><img src="${p.image}" alt="${p.name}" loading="lazy"><div class="product-body"><small>${p.group==='business'?'Business Card':'Letterhead'} · ${p.format}</small><h3>${p.name}</h3><div class="product-footer"><strong>${p.price===0?'FREE':'₹'+p.price}</strong><button type="button" data-product="${p.id}">${p.price===0?'Get Free':'Add to Cart'}</button></div></div></article>`}
function renderProducts(filter='all'){const shown=products.filter(p=>filter==='all'||filter==='free'&&p.price===0||filter==='paid'&&p.price>0||p.group===filter);grid.innerHTML=shown.map(productCard).join('')}
function renderFeatured(){featured.innerHTML=[products[0],products[5],products[7]].map(p=>`<figure class="featured-card"><img src="${p.image}" alt="${p.name}"><figcaption>${p.name}</figcaption></figure>`).join('')}
function renderCart(){cartCount.textContent=cart.length;cartTotal.textContent='₹'+cart.reduce((s,p)=>s+p.price,0).toLocaleString('en-IN');cartList.innerHTML=cart.length?cart.map(p=>`<div class="cart-row"><img src="${p.image}" alt=""><div><h3>${p.name}</h3><p>₹${p.price}</p></div><button type="button" data-remove="${p.id}" aria-label="Remove ${p.name}">Remove</button></div>`).join(''):'<p class="cart-empty">Your cart is ready for something beautiful.</p>'}
function saveCart(){localStorage.setItem(CART_KEY,JSON.stringify(cart));renderCart()}
function toggleCart(open){cartPanel.classList.toggle('open',open);backdrop.classList.toggle('open',open);document.body.classList.toggle('cart-open',open);cartPanel.setAttribute('aria-hidden',open?'false':'true')}
function openWhatsApp(p){const link=p.download?'\n\nDownload link: '+p.download:'\n\nPlease send me the Google Drive download link.';const msg='Hello Sai Graphic Designs 👋\n\nI would like to get this free design template:\n\nTemplate: '+p.name+'\nCategory: Printing Designs\nPrice: FREE'+link+'\n\nThank you!';window.open('https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(msg),'_blank','noopener,noreferrer')}
document.addEventListener('click',e=>{const add=e.target.closest('[data-product]'),remove=e.target.closest('[data-remove]');if(add){const p=products.find(x=>x.id===add.dataset.product);if(!p)return;if(p.price===0)return openWhatsApp(p);if(!cart.some(x=>x.id===p.id))cart.push(p);saveCart();toggleCart(true)}if(remove){cart=cart.filter(x=>x.id!==remove.dataset.remove);saveCart()}})
$('#cartButton').addEventListener('click',()=>toggleCart(true));$('#closeCart').addEventListener('click',()=>toggleCart(false));backdrop.addEventListener('click',()=>toggleCart(false));document.addEventListener('keydown',e=>{if(e.key==='Escape')toggleCart(false)})
$('#storeFilters').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;document.querySelectorAll('#storeFilters button').forEach(x=>x.classList.toggle('active',x===b));renderProducts(b.dataset.filter)})
function chooseFilter(filter){const b=document.querySelector(`[data-filter="${filter}"]`);if(b)b.click();document.querySelector('#templates').scrollIntoView({behavior:'smooth'})}
document.querySelectorAll('[data-jump-filter]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();chooseFilter(a.dataset.jumpFilter)}));$('#showFree').addEventListener('click',()=>chooseFilter('free'))
$('#checkoutButton').addEventListener('click',()=>{if(!cart.length)return;const lines=cart.map((p,i)=>`${i+1}. ${p.name} – ₹${p.price}`).join('\n');const total=cart.reduce((s,p)=>s+p.price,0);window.open('https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent('Hello Sai Graphic Designs 👋\n\nI would like to order:\n\n'+lines+'\n\nTotal: ₹'+total.toLocaleString('en-IN')),'_blank','noopener,noreferrer')})
renderFeatured();renderProducts();renderCart()
