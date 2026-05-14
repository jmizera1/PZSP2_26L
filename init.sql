CREATE TABLE user_type (
   user_type_id INT AUTO_INCREMENT NOT NULL,
   type         VARCHAR(255) NOT NULL,
   PRIMARY KEY (user_type_id)
);

CREATE TABLE `user` (
   user_id                INT AUTO_INCREMENT NOT NULL,
   name                   VARCHAR(255) NOT NULL,
   surname                VARCHAR(255) NOT NULL,
   org                    VARCHAR(255) NOT NULL,
   user_type_user_type_id INT NOT NULL,
   email                  VARCHAR(255) NOT NULL,
   password               VARCHAR(255) NOT NULL,
   PRIMARY KEY (user_id)
);

CREATE TABLE experiment (
   experiment_id INT AUTO_INCREMENT NOT NULL,
   name          VARCHAR(255) NOT NULL,
   creation_date DATE NOT NULL,
   description   TEXT,
   user_id       INT NOT NULL,
   user_id1      INT NOT NULL,
   PRIMARY KEY (experiment_id)
);

CREATE TABLE result (
   result_id                INT AUTO_INCREMENT NOT NULL,
   experiment_experiment_id INT NOT NULL,
   number_of_containers     INT,
   platform_name            VARCHAR(255),
   workload                 VARCHAR(255),
   number_of_agents         INT,
   number_of_repetitions    INT,
   message_size             INT,
   group_size               INT,
   ram                      FLOAT,
   vcpu                     VARCHAR(255),
   PRIMARY KEY (result_id)
);

CREATE TABLE unit (
   unit_id INT AUTO_INCREMENT NOT NULL,
   unit    VARCHAR(255) NOT NULL,
   PRIMARY KEY (unit_id)
);

CREATE TABLE metric (
   metric_id    INT AUTO_INCREMENT NOT NULL,
   name         VARCHAR(255) NOT NULL,
   unit         VARCHAR(255) NOT NULL,
   unit_unit_id INT NOT NULL,
   PRIMARY KEY (metric_id)
);

CREATE TABLE experiment_metric (
   experiment_metric_id INT AUTO_INCREMENT NOT NULL,
   value                FLOAT NOT NULL,
   id1                  INT NOT NULL,
   metric_metric_id     INT NOT NULL,
   result_result_id     INT NOT NULL,
   PRIMARY KEY (experiment_metric_id)
);

-- Foreign Keys
ALTER TABLE experiment_metric
   ADD CONSTRAINT experiment_metric_metric_fk FOREIGN KEY (metric_metric_id)
      REFERENCES metric (metric_id);

ALTER TABLE experiment_metric
   ADD CONSTRAINT experiment_metric_result_fk FOREIGN KEY (result_result_id)
      REFERENCES result (result_id);

ALTER TABLE experiment
   ADD CONSTRAINT experiment_user_fk FOREIGN KEY (user_id)
      REFERENCES `user` (user_id);

ALTER TABLE metric
   ADD CONSTRAINT metric_unit_fk FOREIGN KEY (unit_unit_id)
      REFERENCES unit (unit_id);

ALTER TABLE result
   ADD CONSTRAINT result_experiment_fk FOREIGN KEY (experiment_experiment_id)
      REFERENCES experiment (experiment_id);

ALTER TABLE `user`
   ADD CONSTRAINT user_user_type_fk FOREIGN KEY (user_type_user_type_id)
      REFERENCES user_type (user_type_id);

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

DELIMITER ;

-- Seed data
SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO user_type (user_type_id, type) VALUES (1, 'admin'), (2, 'user');
INSERT INTO `user` (user_id, name, surname, org, user_type_user_type_id, email, password) VALUES (1, 'Jan', 'Kowalski', 'AGH', 2, 'jan@agh.edu.pl', '$2b$12$jzPqW4/Hoia0JlxoIwIfW.zooMK2vox7vOfJ1vMIc8s9PBdPimo9G');
INSERT INTO `user` (user_id, name, surname, org, user_type_user_type_id, email, password) VALUES (2, 'Anna', 'Nowak', 'AGH', 1, 'anna@agh.edu.pl', '$2b$12$jzPqW4/Hoia0JlxoIwIfW.zooMK2vox7vOfJ1vMIc8s9PBdPimo9G');

SET FOREIGN_KEY_CHECKS = 1;