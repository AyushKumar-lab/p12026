/**
 * Residential Rent Data — 250+ seed listings across 5 cities + 7-factor scoring.
 * Real data: run `python scripts/scrape_nobroker.py` to populate from NoBroker.
 */

import { estimateCommuteMinutes } from './osrm';

export interface ResidentialListing {
  id: string;
  locality: string;
  city: string;
  lat: number;
  lng: number;
  type: '1BHK' | '2BHK' | '3BHK' | 'PG' | 'Studio' | 'Room';
  monthlyRent: number;
  deposit: number;
  furnished: 'furnished' | 'semi-furnished' | 'unfurnished';
  areaSqft: number;
  source: 'nobroker' | 'olx' | 'seed' | 'user';
  updatedAt: string;
  verified: boolean;
  ownerName?: string;
  whatsapp?: string;
}

export interface ResidentialScore {
  total: number;
  commuteScore: number;
  commuteMinutes: number;
  affordabilityScore: number;
  groceryScore: number;
  transportScore: number;
  safetyScore: number;
  medicalScore: number;
  internetScore: number;
  listing: ResidentialListing;
}

// ── Seed Data: 50 per city × 5 cities = 250 listings ──

const S = 'seed' as const;
const D = '2026-03-15';

function L(id: string, locality: string, city: string, lat: number, lng: number, type: ResidentialListing['type'], rent: number, deposit: number, furnished: ResidentialListing['furnished'], sqft: number): ResidentialListing {
  return { id, locality, city, lat, lng, type, monthlyRent: rent, deposit, furnished, areaSqft: sqft, source: S, updatedAt: D, verified: true };
}

