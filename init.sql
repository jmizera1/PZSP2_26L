CREATE TABLE experiment (
   experiment_id INT NOT NULL,
   name          VARCHAR(4000) NOT NULL,
   creation_date DATE NOT NULL,
   description   TEXT,
   user_id       INT NOT NULL,
   user_id1      INT NOT NULL
);

ALTER TABLE experiment ADD CONSTRAINT experiment_pk PRIMARY KEY ( experiment_id );

CREATE TABLE experiment_metric (
   experiment_metric_id INT NOT NULL,
   value                FLOAT NOT NULL,
   id1                  INT NOT NULL,
   metric_metric_id     INT NOT NULL,
   result_result_id     INT NOT NULL
);

ALTER TABLE experiment_metric ADD CONSTRAINT experiment_metric_pk PRIMARY KEY ( experiment_metric_id );

CREATE TABLE metric (
   metric_id    INT NOT NULL,
   name         VARCHAR(4000) NOT NULL,
   unit         VARCHAR(4000) NOT NULL,
   unit_unit_id INT NOT NULL
);

ALTER TABLE metric ADD CONSTRAINT metric_pk PRIMARY KEY ( metric_id );

CREATE TABLE result (
   result_id                INT NOT NULL,
   experiment_experiment_id INT NOT NULL,
   number_of_containers     INT,
   platform_name            VARCHAR(4000),
   workload                 VARCHAR(4000),
   number_of_agents         INT,
   number_of_repetitions    INT,
   message_size             INT,
   group_size               INT,
   ram                      FLOAT,
   vcpu                     VARCHAR(4000)
);

ALTER TABLE result ADD CONSTRAINT result_pk PRIMARY KEY ( result_id );

CREATE TABLE unit (
   unit_id INT NOT NULL,
   unit    VARCHAR(4000) NOT NULL
);

ALTER TABLE unit ADD CONSTRAINT unit_pk PRIMARY KEY ( unit_id );

CREATE TABLE `user` (
   user_id                INT NOT NULL,
   name                   VARCHAR(4000) NOT NULL,
   surname                VARCHAR(4000) NOT NULL,
   org                    VARCHAR(4000) NOT NULL,
   user_auth_user_auth_id INT NOT NULL,
   user_type_user_type_id INT NOT NULL,
   email                  VARCHAR(4000) NOT NULL,
   password               VARCHAR(4000) NOT NULL
);

CREATE UNIQUE INDEX user__idx ON `user` ( user_auth_user_auth_id ASC );

ALTER TABLE `user` ADD CONSTRAINT user_pk PRIMARY KEY ( user_id );

CREATE TABLE user_auth (
   user_auth_id INT NOT NULL,
   email        VARCHAR(4000) NOT NULL,
   password     VARCHAR(4000) NOT NULL,
   user_user_id INT NOT NULL
);

CREATE UNIQUE INDEX user_auth__idx ON user_auth ( user_user_id ASC );

ALTER TABLE user_auth ADD CONSTRAINT user_auth_pk PRIMARY KEY ( user_auth_id );

CREATE TABLE user_type (
   user_type_id INT NOT NULL,
   type         VARCHAR(4000) NOT NULL
);

ALTER TABLE user_type ADD CONSTRAINT user_type_pk PRIMARY KEY ( user_type_id );

-- Foreign Keys
ALTER TABLE experiment_metric
   ADD CONSTRAINT experiment_metric_metric_fk FOREIGN KEY ( metric_metric_id )
      REFERENCES metric ( metric_id );

ALTER TABLE experiment_metric
   ADD CONSTRAINT experiment_metric_result_fk FOREIGN KEY ( result_result_id )
      REFERENCES result ( result_id );

ALTER TABLE experiment
   ADD CONSTRAINT experiment_user_fk FOREIGN KEY ( user_id )
      REFERENCES `user` ( user_id );

ALTER TABLE metric
   ADD CONSTRAINT metric_unit_fk FOREIGN KEY ( unit_unit_id )
      REFERENCES unit ( unit_id );

ALTER TABLE result
   ADD CONSTRAINT result_experiment_fk FOREIGN KEY ( experiment_experiment_id )
      REFERENCES experiment ( experiment_id );

ALTER TABLE user_auth
   ADD CONSTRAINT user_auth_user_fk FOREIGN KEY ( user_user_id )
      REFERENCES `user` ( user_id );

ALTER TABLE `user`
   ADD CONSTRAINT user_user_auth_fk FOREIGN KEY ( user_auth_user_auth_id )
      REFERENCES user_auth ( user_auth_id );

ALTER TABLE `user`
   ADD CONSTRAINT user_user_type_fk FOREIGN KEY ( user_type_user_type_id )
      REFERENCES user_type ( user_type_id );

-- Triggers
DELIMITER //

CREATE TRIGGER fkntm_result BEFORE UPDATE ON result
FOR EACH ROW
BEGIN
   IF NEW.experiment_experiment_id != OLD.experiment_experiment_id THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Non Transferable FK constraint on table Result is violated';
   END IF;
END;
//

CREATE TRIGGER fkntm_user BEFORE UPDATE ON `user`
FOR EACH ROW
BEGIN
   IF NEW.user_auth_user_auth_id != OLD.user_auth_user_auth_id THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Non Transferable FK constraint on table User is violated';
   END IF;
END;
//

CREATE TRIGGER fkntm_user_auth BEFORE UPDATE ON user_auth
FOR EACH ROW
BEGIN
   IF NEW.user_user_id != OLD.user_user_id THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Non Transferable FK constraint on table User_Auth is violated';
   END IF;
END;
//

DELIMITER ;