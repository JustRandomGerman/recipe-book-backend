-- MariaDB dump 10.19  Distrib 10.11.3-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: recipe_book
-- ------------------------------------------------------
-- Server version	10.11.3-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `collection`
--

DROP TABLE IF EXISTS `collection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `collection` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collection`
--

LOCK TABLES `collection` WRITE;
/*!40000 ALTER TABLE `collection` DISABLE KEYS */;
INSERT INTO `collection` VALUES
(1,'Brot'),
(2,'Favoriten');
/*!40000 ALTER TABLE `collection` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `collection_recipes`
--

DROP TABLE IF EXISTS `collection_recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `collection_recipes` (
  `collection_id` int(11) NOT NULL,
  `recipe_id` int(11) NOT NULL,
  PRIMARY KEY (`collection_id`,`recipe_id`),
  KEY `IDX_18d4f55bb451a9e5f856df2208` (`collection_id`),
  KEY `IDX_063a121ac139f75709e62d49c8` (`recipe_id`),
  CONSTRAINT `FK_063a121ac139f75709e62d49c87` FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_18d4f55bb451a9e5f856df22086` FOREIGN KEY (`collection_id`) REFERENCES `collection` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collection_recipes`
--

LOCK TABLES `collection_recipes` WRITE;
/*!40000 ALTER TABLE `collection_recipes` DISABLE KEYS */;
INSERT INTO `collection_recipes` VALUES
(1,3),
(1,8),
(1,9),
(2,2),
(2,6);
/*!40000 ALTER TABLE `collection_recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `image_path`
--

DROP TABLE IF EXISTS `image_path`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `image_path` (
  `path` varchar(255) NOT NULL,
  `recipeId` int(11) DEFAULT NULL,
  PRIMARY KEY (`path`),
  KEY `FK_28c781157dd5136877f707223d1` (`recipeId`),
  CONSTRAINT `FK_28c781157dd5136877f707223d1` FOREIGN KEY (`recipeId`) REFERENCES `recipe` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `image_path`
--

LOCK TABLES `image_path` WRITE;
/*!40000 ALTER TABLE `image_path` DISABLE KEYS */;
INSERT INTO `image_path` VALUES
('1-Marmorkuchen-0.jpg',1),
('2-Hähnchendöner-0.jpg',2),
('3-Fladenbrot-0.jpg',3),
('3-Fladenbrot-1.jpg',3),
('4-Bruschetta-0.jpg',4),
('5-Spaghetti and Meatballs-0.jpg',5),
('6-Spritzkuchen-0.jpg',6),
('7-Pierogi-0.jpg',7),
('8-Brötchen-0.jpg',8),
('9-Kartoffelbrötchen-0.jpg',9);
/*!40000 ALTER TABLE `image_path` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingredient`
--

DROP TABLE IF EXISTS `ingredient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ingredient` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `amount` varchar(255) NOT NULL,
  `ingredient_name` varchar(255) NOT NULL,
  `recipeId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_a19a4b507b9e2d1efd2d73b37bc` (`recipeId`),
  CONSTRAINT `FK_a19a4b507b9e2d1efd2d73b37bc` FOREIGN KEY (`recipeId`) REFERENCES `recipe` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredient`
--

LOCK TABLES `ingredient` WRITE;
/*!40000 ALTER TABLE `ingredient` DISABLE KEYS */;
INSERT INTO `ingredient` VALUES
(1,'250 g','weiche Butter',1),
(2,'5','Eier',1),
(3,'250 g','Zucker',1),
(4,'1 TL','Vanilleextrakt',1),
(5,'200 g','Mehl (Typ 405)',1),
(6,'50 g','Stärke',1),
(7,'5 g','Backpulver',1),
(8,'30 g','Kakaopulver',1),
(9,'1 Prise','Salz',1),
(10,'125 ml','Milch',1),
(11,'1 kg','ausgelöste Hähnchenoberkeulen',2),
(12,'1 Prise','Salz',2),
(13,'2 TL','Paprikapulver',2),
(14,'2 TL','Kreuzkümmel',2),
(15,'2','Knoblauchzehen',2),
(16,'1/2','Zwiebel',2),
(17,'8 EL','Joghurt',2),
(18,'2 EL','Mayonnaise',2),
(19,'1 EL','getrockneter Rosmarin',2),
(20,'1 EL','getrockneter Oregano',2),
(21,'1-2','Knoblauchzehen',2),
(22,'1 EL','Zitronensaft',2),
(23,'1 Prise','Salz',2),
(24,'1','Fladenbrot',2),
(25,'1','Zwiebel',2),
(26,'2','Tomaten',2),
(27,'1/2','Salatkopf',2),
(28,'1/4','Rotkohl',2),
(29,'1/4','Weißkohl',2),
(30,'500 g','Mehl',3),
(31,'300 ml','Wasser',3),
(32,'50 g','10%iger Joghurt',3),
(33,'1 EL','Olivenöl',3),
(34,'10 g','Salz',3),
(35,'1 Päckchen','Trockenhefe',3),
(36,'','Sesam',3),
(37,'','Schwarzkümmel',3),
(38,'3','Tomaten',4),
(39,'4 EL','Olivenöl',4),
(40,'1','Knoblauchzehe',4),
(41,'','frischer Basilikum',4),
(42,'','Salz',4),
(43,'','Pfeffer',4),
(44,'500 g','Rinderhackfleisch',5),
(45,'3','Knoblauchzehen',5),
(46,'25 g','Parmesan',5),
(47,'60 g','Semmelbrösel',5),
(48,'100 ml','Milch',5),
(49,'1 TL','Zwiebelpulver',5),
(50,'1','Ei',5),
(51,'','Salz',5),
(52,'','Pfeffer',5),
(53,'','Olivenöl',5),
(54,'4','Knoblauchzehen',5),
(55,'1 TL','rote Chiliflocken',5),
(56,'800 g','Dosentomaten',5),
(57,'1 handvoll','frischer Basilikum',5),
(58,'500 g','Spaghetti',5),
(59,'','Salz',5),
(60,'','Pfeffer',5),
(61,'165 ml','Wasser',6),
(62,'40 g','Butter',6),
(63,'30 g','Zucker',6),
(64,'100 g','Mehl',6),
(65,'1 Prise','Salz',6),
(66,'3','Eier',6),
(67,'200 g','Puderzucker',6),
(68,'1 Schuss','Milch',6),
(69,'1 kg','Kartoffeln (mehlig)',7),
(70,'','Salz',7),
(71,'100 g','Cheddar',7),
(72,'1 EL','Butter',7),
(73,'1 handvoll','Schnittlauch',7),
(74,'360 g','Mehl',7),
(75,'110 g','Milch',7),
(76,'2','Eier',7),
(77,'7 g','Salz',7),
(78,'10 g','Öl',7),
(79,'2','Zwiebeln',7),
(80,'','Creme Fraiche',7),
(81,'','Schnittlauch',7),
(82,'500 g','Dinkelmehl Typ 630 (Weizenmehl Typ 550)',8),
(83,'300 g','Wasser',8),
(84,'10 g','Salz',8),
(85,'20 g','Sonnenblumenöl',8),
(86,'1 g','frische Hefe (0,5g Trockenhefe)',8),
(87,'400 g','Weizenmehl Typ 550 (Dinkelmehl Typ 630)',9),
(88,'50 g','Roggenmehl Typ 997 (Roggenmehl Typ 1150)',9),
(89,'10 g','Salz',9),
(90,'100 g','geriebene, gekochte Kartoffeln',9),
(91,'270 g','Wasser',9),
(92,'10 g','Honig',9),
(93,'10 g','Butter',9),
(94,'3 g','frische Hefe (1g Trockenhefe)',9);
/*!40000 ALTER TABLE `ingredient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `keyword`
--

DROP TABLE IF EXISTS `keyword`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `keyword` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `keyword_name` varchar(255) NOT NULL,
  `recipeId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_f4ed43d8795132d48a83722915c` (`recipeId`),
  CONSTRAINT `FK_f4ed43d8795132d48a83722915c` FOREIGN KEY (`recipeId`) REFERENCES `recipe` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `keyword`
--

LOCK TABLES `keyword` WRITE;
/*!40000 ALTER TABLE `keyword` DISABLE KEYS */;
INSERT INTO `keyword` VALUES
(1,'Semmel',8),
(2,'Semmel',9);
/*!40000 ALTER TABLE `keyword` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe`
--

DROP TABLE IF EXISTS `recipe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `recipe` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `instructions` text NOT NULL,
  `last_viewed` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe`
--

LOCK TABLES `recipe` WRITE;
/*!40000 ALTER TABLE `recipe` DISABLE KEYS */;
INSERT INTO `recipe` VALUES
(1,'Marmorkuchen','Eine Kastenform mit Butter und Mehl einreiben. Den Ofen auf 170°C Ober-/Unterhitze vorheizen. Die Eier mit dem Salz steif schlagen und nach und nach 150 g von dem Zucker datzgeben bis der Eischnee weiche Spitzen hat. Die weiche Butter, die restlichen 100 g Zucker und das Vanilleextrakt cremig rühren. Beim Rühren die Eigelb nacheinander dazugeben und einen Schuss der Milch mit unterrühren. Den Eischnee vorsichtig unterheben. Mehl, Stärke und Backpulver zusammen in den Teig sieben und nach und nach unterrühren. Die Hälfte des Teigs in die Form geben. Das Kakaopulver mit Milch zu einer zähen Masse verrühren und in den restlichen Teig geben. Den Teig ebenfalls in die Form geben und marmorieren.\n\nIm Ofen für 50-60 Minuten backen lassen und 5 Minuten in der Form auskühlen lassen.',NULL),
(2,'Hähnchendöner','Das Fleisch in Stücke schneiden und mit den Gewürzen vermischen. Die Zwiebel und den Knoblauch dazureiben und alles gut vermischen. Über Nacht im Kühlschrank marinieren lassen und am besten auf Spießen grillen.\n\nFür die Sauce alles in einer Schüssel vermischen und mit Salz abschmecken.','2023-06-15 07:35:11'),
(3,'Fladenbrot','Alles in eine Schüssel geben und ca. 10 Minuten lang kneten. Den Teig eine ¾ h gehen lassen. Den Teig nochmal durchkneten und in eine Kugel rollen und anschließend für 20-30 Minuten mit einem Tuch abgedeckt ruhen lassen. Den Teig gut mit Mehl bestreuen und flach auf dem Backpapier ausdrücken und die Linien mit den Fingern hinein drücken. Den Teig mit Wasser besprühen und Sesam und Schwarzkümmel darüberstreuen.\n\nIn einem vorgeheizten Backofen bei 220°C Umluft für 15-17 Minuten backen.','2023-06-15 07:34:45'),
(4,'Bruschetta','Die Tomaten in kleine Stücke schneiden und mit dem Saft in eine Schüssel geben. Den Knoblauch sehr klein hacken bzw. die sehr klein würfeln und dazugeben. Den Basilikum hineinhacken und mit dem Olivenöl dazugeben. Zum Schluss noch mit Salz und Pfeffer abschmecken und optional eine halbe Stunde ziehen lassen.',NULL),
(5,'Spaghetti and Meatballs','Die Semmelbrösel in der Milch quellen lassen und den Knoblauch sehr fein hacken. Dann alle Zutaten für die Hackbällchen vermischen und für ca. 1 Minute durchkneten. Anschließend portionieren und in eine Kugelform bringen.\n\nDen Knoblauch für die Sauce hacken. Die Hackbällchen in Olivenöl von allen Seiten scharf anbraten und aus dem Topf entfernen. Den Knoblauch und die Chiliflocken hineingeben und ganz kurz andünsten. Die Tomaten und den Basilikum dazugeben und die Sauce köcheln lassen. Die Spaghetti kochen. Die Hackbällchen zurück in die Sauce geben, dass sie vollständig durchgegart werden und zum Schluss die Sauce mit Salz und Pfeffer abschmecken.',NULL),
(6,'Spritzkuchen','Wasser, Butter, Zucker und Salz in einem Topf zum köcheln bringen. Das Mehl dazugeben und kochen bis eine weiße Schicht am Topfboden klebt. Die Masse in eine Schüssel geben und bis lauwarm auskühlen lassen. Die Eier einzeln unterrühren und das Öl zum Frittieren vorheizen. Mit einem Spritzbeutel den Teig auf geöltes Backpapier in Ringform spritzen. Wenn ein Holzspieß im Öl das Sprudeln anfängt den Teig hineingeben und von beiden Seiten goldbraun werden lassen.\n\nDen Puderzucker mit ein wenig Milch verrühren und über die fertigen, ausgekühlten Spritzkuchen geben.','2023-06-15 07:35:00'),
(7,'Pierogi','Die Kartoffeln schälen und in Würfel schneiden. In gesalzenem Wasser kochen, bis man die Kartoffeln leicht zerdrücken kann. Die Kartoffeln abgießen und mit allen anderen Zutaten der Füllung in einer Schüssel zu Stampf zerdrücken und mit Salz und Pfeffer abschmecken. Kann auch schon am Vortag gemacht und in dem Kühlschrank gelagert werden.\n\nDie Eier und die Milch verrühren und mit allen anderen Zutaten vermischen und kneten bis alles zu einem Teig wird. Für 10 Minuten ruhen lassen und für 6-8 Minuten kneten bis der Teig gut dehnbar ist. Den Teig auf einer gemehlten Fläche auf eine Dicke von ca. 3 mm ausrollen und Kreise mit 10 cm Durchmesser ausstechen. Auf die Kreise die Füllung legen, in der Hälfte falten, die Kanten zusammendrücken und mit einer Gabel ein Muster hineindrücken. Auf einem gemehlten Blech ablegen. In einen Topf mit kochendem Wasser geben und warten bis sie das Schwimmen anfangen. Danach noch für 2 Minuten kochen lassen, abschöpfen und abtropfen lassen.\n\nDie Zwiebeln in dünne Streifen schneiden und in ein wenig Butter bräunen. In derselben Pfanne die Pierogi anbraten bis eine schöne Kruste entsteht. Das Creme Fraiche und den Schnittlauch verrühren.',NULL),
(8,'Brötchen','Das Rezept macht 9 Brötchen.\n\nDie Hefe in kaltem Wasser lösen und das Öl dazugeben. Das Salz und das Mehl in die Schüssel mit der Flüssigkeit geben und kneten bis kein trockenes Mehl übrig ist. Den Teig bei Zimmertemperatur 8-10 Stunden gehen lassen. Den Teig in 9 90 g Stückchen teilen, zu Ovalen formen und für 30-45 Minuten gehen lassen, bis sich die Größe verdoppelt hat. Den Ofen auf 250°C Ober-/Unterhitze vorheizen. Die Brötchen 1 cm tief einschneiden und mit Wasser besprühen. Anschließend mit Dampf für 20 Minuten backen.','2023-06-15 07:34:10'),
(9,'Kartoffelbrötchen','Die Mehlarten und das Salz in einer Schüssel vermengen. Die Hefe in dem Wasser bei Zimmertemperatur auflösen und in das Mehl geben. Den Honig, die Butter und die grob geriebenen Kartoffeln mit in die Mischung geben. Den Teig kneten, bis alles gut vermischt ist. Anschließend noch für 7-8 Minuten  durchkneten bis der Teig schön glatt ist. In einer leicht geölten Schüssel bei Zimmertemperatur für 1 h gehen lassen und danach für 10-12 h in den Kühlschrank stellen.\n\nDen Teig in 9 94 g Stücke teilen und in einer Hand mit viel Mehl zu einer Kugel rollen, sodass unten Risse im Teig bleiben. Mit der rissigen Seite nach unten auf ein mehliges Tuch legen, mit einem Tuch abdecken und für 30 Minuten gehen lassen.\n\nDen Ofen auf 220°C (240°C) Ober-Unterhitze vorheizen. Einen Topf mit Wasser in den Ofen stellen. Die Brötchen auf mittlerer Schiene backen. Nach 10 Minuten die Tür öffnen und Dampf ablassen. Nach weiteren 10 Minuten nochmal den Dampf ablassen, die Temperatur auf 180°C reduzieren und für 5 weitere Minuten backen.','2023-06-15 07:33:45');
/*!40000 ALTER TABLE `recipe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tag_name` varchar(255) NOT NULL,
  `recipeId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_a9ecb25b2b9ff74ef9cf9bdd0a2` (`recipeId`),
  CONSTRAINT `FK_a9ecb25b2b9ff74ef9cf9bdd0a2` FOREIGN KEY (`recipeId`) REFERENCES `recipe` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag`
--

LOCK TABLES `tag` WRITE;
/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
INSERT INTO `tag` VALUES
(1,'snack',1),
(2,'allyear',1),
(3,'vegetarian',1),
(4,'lunch',2),
(5,'allyear',2),
(6,'lunch',3),
(7,'allyear',3),
(8,'dinner',4),
(9,'allyear',4),
(10,'lunch',5),
(11,'allyear',5),
(12,'italian',5),
(13,'snack',6),
(14,'allyear',6),
(15,'lunch',7),
(16,'allyear',7),
(17,'german',8),
(18,'vegan',8),
(19,'breakfast',8),
(20,'lactose free',8),
(21,'vegetarian',8),
(22,'german',9),
(23,'breakfast',9),
(24,'vegetarian',9);
/*!40000 ALTER TABLE `tag` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-15  9:35:47
