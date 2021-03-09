-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 09, 2021 at 02:49 PM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `videoconf`
--

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `Transaction_Id` int(11) NOT NULL,
  `From_User_Mobile_No` varchar(10) DEFAULT NULL,
  `To_User_Mobile_No` varchar(10) DEFAULT NULL,
  `Call_Duration` int(11) NOT NULL,
  `Created_Time` date NOT NULL DEFAULT current_timestamp(),
  `Modified_Time` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`Transaction_Id`, `From_User_Mobile_No`, `To_User_Mobile_No`, `Call_Duration`, `Created_Time`, `Modified_Time`) VALUES
(4, '1234567890', '9482645566', 600, '2021-03-09', '2021-03-09'),
(5, '7483334815', '1234567890', 300, '2021-03-09', '2021-03-09'),
(6, '7483334815', '7411597064', 300, '2021-03-09', '2021-03-09'),
(7, '7411597064', '7483334815', 600, '2021-03-09', '2021-03-09'),
(8, '7483334815', '7411597064', 600, '2021-03-09', '2021-03-09'),
(9, '7411597064', '7483334815', 600, '2021-03-09', '2021-03-09'),
(10, '7483334815', '7411597064', 600, '2021-03-09', '2021-03-09'),
(11, '7411597064', '7483334815', 300, '2021-03-09', '2021-03-09');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `User_Id` int(20) NOT NULL,
  `User_Name` varchar(50) DEFAULT NULL,
  `User_Mobile_No` varchar(10) DEFAULT NULL,
  `User_Busy_Status` tinyint(1) NOT NULL DEFAULT 0,
  `Created_Time` date NOT NULL DEFAULT current_timestamp(),
  `Updated_Time` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`User_Id`, `User_Name`, `User_Mobile_No`, `User_Busy_Status`, `Created_Time`, `Updated_Time`) VALUES
(9, 'Sample User', '1234567890', 0, '2021-03-06', '2021-03-06'),
(12, 'Naveen', '7483334815', 0, '2021-03-08', '2021-03-08'),
(13, 'Anususya V ', '7411597064', 0, '2021-03-08', '2021-03-08'),
(14, 'naven 3', '9482645566', 0, '2021-03-08', '2021-03-08'),
(15, 'Naveen 2', '7411597274', 0, '2021-03-08', '2021-03-08');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`Transaction_Id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`User_Id`),
  ADD UNIQUE KEY `User_Id` (`User_Id`),
  ADD UNIQUE KEY `User_Mobile_No` (`User_Mobile_No`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `Transaction_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `User_Id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
