// Exact labels and IDs read from #missioncode_id on the public registration
// screen, before the applicant gate. Presence is not proof of entry eligibility.
export const PORTS_OBSERVED_AT = "2026-10-17";
export const PORTS_SOURCE =
  "https://indianvisaonline.gov.in/evisa/Registration";
export type ArrivalPort = {
  id: string;
  label: string;
  kind: "airport" | "seaport" | "landport";
  names: string[];
  code?: string;
  aliasSources: string[];
};
const observed = `I140|AGARTALA LANDPORT
I270|AGATTI SEAPORT
I022|AHMEDABAD AIRPORT
I298|ALANG SEAPORT
I032|AMRITSAR AIRPORT
I096|BAGDOGRA AIRPORT
I221|BEDI BANDAR SEAPORT
I085|BENGALURU AIRPORT
I203|BHAVNAGAR SEAPORT
I056|BHOGAPURAM AIRPORT
I027|BHOPAL AIRPORT
I084|BHUBANESHWAR AIRPORT
I010|CALICUT AIRPORT
I210|CALICUT SEAPORT
I005|CHANDIGARH AIRPORT
I008|CHENNAI AIRPORT
I208|CHENNAI SEAPORT
I024|COCHIN AIRPORT
I224|COCHIN SEAPORT
I094|COIMBATORE AIRPORT
I239|CUDDALORE SEAPORT
I217|DAHEJ SEAPORT
I132|DARRANGA LANDPORT
I130|DAWKI LANDPORT
I004|DELHI AIRPORT
I288|DHAMRA SEAPORT
I012|GAYA AIRPORT
I164|GEDE LANDPORT
I163|GHOJADANGA LANDPORT
I033|GOA AIRPORT(DABOLIM)
I034|GOA AIRPORT (MOPA)
I283|GOA SEAPORT
I019|GUWAHATI AIRPORT
I204|HALDIA SEAPORT
I162|HARIDASPUR LANDPORT
I229|HAZIRA SEAPORT
I041|HYDERABAD AIRPORT
I017|INDORE AIRPORT
I199|JAIGAON LANDPORT
I006|JAIPUR AIRPORT
I119|JOGBANI LANDPORT
I258|KAKINADA SEAPORT
I207|KAMARAJAR SEAPORT
I234|KANDLA SEAPORT
I030|KANNUR AIRPORT
I211|KARAIKAL SEAPORT
I209|KATTUPALI SEAPORT
I002|KOLKATA AIRPORT
I202|KOLKATA SEAPORT
I212|KOLLAM SEAPORT
I227|KRISHNAPATNAM SEAPORT
I021|LUCKNOW AIRPORT
I015|MADURAI AIRPORT
I272|MANDVI SEAPORT
I092|MANGALORE AIRPORT
I293|MANGALORE SEAPORT
I126|MOREH LANDPORT
I001|MUMBAI AIRPORT
I201|MUMBAI SEAPORT
I222|MUNDRA SEAPORT
I238|NAGAPATTINAM SEAPORT
I016|NAGPUR AIRPORT
I044|NAVI MUMBAI AIRPORT
I240|NHAVA SHEVA SEAPORT
I291|PARADEEP SEAPORT
I231|PIPAVAV SEAPORT
I220|PORBANDAR SEAPORT
I077|PORTBLAIR AIRPORT
I277|PORT BLAIR SEAPORT
I026|PUNE AIRPORT
I112|RAXAUL LANDPORT
I153|RUPAIDIHA LANDPORT
I218|SIKKA SEAPORT
I029|SURAT AIRPORT
I003|TIRUCHIRAPALLI AIRPORT
I042|TIRUPATI AIRPORT
I023|TRIVANDRUM AIRPORT
I219|TUNA TEKRA SEAPORT
I237|TUTICORIN SEAPORT
I223|VALLARPADAM SEAPORT
I007|VARANASI AIRPORT
I043|VIJAYAWADA AIRPORT
I025|VISHAKHAPATNAM AIRPORT
I225|VISHAKHAPATNAM SEAPORT
I228|VIZHINJAM INTERNATIONAL SEAPORT
I226|VIZHINJAM SEAPORT`;
const schedule =
  "https://www.aai.aero/sites/default/files/flight_schedule/Arrival_FLIGHT%20SCHEDULE.pdf";
