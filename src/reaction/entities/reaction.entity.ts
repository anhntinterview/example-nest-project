import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';
import { ArticleEntity } from '../../post/entities/post.entity';

@Entity('reaction')
export class ReactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  thumbsUp: 0;

  @Column()
  hooray: 0;

  @Column()
  heart: 0;

  @Column()
  rocket: 0;

  @Column()
  eyes: 0;

  @OneToOne(type => ArticleEntity, article => article.reaction)
  article: ArticleEntity;
}