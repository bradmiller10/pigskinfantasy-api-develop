import {MigrationInterface, QueryRunner} from "typeorm";

export class Setup1628623612949 implements MigrationInterface {
    name = 'Setup1628623612949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isRevoked" boolean NOT NULL DEFAULT false, "expiresAt" TIMESTAMP NOT NULL DEFAULT '"2021-08-10T19:26:55.721+00:00"', CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "auth_attempts_type_enum" AS ENUM()`);
        await queryRunner.query(`CREATE TABLE "auth_attempts" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "requestId" character varying NOT NULL, "ip" character varying NOT NULL, "type" "auth_attempts_type_enum" NOT NULL, "userId" integer, CONSTRAINT "PK_d9115e02f18808834eb82b4a297" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "team_records" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "nanoid" character varying(21) NOT NULL, "teamId" integer, "seasonYear" integer, "totalGames" integer NOT NULL DEFAULT '0', "totalWins" integer, "totalLosses" integer, "totalTies" integer, "conferenceGamesGames" integer NOT NULL DEFAULT '0', "conferenceGamesWins" integer, "conferenceGamesLosses" integer, "conferenceGamesTies" integer, "homeGamesGames" integer NOT NULL DEFAULT '0', "homeGamesWins" integer, "homeGamesLosses" integer, "homeGamesTies" integer, "awayGamesGames" integer NOT NULL DEFAULT '0', "awayGamesWins" integer, "awayGamesLosses" integer, "awayGamesTies" integer, CONSTRAINT "PK_6a748faada696021c24662453d4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "seasons" ("year" integer NOT NULL, "weeks" integer NOT NULL, "currentWeek" integer NOT NULL, "startsAt" TIMESTAMP NOT NULL, "endsAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "recordsId" integer, CONSTRAINT "PK_e20814074bbf37638cb4affa089" PRIMARY KEY ("year"))`);
        await queryRunner.query(`CREATE TYPE "venues_locationstate_enum" AS ENUM('AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY')`);
        await queryRunner.query(`CREATE TYPE "venues_locationcountry_enum" AS ENUM('AF', 'AX', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BQ', 'BA', 'BW', 'BV', 'BR', 'IO', 'BN', 'BG', 'BF', 'BI', 'KH', 'CM', 'CA', 'CV', 'KY', 'CF', 'TD', 'CL', 'CN', 'CX', 'CC', 'CO', 'KM', 'CG', 'CD', 'CK', 'CR', 'CI', 'HR', 'CU', 'CW', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'ET', 'FK', 'FO', 'FJ', 'FI', 'FR', 'GF', 'PF', 'TF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY', 'HT', 'HM', 'VA', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM', 'IL', 'IT', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'KI', 'KR', 'KP', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MO', 'MK', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'NC', 'NZ', 'NI', 'NE', 'NG', 'NU', 'NF', 'MP', 'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN', 'PL', 'PT', 'PR', 'QA', 'RE', 'RO', 'RU', 'RW', 'BL', 'SH', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SX', 'SK', 'SI', 'SB', 'SO', 'ZA', 'GS', 'SS', 'ES', 'LK', 'SD', 'SR', 'SJ', 'SZ', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UM', 'UY', 'UZ', 'VU', 'VE', 'VN', 'VG', 'VI', 'WF', 'EH', 'YE', 'ZM', 'ZW')`);
        await queryRunner.query(`CREATE TABLE "venues" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "nanoid" character varying(21) NOT NULL, "espnId" integer NOT NULL, "name" character varying NOT NULL, "isGrass" boolean NOT NULL DEFAULT false, "hasADome" boolean NOT NULL DEFAULT false, "yearBuilt" integer NOT NULL, "locationName" character varying, "locationState" "venues_locationstate_enum" NOT NULL, "locationCity" character varying NOT NULL, "locationCountry" "venues_locationcountry_enum" NOT NULL DEFAULT 'US', "locationLatitude" double precision, "locationLongtitude" double precision, "locationZipcode" integer NOT NULL, CONSTRAINT "UQ_edbd35f49e02eebab8644b4ac13" UNIQUE ("espnId"), CONSTRAINT "PK_cb0f885278d12384eb7a81818be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "games_status_enum" AS ENUM('Upcoming', '1st', '2nd', '3rd', '4th', 'Final')`);
        await queryRunner.query(`CREATE TABLE "games" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "nanoid" character varying(21) NOT NULL, "espnId" integer NOT NULL, "week" integer NOT NULL, "startsAt" TIMESTAMP NOT NULL, "attendanceTotal" integer NOT NULL DEFAULT '0', "isConferenceGame" boolean NOT NULL DEFAULT false, "status" "games_status_enum" NOT NULL DEFAULT 'Upcoming', "homeWinProbability" double precision, "awayWinProbability" double precision, "highlightYouTubeUrl" character varying, "homeTeamId" integer, "awayTeamId" integer, "venueId" integer, "seasonYear" integer, "homeTotalscore" integer NOT NULL DEFAULT '0', "homeFirstquarterscore" integer, "homeSecondquarterscore" integer, "homeThirdquarterscore" integer, "homeFourthquarterscore" integer, "awayTotalscore" integer NOT NULL DEFAULT '0', "awayFirstquarterscore" integer, "awaySecondquarterscore" integer, "awayThirdquarterscore" integer, "awayFourthquarterscore" integer, CONSTRAINT "UQ_4af30753f85288d5f71208f6b14" UNIQUE ("espnId"), CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "teams" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "nanoid" character varying(21) NOT NULL, "espnId" integer NOT NULL, "name" character varying NOT NULL, "abbreviation" character varying NOT NULL, "color" character varying NOT NULL, "conference" character varying NOT NULL, "logo" character varying NOT NULL, "division" character varying, "altColor" character varying, "mascot" character varying, "altName" character varying, "stadiumId" integer, CONSTRAINT "UQ_0204970be51c2ae043aa8a95cd8" UNIQUE ("espnId"), CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "draft_picks" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "draftId" integer, "userId" integer, "teamId" integer, CONSTRAINT "PK_d39b2bc8afb5ccdb05b92edcf63" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "drafts_type_enum" AS ENUM('0')`);
        await queryRunner.query(`CREATE TYPE "drafts_status_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "drafts" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "nanoid" character varying(21) NOT NULL, "type" "drafts_type_enum" NOT NULL DEFAULT '0', "status" "drafts_status_enum" NOT NULL DEFAULT '1', "startsAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_0598e229012c6cbd4ccbba97328" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "leagues" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "nanoid" character varying(21) NOT NULL, "name" character varying NOT NULL, "ownerId" integer, "activeDraftId" integer, CONSTRAINT "REL_95843192433d0a5ee1de1d3a7d" UNIQUE ("activeDraftId"), CONSTRAINT "PK_2275e1e3e32e9223298c3a0b514" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "users_role_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TYPE "users_status_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TYPE "users_authstatus_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TYPE "users_nameprefix_enum" AS ENUM('Mr', 'Mrs', 'Ms', 'Dr')`);
        await queryRunner.query(`CREATE TYPE "users_namesuffix_enum" AS ENUM('II', 'III', 'IV', 'CPA', 'DDS', 'Jr', 'MD', 'PhD', 'Sr')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "nanoid" character varying(21) NOT NULL, "phoneNumber" character varying(16) NOT NULL, "role" "users_role_enum" NOT NULL DEFAULT '2', "status" "users_status_enum" NOT NULL DEFAULT '0', "authStatus" "users_authstatus_enum" NOT NULL DEFAULT '0', "lastSeen" TIMESTAMP, "signinCount" integer NOT NULL DEFAULT '0', "oneTimeCode" character varying, "refreshTokenId" integer, "activeLeagueId" integer, "nameFirst" character varying NOT NULL, "nameLast" character varying NOT NULL, "nameMiddle" character varying, "namePrefix" "users_nameprefix_enum", "nameSuffix" "users_namesuffix_enum", "namePreferred" character varying, CONSTRAINT "UQ_1e3d0240b49c40521aaeb953293" UNIQUE ("phoneNumber"), CONSTRAINT "REL_19be66e444b5c2b9af008d321a" UNIQUE ("refreshTokenId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "draft_positions" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "position" integer NOT NULL, "draftId" integer, "userId" integer, CONSTRAINT "REL_421d9f0a01fb129d957c855054" UNIQUE ("draftId"), CONSTRAINT "REL_bbfb331526900dca01f2abd3f5" UNIQUE ("userId"), CONSTRAINT "PK_91382108f0a6a317a74c5512520" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "seed_run_state_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "seed_run" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "completedAt" TIMESTAMP, "state" "seed_run_state_enum" NOT NULL DEFAULT '0', CONSTRAINT "PK_2b9dedcca717325190eef518a40" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "seed_run_item" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "entityName" character varying NOT NULL, "entityId" character varying NOT NULL, "parentId" integer, CONSTRAINT "PK_54b4992f82f8d1d4f92e10d9002" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "seasons_leagues_leagues" ("seasonsYear" integer NOT NULL, "leaguesId" integer NOT NULL, CONSTRAINT "PK_f4cf7a0ea93a301856f26b8a980" PRIMARY KEY ("seasonsYear", "leaguesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_899cdca6a6a58f7f301b69b3a1" ON "seasons_leagues_leagues" ("seasonsYear") `);
        await queryRunner.query(`CREATE INDEX "IDX_6f0faa8d29ee95f238e6ff2ec6" ON "seasons_leagues_leagues" ("leaguesId") `);
        await queryRunner.query(`ALTER TABLE "auth_attempts" ADD CONSTRAINT "FK_08ddee089265f4d70afc375440a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_records" ADD CONSTRAINT "FK_1c60067338fb475a7127eccd296" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_records" ADD CONSTRAINT "FK_e53d570126df98b631ac7a9d0e3" FOREIGN KEY ("seasonYear") REFERENCES "seasons"("year") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "seasons" ADD CONSTRAINT "FK_c7ec553617f7f5c7361d740eaf1" FOREIGN KEY ("recordsId") REFERENCES "team_records"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_76f24eb425dbc43f8b4ede6cbbf" FOREIGN KEY ("homeTeamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_f377f6a1109cff635b46eb38c75" FOREIGN KEY ("awayTeamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_1e2a08667ee0959873df7acec1b" FOREIGN KEY ("venueId") REFERENCES "venues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_818d828dcc73e267dc414c9ffb2" FOREIGN KEY ("seasonYear") REFERENCES "seasons"("year") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "teams" ADD CONSTRAINT "FK_3fd5c8f1f6cc965b759359408aa" FOREIGN KEY ("stadiumId") REFERENCES "venues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "draft_picks" ADD CONSTRAINT "FK_814f8659e213112a4962be2b619" FOREIGN KEY ("draftId") REFERENCES "drafts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "draft_picks" ADD CONSTRAINT "FK_636c626f282f6c4ccfd283de5d7" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "draft_picks" ADD CONSTRAINT "FK_5e7643b69a606cbae080b60339a" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "leagues" ADD CONSTRAINT "FK_c819b2f785f17dac12e878dcdf6" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "leagues" ADD CONSTRAINT "FK_95843192433d0a5ee1de1d3a7dd" FOREIGN KEY ("activeDraftId") REFERENCES "drafts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_19be66e444b5c2b9af008d321a0" FOREIGN KEY ("refreshTokenId") REFERENCES "refresh_tokens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_fa42f83301548de88601b3ec429" FOREIGN KEY ("activeLeagueId") REFERENCES "leagues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "draft_positions" ADD CONSTRAINT "FK_421d9f0a01fb129d957c855054f" FOREIGN KEY ("draftId") REFERENCES "drafts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "draft_positions" ADD CONSTRAINT "FK_bbfb331526900dca01f2abd3f50" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "seed_run_item" ADD CONSTRAINT "FK_f6531e822a195748f5249f53301" FOREIGN KEY ("parentId") REFERENCES "seed_run"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "seasons_leagues_leagues" ADD CONSTRAINT "FK_899cdca6a6a58f7f301b69b3a11" FOREIGN KEY ("seasonsYear") REFERENCES "seasons"("year") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "seasons_leagues_leagues" ADD CONSTRAINT "FK_6f0faa8d29ee95f238e6ff2ec62" FOREIGN KEY ("leaguesId") REFERENCES "leagues"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "seasons_leagues_leagues" DROP CONSTRAINT "FK_6f0faa8d29ee95f238e6ff2ec62"`);
        await queryRunner.query(`ALTER TABLE "seasons_leagues_leagues" DROP CONSTRAINT "FK_899cdca6a6a58f7f301b69b3a11"`);
        await queryRunner.query(`ALTER TABLE "seed_run_item" DROP CONSTRAINT "FK_f6531e822a195748f5249f53301"`);
        await queryRunner.query(`ALTER TABLE "draft_positions" DROP CONSTRAINT "FK_bbfb331526900dca01f2abd3f50"`);
        await queryRunner.query(`ALTER TABLE "draft_positions" DROP CONSTRAINT "FK_421d9f0a01fb129d957c855054f"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_fa42f83301548de88601b3ec429"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_19be66e444b5c2b9af008d321a0"`);
        await queryRunner.query(`ALTER TABLE "leagues" DROP CONSTRAINT "FK_95843192433d0a5ee1de1d3a7dd"`);
        await queryRunner.query(`ALTER TABLE "leagues" DROP CONSTRAINT "FK_c819b2f785f17dac12e878dcdf6"`);
        await queryRunner.query(`ALTER TABLE "draft_picks" DROP CONSTRAINT "FK_5e7643b69a606cbae080b60339a"`);
        await queryRunner.query(`ALTER TABLE "draft_picks" DROP CONSTRAINT "FK_636c626f282f6c4ccfd283de5d7"`);
        await queryRunner.query(`ALTER TABLE "draft_picks" DROP CONSTRAINT "FK_814f8659e213112a4962be2b619"`);
        await queryRunner.query(`ALTER TABLE "teams" DROP CONSTRAINT "FK_3fd5c8f1f6cc965b759359408aa"`);
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_818d828dcc73e267dc414c9ffb2"`);
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_1e2a08667ee0959873df7acec1b"`);
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_f377f6a1109cff635b46eb38c75"`);
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_76f24eb425dbc43f8b4ede6cbbf"`);
        await queryRunner.query(`ALTER TABLE "seasons" DROP CONSTRAINT "FK_c7ec553617f7f5c7361d740eaf1"`);
        await queryRunner.query(`ALTER TABLE "team_records" DROP CONSTRAINT "FK_e53d570126df98b631ac7a9d0e3"`);
        await queryRunner.query(`ALTER TABLE "team_records" DROP CONSTRAINT "FK_1c60067338fb475a7127eccd296"`);
        await queryRunner.query(`ALTER TABLE "auth_attempts" DROP CONSTRAINT "FK_08ddee089265f4d70afc375440a"`);
        await queryRunner.query(`DROP INDEX "IDX_6f0faa8d29ee95f238e6ff2ec6"`);
        await queryRunner.query(`DROP INDEX "IDX_899cdca6a6a58f7f301b69b3a1"`);
        await queryRunner.query(`DROP TABLE "seasons_leagues_leagues"`);
        await queryRunner.query(`DROP TABLE "seed_run_item"`);
        await queryRunner.query(`DROP TABLE "seed_run"`);
        await queryRunner.query(`DROP TYPE "seed_run_state_enum"`);
        await queryRunner.query(`DROP TABLE "draft_positions"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "users_namesuffix_enum"`);
        await queryRunner.query(`DROP TYPE "users_nameprefix_enum"`);
        await queryRunner.query(`DROP TYPE "users_authstatus_enum"`);
        await queryRunner.query(`DROP TYPE "users_status_enum"`);
        await queryRunner.query(`DROP TYPE "users_role_enum"`);
        await queryRunner.query(`DROP TABLE "leagues"`);
        await queryRunner.query(`DROP TABLE "drafts"`);
        await queryRunner.query(`DROP TYPE "drafts_status_enum"`);
        await queryRunner.query(`DROP TYPE "drafts_type_enum"`);
        await queryRunner.query(`DROP TABLE "draft_picks"`);
        await queryRunner.query(`DROP TABLE "teams"`);
        await queryRunner.query(`DROP TABLE "games"`);
        await queryRunner.query(`DROP TYPE "games_status_enum"`);
        await queryRunner.query(`DROP TABLE "venues"`);
        await queryRunner.query(`DROP TYPE "venues_locationcountry_enum"`);
        await queryRunner.query(`DROP TYPE "venues_locationstate_enum"`);
        await queryRunner.query(`DROP TABLE "seasons"`);
        await queryRunner.query(`DROP TABLE "team_records"`);
        await queryRunner.query(`DROP TABLE "auth_attempts"`);
        await queryRunner.query(`DROP TYPE "auth_attempts_type_enum"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    }

}
