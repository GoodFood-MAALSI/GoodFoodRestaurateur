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

export enum UserStatus {
  Active = "active",
  Inactive = "inactive",
}

@Entity()
export class User extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, unique: true, nullable: true })
  email: string | null;

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

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.Inactive })
  status: UserStatus;

  @Index()
  @Column({ type: String, nullable: true })
  first_name: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  last_name: string | null;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: String, nullable: true })
  @Index()
  @Exclude({ toPlainOnly: true })
  hash: string | null;

  @UpdateDateColumn()
  updated_at: Date;
}