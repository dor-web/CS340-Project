
---------------------------------[SELECTIONS]----------------------------------

--Get all Customers' information to populate Customer dropdown.
--[Administrative tool]
SELECT CustomerID as id, lastName as name, email, address1 as address FROM Customers

--Populate Order Window.
--[User action or Administrative tool]
SELECT Orders.OrderID as id, lastName as name, title, RoomID as room,  OrderStatuses.name as os FROM Orders
JOIN Customers ON Customers.CustomerID = Orders.CustomerID
JOIN OrderShowings ON OrderShowings.OrderID = Orders.OrderID
JOIN Showings ON Showings.ShowingID = OrderShowings.ShowingID
JOIN OrderStatuses ON OrderStatuses.OrderStatusID = Orders.OrderStatusID

--Get seats for order.
--[User action or Administrative tool]
SELECT OrderID as id, GROUP_CONCAT(row, col) as seats FROM Seats
GROUP BY OrderID;

--Populate Seats Page
--[User action or Administrative tool]
SELECT SeatsID as id, row, col, Seats.RoomID as room, Seats.OrderID as so FROM Seats
JOIN Orders ON Orders.OrderID = Seats.OrderID

--------------------------------[/SELECTIONS]----------------------------------

---------------------------------[INSERTIONS]----------------------------------
--Add New Showing
--[Administrative tool]
INSERT INTO Showings (title, time, RoomID, cost) VALUES (:titleInput, :timeInput, :RoomIDInput, :costInput);

--New Customer
--[User action]
INSERT INTO Customers (lastName,email,address1) VALUES (:newlastName, :newemail, :newaddress1);

--Place Order and Add corresponding orderID into Seats
--[User action]
INSERT INTO Orders (CustomerID, seatsQuant, orderDate) VALUES(:activeCustomerID, :seatQuantInput, :dateUponOrder);
SELECT LAST_INSERT_ID() INTO @orderIDForSeat;
INSERT INTO Seats (OrderID, col, row, RoomID) VALUES(@orderIDForSeat, :chosenCol, :chosenRow, :providedRoom);
INSERT INTO OrderShowings (OrderID, ShowingID) VALUES(@orderIDForSeat,(SELECT ShowingID FROM Showings WHERE title=:orderShowing))
--------------------------------[/INSERTIONS]----------------------------------

---------------------------------[DELETIONS]----------------------------------
--Delete Customer
--[Administrative tool or User action]
DELETE FROM Customers WHERE CustomerID = :valued_customer_to_remove;
--Cancel ORDER / Unreserve Seats by Cascade
--[User action]
DELETE FROM Orders WHERE OrderID = :order_selected_by_users_from_list;
--Remove Showing
--[Administrative tool]
DELETE FROM Showings WHERE showingID = :showingID_to_be_removed;

--Remove Seat
--[Administrative tool]
DELETE FROM Seats WHERE SeatsID = :seatID;
---------------------------------[/DELETIONS]----------------------------------

---------------------------------[UPDATES]----------------------------------
--Update Customer information
--[User action]
UPDATE Customers SET lastName = :updatedlastName, email = :updatedemail, address1 = :updatedAddress
WHERE CustomerID = :activeCustomerID;

--Update Showing details
--[Administrative tool]
UPDATE Showings SET time = :newTime, title = :newTitle, cost = :newCost, RoomID = :newRoomID
WHERE showingID = :showingID_to_update;

--Update Order
--[Administrative tool]
UPDATE OrderShowings SET OrderShowings.ShowingID = (SELECT ShowingID FROM Showings WHERE Showings.title = :showingTitle) WHERE OrderID = :orderToUpdate;
UPDATE Seats SET row=:newRow, col=:newCol WHERE Seats.OrderID = :orderID;
--------------------------------[/UPDATES]----------------------------------
