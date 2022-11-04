import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, OneToMany, JoinColumn, AfterUpdate, BeforeUpdate } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { CommentEntity } from '../../comment/entities/comment.entity';
import { ReactionEntity } from 'src/reaction/entities/reaction.entity';

@Entity('article')
export class ArticleEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({default: ''})
  description: string;

  @Column({default: ''})
  body: string;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  created: Date;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  updated: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date;
  }

  @Column('simple-array')
  tagList: string[];

  @ManyToOne(type => UserEntity, user => user)
  author: UserEntity;

  @OneToMany(type => CommentEntity, comment => comment.article, {eager: true})
  @JoinColumn()
  comments: CommentEntity[];

  @OneToOne(type => ReactionEntity, reaction => reaction.article, {eager: true})
  @JoinColumn()
  reaction: ReactionEntity;

  @Column({default: 0})
  favoriteCount: number;
}