CREATE DATABASE  IF NOT EXISTS `docman` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `docman`;
-- MySQL dump 10.13  Distrib 5.5.40, for debian-linux-gnu (x86_64)
--
-- Host: 127.0.0.1    Database: docman
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
-- Table structure for table `client`
--

DROP TABLE IF EXISTS `client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `referent` int(11) NOT NULL,
  `trash` bit(1) NOT NULL DEFAULT b'0',
  `trash_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_Client_personal_info1_idx` (`referent`),
  CONSTRAINT `fk_Client_personal_info1` FOREIGN KEY (`referent`) REFERENCES `personal_info` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client`
--

LOCK TABLES `client` WRITE;
/*!40000 ALTER TABLE `client` DISABLE KEYS */;
INSERT INTO `client` VALUES (1,'elionhaxhi','desc',12,'\0',NULL);
/*!40000 ALTER TABLE `client` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupon`
--

DROP TABLE IF EXISTS `coupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `coupon` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nr_coupon` varchar(45) NOT NULL,
  `size` int(11) DEFAULT NULL,
  `valid` bit(1) NOT NULL DEFAULT b'1',
  `creation_date` datetime NOT NULL,
  `dead_line` datetime DEFAULT NULL,
  `client_id` int(11) NOT NULL,
  `trash` bit(1) NOT NULL DEFAULT b'0',
  `trash_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_coupon_Client1_idx` (`client_id`),
  CONSTRAINT `fk_coupon_Client1` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupon`
--

LOCK TABLES `coupon` WRITE;
/*!40000 ALTER TABLE `coupon` DISABLE KEYS */;
INSERT INTO `coupon` VALUES (1,'6',6,'','2014-05-20 15:00:00','2016-08-28 16:15:20',1,'\0',NULL);
/*!40000 ALTER TABLE `coupon` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=653 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `description`
--

LOCK TABLES `description` WRITE;
/*!40000 ALTER TABLE `description` DISABLE KEYS */;
INSERT INTO `description` VALUES (1,1,'elion  a',1),(2,2,'esame obbiettivo',1),(3,3,'elion t',1),(4,4,'elion  d',1),(5,2,'Esami da fare',2),(6,3,'Medicine da prendere',2),(7,4,'Guarigione completa',2),(8,1,'La mia seconda visita',2),(9,2,'ereeesame xxxxobietivo up',3),(10,3,'terapia up',3),(11,4,'diagnosi up',3),(12,1,'anamnesi upertetee',3),(13,2,'',4),(14,3,'',4),(15,1,'',4),(16,4,'',4),(17,2,'bbbbupdatebbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',5),(18,1,'descrizione per anafgggggggggbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',5),(19,3,'descrisione per terapiabbbbbbbbbbbbbbbbbbttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt',5),(20,4,'descrizione per diagnosiddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',5),(21,2,'',6),(22,4,'',6),(23,1,'',6),(24,3,'',6),(25,2,'test2',7),(26,1,'test1',7),(27,3,'test3',7),(28,4,'tes4',7),(29,2,'hgh',8),(30,3,'',8),(31,1,'',8),(32,4,'',8),(33,4,'',9),(34,1,'',9),(35,3,'',9),(36,2,'',9),(37,3,'',10),(38,4,'',10),(39,1,'',10),(40,2,'',10),(41,1,'',11),(42,2,'',11),(43,3,'',11),(44,4,'',11),(45,1,'',12),(46,4,'',12),(47,3,'',12),(48,2,'esame obbiettivo',12),(49,3,'',13),(50,4,'',13),(51,2,'',13),(52,1,'Prova',13),(53,3,'terapia',14),(54,4,'dicagnosi',14),(55,1,'anamnesi',14),(56,2,'esame obiettivo',14),(57,2,'',15),(58,3,'',15),(59,4,'',15),(60,1,'',15),(61,2,'',16),(62,1,'',16),(63,3,'',16),(64,4,'',16),(65,2,'',17),(66,4,'mass',17),(67,1,'',17),(68,3,'',17),(69,4,'fgfhfg',18),(70,1,'fghfghf',18),(71,2,'fgfhg',18),(72,3,'gfhgfh',18),(73,2,'',21),(74,3,'',21),(75,4,'',21),(76,1,'',21),(77,2,'questa e una nuova visita2',22),(78,3,'questa e una nuova visita2',22),(79,4,'questa e una nuova visita2',22),(80,1,'questa e una nuova visita2',22),(81,4,'Elion',23),(82,2,'',23),(83,3,'',23),(84,1,'',23),(85,1,'a',24),(86,3,'t',24),(87,4,'d',24),(88,2,'e',24),(89,2,'',25),(90,1,'',25),(91,4,'',25),(92,3,'',25),(93,1,'anamnesi',26),(94,2,'esame obietivo',26),(95,4,'diagnosi',26),(96,3,'terapia',26),(97,4,'nuova visita diagnosi',27),(98,2,'nuova visita esame obietivo',27),(99,3,'nuova visita terapy',27),(100,1,'nuova visita anamnesi',27),(101,1,'a e re',28),(102,4,'d e re',28),(103,3,'t e re',28),(104,2,'e e re',28),(105,1,'elion',29),(106,3,'elionn',29),(107,2,'elio',29),(108,4,'elionnn',29),(109,1,'elion',30),(110,4,'elionnn',30),(111,3,'elionn',30),(112,2,'elio',30),(113,3,'fghfhgghfgfg',31),(114,4,'fghfh',31),(115,2,'dgbfg',31),(116,1,'fghfh',31),(117,4,'w',32),(118,2,'w',32),(119,3,'w',32),(120,1,'w',32),(121,4,'e',33),(122,2,'e',33),(123,1,'e',33),(124,3,'e',33),(125,2,'ee888uuu',34),(126,4,'ee888',34),(127,1,'ee888',34),(128,3,'ee888',34),(129,3,'terapiareter',35),(130,4,'diagnosi',35),(131,2,'fdgdgfdnuovo esame',35),(132,1,'anamnesi',35),(133,3,'tttt',36),(134,4,'ddddd',36),(135,2,'eee',36),(136,1,'aaaa',36),(137,2,'',37),(138,3,'',37),(139,4,'',37),(140,1,'',37),(141,4,'ddm',38),(142,2,'eem',38),(143,3,'ttm',38),(144,1,'aam',38),(145,1,'',39),(146,2,'',39),(147,3,'',39),(148,4,'',39),(149,2,'',40),(150,3,'',40),(151,1,'',40),(152,4,'',40),(153,2,'',41),(154,1,'',41),(155,3,'',41),(156,4,'',41),(157,4,'',42),(158,2,'',42),(159,1,'',42),(160,3,'',42),(161,4,'',43),(162,1,'',43),(163,3,'',43),(164,2,'',43),(165,4,'',44),(166,2,'',44),(167,1,'',44),(168,3,'',44),(169,4,'',45),(170,1,'',45),(171,3,'',45),(172,2,'',45),(173,4,'',46),(174,2,'',46),(175,1,'',46),(176,3,'',46),(177,4,'elion diagnosi',47),(178,2,'elion esame',47),(179,1,'elion anamnesi',47),(180,3,'elion terapia',47),(181,1,'aanmnesi',48),(182,4,'diagnosi',48),(183,3,'terapia',48),(184,2,'esame',48),(185,4,'',49),(186,2,'',49),(187,3,'',49),(188,1,'',49),(189,4,'',50),(190,1,'',50),(191,2,'',50),(192,3,'',50),(193,1,'',51),(194,2,'',51),(195,3,'',51),(196,4,'',51),(197,3,'',52),(198,2,'e',52),(199,1,'',52),(200,4,'',52),(201,3,'',53),(202,4,'',53),(203,2,'2',53),(204,1,'',53),(205,3,'',54),(206,2,'e',54),(207,1,'',54),(208,4,'',54),(209,2,'esame obietivook',55),(210,1,'anamnesiko',55),(211,4,'diagnosiko',55),(212,3,'terapiako',55),(213,2,'',56),(214,1,'',56),(215,4,'',56),(216,3,'',56),(217,3,'',57),(218,1,'',57),(219,4,'',57),(220,2,'',57),(221,1,'anamnesi',58),(222,3,'terapia',58),(223,4,'diagnosi',58),(224,2,'esame obbietivo',58),(225,1,'',59),(226,4,'',59),(227,2,'',59),(228,3,'',59),(229,4,'',60),(230,1,'',60),(231,2,'',60),(232,3,'',60),(233,4,'',61),(234,2,'',61),(235,1,'',61),(236,3,'',61),(237,3,'',62),(238,4,'',62),(239,2,'',62),(240,1,'',62),(241,1,'',63),(242,2,'',63),(243,4,'',63),(244,3,'',63),(245,2,'sok elionewwe',64),(246,1,'okgh',64),(247,4,'ok',64),(248,3,'ok',64),(249,2,'',65),(250,1,'',65),(251,3,'',65),(252,4,'',65),(253,3,'',66),(254,2,' d cdc',66),(255,1,'',66),(256,4,'',66),(257,3,'',67),(258,1,'',67),(259,4,'',67),(260,2,'',67),(261,1,'',68),(262,3,'',68),(263,4,'',68),(264,2,'',68),(265,2,'cd dc d d',69),(266,1,'ggmhgmg',69),(267,3,'ghgmh',69),(268,4,'',69),(269,3,'gfh',70),(270,1,'fgfhfhgfhf',70),(271,4,'',70),(272,2,'fgfh',70),(273,1,'',71),(274,2,'',71),(275,4,'',71),(276,3,'',71),(277,1,'',72),(278,3,'',72),(279,2,'',72),(280,4,'',72),(281,4,'',73),(282,2,'',73),(283,1,'',73),(284,3,'',73),(285,2,'',74),(286,1,'',74),(287,4,'',74),(288,3,'',74),(289,3,'',75),(290,4,'',75),(291,2,'',75),(292,1,'',75),(293,1,'',76),(294,2,'',76),(295,3,'',76),(296,4,'',76),(297,3,'',77),(298,4,'',77),(299,2,'',77),(300,1,'',77),(301,2,'okood',78),(302,4,'',78),(303,3,'',78),(304,1,'',78),(305,1,'',79),(306,2,'',79),(307,4,'',79),(308,3,'',79),(309,4,'',80),(310,2,'',80),(311,3,'',80),(312,1,'',80),(313,1,'',81),(314,2,'',81),(315,4,'',81),(316,3,'',81),(317,2,'as',82),(318,1,'wdce',82),(319,4,'',82),(320,3,'',82),(321,4,'',83),(322,1,'',83),(323,3,'',83),(324,2,'',83),(325,2,'',84),(326,4,'',84),(327,3,'',84),(328,1,'',84),(329,4,'',85),(330,1,'kjkjk',85),(331,2,'',85),(332,3,'',85),(333,3,'',86),(334,4,'',86),(335,2,'',86),(336,1,'',86),(337,2,'',87),(338,3,'',87),(339,1,'',87),(340,4,'',87),(341,1,'gfhfg',88),(342,2,'fghfhgffhgffdfdd',88),(343,3,'',88),(344,4,'',88),(345,4,'',89),(346,3,'',89),(347,2,'',89),(348,1,'',89),(349,1,'',90),(350,3,'',90),(351,2,'eehiefwwd',90),(352,4,'',90),(353,3,'',91),(354,2,'fghfh',91),(355,4,'',91),(356,1,'fg',91),(357,1,'',92),(358,2,'',92),(359,4,'',92),(360,3,'',92),(361,1,'',93),(362,3,'',93),(363,4,'',93),(364,2,'',93),(365,2,'',94),(366,3,'',94),(367,4,'',94),(368,1,'',94),(369,3,'',95),(370,1,'',95),(371,2,'esdglfnrole rpgibjirp rgkbrnproberro rtpirjbprbor tibrjprtbt',95),(372,4,'',95),(373,4,'',96),(374,3,'ewf',96),(375,1,'anamnesigh',96),(376,2,'jbkjmodificha',96),(377,4,'',97),(378,1,'',97),(379,2,'sfvdfok',97),(380,3,'',97),(381,4,'diagnosi dorian ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',98),(382,2,'esame obiettivo dorian ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',98),(383,1,'anamnesi dorian gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg',98),(384,3,'terapia dorian hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh',98),(385,2,'ok',99),(386,4,'',99),(387,3,'',99),(388,1,'',99),(389,3,'',100),(390,4,'',100),(391,1,'',100),(392,2,'',100),(393,1,'anamnesi',101),(394,4,'diagnosi',101),(395,3,'terapia',101),(396,2,'esame obiettivo',101),(397,2,'ee',102),(398,4,'dd',102),(399,1,'aa',102),(400,3,'tt',102),(401,2,'esame',103),(402,3,'terapia',103),(403,4,'diagnosi',103),(404,1,'anamnesi',103),(405,3,'',104),(406,1,'',104),(407,2,'',104),(408,4,'',104),(409,4,'',105),(410,1,'',105),(411,2,'',105),(412,3,'',105),(413,3,'',106),(414,4,'',106),(415,1,'',106),(416,2,'',106),(417,2,'',107),(418,4,'',107),(419,3,'',107),(420,1,'',107),(421,4,'',108),(422,1,'',108),(423,2,'',108),(424,3,'',108),(425,2,'',109),(426,1,'',109),(427,4,'',109),(428,3,'',109),(429,2,'',110),(430,1,'',110),(431,3,'',110),(432,4,'',110),(433,4,'',111),(434,2,'',111),(435,1,'',111),(436,3,'',111),(437,1,'',112),(438,4,'',112),(439,3,'',112),(440,2,'',112),(441,4,'',113),(442,1,'',113),(443,3,'',113),(444,2,'',113),(445,2,'',114),(446,1,'',114),(447,3,'',114),(448,4,'',114),(449,3,'terapia',115),(450,4,'diagnosi',115),(451,1,'anamnesi',115),(452,2,'esame oboettivo',115),(453,3,'terapia',116),(454,2,'elionhaxhi',116),(455,1,'namnesi',116),(456,4,'diagnosi',116),(457,4,'edhe keto diagnosi',117),(458,3,'ketu terapine',117),(459,1,'ketu nje anamnesi',117),(460,2,'ketu shkruaj nje analize',117),(461,4,'f g f',118),(462,1,'f f f bisogno fare un anamnesi dettagliata',118),(463,3,'f fg',118),(464,2,'cd cddfvsf f il paziente e inpaziente cazzo',118),(465,4,'',119),(466,3,'',119),(467,2,'',119),(468,1,'',119),(469,3,'',120),(470,4,'',120),(471,2,'d',120),(472,1,'',120),(473,2,'fdgfh',121),(474,1,'',121),(475,3,'',121),(476,4,'',121),(477,4,'',122),(478,1,'',122),(479,2,'',122),(480,3,'',122),(481,1,'',123),(482,3,'',123),(483,2,'',123),(484,4,'',123),(485,4,'',124),(486,2,'sdc',124),(487,1,'',124),(488,3,'',124),(489,2,'dbdhdf',125),(490,1,'',125),(491,4,'',125),(492,3,'',125),(493,4,'',126),(494,1,'',126),(495,3,'',126),(496,2,'novo',126),(497,4,'sdfsf',127),(498,2,'elion haxhi',127),(499,1,'dsfs',127),(500,3,'dfsfsd',127),(501,2,'esame ok foto fatta',128),(502,3,'',128),(503,1,'dgdg',128),(504,4,'',128),(505,3,'',129),(506,2,'s dgfgdbbbbb',129),(507,1,'',129),(508,4,'',129),(509,2,'dfbgesame',130),(510,1,'anamnesi',130),(511,4,'diagnosi',130),(512,3,'terapia',130),(513,1,'',131),(514,2,'',131),(515,4,'',131),(516,3,'',131),(517,4,'',132),(518,1,'',132),(519,3,'',132),(520,2,'sdfsfsdfgdfg',132),(521,1,'sdfsfd',133),(522,2,'dgdgs',133),(523,3,'sdf',133),(524,4,'dfsfs',133),(525,4,'nuova diagnosi',134),(526,3,'nuova terapia',134),(527,1,'nuovo anamnesidfgdgd',134),(528,2,'cbcvnuovo esame obiettivo',134),(529,3,'terapia fgbfgfb',135),(530,1,'anamnesi',135),(531,4,'diagnosi gbfg',135),(532,2,'esame obbiettivobff',135),(533,2,'esame',136),(534,4,'',136),(535,1,'',136),(536,3,'',136),(537,2,'',137),(538,4,'',137),(539,3,'',137),(540,1,'',137),(541,2,'',138),(542,1,'',138),(543,4,'',138),(544,3,'',138),(545,3,'',139),(546,4,'',139),(547,2,'',139),(548,1,'',139),(549,3,'',140),(550,4,'',140),(551,1,'',140),(552,2,'',140),(553,3,'',141),(554,2,'u',141),(555,1,'',141),(556,4,'',141),(557,2,'dfdgdhgndd',142),(558,3,'',142),(559,1,'hdfdgfdgdg',142),(560,4,'',142),(561,3,'',143),(562,4,'',143),(563,2,'ssgdgfd',143),(564,1,'',143),(565,3,'',144),(566,1,'',144),(567,2,'',144),(568,4,'',144),(569,1,'ss',145),(570,2,'sscc',145),(571,4,'',145),(572,3,'',145),(573,3,'',146),(574,4,'',146),(575,1,'',146),(576,2,'',146),(577,4,'',147),(578,2,'',147),(579,3,'',147),(580,1,'',147),(581,1,'',148),(582,3,'',148),(583,2,'',148),(584,4,'',148),(585,1,'',149),(586,3,'',149),(587,4,'',149),(588,2,'',149),(589,3,'',150),(590,2,'',150),(591,1,'',150),(592,4,'',150),(593,1,'',151),(594,2,'',151),(595,4,'',151),(596,3,'',151),(597,4,'',152),(598,1,'',152),(599,2,'',152),(600,3,'',152),(601,2,'',153),(602,4,'',153),(603,1,'',153),(604,3,'',153),(605,3,'',154),(606,2,'',154),(607,4,'',154),(608,1,'',154),(609,2,'',155),(610,3,'',155),(611,1,'',155),(612,4,'',155),(613,4,'',156),(614,1,'',156),(615,3,'',156),(616,2,'',156),(617,4,'',157),(618,1,'',157),(619,3,'',157),(620,2,'',157),(621,2,'',158),(622,4,'',158),(623,3,'',158),(624,1,'',158),(625,4,'',159),(626,2,'',159),(627,1,'',159),(628,3,'',159),(629,2,'',160),(630,1,'',160),(631,3,'',160),(632,4,'',160),(633,2,'',161),(634,3,'',161),(635,1,'',161),(636,4,'',161),(637,3,'',162),(638,4,'',162),(639,1,'',162),(640,2,'',162),(641,3,'',163),(642,2,'',163),(643,4,'',163),(644,1,'',163),(645,4,'',164),(646,3,'',164),(647,2,'',164),(648,1,'',164),(649,4,'ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',165),(650,3,'ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt',165),(651,2,'elion esame',165),(652,1,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',165);
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
-- Table structure for table `detail`
--

DROP TABLE IF EXISTS `detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `x` int(11) NOT NULL DEFAULT '0',
  `y` int(11) NOT NULL DEFAULT '0',
  `w` int(11) NOT NULL DEFAULT '10',
  `h` int(11) NOT NULL DEFAULT '10',
  `description` text,
  `visit_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_detail_visit1_idx` (`visit_id`),
  CONSTRAINT `fk_detail_visit1` FOREIGN KEY (`visit_id`) REFERENCES `visit` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detail`
--

LOCK TABLES `detail` WRITE;
/*!40000 ALTER TABLE `detail` DISABLE KEYS */;
INSERT INTO `detail` VALUES (1,0,0,0,0,NULL,1),(2,195,137,40,137,'',2),(3,218,506,40,506,'',2),(4,353,345,40,345,'',2),(5,141,347,40,347,'',2),(6,100,413,40,413,'',2),(7,118,488,40,488,'Descrivo il mio nuovo dettaglio',2);
/*!40000 ALTER TABLE `detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detail_has_pictures`
--

DROP TABLE IF EXISTS `detail_has_pictures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `detail_has_pictures` (
  `pictures_id` int(11) NOT NULL,
  `detail_id` int(11) NOT NULL,
  PRIMARY KEY (`pictures_id`,`detail_id`),
  KEY `fk_detail_has_pictures_pictures1_idx` (`pictures_id`),
  KEY `fk_detail_has_pictures_detail1_idx` (`detail_id`),
  CONSTRAINT `fk_detail_has_pictures_pictures1` FOREIGN KEY (`pictures_id`) REFERENCES `picture` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detail_has_pictures`
--

LOCK TABLES `detail_has_pictures` WRITE;
/*!40000 ALTER TABLE `detail_has_pictures` DISABLE KEYS */;
INSERT INTO `detail_has_pictures` VALUES (4,1),(5,1),(6,1),(23,1),(24,1),(30,1),(32,1),(91,1),(92,1),(93,1),(94,1);
/*!40000 ALTER TABLE `detail_has_pictures` ENABLE KEYS */;
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
  `user_type_id` int(11) NOT NULL,
  `coupon_id` int(11) DEFAULT NULL,
  `trash` bit(1) NOT NULL DEFAULT b'0',
  `trash_date` datetime DEFAULT NULL,
  `registration_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `fk_doctor_personal_info1_idx` (`personal_info_id`),
  KEY `fk_doctor_user_type1_idx` (`user_type_id`),
  KEY `fk_doctor_coupon1_idx` (`coupon_id`),
  CONSTRAINT `fk_doctor_coupon1` FOREIGN KEY (`coupon_id`) REFERENCES `coupon` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `fk_doctor_personal_info1` FOREIGN KEY (`personal_info_id`) REFERENCES `personal_info` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_doctor_user_type1` FOREIGN KEY (`user_type_id`) REFERENCES `user_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor`
--

LOCK TABLES `doctor` WRITE;
/*!40000 ALTER TABLE `doctor` DISABLE KEYS */;
INSERT INTO `doctor` VALUES (6,'admin','admin',1,2,1,'\0',NULL,NULL),(7,'doc1','doc1',2,1,NULL,'\0',NULL,NULL),(8,'doc2','doc2',3,1,NULL,'\0',NULL,NULL),(9,'riccardo.berta','test',7,1,NULL,'\0',NULL,'2014-05-26 12:13:48'),(10,'elionpost','elionpost',1,1,NULL,'\0',NULL,'2015-01-06 22:09:52'),(11,'fnht','dgttuuh',36,1,NULL,'\0',NULL,'2015-01-07 00:04:33'),(12,'dori','dori',37,1,NULL,'\0',NULL,'2015-01-07 00:06:08'),(13,'dddddd','dddddd',38,1,NULL,'\0',NULL,'2015-01-07 00:13:09'),(14,'bbbb','bbbb',39,1,NULL,'\0',NULL,'2015-01-07 12:56:13'),(15,'monti','monti',40,1,NULL,'\0',NULL,'2015-01-08 15:24:52'),(16,'sdfsf','sdfs',44,1,NULL,'\0',NULL,'2015-01-08 23:29:05'),(17,'xhuli','xhuli',82,1,NULL,'\0',NULL,'2015-01-23 19:24:27');
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
INSERT INTO `doctor_has_patient` VALUES (6,5),(7,6),(7,7),(9,8),(7,9),(8,10),(6,11),(6,12),(6,13),(6,14),(6,15),(7,16),(7,17),(6,18),(6,19),(6,20),(6,21),(6,22),(6,23),(6,27),(6,28),(6,29),(6,30),(6,31),(10,32),(15,33),(15,34),(15,35),(12,36),(12,37),(12,38),(12,39),(12,40),(12,41),(15,42),(15,43),(12,44),(12,45),(12,46),(6,47),(15,48),(6,49),(6,50),(12,51),(6,52),(15,53),(7,54),(7,55),(7,56),(7,57),(8,58),(6,59),(6,60),(6,61),(7,62),(7,63),(7,64),(7,65),(7,66),(7,67),(7,68),(7,69),(7,70),(6,71),(7,72),(17,73),(17,74),(6,75),(6,76);
/*!40000 ALTER TABLE `doctor_has_patient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `keyword`
--

DROP TABLE IF EXISTS `keyword`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `keyword` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `doctor_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_keyword_doctor1_idx` (`doctor_id`),
  CONSTRAINT `fk_keyword_doctor1` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `keyword`
--

LOCK TABLES `keyword` WRITE;
/*!40000 ALTER TABLE `keyword` DISABLE KEYS */;
INSERT INTO `keyword` VALUES (1,'Keyword1',NULL,NULL),(2,'Keyword2',NULL,NULL),(3,'Keyword3',NULL,NULL),(4,'uhgye',NULL,NULL),(5,'dermatite',NULL,NULL);
/*!40000 ALTER TABLE `keyword` ENABLE KEYS */;
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
  `pictures_id` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `trash` bit(1) NOT NULL DEFAULT b'0',
  `trash_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_patient_pictures1_idx` (`pictures_id`),
  KEY `fk_patient_personal_info1_idx` (`personal_info_id`),
  CONSTRAINT `fk_patient_personal_info1` FOREIGN KEY (`personal_info_id`) REFERENCES `personal_info` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_patient_pictures1` FOREIGN KEY (`pictures_id`) REFERENCES `picture` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--pic
-- Dumping data for table `patient`
--

LOCK TABLES `patient` WRITE;
/*!40000 ALTER TABLE `patient` DISABLE KEYS */;
INSERT INTO `patient` VALUES (5,4,130,'2013-05-10','\0',NULL),(6,5,25,'2014-04-04','\0',NULL),(7,6,26,'2014-04-04','\0',NULL),(8,8,34,'2014-05-26','\0',NULL),(9,9,116,'2014-05-26','','2015-01-21 14:47:24'),(10,10,126,'2014-06-09','\0',NULL),(11,11,1,'2014-07-17','','2014-07-17 18:22:18'),(12,13,1,'2014-08-08','','2015-01-09 14:51:06'),(13,14,41,'2014-08-08','\0',NULL),(14,15,42,'2014-08-08','\0',NULL),(15,16,43,'2014-08-08','\0',NULL),(16,18,105,'2014-08-08','','2015-01-21 14:06:26'),(17,19,1,'2014-08-08','','2014-08-08 14:25:51'),(18,20,1,'2014-08-11','','2014-08-11 12:01:30'),(19,21,1,'2015-01-04','','2015-01-09 14:51:09'),(20,22,1,'2015-01-04','','2015-01-09 14:51:12'),(21,23,1,'2015-01-04','','2015-01-09 14:50:57'),(22,24,2,'2015-01-04','','2015-01-09 14:50:53'),(23,24,2,'2015-01-04','','2015-01-09 14:50:49'),(24,24,1,'2015-01-04','\0',NULL),(25,24,1,'2015-01-04','\0',NULL),(26,25,1,'2015-01-04','\0',NULL),(27,28,1,'2015-01-04','','2015-01-09 14:50:43'),(28,29,1,'2015-01-04','','2015-01-09 14:50:38'),(29,30,1,'2015-01-04','','2015-01-09 14:50:33'),(30,31,1,'2015-01-05','','2015-01-09 14:50:28'),(31,32,1,'2015-01-05','','2015-01-09 14:50:23'),(32,33,1,'2015-01-06','\0',NULL),(33,41,1,'2015-01-08','','2015-01-09 14:27:46'),(34,42,1,'2015-01-08','','2015-01-09 14:27:56'),(35,43,1,'2015-01-08','','2015-01-09 14:27:38'),(36,45,1,'2015-01-09','','2015-01-09 00:56:06'),(37,46,1,'2015-01-09','','2015-01-09 00:57:10'),(38,47,1,'2015-01-09','','2015-01-09 12:52:28'),(39,48,1,'2015-01-09','','2015-01-09 14:26:48'),(40,49,1,'2015-01-09','','2015-01-09 13:15:17'),(41,50,1,'2015-01-09','','2015-01-09 14:23:52'),(42,51,1,'2015-01-09','','2015-01-09 14:31:01'),(43,52,1,'2015-01-09','','2015-01-09 14:30:52'),(44,53,1,'2015-01-09','','2015-01-09 14:36:29'),(45,54,1,'2015-01-09','','2015-01-09 14:36:25'),(46,55,1,'2015-01-09','','2015-01-09 14:36:22'),(47,56,80,'2015-01-10','','2015-01-11 02:30:43'),(48,57,87,'2015-01-10','','2015-01-14 00:15:30'),(49,58,81,'2015-01-10','','2015-01-11 13:39:57'),(50,59,85,'2015-01-11','','2015-01-11 14:22:12'),(51,60,86,'2015-01-11','\0',NULL),(52,61,1,'2015-01-12','','2015-01-21 14:07:54'),(53,62,89,'2015-01-14','\0',NULL),(54,63,123,'2014-04-04','','2015-01-22 15:02:46'),(55,64,121,'2015-01-21','','2015-01-21 21:05:59'),(56,65,133,'2015-01-21','','2015-01-22 14:36:44'),(57,66,125,'2015-01-21','','2015-01-21 22:04:33'),(58,67,128,'2015-01-21','','2015-01-21 22:13:39'),(59,68,129,'2015-01-21','\0',NULL),(60,69,131,'2015-01-21','\0',NULL),(61,70,132,'2015-01-21','\0',NULL),(62,71,134,'2015-01-22','','2015-01-22 14:52:44'),(63,72,135,'2015-01-22','','2015-01-22 15:32:06'),(64,73,137,'2015-01-22','','2015-01-22 20:49:44'),(65,74,138,'2015-01-22','','2015-01-22 17:07:42'),(66,75,139,'2015-01-22','','2015-01-22 17:07:38'),(67,76,140,'2015-01-22','','2015-01-22 20:49:41'),(68,77,166,'2015-01-22','','2015-01-22 20:28:30'),(69,78,167,'2015-01-22','','2015-01-22 20:49:38'),(70,79,1,'2015-01-22','','2015-01-22 20:48:57'),(71,80,169,'2015-01-22','\0',NULL),(72,81,1,'2015-01-22','\0',NULL),(73,83,170,'2015-01-23','\0',NULL),(74,85,1,'2015-01-23','\0',NULL),(75,86,1,'2015-01-24','\0',NULL),(76,87,172,'2015-01-24','','2015-01-25 15:59:36');
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
  `address` varchar(200) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `cellphone` varchar(45) DEFAULT NULL,
  `telephone` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_info`
--

LOCK TABLES `personal_info` WRITE;
/*!40000 ALTER TABLE `personal_info` DISABLE KEYS */;
INSERT INTO `personal_info` VALUES (1,'admin','admin',NULL,NULL,NULL,NULL),(2,'doc1','doc1',NULL,NULL,NULL,NULL),(3,'doc2','doc2',NULL,NULL,NULL,NULL),(4,'Enrico12','Berlinguer','indirizzo5','enrico@gmail.com','123456789','01056743344'),(5,'Riccardo','Berta','Via Milano 34','riccardo.berta@gmail.com','34852654785','108569632'),(6,'Mario','Bros','Via Nintendo 35','mario@nintendo.com','23659857','6585389'),(7,'riccardo','berta','','riccardo.berta@gmail.com',NULL,NULL),(8,'Mi o paz','hff g','','riccardo.berta@gmail.com',NULL,NULL),(9,'elionhaxhi','haxhi','via e bernardini 6','ritarossi@gmail.com','3204150830','010344839'),(10,'ijjn','ghjjjhf','','yyhgt@ghuu.it','',''),(11,'g','cg','vie g','g@gmail.com',NULL,NULL),(12,'test','cupon',NULL,NULL,NULL,NULL),(13,'a','a','a','a@t.com','123','12'),(14,'mario','rossi','test','t@t.com','3491234567','123'),(15,'test','test','teast','t@t.com','123','123'),(16,'t','t','r','t@t.com','12','12'),(18,'fgng','fgng','fghfh','gfhfh@gmail.com','675','662'),(19,'hggjg','dfh','sfgd','fgdgd@gmail.com','45644','463'),(20,'prova','prova','','prova@prova.it',NULL,NULL),(21,'elionn','haxhn','','efrf@gmail.com',NULL,NULL),(22,'gbf','gfbfb','g','gfbgf@gmil.com',NULL,NULL),(23,'fdgnf','fnfg','','dbebe@gmail.com',NULL,NULL),(24,'elion','fgnfhf','','gfhfghf@gmail.com','3204150830',NULL),(25,'vedo','fgnfhf','','gfhfghf@gmail.com','3204150830',NULL),(28,'xxxx','yyyy','','xxxxyyyy@gmail.com','0000000000','0101111111'),(29,'xxxxeee','yyyy','','xxxxyyyy@gmail.com','0000000000','0101111111'),(30,'android','studio','','androidstudio@gmail.com','1111111111',NULL),(31,'wwwwwww','wwww','','wwwwwww@gmail.com',NULL,NULL),(32,'dorian','kepler','via giovanetti','eclipsecepler@gmail.com','22222222',''),(33,'elopost','hpost','','dheyf@gmail.com',NULL,NULL),(36,'fghjhgj','ggjhgg','ghjgj','ghjgjkjh@gmail.com','4354576','4644'),(37,'Dorian','Haxhi','via giovanetti','dori@gmail.com','34485759835','0103456846'),(38,'sssssssss','ssssss','sssssss','sssssss','3333','333333'),(39,'bbbb','bbbb','bbbb','bbbb@gmail.com','11111','23444'),(40,'Monti','Michele','via borgo pila','monti@email.com','3987356849','3936345309'),(41,'dfgfhfh','fghfhg','gfhfgf','gfhgf@gmail.com','232545','45465'),(42,'Elion','Haxhi','via giovanetti','elionhaxhi@gmail.com','3204150830','010345365'),(43,'dfgfhfh','cambiato','gfhfgf','gfhgf@gmail.com','232545','45465'),(44,'sddsfds','sdsfs','sdfsfs','sdfs','22543','35345'),(45,'eliong','haxhi','via giovanetti','elionhaxhi261084@gmail.com','233535644','456465465'),(46,'elio','dgge','dfgfdd','dfdgdfgd@gmail.com','34647665','4547567'),(47,'ryjrtnrn','ttjuturyr','yrtyryry','rtyrytr@gmail.com','234544765','56464564'),(48,'dori','haxhi','gdghrhht','erthryr@gmail.com','1111111111111','5645646'),(49,'elimina','haxhi','via','email@gmail','24456565','55656565'),(50,'gweww','fwwefw','wefww','efwef@gmail.com','254353','5646465'),(51,'wegt','tgwrtgw','trw','rtgrtg@gmail.com','3465','4356464'),(52,'gkkkk','kkkkkk','kkkkkkkk','kkkkkkk@gmail.com','7635767','56745'),(53,'aaaaaa','qqqqqq','qqqqqqq','qqqqqqq@gmail.com','3333333','3333333'),(54,'wwwwwww','wwwwww','wwwwwww','wwwwww@gmail.com','444444','4444444'),(55,'bbbbbbb','bbbbb','bbbbbbb','bbbbbbb@gmail.com','888888','8888888'),(56,'confotoaggiornato','confoto','confoto','confoto@gmail.com','23545434','3434343'),(57,'wwww','www','www','wwwww@gmail.com','34543','34353'),(58,'confoto2','confoto2','confoto2','confoto2@gmail.com','24453564','24675687'),(59,'modificatoeliiondorian','ereerf','erfefefe','efeferef@gmail.com','2342454432','235425'),(60,'Elion','Haxhi','via giovanetti ','elionhaxhi261084@gmail.com','3204150830','0103453645'),(61,'xhulixhuli','haxhi','dkbfhboe','dfbhof@gmail.com','23353','436457'),(62,'Elion','Haxhi','via giovanetti','elionhaxhi261084@gmail.com','3204150830','0138576043'),(63,'elion','newsurna','Via Milano 34','riccardo.berta@gmail.com','34852654785','108569632'),(64,'elion','haxhi','via giovanetti','eliion@gmail.com','336843','248458706'),(65,'dorian','haxhi','via giovanetti','dori@gmail.com','3208746353','2843543'),(66,'testelion','test','dfvbemail','skjebk@gmail.com','35464','4456456'),(67,'elion','gbdff','fgbdf','fdgbgfdgb@gmail.com','323565','543454'),(68,'elion','test1','dvfjbvd','sdjbsjv@gmail.com','43545646','46465465'),(69,'test2','test2','dfjv dfvdhdf','sdjbvsf@gmail.com','43546546','3435343'),(70,'test3','test3','ddf rueigei ','erreerv@gmail.com','34646345345','3453543'),(71,'Dorianhaxhi','Haxhi','via giovanetti','dori@gmail.com','243596505','3445874034'),(72,'elion','haxhi','via givanetti','elion@gmail.com','23444','34444'),(73,'Elion','haxhi','via','elion@gmail.com','348053','34873543'),(74,'elionhaxhi','haxhi','dvnkf','fvknf','43653','365464'),(75,'elion','ha','dflbdh','elion@gmail.com','39875630','438304353'),(76,'elion','haxhi','via','elion@haxhi.com','35477656','567656576'),(77,'s','fdb','fdgd','gfdgdgf@gmail.com','45464','456545'),(78,'Elion','Haxhi','via dvjnr','wefvefrev@gmail.com','24354543','34464564'),(79,'eliovdfmgj','haxhi','dvkdjsk','dfjvkdfvd@gmail.com','24543563','243435'),(80,'provaokhomesolafoto','prvoa','dlkvele','dvlekvfe@gmail.com','38034','4935434'),(81,'elo','haxhi','via','elion@gmail.com','34543353','43433435'),(82,'Xhuliana','Haxhi','via ff','xhuli@gmail.com','3635564','244353'),(83,'elion','e','e','e@gmail.com','5445','5454'),(85,'dorian','haxhi','via','dorigmail.com','387304','3493054'),(86,'ewre','wrwe','wewerw','werwerwr@gmail.com','23567765','678654'),(87,'nuovoelion','nveD','ELKEE','eborbe@gmail.com','348703473','230903');
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
) ENGINE=InnoDB AUTO_INCREMENT=185 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `picture`
--

