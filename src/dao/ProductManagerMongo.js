import Product from '../models/Products.js';

class ProductManagerMongo {
    async getProducts(options = {}){
        const { limit = 10, page = 1, sort, query } = options;

        const filter = {};

        if (query) {
            if (query === 'true' || query === 'false') {
                filter.status = query === 'true';
            } else {
                filter.category = query;
                }
            }

            const sortOption = {};
            if (sort === 'asc') sortOption.price = 1;
            if (sort === 'desc') sortOption.price = -1;

            const result = await Product.paginate(
                filter,
                {
                    limit, 
                    page,
                    sort: Object.keys(sortOption).length ? sortOption : undefined,
                    lean: true
                }
            );

            return result;
        }

        async getProductById(id) {
            return await Product.findById(id).lean();
        }

        async addProduct(productData) {
            return await Product.create(productData);
        }

        async updateProduct(id, updateData){
            delete updateData._id;
            return await Product.findByIdAndUpdate(
                id, 
                updateData,
                {new: true}
            );
        }

        async deleteProduct(id){
            return await Product.findByIdAndDelete(id);
        }
    }

    export default ProductManagerMongo;