"use strict";

/********************************************************************************************
 *                                                                                          *
 * The goal of the task is to get basic knowledge of SQL functions and                      *
 * approaches to work with data in SQL.                                                     *
 * https://dev.mysql.com/doc/refman/5.7/en/function-reference.html                          *
 *                                                                                          *
 * The course do not includes basic syntax explanations. If you see the SQL first time,     *
 * you can find explanation and some trainings at W3S                                       *
 * https://www.w3schools.com/sql/sql_syntax.asp                                             *
 *                                                                                          *
 ********************************************************************************************/

/**
 *  Create a SQL query to return next data ordered by city and then by name:
 * | Employy Id | Employee Full Name | Title | City |
 *
 * @return {array}
 *
 */
async function task_1_1(db) {
  // The first task is example, please follow the style in the next functions.
  let result = await db.query(`
        SELECT
           EmployeeID as "Employee Id",
           CONCAT(FirstName, ' ', LastName) AS "Employee Full Name",
           Title as "Title",
           City as "City"
        FROM Employees
        ORDER BY City, "Employee Full Name"
    `);
  return result[0];
}

/**
 *  Create a query to return an Order list ordered by order id descending:
 * | Order Id | Order Total Price | Total Order Discount, % |
 *
 * NOTES: Discount in OrderDetails is a discount($) per Unit.
 * @return {array}
 *
 */
async function task_1_2(db) {
  let result = await db.query(`
        SELECT
            OrderID as "Order Id",
            SUM(Quantity * UnitPrice) AS "Order Total Price",
            ROUND( SUM( Quantity * Discount) / SUM( Quantity * UnitPrice) * 100, 3) as "Total Order Discount, %"
        FROM OrderDetails 
        GROUP BY OrderID
        ORDER BY OrderID DESC;
    `);
  return result[0];
}

/**
 *  Create a query to return all customers from USA without Fax:
 * | CustomerId | CompanyName |
 *
 * @return {array}
 *
 */
async function task_1_3(db) {
  let result = await db.query(`
    SELECT
        CustomerId as "CustomerId",
        CompanyName as "CompanyName"
    FROM Customers WHERE Country = 'USA' and Fax is NULL
    `);
    return result[0];
}

/**
 * Create a query to return:
 * | Customer Id | Total number of Orders | % of all orders |
 *
 * order data by % - higher percent at the top, then by CustomerID asc
 *
 * @return {array}
 *
 */
async function task_1_4(db) {
  let result = await db.query(`
    SELECT 
        CustomerID as "Customer Id",
        COUNT(*) as "Total number of Orders",
        ROUND(COUNT(*)/(SELECT COUNT(*) FROM Orders)*100, 5) as "% of all orders"
    FROM Orders 
    GROUP BY CustomerID 
    ORDER BY \`% of all orders\` DESC, CustomerID;      
  `);
  return result[0]; 
}

/**
 * Return all products where product name starts with 'A', 'B', .... 'F' ordered by name.
 * | ProductId | ProductName | QuantityPerUnit |
 *
 * @return {array}
 *
 */
async function task_1_5(db) {
  let result = await db.query(`
    SELECT 
        ProductId,
        ProductName,
        QuantityPerUnit
    FROM Products
    WHERE ProductName RLIKE '^[A-F]'
    ORDER BY ProductName;
  `);
  return result[0];
}

/**
 *
 * Create a query to return all products with category and supplier company names:
 * | ProductName | CategoryName | SupplierCompanyName |
 *
 * Order by ProductName then by SupplierCompanyName
 * @return {array}
 *
 */
async function task_1_6(db) {
  let result = await db.query(`
    SELECT 
        ProductName,
        Categories.CategoryName,
        Suppliers.CompanyName as "SupplierCompanyName"
    FROM Products 
    INNER JOIN Suppliers  ON Suppliers.SupplierID = Products.SupplierID
    INNER JOIN Categories  ON Categories.CategoryID = Products.CategoryID
    ORDER BY ProductName, SupplierCompanyName;
  `);
  return result[0];
}

