export const IMAGES = {
  hero: "../public/images/hero.webp",
  heroIcons: [],
  aboutIcon1: "../public/images/aboutus.png",
  aboutIcon2: "",
  visionIcon: "../public/images/aboutus2.png",
  aboutCentralGraphic: "/images/about/central-graphic.svg",
  flexflowComesIn: "../public/images/whyus.png",
  processDiagram: "../public/images/process.png",
  benefits: [
    "/images/benefits/reduced-costs.svg",
    "/images/benefits/efficiency-gains.svg",
    "/images/benefits/cloud-solutions.svg",
    "/images/benefits/accuracy-security.svg",
    "/images/benefits/sustainability.svg",
  ],
  partners: [
    { name: "Ibrahim Mohsen & Sons", logo: "/images/partners/ibrahim.png" },
    { name: "Hillside Hotel", logo: "/images/partners/hillside.png" },
    { name: "HEMA Trading & Construction", logo: "/images/partners/hema.png" },
    { name: "TAS", logo: "/images/partners/tas.png" },
    { name: "Lumora Spa Wellness Beauty", logo: "/images/partners/lumora.png" },
  ],
};

export const METRICS = [
  { value: 100, label: "Faster Processes", isPercent: true, prefix: "" },
  { value: 80, label: "Manual Work", isPercent: true, prefix: "-" },
  { value: 98, label: "Data Accuracy", isPercent: true, prefix: "" },
  { value: 100, label: "Scalability Ready", isPercent: true, prefix: "" },
];
export const SHOW_METRIC_LABELS = true;

export type ServiceCard = {
  title: string;
  description: string;
  images: string[];
};

export type Service = {
  slug: string;
  title: string;
  short: string;
  icon: string;
  color: string;
  sideTitle: string;
  sideCopy: string;
  heading: string;
  intro: string;
  cards: ServiceCard[];
  closing: string;
};

