import { UserRole } from 'src/auth/application/ports/find-user';
import { ClientEntity } from 'src/client/infrastructure/entities/client.orm-entity';
import { OwnerEntity } from 'src/owner/infrastructure/entities/owner.entity';
import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryColumn()
  userId: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @Column({ type: 'varchar', nullable: true })
  profileImgUrl: string | null;

  @OneToOne(() => OwnerEntity, (owner) => owner.user)
  owner: OwnerEntity | null;

  @OneToOne(() => ClientEntity, (client) => client.user)
  client: ClientEntity | null;

  constructor(
    userId: string,
    email: string,
    password: string,
    role: UserRole,
    name: string,
    phoneNumber: string,
    profileImgUrl: string | null,
  ) {
    this.userId = userId;
    this.email = email;
    this.password = password;
    this.role = role;
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.profileImgUrl = profileImgUrl;
  }
}
