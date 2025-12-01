// ---- Пошук та фільтрація ----
export const findProduct = (products, id) => {
    if (!Array.isArray(products) || !Number.isFinite(id)) {
        return undefined;
    }
    return products.find((p) => p.id === id);
};
export const filterByPrice = (products, maxPrice) => {
    if (!Array.isArray(products) || !Number.isFinite(maxPrice)) {
        return [];
    }
    return products.filter((p) => p.price <= maxPrice);
};
// ---- Кошик ----
export const addToCart = (cart, product, quantity) => {
    if (quantity <= 0 || !product) {
        console.warn("addToCart: некоректні дані");
        return cart;
    }
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    if (existingIndex === -1) {
        return [...cart, { product, quantity }];
    }
    const cloned = cart.map((item) => (Object.assign({}, item)));
    cloned[existingIndex].quantity += quantity;
    return cloned;
};
export const calculateTotal = (cart) => {
    return cart.reduce((sum, item) => {
        if (!item.product.inStock || item.quantity <= 0) {
            return sum;
        }
        if (item.product.price < 0) {
            return sum;
        }
        return sum + item.product.price * item.quantity;
    }, 0);
};
// ---- Тестові дані ----
const phones = [
    {
        id: 10,
        name: "SmartPhone Lite",
        price: 9000,
        inStock: true,
        description: "Базовий смартфон із камерою 48Мп",
        category: "electronics",
        power: 15,
        brand: "LiteTech",
        isPortable: true
    },
    {
        id: 11,
        name: "Laptop Air",
        price: 38000,
        inStock: true,
        description: "Легкий ноутбук для навчання",
        category: "electronics",
        power: 65,
        brand: "AirComp",
        isPortable: true
    }
];
const clothes = [
    {
        id: 20,
        name: "Спортивна футболка",
        price: 700,
        inStock: true,
        description: "Дихаюча тканина, швидко сохне",
        category: "clothing",
        size: "M",
        color: "black",
        gender: "unisex"
    },
    {
        id: 21,
        name: "Пальто жіноче",
        price: 4200,
        inStock: false,
        description: "Тепле пальто для зими",
        category: "clothing",
        size: "S",
        color: "beige",
        gender: "female"
    }
];
const books = [
    {
        id: 30,
        name: "Clean Architecture",
        price: 1150,
        inStock: true,
        description: "Архітектурні патерни для програмістів",
        category: "book",
        author: "Robert C. Martin",
        pages: 432,
        isHardCover: true
    }
];
const allProducts = [
    ...phones,
    ...clothes,
    ...books
];
// Приклади використання (можна закоментувати перед здачею)
let cart = [];
const phone = findProduct(phones, 10);
if (phone) {
    cart = addToCart(cart, phone, 1);
}
const tshirt = findProduct(clothes, 20);
if (tshirt) {
    cart = addToCart(cart, tshirt, 3);
}
const cheapList = filterByPrice(allProducts, 2000);
const total = calculateTotal(cart);
console.log("Дешеві товари:", cheapList);
console.log("Кошик:", cart);
console.log("Сума:", total);