export const services: Service[] = [
  {
    slug: "erp-solutions",
    title: "ERP Solutions",
    short: "Intelligent ERP systems that connect finance, inventory, procurement, HR, sales, reporting, and operations into one centralized platform.",
    icon: "globe",
    color: "#20d6b3",
    sideTitle: "One Platform. Complete Business Control.",
    sideCopy: "Manage every part of your business from one intelligent platform. FlexFlow ERP connects finance, inventory, procurement, sales, HR, attendance, customer management, and reporting into a single system that delivers real-time visibility, smarter decisions, and faster operations.",
    heading: "Enterprise Resource Planning (ERP) Solutions Built Around Your Business",
    intro: "Every business operates differently, which is why FlexFlow ERP is fully customizable to your unique workflows. Whether you manage a retail store, hotel, construction company, factory, distributor, or service business, our platform centralizes your operations, automates repetitive tasks, and provides complete visibility across every department. With secure cloud access, intelligent dashboards, and local support, you can manage your business from anywhere with confidence.",
    cards: [
      {
        title: "Business Processes, Unified",
        description: "Connect Finance, HR, Inventory, Procurement, Sales, Projects, Attendance, CRM, and Operations in one centralized platform, eliminating duplicate work and giving every department access to the same real-time information.",
        images: ["/images/services/s1.jpeg"]
      },
      {
        title: "Automation That Saves Hours Every Day",
        description: "Automate purchase approvals, leave requests, quotations, invoices, payments, and internal processes with customizable workflows, instant notifications, and role-based approvals.",
        images: ["/images/services/s2.png"]
      },
      {
        title: "Real-Time Business Intelligence",
        description: "Monitor sales, inventory, cash flow, employee performance, branch activity, and financial reports in real time through interactive dashboards accessible from anywhere.",
        images: ["/images/services/s3.png"]
      }
    ],
    closing: "FlexFlow ERP is more than software; it is a long-term business platform. Designed around your operations and supported by our local team, it evolves with your business through continuous customization, training, upgrades, and dedicated support, helping you operate more efficiently today while preparing for future growth.",
  },
  {
    slug: "hotel-management",
    title: "Hotel Management Systems",
    short: "Complete hotel management with reservations, guest check-in, housekeeping, billing, restaurant integration, and real-time occupancy dashboards.",
    icon: "hotel",
    color: "#ff9f43",
    sideTitle: "Complete Hotel Operations, One Connected System",
    sideCopy: "Manage reservations, guests, rooms, billing, housekeeping, restaurant services, and daily operations from one centralized platform designed to improve efficiency, reduce errors, and enhance the guest experience.",
    heading: "Smart Hotel Management Built for Better Guest Experiences",
    intro: "FlexFlow Hotel Management Systems bring every part of your property together in one secure and easy-to-use platform. From room reservations and front-desk operations to housekeeping, restaurant billing, payments, and reporting, your team gains real-time visibility and complete control over daily activities.",
    cards: [
      {
        title: "Reservations, Rooms and Guest Management",
        description: "Manage room availability, bookings, guest profiles, check-ins, check-outs, payments, and booking history from one real-time dashboard, helping prevent double bookings and front-desk errors.",
        images: ["/images/services/s4.jpg"]
      },
      {
        title: "Integrated Restaurant and Guest Billing",
        description: "Connect restaurant POS, room service, minibar charges, events, and other guest services directly to the guest account for accurate billing and a smoother checkout experience.",
        images: ["/images/services/s5.webp"]
      },
      {
        title: "Housekeeping and Operational Control",
        description: "Track room cleaning status, maintenance requests, staff assignments, occupancy, revenue, and daily hotel performance through live dashboards and automated reports.",
        images: ["/images/services/s6.webp"]
      },
      {
        title: "Real-Time Reports and Management Insights",
        description: "Monitor occupancy rates, room revenue, outstanding balances, restaurant sales, guest activity, and overall property performance from anywhere.",
        images: ["/images/services/s7.jpg"]
      }
    ],
    closing: "Whether you operate a boutique hotel, guesthouse, resort, serviced apartment, or growing hospitality group, our system can be customized to your workflows and expanded as your business grows. FlexFlow also provides local implementation, staff training, continuous support, and future upgrades.",
  },
  {
    slug: "restaurant-pos",
    title: "Restaurant & POS Systems",
    short: "Fully integrated restaurant management with POS, kitchen display, table management, inventory tracking, and real-time sales reporting.",
    icon: "heart",
    color: "#4da3ff",
    sideTitle: "Connected Restaurant Operations",
    sideCopy: "From the dining table to the kitchen, cashier, inventory, and management, FlexFlow connects every part of your restaurant into one intelligent system that improves speed, accuracy, and customer experience.",
    heading: "Restaurant POS Built for Speed & Growth",
    intro: "Our Restaurant Management System combines POS, kitchen display, inventory, customer management, and reporting into one powerful platform. Every order, payment, and stock movement is synchronized instantly, giving you complete visibility over your business.",
    cards: [
      {
        title: "Smart Point of Sale",
        description: "Fast and intuitive POS software that processes dine-in, takeaway, delivery, and online orders while supporting multiple payment methods and instant receipt generation.",
        images: ["/images/services/s8.jpeg"]
      },
      {
        title: "Kitchen Display & Order Management",
        description: "Orders are sent instantly from the cashier to the kitchen display, reducing communication errors, improving preparation time, and ensuring every order is delivered accurately.",
        images: ["/images/services/3s.jpeg"]
      },
      {
        title: "Inventory & Recipe Control",
        description: "Automatically deduct ingredients after every sale, monitor stock levels in real time, manage suppliers, and receive low-stock alerts before items run out.",
        images: ["/images/services/4s.jpeg"]
      },
      {
        title: "Sales Analytics & Multi-Branch Management",
        description: "Track revenue, best-selling items, staff performance, and branch activity from a single dashboard with detailed reports accessible from anywhere.",
        images: ["/images/services/s9.jpeg"]
      }
    ],
    closing: "Whether you operate a café, restaurant, fast-food outlet, or multiple branches, FlexFlow helps you reduce waiting times, eliminate manual errors, monitor performance in real time, and serve customers with confidence.",
  },
  {
    slug: "retail-pos",
    title: "Retail POS & Multi-Branch Management",
    short: "Monitor sales, inventory, stock transfers, and business performance across every branch from a single cloud dashboard.",
    icon: "cart",
    color: "#c9e83c",
    sideTitle: "Retail Management Without Limits",
    sideCopy: "Manage every branch, product, customer, and transaction from one centralized platform with real-time stock, sales, and financial visibility.",
    heading: "Retail POS & Multi-Branch Control",
    intro: "FlexFlow connects all your stores into one intelligent retail platform. Monitor inventory, sales, transfers, staff performance, and customer activity across every branch in real time from anywhere.",
    cards: [
      {
        title: "Smart Retail POS",
        description: "Fast barcode scanning, instant invoicing, multiple payment methods, discounts, returns, and customer loyalty management — all designed for efficient checkout.",
        images: ["/images/services/s10.jpeg"]
      },
      {
        title: "Multi-Branch Inventory Management",
        description: "Track stock across every location, transfer products between branches, monitor warehouse levels, and receive low-stock alerts automatically.",
        images: ["/images/services/s11.webp"]
      },
      {
        title: "Executive Business Dashboard",
        description: "View real-time sales, profit, inventory valuation, branch performance, cashier activity, and financial reports from one centralized dashboard.",
        images: ["/images/services/s12.jpg"]
      }
    ],
    closing: "Whether you operate one shop or a nationwide retail chain, our solution gives you complete control over your business, helping you reduce losses, improve customer service, and make faster business decisions.",
  },
  {
    slug: "workforce-management",
    title: "Attendance & Workforce Management",
    short: "Face recognition, fingerprint attendance, payroll integration, overtime tracking, leave management, and workforce analytics.",
    icon: "user",
    color: "#b64cff",
    sideTitle: "Smarter Workforce Management",
    sideCopy: "Track employee attendance, working hours, overtime, leave, and workforce performance in real time through secure biometric and cloud-based technology.",
    heading: "Attendance & Workforce Management Simplified",
    intro: "Our Attendance & Workforce Management System combines biometric devices, mobile access, scheduling, leave management, and payroll-ready reporting into one centralized platform. Know exactly who is working, when they arrived, and how many hours they have completed.",
    cards: [
      {
        title: "Biometric Attendance Tracking",
        description: "Secure fingerprint, facial recognition, attendance with real-time synchronization across all locations, eliminating buddy punching and manual registers.",
        images: ["/images/services/s13.jpeg"]
      },
      {
        title: "Working Hours & Payroll Integration",
        description: "Automatically calculate working hours, overtime, lateness, absences, and leave balances with payroll-ready reports that reduce manual calculations and salary disputes.",
        images: ["/images/services/s14.jpg"]
      },
      {
        title: "Live Workforce Dashboard",
        description: "Monitor employee attendance, shift status, department performance, and workforce availability through real-time dashboards accessible from any device.",
        images: ["/images/services/s15.webp"]
      },
      {
        title: "Leave, Shifts & Employee Scheduling",
        description: "Manage employee shifts, leave requests, holidays, approvals, and workforce planning from one centralized platform with automated notifications and approval workflows.",
        images: ["/images/services/s16.jpg"]
      }
    ],
    closing: "Whether managing an office, factory, construction site, hotel, or retail chain, our solution improves accountability, eliminates time theft, reduces payroll errors, and provides managers with complete workforce visibility from anywhere.",
  },
  {
    slug: "manufacturing-erp",
    title: "Manufacturing & Factory ERP",
    short: "Track production from raw materials to finished goods with inventory control, costing, quality management, and production analytics.",
    icon: "gear",
    color: "#20d6b3",
    sideTitle: "Complete Factory Control",
    sideCopy: "Monitor production, raw materials, inventory, quality control, and finished goods from one integrated platform designed to improve efficiency and reduce manufacturing costs.",
    heading: "Manufacturing ERP for Smarter Production",
    intro: "Our Manufacturing ERP connects purchasing, inventory, production, quality control, warehouse management, and sales into one intelligent system. Track every stage of production in real time while reducing waste, improving planning, and increasing operational efficiency.",
    cards: [
      {
        title: "Production Planning & Work Orders",
        description: "Create production schedules, assign work orders, monitor production progress, and ensure manufacturing targets are achieved efficiently and on time.",
        images: ["/images/services/s17.png"]
      },
      {
        title: "Raw Material & Inventory Tracking",
        description: "Monitor raw material consumption, warehouse stock, supplier deliveries, and automatic inventory deductions throughout every production cycle.",
        images: ["/images/services/s18.png"]
      },
      {
        title: "Production Monitoring & Quality Control",
        description: "Track every production stage, monitor machine performance, record quality inspections, and identify bottlenecks before they impact productivity.",
        images: ["/images/services/s19.png"]
      },
      {
        title: "Finished Goods & Cost Analysis",
        description: "Automatically calculate production costs, monitor finished goods inventory, analyze profitability, and generate detailed manufacturing reports in real time.",
        images: ["/images/services/s20.png"]
      }
    ],
    closing: "Whether you manufacture food, beverages, construction materials, pharmaceuticals, consumer goods, or industrial products, our solution provides complete visibility from raw materials to finished products, helping you make faster and more informed production decisions.",
  },
  {
    slug: "business-automation",
    title: "Business Process Automation",
    short: "Automate approvals, purchasing, notifications, document workflows, and repetitive business processes.",
    icon: "cog",
    color: "#20c4e8",
    sideTitle: "Automate Everyday Workflows",
    sideCopy: "Replace repetitive manual tasks with intelligent workflows that automate approvals, notifications, document processing, and routine business operations.",
    heading: "Business Process Automation That Works for You",
    intro: "FlexFlow helps businesses automate repetitive processes across finance, HR, procurement, operations, sales, and customer service. Reduce paperwork, eliminate delays, and ensure every task reaches the right person at the right time — automatically.",
    cards: [
      {
        title: "Automated Approval Workflows",
        description: "Digitize approvals for purchases, payments, leave requests, expenses, and internal documents with configurable approval chains, notifications, and audit trails.",
        images: ["/images/services/s21.png"]
      },
      {
        title: "Smart Notifications & Task Management",
        description: "Automatically notify staff of pending tasks, upcoming deadlines, overdue approvals, and important business events via email, SMS, or WhatsApp.",
        images: ["/images/services/s22.png"]
      },
      {
        title: "Digital Forms & Document Automation",
        description: "Replace paper forms with secure digital workflows that collect, validate, route, and archive documents while reducing manual data entry.",
        images: ["/images/services/s23.png"]
      },
      {
        title: "Workflow Analytics & Performance Monitoring",
        description: "Track process completion times, approval bottlenecks, staff productivity, and workflow performance through real-time dashboards and detailed reports.",
        images: ["/images/services/s24.png"]
      }
    ],
    closing: "Whether approving purchase requests, tracking invoices, managing employee onboarding, or automating customer communications, our workflows improve efficiency, increase accountability, and allow your team to focus on higher-value work.",
  },
  {
    slug: "custom-software",
    title: "Custom Software Development",
    short: "Tailor-made business applications designed specifically around your unique workflows and requirements.",
    icon: "check",
    color: "#ffffff",
    sideTitle: "Software Built Around Your Business",
    sideCopy: "Every business is different. We design and develop custom software tailored to your unique processes, ensuring every feature works exactly the way your business needs.",
    heading: "Custom Software Without Compromise",
    intro: "FlexFlow develops secure, scalable, and fully customized software solutions that solve real business challenges. From internal business platforms and customer portals to industry-specific systems and mobile applications, every solution is built around your workflow — not the other way around.",
    cards: [
      {
        title: "Business Software Development",
        description: "Custom-built applications designed specifically for your business operations, replacing spreadsheets and manual processes with efficient digital solutions.",
        images: ["/images/services/s25.png"]
      },
      {
        title: "System Integration & APIs",
        description: "Connect your ERP, accounting software, payment gateways, biometric devices, websites, mobile apps, and third-party services into one seamless ecosystem.",
        images: ["/images/services/s26.png"]
      },
      {
        title: "Customer Portals & Mobile Applications",
        description: "Develop secure customer portals, staff dashboards, supplier platforms, and mobile applications that provide real-time access from anywhere.",
        images: ["/images/services/s27.png"]
      },
      {
        title: "Ongoing Support & Future Enhancements",
        description: "Unlike off-the-shelf software, your system evolves with your business through continuous updates, new features, performance improvements, and dedicated local support.",
        images: ["/images/services/s28.png"]
      }
    ],
    closing: "Whether you need a completely new system, integration with existing software, or additional features for an existing platform, our team works closely with you from planning and development to deployment, training, and continuous support.",
  }
];

