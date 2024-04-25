import { MigrationInterface, QueryRunner } from 'typeorm';

export class NameStrategy1712157977087 implements MigrationInterface {
  name = 'NameStrategy1712157977087';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`proj_question_bank\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`title\` varchar(255) NOT NULL, \`description\` longtext NOT NULL, \`type\` varchar(255) NOT NULL, \`options\` json NOT NULL, \`industry_id\` varchar(36) NULL, \`category_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`proj_category\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`proj_tag\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`project_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`proj_text_block_reference\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`type\` varchar(255) NOT NULL, \`referenceId\` varchar(255) NOT NULL, \`metadata\` json NOT NULL, \`text_block_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`proj_text_block\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`title\` varchar(255) NOT NULL, \`description\` longtext NOT NULL, \`created_by\` varchar(255) NOT NULL, \`updated_by\` varchar(255) NULL, \`is_global\` tinyint NOT NULL DEFAULT 0, \`spc_id\` varchar(36) NULL, \`industry_id\` varchar(36) NULL, \`project_id\` varchar(36) NULL, \`category_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`proj_spc\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`visible_code\` varchar(255) NOT NULL, \`parent_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`proj_future_process\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`code\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`visible_code\` varchar(255) NOT NULL, \`spc_id\` varchar(36) NULL, \`parent_id\` varchar(36) NULL, \`industry_id\` varchar(36) NULL, UNIQUE INDEX \`IDX_dcef64993c79ffc7eed8ad6dee\` (\`code\`, \`industry_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`proj_industry\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`proj_client\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`licensing\` varchar(255) NOT NULL, \`industry_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`proj_mail_setting\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`host\` varchar(255) NOT NULL, \`port\` varchar(255) NOT NULL, \`protocol\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`sender_name\` varchar(255) NOT NULL, \`sender_email_address\` varchar(255) NOT NULL, \`project_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`proj_project_role\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`proj_project_user_role\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`userId\` varchar(255) NOT NULL, \`project_role_id\` varchar(36) NULL, \`project_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`proj_project\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`start_date\` datetime NOT NULL, \`due_date\` datetime NOT NULL, \`logo\` longtext NOT NULL, \`client_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`proj_sprint\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`project_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`proj_project_future_process\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`code\` varchar(255) NOT NULL, \`spc_name\` varchar(255) NOT NULL, \`future_process_name\` varchar(255) NOT NULL, \`visible_code\` varchar(255) NOT NULL, \`is_selected\` tinyint NOT NULL DEFAULT 0, \`can_be_unselected\` tinyint NOT NULL DEFAULT 0, \`is_deletable\` tinyint NOT NULL DEFAULT 0, \`is_created_manual\` tinyint NOT NULL DEFAULT 0, \`project_id\` varchar(36) NULL, \`parent_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`proj_text_block_bank\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`title\` varchar(255) NOT NULL, \`description\` longtext NOT NULL, \`spc_id\` varchar(36) NULL, \`industry_id\` varchar(36) NULL, \`category_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`proj_proj_tag_text_blocks_proj_text_block\` (\`projTagId\` varchar(36) NOT NULL, \`projTextBlockId\` varchar(36) NOT NULL, INDEX \`IDX_40c3b0a41564d9b6071f2f9b14\` (\`projTagId\`), INDEX \`IDX_0a2f9755bdd6d4b0799810887c\` (\`projTextBlockId\`), PRIMARY KEY (\`projTagId\`, \`projTextBlockId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_question_bank\` ADD CONSTRAINT \`FK_5c006b4a7ce8f313c71692bed0a\` FOREIGN KEY (\`industry_id\`) REFERENCES \`proj_industry\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_question_bank\` ADD CONSTRAINT \`FK_8ede85e5bdf37e6ed7e995de193\` FOREIGN KEY (\`category_id\`) REFERENCES \`proj_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_tag\` ADD CONSTRAINT \`FK_33ec8383e6c88c4fc2cf3448d99\` FOREIGN KEY (\`project_id\`) REFERENCES \`proj_project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_text_block_reference\` ADD CONSTRAINT \`FK_4aef7ff975d01b0dcf8f1783889\` FOREIGN KEY (\`text_block_id\`) REFERENCES \`proj_text_block\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_text_block\` ADD CONSTRAINT \`FK_da3e39b5864c2e89a80062a9174\` FOREIGN KEY (\`spc_id\`) REFERENCES \`proj_spc\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_text_block\` ADD CONSTRAINT \`FK_b41bcadf8ece0de86483161db53\` FOREIGN KEY (\`industry_id\`) REFERENCES \`proj_industry\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_text_block\` ADD CONSTRAINT \`FK_9507e44182e8ac01b3030a3c956\` FOREIGN KEY (\`project_id\`) REFERENCES \`proj_project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_text_block\` ADD CONSTRAINT \`FK_2c02af11ad411256777e2fc7acd\` FOREIGN KEY (\`category_id\`) REFERENCES \`proj_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_spc\` ADD CONSTRAINT \`FK_74de48aa3780278f943db0394ed\` FOREIGN KEY (\`parent_id\`) REFERENCES \`proj_spc\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_future_process\` ADD CONSTRAINT \`FK_150d4cea76ae75c47e1d294bb49\` FOREIGN KEY (\`spc_id\`) REFERENCES \`proj_spc\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_future_process\` ADD CONSTRAINT \`FK_fae193aa112ea0e9581e53de320\` FOREIGN KEY (\`parent_id\`) REFERENCES \`proj_future_process\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_future_process\` ADD CONSTRAINT \`FK_63b6debf2806d61c69e96b58517\` FOREIGN KEY (\`industry_id\`) REFERENCES \`proj_industry\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_client\` ADD CONSTRAINT \`FK_3964e1a48b0d49c2430b938aac6\` FOREIGN KEY (\`industry_id\`) REFERENCES \`proj_industry\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_mail_setting\` ADD CONSTRAINT \`FK_d9a8650c886f9cb46accd39d41d\` FOREIGN KEY (\`project_id\`) REFERENCES \`proj_project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_project_user_role\` ADD CONSTRAINT \`FK_93909e26ba875de40f7910b1bb8\` FOREIGN KEY (\`project_role_id\`) REFERENCES \`proj_project_role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_project_user_role\` ADD CONSTRAINT \`FK_40d77002f2d1c343e43801ffdfb\` FOREIGN KEY (\`project_id\`) REFERENCES \`proj_project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_project\` ADD CONSTRAINT \`FK_11f37fd765daa96bf47dca0f367\` FOREIGN KEY (\`client_id\`) REFERENCES \`proj_client\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_sprint\` ADD CONSTRAINT \`FK_d30a369bfe15415ee7e2450002c\` FOREIGN KEY (\`project_id\`) REFERENCES \`proj_project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_project_future_process\` ADD CONSTRAINT \`FK_8ea46d31803b1a9d17a668f2618\` FOREIGN KEY (\`project_id\`) REFERENCES \`proj_project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_project_future_process\` ADD CONSTRAINT \`FK_46afea13e5c7adfd2eedcfcf364\` FOREIGN KEY (\`parent_id\`) REFERENCES \`proj_project_future_process\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_text_block_bank\` ADD CONSTRAINT \`FK_470fe545d0a75413bef29fcd274\` FOREIGN KEY (\`spc_id\`) REFERENCES \`proj_spc\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_text_block_bank\` ADD CONSTRAINT \`FK_3455db9203418713618219f52dd\` FOREIGN KEY (\`industry_id\`) REFERENCES \`proj_industry\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_text_block_bank\` ADD CONSTRAINT \`FK_906491a6b207f1ec38280178810\` FOREIGN KEY (\`category_id\`) REFERENCES \`proj_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_proj_tag_text_blocks_proj_text_block\` ADD CONSTRAINT \`FK_40c3b0a41564d9b6071f2f9b14f\` FOREIGN KEY (\`projTagId\`) REFERENCES \`proj_tag\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_proj_tag_text_blocks_proj_text_block\` ADD CONSTRAINT \`FK_0a2f9755bdd6d4b0799810887cb\` FOREIGN KEY (\`projTextBlockId\`) REFERENCES \`proj_text_block\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`proj_proj_tag_text_blocks_proj_text_block\` DROP FOREIGN KEY \`FK_0a2f9755bdd6d4b0799810887cb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_proj_tag_text_blocks_proj_text_block\` DROP FOREIGN KEY \`FK_40c3b0a41564d9b6071f2f9b14f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_text_block_bank\` DROP FOREIGN KEY \`FK_906491a6b207f1ec38280178810\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_text_block_bank\` DROP FOREIGN KEY \`FK_3455db9203418713618219f52dd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_text_block_bank\` DROP FOREIGN KEY \`FK_470fe545d0a75413bef29fcd274\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_project_future_process\` DROP FOREIGN KEY \`FK_46afea13e5c7adfd2eedcfcf364\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_project_future_process\` DROP FOREIGN KEY \`FK_8ea46d31803b1a9d17a668f2618\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_sprint\` DROP FOREIGN KEY \`FK_d30a369bfe15415ee7e2450002c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_project\` DROP FOREIGN KEY \`FK_11f37fd765daa96bf47dca0f367\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_project_user_role\` DROP FOREIGN KEY \`FK_40d77002f2d1c343e43801ffdfb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_project_user_role\` DROP FOREIGN KEY \`FK_93909e26ba875de40f7910b1bb8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_mail_setting\` DROP FOREIGN KEY \`FK_d9a8650c886f9cb46accd39d41d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_client\` DROP FOREIGN KEY \`FK_3964e1a48b0d49c2430b938aac6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_future_process\` DROP FOREIGN KEY \`FK_63b6debf2806d61c69e96b58517\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_future_process\` DROP FOREIGN KEY \`FK_fae193aa112ea0e9581e53de320\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_future_process\` DROP FOREIGN KEY \`FK_150d4cea76ae75c47e1d294bb49\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_spc\` DROP FOREIGN KEY \`FK_74de48aa3780278f943db0394ed\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_text_block\` DROP FOREIGN KEY \`FK_2c02af11ad411256777e2fc7acd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_text_block\` DROP FOREIGN KEY \`FK_9507e44182e8ac01b3030a3c956\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_text_block\` DROP FOREIGN KEY \`FK_b41bcadf8ece0de86483161db53\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_text_block\` DROP FOREIGN KEY \`FK_da3e39b5864c2e89a80062a9174\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_text_block_reference\` DROP FOREIGN KEY \`FK_4aef7ff975d01b0dcf8f1783889\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_tag\` DROP FOREIGN KEY \`FK_33ec8383e6c88c4fc2cf3448d99\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_question_bank\` DROP FOREIGN KEY \`FK_8ede85e5bdf37e6ed7e995de193\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`proj_question_bank\` DROP FOREIGN KEY \`FK_5c006b4a7ce8f313c71692bed0a\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_0a2f9755bdd6d4b0799810887c\` ON \`proj_proj_tag_text_blocks_proj_text_block\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_40c3b0a41564d9b6071f2f9b14\` ON \`proj_proj_tag_text_blocks_proj_text_block\``,
    );
    await queryRunner.query(
      `DROP TABLE \`proj_proj_tag_text_blocks_proj_text_block\``,
    );
    await queryRunner.query(`DROP TABLE \`proj_text_block_bank\``);
    await queryRunner.query(`DROP TABLE \`proj_project_future_process\``);
    await queryRunner.query(`DROP TABLE \`proj_sprint\``);
    await queryRunner.query(`DROP TABLE \`proj_project\``);
    await queryRunner.query(`DROP TABLE \`proj_project_user_role\``);
    await queryRunner.query(`DROP TABLE \`proj_project_role\``);
    await queryRunner.query(`DROP TABLE \`proj_mail_setting\``);
    await queryRunner.query(`DROP TABLE \`proj_client\``);
    await queryRunner.query(`DROP TABLE \`proj_industry\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_dcef64993c79ffc7eed8ad6dee\` ON \`proj_future_process\``,
    );
    await queryRunner.query(`DROP TABLE \`proj_future_process\``);
    await queryRunner.query(`DROP TABLE \`proj_spc\``);
    await queryRunner.query(`DROP TABLE \`proj_text_block\``);
    await queryRunner.query(`DROP TABLE \`proj_text_block_reference\``);
    await queryRunner.query(`DROP TABLE \`proj_tag\``);
    await queryRunner.query(`DROP TABLE \`proj_category\``);
    await queryRunner.query(`DROP TABLE \`proj_question_bank\``);
  }
}
