const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal =document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const adressWarn = document.getElementById("address-warn")

//Abrir o modal do carrinho 
cartBtn.addEventListener("click", function() {
    updataCartModal();
    cartModal.classList.remove("hidden"); // Remover a classe 'hidden'
    cartModal.style.display = "flex"; // Exibir o modal com flexbox
});
  
// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

let cart = [];

menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price")) //quando usa a parseFloat ele já retorna um número que será o valor do produto
        // função addcionar carrinho
        addToCart(name, price)
    }

    
})

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        //Se o item já existe, aumenta apenas a quantidade + 1
        existingItem.quantity += 1;

    } else {
        cart.push({

            name: name,
            price: price,
            quantity: 1
        });
    }

    updataCartModal()
}


//Atualiza o carrinho

function updataCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
         <div class="flex items-center justify-between">
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

            
            <button class="remove-from-cart-btn" data-name="${item.name}">
              Remover
            </button>
            

         </div>
        `
        
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    cartCounter.innerHTML = cart.length;

}

// Função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function (event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        
        if(item.quantity > 1){
            item.quantity -= 1;
            updataCartModal();   // O updataCartModal aparece nesta função pq atualizar a lista de carrinho 
            return;
        }

        cart.splice(index, 1);  //splice tem a função de remover o objeto da lista 
        updataCartModal();
    }
}

//Endereço
addressInput.addEventListener("input" , function(event){
    let inputValue = event.target.valvue;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        adressWarn.classList.add("hidden")
    }
    updataCartModal();
})

//Finalizar pedido
checkoutBtn.addEventListener("click", function() {

    const isoOpen = checkRestaurantOpen();
    if(!isoOpen){

        Toastify({
            text: "No momento não estamos funcionado",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast();

        return;
    }


    if (cart.length === 0) return;
    if (addressInput.value === "") {
        adressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }
    
    // Gera a lista de itens do carrinho
    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: (${item.quantity}) 
              Preço: R$${item.price.toFixed(2)} `
        );
    }).join("\n");

    // Calcula o valor total do carrinho
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    
    // Gera a mensagem completa, incluindo os itens e o valor total
    const message = encodeURIComponent(
        `Pedido:\n${cartItems}\n\nTotal: R$${total.toFixed(2)}\n\nEndereço: ${addressInput.value}`
    );

    // Número do telefone do restaurante
    const phone = "61981500971";
    
    // Abre o WhatsApp com a mensagem gerada
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    // Limpa o carrinho e atualiza a interface
    cart = [];
    updataCartModal();
});


// Verificar a hora atual e manipular o card horário
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    const minutos = data.getMinutes();

    // Define o horário de abertura e fechamento (ex.: das 18:00 às 22:30)
    const horaAbertura = 18;
    const horaFechamento = 23;
    const minutoFechamento = 30;

    // Verifica se está dentro do horário de funcionamento
    return (hora > horaAbertura || (hora === horaAbertura && minutos >= 0)) &&
           (hora < horaFechamento || (hora === horaFechamento && minutos < minutoFechamento));
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}
