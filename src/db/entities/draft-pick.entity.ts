import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from './abstract/default.entity';
import { Draft } from './draft.entity';
import { Team } from './team.entity';
import { User } from './user.entity';

@Entity('draft_picks')
export class DraftPick extends DefaultEntity {
  @ManyToOne(() => Draft, (d) => d.draftPicks)
  @JoinColumn()
  draft: Draft;

  @ManyToOne(() => User, (u) => u.draftPicks)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Team, (t) => t.draftPicks)
  @JoinColumn()
  team: Team;
}