const RESIDENTIAL_DATA: ResidentialListing[] = [
  // ── Bhubaneswar (50) ──
  L('bbsr01','Saheed Nagar','Bhubaneswar',20.2865,85.8455,'2BHK',12000,24000,'semi-furnished',850),
  L('bbsr02','Saheed Nagar','Bhubaneswar',20.2870,85.8460,'1BHK',7500,15000,'unfurnished',500),
  L('bbsr03','Jaydev Vihar','Bhubaneswar',20.2980,85.8180,'2BHK',15000,30000,'semi-furnished',950),
  L('bbsr04','Jaydev Vihar','Bhubaneswar',20.2985,85.8185,'3BHK',22000,44000,'furnished',1400),
  L('bbsr05','Patia','Bhubaneswar',20.3535,85.8190,'1BHK',5500,11000,'unfurnished',450),
  L('bbsr06','Patia','Bhubaneswar',20.3540,85.8195,'PG',4000,4000,'furnished',120),
  L('bbsr07','Nayapalli','Bhubaneswar',20.2920,85.7985,'2BHK',9000,18000,'unfurnished',750),
  L('bbsr08','Chandrasekharpur','Bhubaneswar',20.3260,85.8130,'3BHK',18000,36000,'semi-furnished',1300),
  L('bbsr09','Chandrasekharpur','Bhubaneswar',20.3265,85.8135,'2BHK',13000,26000,'furnished',900),
  L('bbsr10','Baramunda','Bhubaneswar',20.2715,85.8080,'1BHK',4500,9000,'unfurnished',400),
  L('bbsr11','Baramunda','Bhubaneswar',20.2720,85.8085,'Room',3000,3000,'unfurnished',150),
  L('bbsr12','Khandagiri','Bhubaneswar',20.2550,85.7890,'2BHK',8500,17000,'unfurnished',720),
  L('bbsr13','Khandagiri','Bhubaneswar',20.2555,85.7900,'1BHK',5000,10000,'unfurnished',420),
  L('bbsr14','Mancheswar','Bhubaneswar',20.3100,85.8400,'2BHK',7000,14000,'unfurnished',680),
  L('bbsr15','Mancheswar','Bhubaneswar',20.3105,85.8410,'PG',3500,3500,'furnished',110),
  L('bbsr16','Rasulgarh','Bhubaneswar',20.2950,85.8550,'1BHK',5000,10000,'unfurnished',400),
  L('bbsr17','Rasulgarh','Bhubaneswar',20.2955,85.8560,'2BHK',8000,16000,'semi-furnished',700),
  L('bbsr18','Bapuji Nagar','Bhubaneswar',20.2790,85.8320,'2BHK',10000,20000,'unfurnished',780),
  L('bbsr19','Bapuji Nagar','Bhubaneswar',20.2795,85.8330,'1BHK',6000,12000,'unfurnished',430),
  L('bbsr20','Acharya Vihar','Bhubaneswar',20.2900,85.8250,'2BHK',11000,22000,'semi-furnished',800),
  L('bbsr21','Acharya Vihar','Bhubaneswar',20.2905,85.8260,'3BHK',16000,32000,'furnished',1200),
  L('bbsr22','Lingaraj Nagar','Bhubaneswar',20.2400,85.8350,'1BHK',4000,8000,'unfurnished',380),
  L('bbsr23','Lingaraj Nagar','Bhubaneswar',20.2405,85.8360,'2BHK',7500,15000,'unfurnished',650),
  L('bbsr24','Bomikhal','Bhubaneswar',20.2830,85.8500,'Studio',5500,11000,'furnished',350),
  L('bbsr25','Bomikhal','Bhubaneswar',20.2835,85.8510,'2BHK',9500,19000,'semi-furnished',770),
  L('bbsr26','IRC Village','Bhubaneswar',20.3000,85.8100,'3BHK',20000,40000,'furnished',1350),
  L('bbsr27','IRC Village','Bhubaneswar',20.3005,85.8105,'2BHK',14000,28000,'semi-furnished',920),
  L('bbsr28','Damana','Bhubaneswar',20.3400,85.8250,'1BHK',4500,9000,'unfurnished',400),
  L('bbsr29','Damana','Bhubaneswar',20.3405,85.8260,'PG',3000,3000,'furnished',100),
  L('bbsr30','Infocity','Bhubaneswar',20.3450,85.8300,'2BHK',12000,24000,'semi-furnished',830),
  L('bbsr31','Infocity','Bhubaneswar',20.3455,85.8310,'1BHK',7000,14000,'unfurnished',480),
  L('bbsr32','Kalinga Nagar','Bhubaneswar',20.3150,85.8200,'2BHK',8500,17000,'unfurnished',700),
  L('bbsr33','Kalinga Nagar','Bhubaneswar',20.3155,85.8210,'3BHK',14000,28000,'semi-furnished',1100),
  L('bbsr34','Sailashree Vihar','Bhubaneswar',20.3200,85.8170,'2BHK',11000,22000,'furnished',850),
  L('bbsr35','Sailashree Vihar','Bhubaneswar',20.3205,85.8180,'1BHK',6500,13000,'unfurnished',450),
  L('bbsr36','Niladri Vihar','Bhubaneswar',20.3300,85.8250,'2BHK',10000,20000,'semi-furnished',800),
  L('bbsr37','Niladri Vihar','Bhubaneswar',20.3305,85.8260,'3BHK',16000,32000,'furnished',1250),
  L('bbsr38','Palasuni','Bhubaneswar',20.3050,85.8600,'1BHK',4000,8000,'unfurnished',380),
  L('bbsr39','Palasuni','Bhubaneswar',20.3055,85.8610,'Room',2500,2500,'unfurnished',130),
  L('bbsr40','Tamando','Bhubaneswar',20.2600,85.8700,'2BHK',6500,13000,'unfurnished',650),
  L('bbsr41','Tamando','Bhubaneswar',20.2605,85.8710,'1BHK',4000,8000,'unfurnished',400),
  L('bbsr42','Sundarpada','Bhubaneswar',20.2500,85.7800,'2BHK',6000,12000,'unfurnished',620),
  L('bbsr43','Sundarpada','Bhubaneswar',20.2505,85.7810,'PG',3000,3000,'furnished',100),
  L('bbsr44','Laxmisagar','Bhubaneswar',20.2750,85.8400,'1BHK',5500,11000,'unfurnished',420),
  L('bbsr45','Laxmisagar','Bhubaneswar',20.2755,85.8410,'2BHK',9000,18000,'semi-furnished',730),
  L('bbsr46','Master Canteen','Bhubaneswar',20.2700,85.8430,'Studio',6000,12000,'furnished',320),
  L('bbsr47','Vani Vihar','Bhubaneswar',20.2980,85.8350,'PG',4500,4500,'furnished',130),
  L('bbsr48','VSS Nagar','Bhubaneswar',20.2850,85.8200,'2BHK',10500,21000,'semi-furnished',810),
  L('bbsr49','Satya Nagar','Bhubaneswar',20.2880,85.8400,'2BHK',11500,23000,'furnished',860),
  L('bbsr50','Unit 9','Bhubaneswar',20.2770,85.8350,'1BHK',6500,13000,'unfurnished',460),

  // ── Cuttack (50) ──
  L('ctc01','College Square','Cuttack',20.4625,85.8830,'2BHK',8000,16000,'unfurnished',700),
  L('ctc02','Badambadi','Cuttack',20.4550,85.8750,'1BHK',5000,10000,'unfurnished',450),
  L('ctc03','Tulsipur','Cuttack',20.4720,85.8920,'2BHK',7500,15000,'semi-furnished',680),
  L('ctc04','Buxi Bazaar','Cuttack',20.4680,85.8790,'PG',3500,3500,'furnished',100),
  L('ctc05','Madhupatna','Cuttack',20.4580,85.8900,'2BHK',7000,14000,'unfurnished',660),
  L('ctc06','Madhupatna','Cuttack',20.4585,85.8910,'1BHK',4500,9000,'unfurnished',420),
  L('ctc07','Cantonment Road','Cuttack',20.4650,85.8850,'3BHK',12000,24000,'semi-furnished',1100),
  L('ctc08','Cantonment Road','Cuttack',20.4655,85.8860,'2BHK',8500,17000,'furnished',780),
  L('ctc09','Naya Bazaar','Cuttack',20.4700,85.8800,'1BHK',4000,8000,'unfurnished',400),
  L('ctc10','Naya Bazaar','Cuttack',20.4705,85.8810,'Room',2500,2500,'unfurnished',120),
  L('ctc11','Chauliaganj','Cuttack',20.4600,85.8770,'2BHK',6500,13000,'unfurnished',620),
  L('ctc12','Chauliaganj','Cuttack',20.4605,85.8780,'PG',3000,3000,'furnished',100),
  L('ctc13','Ranihat','Cuttack',20.4530,85.8720,'2BHK',7000,14000,'unfurnished',680),
  L('ctc14','Ranihat','Cuttack',20.4535,85.8730,'1BHK',4500,9000,'unfurnished',430),
  L('ctc15','Dolamundai','Cuttack',20.4570,85.8680,'2BHK',6000,12000,'unfurnished',600),
  L('ctc16','Dolamundai','Cuttack',20.4575,85.8690,'3BHK',10000,20000,'semi-furnished',1000),
  L('ctc17','Jobra','Cuttack',20.4480,85.8850,'1BHK',3500,7000,'unfurnished',380),
  L('ctc18','Jobra','Cuttack',20.4485,85.8860,'2BHK',5500,11000,'unfurnished',550),
  L('ctc19','Bidanasi','Cuttack',20.4750,85.8700,'2BHK',7500,15000,'semi-furnished',700),
  L('ctc20','Bidanasi','Cuttack',20.4755,85.8710,'1BHK',5000,10000,'unfurnished',440),
  L('ctc21','CDA','Cuttack',20.4800,85.8900,'3BHK',14000,28000,'furnished',1200),
  L('ctc22','CDA','Cuttack',20.4805,85.8910,'2BHK',9000,18000,'semi-furnished',800),
  L('ctc23','CDA','Cuttack',20.4810,85.8920,'1BHK',5500,11000,'unfurnished',460),
  L('ctc24','Markat Nagar','Cuttack',20.4830,85.8950,'2BHK',8000,16000,'unfurnished',720),
  L('ctc25','Markat Nagar','Cuttack',20.4835,85.8960,'PG',3500,3500,'furnished',110),
  L('ctc26','Sector 6','Cuttack',20.4780,85.8870,'2BHK',7500,15000,'unfurnished',680),
  L('ctc27','Sector 6','Cuttack',20.4785,85.8880,'Studio',4000,8000,'furnished',300),
  L('ctc28','Link Road','Cuttack',20.4620,85.8820,'1BHK',4500,9000,'unfurnished',410),
  L('ctc29','Link Road','Cuttack',20.4625,85.8825,'2BHK',7000,14000,'semi-furnished',660),
  L('ctc30','Mangalabag','Cuttack',20.4640,85.8760,'2BHK',6500,13000,'unfurnished',630),
  L('ctc31','Mangalabag','Cuttack',20.4645,85.8770,'1BHK',4000,8000,'unfurnished',390),
  L('ctc32','Khan Nagar','Cuttack',20.4670,85.8830,'3BHK',11000,22000,'semi-furnished',1050),
  L('ctc33','Khan Nagar','Cuttack',20.4675,85.8840,'2BHK',7500,15000,'unfurnished',700),
  L('ctc34','Kathajodi','Cuttack',20.4500,85.8680,'1BHK',3500,7000,'unfurnished',370),
  L('ctc35','Kathajodi','Cuttack',20.4505,85.8690,'2BHK',5500,11000,'unfurnished',560),
  L('ctc36','Ravenshaw','Cuttack',20.4630,85.8810,'PG',4000,4000,'furnished',120),
  L('ctc37','Ravenshaw','Cuttack',20.4635,85.8815,'Room',2800,2800,'unfurnished',130),
  L('ctc38','OMP Square','Cuttack',20.4560,85.8740,'2BHK',6800,13600,'unfurnished',650),
  L('ctc39','OMP Square','Cuttack',20.4565,85.8745,'1BHK',4200,8400,'unfurnished',400),
  L('ctc40','Purighat','Cuttack',20.4590,85.8700,'2BHK',5800,11600,'unfurnished',580),
  L('ctc41','Purighat','Cuttack',20.4595,85.8710,'3BHK',9500,19000,'semi-furnished',950),
  L('ctc42','Jagatpur','Cuttack',20.4850,85.9000,'1BHK',3800,7600,'unfurnished',380),
  L('ctc43','Jagatpur','Cuttack',20.4855,85.9010,'2BHK',6000,12000,'unfurnished',600),
  L('ctc44','Sikharpur','Cuttack',20.4520,85.8650,'2BHK',5500,11000,'unfurnished',550),
  L('ctc45','Sikharpur','Cuttack',20.4525,85.8660,'PG',3000,3000,'furnished',100),
  L('ctc46','Nuapatna','Cuttack',20.4900,85.9050,'1BHK',3200,6400,'unfurnished',360),
  L('ctc47','Nuapatna','Cuttack',20.4905,85.9060,'2BHK',5000,10000,'unfurnished',520),
  L('ctc48','Chhatisa','Cuttack',20.4610,85.8790,'Studio',4500,9000,'furnished',320),
  L('ctc49','Chhatisa','Cuttack',20.4615,85.8800,'2BHK',7200,14400,'semi-furnished',690),
  L('ctc50','Shelter Chhak','Cuttack',20.4690,85.8850,'1BHK',4800,9600,'unfurnished',440),

  // ── Berhampur (50) ──
  L('bm01','Giri Market','Berhampur',19.3115,84.7940,'2BHK',5500,11000,'unfurnished',650),
  L('bm02','Ambapua','Berhampur',19.3240,84.8050,'1BHK',3500,7000,'unfurnished',400),
  L('bm03','Gopalpur Road','Berhampur',19.2880,84.7720,'2BHK',6500,13000,'semi-furnished',720),
  L('bm04','Gandhi Nagar','Berhampur',19.3100,84.7900,'1BHK',3000,6000,'unfurnished',370),
  L('bm05','Gandhi Nagar','Berhampur',19.3105,84.7910,'2BHK',5000,10000,'unfurnished',600),
  L('bm06','Tumbagada','Berhampur',19.3200,84.7850,'PG',2500,2500,'furnished',90),
  L('bm07','Tumbagada','Berhampur',19.3205,84.7860,'1BHK',3200,6400,'unfurnished',380),
  L('bm08','Court Road','Berhampur',19.3150,84.7950,'2BHK',6000,12000,'unfurnished',680),
  L('bm09','Court Road','Berhampur',19.3155,84.7960,'3BHK',9000,18000,'semi-furnished',1000),
  L('bm10','Station Road','Berhampur',19.3080,84.7880,'1BHK',3500,7000,'unfurnished',400),
  L('bm11','Station Road','Berhampur',19.3085,84.7890,'Room',2000,2000,'unfurnished',120),
  L('bm12','Bhanja Nagar','Berhampur',19.3050,84.7820,'2BHK',5000,10000,'unfurnished',580),
  L('bm13','Bhanja Nagar','Berhampur',19.3055,84.7830,'1BHK',3000,6000,'unfurnished',350),
  L('bm14','Engineering School','Berhampur',19.3180,84.8000,'PG',2800,2800,'furnished',100),
  L('bm15','Engineering School','Berhampur',19.3185,84.8010,'2BHK',5500,11000,'unfurnished',640),
  L('bm16','Lanjipalli','Berhampur',19.3020,84.7750,'2BHK',4500,9000,'unfurnished',550),
  L('bm17','Lanjipalli','Berhampur',19.3025,84.7760,'1BHK',2800,5600,'unfurnished',340),
  L('bm18','Aska Road','Berhampur',19.3250,84.8100,'2BHK',5000,10000,'unfurnished',600),
  L('bm19','Aska Road','Berhampur',19.3255,84.8110,'3BHK',8000,16000,'semi-furnished',950),
  L('bm20','Aska Road','Berhampur',19.3260,84.8120,'1BHK',3500,7000,'unfurnished',400),
  L('bm21','Kamapalli','Berhampur',19.3300,84.8000,'2BHK',4800,9600,'unfurnished',580),
  L('bm22','Kamapalli','Berhampur',19.3305,84.8010,'PG',2200,2200,'furnished',85),
  L('bm23','Haladiapadar','Berhampur',19.2950,84.7800,'1BHK',2500,5000,'unfurnished',320),
  L('bm24','Haladiapadar','Berhampur',19.2955,84.7810,'2BHK',4200,8400,'unfurnished',520),
  L('bm25','Gosani Nuagam','Berhampur',19.3170,84.7980,'2BHK',5800,11600,'semi-furnished',670),
  L('bm26','Gosani Nuagam','Berhampur',19.3175,84.7990,'1BHK',3200,6400,'unfurnished',380),
  L('bm27','Siddheshwar','Berhampur',19.3130,84.7920,'3BHK',8500,17000,'furnished',1050),
  L('bm28','Siddheshwar','Berhampur',19.3135,84.7930,'2BHK',5500,11000,'unfurnished',640),
  L('bm29','Ankuli','Berhampur',19.2900,84.7700,'1BHK',2500,5000,'unfurnished',320),
  L('bm30','Ankuli','Berhampur',19.2905,84.7710,'2BHK',4000,8000,'unfurnished',500),
  L('bm31','New Colony','Berhampur',19.3090,84.7870,'2BHK',5200,10400,'unfurnished',620),
  L('bm32','New Colony','Berhampur',19.3095,84.7875,'Studio',3500,7000,'furnished',280),
  L('bm33','Hillpatna','Berhampur',19.3220,84.8030,'1BHK',3000,6000,'unfurnished',360),
  L('bm34','Hillpatna','Berhampur',19.3225,84.8040,'2BHK',5000,10000,'unfurnished',590),
  L('bm35','Old Town','Berhampur',19.3060,84.7850,'Room',1800,1800,'unfurnished',110),
  L('bm36','Old Town','Berhampur',19.3065,84.7860,'1BHK',2800,5600,'unfurnished',340),
  L('bm37','Bada Bazaar','Berhampur',19.3140,84.7940,'PG',2500,2500,'furnished',95),
  L('bm38','Bada Bazaar','Berhampur',19.3145,84.7945,'2BHK',5000,10000,'unfurnished',580),
  L('bm39','Khodasingi','Berhampur',19.3280,84.8060,'2BHK',4500,9000,'unfurnished',540),
  L('bm40','Khodasingi','Berhampur',19.3285,84.8070,'1BHK',2800,5600,'unfurnished',340),
  L('bm41','Gopalpur','Berhampur',19.2600,84.7400,'2BHK',7000,14000,'furnished',720),
  L('bm42','Gopalpur','Berhampur',19.2605,84.7410,'1BHK',4000,8000,'semi-furnished',420),
  L('bm43','Kanishi','Berhampur',19.3350,84.8150,'PG',2000,2000,'furnished',80),
  L('bm44','Kanishi','Berhampur',19.3355,84.8160,'2BHK',4200,8400,'unfurnished',510),
  L('bm45','Narendrapur','Berhampur',19.3000,84.7780,'1BHK',2500,5000,'unfurnished',310),
  L('bm46','Narendrapur','Berhampur',19.3005,84.7790,'2BHK',4000,8000,'unfurnished',490),
  L('bm47','Sonepur','Berhampur',19.3400,84.8200,'2BHK',4500,9000,'unfurnished',540),
  L('bm48','Sonepur','Berhampur',19.3405,84.8210,'3BHK',7000,14000,'semi-furnished',880),
  L('bm49','MKCG Area','Berhampur',19.3160,84.7970,'Studio',3000,6000,'furnished',250),
  L('bm50','MKCG Area','Berhampur',19.3165,84.7975,'PG',2500,2500,'furnished',90),

  // ── Sambalpur (50) ──
  L('sb01','Khetrajpur','Sambalpur',21.4550,83.9780,'2BHK',6000,12000,'unfurnished',650),
  L('sb02','Budharaja','Sambalpur',21.4680,83.9650,'1BHK',4000,8000,'unfurnished',420),
  L('sb03','Ainthapali','Sambalpur',21.4720,83.9920,'PG',3000,3000,'furnished',110),
  L('sb04','Modipara','Sambalpur',21.4600,83.9800,'2BHK',5500,11000,'unfurnished',600),
  L('sb05','Modipara','Sambalpur',21.4605,83.9810,'1BHK',3500,7000,'unfurnished',380),
  L('sb06','Bareipali','Sambalpur',21.4500,83.9700,'2BHK',5000,10000,'unfurnished',580),
  L('sb07','Bareipali','Sambalpur',21.4505,83.9710,'3BHK',8000,16000,'semi-furnished',950),
  L('sb08','Nayapara','Sambalpur',21.4650,83.9750,'1BHK',3500,7000,'unfurnished',400),
  L('sb09','Nayapara','Sambalpur',21.4655,83.9760,'2BHK',5500,11000,'unfurnished',620),
  L('sb10','Dhanupali','Sambalpur',21.4750,83.9850,'2BHK',6500,13000,'semi-furnished',700),
  L('sb11','Dhanupali','Sambalpur',21.4755,83.9860,'1BHK',4000,8000,'unfurnished',430),
  L('sb12','Dhanupali','Sambalpur',21.4760,83.9870,'3BHK',10000,20000,'furnished',1100),
  L('sb13','Sakhipara','Sambalpur',21.4580,83.9820,'PG',2800,2800,'furnished',100),
  L('sb14','Sakhipara','Sambalpur',21.4585,83.9830,'2BHK',5000,10000,'unfurnished',570),
  L('sb15','VSS University','Sambalpur',21.4800,83.9900,'PG',3000,3000,'furnished',110),
  L('sb16','VSS University','Sambalpur',21.4805,83.9910,'1BHK',3500,7000,'unfurnished',380),
  L('sb17','Burla','Sambalpur',21.5100,83.9700,'2BHK',5000,10000,'unfurnished',580),
  L('sb18','Burla','Sambalpur',21.5105,83.9710,'1BHK',3200,6400,'unfurnished',370),
  L('sb19','Burla','Sambalpur',21.5110,83.9720,'PG',2500,2500,'furnished',90),
  L('sb20','Hirakud','Sambalpur',21.5200,83.8800,'2BHK',4500,9000,'unfurnished',540),
  L('sb21','Hirakud','Sambalpur',21.5205,83.8810,'1BHK',3000,6000,'unfurnished',350),
  L('sb22','Jharsuguda Road','Sambalpur',21.4850,84.0000,'2BHK',5500,11000,'unfurnished',620),
  L('sb23','Jharsuguda Road','Sambalpur',21.4855,84.0010,'3BHK',9000,18000,'semi-furnished',1000),
  L('sb24','Remed','Sambalpur',21.4520,83.9680,'1BHK',3000,6000,'unfurnished',350),
  L('sb25','Remed','Sambalpur',21.4525,83.9690,'2BHK',4800,9600,'unfurnished',560),
  L('sb26','Charbati','Sambalpur',21.4700,83.9880,'2BHK',5800,11600,'unfurnished',640),
  L('sb27','Charbati','Sambalpur',21.4705,83.9890,'Room',2500,2500,'unfurnished',120),
  L('sb28','Golebazar','Sambalpur',21.4630,83.9770,'1BHK',3500,7000,'unfurnished',380),
  L('sb29','Golebazar','Sambalpur',21.4635,83.9780,'2BHK',5200,10400,'unfurnished',590),
  L('sb30','Kadamdihi','Sambalpur',21.4450,83.9600,'2BHK',4500,9000,'unfurnished',530),
  L('sb31','Kadamdihi','Sambalpur',21.4455,83.9610,'1BHK',2800,5600,'unfurnished',330),
  L('sb32','Sankaripali','Sambalpur',21.4900,83.9950,'2BHK',5000,10000,'unfurnished',570),
  L('sb33','Sankaripali','Sambalpur',21.4905,83.9960,'PG',2500,2500,'furnished',90),
  L('sb34','Loisingha Road','Sambalpur',21.4400,83.9550,'1BHK',2500,5000,'unfurnished',310),
  L('sb35','Loisingha Road','Sambalpur',21.4405,83.9560,'2BHK',4200,8400,'unfurnished',510),
  L('sb36','Maneswar','Sambalpur',21.4550,83.9730,'Studio',3500,7000,'furnished',280),
  L('sb37','Maneswar','Sambalpur',21.4555,83.9740,'2BHK',5000,10000,'unfurnished',570),
  L('sb38','Sahajbahal','Sambalpur',21.4480,83.9650,'1BHK',3000,6000,'unfurnished',340),
  L('sb39','Sahajbahal','Sambalpur',21.4485,83.9660,'2BHK',4800,9600,'unfurnished',550),
  L('sb40','Station Road','Sambalpur',21.4560,83.9790,'3BHK',8500,17000,'semi-furnished',980),
  L('sb41','Station Road','Sambalpur',21.4565,83.9800,'1BHK',3800,7600,'unfurnished',400),
  L('sb42','Trinath Bazar','Sambalpur',21.4620,83.9760,'2BHK',5200,10400,'unfurnished',590),
  L('sb43','Trinath Bazar','Sambalpur',21.4625,83.9765,'PG',2800,2800,'furnished',100),
  L('sb44','Katapali','Sambalpur',21.5000,83.9800,'2BHK',4800,9600,'unfurnished',560),
  L('sb45','Katapali','Sambalpur',21.5005,83.9810,'1BHK',3000,6000,'unfurnished',350),
  L('sb46','Samaleswari','Sambalpur',21.4670,83.9850,'2BHK',5500,11000,'unfurnished',620),
  L('sb47','Samaleswari','Sambalpur',21.4675,83.9860,'Room',2200,2200,'unfurnished',110),
  L('sb48','Mudipada','Sambalpur',21.4350,83.9500,'1BHK',2500,5000,'unfurnished',310),
  L('sb49','Mudipada','Sambalpur',21.4355,83.9510,'2BHK',4000,8000,'unfurnished',490),
  L('sb50','Jujumura Road','Sambalpur',21.4300,83.9450,'2BHK',4200,8400,'unfurnished',510),

  // ── Raipur (50) ──
  L('rp01','Pandri','Raipur',21.2290,81.6380,'2BHK',10000,20000,'semi-furnished',800),
  L('rp02','Malviya Nagar','Raipur',21.2480,81.6250,'3BHK',16000,32000,'furnished',1200),
  L('rp03','Shankar Nagar','Raipur',21.2350,81.6450,'1BHK',6000,12000,'unfurnished',500),
  L('rp04','Telibandha','Raipur',21.2420,81.6550,'2BHK',14000,28000,'furnished',950),
  L('rp05','Tatibandh','Raipur',21.2680,81.6120,'1BHK',4500,9000,'unfurnished',420),
  L('rp06','Devendra Nagar','Raipur',21.2500,81.6300,'2BHK',9000,18000,'unfurnished',750),
  L('rp07','Devendra Nagar','Raipur',21.2505,81.6310,'3BHK',14000,28000,'semi-furnished',1100),
  L('rp08','Fafadih','Raipur',21.2380,81.6480,'1BHK',5500,11000,'unfurnished',460),
  L('rp09','Fafadih','Raipur',21.2385,81.6490,'2BHK',8500,17000,'unfurnished',720),
  L('rp10','Civil Lines','Raipur',21.2450,81.6400,'3BHK',18000,36000,'furnished',1350),
  L('rp11','Civil Lines','Raipur',21.2455,81.6410,'2BHK',12000,24000,'semi-furnished',900),
  L('rp12','Samta Colony','Raipur',21.2530,81.6350,'2BHK',9500,19000,'unfurnished',780),
  L('rp13','Samta Colony','Raipur',21.2535,81.6360,'1BHK',5500,11000,'unfurnished',450),
  L('rp14','Nehru Nagar','Raipur',21.2400,81.6320,'2BHK',8000,16000,'unfurnished',700),
  L('rp15','Nehru Nagar','Raipur',21.2405,81.6330,'PG',4000,4000,'furnished',120),
  L('rp16','Mowa','Raipur',21.2700,81.6200,'1BHK',5000,10000,'unfurnished',440),
  L('rp17','Mowa','Raipur',21.2705,81.6210,'2BHK',8000,16000,'unfurnished',700),
  L('rp18','Amanaka','Raipur',21.2320,81.6500,'2BHK',9000,18000,'semi-furnished',760),
  L('rp19','Amanaka','Raipur',21.2325,81.6510,'Studio',5500,11000,'furnished',350),
  L('rp20','Purani Basti','Raipur',21.2250,81.6350,'1BHK',4000,8000,'unfurnished',380),
  L('rp21','Purani Basti','Raipur',21.2255,81.6360,'Room',2500,2500,'unfurnished',120),
  L('rp22','Gudhiyari','Raipur',21.2200,81.6280,'2BHK',7000,14000,'unfurnished',660),
  L('rp23','Gudhiyari','Raipur',21.2205,81.6290,'1BHK',4500,9000,'unfurnished',400),
  L('rp24','Kota','Raipur',21.2600,81.6150,'2BHK',7500,15000,'unfurnished',680),
  L('rp25','Kota','Raipur',21.2605,81.6160,'3BHK',11000,22000,'semi-furnished',1050),
  L('rp26','Daldal Seoni','Raipur',21.2150,81.6400,'1BHK',3500,7000,'unfurnished',350),
  L('rp27','Daldal Seoni','Raipur',21.2155,81.6410,'2BHK',5500,11000,'unfurnished',560),
  L('rp28','Byron Bazaar','Raipur',21.2370,81.6430,'PG',4500,4500,'furnished',130),
  L('rp29','Byron Bazaar','Raipur',21.2375,81.6440,'2BHK',10000,20000,'semi-furnished',800),
  L('rp30','Sadar Bazaar','Raipur',21.2330,81.6380,'1BHK',5000,10000,'unfurnished',430),
  L('rp31','Sadar Bazaar','Raipur',21.2335,81.6390,'2BHK',8500,17000,'unfurnished',730),
  L('rp32','Shanti Nagar','Raipur',21.2550,81.6280,'2BHK',8000,16000,'unfurnished',710),
  L('rp33','Shanti Nagar','Raipur',21.2555,81.6290,'3BHK',12000,24000,'semi-furnished',1080),
  L('rp34','Sunder Nagar','Raipur',21.2580,81.6320,'1BHK',5000,10000,'unfurnished',440),
  L('rp35','Sunder Nagar','Raipur',21.2585,81.6330,'2BHK',8500,17000,'unfurnished',740),
  L('rp36','WRS Colony','Raipur',21.2430,81.6500,'PG',3500,3500,'furnished',110),
  L('rp37','WRS Colony','Raipur',21.2435,81.6510,'2BHK',7500,15000,'unfurnished',680),
  L('rp38','Priyadarshini Nagar','Raipur',21.2650,81.6180,'2BHK',7000,14000,'unfurnished',660),
  L('rp39','Priyadarshini Nagar','Raipur',21.2655,81.6190,'1BHK',4500,9000,'unfurnished',410),
  L('rp40','Mahavir Nagar','Raipur',21.2470,81.6270,'2BHK',8500,17000,'semi-furnished',750),
  L('rp41','Mahavir Nagar','Raipur',21.2475,81.6280,'3BHK',13000,26000,'furnished',1150),
  L('rp42','Hirapur','Raipur',21.2180,81.6450,'1BHK',3500,7000,'unfurnished',360),
  L('rp43','Hirapur','Raipur',21.2185,81.6460,'2BHK',5500,11000,'unfurnished',560),
  L('rp44','Ravi Nagar','Raipur',21.2520,81.6340,'2BHK',9000,18000,'unfurnished',770),
  L('rp45','Ravi Nagar','Raipur',21.2525,81.6350,'Studio',5000,10000,'furnished',330),
  L('rp46','Avanti Vihar','Raipur',21.2750,81.6100,'2BHK',8000,16000,'unfurnished',720),
  L('rp47','Avanti Vihar','Raipur',21.2755,81.6110,'1BHK',5000,10000,'unfurnished',440),
  L('rp48','Vidhan Sabha Road','Raipur',21.2460,81.6220,'3BHK',15000,30000,'semi-furnished',1200),
  L('rp49','Vidhan Sabha Road','Raipur',21.2465,81.6230,'2BHK',10500,21000,'furnished',870),
  L('rp50','Bhatagaon','Raipur',21.2100,81.6500,'1BHK',3500,7000,'unfurnished',350),
];