export const challenges = [
  ["Still Managing Your Business on Paper?", "Paper records, notebooks, and spreadsheets slow your business, create costly mistakes, and make finding important information difficult."],
  ["Managing Multiple Branches?", "Keeping track of several stores, offices, hotels, or business locations becomes difficult without one centralized platform connecting everything in real time."],
  ["Hotel Reservations Becoming Difficult to Manage?", "Double bookings, manual reservations, guest records, room availability, and billing become increasingly difficult to manage as your hotel grows."],
  ["Struggling to Approve Requests Efficiently?", "Purchase requests, expenses, and approvals are delayed because they rely on paperwork, phone calls, or WhatsApp messages."],
  ["Production Difficult to Track?", "Monitor your entire manufacturing process; from raw materials and production to finished goods, wastage, and delivery, all from one integrated ERP system."],
  ["Retail Sales Difficult to Monitor?", "Gain real-time visibility into sales, inventory, cash flow, and performance across every branch or franchise from a single dashboard."],
  ["Restaurant Orders Getting Lost or Delayed?", "Poor communication between waiters, the kitchen, cashier, and management leads to delays, incorrect orders, and unhappy customers."],
  ["Too Much Time Spent on Repetitive Manual Work?", "Repetitive administrative tasks consume valuable hours that could be automated, allowing your team to focus on growing the business."],
  ["Losing Control of Inventory?", "Stock shortages, overstocking, and inaccurate inventory records impact profitability, customer satisfaction, and operational efficiency."],
  ["No Clear Business Reports?", "Without real-time dashboards and reports, business decisions rely on guesswork instead of accurate, up-to-date information."],
  ["Business Data at Risk?", "Paper files, outdated software, and local servers leave your business vulnerable to data loss, downtime, and unauthorized access."],
  ["No Visibility Into Staff Attendance?", "Without automated attendance tracking, it is difficult to monitor punctuality, overtime, working hours, absenteeism, and payroll accurately."],
];

