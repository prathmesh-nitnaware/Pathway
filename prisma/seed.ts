import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create a mock user
  const hashedPassword = await bcrypt.hash('password123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
    },
  })

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@pathway.com' },
    update: { role: 'ADMIN' },
    create: {
      email: 'admin@pathway.com',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  // Clear existing data
  await prisma.savedCollege.deleteMany()
  await prisma.review.deleteMany()
  await prisma.course.deleteMany()
  await prisma.college.deleteMany()

  // Create mock colleges
  const collegesData = [
    {
      name: 'Indian Institute of Technology (IIT) Bombay',
      location: 'Mumbai, Maharashtra',
      description: 'IIT Bombay is a public technical and research university, recognized worldwide as a leader in the field of engineering education and research.',
      fees: 230000,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      avgPackage: '21.8 LPA',
      highestPackage: '3.6 CPA',
      establishedYear: 1958,
    },
    {
      name: 'Indian Institute of Technology (IIT) Delhi',
      location: 'New Delhi, Delhi',
      description: 'IIT Delhi is one of the premier engineering institutes in India, known for its cutting-edge research and excellent placement records.',
      fees: 235000,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      avgPackage: '20.5 LPA',
      highestPackage: '2.5 CPA',
      establishedYear: 1961,
    },
    {
      name: 'National Institute of Technology (NIT) Trichy',
      location: 'Tiruchirappalli, Tamil Nadu',
      description: 'NIT Trichy is one of the top NITs in India, offering excellent academic programs and boasting a massive 800-acre campus.',
      fees: 175000,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      avgPackage: '12.5 LPA',
      highestPackage: '52.8 LPA',
      establishedYear: 1964,
    },
    {
      name: 'Delhi Technological University (DTU)',
      location: 'New Delhi, Delhi',
      description: 'DTU (formerly DCE) is a leading state university offering engineering and management programs with a strong tech culture.',
      fees: 219000,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      avgPackage: '15.1 LPA',
      highestPackage: '82 LPA',
      establishedYear: 1941,
    },
    {
      name: 'Vellore Institute of Technology (VIT)',
      location: 'Vellore, Tamil Nadu',
      description: 'VIT is a highly ranked private deemed university known for its massive student intake and diverse campus life.',
      fees: 295000,
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      avgPackage: '9.2 LPA',
      highestPackage: '1.02 CPA',
      establishedYear: 1984,
    },
    {
      name: 'College of Engineering Pune (COEP)',
      location: 'Pune, Maharashtra',
      description: 'COEP is an autonomous engineering college affiliated to Savitribai Phule Pune University. It is the third oldest engineering college in Asia.',
      fees: 135000,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      avgPackage: '11.3 LPA',
      highestPackage: '50.5 LPA',
      establishedYear: 1854,
    },
    {
      name: 'SRM Institute of Science and Technology',
      location: 'Chennai, Tamil Nadu',
      description: 'SRM is one of the top ranking private universities in India with over 52,000 full time students and more than 3200 faculty across all the campuses.',
      fees: 350000,
      rating: 4.1,
      image: 'https://images.unsplash.com/photo-1590402494587-44b71d7772f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      avgPackage: '7.5 LPA',
      highestPackage: '57 LPA',
      establishedYear: 1985,
    }
  ]

  for (const collegeData of collegesData) {
    const college = await prisma.college.create({
      data: {
        ...collegeData,
        courses: {
          create: [
            { courseName: 'Computer Science and Engineering', duration: '4 Years', fees: collegeData.fees },
            { courseName: 'Electrical Engineering', duration: '4 Years', fees: collegeData.fees },
            { courseName: 'Mechanical Engineering', duration: '4 Years', fees: collegeData.fees },
          ]
        },
        reviews: {
          create: [
            { userId: user.id, rating: 4.5, reviewText: 'Great campus and placement opportunities.' },
            { userId: user.id, rating: 5, reviewText: 'Top tier faculty and research.' }
          ]
        }
      }
    })
    console.log(`Created college: ${college.name}`)
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