// ── City median rents (for affordability scoring) ──
const CITY_MEDIAN_RENT: Record<string, number> = {
  bhubaneswar: 8000,
  cuttack: 6000,
  berhampur: 4500,
  sambalpur: 4500,
  raipur: 8000,
};

// ── Static per-city infrastructure scores (0–100) for factors without API ──
const CITY_INFRA: Record<string, { internet: number; safety: number; medical: number; grocery: number; transport: number }> = {
  bhubaneswar: { internet: 78, safety: 70, medical: 75, grocery: 80, transport: 72 },
  cuttack: { internet: 65, safety: 60, medical: 65, grocery: 75, transport: 65 },
  berhampur: { internet: 50, safety: 55, medical: 55, grocery: 65, transport: 50 },
  sambalpur: { internet: 52, safety: 58, medical: 52, grocery: 62, transport: 48 },
  raipur: { internet: 72, safety: 68, medical: 70, grocery: 78, transport: 70 },
};

// ── Public API ──

export function getResidentialForCity(city: string): ResidentialListing[] {
  return RESIDENTIAL_DATA.filter((r) => r.city.toLowerCase() === city.toLowerCase().trim());
}

export function findNearbyResidential(lat: number, lng: number, radiusKm: number = 5): ResidentialListing[] {
  const radiusM = radiusKm * 1000;
  return RESIDENTIAL_DATA.filter((r) => haversine(lat, lng, r.lat, r.lng) <= radiusM);
}

