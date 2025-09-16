const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function calculateSystemPrice(systemSizeKw) {
  return systemSizeKw * 1200;
}

function calculatePrincipal(systemPrice, downPayment) {
  return systemPrice - downPayment;
}

function determineRiskBand(monthlyConsumptionKwh, systemSizeKw) {
  if (monthlyConsumptionKwh >= 400 && systemSizeKw <= 6) return 'A';
  if (monthlyConsumptionKwh >= 250) return 'B';
  return 'C';
}

function getBaseApr(riskBand) {
  switch (riskBand) {
    case 'A':
      return 6.9;
    case 'B':
      return 8.9;
    case 'C':
      return 11.9;
    default:
      return 11.9;
  }
}

function calculateMonthlyPayment(principal, apr, termYears) {
  const monthlyRate = apr / 100 / 12;
  const months = termYears * 12;
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

async function main() {
  // Seed admin
  const adminEmail = 'admin@admin.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: adminHash, isAdmin: true },
    create: {
      fullName: 'Admin User',
      email: adminEmail,
      password: adminHash,
      isAdmin: true,
    },
  });

  console.log('Seeded admin:', admin.email);

  // New users
  const usersData = [
    { fullName: 'John Doe', email: 'john@example.com', password: 'password1' },
    {
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password2',
    },
  ];

  for (const userData of usersData) {
    const hash = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: { password: hash },
      create: {
        fullName: userData.fullName,
        email: userData.email,
        password: hash,
      },
    });

    console.log('Seeded user:', user.email);

    // Create 2 quotes for each user
    for (let i = 1; i <= 2; i++) {
      const monthlyConsumptionKwh = Math.floor(Math.random() * 400) + 100; // 100 - 500
      const systemSizeKw = Math.floor(Math.random() * 10) + 1; // 1 - 10 kW
      const downPayment = Math.floor(Math.random() * 5000); // 0 - 5000
      const systemPrice = calculateSystemPrice(systemSizeKw);
      const principalAmount = calculatePrincipal(systemPrice, downPayment);
      const riskBand = determineRiskBand(monthlyConsumptionKwh, systemSizeKw);
      const baseApr = getBaseApr(riskBand);

      // 3 offers with termYears 5,10,15 and APR as per baseApr
      const offers = [5, 10, 15].map((term) => ({
        termYears: term,
        apr: baseApr,
        principalUsed: principalAmount,
        monthlyPayment: parseFloat(
          calculateMonthlyPayment(principalAmount, baseApr, term).toFixed(2)
        ),
      }));

      const quote = await prisma.quote.create({
        data: {
          userId: user.id,
          fullName: user.fullName,
          email: user.email,
          address: `Address ${i}`,
          monthlyConsumptionKwh,
          systemSizeKw,
          downPayment,
          systemPrice,
          principalAmount,
          riskBand,
          offers,
        },
      });

      console.log(`Created quote ${i} for user ${user.email}:`, quote.id);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
