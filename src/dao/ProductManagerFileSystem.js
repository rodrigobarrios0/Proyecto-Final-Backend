import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';
import path from 'path';

class ProductManagerFileSystem {
    constructor(filePath = './src/data/products.json') {
        this.path = filePath;
    }

    async readProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') return [];
            throw error;
        }
    }

    async writeProducts(products) {
        await fs.mkdir(path.dirname(this.path), { recursive: true });
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    }

    async getProducts() {
        return await this.readProducts();
    }

    async getProductById(id) {
        const products = await this.readProducts();
        return products.find(product => product.id === id) || null;
    }

    async addProduct(productData) {
        const products = await this.readProducts();

        const newProduct = {
            id: randomUUID(),
            status: true,
            thumbnails: [],
            ...productData
        };

        products.push(newProduct);
        await this.writeProducts(products);

        return newProduct;
    }

    async updateProduct(id, updateData) {
        const products = await this.readProducts();
        const index = products.findIndex(product => product.id === id);

        if (index === -1) return null;

        delete updateData.id;

        products[index] = {
            ...products[index],
            ...updateData
        };

        await this.writeProducts(products);
        return products[index];
    }

    async deleteProduct(id) {
        const products = await this.readProducts();
        const product = products.find(item => item.id === id);

        if (!product) return null;

        await this.writeProducts(products.filter(item => item.id !== id));
        return product;
    }
}

export default ProductManagerFileSystem;