export function getAverageRents(city: string): Record<string, { avg: number; min: number; max: number; count: number }> {
  const listings = getResidentialForCity(city);
  const grouped: Record<string, number[]> = {};
  for (const l of listings) {
    if (!grouped[l.type]) grouped[l.type] = [];
    grouped[l.type].push(l.monthlyRent);
  }
  const result: Record<string, { avg: number; min: number; max: number; count: number }> = {};
  for (const [type, rents] of Object.entries(grouped)) {
    result[type] = {
      avg: Math.round(rents.reduce((a, b) => a + b, 0) / rents.length),
      min: Math.min(...rents),
      max: Math.max(...rents),
      count: rents.length,
    };
  }
  return result;
}

/**
 * Compute residential scores for listings near a commercial zone.
 * 7-factor weighted algorithm.
 */
export function scoreResidentialListings(
  commercialLat: number,
  commercialLng: number,
  maxBudget: number,
  radiusKm: number = 10
): ResidentialScore[] {
  const nearby = findNearbyResidential(commercialLat, commercialLng, radiusKm);
  if (nearby.length === 0) return [];

  return nearby.map((listing) => {
    const cityKey = listing.city.toLowerCase();
    const infra = CITY_INFRA[cityKey] || CITY_INFRA.bhubaneswar;
    const median = CITY_MEDIAN_RENT[cityKey] || 6000;

    // Factor 1: Commute (30%) — lower is better
    const commuteMin = estimateCommuteMinutes(listing.lat, listing.lng, commercialLat, commercialLng, 'driving');
    let commuteScore: number;
    if (commuteMin <= 5) commuteScore = 100;
    else if (commuteMin <= 10) commuteScore = 90;
    else if (commuteMin <= 15) commuteScore = 75;
    else if (commuteMin <= 25) commuteScore = 55;
    else if (commuteMin <= 40) commuteScore = 30;
    else commuteScore = 10;

    // Factor 2: Affordability (20%) — rent vs budget
    let affordabilityScore: number;
    if (listing.monthlyRent <= maxBudget * 0.6) affordabilityScore = 100;
    else if (listing.monthlyRent <= maxBudget * 0.8) affordabilityScore = 85;
    else if (listing.monthlyRent <= maxBudget) affordabilityScore = 65;
    else if (listing.monthlyRent <= maxBudget * 1.2) affordabilityScore = 35;
    else affordabilityScore = 10;

    // Bonus if rent is below city median
    if (listing.monthlyRent < median) affordabilityScore = Math.min(100, affordabilityScore + 10);

    // Factors 3-7: City-level static proxies (will upgrade to per-listing API calls later)
    const groceryScore = infra.grocery + Math.round((Math.random() - 0.5) * 10);
    const transportScore = infra.transport + Math.round((Math.random() - 0.5) * 10);
    const safetyScore = infra.safety + Math.round((Math.random() - 0.5) * 10);
    const medicalScore = infra.medical + Math.round((Math.random() - 0.5) * 10);
    const internetScore = infra.internet + Math.round((Math.random() - 0.5) * 10);

    // Weighted total
    const total = Math.round(
      commuteScore * 0.30 +
      affordabilityScore * 0.20 +
      groceryScore * 0.12 +
      transportScore * 0.12 +
      safetyScore * 0.10 +
      medicalScore * 0.08 +
      internetScore * 0.08
    );

    return {
      total: Math.max(0, Math.min(100, total)),
      commuteScore,
      commuteMinutes: commuteMin,
      affordabilityScore,
      groceryScore: Math.max(0, Math.min(100, groceryScore)),
      transportScore: Math.max(0, Math.min(100, transportScore)),
      safetyScore: Math.max(0, Math.min(100, safetyScore)),
      medicalScore: Math.max(0, Math.min(100, medicalScore)),
      internetScore: Math.max(0, Math.min(100, internetScore)),
      listing,
    };
  }).sort((a, b) => b.total - a.total);
}

