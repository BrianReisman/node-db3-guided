-- A problem was reported by Speedy Express for shipments between April 1 and May 31, 2013:
-- The refrigeration units in some of their ships failed for part of the trip between 
-- certain Eastern US ports and Western Europe. Some of the products may have been spoiled.
--
-- The CEO wants each customer to be contacted and verify whether there were health incidents
-- related to these products (per regulations).
--
-- Write a query that prints the name and phone number of each customer who purchased products
-- through sales people who cover Boston, New York, and Philadelphia, that were shipped to 
-- Western Europe between April 1, 2013 and May 31, 2013.
--
-- The sales people will need to call the customer's contacts and explain the situation.
-- Print the list sorted by sales person, so all of their calls will be grouped together.
-- Provide them with the order number and ship date, and customer contact info.
-- Include the country code so they know how to dial the phone number.
--
-- NOTE: This query will run against the NorthWind database.

SELECT e.FirstName,
       e.LastName,
       e.City,
       e.Country as 'Employee Country',
       e.HomePhone as 'Employee Phone',
       t.TerritoryDescription,
       o.Id as 'Order ID',
       c.CompanyName,
       c.ContactName,
       c.Country as 'Customer Country',
       c.Phone as 'Contact Phone',
       o.ShippedDate
  FROM [Order] AS o
       JOIN
       Customer AS c ON o.CustomerId = c.Id
       JOIN
       OrderDetail AS od ON o.Id = od.OrderId
       JOIN
       Product AS p ON od.ProductId = p.Id
       JOIN
       Category AS cat ON cat.Id = p.CategoryId
       JOIN
       Employee AS e ON e.Id = o.EmployeeId
       JOIN
       EmployeeTerritory AS et ON et.EmployeeId = e.Id
       JOIN
       Territory AS t ON t.Id = et.TerritoryId
       JOIN
       Shipper AS s ON o.ShipVia = s.Id
 WHERE s.CompanyName = 'Speedy Express' AND 
       cat.CategoryName IN ('Confections', 'Dairy Products', 'Meat/Poultry', 'Produce', 'Seafood') AND 
       t.TerritoryDescription IN ('Boston', 'New York', 'Philadelphia') AND 
       o.ShippedDate BETWEEN '2013-04-01' AND '2013-05-31' AND
       o.ShipRegion = 'Western Europe'
 GROUP BY o.Id
 ORDER BY e.LastName, c.CompanyName;