/**
 *
 * Create a query to return all employees and full name of person to whom this employee reports to:
 * | EmployeeId | FullName | ReportsTo |
 *
 * Order data by EmployeeId.
 * Reports To - Full name. If the employee does not report to anybody leave "-" in the column.
 * @return {array}
 *
 */
async function task_1_7(db) {
  let result = await db.query(`
    SELECT 
        empF.EmployeeID as "EmployeeId",
        CONCAT(empF.FirstName, ' ', empF.LastName) as "FullName",
        IFNULL(CONCAT(emp.FirstName, ' ', emp.LastName), "-") as "ReportsTo"
    FROM Employees as empF
    LEFT JOIN Employees as emp ON empF.ReportsTo = emp.EmployeeID
    ORDER BY EmployeeId;
  `);
  return result[0];
}

/**
 *
 * Create a query to return:
 * | CategoryName | TotalNumberOfProducts |
 *
 * @return {array}
 *
 */
async function task_1_8(db) {
  let result = await db.query(`
        SELECT
            Categories.CategoryName,
            COUNT(Products.CategoryID) as "TotalNumberOfProducts"
        FROM Categories
        INNER JOIN Products ON Products.CategoryID = Categories.CategoryID
        GROUP BY Categories.CategoryID
        ORDER BY Categories.CategoryID;
  `);
  return result[0];
}

/**
 *
 * Create a SQL query to find those customers whose contact name containing the 1st character is 'F' and the 4th character is 'n' and rests may be any character.
 * | CustomerID | ContactName |
 *
 * @return {array}
 *
 */
async function task_1_9(db) {
  let result = await db.query(`
        SELECT 
            CustomerID,
            ContactName
        FROM Customers
        WHERE ContactName LIKE 'F__n%';
  `);
  return result[0];
}

/**
 * Write a query to get discontinued Product list:
 * | ProductID | ProductName |
 *
 * @return {array}
 *
 */
async function task_1_10(db) {
  let result = await db.query(`
        SELECT
            ProductID,
            ProductName
        FROM Products
        WHERE Discontinued = 1;  
  `);
  return result[0];
}

/**
 * Create a SQL query to get Product list (name, unit price) where products cost between $5 and $15:
 * | ProductName | UnitPrice |
 *
 * Order by UnitPrice then by ProductName
 *
 * @return {array}
 *
 */
async function task_1_11(db) {
  let result = await db.query(`
        SELECT
          ProductName,
          UnitPrice
        FROM Products
        WHERE UnitPrice BETWEEN 5 AND 15
        ORDER BY UnitPrice, ProductName;
  `);
  return result[0];
}

/**
 * Write a SQL query to get Product list of twenty most expensive products:
 * | ProductName | UnitPrice |
 *
 * Order products by price then by ProductName.
 *
 * @return {array}
 *
 */
async function task_1_12(db) {
  let result = await db.query(`
        SELECT * FROM(
          SELECT
            ProductName,
            UnitPrice
        FROM Products
        ORDER BY UnitPrice DESC LIMIT 20) as P
        ORDER BY UnitPrice, ProductName
  `);
  return result[0];
}

/**
 * Create a SQL query to count current and discontinued products:
 * | TotalOfCurrentProducts | TotalOfDiscontinuedProducts |
 *
 * @return {array}
 *
 */
async function task_1_13(db) {
  let result = await db.query(`
      SELECT
        (SELECT COUNT(ProductID) FROM Products) as 'TotalOfCurrentProducts',
        (SELECT COUNT(*) FROM Products WHERE Discontinued = 1) as 'TotalOfDiscontinuedProducts'
    FROM Products
    LIMIT 1
  `);
  return result[0];
}

/**
 * Create a SQL query to get Product list of stock is less than the quantity on order:
 * | ProductName | UnitsOnOrder| UnitsInStock |
 *
 * @return {array}
 *
 */
