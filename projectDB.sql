-- Name: Daniel Or and Ethan Mendelson
-- CS340 Project

DROP TABLE IF EXISTS `Customers`
DROP TABLE IF EXISTS `Orders`
DROP TABLE IF EXISTS `OrderShowings`
DROP TABLE IF EXISTS `Rooms`
DROP TABLE IF EXISTS `Showings`
DROP TABLE IF EXISTS `Seats`
DROP TABLE IF EXISTS `OrderStatuses`

CREATE TABLE `Customers` (
    `CustomerID` int, auto_increment, not NULL,
    `lastName` varchar(40), not NULL,
    `email` varchar(100), not NULL,
    `address1` varchar(200),
    PRIMARY KEY (`CustomerID`)
    UNIQUE KEY (`CustomerID`)
) ENGINE=InnoDB;

CREATE TABLE `Orders` (
    `OrderID` int, auto_increment, not NULL,
    `CustomerID` int, not NULL,
    `OrderStatusID` int, not NULL,
    `orderDate` datetime, not NULL,
    `seatsQuant` int, not NULL,
    PRIMARY KEY (`OrderID`),
    FOREIGN KEY (`CustomerID`) REFERENCES `Customers` (`CustomerID`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`OrderStatusID`) REFERENCES `OrderStatuses` (`OrderStatusID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;


CREATE TABLE `OrderShowings` (
    `ShowingID` int, auto_increment, not NULL,
    `OrderID` int, not NULL,
    -- not sure how this should look please check if this is correct
    PRIMARY KEY (`ShowingID`),
    PRIMARY KEY (`OrderID`),
    FOREIGN KEY (`ShowingID`) REFERENCES `Showings` (`ShowingID`) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (`OrderID`) REFERENCES `Orders` (`OrderID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `Rooms` (
    `RoomID` int, auto_increment, not NULL,
    `seatsTotal` int, not NULL,
    `seatsAvailable` int, not NULL,
    PRIMARY KEY (`RoomID`)
)ENGINE=InnoDB;

CREATE TABLE `Showings` (
    `ShowingID` int, auto_increment, not NULL,
    `title`     varchar(200), not NULL,
    `time`      int, not NULL,
    `RoomID`    int, not NULL,
    `cost`      int, not NULL,
    PRIMARY KEY (`ShowingID`),
    FOREIGN KEY (`RoomID`) REFERENCES `Rooms` (`RoomID`) ON DELETE SET NULL ON UPDATE CASCADE
)ENGINE=InnoDB;

CREATE TABLE `Seats`(
    `SeatsID` int, auto_increment, not NULL,
    `row`     varchar(20), not NULL,
    `col`     int, not NULL,
    `RoomID`  int, not NULL,
    `OrderID` int, not NULL,
    PRIMARY KEY (`SeatsID`),
    FOREIGN KEY (`RoomID`) REFERENCES `Rooms` (`RoomID`) ON DELETE SET NULL ON UPDATE CASCADE
    FOREIGN KEY (`OrderID`) REFERENCES `Orders` (`OrderID`) ON DELETE SET NULL ON UPDATE CASCADE
)ENGINE=InnoDB;

CREATE TABLE `OrderStatuses`(
    `OrderStatusID` int, auto_increment, not NULL,
    `name`          varchar(100), not NULL
    PRIMARY KEY (`OrderStatusID`)
)ENGINE=InnoDB;