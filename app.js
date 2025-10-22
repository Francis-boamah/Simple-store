// ----- CONFIG / PRODUCTS -----
const PRODUCTS = [
  { id: 'apple', name: 'Apple', price: 1.00 },
  { id: 'bread', name: 'Bread', price: 2.30 },
  { id: 'milk', name: 'Milk', price: 1.50 }
];
// Replace these with your EmailJS values (instructions below)
const EMAILJS_SERVICE_ID = 'service_439nqum';
const EMAILJS_TEMPLATE_ID = 'template_u1gjjhb';
const EMAILJS_USER_ID = 'T3iajj2ahm3C__xNW'; // sometimes called Public Key

// ----- UI references -----
const productsDiv = document.getElementById('products');
const toCheckoutBtn = document.getElementById('toCheckout');
const checkoutScreen = document.getElementById('checkout-screen');
const productsScreen = document.getElementById('products-screen');
const summaryDiv = document.getElementById('summary');
const phoneInput = document.getElementById('phone');
const houseInput = document.getElementById('house');
const roomInput = document.getElementById('room');
const submitOrderBtn = document.getElementById('submitOrder');
const backBtn = document.getElementById('backToProducts');

// render product list with quantity inputs
function renderProducts(){
  productsDiv.innerHTML = '';
  PRODUCTS.forEach(p=>{
    const el = document.createElement('div');
    el.className = 'product';
    el.innerHTML = `
      <div>
        <strong>${p.name}</strong><div>GHS ${p.price.toFixed(2)}</div>
      </div>
      <div>
        <input type="number" min="0" value="0" id="qty_${p.id}" />
      </div>
    `;
    productsDiv.appendChild(el);
  });
}
renderProducts();

// gather selected items (qty>0)
function gatherSelected(){
  const items = [];
  PRODUCTS.forEach(p=>{
    const q = Number(document.getElementById(`qty_${p.id}`).value || 0);
    if(q>0) items.push({ id:p.id, name:p.name, price:p.price, qty:q });
  });
  return items;
}

// switch screens
function showCheckout(){
  const items = gatherSelected();
  if(items.length===0){ alert('Select at least one item.'); return; }
  productsScreen.classList.add('hidden');
  checkoutScreen.classList.remove('hidden');
  renderSummary(items);
}
function showProducts(){
  checkoutScreen.classList.add('hidden');
  productsScreen.classList.remove('hidden');
}

// show summary on checkout screen
function renderSummary(items){
  let html = '<ul>';
  items.forEach(it=> html += `<li>${it.name} x ${it.qty} = GHS ${(it.price*it.qty).toFixed(2)}</li>`);
  html += '</ul>';
  summaryDiv.innerHTML = html;
}

// EmailJS init
(function(){ emailjs.init(EMAILJS_USER_ID); })();

// submit order
async function submitOrder(){
  const items = gatherSelected();
  if(items.length===0){ alert('No items selected'); return; }
  const phone = phoneInput.value.trim();
  const house = houseInput.value.trim();
  const room = roomInput.value.trim();
  if(!phone || !house || !room){ alert('Please fill phone, house and room'); return; }

  const orderPayload = {
    items: items,
    phone: phone,
    house: house,
    room: room,
    time: new Date().toString()
  };

  // EmailJS template params: change keys to match your template
  const templateParams = {
    order_json: JSON.stringify(orderPayload, null, 2),
    phone: phone,
    house: house,
    room: room
  };

  try{
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    alert('Order sent. Thank you!');
    // reset quantities and go back
    PRODUCTS.forEach(p=> document.getElementById(`qty_${p.id}`).value = 0);
    phoneInput.value=''; houseInput.value=''; roomInput.value='';
    showProducts();
  }catch(err){
    console.error(err);
    alert('Failed to send order — check console or Internet connection.');
  }
}

// UI bindings
toCheckoutBtn.addEventListener('click', showCheckout);
backBtn.addEventListener('click', showProducts);
submitOrderBtn.addEventListener('click', submitOrder);

