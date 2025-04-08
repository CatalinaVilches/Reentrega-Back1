const botones = document.querySelectorAll('.addCart');
const addToCart = async (id, buttonElement) => {
    try {
        const quantity = parseInt(buttonElement.closest('.descripciones').querySelector('.quantityP').value);
        if (quantity <= 0) {
            alert('La cantidad debe ser mayor a 0');
            return;
        }
        const idCart = buttonElement.parentElement.querySelector('#cartId').value;
        const response = await fetch(`/api/carts/${idCart}/products/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quantity: quantity
            })

        });

        if (response.ok) {
            const data = await response.json();
            console.log('Producto agregado al carrito:', data);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "producto agregado correctamente",
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            console.error('Error al agregar el producto al carrito');
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Upps!, no se pudo añadir el producto",
                showConfirmButton: false,
                timer: 1500
            });
        }

    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
    }
}

const createCart = async () => {
    try {
        const response = await fetch('/api/carts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const data = await response.json();
            alert('Carrito creado:', data);
        } else {
            console.error('Error al crear el carrito');
        }

        window.location.reload();
    } catch (error) {
        console.error('Error al crear el carrito:', error);
    }
}

const deleteCart = async (id) => {
    try {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });

        const result = await swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true
        });

        if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire(
                "Cancelled",
                "Your cart items are safe :)",
                "error"
            );
            return;
        }
        const response = await fetch(`/api/carts/${id}`, {
            method: 'DELETE'
        });
        if (response.status === 400) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "No hay productos a eliminar",
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        const resultData = await response.json();
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: `Productos eliminados correctamente del carrito ${resultData._id}`,
            showConfirmButton: false,
            timer: 1500
        });

    } catch (error) {
        // 4. Manejo de errores en caso de falla en el servidor
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Ocurrió un error al intentar eliminar el carrito",
            showConfirmButton: false,
            timer: 1500
        });
        console.error('Error al eliminar el carrito:', error);
    }
}

const deleteProduct = async (cid,pid) => {
    try {
        const response = await fetch(`/api/carts/${cid}/products/${pid}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Producto eliminado del carrito:', data);
        } else {
            console.error('Error al eliminar el producto del carrito');
        }
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
    }

    window.location.reload();
}