export const processSteps = [
  ["Plan", "We define business goals, objectives, and timelines, aligning technical requirements with your operational needs for a clear roadmap."],
  ["Design", "Our creative team transforms ideas into intuitive, user-focused designs that merge innovation, usability, and aesthetic appeal."],
  ["Implement", "We bring your solution to life with seamless coding, smart integrations, and agile iterations that ensure adaptability and efficiency."],
  ["Test", "Rigorous quality assurance ensures performance, reliability, and security across every platform before deployment."],
  ["Deploy", "We handle full rollout and installation, managing cloud setup, hardware connections, and seamless live transitions."],
  ["Upkeep", "Our commitment continues beyond delivery with continuous support, updates, and performance monitoring to sustain long-term impact."],
];

export const CONTACT_FIELDS: Array<{ icons: string[]; label: string; value: string; icon: string }> = [
  { icons: ["pin", "location", "bi-geo-alt"], label: "Address", value: "Freetown, Sierra Leone", icon: "pin" },
  { icons: ["phone", "bi-telephone"], label: "Call Us", value: "+232 33 623820", icon: "phone" },
  { icons: ["mail", "bi-envelope"], label: "Email Us", value: "hussien@flexflowsl.com", icon: "mail" },
  { icons: ["whatsapp", "bi-whatsapp"], label: "WhatsApp", value: "https://wa.me/23233623820", icon: "whatsapp" },
];

export const SOCIAL_LINKS: Array<{ icon: string; name: string; fallback: string }> = [
  { icon: "whatsapp", name: "WhatsApp", fallback: "https://wa.me/23233623820" },
  { icon: "facebook", name: "Facebook", fallback: "https://www.facebook.com/" },
  { icon: "linkedin", name: "LinkedIn", fallback: "https://www.linkedin.com/" },
  { icon: "instagram", name: "Instagram", fallback: "https://www.instagram.com/" },
];
