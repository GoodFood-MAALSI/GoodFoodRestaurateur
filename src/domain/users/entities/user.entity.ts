import {
  Column,
  AfterLoad,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from "typeorm";
import { EntityHelper } from "src/domain/utils/entity-helper";
import { Exclude } from "class-transformer";
import { hashPassword } from "src/domain/utils/helpers";
import { Restaurant } from "src/domain/restaurant/entities/restaurant.entity";
import { ApiProperty } from "@nestjs/swagger";

export enum UserStatus {
  Active = "active",
  Inactive = "inactive",
  Suspended = "suspended",
}

export enum UserRole {
  Restaurateur = "restaurateur",
}

@Entity()
export class User extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;
  
  @ApiProperty({ example: 'email@gmail.com' })
  @Column({ type: String, unique: true, nullable: true })
  email: string | null;

  @ApiProperty({ example: '123456789' })
  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Exclude({ toPlainOnly: true })
  public previousPassword: string;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      this.password = await hashPassword(this.password);
    }
  }

  @ApiProperty({ example: UserStatus.Inactive })
  @Column({ type: "enum", enum: UserStatus, default: UserStatus.Inactive })
  status: UserStatus;

  @ApiProperty({ example: 'Michel' })
  @Index()
  @Column({ type: String, nullable: true })
  first_name: string | null;

  @ApiProperty({ example: 'Bourgeon' })
  @Index()
  @Column({ type: String, nullable: true })
  last_name: string | null;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @Column({ type: String, nullable: true })
  @Index()
  @Exclude({ toPlainOnly: true })
  hash: string | null;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ example: UserRole.Restaurateur })
  @Column({ type: "enum", enum: UserRole, default: UserRole.Restaurateur })
  role: UserRole;

  @OneToMany(() => Restaurant, (restaurant) => restaurant.user)
  restaurants: Restaurant[];
}