CREATE DATABASE  IF NOT EXISTS `prv` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `prv`;
-- MySQL dump 10.13  Distrib 5.5.40, for debian-linux-gnu (x86_64)
--
-- Host: 127.0.0.1    Database: prv
-- ------------------------------------------------------
-- Server version	5.5.40-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `description`
--

DROP TABLE IF EXISTS `description`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `description` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` int(11) NOT NULL,
  `content` text,
  `visit_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_description_description_type1_idx` (`type`),
  KEY `fk_description_visit1_idx` (`visit_id`),
  CONSTRAINT `fk_description_description_type1` FOREIGN KEY (`type`) REFERENCES `description_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_description_visit1` FOREIGN KEY (`visit_id`) REFERENCES `visit` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `description`
--

LOCK TABLES `description` WRITE;
/*!40000 ALTER TABLE `description` DISABLE KEYS */;
INSERT INTO `description` VALUES (13,2,'esame obiettivo update',6),(14,1,'elion  anamnesi',6),(15,3,'elion terapia',6),(16,4,'elion  diagnosi',6),(17,3,'elion terapia modificata ',7),(18,1,'elion  anamnesi',7),(19,2,'esame obiettivo',7),(20,4,'elion  diagnosi',7),(21,3,'elion terapia',8),(22,4,'elion  diagnosi',8),(23,2,'esame obiettivo',8),(24,1,'elion  anamnesi',8),(25,1,'elion  anamnesi',9),(26,4,'elion  diagnosi',9),(27,3,'elion terapia',9),(28,2,'esame obiettivo',9),(29,3,'',10),(30,4,'',10),(31,1,'',10),(32,2,'',10),(33,3,'',11),(34,4,'',11),(35,2,'e',11),(36,1,'',11),(37,1,'',12),(38,3,'',12),(39,2,'',12),(40,4,'',12),(41,2,'',13),(42,1,'',13),(43,3,'',13),(44,4,'',13),(45,2,'',14),(46,3,'',14),(47,1,'',14),(48,4,'',14),(49,4,'',15),(50,1,'',15),(51,3,'',15),(52,2,'',15),(53,4,'',16),(54,3,'',16),(55,1,'',16),(56,2,'e',16),(57,3,'terapi',17),(58,1,'anamnesi',17),(59,2,'esame: fghjgj\nmbiemri:\nanalizat e gjaku: \n',17),(60,4,'diadnosi',17);
/*!40000 ALTER TABLE `description` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `description_type`
--

DROP TABLE IF EXISTS `description_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `description_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `description_type`
--

LOCK TABLES `description_type` WRITE;
/*!40000 ALTER TABLE `description_type` DISABLE KEYS */;
INSERT INTO `description_type` VALUES (1,'Anamnesi'),(2,'Esame obiettivo'),(3,'Terapia'),(4,'Diagnosi');
/*!40000 ALTER TABLE `description_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor`
--

DROP TABLE IF EXISTS `doctor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `doctor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `personal_info_id` int(11) NOT NULL,
  `trash` bit(1) NOT NULL DEFAULT b'0',
  `trash_date` datetime DEFAULT NULL,
  `registration_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `fk_doctor_personal_info_idx` (`personal_info_id`),
  CONSTRAINT `fk_doctor_personal_info` FOREIGN KEY (`personal_info_id`) REFERENCES `personal_info` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor`
--

LOCK TABLES `doctor` WRITE;
/*!40000 ALTER TABLE `doctor` DISABLE KEYS */;
INSERT INTO `doctor` VALUES (1,'elion.haxhi','sj9gvcsesgh',1,'\0',NULL,'2015-01-31 21:42:16'),(2,'dorian.haxhi','sj9gvcsesgh',7,'\0',NULL,'2015-02-06 16:42:57');
/*!40000 ALTER TABLE `doctor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor_has_patient`
--

DROP TABLE IF EXISTS `doctor_has_patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `doctor_has_patient` (
  `doctor_id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  PRIMARY KEY (`doctor_id`,`patient_id`),
  KEY `fk_doctor_has_patient_patient1_idx` (`patient_id`),
  KEY `fk_doctor_has_patient_doctor1_idx` (`doctor_id`),
  CONSTRAINT `fk_doctor_has_patient_doctor1` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_doctor_has_patient_patient1` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor_has_patient`
--

LOCK TABLES `doctor_has_patient` WRITE;
/*!40000 ALTER TABLE `doctor_has_patient` DISABLE KEYS */;
INSERT INTO `doctor_has_patient` VALUES (1,1),(1,2),(1,3),(1,4),(1,5),(2,6),(1,7);
/*!40000 ALTER TABLE `doctor_has_patient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patient`
--

DROP TABLE IF EXISTS `patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patient` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personal_info_id` int(11) NOT NULL,
  `picture_id` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `trash` bit(1) NOT NULL DEFAULT b'0',
  `trash_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_patient_personal_info1_idx` (`personal_info_id`),
  KEY `fk_patient_picture1_idx` (`picture_id`),
  CONSTRAINT `fk_patient_personal_info1` FOREIGN KEY (`personal_info_id`) REFERENCES `personal_info` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_patient_picture1` FOREIGN KEY (`picture_id`) REFERENCES `picture` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient`
--

LOCK TABLES `patient` WRITE;
/*!40000 ALTER TABLE `patient` DISABLE KEYS */;
INSERT INTO `patient` VALUES (1,2,3,'2013-05-10','','2015-02-06 16:53:15'),(2,3,1,'2013-05-10','','2015-02-06 16:41:30'),(3,4,1,'2013-05-10','','2015-02-05 21:01:20'),(4,5,1,'2013-05-10','','2015-02-05 21:01:34'),(5,6,1,'2015-02-06','','2015-02-06 16:41:07'),(6,8,1,'2015-02-06','','2015-02-06 16:45:54'),(7,9,5,'2015-02-06','\0',NULL);
/*!40000 ALTER TABLE `patient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_info`
--

DROP TABLE IF EXISTS `personal_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personal_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `surname` varchar(45) NOT NULL,
  `address` varchar(200) DEFAULT 'null',
  `email` varchar(100) DEFAULT 'null',
  `cellphone` varchar(45) DEFAULT 'null',
  `telephone` varchar(45) DEFAULT 'null',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_info`
--

LOCK TABLES `personal_info` WRITE;
/*!40000 ALTER TABLE `personal_info` DISABLE KEYS */;
INSERT INTO `personal_info` VALUES (1,'elion','haxhi','via giovanrtti','elionhaxhi261084@gmail.com','3204150830','0109756829'),(2,'ELION','Haxhi','indirizzo5','enrico@gmail.com','123456789','01056743344'),(3,'Enrico12','Berlinguer','indirizzo5','enrico@gmail.com','123456789','01056743344'),(4,'Enrico12','Berlinguer','indirizzo5','enrico@gmail.com','123456789','01056743344'),(5,'Enrico12','Berlinguer','indirizzo5','enrico@gmail.com','123456789','01056743344'),(6,'test','test','via giovanetti ','elion@gmail.com','438753','34530'),(7,'dorian','haxhi','via giovanetti','dori@gmail.com','33083','345353'),(8,'test','test','via','email','46576564','34535453'),(9,'newrrtyryrytr','cnewrtyrtyrytr','via','email','cel','tel');
/*!40000 ALTER TABLE `personal_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `picture`
--

DROP TABLE IF EXISTS `picture`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `picture` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `picture`
--

LOCK TABLES `picture` WRITE;
/*!40000 ALTER TABLE `picture` DISABLE KEYS */;
INSERT INTO `picture` VALUES (1,'default.jpg'),(2,'default.jpg'),(3,'1423229206845_1423229206833.jpg'),(4,'1423237015045_1423237014981.jpg'),(5,'1423238130720_1423238130693.jpg');
/*!40000 ALTER TABLE `picture` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visit`
--

DROP TABLE IF EXISTS `visit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `visit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `creation_date` datetime NOT NULL,
  `lastmod_date` datetime DEFAULT NULL,
  `patient_id` int(11) NOT NULL,
  `picture_id` int(11) NOT NULL,
  `trash` bit(1) NOT NULL DEFAULT b'0',
  `trash_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_visit_picture1_idx` (`picture_id`),
  KEY `fk_visit_patient1_idx` (`patient_id`),
  CONSTRAINT `fk_visit_patient1` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_visit_picture1` FOREIGN KEY (`picture_id`) REFERENCES `picture` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visit`
--

LOCK TABLES `visit` WRITE;
/*!40000 ALTER TABLE `visit` DISABLE KEYS */;
INSERT INTO `visit` VALUES (6,'2013-05-10 00:00:00',NULL,1,2,'','2015-02-05 17:23:26'),(7,'2013-05-10 00:00:00',NULL,1,2,'\0',NULL),(8,'2013-05-10 00:00:00',NULL,1,2,'','2015-02-06 14:18:09'),(9,'2013-05-10 00:00:00',NULL,1,2,'\0',NULL),(10,'2015-02-06 16:35:45',NULL,1,1,'','2015-02-06 16:36:36'),(11,'2015-02-06 16:36:43',NULL,2,4,'\0',NULL),(12,'2015-02-06 16:40:03',NULL,5,1,'\0',NULL),(13,'2015-02-06 16:40:06',NULL,5,1,'\0',NULL),(14,'2015-02-06 16:40:09',NULL,5,1,'\0',NULL),(15,'2015-02-06 16:40:13',NULL,5,1,'\0',NULL),(16,'2015-02-06 16:43:51',NULL,6,1,'\0',NULL),(17,'2015-02-06 18:11:43',NULL,7,1,'\0',NULL);
/*!40000 ALTER TABLE `visit` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-02-06 18:21:57