LOCK TABLES `picture` WRITE;
/*!40000 ALTER TABLE `picture` DISABLE KEYS */;
INSERT INTO `picture` VALUES (1,'default.jpg'),(2,'sencha-large.png'),(4,'p4.jpg'),(5,'p5.jpg'),(6,'p6.jpg'),(15,'p3.jpg'),(16,'p2.jpg'),(23,'v1.jpg'),(24,'v2.jpg'),(25,'1396603815276_1396603781717.jpg'),(26,'supermario.jpg'),(27,'1396604112706_1396604118467.jpg'),(28,'1396604506372_1396604513618.jpg'),(29,'1396604566042_1396604570529.jpg'),(30,'1396604603014_1396604603641.jpg'),(31,'1396605839080_1396605941909.jpg'),(32,'1396606064656_1396606167066.jpg'),(33,'1396608276128_1396608280130.jpg'),(34,'1401099275342_1401099063255.jpg'),(35,'1407832860193_1407833209159.jpg'),(36,'1408438600229_1408438958667.jpg'),(37,'1408438663327_1408439021685.jpg'),(38,'1408439725735_1408440084051.jpg'),(39,'1408441195574_1408441552124.jpg'),(40,'1408441726603_19.jpg'),(41,'1408458133225_4747.jpg'),(42,'1408458609206_4750.jpg'),(43,'1408458624007_4749.jpg'),(44,'1408634192100_1408634550220.jpg'),(45,'1408634477785_21.jpg'),(46,'1408973710632_1408974073830.jpg'),(47,'1411465870061_1411466255720.jpg'),(48,'1411570139748_1411570137087.jpg'),(49,'1420907708440_ciao.jpg'),(50,'1420929699868_ciao.jpg'),(51,'1420931725274_ciao.jpg'),(52,'1420932325635_ciao.jpg'),(53,'1420932406482_ciao.jpg'),(54,'1420932673555_ciao.jpg'),(55,'1420932753550_ciao.jpg'),(56,'1420932906367_ciao.jpg'),(57,'1420933021198_ciao.jpg'),(58,'1420933280871_ciao.jpg'),(59,'1420933373426_ciao.jpg'),(60,'1420933817147_ciao.jpg'),(61,'1420934045115_ciao.jpg'),(62,'1420934110559_ciao.jpg'),(63,'1420934180730_ciao.jpg'),(64,'1420934403446_ciao.jpg'),(65,'1420934545494_ciao.jpg'),(66,'1420934834339_ciao.jpg'),(67,'1420935245310_ciao.jpg'),(68,'1420935342906_ciao.jpg'),(69,'1420935412886_ciao.jpg'),(70,'1420935484227_ciao.jpg'),(71,'1420935583870_ciao.jpg'),(72,'1420935641370_ciao.jpg'),(73,'1420935767766_ciao.jpg'),(74,'1420935850366_ciao.jpg'),(75,'1420935913810_ciao.jpg'),(76,'1420936002918_ciao.jpg'),(77,'1420936753734_ciao.jpg'),(78,'1420939411046_ciao.jpg'),(79,'1420939598511_ciao.jpg'),(80,'1420939835749_ciao.jpg'),(81,'1420978638236_ciao.jpg'),(82,'1420980871858_ciao.jpg'),(83,'1420980920574_ciao.jpg'),(84,'1420980958155_ciao.jpg'),(85,'1420981467163_1420981467115.jpg'),(86,'1420982422510_1420982422498.jpg'),(87,'1420985265216_1420985265204.jpg'),(88,'1421092473430_1421092473419.jpg'),(89,'1421191070616_1421191070560.jpg'),(90,'1421191070616_1421191070560.jpg'),(91,'elion.jpg'),(92,'vv1.jpg'),(93,'vv2.jpg'),(94,'vv3.jpg'),(95,'1421843439282_1421843439229.jpg'),(96,'1421843550865_1421843550810.jpg'),(97,'1421843669347_1421843641785.jpg'),(98,'1421843829112_1421843822117.jpg'),(99,'1421843950437_1421843950360.jpg'),(100,'1421843987421_1421843987332.jpg'),(101,'1421844044667_1421844044584.jpg'),(102,'1421844084500_1421844084413.jpg'),(103,'1421844298975_1421844298900.jpg'),(104,'1421844489105_1421844489014.jpg'),(105,'1421845344613_1421845344378.jpg'),(106,'1421845447074_1421845447047.jpg'),(107,'1421845619743_1421845619714.jpg'),(108,'1421846631033_1421846630965.jpg'),(109,'1421846877139_1421846877104.jpg'),(110,'1421847057211_1421847057119.jpg'),(111,'1421847488626_1421847488582.jpg'),(112,'1421847610371_1421847610328.jpg'),(113,'1421847759316_1421847759229.jpg'),(114,'1421847872450_1421847871989.jpg'),(115,'1421847942634_1421847942592.jpg'),(116,'1421847968759_1421847968720.jpg'),(117,'1421848111977_1421848111931.jpg'),(118,'1421869738750_1421869738718.jpg'),(119,'1421869764355_1421869764352.jpg'),(120,'1421870594062_1421870594050.jpg'),(121,'1421870625786_1421870625785.jpg'),(122,'1421870770890_1421870770885.jpg'),(123,'1421870797437_1421870797432.jpg'),(124,'1421870859251_1421870859245.jpg'),(125,'1421874239471_1421874239457.jpg'),(126,'1421874328535_1421874328532.jpg'),(127,'1421874598273_1421874598271.jpg'),(128,'1421874700834_1421874700834.jpg'),(129,'1421874998715_1421874998715.jpg'),(130,'1421875043016_1421875043007.jpg'),(131,'1421875085821_1421875085822.jpg'),(132,'1421875132812_1421875132803.jpg'),(133,'1421932686872_1421932686772.jpg'),(134,'1421933884907_1421933884785.jpg'),(135,'1421935424339_1421935424217.jpg'),(136,'1421937179131_1421937179033.jpg'),(137,'1421937762478_1421937762385.jpg'),(138,'1421942548182_1421942548038.jpg'),(139,'1421942691786_1421942691665.jpg'),(140,'1421942874722_1421942874593.jpg'),(141,'1421943501900_1421943501770.jpg'),(142,'1421943745431_1421943745303.jpg'),(143,'1421943859837_1421943859680.jpg'),(144,'1421943917477_1421943917303.jpg'),(145,'1421943970660_1421943970507.jpg'),(146,'1421949012119_1421944106069.jpg'),(147,'1421949192860_1421949192696.jpg'),(148,'1421949404481_1421949404280.jpg'),(149,'1421949447779_1421949447588.jpg'),(150,'1421949464449_1421949464237.jpg'),(151,'1421949490805_1421949490573.jpg'),(152,'1421949754182_1421949754020.jpg'),(153,'1421949805996_1421949805834.jpg'),(154,'1421949954449_1421949954282.jpg'),(155,'1421950107948_1421950107719.jpg'),(156,'1421950547824_1421950547657.jpg'),(157,'1421950691857_1421950691626.jpg'),(158,'1421951182704_1421951182535.jpg'),(159,'1421951792307_1421951792126.jpg'),(160,'1421951967672_1421951967433.jpg'),(161,'1421952293452_1421952293269.jpg'),(162,'1421952412671_1421952412433.jpg'),(163,'1421952997685_1421952997502.jpg'),(164,'1421954397838_1421954397650.jpg'),(165,'1421954462757_1421954462570.jpg'),(166,'1421954848161_1421954847968.jpg'),(167,'1421955164768_1421955164578.jpg'),(168,'1421956079970_1421956079775.jpg'),(169,'1422037316389_1422037316212.jpg'),(170,'1422037511758_1422037511750.jpg'),(171,'1422037543591_1422037543580.jpg'),(172,'1422112369078_1422112369033.jpg'),(173,'1422114226053_1422114226037.jpg'),(174,'1422114582778_1422114582738.jpg'),(175,'1422128962385_1422128962311.jpg'),(176,'1422129223805_1422129223791.jpg'),(177,'1422129444481_1422129444473.jpg'),(178,'1422129486660_1422129486655.jpg'),(179,'1422132925319_1422132925304.jpg'),(180,'1422133020594_1422133020589.jpg'),(181,'1422133154020_1422133154008.jpg'),(182,'1422133410385_1422133410376.jpg'),(183,'1422133473548_1422133473540.jpg'),(184,'1422133503060_1422133503055.jpg');
/*!40000 ALTER TABLE `picture` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_type`
--

DROP TABLE IF EXISTS `user_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_type`
--

LOCK TABLES `user_type` WRITE;
/*!40000 ALTER TABLE `user_type` DISABLE KEYS */;
INSERT INTO `user_type` VALUES (1,'base','tipo di utente base'),(2,'administrator','');
/*!40000 ALTER TABLE `user_type` ENABLE KEYS */;
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
  `pictures_id` int(11) NOT NULL,
  `keyword_id` int(11) DEFAULT NULL,
  `trash` bit(1) NOT NULL DEFAULT b'0',
  `trash_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_visit_pictures1_idx` (`pictures_id`),
  KEY `fk_visits_patient1_idx` (`patient_id`),
  KEY `fk_visit_keyword1_idx` (`keyword_id`),
  CONSTRAINT `fk_visits_patient1` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_visit_keyword1` FOREIGN KEY (`keyword_id`) REFERENCES `keyword` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_visit_pictures1` FOREIGN KEY (`pictures_id`) REFERENCES `picture` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=166 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visit`
--

LOCK TABLES `visit` WRITE;
/*!40000 ALTER TABLE `visit` DISABLE KEYS */;
INSERT INTO `visit` VALUES (1,'2014-04-04 13:34:46','2014-04-04 11:34:47',6,27,NULL,'\0',NULL),(2,'2014-04-04 14:05:10','2014-04-04 12:05:10',6,2,NULL,'\0',NULL),(3,'2014-04-04 14:44:27','2014-04-04 12:44:27',6,33,NULL,'\0',NULL),(4,'2014-05-26 16:42:25','2014-05-26 14:42:25',9,2,NULL,'\0',NULL),(5,'2014-07-15 15:02:21','2014-07-15 13:02:21',5,179,2,'\0',NULL),(6,'2014-07-17 15:12:37','2014-07-17 13:12:37',5,2,NULL,'','2014-07-17 13:15:26'),(7,'2014-07-18 15:13:16','2014-07-18 13:13:16',7,2,NULL,'\0',NULL),(8,'2014-08-12 10:44:06','2014-08-12 08:44:06',14,45,NULL,'\0',NULL),(9,'2014-08-19 11:01:25','2014-08-19 09:01:25',12,40,5,'\0',NULL),(10,'2014-08-19 11:45:31','2014-08-19 09:45:31',12,39,NULL,'\0',NULL),(11,'2014-08-19 12:37:29','2014-08-19 10:37:29',12,1,NULL,'\0',NULL),(12,'2014-08-21 17:21:42','2014-08-21 15:21:42',14,44,NULL,'\0',NULL),(13,'2014-08-25 15:40:16','2014-08-25 13:40:16',5,46,NULL,'\0',NULL),(14,'2014-08-28 10:17:48','2014-08-28 08:17:48',13,184,4,'\0',NULL),(15,'2014-09-23 11:57:13','2014-09-23 09:57:13',10,47,NULL,'','2015-01-21 22:06:22'),(16,'2014-09-24 16:48:38','2014-09-24 14:48:38',16,48,NULL,'\0',NULL),(17,'2015-01-01 19:22:57','2015-01-01 18:22:57',5,1,NULL,'','2015-01-23 16:54:00'),(18,'2015-01-02 00:22:49','2015-01-01 23:22:49',5,1,NULL,'','2015-01-21 12:43:43'),(21,'2015-01-12 13:49:08','2015-01-12 12:49:08',5,1,NULL,'','2015-01-21 12:43:40'),(22,'2014-07-15 15:02:21','2014-07-15 13:02:21',5,1,NULL,'','2015-01-21 12:43:36'),(23,'2015-01-15 18:59:46',NULL,5,1,NULL,'','2015-01-21 12:43:32'),(24,'2015-01-16 12:25:40',NULL,5,1,NULL,'','2015-01-21 12:43:27'),(25,'2014-07-15 15:02:21','2014-07-15 13:02:21',5,1,NULL,'','2015-01-21 12:43:22'),(26,'2014-04-04 13:34:46','2014-04-04 11:34:47',6,1,NULL,'','2015-01-21 12:47:12'),(27,'2015-01-20 17:02:50',NULL,6,1,NULL,'','2015-01-21 12:38:48'),(28,'2015-01-20 17:07:41',NULL,6,1,NULL,'','2015-01-20 17:25:51'),(29,'2015-01-21 12:40:02',NULL,6,1,NULL,'','2015-01-21 12:40:39'),(30,'2015-01-21 12:41:11',NULL,6,1,NULL,'','2015-01-21 12:42:00'),(31,'2015-01-21 12:42:05',NULL,6,1,NULL,'','2015-01-21 12:47:06'),(32,'2015-01-21 12:42:19',NULL,6,1,NULL,'','2015-01-21 12:47:03'),(33,'2015-01-21 12:42:34',NULL,6,1,NULL,'','2015-01-21 12:46:59'),(34,'2015-01-21 12:42:44',NULL,6,1,NULL,'','2015-01-21 12:46:56'),(35,'2015-01-21 12:49:48',NULL,6,1,NULL,'\0',NULL),(36,'2015-01-21 21:08:28',NULL,6,1,NULL,'','2015-01-21 21:09:39'),(37,'2015-01-21 21:11:12',NULL,6,1,NULL,'','2015-01-21 21:11:30'),(38,'2015-01-21 21:16:14',NULL,56,1,NULL,'','2015-01-21 21:16:51'),(39,'2015-01-21 21:20:23',NULL,56,1,NULL,'','2015-01-21 21:20:27'),(40,'2015-01-21 21:20:32',NULL,56,1,NULL,'','2015-01-21 21:20:35'),(41,'2015-01-21 21:20:37',NULL,56,1,NULL,'','2015-01-21 21:24:43'),(42,'2015-01-21 21:21:40',NULL,56,1,NULL,'','2015-01-21 21:24:41'),(43,'2015-01-21 21:24:09',NULL,56,1,NULL,'','2015-01-21 21:24:38'),(44,'2015-01-21 21:24:16',NULL,56,1,NULL,'','2015-01-21 21:24:35'),(45,'2015-01-21 21:24:22',NULL,56,1,NULL,'','2015-01-21 21:24:31'),(46,'2015-01-21 21:24:46',NULL,56,1,NULL,'','2015-01-21 21:24:53'),(47,'2015-01-21 21:24:56',NULL,56,1,NULL,'\0',NULL),(48,'2015-01-21 21:34:09',NULL,56,1,NULL,'\0',NULL),(49,'2015-01-21 21:40:12',NULL,56,1,NULL,'','2015-01-21 22:02:49'),(50,'2015-01-21 21:47:03',NULL,56,1,NULL,'','2015-01-21 22:02:47'),(51,'2015-01-21 21:57:47',NULL,56,1,NULL,'','2015-01-21 22:02:44'),(52,'2015-01-21 22:01:46',NULL,56,1,NULL,'','2015-01-21 22:02:42'),(53,'2015-01-21 22:02:05',NULL,56,1,NULL,'','2015-01-21 22:02:38'),(54,'2015-01-21 22:04:07',NULL,57,1,NULL,'\0',NULL),(55,'2015-01-21 22:06:24',NULL,10,1,NULL,'\0',NULL),(56,'2015-01-21 22:10:07',NULL,58,1,NULL,'','2015-01-21 22:11:12'),(57,'2015-01-21 22:10:13',NULL,58,1,NULL,'','2015-01-21 22:12:44'),(58,'2015-01-21 22:10:18',NULL,58,1,NULL,'','2015-01-21 22:11:16'),(59,'2015-01-21 22:12:16',NULL,10,1,NULL,'','2015-01-21 22:12:37'),(60,'2015-01-21 22:12:27',NULL,58,1,NULL,'\0',NULL),(61,'2015-01-21 22:13:15',NULL,58,1,NULL,'\0',NULL),(62,'2015-01-21 22:13:22',NULL,58,1,NULL,'\0',NULL),(63,'2015-01-21 22:13:27',NULL,58,1,NULL,'\0',NULL),(64,'2015-01-21 22:19:06',NULL,61,1,NULL,'\0',NULL),(65,'2015-01-21 22:25:16',NULL,61,1,NULL,'','2015-01-24 14:50:17'),(66,'2015-01-21 22:25:21',NULL,61,1,NULL,'\0',NULL),(67,'2015-01-21 22:25:26',NULL,61,1,NULL,'\0',NULL),(68,'2015-01-21 22:25:31',NULL,61,1,NULL,'','2015-01-24 15:36:51'),(69,'2015-01-21 22:25:35',NULL,61,1,NULL,'\0',NULL),(70,'2015-01-21 22:25:39',NULL,61,1,NULL,'\0',NULL),(71,'2015-01-21 22:25:43',NULL,61,1,NULL,'\0',NULL),(72,'2015-01-21 22:25:47',NULL,61,1,NULL,'\0',NULL),(73,'2015-01-21 22:25:51',NULL,61,1,NULL,'\0',NULL),(74,'2015-01-21 22:25:56',NULL,61,1,NULL,'\0',NULL),(75,'2015-01-21 22:26:01',NULL,61,1,NULL,'','2015-01-24 15:03:35'),(76,'2015-01-21 22:26:06',NULL,61,1,NULL,'','2015-01-24 15:36:47'),(77,'2015-01-21 22:26:11',NULL,61,1,NULL,'\0',NULL),(78,'2015-01-21 22:26:14',NULL,61,1,NULL,'\0',NULL),(79,'2015-01-21 22:26:18',NULL,61,1,NULL,'\0',NULL),(80,'2015-01-21 22:26:23',NULL,61,1,NULL,'\0',NULL),(81,'2015-01-21 22:26:29',NULL,61,1,NULL,'','2015-01-24 15:03:30'),(82,'2015-01-21 22:26:35',NULL,61,1,NULL,'\0',NULL),(83,'2015-01-21 22:26:39',NULL,61,1,NULL,'\0',NULL),(84,'2015-01-21 22:26:43',NULL,61,1,NULL,'','2015-01-24 15:36:36'),(85,'2015-01-21 22:26:47','1970-01-01 01:00:00',61,1,NULL,'\0',NULL),(86,'2015-01-21 22:26:50',NULL,61,1,NULL,'\0',NULL),(87,'2015-01-21 22:26:55',NULL,61,1,NULL,'\0',NULL),(88,'2015-01-21 22:26:59',NULL,61,1,NULL,'\0',NULL),(89,'2015-01-21 22:27:02',NULL,61,1,NULL,'\0',NULL),(90,'2015-01-21 22:27:06',NULL,61,1,NULL,'\0',NULL),(91,'2015-01-21 22:27:09',NULL,61,1,NULL,'\0',NULL),(92,'2015-01-21 22:27:13',NULL,61,1,NULL,'\0',NULL),(93,'2015-01-21 22:27:17',NULL,61,1,NULL,'','2015-01-24 15:36:41'),(94,'2015-01-21 22:27:21',NULL,61,1,NULL,'','2015-01-24 15:03:23'),(95,'2015-01-21 22:27:26',NULL,61,1,NULL,'','2015-01-24 14:49:49'),(96,'2015-01-21 22:27:53',NULL,61,1,NULL,'','2015-01-24 14:49:26'),(97,'2015-01-21 22:28:01',NULL,61,1,NULL,'','2015-01-23 16:57:59'),(98,'2015-01-22 14:38:16',NULL,62,1,NULL,'','2015-01-22 14:49:45'),(99,'2015-01-22 14:48:41',NULL,62,1,NULL,'\0',NULL),(100,'2015-01-22 14:53:07',NULL,54,1,NULL,'\0',NULL),(101,'2015-01-22 14:54:30',NULL,54,1,NULL,'\0',NULL),(102,'2015-01-22 15:00:42',NULL,54,1,NULL,'','2015-01-22 15:01:18'),(103,'2015-01-22 15:01:19',NULL,54,1,NULL,'\0',NULL),(104,'2015-01-22 15:03:49',NULL,63,1,NULL,'','2015-01-22 15:18:15'),(105,'2015-01-22 15:03:52',NULL,63,1,NULL,'','2015-01-22 15:31:55'),(106,'2015-01-22 15:04:35',NULL,63,1,NULL,'','2015-01-22 15:11:52'),(107,'2015-01-22 15:07:09',NULL,63,1,NULL,'','2015-01-22 15:11:50'),(108,'2015-01-22 15:09:17',NULL,63,1,NULL,'','2015-01-22 15:11:47'),(109,'2015-01-22 15:15:20',NULL,63,1,NULL,'','2015-01-22 15:31:39'),(110,'2015-01-22 15:15:31',NULL,63,1,NULL,'','2015-01-22 15:30:16'),(111,'2015-01-22 15:18:00',NULL,63,1,NULL,'','2015-01-22 15:30:14'),(112,'2015-01-22 15:26:08',NULL,63,1,NULL,'','2015-01-22 15:30:11'),(113,'2015-01-22 15:31:58',NULL,63,1,NULL,'\0',NULL),(114,'2015-01-22 15:32:01',NULL,63,1,NULL,'\0',NULL),(115,'2015-01-22 15:33:04',NULL,64,1,NULL,'','2015-01-22 15:33:43'),(116,'2015-01-22 15:35:49',NULL,64,1,NULL,'\0',NULL),(117,'2015-01-22 21:10:39',NULL,59,1,NULL,'\0',NULL),(118,'2015-01-22 23:29:35',NULL,71,1,NULL,'\0',NULL),(119,'2015-01-22 23:29:50',NULL,71,1,NULL,'','2015-01-22 23:30:02'),(120,'2015-01-22 23:47:16',NULL,72,1,NULL,'\0',NULL),(121,'2015-01-22 23:47:22',NULL,72,1,NULL,'\0',NULL),(122,'2015-01-22 23:59:32',NULL,5,1,NULL,'','2015-01-23 16:53:58'),(123,'2015-01-23 14:05:33',NULL,5,1,NULL,'','2015-01-23 16:53:43'),(124,'2015-01-23 14:23:51',NULL,5,1,NULL,'','2015-01-23 16:34:31'),(125,'2015-01-23 14:29:01',NULL,5,1,NULL,'','2015-01-23 16:34:28'),(126,'2015-01-23 16:34:00',NULL,5,1,NULL,'','2015-01-23 16:34:24'),(127,'2015-01-23 16:54:07','1970-01-01 01:00:00',5,181,NULL,'\0',NULL),(128,'2015-01-23 16:55:05',NULL,5,182,NULL,'\0',NULL),(129,'2015-01-23 16:55:09',NULL,5,1,NULL,'\0',NULL),(130,'2015-01-23 16:55:12',NULL,5,1,NULL,'\0',NULL),(131,'2015-01-23 16:55:16',NULL,5,1,NULL,'','2015-01-23 16:55:56'),(132,'2015-01-23 18:29:13',NULL,7,1,NULL,'\0',NULL),(133,'2015-01-23 19:06:48',NULL,6,1,NULL,'','2015-01-24 14:57:59'),(134,'2015-01-23 19:22:29',NULL,71,1,NULL,'','2015-01-24 15:03:11'),(135,'2015-01-23 19:26:11',NULL,73,1,NULL,'\0',NULL),(136,'2015-01-23 19:33:19',NULL,74,1,NULL,'\0',NULL),(137,'2015-01-23 19:33:30',NULL,74,1,NULL,'\0',NULL),(138,'2015-01-23 19:33:34',NULL,74,1,NULL,'\0',NULL),(139,'2015-01-23 19:33:43',NULL,74,1,NULL,'\0',NULL),(140,'2015-01-23 19:34:02',NULL,74,1,NULL,'\0',NULL),(141,'2015-01-23 19:34:14',NULL,74,1,NULL,'\0',NULL),(142,'2015-01-24 00:38:59',NULL,59,1,NULL,'\0',NULL),(143,'2015-01-24 00:39:03',NULL,59,1,NULL,'\0',NULL),(144,'2015-01-24 00:39:08',NULL,59,1,NULL,'\0',NULL),(145,'2015-01-24 14:33:00',NULL,15,1,NULL,'\0',NULL),(146,'2015-01-24 14:47:12',NULL,15,1,NULL,'\0',NULL),(147,'2015-01-24 14:50:08',NULL,61,1,NULL,'','2015-01-24 15:02:12'),(148,'2015-01-24 15:02:31',NULL,14,1,NULL,'','2015-01-24 15:02:41'),(149,'2015-01-24 15:04:15',NULL,75,1,NULL,'','2015-01-24 15:04:34'),(150,'2015-01-24 15:04:36',NULL,75,1,NULL,'\0',NULL),(151,'2015-01-24 15:05:48',NULL,76,1,NULL,'','2015-01-24 15:06:09'),(152,'2015-01-24 15:06:11',NULL,76,1,NULL,'','2015-01-24 15:06:16'),(153,'2015-01-24 15:06:18',NULL,76,1,NULL,'','2015-01-24 15:06:22'),(154,'2015-01-24 15:06:24',NULL,76,1,NULL,'','2015-01-24 15:06:40'),(155,'2015-01-24 15:06:28',NULL,76,1,NULL,'','2015-01-24 15:06:37'),(156,'2015-01-24 15:06:30',NULL,76,1,NULL,'','2015-01-24 15:06:35'),(157,'2015-01-24 15:06:47',NULL,76,1,NULL,'\0',NULL),(158,'2015-01-24 15:07:03',NULL,76,1,NULL,'\0',NULL),(159,'2015-01-24 15:07:07',NULL,76,1,NULL,'','2015-01-24 15:07:12'),(160,'2015-01-24 15:10:50',NULL,60,1,NULL,'','2015-01-24 15:11:13'),(161,'2015-01-24 15:11:18',NULL,15,1,NULL,'\0',NULL),(162,'2015-01-24 15:11:51',NULL,15,1,NULL,'\0',NULL),(163,'2015-01-24 15:28:32',NULL,60,1,NULL,'\0',NULL),(164,'2015-01-24 16:09:20',NULL,5,1,NULL,'\0',NULL),(165,'2015-01-24 16:09:33',NULL,5,1,NULL,'\0',NULL);
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

-- Dump completed on 2015-01-30 20:01:28
