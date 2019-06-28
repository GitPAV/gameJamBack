delimiter //

CREATE PROCEDURE basecreation()
BEGIN
  DECLARE i INT unsigned DEFAULT 0;
  WHILE i < 100 DO
    INSERT INTO `UserBase` (`inhabited`) VALUES (0);
    SET i = i + 1;
  END WHILE;
END;

delimiter;