import Category from "@/core/category/domain/entities/Category"
import ICategoryRepository from "@/core/category/ports/out/ICategoryRepository"
import { IResponseListDto } from "@/core/shared/dto/ResponseListDto"
import db from "../DB/db"

export default class CategoryRepository implements ICategoryRepository {
  public async registerCategory(category: Category): Promise<void> {
    await db.query(
      `INSERT INTO Category (id, name, description)
         VALUES ($1, $2, $3)`,
      [category.id, category.name, category.description],
    )
  }

  public async findById(categoryId: string): Promise<Category | null> {
    const query = "SELECT * FROM category WHERE id = $1 and active = true"
    const result = await db.oneOrNone(query, [categoryId])
    if (!result) {
      return null
    }
    return result
  }
  public async listAll(page: number = 1, limit = 10): Promise<IResponseListDto | null> {
    const OFFSET = limit * (page - 1)
    const categories = await db.any(
      `SELECT COUNT(*) OVER() AS total, * FROM category WHERE active = true
         LIMIT ${limit} OFFSET ${OFFSET}`,
    )

    return !categories || categories.length === 0
      ? {
          items: [],
          totalItems: 0,
        }
      : {
          items: categories,
          totalItems: categories[0].total,
        }
  }

  async countCategories(): Promise<number> {
    const qtde = await db.oneOrNone(`select count(*) total from category where active = true`)
    if (!qtde) return 0

    return qtde.total
  }

  async delete(categoryId: string): Promise<void> {
    const query = `update category set actove = false WHERE id = $1)`
    await db.any(query, [categoryId])
  }

  async updateCategory(category: Category): Promise<void> {
    const query = `UPDATE category
                   SET name = $1,
                       description = $2,
                       active = $3
                   WHERE id = $4`
    await db.none(query, [category.name, category.description, category.active, category.id])
  }
}
