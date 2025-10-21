import { Injectable } from '@nestjs/common';
import { isString } from 'class-validator';
import { Logger } from 'src/services/logger';
import { DeepPartial, EntityManager, EntityTarget, FindManyOptions, FindOneOptions, SelectQueryBuilder } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

/**
 * Used to represent both a nanoid and id type
 * @since 0.0.1
 */
type Id = number | string;

/**
 * A default wrapper that takes care of performing basic CRUD via the entity manager to the
 * configure database using Typeorm
 *
 * @docs https://typeorm.io/#/working-with-entity-manager
 * @docs https://docs.nestjs.com/techniques/database
 * @since 0.0.1
 */
@Injectable()
export class RepositoryService<EntityType> {
  /**
   * Allows the use of a logger that will be defined in the services that use this class
   */
  private readonly logger: Logger;

  constructor(private entity: EntityTarget<EntityType>, private readonly entityManager: EntityManager) {
    this.logger = new Logger(`${entity['name']}Repo`);
  }

  /**
   * Will paginate using a default page of 1 and a limit of 100
   * @param options
   * @returns
   */
  paginate(page: number, limit: number, options?: FindManyOptions<EntityType>) {
    return paginate<EntityType>(
      this.entityManager.getRepository(this.entity),
      {
        page,
        limit,
      },
      options,
    );
  }

  /**
   * Will create an entity  or entites with the passed in dto object
   * @param createDto - The values to create the entity with
   * @since 0.0.1
   */
  create(createDto: DeepPartial<EntityType>) {
    return this.entityManager.create(this.entity, createDto);
  }

  createAll(createDtos: DeepPartial<EntityType>[]) {
    return this.entityManager.transaction((manager) =>
      Promise.all(createDtos.map((dto) => manager.create<EntityType>(this.entity, dto))),
    );
  }

  /**
   * Returns all entities found in the database
   * @since 0.0.1
   */
  findAll(options?: FindManyOptions<EntityType>) {
    this.logger.verbose(`Finding records`, options);
    return this.entityManager.find(this.entity, options);
  }

  /**
   * Finds an entity by the passed in identifier
   * @param id - The id of the entity to search for
   * @since 0.0.1
   */
  findOne(id: Id, options?: FindOneOptions<EntityType>) {
    return this.findOneBy(this.getIdKey(id) as keyof EntityType, id, options);
  }

  /**
   * Finds an entity based on the passed in key and value
   * @param key - The key from the entity to find on
   * @param value - The value to search for
   * @since 0.0.1
   */
  findOneBy(key: keyof EntityType, value: any, options?: FindOneOptions<EntityType>) {
    const where: DeepPartial<EntityType> = {};
    where[key] = value;
    this.logger.verbose(`Finding ${this.entity['name']}.${key}=${value}`);
    return this.entityManager.findOneOrFail<EntityType>(this.entity, { where, ...options });
  }

  /**
   * Ensures the entity exists and will update the entity with the passed in dto
   * @param id - The entity's nanoid or id
   * @param updateDto - The dto containing the values to update
   * @since 0.0.1
   */
  async update(id: Id, updateDto: DeepPartial<EntityType>) {
    this.logger.verbose(`Updating Entity found by ${this.getIdKey(id)}=${id}`);
    return this.entityManager.update(this.entity, id, updateDto);
  }

  /**
   * Ensures the entity exists and will remove the entity from the database
   * @param id - The entity's nanoid or id
   * @since 0.0.1
   */
  async remove(id: Id) {
    this.logger.verbose(`Removing Entity where ${this.getIdKey(id)}=${id}`);
    return this.entityManager.delete(this.entity, id);
  }

  /**
   * Determines the correct key the id relates to based on the type of the id passed in
   * @param id - The entity's id to get the key for
   * @returns {string} - nanoid if the id is a string, id otherwise
   * @since 0.0.1
   */
  private getIdKey(id: Id) {
    return isString(id) ? 'nanoid' : 'id';
  }
}
