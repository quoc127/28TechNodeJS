// Update quantity product in cart
const inputsQuantity = document.querySelectorAll("input[name='quantity']");
if (inputsQuantity.length > 0) {
  inputsQuantity.forEach((input) => {
    input.addEventListener("change", (e) => {
      const productId = input.getAttribute("product-id");
      const quantity = parseInt(input.value);
      console.log(typeof quantity);

      if (quantity > 0) {
        window.location.href = `/cart/update/${productId}/${quantity}`;
      }
      
    });
  });
}
// End update quantity product in cart