async function task_1_14(db) {
  let result = await db.query(`
        SELECT
            ProductName,
            UnitsOnOrder,
            UnitsInStock
        FROM Products
        WHERE UnitsInStock < UnitsOnOrder
  
  `);
  return result[0];
}

/**
 * Create a SQL query to return the total number of orders for every month in 1997 year:
 * | January | February | March | April | May | June | July | August | September | November | December |
 *
 * @return {array}
 *
 */
async function task_1_15(db) {
  let result = await db.query(`
        SELECT
            (COUNT(IF(MONTH(OrderDate) = 1, 1, NULL))) as January,
            (COUNT(IF(MONTH(OrderDate) = 2, 1, NULL))) as February,
            (COUNT(IF(MONTH(OrderDate) = 3, 1, NULL))) as March,
            (COUNT(IF(MONTH(OrderDate) = 4, 1, NULL))) as April,
            (COUNT(IF(MONTH(OrderDate) = 5, 1, NULL))) as May,
            (COUNT(IF(MONTH(OrderDate) = 6, 1, NULL))) as June,
            (COUNT(IF(MONTH(OrderDate) = 7, 1, NULL))) as July,
            (COUNT(IF(MONTH(OrderDate) = 8, 1, NULL))) as August,
            (COUNT(IF(MONTH(OrderDate) = 9, 1, NULL))) as September,
            (COUNT(IF(MONTH(OrderDate) = 10, 1, NULL))) as October,
            (COUNT(IF(MONTH(OrderDate) = 11, 1, NULL))) as November,
            (COUNT(IF(MONTH(OrderDate) = 12, 1, NULL))) as December
        FROM Orders
        WHERE YEAR(OrderDate) = 1997;
  `);
  return result[0];
}

/**
 * Create a SQL query to return all orders where ship postal code is provided:
 * | OrderID | CustomerID | ShipCountry |
 *
 * @return {array}
 *
 */
async function task_1_16(db) {
  let result = await db.query(`
          SELECT
              OrderID,
              CustomerID,
              ShipCountry
          FROM Orders
          WHERE ShipPostalCode IS NOT NULL;  
  `);
  return result[0];
}

/**
 * Create SQL query to display the average price of each categories's products:
 * | CategoryName | AvgPrice |
 *
 * @return {array}
 *
 * Order by AvgPrice descending then by CategoryName
 *
 */
async function task_1_17(db) {
  let result = await db.query(`
          SELECT
              CategoryName,
              AVG(Products.UnitPrice) AS "AvgPrice"
          FROM Categories 
          INNER JOIN Products ON Categories.CategoryID = Products.CategoryID 
          GROUP BY Categories.CategoryID          
          ORDER BY AvgPrice DESC, CategoryName;
  `);
  return result[0];
}

/**
 * Create a SQL query to calcualte total orders count by each day in 1998:
 * | OrderDate | Total Number of Orders |
 *
 * OrderDate needs to be in the format '%Y-%m-%d %T'
 * @return {array}
 *
 */
async function task_1_18(db) {
  let result = await db.query(`
          SELECT
              DATE_FORMAT(OrderDate, '%Y-%m-%d %T') as "OrderDate" ,
              COUNT(OrderID) as "Total Number of Orders"
          FROM Orders
          WHERE YEAR(OrderDate) = 1998
          GROUP BY OrderDate;
  `);
  return result[0];  
}

/**
 * Create a SQL query to display customer details whose total orders amount is more than 10000$:
 * | CustomerID | CompanyName | TotalOrdersAmount, $ |
 *
 * Order by "TotalOrdersAmount, $" descending then by CustomerID
 * @return {array}
 *
 */
