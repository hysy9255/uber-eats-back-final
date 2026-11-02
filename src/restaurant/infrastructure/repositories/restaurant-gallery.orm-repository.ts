import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantGalleryRepository } from 'src/restaurant/application/ports/restaurant-gallery.repository';
import { RestaurantGalleryEntity } from '../orm-entities/restaurant-image.orm.entity';
import { Repository } from 'typeorm';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { RestaurantGallery } from 'src/restaurant/domain/restaurant-gallery/restaurant-gallery';
import { NotFoundException } from '@nestjs/common';
import { RestaurantGalleryFactory } from 'src/restaurant/domain/factories/restaurant-gallery.factory';

export class RestaurantGalleryOrmRepository extends RestaurantGalleryRepository {
  constructor(
    @InjectRepository(RestaurantGalleryEntity)
    private readonly restaurantGalleryRepo: Repository<RestaurantGalleryEntity>,
  ) {
    super();
  }

  async findOneByRestaurantId(
    restaurantId: RestaurantId,
  ): Promise<RestaurantGallery | null> {
    const result = await this.restaurantGalleryRepo.findOne({
      where: { restaurantId: restaurantId.value },
    });
    if (!result) return null;

    return RestaurantGalleryFactory.create(
      result.restaurantId,
      result.logo,
      result.mainImg,
      result.sub1Img,
      result.sub2Img,
      result.bannerImg,
    );
  }

  async saveUpdate(updatedGallery: RestaurantGallery) {
    const existing = await this.restaurantGalleryRepo.findOne({
      where: { restaurantId: updatedGallery.restaurantId.value },
    });
    if (!existing) throw new NotFoundException('Restaurant Gallery Not Found');
    existing.logo = updatedGallery.logo ? updatedGallery.logo.value : null;
    existing.mainImg = updatedGallery.mainImage.value;
    existing.sub1Img = updatedGallery.sub1Image.value;
    existing.sub2Img = updatedGallery.sub2Image.value;
    existing.bannerImg = updatedGallery.bannerImage.value;
    await this.restaurantGalleryRepo.save(existing);
  }
}
