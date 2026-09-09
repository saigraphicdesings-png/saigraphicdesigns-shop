import './style.css'

const ASSET_ROOT = 'https://raw.githubusercontent.com/saigraphicdesings-png/saigraphicdesigns/main/'
const WHATSAPP = '916381128781'
const CART_KEY = 'saiGraphicShopCart'

const products = [
  { id:'card-01', name:'Premium Business Card 01', price:99, group:'business', format:'CDR', image:'Images/Shop/business-card-01/3.jpg' },
  { id:'card-02', name:'Premium Business Card 02', price:99, group:'business', format:'CDR', image:'Images/Shop/business-card-02/1.jpg' },
  { id:'card-03', name:'Premium Business Card 03', price:99, group:'business', format:'CDR', image:'Images/Shop/business-card-03/1.jpg' },
  { id:'card-04', name:'Premium Business Card 04', price:99, group:'business', format:'CDR', image:'Images/Shop/business-card-04/1.jpg' },
  { id:'card-05', name:'Premium Business Card 05', price:99, group:'business', format:'CDR', image:'Images/Shop/business-card-05/1.jpg' },
  { id:'bundle-01', name:'4 Business Card Bundle 01', price:0, group:'business', format:'CDR', image:'Images/Shop/business-card-Bundel-01/1.jpg', download:'https://drive.google.com/file/d/1OR4JnPjFzQgT0BNh1MFFVV21HdG8ybNT/view?usp=sharing' },
  { id:'bundle-02', name:'4 Business Card Bundle 02', price:0, group:'business', format:'CDR', image:'Images/Shop/business-card-Bundel-02/1.jpg' },
  { id:'letter-01', name:'Letterhead Template 01', price:0, group:'letterhead', format:'CDR', image:'Images/Shop/Letter-head-01/1.jpg' },
  { id:'letter-02', name:'Letterhead Template 02', price:0, group:'letterhead', format:'CDR', image:'Images/Shop/Letter-head-02/1.jpg' },
  { id:'letter-03', name:'Letterhead Template 03', price:0, group:'letterhead', format:'CDR', image:'Images/Shop/Letter-head-03/1.jpg' }
].map(product => ({ ...product, image: ASSET_ROOT + product.image }))

let cart = []
try {
  const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
  cart = Array.isArray(saved) ? saved : []
} catch (error) {
  cart = []
}

const $ = selector => document.querySelector(selector)
const shell = $('#shopShell')
shell.classList.add('is-visible')
const store = $('#storePanel')
const cartPanel = $('#cartPanel')
const backdrop = $('#panelBackdrop')
const productGrid = $('#productGrid')
const cartList = $('#cartList')
const cartCount = $('#cartCount')
const cartTotal = $('#cartTotal')

function setPanel(panel) {
  store.classList.add('open')
  cartPanel.classList.toggle('open', panel === 'cart')
  backdrop.classList.toggle('open', panel === 'cart')
  store.setAttribute('aria-hidden', 'false')
  cartPanel.setAttribute('aria-hidden', panel === 'cart' ? 'false' : 'true')
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  renderCart()
}

function renderProducts(filter = 'all') {
  const visible = products.filter(product => {
    if (filter === 'all') return true
    if (filter === 'free') return product.price === 0
    if (filter === 'paid') return product.price > 0
    return product.group === filter
  })
  productGrid.innerHTML = visible.map(product => `
    <article class="product-card ${product.price === 0 ? 'free' : ''}">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <div class="product-card-body">
        <small>${product.group === 'business' ? 'Business Card' : 'Letterhead'} · ${product.format}</small>
        <h3>${product.name}</h3>
        <div class="product-card-footer">
          <strong>${product.price === 0 ? 'FREE' : '₹' + product.price}</strong>
          <button type="button" data-product="${product.id}">${product.price === 0 ? 'Get Free' : 'Add to Cart'}</button>
        </div>
      </div>
    </article>`).join('')
}

function renderCart() {
  cartCount.textContent = String(cart.length)
  const total = cart.reduce((sum, item) => sum + item.price, 0)
  cartTotal.textContent = '₹' + total.toLocaleString('en-IN')
  cartList.innerHTML = cart.length ? cart.map(item => `
    <div class="cart-row">
      <img src="${item.image}" alt="">
      <div><h3>${item.name}</h3><p>₹${item.price}</p></div>
      <button type="button" data-remove="${item.id}" aria-label="Remove ${item.name}">×</button>
    </div>`).join('') : '<p class="cart-empty">Your cart is ready for something beautiful.</p>'
}

function openWhatsApp(product) {
  const linkText = product.download ? '\n\nDownload link: ' + product.download : '\n\nPlease send me the Google Drive download link.'
  const message = 'Hello Sai Graphic Designs 👋\n\nI would like to get this free design template:\n\nTemplate: ' + product.name + '\nCategory: Printing Designs\nPrice: FREE' + linkText + '\n\nThank you!'
  window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer')
}

document.addEventListener('click', event => {
  const productButton = event.target.closest('[data-product]')
  const removeButton = event.target.closest('[data-remove]')
  if (productButton) {
    const product = products.find(item => item.id === productButton.dataset.product)
    if (!product) return
    if (product.price === 0) {
      openWhatsApp(product)
      return
    }
    if (!cart.some(item => item.id === product.id)) cart.push(product)
    saveCart()
    setPanel('cart')
  }
  if (removeButton) {
    cart = cart.filter(item => item.id !== removeButton.dataset.remove)
    saveCart()
  }
})

$('#browseButton')?.addEventListener('click', () => setPanel('store'))
$('#cartButton').addEventListener('click', () => setPanel('cart'))
$('#closeStore')?.addEventListener('click', () => setPanel('store'))
$('#closeCart').addEventListener('click', () => setPanel(null))
backdrop.addEventListener('click', () => setPanel(null))
document.addEventListener('keydown', event => { if (event.key === 'Escape') setPanel(null) })
$('#storeFilters').addEventListener('click', event => {
  const button = event.target.closest('[data-filter]')
  if (!button) return
  document.querySelectorAll('#storeFilters button').forEach(item => item.classList.toggle('active', item === button))
  renderProducts(button.dataset.filter)
})
$('#checkoutButton').addEventListener('click', () => {
  if (!cart.length) return
  const lines = cart.map((item, index) => (index + 1) + '. ' + item.name + ' – ₹' + item.price).join('\n')
  const total = cart.reduce((sum, item) => sum + item.price, 0)
  const message = 'Hello Sai Graphic Designs 👋\n\nI would like to order:\n\n' + lines + '\n\nTotal: ₹' + total.toLocaleString('en-IN')
  window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer')
})

renderProducts()
renderCart()
setPanel('store')
