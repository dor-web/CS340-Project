-- get all Customers' information to populate Customer dropdown.
SELECT lastName, email FROM Customers

-- get all characters and their homeworld name for the List People page
SELECT Orders.CustomerID, orderDate, OrderStatuses.name AS OrderStatusID FROM Orders INNER JOIN OrderStatuses ON Orders.OrderStatusID = OrderStatuses.OrderStatusID; 

-- add a new character
INSERT INTO Showings (ShowingID, title, time, RoomID, cost) VALUES ('4', 'Wrath of Man', '2021-05-13 16:40:0.000000', '2', '15');

-- do you understand this part below it was mention in canvas but I do not fully understand if this is just a notation or something that actually functions.
-- INSERT INTO Showings (ShowingID, title, time, RoomID, cost) VALUES (:ShowingIDInput, :titleInput, :timeInput, :RoomIDInput, :costInput);
