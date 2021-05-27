-- Name: Daniel Or and Ethan Mendelson
-- CS340 Project

DROP TABLE IF EXISTS `Customers`;
DROP TABLE IF EXISTS `Orders`;
DROP TABLE IF EXISTS `OrderShowings`;
DROP TABLE IF EXISTS `Rooms`;
DROP TABLE IF EXISTS `Showings`;
DROP TABLE IF EXISTS `Seats`;
DROP TABLE IF EXISTS `OrderStatuses`;

CREATE TABLE `Customers` (
    `CustomerID` int auto_increment not NULL,
    `lastName` varchar(40) not NULL,
    `email` varchar(100) not NULL,
    `address1` varchar(200),
    PRIMARY KEY (`CustomerID`),
    UNIQUE KEY (`CustomerID`)
) ENGINE=InnoDB;

INSERT INTO `Customers` (`CustomerID`, `lastName`, `email`, `address1`) VALUES ('1', 'Marquette', 'f_qMarq89@hotmail.com', '4575 Prospect Valley Road'), ('2', 'McKenzie', 'VioletEMcKenzie@rhyta.com', '1294 Pickens Way'), ('3', 'Turner', 'CharlesCTurner@jourrapide.com', '4521 Riverside Drive');

CREATE TABLE `OrderStatuses`(
    `OrderStatusID` int auto_increment not NULL,
    `name`          varchar(100) not NULL,
    PRIMARY KEY (`OrderStatusID`)
)ENGINE=InnoDB;

INSERT INTO `OrderStatuses` (`OrderStatusID`, `name`) VALUES ('1', 'Complete'), ('2', 'Fail');

CREATE TABLE `Orders` (
    `OrderID` int auto_increment not NULL,
    `CustomerID` int not NULL,
    `OrderStatusID` int not NULL,
    `orderDate` datetime not NULL,
    `seatsQuant` int not NULL,
    PRIMARY KEY (`OrderID`),
    FOREIGN KEY (`CustomerID`) REFERENCES `Customers` (`CustomerID`) ON DELETE CASCADE,
    FOREIGN KEY (`OrderStatusID`) REFERENCES `OrderStatuses` (`OrderStatusID`) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `Orders` (`OrderID`, `CustomerID`, `OrderStatusID`, `orderDate`, `seatsQuant`) VALUES ('1', '1', '1', '2021-05-12 21:21:53.000000', '2'), ('2', '2', '1', '2021-05-12 21:21:53.000000', '1'), ('3', '3', '2', '2021-05-12 21:21:53.000000', '1');

CREATE TABLE `Rooms` (
    `RoomID` int auto_increment not NULL,
    `seatsTotal` int not NULL,
    `seatsAvailable` int not NULL,
    PRIMARY KEY (`RoomID`)
)ENGINE=InnoDB;

INSERT INTO `Rooms` (`RoomID`, `seatsTotal`, `seatsAvailable`) VALUES ('1', '100', '98'), ('2', '50', '49'), ('3', '50', '49');

CREATE TABLE `Showings` (
    `ShowingID` int auto_increment not NULL,
    `title`     varchar(200) not NULL,
    `time`      datetime not NULL,
    `RoomID`    int not NULL,
    `cost`      int not NULL,
    PRIMARY KEY (`ShowingID`),
    FOREIGN KEY (`RoomID`) REFERENCES `Rooms` (`RoomID`) ON DELETE CASCADE
)ENGINE=InnoDB;

INSERT INTO `Showings` (`ShowingID`, `title`, `time`, `RoomID`, `cost`) VALUES ('1', 'Mortal Kombat', '2021-05-12 20:27:21', '1', '15'), ('2', 'Godzilla vs Kong', '2021-05-12 19:27:21', '1', '15'), ('3', 'Tenet', '2021-05-12 21:27:21.000000', '3', '10');

CREATE TABLE `OrderShowings` (
    `ShowingID` int auto_increment not NULL,
    `OrderID` int not NULL,
    PRIMARY KEY (`ShowingID`, `OrderID`),
    FOREIGN KEY (`ShowingID`) REFERENCES `Showings` (`ShowingID`) ON DELETE CASCADE,
    FOREIGN KEY (`OrderID`) REFERENCES `Orders` (`OrderID`) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `OrderShowings` (`ShowingID`, `OrderID`) VALUES ('2', '1'), ('3', '2'), ('1', '3');

CREATE TABLE `Seats`(
    `SeatsID` int auto_increment not NULL,
    `row`     varchar(20) not NULL,
    `col`     int not NULL,
    `RoomID`  int not NULL,
    `OrderID` int not NULL,
    PRIMARY KEY (`SeatsID`),
    FOREIGN KEY (`RoomID`) REFERENCES `Rooms` (`RoomID`) ON DELETE CASCADE,
    FOREIGN KEY (`OrderID`) REFERENCES `Orders` (`OrderID`) ON DELETE CASCADE
)ENGINE=InnoDB;

INSERT INTO `Seats` (`SeatsID`, `row`, `col`, `RoomID`, `OrderID`) VALUES ('1', 'K', '17', '1', '1'), ('2', 'K', '18', '1', '1'), ('3', 'B', '15', '2', '2'), ('4', 'A', '24', '3', '3');
