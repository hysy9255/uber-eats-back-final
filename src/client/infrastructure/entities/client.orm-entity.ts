import { UserEntity } from 'src/user/infrastructure/orm-entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('clients')
export class ClientEntity {
  @PrimaryColumn({ unique: true })
  clientId: string;

  @Column({ unique: true })
  userId: string;

  @OneToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  constructor(clientId: string, userId: string) {
    this.clientId = clientId;
    this.userId = userId;
  }
}
