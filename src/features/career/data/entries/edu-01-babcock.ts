import type { CareerEntry } from "../careerData";
import babcockLogo from "@/assets/career/edu-01/babcock-logo.png";
import img1 from "@/assets/career/edu-01/img1.png";
import img2 from "@/assets/career/edu-01/img2.webp";


const entry: CareerEntry = {
	id: "edu-01-babcock",
	type: "education",
	order: 1,

	title: "Bachelor of Science",
	organization: "Babcock University",
	degree: "Bachelor of Science",
	major: "Software Engineering",
	startDate: "Sep 2022",
	endDate: "Jul 2025",
	duration: "3 years",
	location: "Ogun State, Nigeria",
	cgpa: "4.32/5.0",

	icon: "🎓",
	image: `${babcockLogo}`,
	description:
		"Completed a rigorous Software Engineering degree at Babcock University, graduating with Second Class Upper Division. The programme covered the full engineering lifecycle — from systems design and algorithms to security, AI, and mobile development.",

	highlights: [
		"CGPA: 4.32/5.0 — Second Class Upper Division",
		"Strong performance in Network Security, HCI, and Software Quality Engineering",
		"Completed 6-credit Student Industrial Work Experience (SIWES) — Grade A",
		"Research Project (SENG490) completed with Grade A",
		"Coursework spanned AI, Database Admin, Reverse Engineering, and Open Source Systems",
	],

	gallery: [img1,img2],

	personalTake:
		"Babcock gave me more than a degree — it gave me discipline and breadth. From discrete maths to malware analysis, every module pushed me to think like an engineer, not just a coder. My final year especially sharpened my understanding of how software systems live in the real world.",
};

export default entry;
