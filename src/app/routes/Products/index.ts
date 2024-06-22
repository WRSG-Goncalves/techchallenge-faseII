import ProductController from "@/adapters/in/controllers/Product/ProductController"
import Id from "@/adapters/out/persistence/generateID/Id"
import ProductRepository from "@/adapters/out/persistence/Product/ProductRepository"
import ExpressAdapter from "../ExpressAdapter"

class ProductRoutes {
  private _productRepository: ProductRepository
  private _productController: ProductController
  private _idGenerator: Id

  constructor(private _router: any) {
    this._productRepository = new ProductRepository()
    this._idGenerator = new Id()
    this._productController = new ProductController(this._productRepository, this._idGenerator)
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this._router.post("/products", ExpressAdapter.adaptRoute(this.registerProduct.bind(this)))
    this._router.get("/products/id", ExpressAdapter.adaptRoute(this.findById.bind(this)))
    this._router.get(
      "/products/category",
      ExpressAdapter.adaptRoute(this.findByCategory.bind(this)),
    )
    this._router.get("/products", ExpressAdapter.adaptRoute(this.listAll.bind(this)))
    this._router.put("/products", ExpressAdapter.adaptRoute(this.UpdateProduct.bind(this)))
    this._router.delete("/products/id", ExpressAdapter.adaptRoute(this.delete.bind(this)))
  }

  private async registerProduct({ body }: { body: any }) {
    return this._productController.registerProduct(body)
  }

  private async findById({ query }: { query: any }) {
    const { id } = query
    return this._productController.findById(id.toString())
  }

  private async findByCategory({ query }: { query: any }) {
    const { category, page } = query
    return this._productController.findByCategory(category.toString(), Number(page))
  }

  private async listAll({ query }: { query: any }) {
    const { page } = query
    return this._productController.listAllProducts(Number(page))
  }

  private async delete({ query }: { query: any }) {
    const { id } = query
    return this._productController.delete(id)
  }

  private async UpdateProduct({ body }: { body: any }) {
    return this._productController.updateProduct(body)
  }
}

export default ProductRoutes
