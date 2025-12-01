export type BaseProduct = {
    id: number;
    name: string;
    price: number;
    inStock: boolean;
    description?: string;
};

export type Electronics = BaseProduct & {
    category: "electronics";
    power: number;
    brand: string;
    isPortable: boolean;
};

export type Clothing = BaseProduct & {
    category: "clothing";
    size: "XS" | "S" | "M" | "L" | "XL";
    color: string;
    gender: "male" | "female" | "unisex";
};

export type Book = BaseProduct & {
    category: "book";
    author: string;
    pages: number;
    isHardCover: boolean;
};

export type CartItem<T> = {
    product: T;
    quantity: number;
};

// ---- Пошук та фільтрація ----

export const findProduct = <T extends BaseProduct>(
    products: T[],
    id: number
): T | undefined => {
    if (!Array.isArray(products) || !Number.isFinite(id)) {
        return undefined;
    }
    return products.find((p: T): boolean => p.id === id);
};

export const filterByPrice = <T extends BaseProduct>(
    products: T[],
    maxPrice: number
): T[] => {
    if (!Array.isArray(products) || !Number.isFinite(maxPrice)) {
        return [];
    }
    return products.filter((p: T): boolean => p.price <= maxPrice);
};

// ---- Кошик ----

export const addToCart = <T extends BaseProduct>(
    cart: CartItem<T>[],
    product: T,
    quantity: number
): CartItem<T>[] => {
    if (quantity <= 0 || !product) {
        console.warn("addToCart: некоректні дані");
        return cart;
    }

    const existingIndex = cart.findIndex(
        (item: CartItem<T>): boolean => item.product.id === product.id
    );

    if (existingIndex === -1) {
        return [...cart, { product, quantity }];
    }

    const cloned: CartItem<T>[] = cart.map(
        (item: CartItem<T>): CartItem<T> => ({ ...item })
    );
    cloned[existingIndex].quantity += quantity;

    return cloned;
};

export const calculateTotal = <T extends BaseProduct>(
    cart: CartItem<T>[]
): number => {
    return cart.reduce((sum: number, item: CartItem<T>): number => {
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

const phones: Electronics[] = [
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

const clothes: Clothing[] = [
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

const books: Book[] = [
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

const allProducts: (Electronics | Clothing | Book)[] = [
    ...phones,
    ...clothes,
    ...books
];

// Приклади використання (можна закоментувати перед здачею)

let cart: CartItem<Electronics | Clothing | Book>[] = [];

const phone = findProduct<Electronics>(phones, 10);
if (phone) {
    cart = addToCart(cart, phone, 1);
}

const tshirt = findProduct<Clothing>(clothes, 20);
if (tshirt) {
    cart = addToCart(cart, tshirt, 3);
}

const cheapList = filterByPrice(allProducts, 2000);
const total = calculateTotal(cart);

console.log("Дешеві товари:", cheapList);
console.log("Кошик:", cart);
console.log("Сума:", total);