async function task_1_19(db) {
  let result = await db.query(`
        SELECT
            Customers.CustomerID,
            Customers.CompanyName,
            SUM(UnitPrice * Quantity) AS 'TotalOrdersAmount, $'
        FROM Customers 
        INNER JOIN Orders ON Orders.CustomerID = Customers.CustomerID
        INNER JOIN OrderDetails ON OrderDetails.OrderID = Orders.OrderID
        GROUP BY CustomerID
        HAVING \`TotalOrdersAmount, $\` > 10000
        ORDER BY \`TotalOrdersAmount, $\` DESC, CustomerID
  `);
  return result[0];
}

/**
 *
 * Create a SQL query to find the employee that sold products for the largest amount:
 * | EmployeeID | Employee Full Name | Amount, $ |
 *
 * @return {array}
 *
 */
async function task_1_20(db) {
  let result = await db.query(`
        SELECT
            Employees.EmployeeID as "EmployeeID",
            CONCAT(Employees.FirstName, " ", Employees.LastName) as "Employee Full Name",
            SUM(OrderDetails.UnitPrice * OrderDetails.Quantity) as "Amount, $"
        FROM Employees
        INNER JOIN Orders ON Orders.EmployeeID = Employees.EmployeeID
        INNER JOIN OrderDetails ON OrderDetails.OrderID = Orders.OrderID
        GROUP BY Employees.EmployeeID
        ORDER BY \`Amount, $\` DESC
        LIMIT 1;
  `);
  return result[0];
}

/**
 * Write a SQL statement to get the maximum purchase amount of all the orders.
 * | OrderID | Maximum Purchase Amount, $ |
 *
 * @return {array}
 */
async function task_1_21(db) {
  let result = await db.query(`
        SELECT
            OrderID,
            SUM(UnitPrice * Quantity)  as "Maximum Purchase Amount, $"
        FROM OrderDetails
        GROUP BY OrderID
        ORDER BY \`Maximum Purchase Amount, $\` DESC
        LIMIT 1    
  `);
  return result[0];
}

/**
 * Create a SQL query to display the name of each customer along with their most expensive purchased product:
 * | CompanyName | ProductName | PricePerItem |
 *
 * order by PricePerItem descending and them by CompanyName and ProductName acceding
 * @return {array}
 */
async function task_1_22(db) {
  let result = await db.query(`
        SELECT DISTINCT
            C.CompanyName,
            P.ProductName,
            OD.UnitPrice as "PricePerItem"
        FROM Customers as C
        JOIN Orders as O ON O.CustomerID = C.CustomerID        
        JOIN OrderDetails as OD ON OD.OrderID = O.OrderID
        JOIN Products as P ON OD.ProductID = P.ProductID
        JOIN (SELECT
          CNew.CustomerID,
          MAX(ODNew.UnitPrice) as 'MaxPrice'
          FROM Customers as CNew
          JOIN Orders as ONew ON ONew.CustomerID = CNew.CustomerID 
          JOIN OrderDetails as ODNew ON ONew.OrderID = ODNew.OrderID 
          GROUP BY CNew.CustomerID) as S
          ON S.CustomerID = C.CustomerID AND S.MaxPrice = OD.UnitPrice
          ORDER BY OD.UnitPrice DESC, C.CompanyName, P.ProductName;
  `);
  return result[0];
}

module.exports = {
    task_1_1: task_1_1,
    task_1_2: task_1_2,
    task_1_3: task_1_3,
    task_1_4: task_1_4,
    task_1_5: task_1_5,
    task_1_6: task_1_6,
    task_1_7: task_1_7,
    task_1_8: task_1_8,
    task_1_9: task_1_9,
    task_1_10: task_1_10,
    task_1_11: task_1_11,
    task_1_12: task_1_12,
    task_1_13: task_1_13,
    task_1_14: task_1_14,
    task_1_15: task_1_15,
    task_1_16: task_1_16,
    task_1_17: task_1_17,
    task_1_18: task_1_18,
    task_1_19: task_1_19,
    task_1_20: task_1_20,
    task_1_21: task_1_21,
    task_1_22: task_1_22
};
