// elements do DOM


const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCount = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");





// array na list do cart

let cart = []

//acessar o carrinho em veja o meu carrinho 

//abrir modal na tela
cartBtn.addEventListener("click", function(){

    cartModal.style.display = 'flex';

    updateCartModal()
});


//fechar modal da tela em clique fora do modal se possivel 


cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none";
    }
});


//fechar o modal atraves do botão fechar dentro do modal carrinho


closeModalBtn.addEventListener("click", function(){
    cartModal.style.display ="none"
})



//evento  de acessar e adicionar no carrinho os itens do menu 

menu.addEventListener("click", function(event){

    

    let parentButton = event.target.closest(".add-to-cart-bnt");
 


    if(parentButton){
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        //adicionar no carrinho 

        addToCart(name, price)
    }

    
})


//função para adicionar o item no carrinho 


function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)


    if(existingItem){
        //se  o item ja existe. aumenta apenas a quantidade

        existingItem.quantity += 1;
        
    }else{

        cart.push({
            name,
            price,
            quantity: 1
        })

    }


    updateCartModal()
 
}

//atualiza o carrinho ao adicionar o item


function updateCartModal(){

    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item =>{

        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")


        cartItemElement.innerHTML = `
        
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$: ${item.price.toFixed(2)}</p>
                
                
                </div>

              
                    <button class="remove-form-cart-btn"  data-name="${item.name}">
                        remover
                    </button>
               
            </div>
        
        
        
        `

        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElement);
    })


    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCount.innerHTML = cart.length;

}



cartItemsContainer.addEventListener("click", function(event){

    if(event.target.classList.contains("remove-form-cart-btn")){
        const name = event.target.getAttribute("data-name")

        

        removeItemsCart(name)
    }
});



function removeItemsCart(name){
    const index = cart.findIndex(item => item.name === name);


    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;

        }

        cart.splice(index, 1);
        updateCartModal();
    }
}



//parte de input para digitar 

addressInput.addEventListener("click", function(event){

    let inputValue = event.target.value;

    //

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden")

    }
});


//finalizar o pedido com endereço e aviso se não for colocado o endereço

checkoutBtn.addEventListener("click", function(){

        //alert casa o restaurante esteja fechado 
    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        
        Toastify({
            text: "O restaurante esta fechdo, Porfavor aguarde abrir.",
            duration: 4000,
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
        

    if(cart.length === 0) return;

    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }


    //enviar api para o Whats

    const cartItems = cart.map((item) =>{
        return(
            `
            ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |
            
            
            `
        )
    }).join("")

    const message = encodeURIComponent(cartItems);
    const phone = "959555432"
 
    //processo de entrad do api whatssap
    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value} `, "_blank")

    cart = [];
    updateCartModal();
})



//verificar  a hora e manipular o card de horario 


function checkRestaurantOpen(){

    const data = new Date();
    const hora = data.getHours();
    return hora >= 17 && hora < 22; // true = restaurante  está aberto 

}





const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}