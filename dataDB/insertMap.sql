delimiter //

CREATE PROCEDURE doitnow()
BEGIN
  DECLARE i INT unsigned DEFAULT 0;
  WHILE i < 100 DO
    INSERT INTO `Map` (`inhabited`) VALUES (0);
    SET i = i + 1;
  END WHILE;
END;

delimiter;
