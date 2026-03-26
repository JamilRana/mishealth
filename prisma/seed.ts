import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // 1. Create Admin User
  const adminPassword = await bcrypt.hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@mis.dghs.gov.bd" },
    update: {},
    create: {
      email: "admin@mis.dghs.gov.bd",
      name: "MIS Administrator",
      password: adminPassword,
      role: Role.ADMIN,
    },
  })
  console.log("✅ Admin user created:", admin.email)

  // 2. Create Sample Projects
  const projects = [
    {
      titleEn: "Electronic Health Records (EHR)",
      titleBn: "ইলেকট্রনিক স্বাস্থ্য রেকর্ড (ইএইচআর)",
      slug: "ehr-project",
      descriptionEn: "A nationwide project to digitize patient health records for seamless healthcare access.",
      descriptionBn: "নির্বিঘ্ন স্বাস্থ্যসেবা প্রদানের লক্ষ্যে রোগীদের স্বাস্থ্য রেকর্ড ডিজিটাইজ করার একটি দেশব্যাপী প্রকল্প।",
      categoryEn: "Health Information Systems",
      categoryBn: "স্বাস্থ্য তথ্য ব্যবস্থা",
      status: "ONGOING",
      year: 2024,
      locationEn: "Nationwide",
      locationBn: "দেশব্যাপী",
    },
    {
      titleEn: "Telemedicine Platform",
      titleBn: "টেলিমেডিসিন প্ল্যাটফর্ম",
      slug: "telemedicine",
      descriptionEn: "Providing remote medical consultations across rural areas of Bangladesh.",
      descriptionBn: "বাংলাদেশের গ্রামীণ এলাকায় দূরবর্তী চিকিৎসকের পরামর্শ প্রদান।",
      categoryEn: "Digital Health Services",
      categoryBn: "ডিজিটাল স্বাস্থ্য সেবা",
      status: "COMPLETED",
      year: 2023,
      locationEn: "All Districts",
      locationBn: "সকল জেলা",
    },
  ]

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project,
    })
  }
  console.log("✅ Projects seeded")

  // 3. Create Sample Documents
  await prisma.document.create({
    data: {
      titleEn: "MIS National Strategy 2024-2029",
      titleBn: "এমআইএস জাতীয় কৌশল ২০২৪-২০২৯",
      categoryEn: "Policy",
      categoryBn: "নীতিমালা",
      year: 2024,
      fileUrl: "/uploads/mis-strategy.pdf",
      fileType: "PDF",
    },
  })
  console.log("✅ Documents seeded")
  
  // 4. Create Sample Employees
  const employees = [
    {
      nameEn: "Prof. Dr. Md. Shahadat Hossain",
      nameBn: "অধ্যাপক ডা. মোঃ শাহাদাত হোসেন",
      designationEn: "Director, MIS",
      designationBn: "পরিচালক, এমআইএস",
      phone: "+880 2-222222222",
      email: "director@mis.dghs.gov.bd",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
      responsibilitiesEn: "Directing the national health information system and coordinating digital health initiatives.",
      responsibilitiesBn: "জাতীয় স্বাস্থ্য তথ্য ব্যবস্থা পরিচালনা এবং ডিজিটাল স্বাস্থ্য উদ্যোগের সমন্বয় করা।",
      order: 1
    },
    {
      nameEn: "Dr. Faruk Hossain",
      nameBn: "ডা. ফারুক হোসেন",
      designationEn: "Senior Systems Analyst",
      designationBn: "সিনিয়র সিস্টেম অ্যানালিস্ট",
      phone: "+880 2-111111111",
      email: "faruk@mis.dghs.gov.bd",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
      responsibilitiesEn: "Analysing system requirements and overseeing the implementation of data-driven frameworks.",
      responsibilitiesBn: "সিস্টেমের প্রয়োজনীয়তা বিশ্লেষণ এবং ডেটা-চালিত ফ্রেমওয়ার্কের বাস্তবায়ন তদারকি করা।",
      order: 2
    }
  ]
  
  for (const employee of employees) {
    await prisma.employee.create({
      data: employee
    })
  }

  console.log("✅ Employees seeded")

  console.log("🏁 Seeding complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