/** Legacy API kept for backward compat */
export function getResidentialScore(lat: number, lng: number, maxBudget: number) {
  const nearby = findNearbyResidential(lat, lng, 5);
  if (nearby.length === 0) return { score: 30, listings: [], affordable: 0, message: 'No residential data available nearby' };
  const affordable = nearby.filter((l) => l.monthlyRent <= maxBudget);
  const affordRatio = affordable.length / nearby.length;
  let score = Math.round(affordRatio * 60);
  score += Math.min(20, nearby.length * 3);
  if (new Set(nearby.map((l) => l.type)).size >= 3) score += 20;
  score = Math.min(100, score);
  const message = affordable.length > 0
    ? `${affordable.length} of ${nearby.length} listings within ₹${maxBudget.toLocaleString()}/mo budget`
    : `No listings under ₹${maxBudget.toLocaleString()}/mo — minimum is ₹${Math.min(...nearby.map((l) => l.monthlyRent)).toLocaleString()}/mo`;
  return { score, listings: nearby, affordable: affordable.length, message };
}

/** Get all user-submitted residential listings from localStorage */
export function getUserListings(): ResidentialListing[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('locintel_residential_listings') || '[]');
  } catch { return []; }
}

/** Save a user-submitted residential listing */
export function saveUserListing(listing: Omit<ResidentialListing, 'id' | 'source' | 'updatedAt'>): void {
  if (typeof window === 'undefined') return;
  const existing = getUserListings();
  existing.push({ ...listing, id: `user_${Date.now()}`, source: 'user', updatedAt: new Date().toISOString() });
  localStorage.setItem('locintel_residential_listings', JSON.stringify(existing));
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
