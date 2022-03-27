import { Field, ObjectType } from "@nestjs/graphql";
import { Project } from "src/apis/project/entities/project.entity";
import { User } from "src/apis/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
@ObjectType()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @Column()
    @Field(() => String)
    content: string;

    @Column()
    @Field(() => Date)
    limit: Date;

    @Column()
    @Field(() => Boolean)
    is_complete: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne(() => Task)
    task: Task;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Project)
    project: Project;

}