import CategoryRepository from "@/adapters/out/persistence/Category/CategoryRepository"
import AppErrors from "@/core/shared/error/AppErrors"
import ErrosMessage from "@/core/shared/error/ErrosMessage"
import { IIdGenerator } from "@/core/shared/GeneratorID/IIdGenerator"
import Category from "../entities/Category"

export default class CreateCategoryUseCase {
  constructor(
    private _categoryRepository: CategoryRepository,
    private _idGenerator: IIdGenerator,
  ) {}

  async execute(category: any): Promise<void> {
    const existingCategory = await this._categoryRepository.findById(category.id)

    if (existingCategory) {
      throw new AppErrors(ErrosMessage.CATEGORY_ALREADY_EXISTS)
    }

    const newCategory = Category.factory({
      name: category.name,
      description: category.description,
      active: category.active,
      id: this._idGenerator.gerar(),
    })

    await this._categoryRepository.registerCategory(newCategory)
  }
}
