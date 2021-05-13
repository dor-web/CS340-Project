
---------------------------------[SELECTIONS]----------------------------------

--Get all Customers' information to populate Customer dropdown.
--[Administrative tool]
SELECT lastName, email FROM Customers;

--Select the Order information and reserved seats of a particular customer.
--[User action or Administrative tool]
SELECT Seats.OrderID, Orders.orderDate, CONCAT(row, col) from Seats
JOIN Orders ON Orders.OrderID = Seats.OrderID AND Orders.CustomerID = :customer_ID_of_interest;
--SELECT Orders.CustomerID, orderDate, OrderStatuses.name AS OrderStatusID FROM Orders INNER JOIN OrderStatuses ON Orders.OrderStatusID = OrderStatuses.OrderStatusID;

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
DELETE FROM Showings WHERE showingID = :showingID_to_be_removed
---------------------------------[/DELETIONS]----------------------------------

---------------------------------[UPDATES]----------------------------------
--Update Customer information
--[User action]
UPDATE Customers SET lastName = :updatedlastName, email = :updatedemail, address1 = :updatedAddress
WHERE CustomerID = :activeCustomerID;
--Update Order Status
--[Administrative tool]
UPDATE Orders SET orderStatusID = :newOrderStatusID
WHERE OrderID = :orderID_to_update;
--Update Showing details
--[Administrative tool]
UPDATE Showings SET time = :newTime, title = :newTitle, cost = :newCost, RoomID = :newRoomID
WHERE showingID = :showingID_to_update;
--------------------------------[/UPDATES]----------------------------------