const goa =
  "https://aim-india.aai.aero/eaip-v2-01-2025/pdf/Official%20AIC/AIC2023/AIC14_2023.pdf";
// Name/code relationships have separate primary sources from the portal labels.
export const portAliases: Record<
  string,
  { names: string[]; code: string; sources: string[] }
> = {
  I023: {
    names: [
      "Thiruvananthapuram",
      "Trivandrum",
      "Thiruvananthapuram International Airport",
    ],
    code: "TRV",
    sources: ["https://thiruvananthapuram.adaniairports.com/en/"],
  },
  I085: {
    names: [
      "Bengaluru",
      "Bangalore",
      "Kempegowda",
      "Kempegowda International Airport",
    ],
    code: "BLR",
    sources: ["https://www.bengaluruairport.com/"],
  },
  I024: {
    names: ["Kochi", "Cochin", "Cochin International Airport"],
    code: "COK",
    sources: ["https://www.cial.aero/About-Us"],
  },
  I010: {
    names: ["Kozhikode", "Calicut", "Calicut International Airport"],
    code: "CCJ",
    sources: [
      "https://www.aai.aero/sites/default/files/newspaper_articles_images/Airport_International_8.pdf",
    ],
  },
  I033: { names: ["Goa Dabolim", "Dabolim"], code: "GOI", sources: [goa] },
  I034: {
    names: ["Goa Mopa", "Mopa", "Manohar International Airport"],
    code: "GOX",
    sources: [goa, "https://www.miagoaairport.com/contact"],
  },
  I003: {
    names: [
      "Tiruchirappalli",
      "Trichy",
      "Tiruchirappalli International Airport",
    ],
    code: "TRZ",
    sources: [
      "https://aim-india.aai.aero/eaip-v2-06-2024/pdf/Official%20AIC/AIC2021/AIC_2021_04.pdf",
    ],
  },
  I092: {
    names: ["Mangaluru", "Mangalore", "Mangaluru International Airport"],
    code: "IXE",
    sources: [
      "https://mangaluru.adaniairports.com/en/",
      "https://aim-india.aai.aero/eaip-v2-01-2023/pdf/SUPs/AIPS_2022_177.pdf",
    ],
  },
  I008: {
    names: ["Chennai", "Madras"],
    code: "MAA",
    sources: [
      "https://www.incredibleindia.gov.in/en/tamil-nadu/chennai",
      schedule,
    ],
  },
  I001: {
    names: [
      "Mumbai",
      "Bombay",
      "Chhatrapati Shivaji Maharaj International Airport",
    ],
    code: "BOM",
    sources: [
      "https://mumbaicity.gov.in/en/about-district/",
      "https://www.incredibleindia.gov.in/en/maharashtra/mumbai/chhatrapati-shivaji-maharaj-terminus",
    ],
  },
  I002: {
    names: ["Kolkata", "Calcutta"],
    code: "CCU",
    sources: ["https://industry.wb.gov.in/state_profile.html", schedule],
  },
};
export const arrivalPorts: ArrivalPort[] = observed.split("\n").map((row) => {
  const [id, label] = row.split("|");
  const alias = portAliases[id];
  return {
    id,
    label,
    kind: label.includes("AIRPORT")
      ? "airport"
      : label.includes("SEAPORT")
        ? "seaport"
        : "landport",
    names: alias?.names ?? [],
    code: alias?.code,
    aliasSources: alias?.sources ?? [],
  };
});
